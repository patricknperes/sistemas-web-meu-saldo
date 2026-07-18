import { forwardRef } from "react";

import { cn } from "../../lib/cn.js";

const sizeClasses = {
    sm: "size-9 rounded-control-sm",
    md: "size-10 rounded-control",
    lg: "size-12 rounded-control",
};

const IconButton = forwardRef(function IconButton(
    {
        className,
        size = "md",
        variant = "secondary",
        type = "button",
        children,
        ...props
    },
    ref,
) {
    const variantClass =
        variant === "ghost"
            ? "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            : "border border-border bg-surface text-muted-foreground shadow-xs hover:bg-surface-hover hover:text-foreground";

    return (
        <button
            ref={ref}
            type={type}
            className={cn(
                "inline-flex shrink-0 items-center justify-center outline-none transition duration-150 focus-visible:ring-4 focus-visible:ring-ring/15 disabled:pointer-events-none disabled:opacity-50",
                sizeClasses[size] ?? sizeClasses.md,
                variantClass,
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
});

export default IconButton;
