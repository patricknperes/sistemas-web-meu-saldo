import {
    RiCheckboxCircleLine,
    RiPauseCircleLine,
    RiStopCircleLine,
    RiTimeLine,
} from "react-icons/ri";

import {
    getRecurrenceStatusConfiguration,
    mergeClasses,
} from "./transactionUtils.js";

const statusStyles = {
    ACTIVE: {
        icon: RiCheckboxCircleLine,
        className: "border-success/20 bg-success-muted text-success-strong",
    },
    PAUSED: {
        icon: RiPauseCircleLine,
        className: "border-warning/20 bg-warning-muted text-warning-strong",
    },
    SCHEDULED: {
        icon: RiTimeLine,
        className: "border-info/20 bg-info-muted text-info-strong",
    },
    ENDED: {
        icon: RiStopCircleLine,
        className: "border-border bg-surface-muted text-muted-foreground",
    },
};

function RecurrenceStatusBadge({
    status,
    recurrence,
    showIcon = true,
    showDescription = false,
    size = "sm",
    className = "",
}) {
    const configuration = getRecurrenceStatusConfiguration(status, recurrence);
    const visual = statusStyles[configuration.status];
    const Icon = visual.icon;

    return (
        <span
            title={configuration.description}
            className={mergeClasses(
                "inline-flex min-w-0 items-center rounded-md border font-bold",
                size === "md"
                    ? "min-h-7 gap-1.5 px-2.5 text-caption"
                    : "h-6 gap-1.5 px-2 text-[0.6875rem]",
                visual.className,
                className
            )}
        >
            {showIcon ? <Icon size={13} aria-hidden="true" className="shrink-0" /> : null}
            <span className="truncate">{configuration.label}</span>
            {showDescription ? (
                <span className="hidden font-medium opacity-75 sm:inline">
                    · {configuration.description}
                </span>
            ) : null}
        </span>
    );
}

export default RecurrenceStatusBadge;
