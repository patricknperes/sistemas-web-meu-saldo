import {
    forwardRef,
} from "react";

import {
    formatCurrency,
    mergeClasses,
    resolveFinancialTone,
    toFiniteNumber,
    toneTextClasses,
} from "./financeUtils.js";

const sizeClasses = {
    xs: "text-caption font-bold",
    sm: "text-body-sm font-bold",
    md: "text-card-title font-bold",
    lg: "text-section-title font-extrabold tracking-heading",
    xl: "text-page-title font-extrabold tracking-heading",
    display: "text-display font-extrabold tracking-display",
};

const CurrencyValue = forwardRef(
    function CurrencyValue(
        {
            as: Component = "span",
            value = 0,
            currency = "BRL",
            locale = "pt-BR",
            tone = "auto",
            size = "md",
            compact = false,
            showPositiveSign = false,
            showNegativeSign = true,
            minimumFractionDigits,
            maximumFractionDigits,
            prefix,
            suffix,
            className = "",
            ...props
        },
        ref
    ) {
        const numericValue = toFiniteNumber(value);
        const resolvedTone = resolveFinancialTone(tone, numericValue);
        const absoluteValue = Math.abs(numericValue);
        const formattedValue = formatCurrency(absoluteValue, {
            locale,
            currency,
            compact,
            minimumFractionDigits,
            maximumFractionDigits,
        });
        const sign = numericValue < 0
            ? showNegativeSign
                ? "− "
                : ""
            : numericValue > 0 && showPositiveSign
                ? "+ "
                : "";

        return (
            <Component
                ref={ref}
                className={mergeClasses(
                    "numeric-value inline-flex min-w-0 items-baseline whitespace-nowrap tabular-nums",
                    sizeClasses[size] || sizeClasses.md,
                    toneTextClasses[resolvedTone] || toneTextClasses.neutral,
                    className
                )}
                {...props}
            >
                {prefix ? (
                    <span className="mr-1 text-[0.78em] font-semibold opacity-70">
                        {prefix}
                    </span>
                ) : null}

                <span aria-hidden="true">{sign}</span>
                <span>{formattedValue}</span>

                {suffix ? (
                    <span className="ml-1.5 text-[0.68em] font-semibold text-muted-foreground">
                        {suffix}
                    </span>
                ) : null}
            </Component>
        );
    }
);

export default CurrencyValue;
