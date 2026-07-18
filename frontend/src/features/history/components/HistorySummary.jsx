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

function MetricCard({ icon: Icon, label, value, helper, tone = "neutral" }) {
    const tones = {
        success: "bg-success-muted text-success",
        danger: "bg-danger-muted text-danger",
        primary: "bg-primary-soft text-primary",
        neutral: "bg-surface-muted text-muted-foreground",
    };

    return (
        <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", tones[tone])}>
                    <Icon className="size-4.5" aria-hidden="true" />
                </span>
                {helper && <span className="text-right text-xs text-subtle-foreground">{helper}</span>}
            </div>
            <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>
            <p className="money-nums mt-1 truncate text-xl font-bold tracking-[-0.03em] text-foreground" title={value}>{value}</p>
        </Card>
    );
}

function HistorySummary({ summary, periodLabel, loading }) {
    if (loading) {
        return (
            <div className="grid animate-pulse gap-4 md:grid-cols-2 xl:grid-cols-12">
                <div className="h-64 rounded-card bg-surface-muted md:col-span-2 xl:col-span-6" />
                <div className="h-48 rounded-card bg-surface-muted xl:col-span-3" />
                <div className="h-48 rounded-card bg-surface-muted xl:col-span-3" />
            </div>
        );
    }

    const positive = summary.balanceCents >= 0;
    const savingsRate = getHistorySavingsRate(summary);

    return (
        <div className="grid gap-4 xl:grid-cols-12">
            <Card className="relative overflow-hidden border-primary/15 bg-[linear-gradient(135deg,var(--app-surface),var(--app-primary-soft))] p-6 xl:col-span-6 xl:p-7">
                <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <Badge variant="primary"><Landmark className="size-3.5" aria-hidden="true" />Resultado do período</Badge>
                        <span className="truncate text-xs text-subtle-foreground">{periodLabel}</span>
                    </div>
                    <p className="money-nums mt-8 truncate text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl" title={formatHistoryCurrency(summary.balanceCents)}>
                        {formatHistoryCurrency(summary.balanceCents)}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant={positive ? "success" : "danger"}>
                            {positive ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
                            {positive ? "Saldo positivo" : "Saldo negativo"}
                        </Badge>
                        <span className="text-xs text-subtle-foreground">Taxa de economia: {savingsRate.toLocaleString("pt-BR")}%</span>
                    </div>
                    <div className="mt-8 grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-subtle-foreground">Receitas consideradas</p>
                            <p className="money-nums mt-1 truncate text-base font-bold text-success">{formatHistoryCurrency(summary.totalIncomeCents)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-subtle-foreground">Despesas consideradas</p>
                            <p className="money-nums mt-1 truncate text-base font-bold text-danger">{formatHistoryCurrency(summary.totalExpenseCents)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:col-span-6">
                <MetricCard
                    icon={ArrowUpRight}
                    label="Total de receitas"
                    value={formatHistoryCurrency(summary.totalIncomeCents)}
                    helper={`${summary.incomeCount} ${summary.incomeCount === 1 ? "lançamento" : "lançamentos"}`}
                    tone="success"
                />
                <MetricCard
                    icon={ArrowDownRight}
                    label="Total de despesas"
                    value={formatHistoryCurrency(summary.totalExpenseCents)}
                    helper={`${summary.expenseCount} ${summary.expenseCount === 1 ? "lançamento" : "lançamentos"}`}
                    tone="danger"
                />
                <MetricCard
                    icon={ReceiptText}
                    label="Movimentações"
                    value={String(summary.transactionCount)}
                    helper="No período filtrado"
                    tone="primary"
                />
                <MetricCard
                    icon={Scale}
                    label="Ticket médio"
                    value={formatHistoryCurrency(summary.averageTransactionCents)}
                    helper="Média por lançamento"
                />
            </div>
        </div>
    );
}

export default HistorySummary;
