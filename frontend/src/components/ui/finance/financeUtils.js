export function mergeClasses(...values) {
    return values
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

export function toFiniteNumber(value, fallback = 0) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : fallback;
    }

    if (typeof value === "string") {
        const normalized = value
            .trim()
            .replace(/\s/g, "")
            .replace(/[^\d,.-]/g, "")
            .replace(/\.(?=.*\.)/g, "")
            .replace(",", ".");
        const parsed = Number(normalized);

        return Number.isFinite(parsed) ? parsed : fallback;
    }

    return fallback;
}

export function formatCurrency(
    value,
    {
        locale = "pt-BR",
        currency = "BRL",
        compact = false,
        minimumFractionDigits,
        maximumFractionDigits,
    } = {}
) {
    const number = toFiniteNumber(value);

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        minimumFractionDigits:
            minimumFractionDigits ?? (compact ? 0 : 2),
        maximumFractionDigits:
            maximumFractionDigits ?? (compact ? 1 : 2),
    }).format(number);
}

export function resolveFinancialTone(tone, value) {
    if (tone && tone !== "auto") {
        return tone;
    }

    const number = toFiniteNumber(value);

    if (number > 0) {
        return "positive";
    }

    if (number < 0) {
        return "negative";
    }

    return "neutral";
}

export const toneTextClasses = {
    neutral: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    positive: "text-success",
    success: "text-success",
    negative: "text-danger",
    danger: "text-danger",
    warning: "text-warning",
    info: "text-info",
};

export const toneMutedClasses = {
    neutral: "border-border bg-surface-muted text-muted-foreground",
    muted: "border-border bg-surface-subtle text-muted-foreground",
    primary: "border-primary/15 bg-primary-muted text-primary",
    positive: "border-success/15 bg-success-muted text-success",
    success: "border-success/15 bg-success-muted text-success",
    negative: "border-danger/15 bg-danger-muted text-danger",
    danger: "border-danger/15 bg-danger-muted text-danger",
    warning: "border-warning/15 bg-warning-muted text-warning",
    info: "border-info/15 bg-info-muted text-info",
};
