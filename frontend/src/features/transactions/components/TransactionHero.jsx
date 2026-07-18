import { CalendarRange, Hash, TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "../../../components/ui/Card.jsx";
import { cn } from "../../../lib/cn.js";
import { formatCurrencyCents } from "../utils/transactionFormatters.js";

function TransactionHero({ config, totalAmountCents, totalItems, periodLabel, loading }) {
    const income = config.type === "INCOME";
    const Icon = income ? TrendingUp : TrendingDown;

    return (
        <Card className="relative overflow-hidden border-0 bg-[linear-gradient(135deg,var(--app-surface),var(--app-surface-raised))] p-5 sm:p-6">
            <div className={cn("pointer-events-none absolute -right-14 -top-20 size-52 rounded-full blur-3xl", income ? "bg-success/10" : "bg-danger/10")} />
            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Icon className={cn("size-4", income ? "text-success" : "text-danger")} aria-hidden="true" />
                        {config.totalLabel}
                    </div>
                    <p className={cn("money-nums mt-2 truncate text-3xl font-bold tracking-[-0.045em] sm:text-4xl", income ? "text-success" : "text-danger")}>
                        {loading ? "—" : formatCurrencyCents(totalAmountCents)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Soma de todos os lançamentos encontrados com os filtros atuais.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:min-w-72">
                    <div className="rounded-card-sm border border-border bg-surface/75 p-3 backdrop-blur-sm">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-subtle-foreground"><Hash className="size-3.5" aria-hidden="true" />Lançamentos</span>
                        <p className="money-nums mt-1 text-xl font-bold text-foreground">{loading ? "—" : totalItems}</p>
                    </div>
                    <div className="min-w-0 rounded-card-sm border border-border bg-surface/75 p-3 backdrop-blur-sm">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-subtle-foreground"><CalendarRange className="size-3.5" aria-hidden="true" />Período</span>
                        <p className="mt-1 truncate text-sm font-bold text-foreground" title={periodLabel}>{periodLabel}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default TransactionHero;
