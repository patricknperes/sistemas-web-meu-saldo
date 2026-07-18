import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card.jsx";
import {
    formatCompactCurrency,
} from "../utils/dashboardFormatters.js";
import DashboardChartTooltip from "./DashboardChartTooltip.jsx";

function BalanceEvolutionChart({
    data = [],
    loading,
}) {
    const chartData = Array.isArray(data)
        ? data
        : [];

    return (
        <Card
            className="
                min-w-0
                p-5
                sm:p-6
                lg:col-span-5
            "
        >
            <header className="mb-5 min-w-0">
                <h3
                    className="
                        truncate
                        font-bold
                        tracking-[-0.02em]
                        text-foreground
                    "
                >
                    Evolução do resultado
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Saldo acumulado dentro do recorte exibido.
                </p>
            </header>

            {loading ? (
                <div
                    className="
                        h-[300px]
                        w-full
                        animate-pulse
                        rounded-2xl
                        bg-surface-muted
                    "
                />
            ) : chartData.length === 0 ? (
                <div
                    className="
                        flex h-[300px]
                        w-full min-w-0
                        items-center justify-center
                        px-6 py-8
                    "
                >
                    <p
                        className="
                            w-full max-w-md
                            text-center
                            text-sm leading-6
                            text-muted-foreground
                        "
                    >
                        A evolução do resultado aparecerá quando houver movimentações.
                    </p>
                </div>
            ) : (
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 8,
                                right: 4,
                                left: -18,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="dashboardBalanceGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--app-primary)"
                                        stopOpacity={0.28}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="var(--app-primary)"
                                        stopOpacity={0.01}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                stroke="var(--app-border)"
                                strokeDasharray="4 6"
                            />

                            <ReferenceLine
                                y={0}
                                stroke="var(--app-border-strong)"
                            />

                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "var(--app-subtle-foreground)",
                                    fontSize: 12,
                                }}
                                dy={10}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={72}
                                tick={{
                                    fill: "var(--app-subtle-foreground)",
                                    fontSize: 11,
                                }}
                                tickFormatter={formatCompactCurrency}
                            />

                            <Tooltip
                                content={<DashboardChartTooltip />}
                            />

                            <Area
                                type="monotone"
                                dataKey="cumulativeBalance"
                                name="Saldo acumulado"
                                stroke="var(--app-primary)"
                                strokeWidth={2.5}
                                fill="url(#dashboardBalanceGradient)"
                                activeDot={{
                                    r: 5,
                                    fill: "var(--app-primary)",
                                    stroke: "var(--app-surface)",
                                    strokeWidth: 3,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
}

export default BalanceEvolutionChart;