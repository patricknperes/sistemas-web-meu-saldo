import { ResponsiveContainer } from "recharts";

import { cn } from "../../lib/cn.js";

function ChartContainer({ title, description, actions, height = 280, className, children }) {
    return (
        <section className={cn("min-w-0 rounded-card border border-border bg-surface p-5 shadow-card", className)}>
            {(title || description || actions) && (
                <header className="mb-5 flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0">
                        {title && <h3 className="truncate font-bold tracking-[-0.02em] text-foreground">{title}</h3>}
                        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                    </div>
                    {actions}
                </header>
            )}
            <div style={{ height }} className="min-w-0">
                <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
            </div>
        </section>
    );
}

export default ChartContainer;
