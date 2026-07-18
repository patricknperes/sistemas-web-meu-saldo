import {
    ArrowDownLeft,
    ArrowUpRight,
    ReceiptText,
} from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "../../../utils/formatCurrency.js";

const SIMULATED_CHART_DATA = {
    success: [
        { value: 45 },
        { value: 12 },
        { value: 89 },
        { value: 34 },
        { value: 76 },
        { value: 23 },
        { value: 91 },
        { value: 55 },
        { value: 67 },
        { value: 19 },
        { value: 82 },
        { value: 40 },
        { value: 95 },
        { value: 28 },
        { value: 63 },
        { value: 71 },
    ],

    danger: [
        { value: 14 },
        { value: 88 },
        { value: 32 },
        { value: 65 },
        { value: 41 },
        { value: 99 },
        { value: 21 },
        { value: 53 },
        { value: 77 },
        { value: 18 },
        { value: 92 },
        { value: 38 },
        { value: 70 },
        { value: 25 },
        { value: 84 },
        { value: 49 },
    ],

    primary: [
        { value: 61 },
        { value: 29 },
        { value: 83 },
        { value: 15 },
        { value: 94 },
        { value: 37 },
        { value: 68 },
        { value: 44 },
        { value: 11 },
        { value: 79 },
        { value: 52 },
        { value: 97 },
        { value: 24 },
        { value: 86 },
        { value: 31 },
        { value: 58 },
    ],
};

function SummarySparkline({
    tone,
}) {
    const data = SIMULATED_CHART_DATA[tone];

    if (!data) {
        return null;
    }

    const toneClassName = tone === "success"
        ? "text-success"
        : tone === "danger"
            ? "text-danger"
            : "text-primary";

    return (
        <div
            aria-hidden="true"
            className={`
                mt-3
                hidden h-10
                w-full
                overflow-hidden
                lg:block
                ${toneClassName}
            `}
        >
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
                <LineChart
                    data={data}
                    margin={{
                        top: 4,
                        right: 3,
                        bottom: 4,
                        left: 3,
                    }}
                >
                    <Line
                        type="natural"
                        dataKey="value"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function SummaryLine({
    icon: Icon,
    label,
    valueCents,
    detail,
    tone,
}) {
    const toneClassName = tone === "success"
        ? "bg-success-muted text-success"
        : tone === "danger"
            ? "bg-danger-muted text-danger"
            : "bg-primary-soft text-primary";

    return (
        <div
            className="
                flex min-w-0
                items-center gap-3
                py-3
                lg:flex-1
                lg:items-start
                lg:py-4
            "
        >
            <span
                className={`
                    flex size-9
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    ${toneClassName}
                `}
            >
                <Icon
                    className="size-4"
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-muted-foreground">
                            {label}
                        </p>

                        <p className="mt-0.5 truncate font-mono text-sm font-bold text-foreground">
                            {valueCents == null
                                ? detail
                                : formatCurrency(valueCents)}
                        </p>
                    </div>

                    {detail && valueCents != null && (
                        <span className="shrink-0 text-xs text-subtle-foreground">
                            {detail}
                        </span>
                    )}
                </div>

                <SummarySparkline tone={tone} />
            </div>
        </div>
    );
}

function DashboardSummaryPanel({
    summary,
}) {
    return (
        <aside
            className="
                min-w-0
                rounded-card
                border border-border
                bg-surface
                p-5
                shadow-card
                lg:col-span-4
                lg:flex
                lg:flex-col
            "
        >
            <div className="shrink-0">
                <p className="text-sm font-bold text-foreground">
                    Resumo do período
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    Volume financeiro e quantidade de lançamentos.
                </p>
            </div>

            <div
                className="
                    mt-4
                    divide-y divide-border
                    lg:flex
                    lg:flex-1
                    lg:flex-col
                "
            >
                <SummaryLine
                    icon={ArrowUpRight}
                    label="Receitas"
                    valueCents={summary.totalIncomeCents}
                    detail={`${summary.incomeCount ?? 0} itens`}
                    tone="success"
                />

                <SummaryLine
                    icon={ArrowDownLeft}
                    label="Despesas"
                    valueCents={summary.totalExpenseCents}
                    detail={`${summary.expenseCount ?? 0} itens`}
                    tone="danger"
                />

                <SummaryLine
                    icon={ReceiptText}
                    label="Movimentações"
                    detail={`${summary.transactionCount ?? 0} lançamentos`}
                    tone="primary"
                />
            </div>
        </aside>
    );
}

export default DashboardSummaryPanel;