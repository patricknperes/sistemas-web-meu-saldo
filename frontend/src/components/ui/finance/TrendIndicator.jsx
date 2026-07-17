import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiSubtractLine,
} from "react-icons/ri";

import {
    mergeClasses,
    toneMutedClasses,
    toneTextClasses,
    toFiniteNumber,
} from "./financeUtils.js";

const sizeClasses = {
    sm: "gap-1 text-[0.6875rem]",
    md: "gap-1.5 text-caption",
    lg: "gap-1.5 text-body-sm",
};

function resolveDirection(direction, value) {
    if (direction && direction !== "auto") {
        return direction;
    }

    const numericValue = toFiniteNumber(value);

    if (numericValue > 0) {
        return "up";
    }

    if (numericValue < 0) {
        return "down";
    }

    return "neutral";
}

function resolveTone(tone, direction, positiveIsGood) {
    if (tone && tone !== "auto") {
        return tone;
    }

    if (direction === "neutral") {
        return "neutral";
    }

    const isPositive = direction === "up";
    const isGood = positiveIsGood ? isPositive : !isPositive;

    return isGood ? "positive" : "negative";
}

function TrendIndicator({
    value,
    label,
    direction = "auto",
    tone = "auto",
    positiveIsGood = true,
    variant = "soft",
    size = "md",
    showIcon = true,
    className = "",
}) {
    const resolvedDirection = resolveDirection(direction, value);
    const resolvedTone = resolveTone(
        tone,
        resolvedDirection,
        positiveIsGood
    );
    const Icon = resolvedDirection === "up"
        ? RiArrowUpLine
        : resolvedDirection === "down"
            ? RiArrowDownLine
            : RiSubtractLine;
    const numericValue = typeof value === "number";
    const displayValue = numericValue
        ? `${Math.abs(value).toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        })}%`
        : value;

    return (
        <span
            className={mergeClasses(
                "inline-flex w-fit items-center whitespace-nowrap font-bold tabular-nums",
                sizeClasses[size] || sizeClasses.md,
                variant === "soft"
                    ? `rounded-pill border px-2 py-1 ${toneMutedClasses[resolvedTone] || toneMutedClasses.neutral}`
                    : toneTextClasses[resolvedTone] || toneTextClasses.neutral,
                className
            )}
        >
            {showIcon ? <Icon size="1em" aria-hidden="true" /> : null}
            {displayValue ? <span>{displayValue}</span> : null}
            {label ? (
                <span className={variant === "soft" ? "font-semibold opacity-80" : "font-medium text-muted-foreground"}>
                    {label}
                </span>
            ) : null}
        </span>
    );
}

export default TrendIndicator;
