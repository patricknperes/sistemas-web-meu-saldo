import { formatHistoryCurrency } from "../utils/historyFormatters.js";

function HistoryChartTooltip({ active, payload, label }) {
    if (!active || !Array.isArray(payload) || payload.length === 0) return null;

    return (
        <div className="min-w-44 rounded-card-sm border border-border bg-surface/95 p-3 shadow-popover backdrop-blur-xl">
            <p className="mb-2 text-xs font-bold text-foreground">{payload[0]?.payload?.fullLabel || label}</p>
            <div className="space-y-1.5">
                {payload.map((item) => (
                    <div key={item.dataKey} className="flex items-center justify-between gap-5 text-xs">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.name}
                        </span>
                        <strong className="money-nums text-foreground">{formatHistoryCurrency(Number(item.value) * 100)}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoryChartTooltip;
