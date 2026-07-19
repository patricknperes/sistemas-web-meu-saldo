import { useMemo } from "react";

import {
    ArrowDownLeft,
    ArrowUpRight,
    ReceiptText,
} from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    YAxis,
} from "recharts";

import { formatCurrency } from "../../../utils/formatCurrency.js";

const SERIES_CONFIG = {
    success: {
        dataKey: "income",
        fallbackDataKey: "totalIncomeCents",
        divideFallbackBy: 100,
    },
    danger: {
        dataKey: "expense",
        fallbackDataKey: "totalExpenseCents",
        divideFallbackBy: 100,
    },
    primary: {
        dataKey: "transactionCount",
        fallbackDataKey: null,
        divideFallbackBy: 1,
    },
};

function normalizeNumber(value) {
    const normalizedValue = Number(value);

    return Number.isFinite(normalizedValue)
        ? normalizedValue
        : 0;
}

function getPointValue(
    point,
    tone,
) {
    const config =
        SERIES_CONFIG[tone]
        ?? SERIES_CONFIG.primary;

    const directValue = Number(
        point?.[config.dataKey],
    );

    if (Number.isFinite(directValue)) {
        return directValue;
    }

    if (!config.fallbackDataKey) {
        return 0;
    }

    const fallbackValue = Number(
        point?.[config.fallbackDataKey],
    );

    if (!Number.isFinite(fallbackValue)) {
        return 0;
    }

    return fallbackValue
        / config.divideFallbackBy;
}

function getPointKey(
    point,
    index,
) {
    return (
        point?.key
        ?? point?.label
        ?? `${point?.year ?? "period"}-${point?.month ?? index}`
    );
}

function normalizeSeriesData(
    chartData,
    tone,
) {
    const sourceData = Array.isArray(
        chartData,
    )
        ? chartData
        : [];

    const normalizedData = sourceData.map(
        (point, index) => ({
            key: getPointKey(
                point,
                index,
            ),
            value: getPointValue(
                point,
                tone,
            ),
        }),
    );

    if (normalizedData.length === 0) {
        return [
            {
                key: "empty-start",
                value: 0,
            },
            {
                key: "empty-end",
                value: 0,
            },
        ];
    }

    if (normalizedData.length === 1) {
        const onlyPoint =
            normalizedData[0];

        return [
            {
                ...onlyPoint,
                key: `${onlyPoint.key}-start`,
            },
            {
                ...onlyPoint,
                key: `${onlyPoint.key}-end`,
            },
        ];
    }

    return normalizedData;
}

function getSeriesDomain(data) {
    const values = data.map(
        (point) =>
            normalizeNumber(point.value),
    );

    const minimumValue = Math.min(
        ...values,
    );

    const maximumValue = Math.max(
        ...values,
    );

    if (
        minimumValue === 0
        && maximumValue === 0
    ) {
        return [-1, 1];
    }

    if (
        minimumValue === maximumValue
    ) {
        const padding = Math.max(
            Math.abs(maximumValue) * 0.15,
            1,
        );

        return [
            Math.min(
                0,
                minimumValue - padding,
            ),
            maximumValue + padding,
        ];
    }

    const difference =
        maximumValue - minimumValue;

    const padding = Math.max(
        difference * 0.12,
        1,
    );

    return [
        Math.min(
            0,
            minimumValue - padding,
        ),
        maximumValue + padding,
    ];
}

function SummarySparkline({
    tone,
    chartData,
}) {
    const data = useMemo(
        () =>
            normalizeSeriesData(
                chartData,
                tone,
            ),
        [
            chartData,
            tone,
        ],
    );

    const domain = useMemo(
        () =>
            getSeriesDomain(data),
        [data],
    );

    const toneClassName =
        tone === "success"
            ? "text-success"
            : tone === "danger"
                ? "text-danger"
                : "text-primary";

    return (
        <div
            aria-hidden="true"
            className={`
                mt-3
                hidden
                h-10 min-h-10
                w-full min-w-0
                overflow-hidden
                lg:block
                ${toneClassName}
            `}
        >
            <ResponsiveContainer
                width="100%"
                height={40}
                minWidth={0}
            >
                <LineChart
                    data={data}
                    margin={{
                        top: 4,
                        right: 3,
                        bottom: 4,
                        left: 3,
                    }}
                >
                    <YAxis
                        hide
                        type="number"
                        domain={domain}
                        allowDataOverflow={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dot={false}
                        activeDot={false}
                        connectNulls
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function SummaryLine({
    icon: Icon,
    label,
    valueCents,
    detail,
    tone,
    chartData,
}) {
    const toneClassName =
        tone === "success"
            ? "bg-success-muted text-success"
            : tone === "danger"
                ? "bg-danger-muted text-danger"
                : "bg-primary-soft text-primary";

    return (
        <div
            className="
                flex min-w-0
                items-center gap-3
                py-3

                lg:flex-1
                lg:items-start
                lg:py-4
            "
        >
            <span
                className={`
                    flex size-9
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    ${toneClassName}
                `}
            >
                <Icon
                    aria-hidden="true"
                    className="size-4"
                />
            </span>

            <div className="min-w-0 flex-1">
                <div
                    className="
                        flex min-w-0
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                truncate
                                text-xs
                                text-muted-foreground
                            "
                        >
                            {label}
                        </p>

                        <p
                            className="
                                mt-0.5
                                truncate
                                font-mono
                                text-sm font-bold
                                text-foreground
                            "
                        >
                            {valueCents == null
                                ? detail
                                : formatCurrency(
                                    valueCents,
                                )}
                        </p>
                    </div>

                    {detail
                        && valueCents != null
                        && (
                            <span
                                className="
                                    shrink-0
                                    whitespace-nowrap
                                    text-xs
                                    text-subtle-foreground
                                "
                            >
                                {detail}
                            </span>
                        )}
                </div>

                <SummarySparkline
                    tone={tone}
                    chartData={chartData}
                />
            </div>
        </div>
    );
}

function DashboardSummaryPanel({
    summary,
    chartData = [],
}) {
    return (
        <aside
            className="
                min-w-0
                rounded-card
                border border-border
                bg-surface
                p-5
                shadow-card

                lg:col-span-4
                lg:flex
                lg:flex-col
            "
        >
            <div className="shrink-0">
                <p className="text-sm font-bold text-foreground">
                    Resumo do período
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    Volume financeiro e quantidade de lançamentos.
                </p>
            </div>

            <div
                className="
                    mt-4
                    divide-y divide-border

                    lg:flex
                    lg:flex-1
                    lg:flex-col
                "
            >
                <SummaryLine
                    icon={ArrowUpRight}
                    label="Receitas"
                    valueCents={
                        summary?.totalIncomeCents
                        ?? 0
                    }
                    detail={`${summary?.incomeCount ?? 0} itens`}
                    tone="success"
                    chartData={chartData}
                />

                <SummaryLine
                    icon={ArrowDownLeft}
                    label="Despesas"
                    valueCents={
                        summary?.totalExpenseCents
                        ?? 0
                    }
                    detail={`${summary?.expenseCount ?? 0} itens`}
                    tone="danger"
                    chartData={chartData}
                />

                <SummaryLine
                    icon={ReceiptText}
                    label="Movimentações"
                    detail={`${summary?.transactionCount ?? 0} lançamentos`}
                    tone="primary"
                    chartData={chartData}
                />
            </div>
        </aside>
    );
}

export default DashboardSummaryPanel;