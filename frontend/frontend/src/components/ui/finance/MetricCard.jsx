import {
    forwardRef,
} from "react";

import Card from "../surfaces/Card.jsx";
import {
    Skeleton,
} from "../feedback/Skeleton.jsx";
import CurrencyValue from "./CurrencyValue.jsx";
import TrendIndicator from "./TrendIndicator.jsx";
import {
    mergeClasses,
    toneMutedClasses,
} from "./financeUtils.js";

const valueSizeMap = {
    sm: "lg",
    md: "xl",
    lg: "display",
};

const MetricCard = forwardRef(
    function MetricCard(
        {
            as,
            label,
            value,
            formattedValue,
            description,
            icon: Icon,
            tone = "neutral",
            trend,
            status,
            chart,
            footer,
            loading = false,
            size = "md",
            interactive = false,
            className = "",
            ...props
        },
        ref
    ) {
        const component = as || (interactive ? "button" : "article");

        return (
            <Card
                ref={ref}
                as={component}
                variant={interactive ? "interactive" : "default"}
                className={mergeClasses(
                    "relative flex h-full min-w-0 flex-col text-left",
                    size === "sm" ? "p-4" : size === "lg" ? "p-6" : "p-5",
                    className
                )}
                {...props}
            >
                <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="truncate text-body-sm font-semibold text-muted-foreground">
                            {label}
                        </p>

                        {loading ? (
                            <Skeleton className="mt-3 h-9 w-40 rounded-lg" />
                        ) : formattedValue ? (
                            <strong className="numeric-value mt-2 block truncate text-page-title font-extrabold tracking-heading text-foreground tabular-nums">
                                {formattedValue}
                            </strong>
                        ) : (
                            <CurrencyValue
                                value={value}
                                tone={tone === "neutral" ? "auto" : tone}
                                size={valueSizeMap[size] || "xl"}
                                className="mt-2 max-w-full"
                            />
                        )}
                    </div>

                    {Icon ? (
                        <span
                            aria-hidden="true"
                            className={mergeClasses(
                                "flex shrink-0 items-center justify-center rounded-xl border",
                                size === "lg" ? "size-12" : "size-10",
                                toneMutedClasses[tone] || toneMutedClasses.neutral
                            )}
                        >
                            <Icon size={size === "lg" ? 22 : 19} />
                        </span>
                    ) : null}
                </div>

                <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
                    {loading ? (
                        <Skeleton className="h-6 w-24 rounded-pill" />
                    ) : trend ? (
                        <TrendIndicator {...trend} />
                    ) : null}

                    {status ? <div className="min-w-0">{status}</div> : null}

                    {description ? (
                        <p className="min-w-0 flex-1 text-caption text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </div>

                {chart ? (
                    <div className="mt-auto pt-5" aria-hidden="true">
                        {chart}
                    </div>
                ) : null}

                {footer ? (
                    <div className="mt-5 border-t border-border-subtle pt-4">
                        {footer}
                    </div>
                ) : null}
            </Card>
        );
    }
);

export default MetricCard;
