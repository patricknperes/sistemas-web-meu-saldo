import { CircleGauge, Info } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import { cn } from "../../../lib/cn.js";
import { getFinancialIndicators } from "../utils/dashboardFormatters.js";

const toneConfig = {
    success: { label: "Saudável", variant: "success", bar: "bg-success", message: "Você preservou uma boa parte das receitas." },
    warning: { label: "Atenção", variant: "warning", bar: "bg-warning", message: "Há saldo positivo, mas com pouca margem." },
    danger: { label: "Crítico", variant: "danger", bar: "bg-danger", message: "As despesas ultrapassaram as receitas." },
    neutral: { label: "Sem base", variant: "neutral", bar: "bg-border-strong", message: "Registre movimentações para analisar o período." },
};

function FinancialHealthCard({ summary }) {
    const indicators = getFinancialIndicators(summary);
    const config = toneConfig[indicators.healthTone] ?? toneConfig.neutral;
    const savingsProgress = Math.max(0, Math.min(100, indicators.savingsRate));
    const expenseProgress = Math.max(0, Math.min(100, indicators.expenseRatio));

    return (
        <article className="min-w-0 rounded-[1.75rem] border border-border bg-surface p-6 shadow-card lg:col-span-5">
            <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground">Saúde financeira</p>
                    <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-foreground">Leitura do período</h2>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <CircleGauge className="size-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
            </header>

            <div className="mt-7 flex items-end justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-mono text-4xl font-bold tracking-[-0.055em] text-foreground">
                        {indicators.savingsRate.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">das receitas ficaram no saldo</p>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
            </div>

            <div className="mt-6 space-y-5">
                <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-muted-foreground">Economia</span>
                        <span className="font-mono font-bold text-foreground">{indicators.savingsRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div className={cn("h-full rounded-full transition-[width] duration-500", config.bar)} style={{ width: `${savingsProgress}%` }} />
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-muted-foreground">Comprometimento da renda</span>
                        <span className="font-mono font-bold text-foreground">{indicators.expenseRatio.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div className="h-full rounded-full bg-secondary transition-[width] duration-500" style={{ width: `${expenseProgress}%` }} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2 rounded-2xl bg-surface-muted p-3 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <p>{config.message}</p>
            </div>
        </article>
    );
}

export default FinancialHealthCard;
