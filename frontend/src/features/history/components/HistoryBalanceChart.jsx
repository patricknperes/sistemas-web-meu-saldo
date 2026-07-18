import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card.jsx";
import { formatHistoryCompactCurrency } from "../utils/historyFormatters.js";
import HistoryChartTooltip from "./HistoryChartTooltip.jsx";

function HistoryBalanceChart({
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
                xl:col-span-5
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
                    Evolução do saldo
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Resultado acumulado ao longo dos meses.
                </p>
            </header>

            {loading ? (
                <div
                    className="
                        h-[310px]
                        w-full
                        animate-pulse
                        rounded-2xl
                        bg-surface-muted
                    "
                />
            ) : chartData.length === 0 ? (
                <div
                    className="
                        flex h-[310px]
                        w-full min-w-0
                        items-center justify-center
                        px-6 py-8
                        text-center
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
                        A evolução aparecerá quando houver movimentações.
                    </p>
                </div>
            ) : (
                <div className="h-[310px] w-full min-w-0">
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
                                    id="history-balance-fill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--app-primary)"
                                        stopOpacity={0.35}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="var(--app-primary)"
                                        stopOpacity={0.02}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                stroke="var(--app-border)"
                                strokeDasharray="4 6"
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
                                tickFormatter={(value) => (
                                    formatHistoryCompactCurrency(
                                        Number(value) * 100,
                                    )
                                )}
                            />

                            <Tooltip
                                content={<HistoryChartTooltip />}
                            />

                            <Area
                                type="monotone"
                                dataKey="cumulativeBalance"
                                name="Saldo acumulado"
                                stroke="var(--app-primary)"
                                strokeWidth={2.5}
                                fill="url(#history-balance-fill)"
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

export default HistoryBalanceChart;