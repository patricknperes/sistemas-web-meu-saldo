import { cn } from "../../lib/cn.js";

function Card({ as: Component = "section", className, children, ...props }) {
    return (
        <Component
            className={cn(
                "min-w-0 rounded-card border border-border bg-surface shadow-card",
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

function CardHeader({ className, children, ...props }) {
    return (
        <header className={cn("p-5 sm:p-6", className)} {...props}>
            {children}
        </header>
    );
}

function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props}>
            {children}
        </div>
    );
}

export { Card, CardContent, CardHeader };
