import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card.jsx";
import { formatCompactCurrency } from "../utils/dashboardFormatters.js";
import DashboardChartTooltip from "./DashboardChartTooltip.jsx";

function CashFlowChart({
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
                lg:col-span-7
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
                    Fluxo financeiro
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Receitas e despesas distribuídas por mês.
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
                        O fluxo financeiro aparecerá quando houver movimentações.
                    </p>
                </div>
            ) : (
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 8,
                                right: 4,
                                left: -18,
                                bottom: 0,
                            }}
                            barGap={4}
                        >
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
                                tickFormatter={formatCompactCurrency}
                            />

                            <Tooltip
                                content={<DashboardChartTooltip />}
                                cursor={{
                                    fill: "var(--app-surface-muted)",
                                    opacity: 0.6,
                                }}
                            />

                            <Bar
                                dataKey="income"
                                name="Receitas"
                                fill="var(--app-success)"
                                radius={[6, 6, 2, 2]}
                                maxBarSize={28}
                            />

                            <Bar
                                dataKey="expense"
                                name="Despesas"
                                fill="var(--app-danger)"
                                radius={[6, 6, 2, 2]}
                                maxBarSize={28}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
}

export default CashFlowChart;