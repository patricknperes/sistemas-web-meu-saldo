import { useMemo } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { CalendarDays, Edit3, FileText, Repeat2, Trash2 } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import { cn } from "../../../lib/cn.js";
import {
    formatCurrencyCents,
    formatTransactionDate,
} from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";
import TransactionEmptyState from "./TransactionEmptyState.jsx";
import TransactionLoadingState from "./TransactionLoadingState.jsx";
import TransactionPagination from "./TransactionPagination.jsx";

function TagsCell({ tags = [] }) {
    if (tags.length === 0) return <span className="text-xs text-subtle-foreground">Sem tags</span>;
    return (
        <div className="flex min-w-0 flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => <TagPill key={tag.id} tag={tag} />)}
            {tags.length > 2 && <Badge>+{tags.length - 2}</Badge>}
        </div>
    );
}

function TransactionList({
    transactions = [],
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
    onPageChange,
}) {
    const columns = useMemo(() => [
        {
            id: "description",
            header: "Movimentação",
            cell: ({ row }) => (
                <div className="flex min-w-0 items-center gap-3">
                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", config.type === "INCOME" ? "bg-success-muted text-success" : "bg-danger-muted text-danger")}>
                        {row.original.isRecurring ? <Repeat2 className="size-4" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground" title={row.original.description}>{row.original.description}</p>
                        <p className="mt-0.5 truncate text-xs text-subtle-foreground" title={row.original.notes || row.original.category}>
                            {row.original.notes || row.original.category || "Sem observações"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "date",
            header: "Data",
            cell: ({ row }) => <span className="whitespace-nowrap text-sm text-muted-foreground">{formatTransactionDate(row.original.date, "dd/MM/yyyy")}</span>,
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({ row }) => <TagsCell tags={row.original.tags} />,
        },
        {
            id: "amount",
            header: () => <span className="block text-right">Valor</span>,
            cell: ({ row }) => (
                <span className={cn("money-nums block whitespace-nowrap text-right text-sm font-bold", config.type === "INCOME" ? "text-success" : "text-danger")}>
                    {config.type === "INCOME" ? "+" : "−"} {formatCurrencyCents(row.original.amountCents)}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Ações</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <IconButton size="sm" variant="ghost" onClick={() => onEdit(row.original)} aria-label={`Editar ${row.original.description}`}>
                        <Edit3 className="size-4" aria-hidden="true" />
                    </IconButton>
                    <IconButton size="sm" variant="ghost" className="hover:bg-danger-muted hover:text-danger" onClick={() => onDelete(row.original)} aria-label={`Excluir ${row.original.description}`}>
                        <Trash2 className="size-4" aria-hidden="true" />
                    </IconButton>
                </div>
            ),
        },
    ], [config.type, onDelete, onEdit]);

    const table = useReactTable({ data: transactions, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <Card className="overflow-hidden">
            {loading && transactions.length === 0 ? (
                <TransactionLoadingState />
            ) : error ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                    <h3 className="text-base font-bold text-foreground">Não foi possível carregar a lista</h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{error}</p>
                    <Button className="mt-5" variant="secondary" onClick={onRetry}>Tentar novamente</Button>
                </div>
            ) : transactions.length === 0 ? (
                <TransactionEmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    hasFilters={hasFilters}
                    onCreate={onCreate}
                    onClearFilters={onClearFilters}
                />
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="min-w-[840px]">
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
                                            <td key={cell.id} className="px-5 py-3.5 align-middle">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
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
                                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", config.type === "INCOME" ? "bg-success-muted text-success" : "bg-danger-muted text-danger")}>
                                        {transaction.isRecurring ? <Repeat2 className="size-4" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-bold text-foreground">{transaction.description}</h3>
                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle-foreground"><CalendarDays className="size-3.5" aria-hidden="true" />{formatTransactionDate(transaction.date, "dd/MM/yyyy")}</p>
                                            </div>
                                            <p className={cn("money-nums shrink-0 text-sm font-bold", config.type === "INCOME" ? "text-success" : "text-danger")}>
                                                {config.type === "INCOME" ? "+" : "−"} {formatCurrencyCents(transaction.amountCents)}
                                            </p>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-1.5"><TagsCell tags={transaction.tags} /></div>
                                        <div className="mt-3 flex justify-end gap-1 border-t border-border pt-2">
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}><Edit3 className="size-4" aria-hidden="true" />Editar</Button>
                                            <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-muted hover:text-danger" onClick={() => onDelete(transaction)}><Trash2 className="size-4" aria-hidden="true" />Excluir</Button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <TransactionPagination pagination={pagination} onPageChange={onPageChange} disabled={loading} />
        </Card>
    );
}

export default TransactionList;
