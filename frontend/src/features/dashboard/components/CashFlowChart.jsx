import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import ChartContainer from "../../../components/charts/ChartContainer.jsx";
import DashboardChartTooltip from "./DashboardChartTooltip.jsx";
import { formatCompactCurrency } from "../utils/dashboardFormatters.js";

function CashFlowChart({ data, loading }) {
    return (
        <ChartContainer
            title="Fluxo financeiro"
            description="Receitas e despesas distribuídas por mês."
            height={300}
            className="lg:col-span-7"
        >
            {loading ? (
                <div className="h-full animate-pulse rounded-2xl bg-surface-muted" />
            ) : (
                <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barGap={4}>
                    <CartesianGrid vertical={false} stroke="var(--app-border)" strokeDasharray="4 6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 11 }} tickFormatter={formatCompactCurrency} />
                    <Tooltip content={<DashboardChartTooltip />} cursor={{ fill: "var(--app-surface-muted)", opacity: 0.6 }} />
                    <Bar dataKey="income" name="Receitas" fill="var(--app-success)" radius={[6, 6, 2, 2]} maxBarSize={28} />
                    <Bar dataKey="expense" name="Despesas" fill="var(--app-danger)" radius={[6, 6, 2, 2]} maxBarSize={28} />
                </BarChart>
            )}
        </ChartContainer>
    );
}

export default CashFlowChart;
