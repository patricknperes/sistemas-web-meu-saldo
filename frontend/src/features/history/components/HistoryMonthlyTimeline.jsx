import { ArrowDownRight, ArrowUpRight, CalendarDays } from "lucide-react";

import { Card } from "../../../components/ui/Card.jsx";
import Button from "../../../components/ui/Button.jsx";
import { cn } from "../../../lib/cn.js";
import { formatHistoryCurrency } from "../utils/historyFormatters.js";

function HistoryMonthlyTimeline({ monthly = [], loading, onSelectMonth }) {
    return (
        <Card className="overflow-hidden xl:col-span-7">
            <header className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                <div className="min-w-0">
                    <h2 className="text-base font-bold text-foreground">Resumo mensal</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Selecione um mês para abrir o recorte detalhado.</p>
                </div>
                <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </header>

            {loading ? (
                <div className="space-y-3 p-5 sm:p-6">
                    {[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-card-sm bg-surface-muted" />)}
                </div>
            ) : monthly.length === 0 ? (
                <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center text-sm text-muted-foreground">Nenhum mês possui movimentações com os filtros atuais.</div>
            ) : (
                <div className="max-h-[430px] divide-y divide-border overflow-y-auto">
                    {[...monthly].reverse().map((item) => {
                        const positive = Number(item.balanceCents) >= 0;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => onSelectMonth?.(item)}
                                className="grid w-full min-w-0 gap-3 px-5 py-4 text-left transition hover:bg-surface-raised sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-6"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-foreground">{item.fullLabel}</p>
                                    <p className="mt-1 text-xs text-subtle-foreground">{item.transactionCount} {item.transactionCount === 1 ? "movimentação" : "movimentações"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-5">
                                    <span className="min-w-0">
                                        <span className="flex items-center gap-1 text-[11px] text-subtle-foreground"><ArrowUpRight className="size-3 text-success" aria-hidden="true" />Receitas</span>
                                        <strong className="money-nums mt-0.5 block truncate text-xs text-success">{formatHistoryCurrency(item.totalIncomeCents)}</strong>
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex items-center gap-1 text-[11px] text-subtle-foreground"><ArrowDownRight className="size-3 text-danger" aria-hidden="true" />Despesas</span>
                                        <strong className="money-nums mt-0.5 block truncate text-xs text-danger">{formatHistoryCurrency(item.totalExpenseCents)}</strong>
                                    </span>
                                </div>
                                <span className={cn("money-nums justify-self-start text-sm font-bold sm:justify-self-end", positive ? "text-success" : "text-danger")}>{formatHistoryCurrency(item.balanceCents)}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {monthly.length > 0 && (
                <footer className="border-t border-border px-5 py-3 text-right sm:px-6">
                    <Button variant="ghost" size="sm" onClick={() => onSelectMonth?.(null)}>Ver período completo</Button>
                </footer>
            )}
        </Card>
    );
}

export default HistoryMonthlyTimeline;
