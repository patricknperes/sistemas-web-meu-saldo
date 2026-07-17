import {
    RiRepeat2Line,
} from "react-icons/ri";

import CategoryBadge from "../tags/CategoryBadge.jsx";
import TagGroup from "../tags/TagGroup.jsx";

import TransactionTypeMark from "./TransactionTypeMark.jsx";
import {
    extractTransactionTags,
    mergeClasses,
    normalizeTransactionType,
    resolveRecurringTransaction,
} from "./transactionUtils.js";

function TransactionDescription({
    transaction = {},
    description,
    notes,
    category,
    tags,
    type,
    icon,
    generatedByRecurrence,
    showLeading = true,
    showCategory = false,
    showTags = false,
    maxVisibleTags = 2,
    compact = false,
    className = "",
}) {
    const resolvedType = normalizeTransactionType(type || transaction.type);
    const resolvedDescription = description || transaction.description || "Movimentação sem descrição";
    const resolvedNotes = notes ?? transaction.notes;
    const resolvedCategory = category ?? transaction.category;
    const resolvedTags = tags || extractTransactionTags(transaction);
    const isRecurring = generatedByRecurrence ?? resolveRecurringTransaction(transaction);

    return (
        <div
            className={mergeClasses(
                "flex min-w-0 items-start",
                compact ? "gap-2.5" : "gap-3",
                className
            )}
        >
            {showLeading ? (
                <TransactionTypeMark
                    type={resolvedType}
                    icon={icon}
                    size={compact ? "sm" : "md"}
                />
            ) : null}

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <strong
                        title={resolvedDescription}
                        className={mergeClasses(
                            "min-w-0 truncate font-bold text-foreground",
                            compact ? "text-body-sm" : "text-card-title"
                        )}
                    >
                        {resolvedDescription}
                    </strong>

                    {isRecurring ? (
                        <span
                            title="Movimentação criada automaticamente por uma recorrência."
                            className="inline-flex h-5 shrink-0 items-center gap-1 rounded-md bg-primary-muted px-1.5 text-[0.625rem] font-bold text-primary"
                        >
                            <RiRepeat2Line size={11} aria-hidden="true" />
                            Automática
                        </span>
                    ) : null}
                </div>

                {resolvedNotes ? (
                    <p
                        title={resolvedNotes}
                        className={mergeClasses(
                            "mt-1 text-muted-foreground",
                            compact
                                ? "truncate text-caption"
                                : "line-clamp-2 text-body-sm"
                        )}
                    >
                        {resolvedNotes}
                    </p>
                ) : null}

                {showCategory || showTags ? (
                    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
                        {showCategory && resolvedCategory ? (
                            <CategoryBadge
                                label={resolvedCategory}
                                tone={resolvedType === "INCOME" ? "income" : "expense"}
                            />
                        ) : null}

                        {showTags ? (
                            <TagGroup
                                tags={resolvedTags}
                                maxVisible={maxVisibleTags}
                                size="sm"
                                emptyFallback={null}
                            />
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default TransactionDescription;
