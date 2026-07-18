import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import ChartContainer from "../../../components/charts/ChartContainer.jsx";
import { formatHistoryCompactCurrency } from "../utils/historyFormatters.js";
import HistoryChartTooltip from "./HistoryChartTooltip.jsx";

function HistoryCashFlowChart({ data, loading }) {
    return (
        <ChartContainer
            title="Receitas e despesas"
            description="Comparação mensal das movimentações encontradas."
            height={310}
            className="xl:col-span-7"
        >
            {loading ? (
                <div className="h-full animate-pulse rounded-2xl bg-surface-muted" />
            ) : data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">Não há dados suficientes para montar o gráfico.</div>
            ) : (
                <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barGap={4}>
                    <CartesianGrid vertical={false} stroke="var(--app-border)" strokeDasharray="4 6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 11 }} tickFormatter={(value) => formatHistoryCompactCurrency(Number(value) * 100)} />
                    <Tooltip content={<HistoryChartTooltip />} cursor={{ fill: "var(--app-surface-muted)", opacity: 0.6 }} />
                    <Bar dataKey="income" name="Receitas" fill="var(--app-success)" radius={[6, 6, 2, 2]} maxBarSize={28} />
                    <Bar dataKey="expense" name="Despesas" fill="var(--app-danger)" radius={[6, 6, 2, 2]} maxBarSize={28} />
                </BarChart>
            )}
        </ChartContainer>
    );
}

export default HistoryCashFlowChart;
