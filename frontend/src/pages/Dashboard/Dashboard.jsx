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

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const STATUS_STYLES = {
    success: {
        iconContainer:
            "bg-success-muted text-success",

        value:
            "text-success",

        badge:
            "bg-success-muted text-success",

        dot:
            "bg-success",
    },

    danger: {
        iconContainer:
            "bg-danger-muted text-danger",

        value:
            "text-danger",

        badge:
            "bg-danger-muted text-danger",

        dot:
            "bg-danger",
    },

    info: {
        iconContainer:
            "bg-info-muted text-info",

        value:
            "text-info",

        badge:
            "bg-info-muted text-info",

        dot:
            "bg-info",
    },

    warning: {
        iconContainer:
            "bg-warning-muted text-warning",

        value:
            "text-warning",

        badge:
            "bg-warning-muted text-warning",

        dot:
            "bg-warning",
    },

    neutral: {
        iconContainer:
            "bg-surface-muted text-muted-foreground",

        value:
            "text-foreground",

        badge:
            "bg-surface-muted text-muted-foreground",

        dot:
            "bg-muted-foreground",
    },
};

function normalizeCents(value) {
    const numberValue =
        Number(value);

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
            label: "Receita positiva",
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
            label: "Saídas registradas",
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
                "bg-success-muted text-success",

            badgeClassName:
                "bg-success-muted text-success",

            valueClassName:
                "text-success",
        }
        : {
            label: "Despesa",
            sign: "−",
            icon: FiTrendingDown,

            iconClassName:
                "bg-danger-muted text-danger",

            badgeClassName:
                "bg-danger-muted text-danger",

            valueClassName:
                "text-danger",
        };
}

function formatTransactionValue(
    transaction
) {
    const presentation =
        getTransactionPresentation(
            transaction
        );

    const amountCents =
        Math.abs(
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
                        md:grid-cols-3
                    "
                >
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                key={item}
                                className="
                                    h-40
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-surface
                                    p-5
                                "
                            >
                                <div
                                    className="
                                        h-10 w-10
                                        rounded-xl
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        mt-6 h-4 w-28
                                        rounded
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        mt-3 h-8 w-40
                                        rounded
                                        bg-surface-muted
                                    "
                                />
                            </div>
                        )
                    )}
                </div>

                <div
                    className="
                        mt-6 h-80
                        rounded-2xl
                        border
                        border-border
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
                    flex min-h-64
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border border-border
                    bg-surface
                    p-6
                    text-center
                "
            >
                <span
                    className="
                        flex size-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-danger-muted
                        text-danger
                    "
                >
                    <FiAlertCircle
                        size={22}
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
                    Não foi possível carregar
                    a Dashboard
                </h2>

                <p
                    className="
                        mt-1
                        max-w-md
                        text-sm
                        text-muted-foreground
                    "
                >
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        mt-5
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-primary
                        px-4
                        text-sm
                        font-medium
                        text-primary-foreground
                        transition-colors
                        hover:bg-primary-hover
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

function Dashboard() {
    const [
        summary,
        setSummary,
    ] = useState(null);

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

    const loadDashboard = useCallback(
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
                    await dashboardService
                        .getSummary();

                setSummary(
                    response.summary ?? null
                );
            } catch (error) {
                setErrorMessage(
                    error.response?.data
                        ?.error ??
                    "Não foi possível carregar os dados financeiros."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadDashboard({
            initial: true,
        });
    }, [loadDashboard]);

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

    const cards = [
        {
            title: "Saldo atual",
            value: formatCurrency(
                balanceCents
            ),
            icon: FiDollarSign,
            status: balanceStatus,
        },

        {
            title: "Total de receitas",
            value: formatCurrency(
                totalIncomeCents
            ),
            icon: FiTrendingUp,
            status: incomeStatus,
        },

        {
            title: "Total de despesas",
            value: formatCurrency(
                totalExpenseCents
            ),
            icon: FiTrendingDown,
            status: expenseStatus,
        },
    ];

    const countCards = [
        {
            title: "Transações",
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
                            Resumo financeiro
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Acompanhe suas receitas,
                            despesas e o saldo atual.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard()
                        }
                        disabled={refreshing}
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
                </header>

                {errorMessage && (
                    <div
                        role="alert"
                        className="
                            flex items-center
                            gap-3
                            rounded-xl
                            border border-border
                            bg-danger-muted
                            px-4 py-3
                            text-sm
                            text-danger
                        "
                    >
                        <FiAlertCircle
                            size={18}
                            className="shrink-0"
                            aria-hidden="true"
                        />

                        <p className="min-w-0 flex-1">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <section
                    aria-label="Resumo de valores"
                    className="
                        grid gap-4
                        md:grid-cols-3
                    "
                >
                    {cards.map((card) => {
                        const CardIcon =
                            card.icon;

                        const StatusIcon =
                            card.status.icon;

                        const styles =
                            STATUS_STYLES[
                            card.status.tone
                            ];

                        return (
                            <article
                                key={card.title}
                                className="
                                    relative
                                    min-w-0
                                    overflow-hidden
                                    rounded-2xl
                                    border border-border
                                    bg-surface
                                    p-5
                                    shadow-card
                                "
                            >
                                <div
                                    aria-hidden="true"
                                    className={`
                                        absolute
                                        inset-x-0 top-0
                                        h-0.5
                                        ${styles.dot}
                                    `}
                                />

                                <div
                                    className="
                                        flex items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >
                                        <p
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            {card.title}
                                        </p>

                                        <p
                                            className={`
                                                mt-3
                                                truncate
                                                text-2xl
                                                font-semibold
                                                tracking-tight
                                                ${styles.value}
                                            `}
                                            title={
                                                card.value
                                            }
                                        >
                                            {card.value}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                            flex size-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            ${styles.iconContainer}
                                        `}
                                    >
                                        <CardIcon
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-5
                                        flex items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <span
                                        className={`
                                            inline-flex
                                            min-w-0
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
                                            size={14}
                                            className="shrink-0"
                                            aria-hidden="true"
                                        />

                                        <span className="truncate">
                                            {
                                                card
                                                    .status
                                                    .label
                                            }
                                        </span>
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <section
                    aria-label="Quantidade de transações"
                    className="
                        grid gap-4
                        sm:grid-cols-3
                    "
                >
                    {countCards.map(
                        (card) => {
                            const Icon =
                                card.icon;

                            const styles =
                                STATUS_STYLES[
                                card.tone
                                ];

                            return (
                                <article
                                    key={
                                        card.title
                                    }
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        p-4
                                        shadow-card
                                    "
                                >
                                    <span
                                        className={`
                                            flex size-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            ${styles.iconContainer}
                                        `}
                                    >
                                        <Icon
                                            size={
                                                18
                                            }
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                truncate
                                                text-xs
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            {
                                                card.title
                                            }
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xl
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            {
                                                card.value
                                            }
                                        </p>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </section>

                <section
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <header
                        className="
                            flex items-center
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
                            <FiActivity
                                size={17}
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
                                    mt-0.5
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Últimas movimentações
                                cadastradas.
                            </p>
                        </div>
                    </header>

                    {recentTransactions.length ===
                        0 ? (
                        <div
                            className="
                                flex min-h-48
                                flex-col
                                items-center
                                justify-center
                                p-6
                                text-center
                            "
                        >
                            <span
                                className="
                                    flex size-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-surface-muted
                                    text-muted-foreground
                                "
                            >
                                <FiList
                                    size={20}
                                    aria-hidden="true"
                                />
                            </span>

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    font-medium
                                    text-foreground
                                "
                            >
                                Nenhuma transação
                                cadastrada
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                As movimentações recentes
                                aparecerão aqui.
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
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        <tr>
                                            <th
                                                className="
                                                    w-[30%]
                                                    px-5 py-3
                                                "
                                            >
                                                Descrição
                                            </th>

                                            <th
                                                className="
                                                    w-[20%]
                                                    px-4 py-3
                                                "
                                            >
                                                Categoria
                                            </th>

                                            <th
                                                className="
                                                    w-[16%]
                                                    px-4 py-3
                                                "
                                            >
                                                Data
                                            </th>

                                            <th
                                                className="
                                                    w-[16%]
                                                    px-4 py-3
                                                "
                                            >
                                                Tipo
                                            </th>

                                            <th
                                                className="
                                                    w-[18%]
                                                    px-5 py-3
                                                    text-right
                                                "
                                            >
                                                Valor
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentTransactions.map(
                                            (
                                                transaction
                                            ) => {
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
                                                        className="
                                                            border-t
                                                            border-border
                                                            transition-colors
                                                            hover:bg-surface-hover
                                                        "
                                                    >
                                                        <td
                                                            className="
                                                                px-5 py-3.5
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
                                                                        flex size-8
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-lg
                                                                        ${presentation.iconClassName}
                                                                    `}
                                                                >
                                                                    <TransactionIcon
                                                                        size={
                                                                            15
                                                                        }
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>

                                                                <span
                                                                    className="
                                                                        truncate
                                                                        font-medium
                                                                        text-foreground
                                                                    "
                                                                    title={
                                                                        transaction.description
                                                                    }
                                                                >
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                truncate
                                                                px-4 py-3.5
                                                                text-muted-foreground
                                                            "
                                                            title={
                                                                transaction.category
                                                            }
                                                        >
                                                            {
                                                                transaction.category
                                                            }
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {formatDate(
                                                                transaction.date
                                                            )}
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                            "
                                                        >
                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    rounded-full
                                                                    px-2.5 py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${presentation.badgeClassName}
                                                                `}
                                                            >
                                                                {
                                                                    presentation.label
                                                                }
                                                            </span>
                                                        </td>

                                                        <td
                                                            className={`
                                                                truncate
                                                                px-5 py-3.5
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
                                    divide-y
                                    divide-border
                                    md:hidden
                                "
                            >
                                {recentTransactions.map(
                                    (
                                        transaction
                                    ) => {
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
                                                    p-4
                                                    transition-colors
                                                    hover:bg-surface-hover
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        min-w-0
                                                        items-start
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
                                                            size={
                                                                16
                                                            }
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
                                                                        font-medium
                                                                        text-foreground
                                                                    "
                                                                >
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </h3>

                                                                <p
                                                                    className="
                                                                        mt-0.5
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
                                                                mt-2
                                                                inline-flex
                                                                rounded-full
                                                                px-2 py-0.5
                                                                text-xs
                                                                font-medium
                                                                ${presentation.badgeClassName}
                                                            `}
                                                        >
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