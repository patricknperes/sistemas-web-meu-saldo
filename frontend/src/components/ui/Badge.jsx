import { cn } from "../../lib/cn.js";

const variantClasses = {
    neutral: "border-border bg-surface-muted text-muted-foreground",
    primary: "border-primary/15 bg-primary-soft text-primary",
    success: "border-success/15 bg-success-muted text-success",
    danger: "border-danger/15 bg-danger-muted text-danger",
    warning: "border-warning/15 bg-warning-muted text-warning",
    info: "border-info/15 bg-info-muted text-info",
    secondary: "border-secondary/15 bg-secondary-soft text-secondary",
};

function Badge({ className, variant = "neutral", children, ...props }) {
    return (
        <span
            className={cn(
                "inline-flex h-6 min-w-0 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold",
                variantClasses[variant] ?? variantClasses.neutral,
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export default Badge;
