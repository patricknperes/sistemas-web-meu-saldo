import {
    forwardRef,
} from "react";

import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataCard = forwardRef(
    function DataCard(
        {
            children,
            as: Component = "article",
            interactive = false,
            selected = false,
            className = "",
            onClick,
            ...props
        },
        ref
    ) {
        const canInteract = interactive || typeof onClick === "function";

        function handleKeyDown(event) {
            props.onKeyDown?.(event);

            if (
                !canInteract ||
                event.defaultPrevented ||
                !["Enter", " "].includes(event.key)
            ) {
                return;
            }

            event.preventDefault();
            onClick?.(event);
        }

        return (
            <Component
                ref={ref}
                tabIndex={canInteract ? 0 : undefined}
                data-selected={selected || undefined}
                className={mergeClassNames(
                    "min-w-0 rounded-xl border border-border bg-surface p-4 shadow-xs transition-[border-color,background-color,box-shadow]",
                    selected ? "border-primary/30 bg-primary-muted/45" : "",
                    canInteract
                        ? "cursor-pointer hover:border-primary/25 hover:bg-surface-elevated hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                        : "",
                    className
                )}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

function DataCardHeader({
    leading,
    title,
    description,
    value,
    valueClassName = "",
    actions,
    className = "",
}) {
    return (
        <div className={mergeClassNames("flex min-w-0 items-start gap-3", className)}>
            {leading ? <div className="shrink-0">{leading}</div> : null}

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        {title ? (
                            <h3 className="truncate text-card-title font-title text-foreground">
                                {title}
                            </h3>
                        ) : null}

                        {description ? (
                            <p className="mt-0.5 truncate text-caption text-muted-foreground">
                                {description}
                            </p>
                        ) : null}
                    </div>

                    {value ? (
                        <strong className={mergeClassNames(
                            "numeric-value shrink-0 text-body-sm font-title text-foreground",
                            valueClassName
                        )}>
                            {value}
                        </strong>
                    ) : null}
                </div>
            </div>

            {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
    );
}

function DataCardBody({ children, className = "" }) {
    return (
        <div className={mergeClassNames("mt-4 grid grid-cols-2 gap-x-4 gap-y-3", className)}>
            {children}
        </div>
    );
}

function DataCardFooter({ children, className = "" }) {
    return (
        <div className={mergeClassNames("mt-4 border-t border-border-subtle pt-3", className)}>
            {children}
        </div>
    );
}

export {
    DataCard,
    DataCardBody,
    DataCardFooter,
    DataCardHeader,
};
