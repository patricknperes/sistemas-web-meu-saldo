import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiCalendarEventLine,
    RiExchangeFundsLine,
} from "react-icons/ri";

import {
    CurrencyValue,
} from "../../../components/ui/finance/index.js";
import {
    Card,
} from "../../../components/ui/surfaces/index.js";

import {
    getMonthLabel,
    normalizeMonthItem,
} from "./historyUtils.js";

function AmountLine({
    icon: Icon,
    label,
    value,
    tone,
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${tone === "positive"
                    ? "border-success/15 bg-success-muted text-success"
                    : "border-danger/15 bg-danger-muted text-danger"
                }`}
                aria-hidden="true"
            >
                <Icon size={16} />
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-muted-foreground">
                    {label}
                </p>
            </div>

            <CurrencyValue
                value={value / 100}
                tone={tone}
                size="xs"
                className="shrink-0"
            />
        </div>
    );
}

function MonthHistoryCard({
    item,
    compact = false,
}) {
    const month = normalizeMonthItem(item);
    const totalFlow = month.totalIncomeCents + month.totalExpenseCents;
    const incomePercent = totalFlow > 0
        ? (month.totalIncomeCents / totalFlow) * 100
        : 0;
    const expensePercent = totalFlow > 0
        ? (month.totalExpenseCents / totalFlow) * 100
        : 0;

    return (
        <Card className={`min-w-0 ${compact ? "p-4" : "p-5"}`}>
            <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-caption font-bold text-primary">
                        <RiCalendarEventLine size={15} aria-hidden="true" />
                        <span>{month.year}</span>
                    </div>

                    <h3 className="mt-2 truncate text-card-title font-extrabold text-foreground">
                        {getMonthLabel(month)}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
                        <RiExchangeFundsLine size={14} aria-hidden="true" />
                        {month.transactionCount} {month.transactionCount === 1 ? "movimentação" : "movimentações"}
                    </p>
                </div>

                <div className="min-w-0 text-right">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-subtle-foreground">
                        Resultado
                    </p>
                    <CurrencyValue
                        value={month.balanceCents / 100}
                        tone="auto"
                        size="sm"
                        className="mt-1 max-w-40"
                    />
                </div>
            </div>

            <div className="mt-5 grid gap-3">
                <AmountLine
                    icon={RiArrowUpLine}
                    label={`${month.incomeCount} ${month.incomeCount === 1 ? "receita" : "receitas"}`}
                    value={month.totalIncomeCents}
                    tone="positive"
                />

                <AmountLine
                    icon={RiArrowDownLine}
                    label={`${month.expenseCount} ${month.expenseCount === 1 ? "despesa" : "despesas"}`}
                    value={month.totalExpenseCents}
                    tone="negative"
                />
            </div>

            <div className="mt-5 overflow-hidden rounded-pill bg-surface-muted" aria-label="Proporção entre receitas e despesas">
                <div className="flex h-2 w-full">
                    <span
                        className="bg-success transition-[width] duration-300"
                        style={{ width: `${incomePercent}%` }}
                        aria-hidden="true"
                    />
                    <span
                        className="bg-danger transition-[width] duration-300"
                        style={{ width: `${expensePercent}%` }}
                        aria-hidden="true"
                    />
                </div>
            </div>
        </Card>
    );
}

export default MonthHistoryCard;
