import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    FiActivity,
    FiAlertCircle,
    FiArrowDownRight,
    FiArrowUpRight,
    FiDollarSign,
    FiList,
    FiMinus,
    FiRefreshCw,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";

import {
    dashboardService,
} from "../../services/dashboardService.js";

import TransactionFilters from "../../components/transactions/TransactionFilters.jsx";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const STATUS_STYLES = {
    success: {
        heroGradient:
            "from-emerald-500 via-emerald-600 to-teal-700",

        softGradient:
            "from-emerald-500/16 via-emerald-500/6 to-transparent",

        iconContainer:
            "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",

        softIconContainer:
            "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400",

        value:
            "text-emerald-600 dark:text-emerald-400",

        badge:
            "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",

        dot:
            "bg-emerald-400",

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

        softIconContainer:
            "bg-rose-500/12 text-rose-600 ring-1 ring-inset ring-rose-500/15 dark:text-rose-400",

        value:
            "text-rose-600 dark:text-rose-400",

        badge:
            "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",

        dot:
            "bg-rose-400",

        glow:
            "bg-rose-300/25",
    },

    info: {
        heroGradient:
            "from-sky-500 via-blue-600 to-indigo-700",

        softGradient:
            "from-sky-500/16 via-sky-500/6 to-transparent",

        iconContainer:
            "bg-sky-500 text-white shadow-lg shadow-sky-500/20",

        softIconContainer:
            "bg-sky-500/12 text-sky-600 ring-1 ring-inset ring-sky-500/15 dark:text-sky-400",

        value:
            "text-sky-600 dark:text-sky-400",

        badge:
            "bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-300",

        dot:
            "bg-sky-400",

        glow:
            "bg-sky-300/25",
    },

    warning: {
        heroGradient:
            "from-amber-400 via-orange-500 to-orange-600",

        softGradient:
            "from-amber-500/16 via-amber-500/6 to-transparent",

        iconContainer:
            "bg-amber-500 text-white shadow-lg shadow-amber-500/20",

        softIconContainer:
            "bg-amber-500/12 text-amber-600 ring-1 ring-inset ring-amber-500/15 dark:text-amber-400",

        value:
            "text-amber-600 dark:text-amber-400",

        badge:
            "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-300",

        dot:
            "bg-amber-400",

        glow:
            "bg-amber-300/25",
    },

    neutral: {
        heroGradient:
            "from-slate-600 via-slate-700 to-slate-900",

        softGradient:
            "from-slate-500/14 via-slate-500/5 to-transparent",

        iconContainer:
            "bg-slate-600 text-white shadow-lg shadow-slate-500/20",

        softIconContainer:
            "bg-slate-500/12 text-slate-600 ring-1 ring-inset ring-slate-500/15 dark:text-slate-300",

        value:
            "text-foreground",

        badge:
            "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:text-slate-300",

        dot:
            "bg-slate-400",

        glow:
            "bg-slate-300/20",
    },
};

function normalizeCents(value) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : 0;
}

function getBalanceStatus(value) {
    const normalizedValue =
        normalizeCents(value);

    if (normalizedValue > 0) {
        return {
            tone: "success",
            label: "Saldo positivo",
            icon: FiArrowUpRight,
        };
    }

    if (normalizedValue < 0) {
        return {
            tone: "danger",
            label: "Saldo negativo",
            icon: FiArrowDownRight,
        };
    }

    return {
        tone: "neutral",
        label: "Saldo zerado",
        icon: FiMinus,
    };
}

function getIncomeStatus(value) {
    const normalizedValue =
        normalizeCents(value);

    if (normalizedValue > 0) {
        return {
            tone: "success",
            label: "Receitas recebidas",
            icon: FiArrowUpRight,
        };
    }

    if (normalizedValue < 0) {
        return {
            tone: "danger",
            label: "Receita negativa",
            icon: FiArrowDownRight,
        };
    }

    return {
        tone: "neutral",
        label: "Sem receitas",
        icon: FiMinus,
    };
}

function getExpenseStatus(value) {
    const normalizedValue =
        normalizeCents(value);

    if (normalizedValue > 0) {
        return {
            tone: "danger",
            label: "Despesas registradas",
            icon: FiArrowDownRight,
        };
    }

    if (normalizedValue < 0) {
        return {
            tone: "success",
            label: "Estorno ou ajuste",
            icon: FiArrowUpRight,
        };
    }

    return {
        tone: "neutral",
        label: "Sem despesas",
        icon: FiMinus,
    };
}

function getTransactionPresentation(
    transaction
) {
    const isIncome =
        transaction.type === "INCOME";

    return isIncome
        ? {
            label: "Receita",
            sign: "+",
            icon: FiTrendingUp,

            iconClassName:
                "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400",

            badgeClassName:
                "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",

            valueClassName:
                "text-emerald-600 dark:text-emerald-400",

            hoverClassName:
                "hover:bg-emerald-500/[0.035]",
        }
        : {
            label: "Despesa",
            sign: "−",
            icon: FiTrendingDown,

            iconClassName:
                "bg-rose-500/12 text-rose-600 ring-1 ring-inset ring-rose-500/15 dark:text-rose-400",

            badgeClassName:
                "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",

            valueClassName:
                "text-rose-600 dark:text-rose-400",

            hoverClassName:
                "hover:bg-rose-500/[0.035]",
        };
}

function formatTransactionValue(
    transaction
) {
    const presentation =
        getTransactionPresentation(
            transaction
        );

    const amountCents = Math.abs(
        normalizeCents(
            transaction.amountCents
        )
    );

    return `${presentation.sign} ${formatCurrency(
        amountCents
    )}`;
}

function DashboardLoading() {
    return (
        <div
            className="
                w-full min-w-0
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div className="animate-pulse">
                <div
                    className="
                        mb-6 flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                size-12 rounded-2xl
                                bg-surface-muted
                            "
                        />

                        <div className="space-y-2">
                            <div
                                className="
                                    h-7 w-52
                                    rounded-lg
                                    bg-surface-muted
                                "
                            />

                            <div
                                className="
                                    h-4 w-72
                                    max-w-full
                                    rounded-lg
                                    bg-surface-muted
                                "
                            />
                        </div>
                    </div>

                    <div
                        className="
                            h-10 w-28
                            rounded-xl
                            bg-surface-muted
                        "
                    />
                </div>

                <div
                    className="
                        grid gap-4
                        lg:grid-cols-12
                    "
                >
                    <div
                        className="
                            h-56 rounded-3xl
                            bg-surface-muted
                            lg:col-span-6
                        "
                    />

                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="
                                h-56 rounded-3xl
                                border border-border
                                bg-surface
                                lg:col-span-3
                            "
                        />
                    ))}
                </div>

                <div
                    className="
                        mt-4 grid gap-4
                        sm:grid-cols-3
                    "
                >
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="
                                h-24 rounded-2xl
                                border border-border
                                bg-surface
                            "
                        />
                    ))}
                </div>

                <div
                    className="
                        mt-6 h-80
                        rounded-3xl
                        border border-border
                        bg-surface
                    "
                />
            </div>
        </div>
    );
}

function DashboardError({
    message,
    onRetry,
}) {
    return (
        <div
            className="
                w-full min-w-0
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                role="alert"
                className="
                    relative flex min-h-72
                    overflow-hidden
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border border-rose-500/15
                    bg-surface
                    p-6
                    text-center
                    shadow-card
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        absolute -right-16 -top-16
                        size-48 rounded-full
                        bg-rose-500/10 blur-3xl
                    "
                />

                <span
                    className="
                        relative flex size-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-rose-500/12
                        text-rose-600
                        ring-1 ring-inset
                        ring-rose-500/15
                        dark:text-rose-400
                    "
                >
                    <FiAlertCircle
                        size={24}
                        aria-hidden="true"
                    />
                </span>

                <h2
                    className="
                        relative mt-4
                        text-lg font-semibold
                        text-foreground
                    "
                >
                    Não foi possível carregar
                    a Dashboard
                </h2>

                <p
                    className="
                        relative mt-1
                        max-w-md
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        relative mt-5
                        inline-flex min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-primary
                        px-4
                        text-sm
                        font-medium
                        text-primary-foreground
                        shadow-sm
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-primary-hover
                        hover:shadow-md
                    "
                >
                    <FiRefreshCw
                        size={17}
                        aria-hidden="true"
                    />

                    Tentar novamente
                </button>
            </div>
        </div>
    );
}

function MainBalanceCard({
    value,
    status,
}) {
    const StatusIcon = status.icon;
    const styles =
        STATUS_STYLES[status.tone];

    return (
        <article
            className={`
                group relative
                min-h-56 min-w-0
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                ${styles.heroGradient}
                p-5 text-white
                shadow-xl
                shadow-slate-900/10
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                sm:p-6
                lg:col-span-6
            `}
        >
            <div
                aria-hidden="true"
                className="
                    absolute -right-16 -top-20
                    size-56 rounded-full
                    bg-white/15 blur-2xl
                    transition-transform
                    duration-500
                    group-hover:scale-110
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute -bottom-24 -left-16
                    size-56 rounded-full
                    bg-black/10 blur-2xl
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
                    relative flex h-full
                    flex-col justify-between
                    gap-8
                "
            >
                <div
                    className="
                        flex items-start
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-sm font-medium
                                text-white/75
                            "
                        >
                            Saldo atual
                        </p>

                        <p
                            className="
                                mt-1 text-xs
                                text-white/60
                            "
                        >
                            Resultado das suas movimentações
                        </p>
                    </div>

                    <span
                        className="
                            flex size-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white/15
                            text-white
                            ring-1 ring-inset
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
                        title={value}
                    >
                        {value}
                    </p>

                    <div
                        className="
                            mt-4 flex
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
                                px-3 py-1.5
                                text-xs
                                font-medium
                                text-white
                                ring-1 ring-inset
                                ring-white/20
                                backdrop-blur-sm
                            "
                        >
                            <StatusIcon
                                size={14}
                                aria-hidden="true"
                            />

                            {status.label}
                        </span>

                        <span
                            className="
                                text-xs
                                font-medium
                                text-white/65
                            "
                        >
                            Visão geral
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function ValueCard({
    title,
    description,
    value,
    icon: Icon,
    status,
}) {
    const StatusIcon = status.icon;
    const styles =
        STATUS_STYLES[status.tone];

    return (
        <article
            className="
                group relative
                min-h-56 min-w-0
                overflow-hidden
                rounded-3xl
                border border-border
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
                    absolute inset-x-0 top-0
                    h-28
                    bg-gradient-to-b
                    ${styles.softGradient}
                `}
            />

            <div
                aria-hidden="true"
                className={`
                    absolute -right-12 -top-12
                    size-32 rounded-full
                    ${styles.glow}
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover:scale-125
                `}
            />

            <div
                className="
                    relative flex h-full
                    flex-col justify-between
                    gap-7
                "
            >
                <div
                    className="
                        flex items-start
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
                                mt-1 text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            {description}
                        </p>
                    </div>

                    <span
                        className={`
                            flex size-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            ${styles.iconContainer}
                            transition-transform
                            duration-300
                            group-hover:scale-105
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
                            mt-4 inline-flex
                            max-w-full
                            items-center
                            gap-1.5
                            rounded-full
                            px-2.5 py-1
                            text-xs
                            font-medium
                            ${styles.badge}
                        `}
                    >
                        <StatusIcon
                            size={13}
                            className="shrink-0"
                            aria-hidden="true"
                        />

                        <span className="truncate">
                            {status.label}
                        </span>
                    </span>
                </div>
            </div>
        </article>
    );
}

function CountCard({
    title,
    value,
    icon: Icon,
    tone,
}) {
    const styles = STATUS_STYLES[tone];

    return (
        <article
            className="
                group relative
                min-w-0 overflow-hidden
                rounded-2xl
                border border-border
                bg-surface
                p-4
                shadow-card
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >
            <div
                aria-hidden="true"
                className={`
                    absolute inset-y-0 left-0
                    w-1 ${styles.dot}
                `}
            />

            <div
                aria-hidden="true"
                className={`
                    absolute -right-10 -top-10
                    size-24 rounded-full
                    ${styles.glow}
                    blur-2xl
                `}
            />

            <div
                className="
                    relative flex
                    items-center gap-3
                "
            >
                <span
                    className={`
                        flex size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        ${styles.softIconContainer}
                        transition-transform
                        duration-300
                        group-hover:scale-105
                    `}
                >
                    <Icon
                        size={19}
                        aria-hidden="true"
                    />
                </span>

                <div className="min-w-0">
                    <p
                        className="
                            truncate text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-0.5 text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        {value}
                    </p>
                </div>
            </div>
        </article>
    );
}

const DASHBOARD_FILTER_STORAGE_PREFIX =
    "meu-saldo:dashboard-filter";

const VALID_FILTER_MODES = new Set([
    "ALL",
    "YEAR",
    "MONTH",
]);

function createDefaultDashboardFilter() {
    const currentDate = new Date();

    return {
        filterMode: "ALL",
        selectedMonth:
            currentDate.getMonth() + 1,
        selectedYear:
            currentDate.getFullYear(),
    };
}

function normalizeDashboardFilter(
    value,
) {
    const fallback =
        createDefaultDashboardFilter();

    const filterMode =
        VALID_FILTER_MODES.has(
            value?.filterMode,
        )
            ? value.filterMode
            : fallback.filterMode;

    const month = Number(
        value?.selectedMonth,
    );

    const year = Number(
        value?.selectedYear,
    );

    return {
        filterMode,

        selectedMonth:
            Number.isInteger(month) &&
                month >= 1 &&
                month <= 12
                ? month
                : fallback.selectedMonth,

        selectedYear:
            Number.isInteger(year) &&
                year >= 1900 &&
                year <= 2100
                ? year
                : fallback.selectedYear,
    };
}

function getDashboardFilterStorageKey(
    userId,
) {
    if (!userId) {
        return null;
    }

    return `${DASHBOARD_FILTER_STORAGE_PREFIX}:${userId}`;
}

function readDashboardFilter(userId) {
    const fallback =
        createDefaultDashboardFilter();

    const storageKey =
        getDashboardFilterStorageKey(
            userId,
        );

    if (
        !storageKey ||
        typeof window === "undefined"
    ) {
        return fallback;
    }

    try {
        const savedValue =
            window.localStorage.getItem(
                storageKey,
            );

        if (!savedValue) {
            return fallback;
        }

        return normalizeDashboardFilter(
            JSON.parse(savedValue),
        );
    } catch {
        return fallback;
    }
}

function saveDashboardFilter(
    userId,
    filter,
) {
    const storageKey =
        getDashboardFilterStorageKey(
            userId,
        );

    if (
        !storageKey ||
        typeof window === "undefined"
    ) {
        return;
    }

    try {
        window.localStorage.setItem(
            storageKey,
            JSON.stringify(filter),
        );
    } catch {
        // A Dashboard continua funcionando mesmo
        // quando o navegador bloqueia o localStorage.
    }
}

function createSummaryFilters(filter) {
    const normalizedFilter =
        normalizeDashboardFilter(filter);

    if (
        normalizedFilter.filterMode ===
        "MONTH"
    ) {
        return {
            filterMode: "MONTH",
            month:
                normalizedFilter.selectedMonth,
            year:
                normalizedFilter.selectedYear,
        };
    }

    if (
        normalizedFilter.filterMode ===
        "YEAR"
    ) {
        return {
            filterMode: "YEAR",
            year:
                normalizedFilter.selectedYear,
        };
    }

    return {
        filterMode: "ALL",
    };
}

function Dashboard() {
    const { user } = useAuth();

    const [dashboardFilter, setDashboardFilter] =
        useState(() =>
            readDashboardFilter(
                user?.id,
            )
        );

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const loadDashboard = useCallback(
        async ({
            initial = false,
            filter,
        } = {}) => {
            const activeFilter =
                normalizeDashboardFilter(
                    filter,
                );

            if (initial) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setErrorMessage("");

            try {
                const response =
                    await dashboardService
                        .getSummary(
                            createSummaryFilters(
                                activeFilter,
                            ),
                        );

                setSummary(
                    response.summary ?? null,
                );
            } catch (error) {
                setErrorMessage(
                    error.response?.data
                        ?.error ??
                    error.response?.data
                        ?.message ??
                    "Não foi possível carregar os dados financeiros.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [],
    );

    useEffect(() => {
        const savedFilter =
            readDashboardFilter(
                user?.id,
            );

        setDashboardFilter(
            savedFilter,
        );

        loadDashboard({
            initial: true,
            filter: savedFilter,
        });
    }, [
        loadDashboard,
        user?.id,
    ]);

    const handleApplyFilters =
        useCallback(
            (nextFilterValue) => {
                const nextFilter =
                    normalizeDashboardFilter(
                        nextFilterValue,
                    );

                setDashboardFilter(
                    nextFilter,
                );

                saveDashboardFilter(
                    user?.id,
                    nextFilter,
                );

                loadDashboard({
                    filter: nextFilter,
                });
            },
            [
                loadDashboard,
                user?.id,
            ],
        );

    if (loading) {
        return <DashboardLoading />;
    }

    if (
        errorMessage &&
        !summary
    ) {
        return (
            <DashboardError
                message={errorMessage}
                onRetry={() =>
                    loadDashboard({
                        initial: true,
                        filter:
                            dashboardFilter,
                    })
                }
            />
        );
    }

    const balanceCents =
        normalizeCents(
            summary?.balanceCents
        );

    const totalIncomeCents =
        normalizeCents(
            summary?.totalIncomeCents
        );

    const totalExpenseCents =
        normalizeCents(
            summary?.totalExpenseCents
        );

    const balanceStatus =
        getBalanceStatus(balanceCents);

    const incomeStatus =
        getIncomeStatus(
            totalIncomeCents
        );

    const expenseStatus =
        getExpenseStatus(
            totalExpenseCents
        );

    const countCards = [
        {
            title: "Total de transações",
            value:
                summary?.transactionCount ??
                0,
            icon: FiList,
            tone: "info",
        },

        {
            title: "Receitas cadastradas",
            value:
                summary?.incomeCount ?? 0,
            icon: FiTrendingUp,
            tone: "success",
        },

        {
            title: "Despesas cadastradas",
            value:
                summary?.expenseCount ?? 0,
            icon: FiTrendingDown,
            tone: "danger",
        },
    ];

    const recentTransactions =
        Array.isArray(
            summary?.recentTransactions
        )
            ? summary.recentTransactions
            : [];

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
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex min-w-0
                            items-center gap-3
                        "
                    >
                        <span
                            className="
                                hidden size-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-sky-500
                                via-blue-600
                                to-indigo-600
                                text-white
                                shadow-lg
                                shadow-blue-500/20
                                sm:flex
                            "
                        >
                            <FiActivity
                                size={21}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <div
                                className="
                                    flex flex-wrap
                                    items-center gap-2
                                "
                            >
                                <h1
                                    className="
                                        truncate
                                        text-2xl
                                        font-semibold
                                        tracking-tight
                                        text-foreground
                                    "
                                >
                                    Resumo financeiro
                                </h1>

                                <span
                                    className="
                                        rounded-full
                                        bg-sky-500/10
                                        px-2.5 py-1
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-sky-700
                                        ring-1 ring-inset
                                        ring-sky-500/15
                                        dark:text-sky-300
                                    "
                                >
                                    Visão geral
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1 text-sm
                                    text-muted-foreground
                                "
                            >
                                Visualize o desempenho das suas finanças de forma rápida.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard({
                                filter:
                                    dashboardFilter,
                            })
                        }
                        disabled={refreshing}
                        className="
                            inline-flex
                            min-h-10 w-full
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
                            shadow-sm
                            transition-all
                            hover:-translate-y-0.5
                            hover:border-primary
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
                                    ? "animate-spin text-primary"
                                    : "text-primary"
                            }
                        />

                        {refreshing
                            ? "Atualizando..."
                            : "Atualizar dados"}
                    </button>
                </header>

                <TransactionFilters
                    idPrefix="dashboard"
                    showSearch={false}
                    showResultCount
                    totalItems={
                        summary?.transactionCount ??
                        0
                    }
                    filterMode={
                        dashboardFilter.filterMode
                    }
                    selectedMonth={
                        dashboardFilter.selectedMonth
                    }
                    selectedYear={
                        dashboardFilter.selectedYear
                    }
                    disabled={
                        loading || refreshing
                    }
                    onApplyFilters={
                        handleApplyFilters
                    }
                />

                {errorMessage && (
                    <div
                        role="alert"
                        className="
                            flex items-center
                            gap-3
                            rounded-2xl
                            border
                            border-rose-500/15
                            bg-rose-500/[0.06]
                            px-4 py-3
                            text-sm
                            text-rose-700
                            dark:text-rose-300
                        "
                    >
                        <span
                            className="
                                flex size-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-rose-500/10
                            "
                        >
                            <FiAlertCircle
                                size={17}
                                aria-hidden="true"
                            />
                        </span>

                        <p className="min-w-0 flex-1">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <section
                    aria-label="Resumo de valores"
                    className="
                        grid gap-4
                        lg:grid-cols-12
                    "
                >
                    <MainBalanceCard
                        value={formatCurrency(
                            balanceCents
                        )}
                        status={balanceStatus}
                    />

                    <ValueCard
                        title="Total de receitas"
                        description="Valores que entraram na sua conta."
                        value={formatCurrency(
                            totalIncomeCents
                        )}
                        icon={FiTrendingUp}
                        status={incomeStatus}
                    />

                    <ValueCard
                        title="Total de despesas"
                        description="Valores utilizados nas suas despesas."
                        value={formatCurrency(
                            totalExpenseCents
                        )}
                        icon={FiTrendingDown}
                        status={expenseStatus}
                    />
                </section>

                <section
                    aria-label="Quantidade de transações"
                    className="
                        grid gap-4
                        sm:grid-cols-3
                    "
                >
                    {countCards.map((card) => (
                        <CountCard
                            key={card.title}
                            {...card}
                        />
                    ))}
                </section>

                <section
                    className="
                        relative min-w-0
                        overflow-hidden
                        rounded-3xl
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            absolute inset-x-0 top-0
                            h-1
                            bg-gradient-to-r
                            from-sky-500
                            via-indigo-500
                            to-violet-500
                        "
                    />

                    <header
                        className="
                            flex flex-col
                            gap-3
                            border-b
                            border-border
                            px-4 pb-4 pt-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-5
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                            "
                        >
                            <span
                                className="
                                    flex size-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-sky-500
                                    to-indigo-600
                                    text-white
                                    shadow-lg
                                    shadow-blue-500/20
                                "
                            >
                                <FiActivity
                                    size={18}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        truncate
                                        text-base
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Transações recentes
                                </h2>

                                <p
                                    className="
                                        mt-0.5 text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Acompanhe as últimas movimentações cadastradas.
                                </p>
                            </div>
                        </div>

                        <span
                            className="
                                inline-flex w-fit
                                items-center gap-2
                                rounded-full
                                bg-surface-muted
                                px-3 py-1.5
                                text-xs
                                font-medium
                                text-muted-foreground
                                ring-1 ring-inset
                                ring-border
                            "
                        >
                            <span
                                className="
                                    size-2 rounded-full
                                    bg-sky-500
                                "
                            />

                            {recentTransactions.length}
                            {recentTransactions.length === 1
                                ? " movimentação"
                                : " movimentações"}
                        </span>
                    </header>

                    {recentTransactions.length ===
                        0 ? (
                        <div
                            className="
                                relative flex
                                min-h-56
                                flex-col
                                items-center
                                justify-center
                                overflow-hidden
                                p-6
                                text-center
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    absolute left-1/2 top-1/2
                                    size-48
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    rounded-full
                                    bg-sky-500/[0.07]
                                    blur-3xl
                                "
                            />

                            <span
                                className="
                                    relative flex size-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-500/10
                                    text-sky-600
                                    ring-1 ring-inset
                                    ring-sky-500/15
                                    dark:text-sky-400
                                "
                            >
                                <FiList
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <p
                                className="
                                    relative mt-3
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Nenhuma transação cadastrada
                            </p>

                            <p
                                className="
                                    relative mt-1
                                    max-w-xs
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Assim que você adicionar uma receita ou despesa, ela aparecerá aqui.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block">
                                <table
                                    className="
                                        w-full
                                        table-fixed
                                        text-left
                                        text-sm
                                    "
                                >
                                    <thead
                                        className="
                                            bg-surface-muted
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-muted-foreground
                                        "
                                    >
                                        <tr>
                                            <th
                                                className="
                                                    w-[31%]
                                                    px-5 py-3.5
                                                "
                                            >
                                                Descrição
                                            </th>

                                            <th
                                                className="
                                                    w-[20%]
                                                    px-4 py-3.5
                                                "
                                            >
                                                Categoria
                                            </th>

                                            <th
                                                className="
                                                    w-[16%]
                                                    px-4 py-3.5
                                                "
                                            >
                                                Data
                                            </th>

                                            <th
                                                className="
                                                    w-[15%]
                                                    px-4 py-3.5
                                                "
                                            >
                                                Tipo
                                            </th>

                                            <th
                                                className="
                                                    w-[18%]
                                                    px-5 py-3.5
                                                    text-right
                                                "
                                            >
                                                Valor
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentTransactions.map(
                                            (transaction) => {
                                                const presentation =
                                                    getTransactionPresentation(
                                                        transaction
                                                    );

                                                const TransactionIcon =
                                                    presentation.icon;

                                                return (
                                                    <tr
                                                        key={
                                                            transaction.id
                                                        }
                                                        className={`
                                                            border-t
                                                            border-border
                                                            transition-colors
                                                            ${presentation.hoverClassName}
                                                        `}
                                                    >
                                                        <td
                                                            className="
                                                                px-5 py-4
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
                                                                        flex size-9
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        ${presentation.iconClassName}
                                                                    `}
                                                                >
                                                                    <TransactionIcon
                                                                        size={16}
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <p
                                                                        className="
                                                                            truncate
                                                                            font-semibold
                                                                            text-foreground
                                                                        "
                                                                        title={
                                                                            transaction.description
                                                                        }
                                                                    >
                                                                        {
                                                                            transaction.description
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            text-xs
                                                                            text-muted-foreground
                                                                        "
                                                                    >
                                                                        Movimentação financeira
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-4
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    max-w-full
                                                                    rounded-lg
                                                                    bg-surface-muted
                                                                    px-2.5 py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-muted-foreground
                                                                "
                                                                title={
                                                                    transaction.category
                                                                }
                                                            >
                                                                <span className="truncate">
                                                                    {
                                                                        transaction.category
                                                                    }
                                                                </span>
                                                            </span>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-4
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {formatDate(
                                                                transaction.date
                                                            )}
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-4
                                                            "
                                                        >
                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    px-2.5 py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${presentation.badgeClassName}
                                                                `}
                                                            >
                                                                <span
                                                                    className={`
                                                                        size-1.5
                                                                        rounded-full
                                                                        ${transaction.type ===
                                                                            "INCOME"
                                                                            ? "bg-emerald-500"
                                                                            : "bg-rose-500"
                                                                        }
                                                                    `}
                                                                />

                                                                {
                                                                    presentation.label
                                                                }
                                                            </span>
                                                        </td>

                                                        <td
                                                            className={`
                                                                truncate
                                                                px-5 py-4
                                                                text-right
                                                                font-semibold
                                                                ${presentation.valueClassName}
                                                            `}
                                                        >
                                                            {formatTransactionValue(
                                                                transaction
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                className="
                                    space-y-3 p-3
                                    md:hidden
                                "
                            >
                                {recentTransactions.map(
                                    (transaction) => {
                                        const presentation =
                                            getTransactionPresentation(
                                                transaction
                                            );

                                        const TransactionIcon =
                                            presentation.icon;

                                        return (
                                            <article
                                                key={
                                                    transaction.id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border border-border
                                                    bg-surface
                                                    p-4
                                                    shadow-sm
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:shadow-md
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex min-w-0
                                                        items-start
                                                        gap-3
                                                    "
                                                >
                                                    <span
                                                        className={`
                                                            flex size-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-2xl
                                                            ${presentation.iconClassName}
                                                        `}
                                                    >
                                                        <TransactionIcon
                                                            size={17}
                                                            aria-hidden="true"
                                                        />
                                                    </span>

                                                    <div
                                                        className="
                                                            min-w-0
                                                            flex-1
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
                                                                <h3
                                                                    className="
                                                                        truncate
                                                                        text-sm
                                                                        font-semibold
                                                                        text-foreground
                                                                    "
                                                                >
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </h3>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        truncate
                                                                        text-xs
                                                                        text-muted-foreground
                                                                    "
                                                                >
                                                                    {
                                                                        transaction.category
                                                                    }
                                                                    {" • "}
                                                                    {formatDate(
                                                                        transaction.date
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <p
                                                                className={`
                                                                    shrink-0
                                                                    text-sm
                                                                    font-semibold
                                                                    ${presentation.valueClassName}
                                                                `}
                                                            >
                                                                {formatTransactionValue(
                                                                    transaction
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`
                                                                mt-3 inline-flex
                                                                items-center
                                                                gap-1.5
                                                                rounded-full
                                                                px-2.5 py-1
                                                                text-xs
                                                                font-medium
                                                                ${presentation.badgeClassName}
                                                            `}
                                                        >
                                                            <span
                                                                className={`
                                                                    size-1.5
                                                                    rounded-full
                                                                    ${transaction.type ===
                                                                        "INCOME"
                                                                        ? "bg-emerald-500"
                                                                        : "bg-rose-500"
                                                                    }
                                                                `}
                                                            />

                                                            {
                                                                presentation.label
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Dashboard;