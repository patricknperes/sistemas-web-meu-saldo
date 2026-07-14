import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    FiAlertCircle,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiFileText,
    FiRefreshCw,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";

import {
    dashboardService,
} from "../../services/dashboardService.js";

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    getMonthName,
} from "../../utils/months.js";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const YEARS_PER_PAGE = 12;

function normalizeCents(value) {
    const normalizedValue = Number(value);

    return Number.isFinite(normalizedValue)
        ? normalizedValue
        : 0;
}

function getYearPageStart(year) {
    const normalizedYear = Math.min(
        Math.max(Number(year), MIN_YEAR),
        MAX_YEAR
    );

    const pageStart =
        Math.floor(
            normalizedYear / YEARS_PER_PAGE
        ) * YEARS_PER_PAGE;

    return Math.min(
        Math.max(pageStart, MIN_YEAR),
        MAX_YEAR - YEARS_PER_PAGE + 1
    );
}

function getBalancePresentation(balanceCents) {
    const balance =
        normalizeCents(balanceCents);

    if (balance > 0) {
        return {
            label: "Saldo positivo",
            valueClassName: "text-success",
            containerClassName:
                "bg-success-muted text-success",
        };
    }

    if (balance < 0) {
        return {
            label: "Saldo negativo",
            valueClassName: "text-danger",
            containerClassName:
                "bg-danger-muted text-danger",
        };
    }

    return {
        label: "Saldo zerado",
        valueClassName: "text-foreground",
        containerClassName:
            "bg-surface-muted text-muted-foreground",
    };
}

function HistoryLoading() {
    return (
        <div
            className="
                grid gap-4
                md:grid-cols-2
                xl:grid-cols-3
            "
        >
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <article
                    key={index}
                    className="
                        animate-pulse
                        rounded-2xl
                        border border-border
                        bg-surface
                        p-5
                        shadow-card
                    "
                >
                    <div
                        className="
                            flex items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                size-10
                                rounded-xl
                                bg-surface-muted
                            "
                        />

                        <div
                            className="
                                h-4 w-32
                                rounded
                                bg-surface-muted
                            "
                        />
                    </div>

                    <div className="mt-6 space-y-4">
                        {Array.from({
                            length: 4,
                        }).map(
                            (_, rowIndex) => (
                                <div
                                    key={
                                        rowIndex
                                    }
                                    className="
                                        flex
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div
                                        className="
                                            h-4 w-24
                                            rounded
                                            bg-surface-muted
                                        "
                                    />

                                    <div
                                        className="
                                            h-4 w-20
                                            rounded
                                            bg-surface-muted
                                        "
                                    />
                                </div>
                            )
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}

function History() {
    const currentYear =
        new Date().getFullYear();

    const yearPickerReference =
        useRef(null);

    const [
        history,
        setHistory,
    ] = useState([]);

    const [
        selectedYear,
        setSelectedYear,
    ] = useState(currentYear);

    const [
        visibleStartYear,
        setVisibleStartYear,
    ] = useState(() =>
        getYearPageStart(currentYear)
    );

    const [
        yearPickerOpen,
        setYearPickerOpen,
    ] = useState(false);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const visibleYears = useMemo(
        () =>
            Array.from(
                {
                    length: YEARS_PER_PAGE,
                },
                (_, index) =>
                    visibleStartYear + index
            ).filter(
                (year) =>
                    year >= MIN_YEAR &&
                    year <= MAX_YEAR
            ),
        [visibleStartYear]
    );

    const loadHistory = useCallback(
        async ({
            initial = false,
        } = {}) => {
            if (initial) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setErrorMessage("");

            try {
                const response =
                    await dashboardService.getHistory(
                        selectedYear
                    );

                setHistory(
                    Array.isArray(
                        response.history
                    )
                        ? response.history
                        : []
                );
            } catch (error) {
                setErrorMessage(
                    error.response?.data
                        ?.error ??
                    "Não foi possível carregar o histórico."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [selectedYear]
    );

    useEffect(() => {
        loadHistory({
            initial: true,
        });
    }, [loadHistory]);

    useEffect(() => {
        if (!yearPickerOpen) {
            return undefined;
        }

        function handlePointerDown(event) {
            if (
                yearPickerReference.current &&
                !yearPickerReference.current.contains(
                    event.target
                )
            ) {
                setYearPickerOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setYearPickerOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handlePointerDown
        );

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handlePointerDown
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [yearPickerOpen]);

    function toggleYearPicker() {
        setVisibleStartYear(
            getYearPageStart(selectedYear)
        );

        setYearPickerOpen(
            (currentValue) =>
                !currentValue
        );
    }

    function handleSelectYear(year) {
        setSelectedYear(year);
        setYearPickerOpen(false);
    }

    function handleSelectCurrentYear() {
        setSelectedYear(currentYear);

        setVisibleStartYear(
            getYearPageStart(currentYear)
        );

        setYearPickerOpen(false);
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

    const previousDisabled =
        visibleStartYear <= MIN_YEAR;

    const nextDisabled =
        visibleStartYear +
        YEARS_PER_PAGE -
        1 >=
        MAX_YEAR;

    return (
        <div
            className="
                w-full min-w-0
                max-w-none
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex w-full min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex min-w-0
                        flex-col gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div className="min-w-0">
                        <h1
                            className="
                                truncate
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-foreground
                            "
                        >
                            Histórico mensal
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Consulte o resumo financeiro
                            de cada mês do ano.
                        </p>
                    </div>

                    <div
                        className="
                            flex w-full
                            flex-col gap-2
                            sm:w-auto
                            sm:flex-row
                        "
                    >
                        <div
                            ref={
                                yearPickerReference
                            }
                            className="
                                relative
                                w-full
                                sm:w-auto
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    toggleYearPicker
                                }
                                aria-haspopup="dialog"
                                aria-expanded={
                                    yearPickerOpen
                                }
                                className="
                                    inline-flex
                                    min-h-10
                                    w-full
                                    items-center
                                    justify-between
                                    gap-3
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    px-4
                                    text-sm
                                    font-medium
                                    text-foreground
                                    transition-colors
                                    hover:bg-surface-hover
                                    sm:min-w-36
                                "
                            >
                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <FiCalendar
                                        size={17}
                                        aria-hidden="true"
                                        className="
                                            text-muted-foreground
                                        "
                                    />

                                    {selectedYear}
                                </span>

                                <FiChevronRight
                                    size={16}
                                    aria-hidden="true"
                                    className={`
                                        text-muted-foreground
                                        transition-transform

                                        ${yearPickerOpen
                                            ? "rotate-90"
                                            : ""
                                        }
                                    `}
                                />
                            </button>

                            {yearPickerOpen && (
                                <div
                                    role="dialog"
                                    aria-label="Selecionar ano"
                                    className="
                                        absolute
                                        right-0 top-full
                                        z-50
                                        mt-2
                                        w-full
                                        min-w-72
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        p-3
                                        shadow-dialog
                                        sm:w-80
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
                                                handlePreviousYears
                                            }
                                            disabled={
                                                previousDisabled
                                            }
                                            aria-label="Mostrar anos anteriores"
                                            className="
                                                inline-flex
                                                size-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-muted-foreground
                                                transition-colors
                                                hover:bg-surface-hover
                                                hover:text-foreground
                                                disabled:pointer-events-none
                                                disabled:opacity-35
                                            "
                                        >
                                            <FiChevronLeft
                                                size={
                                                    18
                                                }
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            {
                                                visibleYears[0]
                                            }
                                            {" — "}
                                            {
                                                visibleYears[
                                                visibleYears.length -
                                                1
                                                ]
                                            }
                                        </p>

                                        <button
                                            type="button"
                                            onClick={
                                                handleNextYears
                                            }
                                            disabled={
                                                nextDisabled
                                            }
                                            aria-label="Mostrar próximos anos"
                                            className="
                                                inline-flex
                                                size-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-muted-foreground
                                                transition-colors
                                                hover:bg-surface-hover
                                                hover:text-foreground
                                                disabled:pointer-events-none
                                                disabled:opacity-35
                                            "
                                        >
                                            <FiChevronRight
                                                size={
                                                    18
                                                }
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    <div
                                        className="
                                            mt-3
                                            grid
                                            grid-cols-3
                                            gap-2
                                        "
                                    >
                                        {visibleYears.map(
                                            (
                                                year
                                            ) => {
                                                const isSelected =
                                                    year ===
                                                    selectedYear;

                                                const isCurrent =
                                                    year ===
                                                    currentYear;

                                                return (
                                                    <button
                                                        key={
                                                            year
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectYear(
                                                                year
                                                            )
                                                        }
                                                        aria-pressed={
                                                            isSelected
                                                        }
                                                        className={`
                                                            relative
                                                            min-h-10
                                                            rounded-xl
                                                            border
                                                            px-2
                                                            text-sm
                                                            font-medium
                                                            transition-colors

                                                            ${isSelected
                                                                ? `
                                                                        border-primary
                                                                        bg-primary
                                                                        text-primary-foreground
                                                                    `
                                                                : `
                                                                        border-transparent
                                                                        text-foreground
                                                                        hover:border-border
                                                                        hover:bg-surface-hover
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            year
                                                        }

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
                                                                        bg-primary
                                                                    "
                                                                />
                                                            )}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    <div
                                        className="
                                            mt-3
                                            border-t
                                            border-border
                                            pt-3
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={
                                                handleSelectCurrentYear
                                            }
                                            className="
                                                inline-flex
                                                min-h-9
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-lg
                                                text-sm
                                                font-medium
                                                text-primary
                                                transition-colors
                                                hover:bg-primary-muted
                                            "
                                        >
                                            <FiCalendar
                                                size={
                                                    15
                                                }
                                                aria-hidden="true"
                                            />

                                            Ir para o ano atual
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadHistory()
                            }
                            disabled={
                                refreshing ||
                                loading
                            }
                            className="
                                inline-flex
                                min-h-10
                                w-full
                                items-center
                                justify-center
                                gap-2
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
                            <FiRefreshCw
                                size={17}
                                aria-hidden="true"
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Atualizando..."
                                : "Atualizar"}
                        </button>
                    </div>
                </header>

                <section
                    className="
                        flex min-w-0
                        items-center gap-3
                        rounded-2xl
                        border border-border
                        bg-surface
                        px-4 py-3
                        shadow-card
                    "
                >
                    <span
                        className="
                            flex size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-info-muted
                            text-info
                        "
                    >
                        <FiCalendar
                            size={18}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                text-muted-foreground
                            "
                        >
                            Ano selecionado
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
                            Histórico financeiro de{" "}
                            {selectedYear}
                        </p>
                    </div>
                </section>

                {errorMessage && (
                    <div
                        role="alert"
                        className="
                            flex items-center
                            gap-3
                            rounded-xl
                            border
                            border-danger/20
                            bg-danger-muted
                            px-4 py-3
                            text-sm
                            text-danger
                        "
                    >
                        <FiAlertCircle
                            size={18}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <p className="min-w-0 flex-1">
                            {errorMessage}
                        </p>
                    </div>
                )}

                {loading ? (
                    <HistoryLoading />
                ) : history.length === 0 ? (
                    <section
                        className="
                            flex min-h-64
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border border-border
                            bg-surface
                            p-6
                            text-center
                            shadow-card
                        "
                    >
                        <span
                            className="
                                flex size-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-surface-muted
                                text-muted-foreground
                            "
                        >
                            <FiFileText
                                size={21}
                                aria-hidden="true"
                            />
                        </span>

                        <h2
                            className="
                                mt-4
                                text-base
                                font-semibold
                                text-foreground
                            "
                        >
                            Nenhum lançamento em{" "}
                            {selectedYear}
                        </h2>

                        <p
                            className="
                                mt-1
                                max-w-sm
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Não foram encontradas
                            receitas ou despesas para o
                            ano selecionado.
                        </p>
                    </section>
                ) : (
                    <section
                        aria-label={`Histórico financeiro de ${selectedYear}`}
                        className="
                            grid gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {history.map(
                            (monthData) => {
                                const incomeCents =
                                    normalizeCents(
                                        monthData.totalIncomeCents
                                    );

                                const expenseCents =
                                    normalizeCents(
                                        monthData.totalExpenseCents
                                    );

                                const balanceCents =
                                    normalizeCents(
                                        monthData.balanceCents
                                    );

                                const balancePresentation =
                                    getBalancePresentation(
                                        balanceCents
                                    );

                                return (
                                    <article
                                        key={
                                            monthData.key ??
                                            `${monthData.year}-${monthData.month}`
                                        }
                                        className="
                                            min-w-0
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-surface
                                            shadow-card
                                        "
                                    >
                                        <header
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                border-b
                                                border-border
                                                px-5 py-4
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
                                                <FiCalendar
                                                    size={
                                                        16
                                                    }
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <div className="min-w-0">
                                                <h2
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                >
                                                    {getMonthName(
                                                        monthData.month
                                                    )}{" "}
                                                    de{" "}
                                                    {
                                                        monthData.year
                                                    }
                                                </h2>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-xs
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        monthData.transactionCount ??
                                                        0
                                                    }{" "}
                                                    {Number(
                                                        monthData.transactionCount
                                                    ) ===
                                                        1
                                                        ? "lançamento"
                                                        : "lançamentos"}
                                                </p>
                                            </div>
                                        </header>

                                        <div
                                            className="
                                                space-y-4
                                                p-5
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        min-w-0
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-muted-foreground
                                                    "
                                                >
                                                    <FiTrendingUp
                                                        size={
                                                            16
                                                        }
                                                        aria-hidden="true"
                                                        className="
                                                            shrink-0
                                                            text-success
                                                        "
                                                    />

                                                    Receitas
                                                </span>

                                                <strong
                                                    className="
                                                        min-w-0
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-success
                                                    "
                                                    title={formatCurrency(
                                                        incomeCents
                                                    )}
                                                >
                                                    {formatCurrency(
                                                        incomeCents
                                                    )}
                                                </strong>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        min-w-0
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-muted-foreground
                                                    "
                                                >
                                                    <FiTrendingDown
                                                        size={
                                                            16
                                                        }
                                                        aria-hidden="true"
                                                        className="
                                                            shrink-0
                                                            text-danger
                                                        "
                                                    />

                                                    Despesas
                                                </span>

                                                <strong
                                                    className="
                                                        min-w-0
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-danger
                                                    "
                                                    title={formatCurrency(
                                                        expenseCents
                                                    )}
                                                >
                                                    {formatCurrency(
                                                        expenseCents
                                                    )}
                                                </strong>
                                            </div>

                                            <div
                                                className="
                                                    border-t
                                                    border-border
                                                    pt-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            text-sm
                                                            font-medium
                                                            text-foreground
                                                        "
                                                    >
                                                        Saldo
                                                    </span>

                                                    <strong
                                                        className={`
                                                            min-w-0
                                                            truncate
                                                            text-base
                                                            font-semibold
                                                            ${balancePresentation.valueClassName}
                                                        `}
                                                        title={formatCurrency(
                                                            balanceCents
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            balanceCents
                                                        )}
                                                    </strong>
                                                </div>

                                                <span
                                                    className={`
                                                        mt-2
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5 py-1
                                                        text-xs
                                                        font-medium
                                                        ${balancePresentation.containerClassName}
                                                    `}
                                                >
                                                    {
                                                        balancePresentation.label
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

export default History;