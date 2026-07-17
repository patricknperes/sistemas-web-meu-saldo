import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiFundsBoxLine,
} from "react-icons/ri";

import {
    CurrencyValue,
} from "../../../components/ui/finance/index.js";

import {
    calculateSavingsRate,
    formatPercent,
    normalizeCents,
} from "./dashboardUtils.js";

function CompositionItem({
    icon: Icon,
    label,
    valueCents,
    tone,
    percentage,
}) {
    const toneClasses = {
        positive: "border-success/15 bg-success-muted text-success",
        negative: "border-danger/15 bg-danger-muted text-danger",
        primary: "border-primary/15 bg-primary-muted text-primary",
    };

    return (
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border-subtle bg-surface-subtle p-3">
            <span
                aria-hidden="true"
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${toneClasses[tone]}`}
            >
                <Icon size={17} />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-caption font-semibold text-muted-foreground">
                        {label}
                    </p>
                    <span className="shrink-0 text-[0.6875rem] font-bold text-subtle-foreground">
                        {percentage}
                    </span>
                </div>

                <CurrencyValue
                    value={valueCents / 100}
                    tone={tone}
                    size="sm"
                    className="mt-1"
                />
            </div>
        </div>
    );
}

function CashComposition({
    incomeCents = 0,
    expenseCents = 0,
    balanceCents = 0,
}) {
    const income = Math.max(0, normalizeCents(incomeCents));
    const expense = Math.max(0, normalizeCents(expenseCents));
    const totalMovement = income + expense;
    const incomePercentage = totalMovement > 0
        ? (income / totalMovement) * 100
        : 0;
    const expensePercentage = totalMovement > 0
        ? (expense / totalMovement) * 100
        : 0;
    const savingsRate = calculateSavingsRate(balanceCents, incomeCents);

    return (
        <div className="grid min-h-[17.5rem] gap-5 lg:grid-rows-[auto_1fr]">
            <div className="flex flex-col items-center justify-center text-center">
                <div
                    className="relative flex size-40 items-center justify-center rounded-full"
                    style={{
                        background: totalMovement > 0
                            ? `conic-gradient(var(--app-success) 0 ${incomePercentage}%, var(--app-danger) ${incomePercentage}% 100%)`
                            : "conic-gradient(var(--app-surface-muted) 0 100%)",
                    }}
                    role="img"
                    aria-label={`Composição financeira: ${formatPercent(incomePercentage)} de receitas e ${formatPercent(expensePercentage)} de despesas`}
                >
                    <div className="absolute inset-[0.78rem] flex flex-col items-center justify-center rounded-full border border-border-subtle bg-surface shadow-xs">
                        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                            Economia
                        </span>
                        <strong className={`mt-1 text-section-title font-extrabold tabular-nums ${savingsRate < 0 ? "text-danger" : "text-foreground"}`}>
                            {formatPercent(savingsRate)}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="grid gap-2.5">
                <CompositionItem
                    icon={RiArrowUpLine}
                    label="Receitas"
                    valueCents={income}
                    tone="positive"
                    percentage={formatPercent(incomePercentage)}
                />
                <CompositionItem
                    icon={RiArrowDownLine}
                    label="Despesas"
                    valueCents={expense}
                    tone="negative"
                    percentage={formatPercent(expensePercentage)}
                />
                <CompositionItem
                    icon={RiFundsBoxLine}
                    label="Saldo"
                    valueCents={normalizeCents(balanceCents)}
                    tone="primary"
                    percentage={formatPercent(savingsRate)}
                />
            </div>
        </div>
    );
}

export default CashComposition;
