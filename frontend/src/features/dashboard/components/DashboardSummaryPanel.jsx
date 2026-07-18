import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";

import { formatCurrency } from "../../../utils/formatCurrency.js";

function SummaryLine({ icon: Icon, label, valueCents, detail, tone }) {
    const toneClassName = tone === "success" ? "bg-success-muted text-success" : tone === "danger" ? "bg-danger-muted text-danger" : "bg-primary-soft text-primary";

    return (
        <div className="flex min-w-0 items-center gap-3 py-3">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${toneClassName}`}>
                <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 truncate font-mono text-sm font-bold text-foreground">{valueCents == null ? detail : formatCurrency(valueCents)}</p>
            </div>
            {detail && valueCents != null && <span className="shrink-0 text-xs text-subtle-foreground">{detail}</span>}
        </div>
    );
}

function DashboardSummaryPanel({ summary }) {
    return (
        <aside className="min-w-0 rounded-card border border-border bg-surface p-5 shadow-card lg:col-span-4">
            <p className="text-sm font-bold text-foreground">Resumo do período</p>
            <p className="mt-1 text-xs text-muted-foreground">Volume financeiro e quantidade de lançamentos.</p>
            <div className="mt-4 divide-y divide-border">
                <SummaryLine icon={ArrowUpRight} label="Receitas" valueCents={summary.totalIncomeCents} detail={`${summary.incomeCount ?? 0} itens`} tone="success" />
                <SummaryLine icon={ArrowDownLeft} label="Despesas" valueCents={summary.totalExpenseCents} detail={`${summary.expenseCount ?? 0} itens`} tone="danger" />
                <SummaryLine icon={ReceiptText} label="Movimentações" detail={`${summary.transactionCount ?? 0} lançamentos`} tone="primary" />
            </div>
        </aside>
    );
}

export default DashboardSummaryPanel;
