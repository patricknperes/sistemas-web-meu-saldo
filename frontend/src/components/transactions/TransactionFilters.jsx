import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownSLine,
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiFilter3Line,
    RiSearchLine,
} from "react-icons/ri";

import {
    getMonthName,
    months,
} from "../../utils/months.js";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function normalizeTotalItems(value) {
    const numberValue = Number(value);

    if (
        !Number.isFinite(numberValue) ||
        numberValue < 0
    ) {
        return 0;
    }

    return Math.trunc(numberValue);
}

function getPeriodLabel(
    filterMode,
    selectedMonth,
    selectedYear
) {
    if (filterMode === "MONTH") {
        return `${getMonthName(
            Number(selectedMonth)
        )} de ${selectedYear}`;
    }

    if (filterMode === "YEAR") {
        return `Ano de ${selectedYear}`;
    }

    return "Todo o histórico";
}

function SelectField({
    id,
    label,
    value,
    onChange,
    disabled = false,
    children,
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative min-w-0">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="
                        h-11 w-full
                        min-w-0
                        appearance-none
                        rounded-xl
                        border border-border
                        bg-background
                        py-2
                        pl-3.5 pr-10
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
                >
                    {children}
                </select>

                <RiArrowDownSLine
                    size={18}
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        right-3 top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                    "
                />
            </div>
        </div>
    );
}

function TransactionFilters({
    idPrefix = "transaction",

    searchTerm = "",
    totalItems = 0,

    filterMode = "MONTH",
    selectedMonth,
    selectedYear,

    disabled = false,

    onSearchChange,
    onApplyFilters,
}) {
    const currentDate = new Date();

    const currentMonth =
        currentDate.getMonth() + 1;

    const currentYear =
        currentDate.getFullYear();

    const dialogReference =
        useRef(null);

    const firstFieldReference =
        useRef(null);

    const previousActiveElementReference =
        useRef(null);

    const [
        modalOpen,
        setModalOpen,
    ] = useState(false);

    const [
        draftFilterMode,
        setDraftFilterMode,
    ] = useState(filterMode);

    const [
        draftMonth,
        setDraftMonth,
    ] = useState(
        Number(selectedMonth) ||
        currentMonth
    );

    const [
        draftYear,
        setDraftYear,
    ] = useState(
        String(
            selectedYear ||
            currentYear
        )
    );

    const [
        validationMessage,
        setValidationMessage,
    ] = useState("");

    const normalizedTotalItems =
        normalizeTotalItems(totalItems);

    const formattedTotalItems =
        new Intl.NumberFormat(
            "pt-BR"
        ).format(
            normalizedTotalItems
        );

    const periodLabel =
        getPeriodLabel(
            filterMode,
            selectedMonth,
            selectedYear
        );

    const hasPeriodFilter =
        filterMode !== "ALL";

    const showMonth =
        draftFilterMode === "MONTH";

    const showYear =
        draftFilterMode === "MONTH" ||
        draftFilterMode === "YEAR";

    useEffect(() => {
        if (!modalOpen) {
            return;
        }

        setDraftFilterMode(
            filterMode
        );

        setDraftMonth(
            Number(selectedMonth) ||
            currentMonth
        );

        setDraftYear(
            String(
                selectedYear ||
                currentYear
            )
        );

        setValidationMessage("");
    }, [
        modalOpen,
        filterMode,
        selectedMonth,
        selectedYear,
        currentMonth,
        currentYear,
    ]);

    useEffect(() => {
        if (!modalOpen) {
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
                    firstFieldReference
                        .current
                        ?.focus();
                }
            );

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setModalOpen(false);
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
                            "select:not(:disabled)",
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
    }, [modalOpen]);

    function openModal() {
        if (disabled) {
            return;
        }

        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setValidationMessage("");
    }

    function handleOverlayMouseDown(
        event
    ) {
        if (
            event.target ===
            event.currentTarget
        ) {
            closeModal();
        }
    }

    function handleSearchInput(
        event
    ) {
        onSearchChange?.(
            event.target.value
        );
    }

    function clearSearch() {
        onSearchChange?.("");
    }

    function handleResetDraft() {
        setDraftFilterMode("ALL");
        setDraftMonth(currentMonth);
        setDraftYear(
            String(currentYear)
        );

        setValidationMessage("");
    }

    function handleApplyFilters(
        event
    ) {
        event.preventDefault();

        const normalizedYear =
            Number(draftYear);

        if (
            showYear &&
            (
                !Number.isInteger(
                    normalizedYear
                ) ||
                normalizedYear <
                MIN_YEAR ||
                normalizedYear >
                MAX_YEAR
            )
        ) {
            setValidationMessage(
                `Informe um ano entre ${MIN_YEAR} e ${MAX_YEAR}.`
            );

            return;
        }

        onApplyFilters?.({
            filterMode:
                draftFilterMode,

            selectedMonth:
                Number(draftMonth),

            selectedYear:
                normalizedYear,
        });

        closeModal();
    }

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return (
        <>
            <section
                aria-label="Pesquisa e filtros"
                className="
                    w-full min-w-0
                    rounded-2xl
                    border border-border
                    bg-surface
                    p-4
                    shadow-card
                "
            >
                <div
                    className="
                        flex min-w-0
                        flex-col gap-3
                        md:flex-row
                        md:items-center
                    "
                >
                    <div
                        className="
                            relative
                            min-w-0 flex-1
                        "
                    >
                        <RiSearchLine
                            size={18}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                left-3.5 top-1/2
                                -translate-y-1/2
                                text-muted-foreground
                            "
                        />

                        <input
                            id={`${idPrefix}-search`}
                            type="search"
                            value={searchTerm}
                            onChange={
                                handleSearchInput
                            }
                            disabled={disabled}
                            autoComplete="off"
                            placeholder="Pesquisar pela descrição"
                            aria-label="Pesquisar pela descrição"
                            className="
                                h-11 w-full
                                min-w-0
                                rounded-xl
                                border border-border
                                bg-background
                                py-2
                                pl-10 pr-11
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

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={
                                    clearSearch
                                }
                                disabled={
                                    disabled
                                }
                                aria-label="Limpar pesquisa"
                                title="Limpar pesquisa"
                                className="
                                    absolute
                                    right-1.5 top-1/2
                                    inline-flex size-8
                                    -translate-y-1/2
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
                                    size={17}
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={openModal}
                        disabled={disabled}
                        aria-haspopup="dialog"
                        aria-expanded={
                            modalOpen
                        }
                        className={`
                            relative
                            inline-flex
                            min-h-11
                            w-full
                            shrink-0
                            items-center
                            justify-center
                            gap-2.5
                            rounded-xl
                            border
                            px-4
                            text-sm
                            font-medium
                            transition
                            disabled:pointer-events-none
                            disabled:opacity-50
                            md:w-auto

                            ${modalOpen
                                ? `
                                        border-primary
                                        bg-primary
                                        text-primary-foreground
                                    `
                                : `
                                        border-border
                                        bg-background
                                        text-foreground
                                        hover:border-border-strong
                                        hover:bg-surface-hover
                                    `
                            }
                        `}
                    >
                        <span className="relative">
                            <RiFilter3Line
                                size={18}
                                aria-hidden="true"
                            />

                            {hasPeriodFilter && (
                                <span
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        -right-1 -top-1
                                        size-2
                                        rounded-full
                                        border-2
                                        border-background
                                        bg-primary
                                    "
                                />
                            )}
                        </span>

                        <span>
                            Filtros
                        </span>

                        <span
                            aria-label={`${formattedTotalItems} itens encontrados`}
                            className={`
                                inline-flex
                                min-w-7
                                items-center
                                justify-center
                                rounded-full
                                px-2 py-0.5
                                text-xs
                                font-semibold

                                ${modalOpen
                                    ? `
                                            bg-white/15
                                            text-primary-foreground
                                        `
                                    : `
                                            bg-surface-muted
                                            text-muted-foreground
                                        `
                                }
                            `}
                        >
                            {formattedTotalItems}
                        </span>
                    </button>
                </div>

                <div
                    className="
                        mt-3
                        flex min-w-0
                        items-center gap-2
                        text-xs
                        text-muted-foreground
                    "
                >
                    <RiCalendarLine
                        size={14}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span className="truncate">
                        Período:{" "}
                        <strong
                            className="
                                font-medium
                                text-foreground
                            "
                        >
                            {periodLabel}
                        </strong>
                    </span>
                </div>
            </section>

            {createPortal(
                <AnimatePresence>
                    {modalOpen && (
                        <motion.div
                            key={`${idPrefix}-filter-modal`}
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
                                fixed inset-0
                                z-[200]
                                flex items-end
                                justify-center
                                bg-black/45
                                backdrop-blur-[2px]
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
                                aria-labelledby={`${idPrefix}-filter-title`}
                                initial={{
                                    opacity: 0,
                                    y: 24,
                                    scale: 0.985,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 18,
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
                                    flex
                                    max-h-[92dvh]
                                    w-full
                                    max-w-lg
                                    flex-col
                                    overflow-hidden
                                    rounded-t-2xl
                                    border border-border
                                    bg-surface
                                    text-foreground
                                    shadow-dialog
                                    sm:rounded-2xl
                                "
                            >
                                <form
                                    onSubmit={
                                        handleApplyFilters
                                    }
                                    className="
                                        flex min-h-0
                                        flex-1
                                        flex-col
                                    "
                                >
                                    <header
                                        className="
                                            flex min-w-0
                                            items-center
                                            gap-3
                                            border-b
                                            border-border
                                            px-4 py-4
                                            sm:px-5
                                        "
                                    >
                                        <span
                                            className="
                                                flex size-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-info-muted
                                                text-info
                                            "
                                        >
                                            <RiFilter3Line
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
                                            <h2
                                                id={`${idPrefix}-filter-title`}
                                                className="
                                                    truncate
                                                    text-base
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Filtrar período
                                            </h2>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                Escolha quais registros deseja visualizar.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                closeModal
                                            }
                                            aria-label="Fechar filtros"
                                            title="Fechar"
                                            className="
                                                inline-flex
                                                size-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-muted-foreground
                                                transition-colors
                                                hover:bg-surface-hover
                                                hover:text-foreground
                                            "
                                        >
                                            <RiCloseLine
                                                size={20}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </header>

                                    <div
                                        className="
                                            min-h-0
                                            flex-1
                                            overflow-y-auto
                                            px-4 py-5
                                            scrollbar-subtle
                                            sm:px-5
                                        "
                                    >
                                        <fieldset>
                                            <legend
                                                className="
                                                    mb-2
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                "
                                            >
                                                Visualização
                                            </legend>

                                            <div
                                                className="
                                                    grid gap-2
                                                    sm:grid-cols-3
                                                "
                                            >
                                                {[
                                                    {
                                                        value:
                                                            "MONTH",
                                                        label:
                                                            "Por mês",
                                                    },
                                                    {
                                                        value:
                                                            "YEAR",
                                                        label:
                                                            "Ano inteiro",
                                                    },
                                                    {
                                                        value:
                                                            "ALL",
                                                        label:
                                                            "Todo histórico",
                                                    },
                                                ].map(
                                                    (
                                                        option,
                                                        index
                                                    ) => {
                                                        const selected =
                                                            draftFilterMode ===
                                                            option.value;

                                                        return (
                                                            <button
                                                                key={
                                                                    option.value
                                                                }
                                                                ref={
                                                                    index ===
                                                                        0
                                                                        ? firstFieldReference
                                                                        : undefined
                                                                }
                                                                type="button"
                                                                onClick={() => {
                                                                    setDraftFilterMode(
                                                                        option.value
                                                                    );

                                                                    setValidationMessage(
                                                                        ""
                                                                    );
                                                                }}
                                                                aria-pressed={
                                                                    selected
                                                                }
                                                                className={`
                                                                    flex
                                                                    min-h-11
                                                                    items-center
                                                                    justify-between
                                                                    gap-2
                                                                    rounded-xl
                                                                    border
                                                                    px-3
                                                                    text-sm
                                                                    font-medium
                                                                    transition-colors

                                                                    ${selected
                                                                        ? `
                                                                                border-primary
                                                                                bg-primary
                                                                                text-primary-foreground
                                                                            `
                                                                        : `
                                                                                border-border
                                                                                bg-background
                                                                                text-foreground
                                                                                hover:bg-surface-hover
                                                                            `
                                                                    }
                                                                `}
                                                            >
                                                                <span className="truncate">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>

                                                                {selected && (
                                                                    <RiCheckLine
                                                                        size={
                                                                            17
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="shrink-0"
                                                                    />
                                                                )}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </fieldset>

                                        <AnimatePresence
                                            initial={false}
                                            mode="popLayout"
                                        >
                                            {(showMonth ||
                                                showYear) && (
                                                    <motion.div
                                                        key="period-fields"
                                                        initial={{
                                                            opacity: 0,
                                                            y: -6,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -6,
                                                        }}
                                                        transition={{
                                                            duration: 0.18,
                                                        }}
                                                        className="
                                                        mt-5
                                                        grid gap-4
                                                        sm:grid-cols-2
                                                    "
                                                    >
                                                        {showMonth && (
                                                            <SelectField
                                                                id={`${idPrefix}-draft-month`}
                                                                label="Mês"
                                                                value={
                                                                    draftMonth
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setDraftMonth(
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                disabled={
                                                                    disabled
                                                                }
                                                            >
                                                                {months.map(
                                                                    (
                                                                        month
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                month.value
                                                                            }
                                                                            value={
                                                                                month.value
                                                                            }
                                                                        >
                                                                            {
                                                                                month.label
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </SelectField>
                                                        )}

                                                        {showYear && (
                                                            <div
                                                                className={
                                                                    showMonth
                                                                        ? ""
                                                                        : "sm:col-span-2"
                                                                }
                                                            >
                                                                <label
                                                                    htmlFor={`${idPrefix}-draft-year`}
                                                                    className="
                                                                    mb-1.5
                                                                    block
                                                                    text-sm
                                                                    font-medium
                                                                    text-foreground
                                                                "
                                                                >
                                                                    Ano
                                                                </label>

                                                                <input
                                                                    id={`${idPrefix}-draft-year`}
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    min={
                                                                        MIN_YEAR
                                                                    }
                                                                    max={
                                                                        MAX_YEAR
                                                                    }
                                                                    step="1"
                                                                    value={
                                                                        draftYear
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) => {
                                                                        setDraftYear(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        );

                                                                        setValidationMessage(
                                                                            ""
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        disabled
                                                                    }
                                                                    placeholder="Digite o ano"
                                                                    className="
                                                                    h-11
                                                                    w-full
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
                                                        )}
                                                    </motion.div>
                                                )}
                                        </AnimatePresence>

                                        {validationMessage && (
                                            <p
                                                role="alert"
                                                className="
                                                    mt-3
                                                    text-xs
                                                    font-medium
                                                    text-danger
                                                "
                                            >
                                                {
                                                    validationMessage
                                                }
                                            </p>
                                        )}

                                        <div
                                            className="
                                                mt-5
                                                rounded-xl
                                                border border-border
                                                bg-background
                                                p-4
                                            "
                                        >
                                            <p
                                                className="
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                Resultado atual
                                            </p>

                                            <div
                                                className="
                                                    mt-1.5
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                "
                                            >
                                                <p
                                                    className="
                                                        min-w-0
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                    "
                                                >
                                                    {getPeriodLabel(
                                                        draftFilterMode,
                                                        draftMonth,
                                                        draftYear
                                                    )}
                                                </p>

                                                <span
                                                    className="
                                                        shrink-0
                                                        rounded-full
                                                        bg-surface-muted
                                                        px-2.5 py-1
                                                        text-xs
                                                        font-semibold
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        formattedTotalItems
                                                    }{" "}
                                                    {normalizedTotalItems ===
                                                        1
                                                        ? "item"
                                                        : "itens"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <footer
                                        className="
                                            flex
                                            flex-col-reverse
                                            gap-2
                                            border-t
                                            border-border
                                            px-4 py-4
                                            sm:flex-row
                                            sm:justify-between
                                            sm:px-5
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={
                                                handleResetDraft
                                            }
                                            disabled={
                                                disabled
                                            }
                                            className="
                                                inline-flex
                                                min-h-11
                                                w-full
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border border-border
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
                                            Limpar filtros
                                        </button>

                                        <div
                                            className="
                                                flex
                                                flex-col-reverse
                                                gap-2
                                                sm:flex-row
                                            "
                                        >
                                            <button
                                                type="button"
                                                onClick={
                                                    closeModal
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border border-border
                                                    bg-surface
                                                    px-4
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                    transition-colors
                                                    hover:bg-surface-hover
                                                    sm:w-auto
                                                "
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={
                                                    disabled
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    w-full
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
                                                <RiCheckLine
                                                    size={18}
                                                    aria-hidden="true"
                                                />

                                                Aplicar filtros
                                            </button>
                                        </div>
                                    </footer>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

export default TransactionFilters;