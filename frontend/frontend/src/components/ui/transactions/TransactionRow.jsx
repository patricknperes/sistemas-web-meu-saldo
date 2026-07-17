import {
    DataTableCell,
    DataTableRow,
} from "../data-display/index.js";
import CategoryBadge from "../tags/CategoryBadge.jsx";
import TagGroup from "../tags/TagGroup.jsx";

import TransactionActions from "./TransactionActions.jsx";
import TransactionAmount from "./TransactionAmount.jsx";
import TransactionDate from "./TransactionDate.jsx";
import TransactionDescription from "./TransactionDescription.jsx";
import {
    extractTransactionTags,
    normalizeTransactionType,
} from "./transactionUtils.js";

function TransactionRow({
    transaction,
    selected = false,
    interactive = false,
    onClick,
    onView,
    onEdit,
    onDelete,
    deleting = false,
    showCategory = true,
    showTags = true,
    maxVisibleTags = 2,
    className = "",
}) {
    const type = normalizeTransactionType(transaction?.type);
    const tags = extractTransactionTags(transaction);
    const date = transaction?.date || transaction?.transactionDate || transaction?.createdAt;

    return (
        <DataTableRow
            selected={selected}
            interactive={interactive}
            onClick={onClick ? () => onClick(transaction) : undefined}
            className={className}
        >
            <DataTableCell className="min-w-64">
                <TransactionDescription
                    transaction={transaction}
                    compact
                />
            </DataTableCell>

            <DataTableCell className="min-w-48">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    {showCategory && transaction?.category ? (
                        <CategoryBadge
                            label={transaction.category}
                            tone={type === "INCOME" ? "income" : "expense"}
                        />
                    ) : null}

                    {showTags ? (
                        <TagGroup
                            tags={tags}
                            maxVisible={maxVisibleTags}
                            emptyFallback={
                                !transaction?.category
                                    ? <span className="text-caption text-subtle-foreground">Sem classificação</span>
                                    : null
                            }
                        />
                    ) : null}
                </div>
            </DataTableCell>

            <DataTableCell className="whitespace-nowrap">
                <TransactionDate
                    value={date}
                    style="compact"
                    showIcon={false}
                />
            </DataTableCell>

            <DataTableCell align="right" numeric className="whitespace-nowrap">
                <TransactionAmount
                    amount={transaction?.amount}
                    amountCents={transaction?.amountCents}
                    type={type}
                    size="sm"
                />
            </DataTableCell>

            <DataTableCell align="right" className="w-14">
                <TransactionActions
                    transaction={transaction}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    deleting={deleting}
                    canEdit={!transaction?.generatedByRecurrence}
                />
            </DataTableCell>
        </DataTableRow>
    );
}

export default TransactionRow;
