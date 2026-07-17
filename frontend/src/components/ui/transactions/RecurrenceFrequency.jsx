import {
    RiRepeat2Line,
} from "react-icons/ri";

import {
    formatRecurrenceFrequency,
    mergeClasses,
} from "./transactionUtils.js";

function RecurrenceFrequency({
    intervalMonths = 1,
    dayOfMonth = 1,
    compact = false,
    label = "Frequência",
    className = "",
}) {
    const frequency = formatRecurrenceFrequency({ intervalMonths, dayOfMonth });

    return (
        <div className={mergeClasses("flex min-w-0 items-start gap-2.5", className)}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                <RiRepeat2Line size={16} aria-hidden="true" />
            </span>

            <span className="min-w-0">
                {!compact ? (
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-subtle-foreground">
                        {label}
                    </span>
                ) : null}

                <strong className="block truncate text-body-sm font-bold text-foreground-soft">
                    {frequency.label}
                </strong>
                <span className="mt-0.5 block text-caption text-muted-foreground">
                    {frequency.detail}
                </span>
            </span>
        </div>
    );
}

export default RecurrenceFrequency;
