import {
    mergeClasses,
} from "./financeUtils.js";

function ChartTooltip({
    title,
    description,
    items = [],
    total,
    className = "",
    style,
}) {
    return (
        <div
            role="tooltip"
            className={mergeClasses(
                "min-w-44 rounded-xl border border-border bg-surface-elevated p-3 shadow-dropdown",
                className
            )}
            style={style}
        >
            {title ? (
                <p className="text-caption font-bold text-foreground">
                    {title}
                </p>
            ) : null}

            {description ? (
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {items.length ? (
                <div className="mt-2.5 grid gap-2">
                    {items.map((item, index) => (
                        <div
                            key={item.id || item.label || index}
                            className="flex min-w-0 items-center gap-2"
                        >
                            {item.color ? (
                                <span
                                    aria-hidden="true"
                                    className="size-2 shrink-0 rounded-[2px]"
                                    style={{ backgroundColor: item.color }}
                                />
                            ) : null}

                            <span className="min-w-0 flex-1 truncate text-[0.6875rem] font-medium text-muted-foreground">
                                {item.label}
                            </span>

                            <strong className="numeric-value shrink-0 text-caption font-bold text-foreground tabular-nums">
                                {item.value}
                            </strong>
                        </div>
                    ))}
                </div>
            ) : null}

            {total ? (
                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-border-subtle pt-2.5">
                    <span className="text-[0.6875rem] font-semibold text-muted-foreground">
                        {total.label || "Total"}
                    </span>
                    <strong className="numeric-value text-caption font-extrabold text-foreground tabular-nums">
                        {total.value}
                    </strong>
                </div>
            ) : null}
        </div>
    );
}

export default ChartTooltip;
