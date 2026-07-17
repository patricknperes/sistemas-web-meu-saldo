import {
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiInformationLine,
    RiShieldCheckLine,
} from "react-icons/ri";

import {
    mergeClasses,
    toneMutedClasses,
} from "./financeUtils.js";

const statusConfig = {
    healthy: {
        tone: "positive",
        icon: RiShieldCheckLine,
        defaultLabel: "Saldo saudável",
    },
    stable: {
        tone: "primary",
        icon: RiCheckboxCircleLine,
        defaultLabel: "Saldo estável",
    },
    attention: {
        tone: "warning",
        icon: RiErrorWarningLine,
        defaultLabel: "Requer atenção",
    },
    critical: {
        tone: "negative",
        icon: RiErrorWarningLine,
        defaultLabel: "Saldo crítico",
    },
    neutral: {
        tone: "neutral",
        icon: RiInformationLine,
        defaultLabel: "Sem classificação",
    },
};

function BalanceStatus({
    status = "neutral",
    label,
    description,
    compact = false,
    className = "",
}) {
    const config = statusConfig[status] || statusConfig.neutral;
    const Icon = config.icon;

    return (
        <div
            className={mergeClasses(
                "inline-flex min-w-0 items-center border",
                compact
                    ? "gap-1.5 rounded-pill px-2.5 py-1"
                    : "gap-3 rounded-xl px-3.5 py-3",
                toneMutedClasses[config.tone],
                className
            )}
        >
            <span
                aria-hidden="true"
                className={mergeClasses(
                    "flex shrink-0 items-center justify-center rounded-lg",
                    compact ? "size-5" : "size-9 bg-surface/55"
                )}
            >
                <Icon size={compact ? 14 : 18} />
            </span>

            <span className="min-w-0">
                <strong className={compact ? "text-caption font-bold" : "block text-body-sm font-bold"}>
                    {label || config.defaultLabel}
                </strong>

                {!compact && description ? (
                    <span className="mt-0.5 block text-caption font-medium opacity-80">
                        {description}
                    </span>
                ) : null}
            </span>
        </div>
    );
}

export default BalanceStatus;
