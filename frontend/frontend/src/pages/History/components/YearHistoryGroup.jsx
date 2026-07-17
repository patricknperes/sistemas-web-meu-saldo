import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiCalendarLine,
    RiExchangeFundsLine,
    RiWallet3Line,
} from "react-icons/ri";

import {
    FinancialSummary,
} from "../../../components/ui/finance/index.js";
import {
    Card,
    CardBody,
    CardHeader,
} from "../../../components/ui/surfaces/index.js";

import MonthHistoryCard from "./MonthHistoryCard.jsx";

function YearHistoryGroup({
    group,
    expanded = true,
}) {
    const items = [
        {
            id: "balance",
            label: "Resultado do ano",
            value: group.summary.balanceCents / 100,
            icon: RiWallet3Line,
            tone: group.summary.balanceCents < 0 ? "negative" : "positive",
        },
        {
            id: "income",
            label: "Receitas",
            value: group.summary.totalIncomeCents / 100,
            icon: RiArrowUpLine,
            tone: "positive",
        },
        {
            id: "expense",
            label: "Despesas",
            value: group.summary.totalExpenseCents / 100,
            icon: RiArrowDownLine,
            tone: "negative",
        },
        {
            id: "count",
            label: "Movimentações",
            formattedValue: String(group.summary.transactionCount),
            icon: RiExchangeFundsLine,
            tone: "primary",
        },
    ];

    return (
        <Card className="overflow-hidden p-0">
            <CardHeader
                icon={RiCalendarLine}
                eyebrow="Resumo anual"
                title={String(group.year)}
                description={`${group.summary.monthsWithMovement} ${group.summary.monthsWithMovement === 1 ? "mês com movimentação" : "meses com movimentação"}`}
                divider
            />

            <CardBody padding="none">
                <FinancialSummary
                    items={items}
                    columns={4}
                    divided
                    className="rounded-none border-0"
                />

                {expanded ? (
                    <div className="border-t border-border-subtle p-4 sm:p-5">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {group.months.map((month) => (
                                <MonthHistoryCard
                                    key={month.key}
                                    item={month}
                                    compact
                                />
                            ))}
                        </div>
                    </div>
                ) : null}
            </CardBody>
        </Card>
    );
}

export default YearHistoryGroup;
