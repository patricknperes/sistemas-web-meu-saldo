import {
    RiCalendarLine,
} from "react-icons/ri";

import {
    formatRelativeDate,
    formatTransactionDate,
    mergeClasses,
} from "./transactionUtils.js";

function TransactionDate({
    value,
    style = "medium",
    showIcon = true,
    showRelative = false,
    referenceDate,
    label,
    className = "",
}) {
    const formattedDate = formatTransactionDate(value, { style });
    const relativeLabel = showRelative
        ? formatRelativeDate(value, referenceDate)
        : "";

    return (
        <div
            className={mergeClasses(
                "inline-flex min-w-0 items-center gap-2",
                className
            )}
        >
            {showIcon ? (
                <RiCalendarLine
                    aria-hidden="true"
                    size={16}
                    className="shrink-0 text-subtle-foreground"
                />
            ) : null}

            <span className="min-w-0">
                {label ? (
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-subtle-foreground">
                        {label}
                    </span>
                ) : null}

                <span className="block truncate text-body-sm font-semibold text-foreground-soft">
                    {relativeLabel || formattedDate}
                </span>

                {relativeLabel ? (
                    <span className="mt-0.5 block text-caption text-muted-foreground">
                        {formattedDate}
                    </span>
                ) : null}
            </span>
        </div>
    );
}

export default TransactionDate;
