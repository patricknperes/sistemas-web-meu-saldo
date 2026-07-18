import { ArrowDownRight, ArrowUpRight, Minus, WalletCards } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import { getFinancialIndicators } from "../utils/dashboardFormatters.js";

function BalanceHeroCard({ summary, periodLabel }) {
    const balance = Number(summary.balanceCents) || 0;
    const indicators = getFinancialIndicators(summary);
    const isPositive = balance > 0;
    const isNegative = balance < 0;
    const StatusIcon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;
    const statusLabel = isPositive ? "Saldo positivo" : isNegative ? "Saldo negativo" : "Saldo equilibrado";
    const statusVariant = isPositive ? "success" : isNegative ? "danger" : "neutral";

    return (
        <article className="relative min-h-64 overflow-hidden rounded-[1.75rem] border border-primary/15 bg-[linear-gradient(145deg,var(--app-primary),#0b5f63_58%,#11324f)] p-6 text-white shadow-[0_24px_70px_rgb(15_118_110_/_22%)] sm:p-7 lg:col-span-7">
            <div className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-36 -left-20 size-80 rounded-full bg-cyan-300/15 blur-3xl" aria-hidden="true" />
            <div className="relative flex h-full min-w-0 flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/70">Saldo disponível</p>
                        <p className="mt-1 truncate text-xs text-white/55">{periodLabel}</p>
                    </div>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
                        <WalletCards className="size-5" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="truncate font-mono text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
                        {formatCurrency(balance)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge variant={statusVariant} className="border-white/10 bg-white/12 text-white backdrop-blur-xl">
                            <StatusIcon className="size-3.5" aria-hidden="true" />
                            {statusLabel}
                        </Badge>
                        <span className="text-xs text-white/60">
                            {summary.transactionCount ?? 0} movimentações no período
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/12 pt-5">
                    <div className="min-w-0">
                        <p className="text-xs text-white/55">Taxa de economia</p>
                        <p className="mt-1 truncate font-mono text-lg font-bold">
                            {Number.isFinite(indicators.savingsRate) ? `${indicators.savingsRate.toFixed(1)}%` : "0,0%"}
                        </p>
                    </div>
                    <div className="min-w-0 border-l border-white/12 pl-4">
                        <p className="text-xs text-white/55">Média por lançamento</p>
                        <p className="mt-1 truncate font-mono text-lg font-bold">
                            {formatCurrency(indicators.averageTransactionCents)}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default BalanceHeroCard;
