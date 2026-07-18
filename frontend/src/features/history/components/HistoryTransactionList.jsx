import { useMemo } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight, CalendarDays, FileText, Repeat2 } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { cn } from "../../../lib/cn.js";
import TagPill from "../../transactions/components/TagPill.jsx";
import { formatHistoryCurrency, formatHistoryDate } from "../utils/historyFormatters.js";
import HistoryPagination from "./HistoryPagination.jsx";

function Tags({ tags = [] }) {
    if (tags.length === 0) return <span className="text-xs text-subtle-foreground">Sem tags</span>;
    return (
        <div className="flex min-w-0 flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => <TagPill key={tag.id} tag={tag} />)}
            {tags.length > 2 && <Badge>+{tags.length - 2}</Badge>}
        </div>
    );
}

function TypeBadge({ type }) {
    return type === "INCOME" ? (
        <Badge variant="success"><ArrowUpRight className="size-3.5" aria-hidden="true" />Receita</Badge>
    ) : (
        <Badge variant="danger"><ArrowDownRight className="size-3.5" aria-hidden="true" />Despesa</Badge>
    );
}

function HistoryTransactionList({ data, loading, error, onRetry, onPageChange, hasFilters, onClearFilters }) {
    const transactions = Array.isArray(data?.transactions) ? data.transactions : [];
    const pagination = data?.pagination ?? {};

    const columns = useMemo(() => [
        {
            id: "description",
            header: "Movimentação",
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <div className="flex min-w-0 items-center gap-3">
                        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", transaction.type === "INCOME" ? "bg-success-muted text-success" : "bg-danger-muted text-danger")}>
                            {transaction.isRecurring ? <Repeat2 className="size-4" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground" title={transaction.description}>{transaction.description}</p>
                            <p className="mt-0.5 truncate text-xs text-subtle-foreground" title={transaction.notes || transaction.category}>{transaction.notes || transaction.category || "Sem observações"}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "type",
            header: "Tipo",
            cell: ({ row }) => <TypeBadge type={row.original.type} />,
        },
        {
            id: "date",
            header: "Data",
            cell: ({ row }) => <span className="whitespace-nowrap text-sm text-muted-foreground">{formatHistoryDate(row.original.date)}</span>,
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({ row }) => <Tags tags={row.original.tags} />,
        },
        {
            id: "amount",
            header: () => <span className="block text-right">Valor</span>,
            cell: ({ row }) => (
                <span className={cn("money-nums block whitespace-nowrap text-right text-sm font-bold", row.original.type === "INCOME" ? "text-success" : "text-danger")}>
                    {row.original.type === "INCOME" ? "+" : "−"} {formatHistoryCurrency(row.original.amountCents)}
                </span>
            ),
        },
    ], []);

    const table = useReactTable({ data: transactions, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <Card className="overflow-hidden">
            <header className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div>
                    <h2 className="text-base font-bold text-foreground">Movimentações detalhadas</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Lista cronológica respeitando todos os filtros selecionados.</p>
                </div>
                {pagination.totalItems > 0 && <Badge>{pagination.totalItems} itens</Badge>}
            </header>

            {loading && transactions.length === 0 ? (
                <div className="space-y-3 p-5 sm:p-6">
                    {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-16 animate-pulse rounded-card-sm bg-surface-muted" />)}
                </div>
            ) : error ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                    <h3 className="text-base font-bold text-foreground">Não foi possível carregar as movimentações</h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{error}</p>
                    <Button className="mt-5" variant="secondary" onClick={onRetry}>Tentar novamente</Button>
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                    <span className="flex size-12 items-center justify-center rounded-card-sm bg-surface-muted text-muted-foreground"><FileText className="size-5" aria-hidden="true" /></span>
                    <h3 className="mt-4 text-base font-bold text-foreground">Nenhuma movimentação encontrada</h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{hasFilters ? "Tente ajustar ou remover os filtros para ampliar os resultados." : "As receitas e despesas cadastradas aparecerão aqui."}</p>
                    {hasFilters && <Button className="mt-5" variant="secondary" onClick={onClearFilters}>Limpar filtros</Button>}
                </div>
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="min-w-[860px]">
                            <thead className="bg-surface-raised">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="border-b border-border">
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-border">
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="transition hover:bg-surface-raised/70">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-5 py-3.5 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-border lg:hidden">
                        {transactions.map((transaction) => (
                            <article key={transaction.id} className="p-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", transaction.type === "INCOME" ? "bg-success-muted text-success" : "bg-danger-muted text-danger")}>
                                        {transaction.isRecurring ? <Repeat2 className="size-4" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-bold text-foreground">{transaction.description}</h3>
                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle-foreground"><CalendarDays className="size-3.5" aria-hidden="true" />{formatHistoryDate(transaction.date)}</p>
                                            </div>
                                            <p className={cn("money-nums shrink-0 text-sm font-bold", transaction.type === "INCOME" ? "text-success" : "text-danger")}>
                                                {transaction.type === "INCOME" ? "+" : "−"} {formatHistoryCurrency(transaction.amountCents)}
                                            </p>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-2"><TypeBadge type={transaction.type} /><Tags tags={transaction.tags} /></div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <HistoryPagination pagination={pagination} onPageChange={onPageChange} disabled={loading} />
        </Card>
    );
}

export default HistoryTransactionList;
