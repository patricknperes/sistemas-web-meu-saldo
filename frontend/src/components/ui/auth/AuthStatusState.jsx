import {
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiInformationLine,
    RiMailCheckLine,
} from "react-icons/ri";

const configuration = {
    success: {
        icon: RiCheckboxCircleLine,
        wrapper: "border-success/15 bg-success-muted text-success",
    },
    email: {
        icon: RiMailCheckLine,
        wrapper: "border-info/15 bg-info-muted text-info",
    },
    error: {
        icon: RiErrorWarningLine,
        wrapper: "border-danger/15 bg-danger-muted text-danger",
    },
    info: {
        icon: RiInformationLine,
        wrapper: "border-primary/15 bg-primary-muted text-primary",
    },
};

function AuthStatusState({
    variant = "success",
    icon,
    title,
    description,
    detail,
    actions,
    compact = false,
    className = "",
}) {
    const selected = configuration[variant] ?? configuration.success;
    const Icon = icon ?? selected.icon;

    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={`
                min-w-0 text-center
                ${compact ? "py-2" : "py-4"}
                ${className}
            `}
        >
            <span
                className={`
                    mx-auto flex items-center justify-center rounded-overlay border
                    ${compact ? "size-11" : "size-14"}
                    ${selected.wrapper}
                `}
            >
                <Icon
                    size={compact ? 22 : 27}
                    aria-hidden="true"
                />
            </span>

            <h2
                className={`
                    mt-4 font-heading tracking-heading text-foreground
                    ${compact ? "text-card-title" : "text-section-title"}
                `}
            >
                {title}
            </h2>

            {description ? (
                <p className="mx-auto mt-2 max-w-md text-body-sm text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {detail ? (
                <div className="mx-auto mt-4 max-w-md rounded-lg border border-border bg-surface-subtle px-3 py-2.5 text-body-sm font-title text-foreground-soft">
                    {detail}
                </div>
            ) : null}

            {actions ? (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {actions}
                </div>
            ) : null}
        </div>
    );
}

export default AuthStatusState;
