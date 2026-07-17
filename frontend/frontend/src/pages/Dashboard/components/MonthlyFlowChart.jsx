import {
    formatCompactCurrencyFromCents,
} from "./dashboardUtils.js";

const WIDTH = 760;
const HEIGHT = 278;
const MARGIN = {
    top: 18,
    right: 16,
    bottom: 44,
    left: 62,
};

function getAxisValue(maxValue, step) {
    return Math.round((maxValue * step) / 4);
}

function MonthlyFlowChart({
    data = [],
    selectedKey,
}) {
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const maxValue = Math.max(
        1,
        ...data.flatMap((item) => [
            Number(item.totalIncomeCents) || 0,
            Number(item.totalExpenseCents) || 0,
        ]),
    );
    const groupWidth = data.length
        ? chartWidth / data.length
        : chartWidth;
    const barWidth = Math.min(18, Math.max(7, groupWidth * 0.24));
    const hasMultipleYears = new Set(data.map((item) => item.year)).size > 1;

    return (
        <div className="min-w-0 overflow-x-auto overscroll-x-contain">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-[17.5rem] min-w-[42rem] w-full"
                role="img"
                aria-label="Gráfico mensal comparando receitas e despesas"
            >
                <title>Receitas e despesas por mês</title>
                <desc>
                    Cada mês apresenta uma barra verde para receitas e uma barra vermelha para despesas.
                </desc>

                {Array.from({ length: 5 }, (_, index) => {
                    const y = MARGIN.top + (chartHeight * index) / 4;
                    const value = getAxisValue(maxValue, 4 - index);

                    return (
                        <g key={index}>
                            <line
                                x1={MARGIN.left}
                                x2={WIDTH - MARGIN.right}
                                y1={y}
                                y2={y}
                                stroke="var(--app-chart-grid)"
                                strokeWidth="1"
                            />
                            <text
                                x={MARGIN.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="var(--app-chart-label)"
                                fontSize="10"
                                fontWeight="600"
                            >
                                {formatCompactCurrencyFromCents(value)}
                            </text>
                        </g>
                    );
                })}

                {data.map((item, index) => {
                    const centerX = MARGIN.left + groupWidth * index + groupWidth / 2;
                    const incomeHeight = (item.totalIncomeCents / maxValue) * chartHeight;
                    const expenseHeight = (item.totalExpenseCents / maxValue) * chartHeight;
                    const isSelected = selectedKey === item.key;
                    const label = hasMultipleYears
                        ? `${item.label}/${String(item.year).slice(-2)}`
                        : item.label;

                    return (
                        <g key={item.key}>
                            {isSelected ? (
                                <rect
                                    x={MARGIN.left + groupWidth * index + 3}
                                    y={MARGIN.top - 6}
                                    width={Math.max(groupWidth - 6, 12)}
                                    height={chartHeight + 29}
                                    rx="9"
                                    fill="var(--app-primary-muted)"
                                />
                            ) : null}

                            <rect
                                x={centerX - barWidth - 2}
                                y={MARGIN.top + chartHeight - incomeHeight}
                                width={barWidth}
                                height={Math.max(incomeHeight, item.totalIncomeCents > 0 ? 2 : 0)}
                                rx="4"
                                fill="var(--app-success)"
                                opacity={selectedKey && !isSelected ? "0.52" : "0.92"}
                            >
                                <title>{`${item.label} de ${item.year}: receitas de ${formatCompactCurrencyFromCents(item.totalIncomeCents)}`}</title>
                            </rect>

                            <rect
                                x={centerX + 2}
                                y={MARGIN.top + chartHeight - expenseHeight}
                                width={barWidth}
                                height={Math.max(expenseHeight, item.totalExpenseCents > 0 ? 2 : 0)}
                                rx="4"
                                fill="var(--app-danger)"
                                opacity={selectedKey && !isSelected ? "0.52" : "0.85"}
                            >
                                <title>{`${item.label} de ${item.year}: despesas de ${formatCompactCurrencyFromCents(item.totalExpenseCents)}`}</title>
                            </rect>

                            <text
                                x={centerX}
                                y={HEIGHT - 17}
                                textAnchor="middle"
                                fill={isSelected ? "var(--app-primary)" : "var(--app-chart-label)"}
                                fontSize="10"
                                fontWeight={isSelected ? "800" : "600"}
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default MonthlyFlowChart;
