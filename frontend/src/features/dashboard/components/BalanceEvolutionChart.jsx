import { Area, AreaChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";

import ChartContainer from "../../../components/charts/ChartContainer.jsx";
import DashboardChartTooltip from "./DashboardChartTooltip.jsx";
import { formatCompactCurrency } from "../utils/dashboardFormatters.js";

function BalanceEvolutionChart({ data, loading }) {
    return (
        <ChartContainer
            title="Evolução do resultado"
            description="Saldo acumulado dentro do recorte exibido."
            height={300}
            className="lg:col-span-5"
        >
            {loading ? (
                <div className="h-full animate-pulse rounded-2xl bg-surface-muted" />
            ) : (
                <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                        <linearGradient id="dashboardBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--app-primary)" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="var(--app-primary)" stopOpacity={0.01} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--app-border)" strokeDasharray="4 6" />
                    <ReferenceLine y={0} stroke="var(--app-border-strong)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 11 }} tickFormatter={formatCompactCurrency} />
                    <Tooltip content={<DashboardChartTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="cumulativeBalance"
                        name="Saldo acumulado"
                        stroke="var(--app-primary)"
                        strokeWidth={2.5}
                        fill="url(#dashboardBalanceGradient)"
                        activeDot={{ r: 5, fill: "var(--app-primary)", stroke: "var(--app-surface)", strokeWidth: 3 }}
                    />
                </AreaChart>
            )}
        </ChartContainer>
    );
}

export default BalanceEvolutionChart;
