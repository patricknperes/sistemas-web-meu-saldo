import {
    getMonthName,
} from "../../../utils/months.js";

const WIDTH = 760;
const HEIGHT = 278;
const MARGIN = {
    top: 18,
    right: 16,
    bottom: 44,
    left: 62,
};

function formatCompactCurrencyFromCents(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format((Number(value) || 0) / 100);
}

function HistoryFlowChart({
    data = [],
    selectedKey,
}) {
    const sorted = [...data]
        .sort((first, second) => first.key.localeCompare(second.key))
        .slice(-12);
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const maxValue = Math.max(
        1,
        ...sorted.flatMap((item) => [
            Number(item.totalIncomeCents) || 0,
            Number(item.totalExpenseCents) || 0,
        ]),
    );
    const groupWidth = sorted.length ? chartWidth / sorted.length : chartWidth;
    const barWidth = Math.min(18, Math.max(7, groupWidth * 0.24));
    const multipleYears = new Set(sorted.map((item) => item.year)).size > 1;

    return (
        <div className="min-w-0 overflow-x-auto overscroll-x-contain">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-[17.5rem] min-w-[42rem] w-full"
                role="img"
                aria-label="Gráfico mensal comparando receitas e despesas"
            >
                <title>Receitas e despesas por mês</title>
                <desc>As barras verdes representam receitas e as vermelhas representam despesas.</desc>

                {Array.from({ length: 5 }, (_, index) => {
                    const y = MARGIN.top + (chartHeight * index) / 4;
                    const value = Math.round((maxValue * (4 - index)) / 4);

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

                {sorted.map((item, index) => {
                    const centerX = MARGIN.left + groupWidth * index + groupWidth / 2;
                    const incomeHeight = ((Number(item.totalIncomeCents) || 0) / maxValue) * chartHeight;
                    const expenseHeight = ((Number(item.totalExpenseCents) || 0) / maxValue) * chartHeight;
                    const selected = selectedKey === item.key;
                    const monthLabel = getMonthName(Number(item.month)).slice(0, 3);
                    const label = multipleYears
                        ? `${monthLabel}/${String(item.year).slice(-2)}`
                        : monthLabel;

                    return (
                        <g key={item.key}>
                            {selected ? (
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
                                opacity={selectedKey && !selected ? "0.52" : "0.92"}
                            >
                                <title>{`${getMonthName(item.month)} de ${item.year}: ${formatCompactCurrencyFromCents(item.totalIncomeCents)} em receitas`}</title>
                            </rect>

                            <rect
                                x={centerX + 2}
                                y={MARGIN.top + chartHeight - expenseHeight}
                                width={barWidth}
                                height={Math.max(expenseHeight, item.totalExpenseCents > 0 ? 2 : 0)}
                                rx="4"
                                fill="var(--app-danger)"
                                opacity={selectedKey && !selected ? "0.52" : "0.85"}
                            >
                                <title>{`${getMonthName(item.month)} de ${item.year}: ${formatCompactCurrencyFromCents(item.totalExpenseCents)} em despesas`}</title>
                            </rect>

                            <text
                                x={centerX}
                                y={HEIGHT - 17}
                                textAnchor="middle"
                                fill={selected ? "var(--app-primary)" : "var(--app-chart-label)"}
                                fontSize="10"
                                fontWeight={selected ? "800" : "600"}
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

export default HistoryFlowChart;
