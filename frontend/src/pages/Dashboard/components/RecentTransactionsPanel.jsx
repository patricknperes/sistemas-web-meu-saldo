import {
    RiArrowRightLine,
    RiHistoryLine,
} from "react-icons/ri";

import {
    LinkButton,
} from "../../../components/ui/actions/index.js";
import {
    DataList,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    ResponsiveDataView,
} from "../../../components/ui/data-display/index.js";
import {
    EmptyState,
} from "../../../components/ui/feedback/index.js";
import {
    Card,
    CardHeader,
} from "../../../components/ui/surfaces/index.js";
import {
    CategoryBadge,
    TagGroup,
} from "../../../components/ui/tags/index.js";
import {
    TransactionAmount,
    TransactionCard,
    TransactionDate,
    TransactionDescription,
    normalizeTransactionType,
    extractTransactionTags,
} from "../../../components/ui/transactions/index.js";

function RecentTransactionsPanel({
    transactions = [],
}) {
    const hasTransactions = transactions.length > 0;

    return (
        <Card className="min-w-0">
            <CardHeader
                eyebrow="Atividade"
                title="Movimentações recentes"
                description="Os cinco lançamentos mais recentes dentro do período selecionado."
                icon={RiHistoryLine}
                action={
                    <LinkButton
                        to="/historico"
                        variant="ghost"
                        size="sm"
                        trailingIcon={<RiArrowRightLine size={16} aria-hidden="true" />}
                    >
                        Ver histórico
                    </LinkButton>
                }
            />

            {!hasTransactions ? (
                <div className="p-4 sm:p-5">
                    <EmptyState
                        compact
                        title="Nenhuma movimentação neste período"
                        description="Assim que uma receita ou despesa for registrada, ela aparecerá aqui."
                    />
                </div>
            ) : (
                <ResponsiveDataView
                    breakpoint="md"
                    desktop={
                        <DataTable
                            density="compact"
                            className="rounded-none border-x-0 border-b-0 shadow-none"
                            tableClassName="min-w-[42rem]"
                        >
                            <DataTableHeader>
                                <DataTableRow hoverable={false}>
                                    <DataTableHead>Movimentação</DataTableHead>
                                    <DataTableHead>Classificação</DataTableHead>
                                    <DataTableHead>Data</DataTableHead>
                                    <DataTableHead align="right">Valor</DataTableHead>
                                </DataTableRow>
                            </DataTableHeader>

                            <DataTableBody>
                                {transactions.map((transaction) => {
                                    const type = normalizeTransactionType(transaction?.type);
                                    const tags = extractTransactionTags(transaction);

                                    return (
                                        <DataTableRow key={transaction.id}>
                                            <DataTableCell className="min-w-64">
                                                <TransactionDescription
                                                    transaction={transaction}
                                                    compact
                                                />
                                            </DataTableCell>

                                            <DataTableCell className="min-w-44">
                                                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                                                    {transaction.category ? (
                                                        <CategoryBadge
                                                            label={transaction.category}
                                                            tone={type === "INCOME" ? "income" : "expense"}
                                                        />
                                                    ) : null}
                                                    <TagGroup
                                                        tags={tags}
                                                        maxVisible={1}
                                                        emptyFallback={
                                                            !transaction.category ? (
                                                                <span className="text-caption text-subtle-foreground">
                                                                    Sem classificação
                                                                </span>
                                                            ) : null
                                                        }
                                                    />
                                                </div>
                                            </DataTableCell>

                                            <DataTableCell className="whitespace-nowrap">
                                                <TransactionDate
                                                    value={transaction.date}
                                                    style="compact"
                                                    showIcon={false}
                                                />
                                            </DataTableCell>

                                            <DataTableCell align="right" numeric className="whitespace-nowrap">
                                                <TransactionAmount
                                                    amountCents={transaction.amountCents}
                                                    type={type}
                                                    size="sm"
                                                />
                                            </DataTableCell>
                                        </DataTableRow>
                                    );
                                })}
                            </DataTableBody>
                        </DataTable>
                    }
                    mobile={
                        <DataList className="p-3 sm:p-4">
                            {transactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))}
                        </DataList>
                    }
                />
            )}
        </Card>
    );
}

export default RecentTransactionsPanel;
