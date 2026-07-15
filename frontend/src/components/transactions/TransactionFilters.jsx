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
    RiArrowLeftSLine,
    RiArrowRightSLine,
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
const YEARS_PER_PAGE = 12;

const FILTER_OPTIONS = [
    {
        value: "MONTH",
        label: "Por mês",
        description:
            "Visualize apenas um mês específico.",
    },
    {
        value: "YEAR",
        label: "Ano inteiro",
        description:
            "Veja todas as movimentações do ano.",
    },
    {
        value: "ALL",
        label: "Todo histórico",
        description:
            "Consulte todos os registros cadastrados.",
    },
];

function normalizeTotalItems(value) {
    const numberValue =
        Number(value);

    if (
        !Number.isFinite(numberValue) ||
        numberValue < 0
    ) {
        return 0;
    }

    return Math.trunc(numberValue);
}

function normalizeYear(
    value,
    fallback = new Date().getFullYear()
) {
    const numberValue =
        Number(value);

    if (
        !Number.isInteger(numberValue)
    ) {
        return fallback;
    }

    return Math.min(
        Math.max(
            numberValue,
            MIN_YEAR
        ),
        MAX_YEAR
    );
}

function getYearPageStart(year) {
    const normalizedYear =
        normalizeYear(year);

    const pageIndex =
        Math.floor(
            (
                normalizedYear -
                MIN_YEAR
            ) /
            YEARS_PER_PAGE
        );

    return Math.min(
        MIN_YEAR +
        pageIndex *
        YEARS_PER_PAGE,
        MAX_YEAR -
        YEARS_PER_PAGE +
        1
    );
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
                    mb-2
                    block
                    text-sm
                    font-semibold
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
                        h-12 w-full
                        min-w-0
                        appearance-none
                        rounded-2xl
                        border border-border
                        bg-background
                        py-2
                        pl-4 pr-11
                        text-sm
                        font-medium
                        text-foreground
                        outline-none
                        transition
                        hover:border-blue-500/35
                        focus:border-blue-500/60
                        focus:ring-4
                        focus:ring-blue-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {children}
                </select>

                <RiArrowDownSLine
                    size={19}
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        right-3.5 top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                    "
                />
            </div>
        </div>
    );
}

function YearPickerTrigger({
    id,
    value,
    open,
    disabled,
    onToggle,
}) {
    return (
        <div className="min-w-0">
            <label
                id={`${id}-label`}
                className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                Ano
            </label>

            <button
                id={id}
                type="button"
                onClick={onToggle}
                disabled={disabled}
                aria-labelledby={`${id}-label ${id}`}
                aria-haspopup="dialog"
                aria-expanded={open}
                className={`
                    inline-flex
                    h-12 w-full
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    rounded-2xl
                    border
                    bg-background
                    px-4
                    text-sm
                    font-semibold
                    text-foreground
                    outline-none
                    transition
                    hover:border-blue-500/35
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    ${open
                        ? `
                                border-blue-500/60
                                ring-4
                                ring-blue-500/10
                            `
                        : `
                                border-border
                            `
                    }
                `}
            >
                <span
                    className="
                        flex min-w-0
                        items-center gap-2.5
                    "
                >
                    <span
                        className="
                            flex size-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-500/10
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        <RiCalendarLine
                            size={17}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="truncate">
                        {value}
                    </span>
                </span>

                <RiArrowDownSLine
                    size={19}
                    aria-hidden="true"
                    className={`
                        shrink-0
                        text-muted-foreground
                        transition-transform
                        duration-200

                        ${open
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />
            </button>
        </div>
    );
}

function YearPickerPanel({
    open,
    currentYear,
    selectedYear,
    visibleStartYear,
    panelReference,
    onSelectYear,
    onPreviousYears,
    onNextYears,
}) {
    const visibleYears =
        Array.from(
            {
                length:
                    YEARS_PER_PAGE,
            },
            (_, index) =>
                visibleStartYear +
                index
        ).filter(
            (year) =>
                year >= MIN_YEAR &&
                year <= MAX_YEAR
        );

    const previousDisabled =
        visibleStartYear <=
        MIN_YEAR;

    const nextDisabled =
        visibleStartYear +
        YEARS_PER_PAGE -
        1 >=
        MAX_YEAR;

    return (
        <AnimatePresence
            initial={false}
        >
            {open && (
                <motion.div
                    ref={panelReference}
                    role="dialog"
                    aria-label="Selecionar ano"
                    initial={{
                        opacity: 0,
                        height: 0,
                        y: -8,
                    }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        height: 0,
                        y: -8,
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
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            mt-4
                            rounded-3xl
                            border
                            border-blue-500/15
                            bg-gradient-to-b
                            from-blue-500/[0.07]
                            to-transparent
                            p-3
                            sm:p-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    onPreviousYears
                                }
                                disabled={
                                    previousDisabled
                                }
                                aria-label="Mostrar anos anteriores"
                                className="
                                    inline-flex size-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    text-muted-foreground
                                    transition
                                    hover:border-blue-500/25
                                    hover:bg-blue-500/5
                                    hover:text-blue-600
                                    focus-visible:outline-none
                                    focus-visible:ring-4
                                    focus-visible:ring-blue-500/10
                                    disabled:pointer-events-none
                                    disabled:opacity-30
                                    dark:hover:text-blue-400
                                "
                            >
                                <RiArrowLeftSLine
                                    size={20}
                                    aria-hidden="true"
                                />
                            </button>

                            <div className="text-center">
                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-muted-foreground
                                    "
                                >
                                    Período disponível
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {visibleYears[0]}
                                    {" — "}
                                    {
                                        visibleYears[
                                        visibleYears.length -
                                        1
                                        ]
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onNextYears
                                }
                                disabled={
                                    nextDisabled
                                }
                                aria-label="Mostrar próximos anos"
                                className="
                                    inline-flex size-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    text-muted-foreground
                                    transition
                                    hover:border-blue-500/25
                                    hover:bg-blue-500/5
                                    hover:text-blue-600
                                    focus-visible:outline-none
                                    focus-visible:ring-4
                                    focus-visible:ring-blue-500/10
                                    disabled:pointer-events-none
                                    disabled:opacity-30
                                    dark:hover:text-blue-400
                                "
                            >
                                <RiArrowRightSLine
                                    size={20}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-3
                                gap-2
                                sm:grid-cols-4
                            "
                        >
                            {visibleYears.map(
                                (year) => {
                                    const isSelected =
                                        year ===
                                        selectedYear;

                                    const isCurrent =
                                        year ===
                                        currentYear;

                                    return (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() =>
                                                onSelectYear(
                                                    year
                                                )
                                            }
                                            aria-pressed={
                                                isSelected
                                            }
                                            className={`
                                                relative
                                                min-h-11
                                                rounded-xl
                                                border
                                                px-2
                                                text-sm
                                                font-semibold
                                                tabular-nums
                                                transition
                                                focus-visible:outline-none
                                                focus-visible:ring-4
                                                focus-visible:ring-blue-500/10

                                                ${isSelected
                                                    ? `
                                                            border-blue-600
                                                            bg-gradient-to-br
                                                            from-blue-600
                                                            to-indigo-600
                                                            text-white
                                                            shadow-lg
                                                            shadow-blue-500/20
                                                        `
                                                    : `
                                                            border-border
                                                            bg-surface
                                                            text-foreground
                                                            hover:-translate-y-0.5
                                                            hover:border-blue-500/25
                                                            hover:bg-blue-500/5
                                                            hover:text-blue-600
                                                            dark:hover:text-blue-400
                                                        `
                                                }
                                            `}
                                        >
                                            {year}

                                            {isCurrent &&
                                                !isSelected && (
                                                    <span
                                                        aria-label="Ano atual"
                                                        className="
                                                            absolute
                                                            bottom-1.5
                                                            left-1/2
                                                            size-1
                                                            -translate-x-1/2
                                                            rounded-full
                                                            bg-blue-500
                                                        "
                                                    />
                                                )}
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                onSelectYear(
                                    currentYear
                                )
                            }
                            className="
                                mt-3
                                inline-flex
                                min-h-10 w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border border-blue-500/15
                                bg-blue-500/5
                                px-4
                                text-sm
                                font-semibold
                                text-blue-600
                                transition
                                hover:bg-blue-500/10
                                focus-visible:outline-none
                                focus-visible:ring-4
                                focus-visible:ring-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            <RiCalendarLine
                                size={16}
                                aria-hidden="true"
                            />

                            Selecionar o ano atual
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function TransactionFilters({
    idPrefix = "transaction",

    searchTerm = "",
    totalItems = 0,

    showSearch = true,
    showResultCount = true,

    filterMode = "MONTH",
    selectedMonth,
    selectedYear,

    disabled = false,

    onSearchChange,
    onApplyFilters,
}) {
    const currentDate =
        new Date();

    const currentMonth =
        currentDate.getMonth() + 1;

    const currentYear =
        currentDate.getFullYear();

    const dialogReference =
        useRef(null);

    const firstFieldReference =
        useRef(null);

    const yearPickerPanelReference =
        useRef(null);

    const yearPickerOpenStateReference =
        useRef(false);

    const previousActiveElementReference =
        useRef(null);

    const [
        modalOpen,
        setModalOpen,
    ] = useState(false);

    const [
        yearPickerOpen,
        setYearPickerOpen,
    ] = useState(false);

    const [
        visibleStartYear,
        setVisibleStartYear,
    ] = useState(() =>
        getYearPageStart(
            selectedYear ||
            currentYear
        )
    );

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
        normalizeYear(
            selectedYear,
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

    const draftPeriodLabel =
        getPeriodLabel(
            draftFilterMode,
            draftMonth,
            draftYear
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

        const nextYear =
            normalizeYear(
                selectedYear,
                currentYear
            );

        setDraftFilterMode(
            filterMode
        );

        setDraftMonth(
            Number(selectedMonth) ||
            currentMonth
        );

        setDraftYear(
            nextYear
        );

        setVisibleStartYear(
            getYearPageStart(
                nextYear
            )
        );

        setYearPickerOpen(false);
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
        yearPickerOpenStateReference.current =
            yearPickerOpen;
    }, [yearPickerOpen]);

    useEffect(() => {
        if (
            !modalOpen ||
            !yearPickerOpen
        ) {
            return undefined;
        }

        const scrollFrame =
            window.requestAnimationFrame(
                () => {
                    yearPickerPanelReference
                        .current
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                        });
                }
            );

        return () => {
            window.cancelAnimationFrame(
                scrollFrame
            );
        };
    }, [
        modalOpen,
        yearPickerOpen,
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
                event.preventDefault();

                if (
                    yearPickerOpenStateReference.current
                ) {
                    setYearPickerOpen(false);
                    return;
                }

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
        setYearPickerOpen(false);
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

    function handleModeChange(
        nextMode
    ) {
        setDraftFilterMode(
            nextMode
        );

        setYearPickerOpen(false);
        setValidationMessage("");
    }

    function toggleYearPicker() {
        if (
            disabled ||
            !showYear
        ) {
            return;
        }

        setVisibleStartYear(
            getYearPageStart(
                draftYear
            )
        );

        setYearPickerOpen(
            (currentValue) =>
                !currentValue
        );
    }

    function handleSelectYear(year) {
        setDraftYear(year);
        setVisibleStartYear(
            getYearPageStart(year)
        );
        setYearPickerOpen(false);
        setValidationMessage("");
    }

    function handlePreviousYears() {
        setVisibleStartYear(
            (currentStartYear) =>
                Math.max(
                    currentStartYear -
                    YEARS_PER_PAGE,
                    MIN_YEAR
                )
        );
    }

    function handleNextYears() {
        setVisibleStartYear(
            (currentStartYear) =>
                Math.min(
                    currentStartYear +
                    YEARS_PER_PAGE,
                    MAX_YEAR -
                    YEARS_PER_PAGE +
                    1
                )
        );
    }

    function handleResetDraft() {
        setDraftFilterMode("ALL");
        setDraftMonth(currentMonth);
        setDraftYear(currentYear);

        setVisibleStartYear(
            getYearPageStart(
                currentYear
            )
        );

        setYearPickerOpen(false);
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
                `Selecione um ano entre ${MIN_YEAR} e ${MAX_YEAR}.`
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
                aria-label={
                    showSearch
                        ? "Pesquisa e filtros"
                        : "Filtros de período"
                }
                className="
                    relative
                    w-full min-w-0
                    overflow-hidden
                    rounded-[26px]
                    border border-border
                    bg-surface
                    p-4
                    shadow-card
                    sm:p-5
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -right-20 -top-24
                        size-48
                        rounded-full
                        bg-blue-500/[0.06]
                        blur-3xl
                    "
                />

                <div
                    className={`
                        relative
                        flex min-w-0
                        flex-col gap-3
                        md:flex-row
                        md:items-center

                        ${showSearch
                            ? ""
                            : "md:justify-end"
                        }
                    `}
                >
                    {showSearch && (
                        <div
                            className="
                                relative
                                min-w-0 flex-1
                            "
                        >
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    left-2 top-1/2
                                    flex size-9
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-500/10
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                <RiSearchLine
                                    size={18}
                                    aria-hidden="true"
                                />
                            </span>

                            <input
                                id={`${idPrefix}-search`}
                                type="search"
                                value={searchTerm}
                                onChange={
                                    handleSearchInput
                                }
                                disabled={disabled}
                                autoComplete="off"
                                placeholder="Pesquisar pela descrição..."
                                aria-label="Pesquisar pela descrição"
                                className="
                                    h-12 w-full
                                    min-w-0
                                    rounded-2xl
                                    border border-border
                                    bg-background
                                    py-2
                                    pl-12 pr-12
                                    text-sm
                                    font-medium
                                    text-foreground
                                    outline-none
                                    transition
                                    placeholder:font-normal
                                    placeholder:text-muted-foreground/65
                                    hover:border-blue-500/25
                                    focus:border-blue-500/55
                                    focus:ring-4
                                    focus:ring-blue-500/10
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
                                        right-2 top-1/2
                                        inline-flex size-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-xl
                                        text-muted-foreground
                                        transition
                                        hover:bg-surface-hover
                                        hover:text-foreground
                                        focus-visible:outline-none
                                        focus-visible:ring-4
                                        focus-visible:ring-blue-500/10
                                        disabled:pointer-events-none
                                        disabled:opacity-40
                                    "
                                >
                                    <RiCloseLine
                                        size={18}
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={openModal}
                        disabled={disabled}
                        aria-haspopup="dialog"
                        aria-expanded={
                            modalOpen
                        }
                        className="
                            relative
                            inline-flex
                            h-12 w-full
                            shrink-0
                            items-center
                            justify-center
                            gap-2.5
                            overflow-hidden
                            rounded-2xl
                            border
                            border-blue-500/20
                            bg-gradient-to-r
                            from-blue-600
                            via-indigo-600
                            to-violet-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-xl
                            hover:shadow-blue-500/25
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-blue-500/20
                            disabled:pointer-events-none
                            disabled:opacity-50
                            md:w-auto
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                -right-4 -top-7
                                size-16
                                rounded-full
                                bg-white/15
                                blur-xl
                            "
                        />

                        <span className="relative">
                            <RiFilter3Line
                                size={19}
                                aria-hidden="true"
                            />

                            {hasPeriodFilter && (
                                <span
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        -right-1.5 -top-1
                                        size-2.5
                                        rounded-full
                                        border-2
                                        border-indigo-600
                                        bg-white
                                    "
                                />
                            )}
                        </span>

                        <span className="relative">
                            Filtros
                        </span>
                    </button>
                </div>

                <div
                    className="
                        relative
                        mt-3
                        flex min-w-0
                        flex-col gap-2
                        rounded-2xl
                        border border-blue-500/10
                        bg-blue-500/[0.045]
                        px-3.5 py-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex min-w-0
                            items-center gap-2.5
                        "
                    >
                        <span
                            className="
                                flex size-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-500/10
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            <RiCalendarLine
                                size={16}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.1em]
                                    text-muted-foreground
                                "
                            >
                                Período selecionado
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                {periodLabel}
                            </p>
                        </div>
                    </div>

                    {showResultCount && (
                        <span
                            className="
                                shrink-0
                                self-start
                                rounded-full
                                bg-surface
                                px-3 py-1.5
                                text-xs
                                font-semibold
                                tabular-nums
                                text-muted-foreground
                                ring-1
                                ring-inset
                                ring-border
                                sm:self-auto
                            "
                        >
                            {formattedTotalItems}{" "}
                            {normalizedTotalItems === 1
                                ? "resultado"
                                : "resultados"
                            }
                        </span>
                    )}
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
                                duration: 0.2,
                            }}
                            className="
                                fixed inset-0
                                z-[200]
                                flex items-end
                                justify-center
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
                                aria-labelledby={`${idPrefix}-filter-title`}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    scale: 0.975,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 22,
                                    scale: 0.98,
                                }}
                                transition={{
                                    duration: 0.26,
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
                                    max-w-xl
                                    flex-col
                                    overflow-hidden
                                    rounded-t-[30px]
                                    border border-border
                                    bg-surface
                                    text-foreground
                                    shadow-2xl
                                    sm:rounded-[30px]
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
                                            relative
                                            isolate
                                            overflow-hidden
                                            bg-gradient-to-br
                                            from-blue-600
                                            via-indigo-600
                                            to-violet-700
                                            px-5 py-5
                                            text-white
                                            sm:px-6
                                            sm:py-6
                                        "
                                    >
                                        <div
                                            aria-hidden="true"
                                            className="
                                                absolute
                                                -right-12 -top-14
                                                size-36
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
                                                size-40
                                                rounded-full
                                                bg-black/10
                                                blur-3xl
                                            "
                                        />

                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex min-w-0
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span
                                                className="
                                                    flex size-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-white/15
                                                    ring-1
                                                    ring-inset
                                                    ring-white/20
                                                    backdrop-blur-sm
                                                "
                                            >
                                                <RiFilter3Line
                                                    size={21}
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
                                                        text-lg
                                                        font-semibold
                                                        tracking-tight
                                                        sm:text-xl
                                                    "
                                                >
                                                    Filtrar movimentações
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-white/75
                                                    "
                                                >
                                                    Escolha o período que deseja analisar.
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
                                        <fieldset>
                                            <legend
                                                className="
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.11em]
                                                    text-muted-foreground
                                                "
                                            >
                                                Forma de visualização
                                            </legend>

                                            <div
                                                className="
                                                    mt-3
                                                    grid gap-2.5
                                                    sm:grid-cols-3
                                                "
                                            >
                                                {FILTER_OPTIONS.map(
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
                                                                    index === 0
                                                                        ? firstFieldReference
                                                                        : undefined
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleModeChange(
                                                                        option.value
                                                                    )
                                                                }
                                                                aria-pressed={
                                                                    selected
                                                                }
                                                                className={`
                                                                    group
                                                                    relative
                                                                    min-h-24
                                                                    overflow-hidden
                                                                    rounded-2xl
                                                                    border
                                                                    p-3.5
                                                                    text-left
                                                                    transition
                                                                    focus-visible:outline-none
                                                                    focus-visible:ring-4
                                                                    focus-visible:ring-blue-500/10

                                                                    ${selected
                                                                        ? `
                                                                                border-blue-600
                                                                                bg-gradient-to-br
                                                                                from-blue-600
                                                                                to-indigo-600
                                                                                text-white
                                                                                shadow-lg
                                                                                shadow-blue-500/20
                                                                            `
                                                                        : `
                                                                                border-border
                                                                                bg-background
                                                                                text-foreground
                                                                                hover:-translate-y-0.5
                                                                                hover:border-blue-500/25
                                                                                hover:bg-blue-500/[0.035]
                                                                            `
                                                                    }
                                                                `}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={`
                                                                        absolute
                                                                        -right-4 -top-5
                                                                        size-14
                                                                        rounded-full
                                                                        blur-xl

                                                                        ${selected
                                                                            ? "bg-white/20"
                                                                            : "bg-blue-500/10"
                                                                        }
                                                                    `}
                                                                />

                                                                <div
                                                                    className="
                                                                        relative
                                                                        flex
                                                                        items-start
                                                                        justify-between
                                                                        gap-2
                                                                    "
                                                                >
                                                                    <span
                                                                        className={`
                                                                            flex size-8
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-xl

                                                                            ${selected
                                                                                ? "bg-white/15 text-white"
                                                                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                                            }
                                                                        `}
                                                                    >
                                                                        <RiCalendarLine
                                                                            size={16}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>

                                                                    {selected && (
                                                                        <span
                                                                            className="
                                                                                flex size-6
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-full
                                                                                bg-white/15
                                                                            "
                                                                        >
                                                                            <RiCheckLine
                                                                                size={15}
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p
                                                                    className="
                                                                        relative
                                                                        mt-3
                                                                        text-sm
                                                                        font-semibold
                                                                    "
                                                                >
                                                                    {option.label}
                                                                </p>

                                                                <p
                                                                    className={`
                                                                        relative
                                                                        mt-1
                                                                        line-clamp-2
                                                                        text-[11px]
                                                                        leading-4

                                                                        ${selected
                                                                            ? "text-white/70"
                                                                            : "text-muted-foreground"
                                                                        }
                                                                    `}
                                                                >
                                                                    {
                                                                        option.description
                                                                    }
                                                                </p>
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
                                                    <motion.section
                                                        key="period-fields"
                                                        initial={{
                                                            opacity: 0,
                                                            y: -8,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -8,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="
                                                            mt-6
                                                            rounded-3xl
                                                            border
                                                            border-border
                                                            bg-surface-muted/30
                                                            p-4
                                                            sm:p-5
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-3
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    flex size-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-xl
                                                                    bg-blue-500/10
                                                                    text-blue-600
                                                                    dark:text-blue-400
                                                                "
                                                            >
                                                                <RiCalendarLine
                                                                    size={18}
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
                                                                    Definir período
                                                                </h3>

                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-xs
                                                                        text-muted-foreground
                                                                    "
                                                                >
                                                                    Selecione o mês e o ano desejados.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`
                                                                mt-4
                                                                grid gap-4

                                                                ${showMonth
                                                                    ? "sm:grid-cols-2"
                                                                    : "grid-cols-1"
                                                                }
                                                            `}
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
                                                                <YearPickerTrigger
                                                                    id={`${idPrefix}-draft-year`}
                                                                    value={
                                                                        draftYear
                                                                    }
                                                                    open={
                                                                        yearPickerOpen
                                                                    }
                                                                    disabled={
                                                                        disabled
                                                                    }
                                                                    onToggle={
                                                                        toggleYearPicker
                                                                    }
                                                                />
                                                            )}
                                                        </div>

                                                        <YearPickerPanel
                                                            open={
                                                                yearPickerOpen &&
                                                                showYear
                                                            }
                                                            currentYear={
                                                                currentYear
                                                            }
                                                            selectedYear={
                                                                draftYear
                                                            }
                                                            visibleStartYear={
                                                                visibleStartYear
                                                            }
                                                            panelReference={
                                                                yearPickerPanelReference
                                                            }
                                                            onSelectYear={
                                                                handleSelectYear
                                                            }
                                                            onPreviousYears={
                                                                handlePreviousYears
                                                            }
                                                            onNextYears={
                                                                handleNextYears
                                                            }
                                                        />
                                                    </motion.section>
                                                )}
                                        </AnimatePresence>

                                        {validationMessage && (
                                            <motion.p
                                                role="alert"
                                                initial={{
                                                    opacity: 0,
                                                    y: -4,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                className="
                                                    mt-3
                                                    rounded-xl
                                                    border
                                                    border-rose-500/15
                                                    bg-rose-500/[0.06]
                                                    px-3.5 py-3
                                                    text-xs
                                                    font-semibold
                                                    text-rose-600
                                                    dark:text-rose-400
                                                "
                                            >
                                                {
                                                    validationMessage
                                                }
                                            </motion.p>
                                        )}

                                        <section
                                            className="
                                                relative
                                                mt-6
                                                overflow-hidden
                                                rounded-3xl
                                                border
                                                border-blue-500/15
                                                bg-gradient-to-br
                                                from-blue-600
                                                via-indigo-600
                                                to-violet-600
                                                p-4
                                                text-white
                                                shadow-lg
                                                shadow-blue-500/15
                                                sm:p-5
                                            "
                                        >
                                            <div
                                                aria-hidden="true"
                                                className="
                                                    absolute
                                                    -right-8 -top-10
                                                    size-28
                                                    rounded-full
                                                    bg-white/15
                                                    blur-2xl
                                                "
                                            />

                                            <div
                                                className="
                                                    relative
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    justify-between
                                                    gap-4
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
                                                        className="
                                                            flex size-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-2xl
                                                            bg-white/15
                                                            ring-1
                                                            ring-inset
                                                            ring-white/15
                                                        "
                                                    >
                                                        <RiCalendarLine
                                                            size={19}
                                                            aria-hidden="true"
                                                        />
                                                    </span>

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-bold
                                                                uppercase
                                                                tracking-[0.12em]
                                                                text-white/65
                                                            "
                                                        >
                                                            Período escolhido
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                truncate
                                                                text-base
                                                                font-semibold
                                                            "
                                                        >
                                                            {
                                                                draftPeriodLabel
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {showResultCount && (
                                                    <span
                                                        className="
                                                            shrink-0
                                                            rounded-full
                                                            bg-white/15
                                                            px-3 py-1.5
                                                            text-xs
                                                            font-semibold
                                                            tabular-nums
                                                            text-white
                                                            ring-1
                                                            ring-inset
                                                            ring-white/15
                                                        "
                                                    >
                                                        {
                                                            formattedTotalItems
                                                        }{" "}
                                                        {normalizedTotalItems === 1
                                                            ? "item"
                                                            : "itens"
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    <footer
                                        className="
                                            flex
                                            flex-col-reverse
                                            gap-2.5
                                            border-t
                                            border-border
                                            bg-surface
                                            px-4 py-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            sm:px-6
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
                                                font-semibold
                                                text-muted-foreground
                                                transition
                                                hover:border-blue-500/20
                                                hover:bg-blue-500/[0.035]
                                                hover:text-foreground
                                                focus-visible:outline-none
                                                focus-visible:ring-4
                                                focus-visible:ring-blue-500/10
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
                                                gap-2.5
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
                                                    font-semibold
                                                    text-foreground
                                                    transition
                                                    hover:bg-surface-hover
                                                    focus-visible:outline-none
                                                    focus-visible:ring-4
                                                    focus-visible:ring-blue-500/10
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
                                                    border
                                                    border-blue-500/20
                                                    bg-gradient-to-r
                                                    from-blue-600
                                                    via-indigo-600
                                                    to-violet-600
                                                    px-5
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    shadow-lg
                                                    shadow-blue-500/20
                                                    transition
                                                    hover:-translate-y-0.5
                                                    hover:shadow-xl
                                                    hover:shadow-blue-500/25
                                                    focus-visible:outline-none
                                                    focus-visible:ring-4
                                                    focus-visible:ring-blue-500/20
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