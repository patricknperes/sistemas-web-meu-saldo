import {
    ArrowDownRight,
    ArrowUpRight,
    Landmark,
    ReceiptText,
    Scale,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { cn } from "../../../lib/cn.js";
import {
    formatHistoryCurrency,
    getHistorySavingsRate,
} from "../utils/historyFormatters.js";

function MetricCard({
    icon: Icon,
    label,
    value,
    helper,
    tone = "neutral",
}) {
    const tones = {
        success: "bg-success-muted text-success",
        danger: "bg-danger-muted text-danger",
        primary: "bg-primary-soft text-primary",
        neutral: "bg-surface-muted text-muted-foreground",
    };

    return (
        <Card
            className="
                flex min-h-[172px]
                min-w-0
                flex-col
                justify-between
                p-5
                sm:p-6
            "
        >
            <div className="flex min-w-0 items-start justify-between gap-4">
                <span
                    className={cn(
                        `
                            flex size-10
                            shrink-0
                            items-center justify-center
                            rounded-control
                        `,
                        tones[tone],
                    )}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-[18px]"
                        strokeWidth={2}
                    />
                </span>

                {helper && (
                    <span
                        className="
                            min-w-0
                            text-right
                            text-xs leading-5
                            text-subtle-foreground
                        "
                    >
                        {helper}
                    </span>
                )}
            </div>

            <div className="mt-6 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>

                <p
                    title={value}
                    className="
                        money-nums
                        mt-1
                        truncate
                        text-2xl
                        font-bold
                        tracking-[-0.035em]
                        text-foreground
                    "
                >
                    {value}
                </p>
            </div>
        </Card>
    );
}

function HistorySummary({
    summary,
    periodLabel,
    loading,
}) {
    if (loading) {
        return (
            <div
                className="
                    grid animate-pulse
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-12
                "
            >
                <div
                    className="
                        h-72
                        rounded-card
                        bg-surface-muted
                        md:col-span-2
                        xl:col-span-6
                    "
                />

                <div
                    className="
                        h-44
                        rounded-card
                        bg-surface-muted
                        xl:col-span-3
                    "
                />

                <div
                    className="
                        h-44
                        rounded-card
                        bg-surface-muted
                        xl:col-span-3
                    "
                />
            </div>
        );
    }

    const positive = summary.balanceCents >= 0;
    const savingsRate = getHistorySavingsRate(summary);

    const formattedBalance = formatHistoryCurrency(
        summary.balanceCents,
    );

    const formattedIncome = formatHistoryCurrency(
        summary.totalIncomeCents,
    );

    const formattedExpense = formatHistoryCurrency(
        summary.totalExpenseCents,
    );

    return (
        <div className="grid min-w-0 gap-4 xl:grid-cols-12">
            <Card
                className="
                    relative
                    min-h-64
                    overflow-hidden
                    border-primary/15
                    bg-[linear-gradient(135deg,var(--app-surface),var(--app-primary-soft))]
                    p-6
                    sm:p-7
                    xl:col-span-6
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        size-52
                        rounded-full
                        bg-primary/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        flex h-full
                        min-w-0
                        flex-col
                        justify-between
                        gap-8
                    "
                >
                    <div className="flex min-w-0 items-start justify-between gap-4">
                        <Badge
                            variant="primary"
                            className="
                                inline-flex h-7
                                shrink-0
                                items-center gap-1.5
                                rounded-md
                                px-2.5
                                text-xs font-semibold
                            "
                        >
                            <Landmark
                                aria-hidden="true"
                                className="size-3.5 shrink-0"
                            />

                            Resultado do período
                        </Badge>

                        <span
                            title={periodLabel}
                            className="
                                min-w-0
                                truncate
                                text-right
                                text-xs
                                text-subtle-foreground
                            "
                        >
                            {periodLabel}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <p
                            title={formattedBalance}
                            className="
                                money-nums
                                truncate
                                font-mono
                                text-4xl
                                font-bold
                                tracking-[-0.055em]
                                text-foreground
                                sm:text-5xl
                            "
                        >
                            {formattedBalance}
                        </p>

                        <div
                            className="
                                mt-4
                                flex flex-wrap
                                items-center gap-2
                            "
                        >
                            <Badge
                                variant={
                                    positive
                                        ? "success"
                                        : "danger"
                                }
                                className="
                                    inline-flex h-7
                                    items-center gap-1
                                    rounded-md
                                    px-2.5
                                    text-xs font-semibold
                                "
                            >
                                {positive ? (
                                    <TrendingUp
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                ) : (
                                    <TrendingDown
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                )}

                                {positive
                                    ? "Saldo positivo"
                                    : "Saldo negativo"}
                            </Badge>

                            <span className="text-xs text-subtle-foreground">
                                Taxa de economia:{" "}
                                {savingsRate.toLocaleString("pt-BR")}%
                            </span>
                        </div>
                    </div>

                    <div
                        className="
                            grid min-w-0
                            grid-cols-2
                            gap-3
                            border-t border-border/70
                            pt-5
                        "
                    >
                        <div className="min-w-0 pr-2">
                            <p className="text-xs text-subtle-foreground">
                                Receitas consideradas
                            </p>

                            <p
                                title={formattedIncome}
                                className="
                                    money-nums
                                    mt-1
                                    truncate
                                    font-mono
                                    text-lg
                                    font-bold
                                    text-success
                                "
                            >
                                {formattedIncome}
                            </p>
                        </div>

                        <div
                            className="
                                min-w-0
                                border-l border-border/70
                                pl-4
                            "
                        >
                            <p className="text-xs text-subtle-foreground">
                                Despesas consideradas
                            </p>

                            <p
                                title={formattedExpense}
                                className="
                                    money-nums
                                    mt-1
                                    truncate
                                    font-mono
                                    text-lg
                                    font-bold
                                    text-danger
                                "
                            >
                                {formattedExpense}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <div
                className="
                    grid min-w-0
                    gap-4
                    sm:grid-cols-2
                    xl:col-span-6
                "
            >
                <MetricCard
                    icon={ArrowUpRight}
                    label="Total de receitas"
                    value={formatHistoryCurrency(
                        summary.totalIncomeCents,
                    )}
                    helper={`${summary.incomeCount ?? 0} ${summary.incomeCount === 1
                            ? "lançamento"
                            : "lançamentos"
                        }`}
                    tone="success"
                />

                <MetricCard
                    icon={ArrowDownRight}
                    label="Total de despesas"
                    value={formatHistoryCurrency(
                        summary.totalExpenseCents,
                    )}
                    helper={`${summary.expenseCount ?? 0} ${summary.expenseCount === 1
                            ? "lançamento"
                            : "lançamentos"
                        }`}
                    tone="danger"
                />

                <MetricCard
                    icon={ReceiptText}
                    label="Movimentações"
                    value={String(
                        summary.transactionCount ?? 0,
                    )}
                    helper="No período filtrado"
                    tone="primary"
                />

                <MetricCard
                    icon={Scale}
                    label="Ticket médio"
                    value={formatHistoryCurrency(
                        summary.averageTransactionCents,
                    )}
                    helper="Média por lançamento"
                />
            </div>
        </div>
    );
}

export default HistorySummary;