import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiLoopRightLine,
    RiPriceTag3Line,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

const toneConfiguration = {
    neutral: {
        icon: RiPriceTag3Line,
        className: "border-border bg-surface-muted text-foreground-soft",
    },
    income: {
        icon: RiArrowUpLine,
        className: "border-success/20 bg-success-muted text-success-strong",
    },
    expense: {
        icon: RiArrowDownLine,
        className: "border-danger/20 bg-danger-muted text-danger-strong",
    },
    recurring: {
        icon: RiLoopRightLine,
        className: "border-primary/20 bg-primary-muted text-primary",
    },
};

const sizeClasses = {
    sm: "h-6 gap-1.5 px-2 text-[0.6875rem]",
    md: "h-7 gap-1.5 px-2.5 text-caption",
};

function CategoryBadge({
    children,
    label,
    tone = "neutral",
    icon,
    size = "sm",
    className = "",
    title,
}) {
    const configuration = toneConfiguration[tone] ?? toneConfiguration.neutral;
    const Icon = icon || configuration.icon;
    const resolvedLabel = label ?? children;

    return (
        <span
            title={title || (typeof resolvedLabel === "string" ? resolvedLabel : undefined)}
            className={normalizeClassName(`
                inline-flex min-w-0 shrink-0 items-center
                rounded-md border font-semibold
                ${configuration.className}
                ${sizeClasses[size] ?? sizeClasses.sm}
                ${className}
            `)}
        >
            {Icon ? (
                <Icon
                    aria-hidden="true"
                    className="shrink-0"
                    size={size === "md" ? 14 : 13}
                />
            ) : null}

            <span className="min-w-0 truncate">
                {resolvedLabel}
            </span>
        </span>
    );
}

export default CategoryBadge;
