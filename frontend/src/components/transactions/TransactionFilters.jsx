import {
    useEffect,
    useId,
    useMemo,
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
    RiCalendar2Line,
    RiCheckLine,
    RiCloseLine,
    RiEqualizer2Line,
    RiHistoryLine,
    RiSearchLine,
} from "react-icons/ri";

const FILTER_MODES =
    Object.freeze({
        MONTH: "MONTH",
        YEAR: "YEAR",
        ALL: "ALL",
    });

const MONTH_OPTIONS = [
    {
        value: 1,
        label: "Janeiro",
    },
    {
        value: 2,
        label: "Fevereiro",
    },
    {
        value: 3,
        label: "Março",
    },
    {
        value: 4,
        label: "Abril",
    },
    {
        value: 5,
        label: "Maio",
    },
    {
        value: 6,
        label: "Junho",
    },
    {
        value: 7,
        label: "Julho",
    },
    {
        value: 8,
        label: "Agosto",
    },
    {
        value: 9,
        label: "Setembro",
    },
    {
        value: 10,
        label: "Outubro",
    },
    {
        value: 11,
        label: "Novembro",
    },
    {
        value: 12,
        label: "Dezembro",
    },
];

function normalizeFilterMode(
    value,
) {
    return Object.hasOwn(
        FILTER_MODES,
        value,
    )
        ? value
        : FILTER_MODES.MONTH;
}

function normalizeMonth(
    value,
) {
    const month =
        Number(value);

    if (
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
    ) {
        return (
            new Date().getMonth() +
            1
        );
    }

    return month;
}

function normalizeYear(
    value,
) {
    const year =
        Number(value);

    if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
    ) {
        return new Date()
            .getFullYear();
    }

    return year;
}

function getMonthLabel(
    month,
) {
    return (
        MONTH_OPTIONS.find(
            (option) =>
                option.value ===
                Number(month),
        )?.label ??
        "Mês"
    );
}

function getFilterLabel({
    filterMode,
    selectedMonth,
    selectedYear,
}) {
    if (
        filterMode ===
        FILTER_MODES.MONTH
    ) {
        return `${getMonthLabel(
            selectedMonth,
        )} de ${selectedYear}`;
    }

    if (
        filterMode ===
        FILTER_MODES.YEAR
    ) {
        return `Ano de ${selectedYear}`;
    }

    return "Todo o histórico";
}

function FilterModeButton({
    active,
    icon: Icon,
    title,
    description,
    onClick,
    disabled,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            className={`
                flex
                min-h-20
                w-full
                items-start
                gap-3
                rounded-2xl
                border
                p-3.5
                text-left
                outline-none
                transition
                focus-visible:ring-4
                focus-visible:ring-primary/15
                disabled:pointer-events-none
                disabled:opacity-60

                ${active
                    ? "border-primary/35 bg-primary/5"
                    : "border-border bg-background hover:border-border-strong hover:bg-surface-hover"
                }
            `}
        >
            <span
                className={`
                    inline-flex
                    size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border

                    ${active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted-foreground"
                    }
                `}
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <span
                        className="
                            text-sm
                            font-semibold
                            text-foreground
                        "
                    >
                        {title}
                    </span>

                    {active && (
                        <span
                            className="
                                inline-flex
                                size-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-primary
                                text-primary-foreground
                            "
                        >
                            <RiCheckLine
                                size={13}
                                aria-hidden="true"
                            />
                        </span>
                    )}
                </span>

                <span
                    className="
                        mt-1
                        block
                        text-xs
                        leading-5
                        text-muted-foreground
                    "
                >
                    {description}
                </span>
            </span>
        </button>
    );
}

function TransactionFilters({
    idPrefix = "transactions",

    searchTerm = "",
    totalItems = 0,

    filterMode = "MONTH",
    selectedMonth,
    selectedYear,

    disabled = false,

    onSearchChange,
    onApplyFilters,
}) {
    const generatedId =
        useId();

    const currentDate =
        useMemo(
            () => new Date(),
            [],
        );

    const resolvedMonth =
        normalizeMonth(
            selectedMonth ??
            currentDate.getMonth() +
            1,
        );

    const resolvedYear =
        normalizeYear(
            selectedYear ??
            currentDate.getFullYear(),
        );

    const resolvedFilterMode =
        normalizeFilterMode(
            filterMode,
        );

    const [
        filterModalOpen,
        setFilterModalOpen,
    ] = useState(false);

    const [
        draftFilterMode,
        setDraftFilterMode,
    ] = useState(
        resolvedFilterMode,
    );

    const [
        draftMonth,
        setDraftMonth,
    ] = useState(
        resolvedMonth,
    );

    const [
        draftYear,
        setDraftYear,
    ] = useState(
        resolvedYear,
    );

    const [
        yearError,
        setYearError,
    ] = useState("");

    useEffect(() => {
        if (filterModalOpen) {
            return;
        }

        setDraftFilterMode(
            resolvedFilterMode,
        );

        setDraftMonth(
            resolvedMonth,
        );

        setDraftYear(
            resolvedYear,
        );

        setYearError("");
    }, [
        filterModalOpen,
        resolvedFilterMode,
        resolvedMonth,
        resolvedYear,
    ]);

    useEffect(() => {
        if (!filterModalOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        function handleKeyDown(
            event,
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                setFilterModalOpen(
                    false,
                );
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [filterModalOpen]);

    const appliedFilterLabel =
        getFilterLabel({
            filterMode:
                resolvedFilterMode,

            selectedMonth:
                resolvedMonth,

            selectedYear:
                resolvedYear,
        });

    const normalizedTotalItems =
        Math.max(
            0,
            Number(totalItems) || 0,
        );

    function openFilterModal() {
        if (disabled) {
            return;
        }

        setDraftFilterMode(
            resolvedFilterMode,
        );

        setDraftMonth(
            resolvedMonth,
        );

        setDraftYear(
            resolvedYear,
        );

        setYearError("");

        setFilterModalOpen(true);
    }

    function closeFilterModal() {
        setFilterModalOpen(false);
        setYearError("");
    }

    function handleSearchChange(
        event,
    ) {
        onSearchChange?.(
            event.target.value,
        );
    }

    function clearSearch() {
        onSearchChange?.("");
    }

    function handleYearChange(
        event,
    ) {
        const value =
            event.target.value;

        setDraftYear(value);
        setYearError("");
    }

    function applyFilters() {
        const normalizedDraftYear =
            Number(draftYear);

        if (
            draftFilterMode !==
            FILTER_MODES.ALL &&
            (
                !Number.isInteger(
                    normalizedDraftYear,
                ) ||
                normalizedDraftYear <
                1900 ||
                normalizedDraftYear >
                2100
            )
        ) {
            setYearError(
                "Informe um ano entre 1900 e 2100.",
            );

            return;
        }

        onApplyFilters?.({
            filterMode:
                draftFilterMode,

            selectedMonth:
                normalizeMonth(
                    draftMonth,
                ),

            selectedYear:
                draftFilterMode ===
                    FILTER_MODES.ALL
                    ? resolvedYear
                    : normalizedDraftYear,
        });

        closeFilterModal();
    }

    function restoreCurrentPeriod() {
        setDraftFilterMode(
            FILTER_MODES.MONTH,
        );

        setDraftMonth(
            currentDate.getMonth() +
            1,
        );

        setDraftYear(
            currentDate.getFullYear(),
        );

        setYearError("");
    }

    const searchInputId =
        `${idPrefix}-${generatedId}-search`;

    const yearInputId =
        `${idPrefix}-${generatedId}-year`;

    const monthInputId =
        `${idPrefix}-${generatedId}-month`;

    const modal =
        typeof document !==
            "undefined"
            ? createPortal(
                <AnimatePresence>
                    {filterModalOpen && (
                        <motion.div
                            role="presentation"
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
                            onMouseDown={(
                                event,
                            ) => {
                                if (
                                    event.target ===
                                    event.currentTarget
                                ) {
                                    closeFilterModal();
                                }
                            }}
                            className="
                                  fixed inset-0
                                  z-[120]
                                  flex
                                  items-end
                                  justify-center
                                  bg-slate-950/45
                                  p-0
                                  backdrop-blur-[2px]
                                  sm:items-center
                                  sm:p-5
                              "
                        >
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={`${idPrefix}-${generatedId}-filter-title`}
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
                                    y: 16,
                                    scale: 0.99,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                }}
                                onMouseDown={(
                                    event,
                                ) =>
                                    event.stopPropagation()
                                }
                                className="
                                      flex
                                      max-h-[94dvh]
                                      w-full
                                      flex-col
                                      overflow-hidden
                                      rounded-t-3xl
                                      border border-border
                                      bg-surface
                                      shadow-2xl
                                      sm:max-w-xl
                                      sm:rounded-3xl
                                  "
                            >
                                <header
                                    className="
                                          flex
                                          shrink-0
                                          items-start
                                          justify-between
                                          gap-4
                                          border-b border-border
                                          px-4 py-4
                                          sm:px-6
                                          sm:py-5
                                      "
                                >
                                    <div
                                        className="
                                              flex min-w-0
                                              items-start
                                              gap-3
                                          "
                                    >
                                        <div
                                            className="
                                                  inline-flex
                                                  size-10
                                                  shrink-0
                                                  items-center
                                                  justify-center
                                                  rounded-xl
                                                  border border-border
                                                  bg-background
                                                  text-primary
                                              "
                                        >
                                            <RiEqualizer2Line
                                                size={19}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h2
                                                id={`${idPrefix}-${generatedId}-filter-title`}
                                                className="
                                                      text-base
                                                      font-semibold
                                                      text-foreground
                                                  "
                                            >
                                                Filtrar período
                                            </h2>

                                            <p
                                                className="
                                                      mt-1
                                                      text-xs
                                                      leading-5
                                                      text-muted-foreground
                                                  "
                                            >
                                                Escolha quais lançamentos deseja visualizar.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeFilterModal
                                        }
                                        aria-label="Fechar filtros"
                                        title="Fechar"
                                        className="
                                              inline-flex
                                              size-9
                                              shrink-0
                                              items-center
                                              justify-center
                                              rounded-xl
                                              text-muted-foreground
                                              transition
                                              hover:bg-surface-hover
                                              hover:text-foreground
                                              focus-visible:ring-4
                                              focus-visible:ring-primary/15
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
                                          flex-1
                                          overflow-y-auto
                                          px-4 py-5
                                          sm:px-6
                                      "
                                >
                                    <div className="space-y-5">
                                        <section>
                                            <p
                                                className="
                                                      mb-2
                                                      text-xs
                                                      font-semibold
                                                      text-foreground
                                                  "
                                            >
                                                Visualizar por
                                            </p>

                                            <div
                                                className="
                                                      grid gap-2
                                                      sm:grid-cols-3
                                                  "
                                            >
                                                <FilterModeButton
                                                    active={
                                                        draftFilterMode ===
                                                        FILTER_MODES.MONTH
                                                    }
                                                    icon={
                                                        RiCalendar2Line
                                                    }
                                                    title="Mês"
                                                    description="Lançamentos de um mês específico."
                                                    onClick={() => {
                                                        setDraftFilterMode(
                                                            FILTER_MODES.MONTH,
                                                        );

                                                        setYearError(
                                                            "",
                                                        );
                                                    }}
                                                />

                                                <FilterModeButton
                                                    active={
                                                        draftFilterMode ===
                                                        FILTER_MODES.YEAR
                                                    }
                                                    icon={
                                                        RiCalendar2Line
                                                    }
                                                    title="Ano"
                                                    description="Todos os meses de um determinado ano."
                                                    onClick={() => {
                                                        setDraftFilterMode(
                                                            FILTER_MODES.YEAR,
                                                        );

                                                        setYearError(
                                                            "",
                                                        );
                                                    }}
                                                />

                                                <FilterModeButton
                                                    active={
                                                        draftFilterMode ===
                                                        FILTER_MODES.ALL
                                                    }
                                                    icon={
                                                        RiHistoryLine
                                                    }
                                                    title="Tudo"
                                                    description="Todo o histórico disponível."
                                                    onClick={() => {
                                                        setDraftFilterMode(
                                                            FILTER_MODES.ALL,
                                                        );

                                                        setYearError(
                                                            "",
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </section>

                                        {draftFilterMode !==
                                            FILTER_MODES.ALL && (
                                                <section
                                                    className="
                                                      rounded-2xl
                                                      border border-border
                                                      bg-background
                                                      p-4
                                                  "
                                                >
                                                    <div
                                                        className={`
                                                          grid gap-4

                                                          ${draftFilterMode ===
                                                                FILTER_MODES.MONTH
                                                                ? "sm:grid-cols-2"
                                                                : ""
                                                            }
                                                      `}
                                                    >
                                                        {draftFilterMode ===
                                                            FILTER_MODES.MONTH && (
                                                                <div>
                                                                    <label
                                                                        htmlFor={
                                                                            monthInputId
                                                                        }
                                                                        className="
                                                                      mb-1.5
                                                                      block
                                                                      text-xs
                                                                      font-semibold
                                                                      text-foreground
                                                                  "
                                                                    >
                                                                        Mês
                                                                    </label>

                                                                    <select
                                                                        id={
                                                                            monthInputId
                                                                        }
                                                                        value={
                                                                            draftMonth
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            setDraftMonth(
                                                                                Number(
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                        className="
                                                                      h-11
                                                                      w-full
                                                                      rounded-xl
                                                                      border border-border
                                                                      bg-surface
                                                                      px-3
                                                                      text-sm
                                                                      font-medium
                                                                      text-foreground
                                                                      outline-none
                                                                      transition
                                                                      hover:border-border-strong
                                                                      focus:border-primary/50
                                                                      focus:ring-4
                                                                      focus:ring-primary/10
                                                                  "
                                                                    >
                                                                        {MONTH_OPTIONS.map(
                                                                            (
                                                                                month,
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
                                                                            ),
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            )}

                                                        <div>
                                                            <label
                                                                htmlFor={
                                                                    yearInputId
                                                                }
                                                                className="
                                                                  mb-1.5
                                                                  block
                                                                  text-xs
                                                                  font-semibold
                                                                  text-foreground
                                                              "
                                                            >
                                                                Ano
                                                            </label>

                                                            <input
                                                                id={
                                                                    yearInputId
                                                                }
                                                                type="number"
                                                                inputMode="numeric"
                                                                min="1900"
                                                                max="2100"
                                                                step="1"
                                                                value={
                                                                    draftYear
                                                                }
                                                                onChange={
                                                                    handleYearChange
                                                                }
                                                                aria-invalid={
                                                                    Boolean(
                                                                        yearError,
                                                                    )
                                                                }
                                                                className={`
                                                                  h-11
                                                                  w-full
                                                                  rounded-xl
                                                                  border
                                                                  bg-surface
                                                                  px-3
                                                                  text-sm
                                                                  font-medium
                                                                  text-foreground
                                                                  outline-none
                                                                  transition
                                                                  focus:ring-4

                                                                  ${yearError
                                                                        ? "border-danger focus:border-danger focus:ring-danger/10"
                                                                        : "border-border hover:border-border-strong focus:border-primary/50 focus:ring-primary/10"
                                                                    }
                                                              `}
                                                            />

                                                            {yearError && (
                                                                <p
                                                                    role="alert"
                                                                    className="
                                                                      mt-1.5
                                                                      text-xs
                                                                      font-medium
                                                                      text-danger
                                                                  "
                                                                >
                                                                    {
                                                                        yearError
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </section>
                                            )}

                                        <section
                                            className="
                                                  flex
                                                  items-start
                                                  gap-3
                                                  rounded-2xl
                                                  border border-primary/15
                                                  bg-primary/5
                                                  p-4
                                              "
                                        >
                                            <RiCalendar2Line
                                                size={18}
                                                aria-hidden="true"
                                                className="
                                                      mt-0.5
                                                      shrink-0
                                                      text-primary
                                                  "
                                            />

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                          text-xs
                                                          font-semibold
                                                          text-foreground
                                                      "
                                                >
                                                    Filtro selecionado
                                                </p>

                                                <p
                                                    className="
                                                          mt-1
                                                          text-xs
                                                          leading-5
                                                          text-muted-foreground
                                                      "
                                                >
                                                    {getFilterLabel({
                                                        filterMode:
                                                            draftFilterMode,

                                                        selectedMonth:
                                                            draftMonth,

                                                        selectedYear:
                                                            draftYear,
                                                    })}
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <footer
                                    className="
                                          flex
                                          shrink-0
                                          flex-col-reverse
                                          gap-2
                                          border-t border-border
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
                                            restoreCurrentPeriod
                                        }
                                        className="
                                              inline-flex
                                              min-h-11
                                              items-center
                                              justify-center
                                              rounded-xl
                                              px-4
                                              text-sm
                                              font-semibold
                                              text-muted-foreground
                                              transition
                                              hover:bg-surface-hover
                                              hover:text-foreground
                                          "
                                    >
                                        Mês atual
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
                                                closeFilterModal
                                            }
                                            className="
                                                  inline-flex
                                                  min-h-11
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
                                              "
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                applyFilters
                                            }
                                            className="
                                                  inline-flex
                                                  min-h-11
                                                  items-center
                                                  justify-center
                                                  gap-2
                                                  rounded-xl
                                                  bg-primary
                                                  px-5
                                                  text-sm
                                                  font-semibold
                                                  text-primary-foreground
                                                  transition
                                                  hover:bg-primary-hover
                                                  focus-visible:ring-4
                                                  focus-visible:ring-primary/20
                                              "
                                        >
                                            <RiCheckLine
                                                size={17}
                                                aria-hidden="true"
                                            />

                                            Aplicar filtro
                                        </button>
                                    </div>
                                </footer>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body,
            )
            : null;

    return (
        <>
            <section
                className="
                    min-w-0
                    rounded-2xl
                    border border-border
                    bg-surface
                    p-3
                    shadow-card
                    sm:p-4
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                    "
                >
                    <div
                        className="
                            relative
                            min-w-0
                            flex-1
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
                            id={
                                searchInputId
                            }
                            type="search"
                            value={
                                searchTerm
                            }
                            onChange={
                                handleSearchChange
                            }
                            disabled={
                                disabled
                            }
                            placeholder="Pesquisar por descrição ou tag..."
                            aria-label="Pesquisar movimentações"
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border border-border
                                bg-background
                                pl-10 pr-10
                                text-sm
                                font-medium
                                text-foreground
                                outline-none
                                transition
                                placeholder:font-normal
                                placeholder:text-muted-foreground/70
                                hover:border-border-strong
                                focus:border-primary/50
                                focus:ring-4
                                focus:ring-primary/10
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
                                    inline-flex
                                    size-8
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-muted-foreground
                                    transition
                                    hover:bg-surface-hover
                                    hover:text-foreground
                                    disabled:pointer-events-none
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
                        onClick={
                            openFilterModal
                        }
                        disabled={
                            disabled
                        }
                        className="
                            inline-flex
                            min-h-11
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border border-border
                            bg-background
                            px-4
                            text-sm
                            font-semibold
                            text-foreground
                            transition
                            hover:border-border-strong
                            hover:bg-surface-hover
                            focus-visible:ring-4
                            focus-visible:ring-primary/10
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >
                        <RiEqualizer2Line
                            size={17}
                            aria-hidden="true"
                        />

                        Filtrar
                    </button>
                </div>

                <div
                    className="
                        mt-3
                        flex
                        min-w-0
                        flex-col
                        gap-2
                        border-t border-border
                        pt-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                            text-xs
                            text-muted-foreground
                        "
                    >
                        <RiCalendar2Line
                            size={14}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span className="truncate">
                            {appliedFilterLabel}
                        </span>
                    </div>

                    <p
                        className="
                            shrink-0
                            text-xs
                            text-muted-foreground
                        "
                    >
                        <strong className="font-semibold text-foreground">
                            {normalizedTotalItems}
                        </strong>{" "}
                        {normalizedTotalItems ===
                            1
                            ? "registro encontrado"
                            : "registros encontrados"}
                    </p>
                </div>
            </section>

            {modal}
        </>
    );
}

export default TransactionFilters;