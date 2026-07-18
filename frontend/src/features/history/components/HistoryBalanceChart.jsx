import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import ChartContainer from "../../../components/charts/ChartContainer.jsx";
import { formatHistoryCompactCurrency } from "../utils/historyFormatters.js";
import HistoryChartTooltip from "./HistoryChartTooltip.jsx";

function HistoryBalanceChart({ data, loading }) {
    return (
        <ChartContainer
            title="Evolução do saldo"
            description="Resultado acumulado ao longo dos meses."
            height={310}
            className="xl:col-span-5"
        >
            {loading ? (
                <div className="h-full animate-pulse rounded-2xl bg-surface-muted" />
            ) : data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">A evolução aparecerá quando houver movimentações.</div>
            ) : (
                <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                        <linearGradient id="history-balance-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--app-primary)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--app-primary)" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--app-border)" strokeDasharray="4 6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 11 }} tickFormatter={(value) => formatHistoryCompactCurrency(Number(value) * 100)} />
                    <Tooltip content={<HistoryChartTooltip />} />
                    <Area type="monotone" dataKey="cumulativeBalance" name="Saldo acumulado" stroke="var(--app-primary)" strokeWidth={2.5} fill="url(#history-balance-fill)" activeDot={{ r: 5, fill: "var(--app-primary)", stroke: "var(--app-surface)", strokeWidth: 3 }} />
                </AreaChart>
            )}
        </ChartContainer>
    );
}

export default HistoryBalanceChart;
