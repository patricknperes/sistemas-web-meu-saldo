import {
    DataCard,
    DataCardBody,
    DataCardField,
    DataCardFooter,
    DataCardHeader,
} from "../data-display/index.js";
import CategoryBadge from "../tags/CategoryBadge.jsx";
import TagGroup from "../tags/TagGroup.jsx";

import TransactionActions from "./TransactionActions.jsx";
import TransactionAmount from "./TransactionAmount.jsx";
import TransactionDate from "./TransactionDate.jsx";
import TransactionTypeMark from "./TransactionTypeMark.jsx";
import {
    extractTransactionTags,
    normalizeTransactionType,
    resolveRecurringTransaction,
} from "./transactionUtils.js";

function TransactionCard({
    transaction,
    selected = false,
    interactive = false,
    onClick,
    onView,
    onEdit,
    onDelete,
    deleting = false,
    className = "",
}) {
    const type = normalizeTransactionType(transaction?.type);
    const tags = extractTransactionTags(transaction);
    const date = transaction?.date || transaction?.transactionDate || transaction?.createdAt;
    const isRecurring = resolveRecurringTransaction(transaction);

    return (
        <DataCard
            selected={selected}
            interactive={interactive}
            onClick={onClick ? () => onClick(transaction) : undefined}
            className={className}
        >
            <DataCardHeader
                leading={<TransactionTypeMark type={type} />}
                title={transaction?.description || "Movimentação sem descrição"}
                description={transaction?.notes || transaction?.account || "Movimentação financeira"}
                value={
                    <TransactionAmount
                        amount={transaction?.amount}
                        amountCents={transaction?.amountCents}
                        type={type}
                        size="sm"
                    />
                }
                actions={
                    <TransactionActions
                        transaction={transaction}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        deleting={deleting}
                        canEdit={!transaction?.generatedByRecurrence}
                    />
                }
            />

            <DataCardBody>
                <DataCardField
                    label="Data"
                    value={
                        <TransactionDate
                            value={date}
                            style="compact"
                            showIcon={false}
                        />
                    }
                />

                <DataCardField
                    label="Categoria"
                    value={
                        transaction?.category ? (
                            <CategoryBadge
                                label={transaction.category}
                                tone={type === "INCOME" ? "income" : "expense"}
                            />
                        ) : (
                            <span className="text-caption text-subtle-foreground">Não informada</span>
                        )
                    }
                />
            </DataCardBody>

            {tags.length || isRecurring ? (
                <DataCardFooter>
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        {isRecurring ? (
                            <CategoryBadge label="Automática" tone="recurring" />
                        ) : null}

                        <TagGroup tags={tags} maxVisible={3} />
                    </div>
                </DataCardFooter>
            ) : null}
        </DataCard>
    );
}

export default TransactionCard;
