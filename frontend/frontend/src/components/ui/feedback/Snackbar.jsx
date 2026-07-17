import {
    useEffect,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiCheckboxCircleLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiInformationLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import Portal from "./Portal.jsx";
import {
    mergeClassNames,
} from "./overlayUtils.js";

const variants = {
    info: {
        icon: RiInformationLine,
        iconWrapper: "bg-info-muted text-info",
    },
    success: {
        icon: RiCheckboxCircleLine,
        iconWrapper: "bg-success-muted text-success",
    },
    warning: {
        icon: RiErrorWarningLine,
        iconWrapper: "bg-warning-muted text-warning",
    },
    danger: {
        icon: RiErrorWarningLine,
        iconWrapper: "bg-danger-muted text-danger",
    },
};

const positionClasses = {
    "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
    "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
    "top-right": "right-4 top-4 sm:right-6 sm:top-6",
    "top-left": "left-4 top-4 sm:left-6 sm:top-6",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
    "top-center": "left-1/2 top-4 -translate-x-1/2 sm:top-6",
};

function Snackbar({
    open,
    onOpenChange,
    variant = "info",
    title,
    description,
    action,
    duration = 5000,
    position = "bottom-right",
    closeLabel = "Fechar notificação",
    className = "",
}) {
    const config = variants[variant] || variants.info;
    const Icon = config.icon;

    useEffect(() => {
        if (!open || duration <= 0) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            onOpenChange?.(false);
        }, duration);

        return () => window.clearTimeout(timeout);
    }, [duration, onOpenChange, open]);

    return (
        <AnimatePresence>
            {open ? (
                <Portal>
                    <motion.div
                        role={variant === "danger" ? "alert" : "status"}
                        aria-live={variant === "danger" ? "assertive" : "polite"}
                        className={mergeClassNames(
                            "fixed z-[160] flex w-[calc(100vw-2rem)] max-w-md items-start gap-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-dropdown",
                            positionClasses[position] || positionClasses["bottom-right"],
                            className
                        )}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className={mergeClassNames(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                            config.iconWrapper
                        )}>
                            <Icon size={19} aria-hidden="true" />
                        </span>

                        <div className="min-w-0 flex-1 pt-0.5">
                            {title ? (
                                <p className="text-body-sm font-bold text-foreground">
                                    {title}
                                </p>
                            ) : null}

                            {description ? (
                                <p className={mergeClassNames(
                                    "text-body-sm text-muted-foreground",
                                    title && "mt-1"
                                )}>
                                    {description}
                                </p>
                            ) : null}

                            {action ? (
                                <div className="mt-3">{action}</div>
                            ) : null}
                        </div>

                        <IconButton
                            icon={<RiCloseLine size={18} aria-hidden="true" />}
                            label={closeLabel}
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange?.(false)}
                            className="-mr-1 -mt-1 shrink-0"
                        />
                    </motion.div>
                </Portal>
            ) : null}
        </AnimatePresence>
    );
}

export default Snackbar;
