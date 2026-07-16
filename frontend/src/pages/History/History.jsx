import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    FiAlertCircle,
    FiArrowDownRight,
    FiArrowUpRight,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiDollarSign,
    FiFileText,
    FiHash,
    FiMinus,
    FiRefreshCw,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";

import HistoryTransactionList from "../../components/history/HistoryTransactionList.jsx";

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

const TONE_STYLES = {
    success: {
        heroGradient:
            "from-emerald-500 via-emerald-600 to-teal-700",

        softGradient:
            "from-emerald-500/16 via-emerald-500/6 to-transparent",

        iconContainer:
            "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",

        value:
            "text-emerald-600 dark:text-emerald-400",

        badge:
            "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",

        glow:
            "bg-emerald-300/25",
    },

    danger: {
        heroGradient:
            "from-rose-500 via-rose-600 to-red-700",

        softGradient:
            "from-rose-500/16 via-rose-500/6 to-transparent",

        iconContainer:
            "bg-rose-500 text-white shadow-lg shadow-rose-500/20",

        value:
            "text-rose-600 dark:text-rose-400",

        badge:
            "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",

        glow:
            "bg-rose-300/25",
    },

    neutral: {
        heroGradient:
            "from-slate-600 via-slate-700 to-slate-900",

        softGradient:
            "from-slate-500/14 via-slate-500/5 to-transparent",

        iconContainer:
            "bg-slate-600 text-white shadow-lg shadow-slate-500/20",

        value:
            "text-foreground",

        badge:
            "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:text-slate-300",

        glow:
            "bg-slate-300/20",
    },
};

function normalizeCents(value) {
    const normalizedValue =
        Number(value);

    return Number.isFinite(
        normalizedValue,
    )
        ? normalizedValue
        : 0;
}

function normalizeTransactionCount(
    value,
) {
    const normalizedValue =
        Number(value);

    return Number.isFinite(
        normalizedValue,
    )
        ? Math.max(
            0,
            Math.trunc(
                normalizedValue,
            ),
        )
        : 0;
}

function getYearPageStart(year) {
    const normalizedYear =
        Math.min(
            Math.max(
                Number(year),
                MIN_YEAR,
            ),
            MAX_YEAR,
        );

    const pageIndex =
        Math.floor(
            (
                normalizedYear -
                MIN_YEAR
            ) /
            YEARS_PER_PAGE,
        );

    return Math.min(
        MIN_YEAR +
        pageIndex *
        YEARS_PER_PAGE,
        MAX_YEAR -
        YEARS_PER_PAGE +
        1,
    );
}

function getBalancePresentation(
    balanceCents,
) {
    const balance =
        normalizeCents(
            balanceCents,
        );

    if (balance > 0) {
        return {
            tone: "success",
            label:
                "Saldo positivo",
            icon:
                FiArrowUpRight,
        };
    }

    if (balance < 0) {
        return {
            tone: "danger",
            label:
                "Saldo negativo",
            icon:
                FiArrowDownRight,
        };
    }

    return {
        tone: "neutral",
        label:
            "Saldo zerado",
        icon:
            FiMinus,
    };
}

function getMovementPercent(
    value,
    total,
) {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        Math.max(
            (
                value /
                total
            ) *
            100,
            0,
        ),
        100,
    );
}

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return fallbackMessage;
}

function HistoryLoading() {
    return (
        <div className="animate-pulse space-y-5">
            <div
                className="
                    grid gap-4
                    lg:grid-cols-12
                "
            >
                <div
                    className="
                        h-64
                        rounded-3xl
                        bg-surface-muted
                        lg:col-span-6
                    "
                />

                {[1, 2].map(
                    (item) => (
                        <div
                            key={
                                item
                            }
                            className="
                                h-64
                                rounded-3xl
                                border
                                border-border
                                bg-surface
                                lg:col-span-3
                            "
                        />
                    ),
                )}
            </div>

            <div
                className="
                    grid gap-4
                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {Array.from({
                    length: 6,
                }).map(
                    (
                        _,
                        index,
                    ) => (
                        <article
                            key={
                                index
                            }
                            className="
                                h-72
                                rounded-3xl
                                border
                                border-border
                                bg-surface
                                p-5
                                shadow-card
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
                                <div
                                    className="
                                        size-12
                                        rounded-2xl
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        h-6
                                        w-20
                                        rounded-full
                                        bg-surface-muted
                                    "
                                />
                            </div>

                            <div
                                className="
                                    mt-6
                                    h-16
                                    rounded-2xl
                                    bg-surface-muted
                                "
                            />

                            <div
                                className="
                                    mt-3
                                    h-16
                                    rounded-2xl
                                    bg-surface-muted
                                "
                            />

                            <div
                                className="
                                    mt-4
                                    h-12
                                    rounded-xl
                                    bg-surface-muted
                                "
                            />
                        </article>
                    ),
                )}
            </div>
        </div>
    );
}

function AnnualBalanceCard({
    year,
    balanceCents,
    transactionCount,
}) {
    const presentation =
        getBalancePresentation(
            balanceCents,
        );

    const styles =
        TONE_STYLES[
        presentation.tone
        ];

    const StatusIcon =
        presentation.icon;

    return (
        <article
            className={`
                group
                relative
                min-h-64
                min-w-0
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                p-5
                text-white
                shadow-xl
                shadow-slate-900/10
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                sm:p-6
                lg:col-span-6

                ${styles.heroGradient}
            `}
        >
            <div
                aria-hidden="true"
                className="
                    absolute
                    -right-16
                    -top-20
                    size-56
                    rounded-full
                    bg-white/15
                    blur-2xl
                    transition-transform
                    duration-500
                    group-hover:scale-110
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    -bottom-24
                    -left-16
                    size-56
                    rounded-full
                    bg-black/10
                    blur-2xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute inset-0
                    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_38%)]
                "
            />

            <div
                className="
                    relative
                    flex h-full
                    flex-col
                    justify-between
                    gap-8
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-sm
                                font-medium
                                text-white/75
                            "
                        >
                            Saldo acumulado em{" "}
                            {year}
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-white/60
                            "
                        >
                            Resultado de todos os meses do ano
                        </p>
                    </div>

                    <span
                        className="
                            flex
                            size-11
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
                        <FiDollarSign
                            size={21}
                            aria-hidden="true"
                        />
                    </span>
                </div>

                <div>
                    <p
                        className="
                            truncate
                            text-3xl
                            font-semibold
                            tracking-tight
                            sm:text-4xl
                        "
                        title={formatCurrency(
                            balanceCents,
                        )}
                    >
                        {formatCurrency(
                            balanceCents,
                        )}
                    </p>

                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-white/15
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-white
                                ring-1
                                ring-inset
                                ring-white/20
                                backdrop-blur-sm
                            "
                        >
                            <StatusIcon
                                size={14}
                                aria-hidden="true"
                            />

                            {
                                presentation.label
                            }
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-xs
                                font-medium
                                text-white/70
                            "
                        >
                            <FiHash
                                size={13}
                                aria-hidden="true"
                            />

                            {
                                transactionCount
                            }{" "}
                            {transactionCount ===
                                1
                                ? "lançamento"
                                : "lançamentos"}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function AnnualValueCard({
    title,
    description,
    value,
    icon: Icon,
    tone,
}) {
    const styles =
        TONE_STYLES[tone];

    const positive =
        tone === "success";

    return (
        <article
            className="
                group
                relative
                min-h-64
                min-w-0
                overflow-hidden
                rounded-3xl
                border
                border-border
                bg-surface
                p-5
                shadow-card
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                lg:col-span-3
            "
        >
            <div
                aria-hidden="true"
                className={`
                    absolute
                    inset-x-0
                    top-0
                    h-32
                    bg-gradient-to-b

                    ${styles.softGradient}
                `}
            />

            <div
                aria-hidden="true"
                className={`
                    absolute
                    -right-12
                    -top-12
                    size-32
                    rounded-full
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover:scale-125

                    ${styles.glow}
                `}
            />

            <div
                className="
                    relative
                    flex h-full
                    flex-col
                    justify-between
                    gap-7
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            {title}
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            {description}
                        </p>
                    </div>

                    <span
                        className={`
                            flex
                            size-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            transition-transform
                            duration-300
                            group-hover:scale-105

                            ${styles.iconContainer}
                        `}
                    >
                        <Icon
                            size={20}
                            aria-hidden="true"
                        />
                    </span>
                </div>

                <div>
                    <p
                        className={`
                            truncate
                            text-2xl
                            font-semibold
                            tracking-tight

                            ${styles.value}
                        `}
                        title={value}
                    >
                        {value}
                    </p>

                    <span
                        className={`
                            mt-4
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-medium

                            ${styles.badge}
                        `}
                    >
                        {positive ? (
                            <FiArrowUpRight
                                size={13}
                                aria-hidden="true"
                            />
                        ) : (
                            <FiArrowDownRight
                                size={13}
                                aria-hidden="true"
                            />
                        )}

                        Total no período
                    </span>
                </div>
            </div>
        </article>
    );
}

function MonthCard({
    monthData,
}) {
    const incomeCents =
        normalizeCents(
            monthData
                .totalIncomeCents,
        );

    const expenseCents =
        normalizeCents(
            monthData
                .totalExpenseCents,
        );

    const balanceCents =
        normalizeCents(
            monthData
                .balanceCents,
        );

    const transactionCount =
        normalizeTransactionCount(
            monthData
                .transactionCount,
        );

    const presentation =
        getBalancePresentation(
            balanceCents,
        );

    const styles =
        TONE_STYLES[
        presentation.tone
        ];

    const BalanceIcon =
        presentation.icon;

    const totalMovement =
        incomeCents +
        expenseCents;

    const incomePercent =
        getMovementPercent(
            incomeCents,
            totalMovement,
        );

    const expensePercent =
        getMovementPercent(
            expenseCents,
            totalMovement,
        );

    const monthName =
        getMonthName(
            monthData.month,
        );

    const monthNumber =
        String(
            monthData.month,
        ).padStart(
            2,
            "0",
        );

    return (
        <article
            className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-3xl
                border
                border-border
                bg-surface
                shadow-card
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >
            <div
                aria-hidden="true"
                className={`
                    absolute
                    inset-x-0
                    top-0
                    h-36
                    bg-gradient-to-b

                    ${styles.softGradient}
                `}
            />

            <div
                aria-hidden="true"
                className={`
                    absolute
                    -right-14
                    -top-14
                    size-36
                    rounded-full
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover:scale-125

                    ${styles.glow}
                `}
            />

            <header
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                    px-5
                    pb-4
                    pt-5
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <span
                        className={`
                            flex
                            size-12
                            shrink-0
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            transition-transform
                            duration-300
                            group-hover:scale-105

                            ${styles.iconContainer}
                        `}
                    >
                        <span
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                leading-none
                                text-white/70
                            "
                        >
                            mês
                        </span>

                        <span
                            className="
                                mt-0.5
                                text-base
                                font-bold
                                leading-none
                            "
                        >
                            {monthNumber}
                        </span>
                    </span>

                    <div className="min-w-0">
                        <h2
                            className="
                                truncate
                                text-base
                                font-semibold
                                capitalize
                                text-foreground
                            "
                        >
                            {monthName}
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-muted-foreground
                            "
                        >
                            {monthData.year}
                        </p>
                    </div>
                </div>

                <span
                    className={`
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-medium

                        ${styles.badge}
                    `}
                >
                    <BalanceIcon
                        size={13}
                        aria-hidden="true"
                    />

                    {
                        presentation.label
                    }
                </span>
            </header>

            <div
                className="
                    relative
                    space-y-3
                    px-5
                    pb-5
                "
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-emerald-500/10
                        bg-emerald-500/[0.06]
                        p-3.5
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
                                text-xs
                                font-medium
                                text-muted-foreground
                            "
                        >
                            <span
                                className="
                                    flex
                                    size-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-500/12
                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            >
                                <FiTrendingUp
                                    size={15}
                                    aria-hidden="true"
                                />
                            </span>

                            Receitas
                        </span>

                        <strong
                            className="
                                min-w-0
                                truncate
                                text-sm
                                font-semibold
                                text-emerald-600
                                dark:text-emerald-400
                            "
                            title={formatCurrency(
                                incomeCents,
                            )}
                        >
                            {formatCurrency(
                                incomeCents,
                            )}
                        </strong>
                    </div>

                    <div
                        className="
                            mt-3
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-emerald-500/10
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-emerald-500
                                transition-[width]
                                duration-500
                            "
                            style={{
                                width: `${incomePercent}%`,
                            }}
                        />
                    </div>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-rose-500/10
                        bg-rose-500/[0.06]
                        p-3.5
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
                                text-xs
                                font-medium
                                text-muted-foreground
                            "
                        >
                            <span
                                className="
                                    flex
                                    size-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-rose-500/12
                                    text-rose-600
                                    dark:text-rose-400
                                "
                            >
                                <FiTrendingDown
                                    size={15}
                                    aria-hidden="true"
                                />
                            </span>

                            Despesas
                        </span>

                        <strong
                            className="
                                min-w-0
                                truncate
                                text-sm
                                font-semibold
                                text-rose-600
                                dark:text-rose-400
                            "
                            title={formatCurrency(
                                expenseCents,
                            )}
                        >
                            {formatCurrency(
                                expenseCents,
                            )}
                        </strong>
                    </div>

                    <div
                        className="
                            mt-3
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-rose-500/10
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-rose-500
                                transition-[width]
                                duration-500
                            "
                            style={{
                                width: `${expensePercent}%`,
                            }}
                        />
                    </div>
                </div>

                <div
                    className="
                        flex
                        items-end
                        justify-between
                        gap-4
                        border-t
                        border-border
                        pt-4
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                text-muted-foreground
                            "
                        >
                            Saldo do mês
                        </p>

                        <p
                            className={`
                                mt-1
                                truncate
                                text-xl
                                font-semibold
                                tracking-tight

                                ${styles.value}
                            `}
                            title={formatCurrency(
                                balanceCents,
                            )}
                        >
                            {formatCurrency(
                                balanceCents,
                            )}
                        </p>
                    </div>

                    <span
                        title={`${transactionCount} lançamentos`}
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-xl
                            bg-surface-muted
                            px-2.5
                            py-2
                            text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        <FiHash
                            size={13}
                            aria-hidden="true"
                        />

                        {
                            transactionCount
                        }
                    </span>
                </div>
            </div>
        </article>
    );
}

function EmptyHistory({
    year,
}) {
    return (
        <section
            className="
                relative
                flex
                min-h-72
                overflow-hidden
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-border
                bg-surface
                p-6
                text-center
                shadow-card
            "
        >
            <div
                aria-hidden="true"
                className="
                    absolute
                    -right-16
                    -top-16
                    size-48
                    rounded-full
                    bg-sky-500/10
                    blur-3xl
                "
            />

            <span
                className="
                    relative
                    flex
                    size-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-sky-500/12
                    text-sky-600
                    ring-1
                    ring-inset
                    ring-sky-500/15
                    dark:text-sky-400
                "
            >
                <FiFileText
                    size={23}
                    aria-hidden="true"
                />
            </span>

            <h2
                className="
                    relative
                    mt-4
                    text-lg
                    font-semibold
                    text-foreground
                "
            >
                Nenhum lançamento em{" "}
                {year}
            </h2>

            <p
                className="
                    relative
                    mt-1
                    max-w-md
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >
                Não existem receitas ou despesas registradas nesse ano.
            </p>
        </section>
    );
}

function History() {
    const currentYear =
        new Date()
            .getFullYear();

    const yearPickerReference =
        useRef(null);

    const [
        history,
        setHistory,
    ] = useState([]);

    const [
        selectedYear,
        setSelectedYear,
    ] = useState(
        currentYear,
    );

    const [
        visibleStartYear,
        setVisibleStartYear,
    ] = useState(() =>
        getYearPageStart(
            currentYear,
        ),
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

    const [
        transactionListRefreshKey,
        setTransactionListRefreshKey,
    ] = useState(0);

    const visibleYears =
        useMemo(
            () =>
                Array.from(
                    {
                        length:
                            YEARS_PER_PAGE,
                    },
                    (
                        _,
                        index,
                    ) =>
                        visibleStartYear +
                        index,
                ).filter(
                    (year) =>
                        year >=
                        MIN_YEAR &&
                        year <=
                        MAX_YEAR,
                ),
            [
                visibleStartYear,
            ],
        );

    const annualSummary =
        useMemo(
            () =>
                history.reduce(
                    (
                        accumulator,
                        monthData,
                    ) => ({
                        totalIncomeCents:
                            accumulator
                                .totalIncomeCents +
                            normalizeCents(
                                monthData
                                    .totalIncomeCents,
                            ),

                        totalExpenseCents:
                            accumulator
                                .totalExpenseCents +
                            normalizeCents(
                                monthData
                                    .totalExpenseCents,
                            ),

                        balanceCents:
                            accumulator
                                .balanceCents +
                            normalizeCents(
                                monthData
                                    .balanceCents,
                            ),

                        transactionCount:
                            accumulator
                                .transactionCount +
                            normalizeTransactionCount(
                                monthData
                                    .transactionCount,
                            ),
                    }),
                    {
                        totalIncomeCents: 0,
                        totalExpenseCents: 0,
                        balanceCents: 0,
                        transactionCount: 0,
                    },
                ),
            [history],
        );

    const loadHistory =
        useCallback(
            async ({
                initial = false,
            } = {}) => {
                if (initial) {
                    setLoading(true);
                } else {
                    setRefreshing(
                        true,
                    );
                }

                setErrorMessage("");

                try {
                    const response =
                        await dashboardService.getHistory(
                            selectedYear,
                        );

                    setHistory(
                        Array.isArray(
                            response?.history,
                        )
                            ? response.history
                            : [],
                    );

                    return true;
                } catch (error) {
                    setHistory([]);

                    setErrorMessage(
                        getErrorMessage(
                            error,
                            "Não foi possível carregar o histórico.",
                        ),
                    );

                    return false;
                } finally {
                    setLoading(false);
                    setRefreshing(
                        false,
                    );
                }
            },
            [selectedYear],
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

        function handlePointerDown(
            event,
        ) {
            if (
                yearPickerReference.current &&
                !yearPickerReference.current.contains(
                    event.target,
                )
            ) {
                setYearPickerOpen(
                    false,
                );
            }
        }

        function handleKeyDown(
            event,
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                setYearPickerOpen(
                    false,
                );
            }
        }

        document.addEventListener(
            "mousedown",
            handlePointerDown,
        );

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handlePointerDown,
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [yearPickerOpen]);

    function toggleYearPicker() {
        setVisibleStartYear(
            getYearPageStart(
                selectedYear,
            ),
        );

        setYearPickerOpen(
            (currentValue) =>
                !currentValue,
        );
    }

    function handleSelectYear(
        year,
    ) {
        setSelectedYear(year);
        setYearPickerOpen(false);
    }

    function handleSelectCurrentYear() {
        setSelectedYear(
            currentYear,
        );

        setVisibleStartYear(
            getYearPageStart(
                currentYear,
            ),
        );

        setYearPickerOpen(false);
    }

    function handlePreviousYears() {
        setVisibleStartYear(
            (
                currentStartYear,
            ) =>
                Math.max(
                    currentStartYear -
                    YEARS_PER_PAGE,
                    MIN_YEAR,
                ),
        );
    }

    function handleNextYears() {
        setVisibleStartYear(
            (
                currentStartYear,
            ) =>
                Math.min(
                    currentStartYear +
                    YEARS_PER_PAGE,
                    MAX_YEAR -
                    YEARS_PER_PAGE +
                    1,
                ),
        );
    }

    async function handleRefreshHistory() {
        await loadHistory();

        setTransactionListRefreshKey(
            (currentKey) =>
                currentKey + 1,
        );
    }

    const previousDisabled =
        visibleStartYear <=
        MIN_YEAR;

    const nextDisabled =
        visibleStartYear +
        YEARS_PER_PAGE -
        1 >=
        MAX_YEAR;

    const firstVisibleYear =
        visibleYears[0] ??
        visibleStartYear;

    const lastVisibleYear =
        visibleYears[
        visibleYears.length -
        1
        ] ??
        visibleStartYear;

    return (
        <div
            className="
                w-full
                min-w-0
                max-w-none
                px-4
                py-5
                sm:px-6
                sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex
                    w-full
                    min-w-0
                    flex-col
                    gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                mb-2
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-sky-500/10
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-sky-700
                                ring-1
                                ring-inset
                                ring-sky-500/15
                                dark:text-sky-300
                            "
                        >
                            <FiCalendar
                                size={13}
                                aria-hidden="true"
                            />

                            Visão por ano
                        </div>

                        <h1
                            className="
                                truncate
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-foreground
                            "
                        >
                            Histórico financeiro
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-muted-foreground
                            "
                        >
                            Compare receitas, despesas, saldo e movimentações de cada período.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            w-full
                            flex-col
                            gap-2
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
                                    border
                                    border-sky-500/15
                                    bg-sky-500/[0.06]
                                    px-4
                                    text-sm
                                    font-medium
                                    text-foreground
                                    shadow-sm
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:bg-sky-500/10
                                    hover:shadow-md
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
                                            text-sky-600
                                            dark:text-sky-400
                                        "
                                    />

                                    {
                                        selectedYear
                                    }
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
                                        right-0
                                        top-full
                                        z-50
                                        mt-2
                                        w-full
                                        min-w-72
                                        rounded-3xl
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
                                            rounded-2xl
                                            bg-surface-muted
                                            p-1
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
                                                rounded-xl
                                                text-muted-foreground
                                                transition-colors
                                                hover:bg-surface
                                                hover:text-foreground
                                                disabled:pointer-events-none
                                                disabled:opacity-35
                                            "
                                        >
                                            <FiChevronLeft
                                                size={18}
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
                                                firstVisibleYear
                                            }
                                            {" — "}
                                            {
                                                lastVisibleYear
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
                                                rounded-xl
                                                text-muted-foreground
                                                transition-colors
                                                hover:bg-surface
                                                hover:text-foreground
                                                disabled:pointer-events-none
                                                disabled:opacity-35
                                            "
                                        >
                                            <FiChevronRight
                                                size={18}
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
                                                year,
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
                                                                year,
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
                                                            transition-all

                                                            ${isSelected
                                                                ? "border-transparent bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                                                                : "border-transparent text-foreground hover:border-border hover:bg-surface-hover"
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
                                                                        bg-sky-500
                                                                    "
                                                                />
                                                            )}
                                                    </button>
                                                );
                                            },
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
                                                rounded-xl
                                                text-sm
                                                font-medium
                                                text-sky-600
                                                transition-colors
                                                hover:bg-sky-500/10
                                                dark:text-sky-400
                                            "
                                        >
                                            <FiCalendar
                                                size={15}
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
                            onClick={
                                handleRefreshHistory
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
                                border
                                border-border
                                bg-surface
                                px-4
                                text-sm
                                font-medium
                                text-foreground
                                shadow-sm
                                transition-all
                                hover:-translate-y-0.5
                                hover:bg-surface-hover
                                hover:shadow-md
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

                {errorMessage && (
                    <div
                        role="alert"
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-rose-500/15
                            bg-rose-500/[0.08]
                            px-4
                            py-3
                            text-sm
                            text-rose-700
                            dark:text-rose-300
                        "
                    >
                        <span
                            className="
                                flex
                                size-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-rose-500/12
                            "
                        >
                            <FiAlertCircle
                                size={17}
                                aria-hidden="true"
                            />
                        </span>

                        <p
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            {errorMessage}
                        </p>
                    </div>
                )}

                {loading ? (
                    <HistoryLoading />
                ) : history.length ===
                    0 ? (
                    <EmptyHistory
                        year={
                            selectedYear
                        }
                    />
                ) : (
                    <>
                        <section
                            aria-label={`Resumo financeiro de ${selectedYear}`}
                            className="
                                grid
                                gap-4
                                lg:grid-cols-12
                            "
                        >
                            <AnnualBalanceCard
                                year={
                                    selectedYear
                                }
                                balanceCents={
                                    annualSummary.balanceCents
                                }
                                transactionCount={
                                    annualSummary.transactionCount
                                }
                            />

                            <AnnualValueCard
                                title="Receitas do ano"
                                description="Todas as entradas registradas no período."
                                value={formatCurrency(
                                    annualSummary.totalIncomeCents,
                                )}
                                icon={
                                    FiTrendingUp
                                }
                                tone="success"
                            />

                            <AnnualValueCard
                                title="Despesas do ano"
                                description="Todas as saídas registradas no período."
                                value={formatCurrency(
                                    annualSummary.totalExpenseCents,
                                )}
                                icon={
                                    FiTrendingDown
                                }
                                tone="danger"
                            />
                        </section>

                        <section
                            aria-labelledby="monthly-history-title"
                            className="space-y-4"
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <h2
                                        id="monthly-history-title"
                                        className="
                                            text-lg
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        Resumo por mês
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        Veja como suas movimentações se distribuíram em{" "}
                                        {
                                            selectedYear
                                        }
                                        .
                                    </p>
                                </div>

                                <span
                                    className="
                                        inline-flex
                                        w-fit
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-surface-muted
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-medium
                                        text-muted-foreground
                                    "
                                >
                                    <FiCalendar
                                        size={13}
                                        aria-hidden="true"
                                    />

                                    {
                                        history.length
                                    }{" "}
                                    {history.length ===
                                        1
                                        ? "mês com movimentação"
                                        : "meses com movimentação"}
                                </span>
                            </div>

                            <div
                                aria-label={`Histórico financeiro de ${selectedYear}`}
                                className="
                                    grid
                                    gap-4
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                "
                            >
                                {history.map(
                                    (
                                        monthData,
                                    ) => (
                                        <MonthCard
                                            key={
                                                monthData.key ??
                                                `${monthData.year}-${monthData.month}`
                                            }
                                            monthData={
                                                monthData
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </section>
                    </>
                )}

                <HistoryTransactionList
                    year={
                        selectedYear
                    }
                    refreshKey={
                        transactionListRefreshKey
                    }
                />
            </div>
        </div>
    );
}

export default History;