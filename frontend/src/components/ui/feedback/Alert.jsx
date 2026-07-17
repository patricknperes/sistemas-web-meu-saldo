import {
    RiCheckboxCircleLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiInformationLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import {
    mergeClassNames,
} from "./overlayUtils.js";

const variants = {
    info: {
        icon: RiInformationLine,
        wrapper: "border-info/20 bg-info-muted",
        iconWrapper: "bg-info/10 text-info",
    },
    success: {
        icon: RiCheckboxCircleLine,
        wrapper: "border-success/20 bg-success-muted",
        iconWrapper: "bg-success/10 text-success",
    },
    warning: {
        icon: RiErrorWarningLine,
        wrapper: "border-warning/20 bg-warning-muted",
        iconWrapper: "bg-warning/10 text-warning",
    },
    danger: {
        icon: RiErrorWarningLine,
        wrapper: "border-danger/20 bg-danger-muted",
        iconWrapper: "bg-danger/10 text-danger",
    },
    neutral: {
        icon: RiInformationLine,
        wrapper: "border-border bg-surface-subtle",
        iconWrapper: "bg-surface-muted text-muted-foreground",
    },
};

function Alert({
    variant = "info",
    title,
    children,
    action,
    onDismiss,
    dismissLabel = "Fechar aviso",
    icon,
    className = "",
}) {
    const config = variants[variant] || variants.info;
    const Icon = icon || config.icon;

    return (
        <div
            role={variant === "danger" ? "alert" : "status"}
            className={mergeClassNames(
                "flex items-start gap-3 rounded-xl border p-4",
                config.wrapper,
                className
            )}
        >
            <span className={mergeClassNames(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                config.iconWrapper
            )}>
                <Icon size={19} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
                {title ? (
                    <p className="text-body-sm font-title text-foreground">
                        {title}
                    </p>
                ) : null}

                <div className={mergeClassNames(
                    "text-body-sm text-foreground-soft",
                    title && "mt-1"
                )}>
                    {children}
                </div>

                {action ? (
                    <div className="mt-3">{action}</div>
                ) : null}
            </div>

            {onDismiss ? (
                <IconButton
                    icon={<RiCloseLine size={18} aria-hidden="true" />}
                    label={dismissLabel}
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="-mr-1 -mt-1 shrink-0"
                />
            ) : null}
        </div>
    );
}

export default Alert;
