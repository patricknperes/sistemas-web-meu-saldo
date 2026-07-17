import {
    RiExchangeDollarLine,
    RiRepeat2Line,
} from "react-icons/ri";

import useControllableState from "../forms/useControllableState.js";
import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

const defaultOptions = [
    {
        value: "transactions",
        label: "Movimentações",
        icon: RiExchangeDollarLine,
    },
    {
        value: "recurring",
        label: "Recorrências",
        icon: RiRepeat2Line,
    },
];

function TransactionTabs({
    value,
    defaultValue = "transactions",
    onValueChange,
    options = defaultOptions,
    counts = {},
    fullWidth = false,
    className = "",
    ariaLabel = "Visualização das movimentações",
}) {
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });

    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={normalizeClassName(`
                inline-flex min-w-0 items-center gap-1
                rounded-xl border border-border
                bg-surface-subtle p-1
                ${fullWidth ? "w-full" : "w-auto"}
                ${className}
            `)}
        >
            {options.map((option) => {
                const active = currentValue === option.value;
                const Icon = option.icon;
                const count = counts?.[option.value];

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        tabIndex={active ? 0 : -1}
                        disabled={option.disabled}
                        onClick={() => setCurrentValue(option.value)}
                        className={normalizeClassName(`
                            inline-flex min-h-9 min-w-0 items-center justify-center gap-2
                            rounded-lg px-3 py-2
                            text-caption font-bold
                            outline-none transition-all duration-200 ease-smooth
                            focus-visible:ring-4 focus-visible:ring-primary/15
                            disabled:pointer-events-none disabled:opacity-50
                            ${fullWidth ? "flex-1" : ""}
                            ${active
                                ? "bg-surface text-foreground shadow-xs"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            }
                        `)}
                    >
                        {Icon ? (
                            <Icon size={17} aria-hidden="true" className="shrink-0" />
                        ) : null}

                        <span className="truncate">{option.label}</span>

                        {Number.isFinite(Number(count)) ? (
                            <span
                                className={normalizeClassName(`
                                    inline-flex min-w-5 items-center justify-center
                                    rounded-pill px-1.5 py-0.5
                                    text-[10px] font-extrabold tabular-nums
                                    ${active
                                        ? "bg-primary-muted text-primary"
                                        : "bg-surface-muted text-muted-foreground"
                                    }
                                `)}
                            >
                                {count}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}

export default TransactionTabs;
