import { CalendarClock, Edit3, PauseCircle, PlayCircle, Repeat2, Trash2 } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import Switch from "../../../components/ui/Switch.jsx";
import { cn } from "../../../lib/cn.js";
import {
    formatCurrencyCents,
    formatTransactionDate,
    getIntervalLabel,
    getRecurringStatusLabel,
    getRecurringStatusVariant,
} from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";
import TransactionEmptyState from "./TransactionEmptyState.jsx";
import TransactionLoadingState from "./TransactionLoadingState.jsx";
import TransactionPagination from "./TransactionPagination.jsx";

function RecurringTransactionList({
    items = [],
    pagination,
    config,
    loading,
    error,
    hasFilters,
    onRetry,
    onCreate,
    onClearFilters,
    onEdit,
    onDelete,
    onToggle,
    onPageChange,
    togglingId,
}) {
    return (
        <Card className="overflow-hidden">
            {loading && items.length === 0 ? (
                <TransactionLoadingState />
            ) : error ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                    <h3 className="text-base font-bold text-foreground">Não foi possível carregar as recorrências</h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{error}</p>
                    <Button className="mt-5" variant="secondary" onClick={onRetry}>Tentar novamente</Button>
                </div>
            ) : items.length === 0 ? (
                <TransactionEmptyState
                    title={`Nenhuma ${config.singular} recorrente encontrada`}
                    description={`Crie uma regra para lançar ${config.plural} automaticamente quando a data programada chegar.`}
                    hasFilters={hasFilters}
                    onCreate={onCreate}
                    onClearFilters={onClearFilters}
                />
            ) : (
                <div className="divide-y divide-border">
                    {items.map((item) => {
                        const active = item.status === "ACTIVE";
                        const finished = item.status === "FINISHED";
                        return (
                            <article key={item.id} className="p-4 transition hover:bg-surface-raised/60 sm:p-5">
                                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-control", config.type === "INCOME" ? "bg-success-muted text-success" : "bg-danger-muted text-danger")}>
                                            <Repeat2 className="size-5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                <h3 className="max-w-full truncate text-sm font-bold text-foreground" title={item.description}>{item.description}</h3>
                                                <Badge variant={getRecurringStatusVariant(item.status)}>{getRecurringStatusLabel(item.status)}</Badge>
                                            </div>
                                            <p className="money-nums mt-1 text-lg font-bold text-foreground">{formatCurrencyCents(item.amountCents)}</p>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {(item.tags ?? []).slice(0, 3).map((tag) => <TagPill key={tag.id} tag={tag} />)}
                                                {(item.tags ?? []).length > 3 && <Badge>+{item.tags.length - 3}</Badge>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid min-w-0 gap-2 sm:grid-cols-3 xl:min-w-[520px]">
                                        <div className="rounded-control border border-border bg-surface-raised px-3 py-2.5">
                                            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">Frequência</p>
                                            <p className="mt-1 truncate text-sm font-semibold text-foreground">{getIntervalLabel(item.intervalMonths)}, dia {item.dayOfMonth}</p>
                                        </div>
                                        <div className="rounded-control border border-border bg-surface-raised px-3 py-2.5">
                                            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">Próxima ocorrência</p>
                                            <p className="mt-1 truncate text-sm font-semibold text-foreground">{formatTransactionDate(item.nextOccurrenceDate, "dd/MM/yyyy")}</p>
                                        </div>
                                        <div className="rounded-control border border-border bg-surface-raised px-3 py-2.5">
                                            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">Geradas</p>
                                            <p className="mt-1 truncate text-sm font-semibold text-foreground">{item.generatedTransactionCount ?? 0} movimentações</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-border pt-3 xl:border-0 xl:pt-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={active}
                                                disabled={finished || togglingId === item.id}
                                                onCheckedChange={(checked) => onToggle(item, checked)}
                                                aria-label={active ? `Pausar ${item.description}` : `Ativar ${item.description}`}
                                            />
                                            <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
                                                {finished ? "Finalizada" : active ? "Ativa" : "Pausada"}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <IconButton size="sm" variant="ghost" onClick={() => onEdit(item)} aria-label={`Editar ${item.description}`}>
                                                <Edit3 className="size-4" aria-hidden="true" />
                                            </IconButton>
                                            <IconButton size="sm" variant="ghost" className="hover:bg-danger-muted hover:text-danger" onClick={() => onDelete(item)} aria-label={`Excluir ${item.description}`}>
                                                <Trash2 className="size-4" aria-hidden="true" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle-foreground">
                                    <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" aria-hidden="true" />Início em {formatTransactionDate(item.startDate, "dd/MM/yyyy")}</span>
                                    {item.endDate && <span>Termina em {formatTransactionDate(item.endDate, "dd/MM/yyyy")}</span>}
                                    <span className="inline-flex items-center gap-1.5">{active ? <PlayCircle className="size-3.5" aria-hidden="true" /> : <PauseCircle className="size-3.5" aria-hidden="true" />}{active ? "Novas ocorrências habilitadas" : "Novas ocorrências suspensas"}</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <TransactionPagination pagination={pagination} onPageChange={onPageChange} disabled={loading} />
        </Card>
    );
}

export default RecurringTransactionList;
