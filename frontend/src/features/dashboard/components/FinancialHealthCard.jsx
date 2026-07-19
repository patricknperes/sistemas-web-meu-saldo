import {
    CircleGauge,
    Info,
} from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import { cn } from "../../../lib/cn.js";
import { getFinancialIndicators } from "../utils/dashboardFormatters.js";

const toneConfig = {
    success: {
        label: "Saudável",
        variant: "success",
        bar: "bg-success",
        message: "Você preservou uma boa parte das receitas.",
    },
    warning: {
        label: "Atenção",
        variant: "warning",
        bar: "bg-warning",
        message: "Há saldo positivo, mas com pouca margem.",
    },
    danger: {
        label: "Crítico",
        variant: "danger",
        bar: "bg-danger",
        message: "As despesas ultrapassaram as receitas.",
    },
    neutral: {
        label: "Sem base",
        variant: "neutral",
        bar: "bg-border-strong",
        message: "Registre movimentações para analisar o período.",
    },
};

function getPercentage(value) {
    const normalizedValue = Number(value) || 0;

    return Math.max(
        0,
        Math.min(100, normalizedValue),
    );
}

function FinancialHealthCard({
    summary,
}) {
    const indicators = getFinancialIndicators(summary);

    const config = toneConfig[indicators.healthTone]
        ?? toneConfig.neutral;

    const savingsRate = Number(
        indicators.savingsRate,
    ) || 0;

    const expenseRatio = Number(
        indicators.expenseRatio,
    ) || 0;

    const savingsProgress = getPercentage(savingsRate);
    const expenseProgress = getPercentage(expenseRatio);

    return (
        <article
            className="
                min-w-0
                rounded-[1.75rem]
                border border-border
                bg-surface
                p-5
                shadow-card
                sm:p-6
                lg:col-span-5
            "
        >
            <header
                className="
                    flex min-w-0
                    items-start justify-between
                    gap-4
                "
            >
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground">
                        Saúde financeira
                    </p>

                    <h2
                        className="
                            mt-1
                            text-lg font-bold
                            tracking-[-0.035em]
                            text-foreground
                            sm:text-xl
                        "
                    >
                        Leitura do período
                    </h2>
                </div>

                <span
                    className="
                        flex size-10
                        shrink-0
                        items-center justify-center
                        rounded-2xl
                        bg-primary-soft
                        text-primary
                        sm:size-11
                    "
                >
                    <CircleGauge
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                    />
                </span>
            </header>

            <div
                className="
                    mt-6
                    flex min-w-0
                    items-end justify-between
                    gap-3
                    sm:mt-7
                    sm:gap-4
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            truncate
                            font-mono
                            text-3xl font-bold
                            tracking-[-0.055em]
                            text-foreground
                            sm:text-4xl
                        "
                    >
                        {savingsRate.toFixed(1)}%
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                        das receitas ficaram no saldo
                    </p>
                </div>

                <Badge
                    variant={config.variant}
                    className="shrink-0"
                >
                    {config.label}
                </Badge>
            </div>

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                <div>
                    <div
                        className="
                            mb-2
                            flex min-w-0
                            items-center justify-between
                            gap-3
                            text-xs
                        "
                    >
                        <span className="truncate font-semibold text-muted-foreground">
                            Economia
                        </span>

                        <span className="shrink-0 font-mono font-bold text-foreground">
                            {savingsRate.toFixed(1)}%
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                            className={cn(
                                "h-full rounded-full transition-[width] duration-500",
                                config.bar,
                            )}
                            style={{
                                width: `${savingsProgress}%`,
                            }}
                        />
                    </div>
                </div>

                <div>
                    <div
                        className="
                            mb-2
                            flex min-w-0
                            items-center justify-between
                            gap-3
                            text-xs
                        "
                    >
                        <span className="truncate font-semibold text-muted-foreground">
                            Comprometimento da renda
                        </span>

                        <span className="shrink-0 font-mono font-bold text-foreground">
                            {expenseRatio.toFixed(1)}%
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-secondary
                                transition-[width]
                                duration-500
                            "
                            style={{
                                width: `${expenseProgress}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="
                    mt-5
                    flex min-w-0
                    items-start gap-2.5
                    rounded-2xl
                    bg-surface-muted
                    p-3
                    text-xs leading-5
                    text-muted-foreground
                    sm:mt-6
                "
            >
                <Info
                    aria-hidden="true"
                    className="
                        mt-0.5
                        size-4
                        shrink-0
                        text-primary
                    "
                />

                <p className="min-w-0">
                    {config.message}
                </p>
            </div>
        </article>
    );
}

export default FinancialHealthCard;