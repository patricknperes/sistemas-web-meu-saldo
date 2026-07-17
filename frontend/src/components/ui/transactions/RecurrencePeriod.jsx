import {
    RiCalendarEventLine,
} from "react-icons/ri";

import {
    formatRecurrencePeriod,
    mergeClasses,
} from "./transactionUtils.js";

function RecurrencePeriod({
    startDate,
    endDate,
    compact = false,
    label = "Período",
    className = "",
}) {
    const period = formatRecurrencePeriod({ startDate, endDate });

    return (
        <div className={mergeClasses("flex min-w-0 items-start gap-2.5", className)}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                <RiCalendarEventLine size={16} aria-hidden="true" />
            </span>

            <span className="min-w-0">
                {!compact ? (
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-subtle-foreground">
                        {label}
                    </span>
                ) : null}

                <strong className="block text-body-sm font-bold text-foreground-soft">
                    {period.label}
                </strong>
            </span>
        </div>
    );
}

export default RecurrencePeriod;
