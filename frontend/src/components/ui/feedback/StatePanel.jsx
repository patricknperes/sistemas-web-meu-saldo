import {
    RiErrorWarningLine,
    RiFolderOpenLine,
    RiLoader4Line,
} from "react-icons/ri";

import {
    mergeClassNames,
} from "./overlayUtils.js";

const presets = {
    empty: {
        icon: RiFolderOpenLine,
        iconWrapper: "bg-primary-muted text-primary",
    },
    error: {
        icon: RiErrorWarningLine,
        iconWrapper: "bg-danger-muted text-danger",
    },
    loading: {
        icon: RiLoader4Line,
        iconWrapper: "bg-primary-muted text-primary",
    },
};

function StatePanel({
    type = "empty",
    icon,
    title,
    description,
    action,
    secondaryAction,
    compact = false,
    className = "",
}) {
    const config = presets[type] || presets.empty;
    const Icon = icon || config.icon;

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-busy={type === "loading" || undefined}
            className={mergeClassNames(
                "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-subtle text-center",
                compact ? "min-h-48 px-5 py-8" : "min-h-72 px-6 py-12",
                className
            )}
        >
            <span className={mergeClassNames(
                "flex size-12 items-center justify-center rounded-xl",
                config.iconWrapper
            )}>
                <Icon
                    size={24}
                    aria-hidden="true"
                    className={type === "loading" ? "animate-spin" : ""}
                />
            </span>

            {title ? (
                <h3 className="mt-5 text-card-title font-title">
                    {title}
                </h3>
            ) : null}

            {description ? (
                <p className="mt-2 max-w-md text-body-sm text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {(action || secondaryAction) ? (
                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
                    {secondaryAction}
                    {action}
                </div>
            ) : null}
        </div>
    );
}

export default StatePanel;
