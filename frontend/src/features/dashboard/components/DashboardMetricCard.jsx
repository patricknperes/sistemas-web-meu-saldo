import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "../../../lib/cn.js";
import { formatCurrency } from "../../../utils/formatCurrency.js";

const toneStyles = {
    success: {
        icon: "bg-success-muted text-success",
        value: "text-success",
        accent: "bg-success",
    },
    danger: {
        icon: "bg-danger-muted text-danger",
        value: "text-danger",
        accent: "bg-danger",
    },
    primary: {
        icon: "bg-primary-soft text-primary",
        value: "text-foreground",
        accent: "bg-primary",
    },
    neutral: {
        icon: "bg-surface-muted text-muted-foreground",
        value: "text-foreground",
        accent: "bg-border-strong",
    },
};

function DashboardMetricCard({ title, valueCents, detail, icon: Icon, tone = "neutral", trend }) {
    const styles = toneStyles[tone] ?? toneStyles.neutral;
    const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;

    return (
        <article className="group relative min-w-0 overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-border-strong sm:p-6">
            <span className={cn("absolute inset-y-5 left-0 w-1 rounded-r-full opacity-70", styles.accent)} aria-hidden="true" />
            <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-muted-foreground">{title}</p>
                    <p className={cn("mt-3 truncate font-mono text-2xl font-bold tracking-[-0.045em] sm:text-[1.75rem]", styles.value)}>
                        {formatCurrency(valueCents)}
                    </p>
                </div>
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", styles.icon)}>
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
            </div>
            <div className="mt-4 flex min-w-0 items-center gap-2 text-xs text-subtle-foreground">
                {Number.isFinite(trend) && (
                    <span className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-semibold",
                        trend > 0 && "bg-success-muted text-success",
                        trend < 0 && "bg-danger-muted text-danger",
                        trend === 0 && "bg-surface-muted text-muted-foreground",
                    )}>
                        <TrendIcon className="size-3.5" aria-hidden="true" />
                        {Math.abs(trend).toFixed(1)}%
                    </span>
                )}
                <span className="truncate">{detail}</span>
            </div>
        </article>
    );
}

export default DashboardMetricCard;
