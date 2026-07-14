import {
    useEffect,
    useId,
    useRef,
} from "react";

import { createPortal } from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiCloseLine,
    RiLoader4Line,
} from "react-icons/ri";

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
    const digits = String(value ?? "")
        .replace(/\D/g, "")
        .replace(/^0+(?=\d)/, "");

    return digits;
}

function formatAmountInput(value) {
    const digits =
        normalizeAmountDigits(value);

    if (!digits) {
        return "";
    }

    const paddedValue =
        digits.padStart(3, "0");

    const integerPart = paddedValue
        .slice(0, -2)
        .replace(/^0+(?=\d)/, "");

    const decimalPart =
        paddedValue.slice(-2);

    const formattedInteger =
        integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            "."
        );

    return `${formattedInteger},${decimalPart}`;
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
    const generatedId = useId();

    const dialogReference = useRef(null);
    const firstInputReference = useRef(null);

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

    const isIncome =
        type === "INCOME";

    const transactionName =
        isIncome
            ? "receita"
            : "despesa";

    const title = editing
        ? `Editar ${transactionName}`
        : `Nova ${transactionName}`;

    const subtitle = editing
        ? `Atualize as informações da ${transactionName}.`
        : `Preencha os campos para cadastrar uma ${transactionName}.`;

    const submitLabel = editing
        ? "Salvar alterações"
        : `Cadastrar ${transactionName}`;

    const descriptionPlaceholder =
        isIncome
            ? "Ex.: Salário"
            : "Ex.: Conta de energia";

    const categoryPlaceholder =
        isIncome
            ? "Ex.: Trabalho"
            : "Ex.: Moradia";

    const fieldPrefix =
        `${generatedId}-${type.toLowerCase()}`;

    const Icon = isIncome
        ? RiArrowUpLine
        : RiArrowDownLine;

    const formattedAmount =
        formatAmountInput(
            formData.amount
        );

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
            if (event.key === "Escape") {
                if (
                    !submittingReference.current
                ) {
                    onCloseReference
                        .current
                        ?.();
                }

                return;
            }

            if (event.key !== "Tab") {
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
                focusableElements.length === 0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
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

        /*
         * Exclusões e comandos de navegação
         * normalmente possuem data nula.
         */
        if (insertedValue === null) {
            return;
        }

        /*
         * Bloqueia letras, sinais, espaços,
         * pontos e vírgulas digitados manualmente.
         * A própria máscara adiciona a formatação.
         */
        if (/\D/.test(insertedValue)) {
            event.preventDefault();
        }
    }

    function handleAmountChange(event) {
        const amountDigits =
            normalizeAmountDigits(
                event.target.value
            );

        /*
         * Mantém compatibilidade com o handleChange
         * genérico existente nas páginas.
         */
        onChange?.({
            target: {
                name: "amount",
                value: amountDigits,
            },
        });
    }

    if (
        typeof document === "undefined"
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
                        duration: 0.18,
                    }}
                    className="
                        fixed inset-0 z-[190]
                        flex items-end justify-center
                        overflow-hidden
                        bg-black/45
                        p-0
                        backdrop-blur-[2px]
                        sm:items-center
                        sm:p-5
                    "
                >
                    <motion.div
                        ref={dialogReference}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${fieldPrefix}-title`}
                        aria-describedby={`${fieldPrefix}-subtitle`}
                        initial={{
                            opacity: 0,
                            y: 28,
                            scale: 0.985,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.985,
                        }}
                        transition={{
                            duration: 0.22,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            flex max-h-[92dvh]
                            w-full max-w-2xl
                            flex-col overflow-hidden
                            rounded-t-2xl
                            border border-border
                            bg-surface
                            text-foreground
                            shadow-dialog
                            sm:max-h-[calc(100dvh-2.5rem)]
                            sm:rounded-2xl
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
                                className="
                                    flex min-w-0
                                    shrink-0
                                    items-center gap-3
                                    border-b border-border
                                    px-4 py-4
                                    sm:px-6
                                "
                            >
                                <span
                                    className={`
                                        flex size-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg

                                        ${isIncome
                                            ? "bg-success-muted text-success"
                                            : "bg-danger-muted text-danger"
                                        }
                                    `}
                                >
                                    <Icon
                                        size={18}
                                        aria-hidden="true"
                                    />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h2
                                        id={`${fieldPrefix}-title`}
                                        className="
                                            truncate
                                            text-base
                                            font-semibold
                                            tracking-tight
                                            text-foreground
                                        "
                                    >
                                        {title}
                                    </h2>

                                    <p
                                        id={`${fieldPrefix}-subtitle`}
                                        className="
                                            mt-0.5
                                            truncate
                                            text-xs
                                            text-muted-foreground
                                            sm:text-sm
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
                                        inline-flex size-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-muted-foreground
                                        transition-colors
                                        hover:bg-surface-hover
                                        hover:text-foreground
                                        disabled:pointer-events-none
                                        disabled:opacity-40
                                    "
                                >
                                    <RiCloseLine
                                        size={20}
                                    />
                                </button>
                            </header>

                            <div
                                className="
                                    min-h-0 flex-1
                                    overflow-y-auto
                                    px-4 py-5
                                    scrollbar-subtle
                                    sm:px-6
                                "
                            >
                                <div
                                    className="
                                        grid min-w-0
                                        gap-x-4 gap-y-5
                                        md:grid-cols-2
                                    "
                                >
                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`${fieldPrefix}-description`}
                                            className="
                                                mb-1.5
                                                block truncate
                                                text-sm
                                                font-medium
                                                text-foreground
                                            "
                                        >
                                            Descrição
                                        </label>

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
                                            className="
                                                h-11 w-full
                                                min-w-0
                                                rounded-xl
                                                border
                                                border-border
                                                bg-background
                                                px-3.5
                                                text-sm
                                                text-foreground
                                                outline-none
                                                transition
                                                placeholder:text-muted-foreground/70
                                                hover:border-border-strong
                                                focus:border-foreground/40
                                                focus:ring-2
                                                focus:ring-ring/15
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`${fieldPrefix}-amount`}
                                            className="
                                                mb-1.5
                                                block truncate
                                                text-sm
                                                font-medium
                                                text-foreground
                                            "
                                        >
                                            Valor
                                        </label>

                                        <div className="relative min-w-0">
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-3.5 top-1/2
                                                    -translate-y-1/2
                                                    text-sm
                                                    font-medium
                                                    text-muted-foreground
                                                "
                                            >
                                                R$
                                            </span>

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
                                                className="
                                                    h-11 w-full
                                                    min-w-0
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    py-2
                                                    pl-10 pr-3.5
                                                    text-sm
                                                    text-foreground
                                                    outline-none
                                                    transition
                                                    placeholder:text-muted-foreground/70
                                                    hover:border-border-strong
                                                    focus:border-foreground/40
                                                    focus:ring-2
                                                    focus:ring-ring/15
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-60
                                                "
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`${fieldPrefix}-category`}
                                            className="
                                                mb-1.5
                                                block truncate
                                                text-sm
                                                font-medium
                                                text-foreground
                                            "
                                        >
                                            Categoria
                                        </label>

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
                                            className="
                                                h-11 w-full
                                                min-w-0
                                                rounded-xl
                                                border
                                                border-border
                                                bg-background
                                                px-3.5
                                                text-sm
                                                text-foreground
                                                outline-none
                                                transition
                                                placeholder:text-muted-foreground/70
                                                hover:border-border-strong
                                                focus:border-foreground/40
                                                focus:ring-2
                                                focus:ring-ring/15
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`${fieldPrefix}-date`}
                                            className="
                                                mb-1.5
                                                block truncate
                                                text-sm
                                                font-medium
                                                text-foreground
                                            "
                                        >
                                            Data
                                        </label>

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
                                            className="
                                                h-11 w-full
                                                min-w-0
                                                rounded-xl
                                                border
                                                border-border
                                                bg-background
                                                px-3.5
                                                text-sm
                                                text-foreground
                                                outline-none
                                                transition
                                                hover:border-border-strong
                                                focus:border-foreground/40
                                                focus:ring-2
                                                focus:ring-ring/15
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        />
                                    </div>

                                    <div
                                        className="
                                            min-w-0
                                            md:col-span-2
                                        "
                                    >
                                        <div
                                            className="
                                                mb-1.5
                                                flex min-w-0
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <label
                                                htmlFor={`${fieldPrefix}-notes`}
                                                className="
                                                    min-w-0
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                "
                                            >
                                                Observações
                                            </label>

                                            <span
                                                className="
                                                    shrink-0
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                {
                                                    (
                                                        formData.notes ??
                                                        ""
                                                    )
                                                        .length
                                                }
                                                /500
                                            </span>
                                        </div>

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
                                            placeholder="Informações adicionais, se necessário"
                                            className="
                                                w-full min-w-0
                                                resize-none
                                                rounded-xl
                                                border
                                                border-border
                                                bg-background
                                                px-3.5 py-3
                                                text-sm
                                                leading-6
                                                text-foreground
                                                outline-none
                                                transition
                                                placeholder:text-muted-foreground/70
                                                hover:border-border-strong
                                                focus:border-foreground/40
                                                focus:ring-2
                                                focus:ring-ring/15
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        />
                                    </div>
                                </div>
                            </div>

                            <footer
                                className="
                                    flex shrink-0
                                    flex-col-reverse
                                    gap-2
                                    border-t border-border
                                    bg-surface
                                    px-4 py-4
                                    sm:flex-row
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
                                        px-4
                                        text-sm
                                        font-medium
                                        text-foreground
                                        transition-colors
                                        hover:bg-surface-hover
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
                                    className="
                                        inline-flex
                                        min-h-11
                                        w-full min-w-0
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-primary
                                        px-5
                                        text-sm
                                        font-medium
                                        text-primary-foreground
                                        transition-colors
                                        hover:bg-primary-hover
                                        disabled:pointer-events-none
                                        disabled:opacity-60
                                        sm:w-auto
                                    "
                                >
                                    {submitting && (
                                        <RiLoader4Line
                                            size={18}
                                            aria-hidden="true"
                                            className="animate-spin"
                                        />
                                    )}

                                    <span className="truncate">
                                        {submitting
                                            ? "Salvando..."
                                            : submitLabel}
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