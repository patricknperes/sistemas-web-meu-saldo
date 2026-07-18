import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "../../../components/ui/Card.jsx";
import { formatHistoryCurrency } from "../utils/historyFormatters.js";

const fills = [
    "var(--app-danger)",
    "var(--app-secondary)",
    "var(--app-warning)",
    "var(--app-info)",
    "var(--app-primary)",
    "var(--app-accent)",
    "var(--app-subtle-foreground)",
];

function CategoryTooltip({ active, payload }) {
    if (!active || !payload?.[0]) return null;
    const item = payload[0];
    return (
        <div className="rounded-card-sm border border-border bg-surface/95 p-3 shadow-popover backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="money-nums mt-1 text-sm font-bold text-foreground">{formatHistoryCurrency(item.value)}</p>
        </div>
    );
}

function HistoryCategoryChart({ categories, loading }) {
    const data = categories.map((category) => ({ name: category.name, value: Number(category.amountCents) || 0 }));

    return (
        <Card className="p-5 sm:p-6 xl:col-span-5">
            <header className="mb-5 min-w-0">
                <h3 className="truncate font-bold tracking-[-0.02em] text-foreground">Despesas por categoria</h3>
                <p className="mt-1 text-sm text-muted-foreground">Categorias que mais consumiram recursos no período.</p>
            </header>

            {loading ? (
                <div className="h-[300px] animate-pulse rounded-2xl bg-surface-muted" />
            ) : data.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-center text-sm text-muted-foreground">Nenhuma despesa foi encontrada com os filtros atuais.</div>
            ) : (
                <div className="grid min-h-[300px] min-w-0 items-center gap-4 sm:grid-cols-2">
                    <div className="h-60 min-w-0 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={3} stroke="none">
                                    {data.map((item, index) => <Cell key={item.name} fill={fills[index % fills.length]} />)}
                                </Pie>
                                <Tooltip content={<CategoryTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="min-w-0 space-y-2.5">
                        {data.slice(0, 7).map((item, index) => (
                            <div key={item.name} className="flex min-w-0 items-center gap-2 text-xs">
                                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: fills[index % fills.length] }} />
                                <span className="min-w-0 flex-1 truncate text-muted-foreground" title={item.name}>{item.name}</span>
                                <strong className="money-nums shrink-0 text-foreground">{formatHistoryCurrency(item.value)}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

export default HistoryCategoryChart;
