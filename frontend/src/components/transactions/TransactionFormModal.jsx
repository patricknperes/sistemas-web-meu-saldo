import {
    useEffect,
    useId,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiFileTextLine,
    RiInformationLine,
    RiLoader4Line,
    RiMoneyDollarCircleLine,
    RiPriceTag3Line,
    RiStickyNoteLine,
} from "react-icons/ri";

const TYPE_STYLES = {
    INCOME: {
        label: "Receita",
        icon: RiArrowUpLine,

        headerGradient:
            "from-emerald-500 via-emerald-600 to-teal-700",

        headerShadow:
            "shadow-emerald-500/20",

        softBackground:
            "bg-emerald-500/[0.055]",

        softBorder:
            "border-emerald-500/15",

        iconContainer:
            "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400",

        fieldFocus:
            "focus:border-emerald-500/55 focus:ring-emerald-500/10",

        amount:
            "text-emerald-600 dark:text-emerald-400",

        badge:
            "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",

        submitButton:
            "from-emerald-500 via-emerald-600 to-teal-700 shadow-emerald-500/25 hover:shadow-emerald-500/30 focus-visible:ring-emerald-500/25",
    },

    EXPENSE: {
        label: "Despesa",
        icon: RiArrowDownLine,

        headerGradient:
            "from-rose-500 via-rose-600 to-red-700",

        headerShadow:
            "shadow-rose-500/20",

        softBackground:
            "bg-rose-500/[0.055]",

        softBorder:
            "border-rose-500/15",

        iconContainer:
            "bg-rose-500/10 text-rose-600 ring-1 ring-inset ring-rose-500/15 dark:text-rose-400",

        fieldFocus:
            "focus:border-rose-500/55 focus:ring-rose-500/10",

        amount:
            "text-rose-600 dark:text-rose-400",

        badge:
            "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",

        submitButton:
            "from-rose-500 via-rose-600 to-red-700 shadow-rose-500/25 hover:shadow-rose-500/30 focus-visible:ring-rose-500/25",
    },
};

/*
 * O valor é armazenado no estado somente como
 * uma sequência de dígitos representando centavos.
 *
 * Exemplos:
 * "1"      -> R$ 0,01
 * "100"    -> R$ 1,00
 * "123456" -> R$ 1.234,56
 */
function normalizeAmountDigits(value) {
    return String(value ?? "")
        .replace(/\D/g, "")
        .replace(/^0+(?=\d)/, "");
}

function formatAmountInput(value) {
    const digits =
        normalizeAmountDigits(value);

    if (!digits) {
        return "";
    }

    const paddedValue =
        digits.padStart(3, "0");

    const integerPart =
        paddedValue
            .slice(0, -2)
            .replace(
                /^0+(?=\d)/,
                ""
            );

    const decimalPart =
        paddedValue.slice(-2);

    const formattedInteger =
        integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            "."
        );

    return `${formattedInteger},${decimalPart}`;
}

function FieldLabel({
    htmlFor,
    children,
    optional = false,
}) {
    return (
        <div
            className="
                mb-2
                flex min-w-0
                items-center
                justify-between
                gap-3
            "
        >
            <label
                htmlFor={htmlFor}
                className="
                    truncate
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                {children}
            </label>

            {optional && (
                <span
                    className="
                        shrink-0
                        text-[11px]
                        font-medium
                        text-muted-foreground
                    "
                >
                    Opcional
                </span>
            )}
        </div>
    );
}

function InputIcon({
    icon: Icon,
    styles,
}) {
    return (
        <span
            aria-hidden="true"
            className={`
                pointer-events-none
                absolute
                left-2 top-1/2
                flex size-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-xl

                ${styles.iconContainer}
            `}
        >
            <Icon size={16} />
        </span>
    );
}

function TransactionFormModal({
    open,
    type = "INCOME",
    editing = false,
    formData = {},
    submitting = false,
    onChange,
    onSubmit,
    onClose,
}) {
    const generatedId =
        useId();

    const dialogReference =
        useRef(null);

    const firstInputReference =
        useRef(null);

    const previousActiveElementReference =
        useRef(null);

    const onCloseReference =
        useRef(onClose);

    const submittingReference =
        useRef(submitting);

    useEffect(() => {
        onCloseReference.current =
            onClose;
    }, [onClose]);

    useEffect(() => {
        submittingReference.current =
            submitting;
    }, [submitting]);

    const normalizedType =
        type === "EXPENSE"
            ? "EXPENSE"
            : "INCOME";

    const styles =
        TYPE_STYLES[normalizedType];

    const isIncome =
        normalizedType === "INCOME";

    const transactionName =
        isIncome
            ? "receita"
            : "despesa";

    const title =
        editing
            ? `Editar ${transactionName}`
            : `Nova ${transactionName}`;

    const subtitle =
        editing
            ? `Revise e atualize os dados desta ${transactionName}.`
            : `Registre uma nova ${transactionName} para manter seu saldo atualizado.`;

    const submitLabel =
        editing
            ? "Salvar alterações"
            : `Cadastrar ${transactionName}`;

    const descriptionPlaceholder =
        isIncome
            ? "Ex.: Salário mensal"
            : "Ex.: Conta de energia";

    const categoryPlaceholder =
        isIncome
            ? "Ex.: Trabalho"
            : "Ex.: Moradia";

    const fieldPrefix =
        `${generatedId}-${normalizedType.toLowerCase()}`;

    const HeaderIcon =
        styles.icon;

    const formattedAmount =
        formatAmountInput(
            formData.amount
        );

    const amountPreview =
        formattedAmount
            ? `R$ ${formattedAmount}`
            : "R$ 0,00";

    const notesLength =
        String(
            formData.notes ?? ""
        ).length;

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        previousActiveElementReference.current =
            document.activeElement;

        const previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const focusFrame =
            window.requestAnimationFrame(
                () => {
                    firstInputReference
                        .current
                        ?.focus();
                }
            );

        function handleKeyDown(event) {
            if (
                event.key ===
                "Escape"
            ) {
                if (
                    !submittingReference.current
                ) {
                    onCloseReference
                        .current
                        ?.();
                }

                return;
            }

            if (
                event.key !==
                "Tab"
            ) {
                return;
            }

            const dialog =
                dialogReference.current;

            if (!dialog) {
                return;
            }

            const focusableElements =
                Array.from(
                    dialog.querySelectorAll(
                        [
                            "button:not(:disabled)",
                            "input:not(:disabled)",
                            "textarea:not(:disabled)",
                            "select:not(:disabled)",
                            "a[href]",
                            '[tabindex]:not([tabindex="-1"])',
                        ].join(",")
                    )
                );

            if (
                focusableElements.length ===
                0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length -
                1
                ];

            if (
                event.shiftKey &&
                document.activeElement ===
                firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement ===
                lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.cancelAnimationFrame(
                focusFrame
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousBodyOverflow;

            previousActiveElementReference
                .current
                ?.focus?.();
        };
    }, [open]);

    function handleClose() {
        if (submitting) {
            return;
        }

        onClose?.();
    }

    function handleOverlayMouseDown(
        event
    ) {
        if (
            event.target ===
            event.currentTarget &&
            !submitting
        ) {
            onClose?.();
        }
    }

    function handleFormSubmit(event) {
        if (submitting) {
            event.preventDefault();
            return;
        }

        onSubmit?.(event);
    }

    function handleAmountBeforeInput(
        event
    ) {
        const insertedValue =
            event.data;

        if (
            insertedValue ===
            null
        ) {
            return;
        }

        if (
            /\D/.test(
                insertedValue
            )
        ) {
            event.preventDefault();
        }
    }

    function handleAmountChange(
        event
    ) {
        const amountDigits =
            normalizeAmountDigits(
                event.target.value
            );

        onChange?.({
            target: {
                name: "amount",
                value: amountDigits,
            },
        });
    }

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="transaction-form-overlay"
                    role="presentation"
                    onMouseDown={
                        handleOverlayMouseDown
                    }
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="
                        fixed inset-0
                        z-[190]
                        flex items-end
                        justify-center
                        overflow-hidden
                        bg-slate-950/55
                        backdrop-blur-sm
                        sm:items-center
                        sm:p-5
                    "
                >
                    <motion.div
                        ref={
                            dialogReference
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${fieldPrefix}-title`}
                        aria-describedby={`${fieldPrefix}-subtitle`}
                        initial={{
                            opacity: 0,
                            y: 34,
                            scale: 0.975,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 24,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.27,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            flex
                            max-h-[94dvh]
                            w-full
                            max-w-2xl
                            flex-col
                            overflow-hidden
                            rounded-t-[30px]
                            border border-border
                            bg-surface
                            text-foreground
                            shadow-2xl
                            sm:max-h-[calc(100dvh-2.5rem)]
                            sm:rounded-[30px]
                        "
                    >
                        <form
                            onSubmit={
                                handleFormSubmit
                            }
                            className="
                                flex min-h-0
                                flex-1 flex-col
                            "
                        >
                            <header
                                className={`
                                    relative
                                    isolate
                                    shrink-0
                                    overflow-hidden
                                    bg-gradient-to-br
                                    px-5 py-5
                                    text-white
                                    shadow-xl
                                    sm:px-6
                                    sm:py-6

                                    ${styles.headerGradient}
                                    ${styles.headerShadow}
                                `}
                            >
                                <div
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        -right-12 -top-16
                                        size-40
                                        rounded-full
                                        bg-white/15
                                        blur-2xl
                                    "
                                />

                                <div
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        -bottom-20 left-1/3
                                        size-44
                                        rounded-full
                                        bg-black/10
                                        blur-3xl
                                    "
                                />

                                <div
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        right-16 top-5
                                        hidden size-24
                                        rounded-full
                                        border
                                        border-white/10
                                        sm:block
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        z-10
                                        flex min-w-0
                                        items-center
                                        gap-3.5
                                    "
                                >
                                    <span
                                        className="
                                            flex size-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-white/15
                                            text-white
                                            ring-1
                                            ring-inset
                                            ring-white/20
                                            backdrop-blur-sm
                                        "
                                    >
                                        <HeaderIcon
                                            size={23}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                rounded-full
                                                bg-white/15
                                                px-2.5 py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-white/85
                                                ring-1
                                                ring-inset
                                                ring-white/15
                                            "
                                        >
                                            {editing
                                                ? "Edição"
                                                : "Novo lançamento"
                                            }
                                        </span>

                                        <h2
                                            id={`${fieldPrefix}-title`}
                                            className="
                                                mt-2
                                                truncate
                                                text-xl
                                                font-semibold
                                                tracking-tight
                                                sm:text-2xl
                                            "
                                        >
                                            {title}
                                        </h2>

                                        <p
                                            id={`${fieldPrefix}-subtitle`}
                                            className="
                                                mt-1
                                                line-clamp-2
                                                max-w-lg
                                                text-sm
                                                leading-5
                                                text-white/75
                                            "
                                        >
                                            {subtitle}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleClose
                                        }
                                        disabled={
                                            submitting
                                        }
                                        aria-label="Fechar formulário"
                                        title="Fechar"
                                        className="
                                            inline-flex
                                            size-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-white/10
                                            text-white/80
                                            ring-1
                                            ring-inset
                                            ring-white/15
                                            transition
                                            hover:bg-white/20
                                            hover:text-white
                                            focus-visible:outline-none
                                            focus-visible:ring-4
                                            focus-visible:ring-white/15
                                            disabled:pointer-events-none
                                            disabled:opacity-40
                                        "
                                    >
                                        <RiCloseLine
                                            size={21}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </header>

                            <div
                                className="
                                    min-h-0
                                    flex-1
                                    overflow-y-auto
                                    px-4 py-5
                                    scrollbar-subtle
                                    sm:px-6
                                    sm:py-6
                                "
                            >
                                <motion.section
                                    initial={{
                                        opacity: 0,
                                        y: 8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay: 0.05,
                                        duration: 0.22,
                                    }}
                                    className={`
                                        relative
                                        overflow-hidden
                                        rounded-3xl
                                        border
                                        p-4
                                        sm:p-5

                                        ${styles.softBackground}
                                        ${styles.softBorder}
                                    `}
                                >
                                    <div
                                        aria-hidden="true"
                                        className="
                                            absolute
                                            -right-8 -top-10
                                            size-28
                                            rounded-full
                                            bg-current
                                            opacity-[0.035]
                                            blur-2xl
                                        "
                                    />

                                    <div
                                        className="
                                            relative
                                            flex
                                            min-w-0
                                            flex-col gap-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >
                                        <div
                                            className="
                                                flex min-w-0
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span
                                                className={`
                                                    flex size-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl

                                                    ${styles.iconContainer}
                                                `}
                                            >
                                                <RiMoneyDollarCircleLine
                                                    size={21}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.11em]
                                                        text-muted-foreground
                                                    "
                                                >
                                                    Valor do lançamento
                                                </p>

                                                <p
                                                    className={`
                                                        mt-0.5
                                                        truncate
                                                        text-2xl
                                                        font-semibold
                                                        tracking-tight
                                                        tabular-nums
                                                        sm:text-3xl

                                                        ${styles.amount}
                                                    `}
                                                    title={
                                                        amountPreview
                                                    }
                                                >
                                                    {
                                                        amountPreview
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`
                                                inline-flex
                                                shrink-0
                                                self-start
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                px-3 py-1.5
                                                text-xs
                                                font-semibold
                                                sm:self-auto

                                                ${styles.badge}
                                            `}
                                        >
                                            <HeaderIcon
                                                size={14}
                                                aria-hidden="true"
                                            />

                                            {styles.label}
                                        </span>
                                    </div>
                                </motion.section>

                                <section
                                    className="
                                        mt-5
                                        rounded-3xl
                                        border
                                        border-border
                                        bg-surface
                                        p-4
                                        sm:p-5
                                    "
                                >
                                    <div
                                        className="
                                            mb-5
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className={`
                                                flex size-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl

                                                ${styles.iconContainer}
                                            `}
                                        >
                                            <RiInformationLine
                                                size={17}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <div>
                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Informações principais
                                            </h3>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                Preencha os dados essenciais da movimentação.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            grid min-w-0
                                            gap-x-4 gap-y-5
                                            md:grid-cols-2
                                        "
                                    >
                                        <div className="min-w-0">
                                            <FieldLabel
                                                htmlFor={`${fieldPrefix}-description`}
                                            >
                                                Descrição
                                            </FieldLabel>

                                            <div className="relative min-w-0">
                                                <InputIcon
                                                    icon={
                                                        RiFileTextLine
                                                    }
                                                    styles={
                                                        styles
                                                    }
                                                />

                                                <input
                                                    ref={
                                                        firstInputReference
                                                    }
                                                    id={`${fieldPrefix}-description`}
                                                    name="description"
                                                    type="text"
                                                    value={
                                                        formData.description ??
                                                        ""
                                                    }
                                                    onChange={
                                                        onChange
                                                    }
                                                    required
                                                    minLength={
                                                        2
                                                    }
                                                    maxLength={
                                                        150
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    autoComplete="off"
                                                    placeholder={
                                                        descriptionPlaceholder
                                                    }
                                                    className={`
                                                        h-12 w-full
                                                        min-w-0
                                                        rounded-2xl
                                                        border
                                                        border-border
                                                        bg-background
                                                        py-2
                                                        pl-12 pr-4
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        placeholder:font-normal
                                                        placeholder:text-muted-foreground/65
                                                        hover:border-border-strong
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${styles.fieldFocus}
                                                    `}
                                                />
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <FieldLabel
                                                htmlFor={`${fieldPrefix}-amount`}
                                            >
                                                Valor
                                            </FieldLabel>

                                            <div className="relative min-w-0">
                                                <InputIcon
                                                    icon={
                                                        RiMoneyDollarCircleLine
                                                    }
                                                    styles={
                                                        styles
                                                    }
                                                />

                                                <input
                                                    id={`${fieldPrefix}-amount`}
                                                    name="amount"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={
                                                        formattedAmount
                                                    }
                                                    onBeforeInput={
                                                        handleAmountBeforeInput
                                                    }
                                                    onChange={
                                                        handleAmountChange
                                                    }
                                                    required
                                                    disabled={
                                                        submitting
                                                    }
                                                    autoComplete="off"
                                                    placeholder="0,00"
                                                    aria-label={`Valor da ${transactionName}`}
                                                    className={`
                                                        h-12 w-full
                                                        min-w-0
                                                        rounded-2xl
                                                        border
                                                        border-border
                                                        bg-background
                                                        py-2
                                                        pl-12 pr-4
                                                        text-sm
                                                        font-semibold
                                                        tabular-nums
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        placeholder:font-normal
                                                        placeholder:text-muted-foreground/65
                                                        hover:border-border-strong
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${styles.fieldFocus}
                                                    `}
                                                />
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <FieldLabel
                                                htmlFor={`${fieldPrefix}-category`}
                                            >
                                                Categoria
                                            </FieldLabel>

                                            <div className="relative min-w-0">
                                                <InputIcon
                                                    icon={
                                                        RiPriceTag3Line
                                                    }
                                                    styles={
                                                        styles
                                                    }
                                                />

                                                <input
                                                    id={`${fieldPrefix}-category`}
                                                    name="category"
                                                    type="text"
                                                    value={
                                                        formData.category ??
                                                        ""
                                                    }
                                                    onChange={
                                                        onChange
                                                    }
                                                    required
                                                    minLength={
                                                        2
                                                    }
                                                    maxLength={
                                                        80
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    autoComplete="off"
                                                    placeholder={
                                                        categoryPlaceholder
                                                    }
                                                    className={`
                                                        h-12 w-full
                                                        min-w-0
                                                        rounded-2xl
                                                        border
                                                        border-border
                                                        bg-background
                                                        py-2
                                                        pl-12 pr-4
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        placeholder:font-normal
                                                        placeholder:text-muted-foreground/65
                                                        hover:border-border-strong
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${styles.fieldFocus}
                                                    `}
                                                />
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <FieldLabel
                                                htmlFor={`${fieldPrefix}-date`}
                                            >
                                                Data
                                            </FieldLabel>

                                            <div className="relative min-w-0">
                                                <InputIcon
                                                    icon={
                                                        RiCalendarLine
                                                    }
                                                    styles={
                                                        styles
                                                    }
                                                />

                                                <input
                                                    id={`${fieldPrefix}-date`}
                                                    name="date"
                                                    type="date"
                                                    value={
                                                        formData.date ??
                                                        ""
                                                    }
                                                    onChange={
                                                        onChange
                                                    }
                                                    required
                                                    disabled={
                                                        submitting
                                                    }
                                                    className={`
                                                        h-12 w-full
                                                        min-w-0
                                                        rounded-2xl
                                                        border
                                                        border-border
                                                        bg-background
                                                        py-2
                                                        pl-12 pr-4
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        hover:border-border-strong
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${styles.fieldFocus}
                                                    `}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section
                                    className="
                                        mt-5
                                        rounded-3xl
                                        border
                                        border-border
                                        bg-surface
                                        p-4
                                        sm:p-5
                                    "
                                >
                                    <div
                                        className="
                                            mb-4
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className={`
                                                flex size-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl

                                                ${styles.iconContainer}
                                            `}
                                        >
                                            <RiStickyNoteLine
                                                size={17}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Observações
                                            </h3>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                Adicione detalhes que ajudem a identificar o lançamento.
                                            </p>
                                        </div>

                                        <span
                                            className="
                                                shrink-0
                                                rounded-full
                                                bg-surface-muted
                                                px-2.5 py-1
                                                text-[11px]
                                                font-semibold
                                                tabular-nums
                                                text-muted-foreground
                                            "
                                        >
                                            {notesLength}/500
                                        </span>
                                    </div>

                                    <label
                                        htmlFor={`${fieldPrefix}-notes`}
                                        className="sr-only"
                                    >
                                        Observações
                                    </label>

                                    <textarea
                                        id={`${fieldPrefix}-notes`}
                                        name="notes"
                                        value={
                                            formData.notes ??
                                            ""
                                        }
                                        onChange={
                                            onChange
                                        }
                                        maxLength={
                                            500
                                        }
                                        rows={4}
                                        disabled={
                                            submitting
                                        }
                                        placeholder="Ex.: Pagamento referente ao mês atual..."
                                        className={`
                                            w-full min-w-0
                                            resize-none
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-background
                                            px-4 py-3.5
                                            text-sm
                                            leading-6
                                            text-foreground
                                            outline-none
                                            transition
                                            placeholder:text-muted-foreground/65
                                            hover:border-border-strong
                                            focus:ring-4
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60

                                            ${styles.fieldFocus}
                                        `}
                                    />
                                </section>
                            </div>

                            <footer
                                className="
                                    flex shrink-0
                                    flex-col-reverse
                                    gap-2.5
                                    border-t border-border
                                    bg-surface
                                    px-4 py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-end
                                    sm:px-6
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        inline-flex
                                        min-h-11
                                        w-full min-w-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-border
                                        bg-surface
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-foreground
                                        transition
                                        hover:bg-surface-hover
                                        focus-visible:outline-none
                                        focus-visible:ring-4
                                        focus-visible:ring-ring/10
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                        sm:w-auto
                                    "
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    aria-busy={
                                        submitting
                                    }
                                    className={`
                                        inline-flex
                                        min-h-11
                                        w-full min-w-0
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-gradient-to-r
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        transition
                                        hover:-translate-y-0.5
                                        hover:shadow-xl
                                        focus-visible:outline-none
                                        focus-visible:ring-4
                                        disabled:pointer-events-none
                                        disabled:opacity-60
                                        sm:w-auto

                                        ${styles.submitButton}
                                    `}
                                >
                                    {submitting ? (
                                        <RiLoader4Line
                                            size={18}
                                            aria-hidden="true"
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <RiCheckLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    )}

                                    <span className="truncate">
                                        {submitting
                                            ? "Salvando..."
                                            : submitLabel
                                        }
                                    </span>
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default TransactionFormModal;