import {
    useId,
} from "react";

function AuthTabs({
    value,
    onChange,
    options = [],
    ariaLabel = "Opções de autenticação",
    className = "",
}) {
    const reactId = useId();

    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={`
                grid min-w-0 gap-1 rounded-xl border border-border bg-surface-muted p-1
                ${className}
            `}
            style={{
                gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))`,
            }}
        >
            {options.map((option) => {
                const active = option.value === value;
                const Icon = option.icon;

                return (
                    <button
                        key={option.value}
                        id={`${reactId}-${option.value}-tab`}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        tabIndex={active ? 0 : -1}
                        disabled={option.disabled}
                        onClick={() => onChange?.(option.value)}
                        className={`
                            relative flex min-h-9 min-w-0 items-center justify-center gap-2
                            rounded-lg px-3 text-caption font-bold tracking-label outline-none
                            transition-[background-color,color,box-shadow,border-color] duration-150
                            focus-visible:ring-2 focus-visible:ring-ring/25
                            disabled:pointer-events-none disabled:opacity-45
                            ${active
                                ? "border border-border bg-surface text-foreground shadow-xs"
                                : "border border-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            }
                        `}
                    >
                        {Icon ? (
                            <Icon
                                size={16}
                                aria-hidden="true"
                                className="shrink-0"
                            />
                        ) : null}

                        <span className="truncate">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default AuthTabs;
