import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, ReceiptText, Repeat2 } from "lucide-react";
import { Link } from "react-router";

import Badge from "../../../components/ui/Badge.jsx";
import { cn } from "../../../lib/cn.js";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import { formatDate } from "../../../utils/formatDate.js";

function RecentTransactionItem({ transaction }) {
    const isIncome = transaction.type === "INCOME";
    const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;
    const amount = Math.abs(Number(transaction.amountCents) || 0);

    return (
        <li className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:px-5">
            <span className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                isIncome ? "bg-success-muted text-success" : "bg-danger-muted text-danger",
            )}>
                <Icon className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
            </span>

            <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{transaction.description}</p>
                    {transaction.isRecurring && <Repeat2 className="size-3.5 shrink-0 text-subtle-foreground" aria-label="Transação recorrente" />}
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-subtle-foreground">
                    <span className="truncate">{transaction.category || "Sem categoria"}</span>
                    <span aria-hidden="true">•</span>
                    <span className="flex shrink-0 items-center gap-1">
                        <CalendarDays className="size-3" aria-hidden="true" />
                        {formatDate(transaction.date)}
                    </span>
                </div>
            </div>

            <div className="min-w-0 text-right">
                <p className={cn("truncate font-mono text-sm font-bold", isIncome ? "text-success" : "text-danger")}>
                    {isIncome ? "+" : "−"} {formatCurrency(amount)}
                </p>
                <Badge variant={isIncome ? "success" : "danger"} className="mt-1 hidden sm:inline-flex">
                    {isIncome ? "Receita" : "Despesa"}
                </Badge>
            </div>
        </li>
    );
}

function RecentTransactions({ transactions = [], loading }) {
    return (
        <section className="min-w-0 overflow-hidden rounded-card border border-border bg-surface shadow-card lg:col-span-8">
            <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold tracking-[-0.02em] text-foreground">Movimentações recentes</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">Os cinco lançamentos mais recentes do período.</p>
                </div>
                <Link to="/historico" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover">
                    Ver tudo
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
            </header>

            {loading ? (
                <div className="space-y-px p-2">
                    {[1, 2, 3, 4].map((item) => <div key={item} className="h-[72px] animate-pulse rounded-2xl bg-surface-muted" />)}
                </div>
            ) : transactions.length > 0 ? (
                <ul>{transactions.map((transaction) => <RecentTransactionItem key={transaction.id} transaction={transaction} />)}</ul>
            ) : (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
                        <ReceiptText className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-foreground">Nenhuma movimentação no período</h3>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Altere o período ou registre uma receita ou despesa para começar a acompanhar.</p>
                </div>
            )}
        </section>
    );
}

export default RecentTransactions;
