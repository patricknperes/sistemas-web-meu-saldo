import { formatTooltipCurrency } from "../utils/dashboardFormatters.js";

function DashboardChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="min-w-44 rounded-card-sm border border-border bg-surface-raised p-3 shadow-popover">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-subtle-foreground">{label}</p>
            <div className="space-y-1.5">
                {payload.map((item) => (
                    <div key={item.dataKey} className="flex items-center justify-between gap-5 text-xs">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                            {item.name}
                        </span>
                        <strong className="font-mono text-foreground">{formatTooltipCurrency(item.value)}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardChartTooltip;
