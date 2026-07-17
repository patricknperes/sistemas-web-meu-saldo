import {
    mergeClasses,
} from "./financeUtils.js";

function ChartLegend({
    items = [],
    onItemClick,
    className = "",
}) {
    return (
        <div
            className={mergeClasses(
                "flex flex-wrap items-center gap-x-4 gap-y-2",
                className
            )}
            aria-label="Legenda do gráfico"
        >
            {items.map((item, index) => {
                const content = (
                    <>
                        <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-[3px]"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-caption font-semibold text-muted-foreground">
                            {item.label}
                        </span>
                        {item.value ? (
                            <span className="numeric-value text-caption font-bold text-foreground tabular-nums">
                                {item.value}
                            </span>
                        ) : null}
                    </>
                );

                if (onItemClick || item.onClick) {
                    return (
                        <button
                            key={item.id || item.label || index}
                            type="button"
                            aria-pressed={!item.disabled}
                            onClick={() => (item.onClick || onItemClick)?.(item, index)}
                            className={mergeClasses(
                                "inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                item.disabled ? "opacity-40" : "hover:opacity-75"
                            )}
                        >
                            {content}
                        </button>
                    );
                }

                return (
                    <span
                        key={item.id || item.label || index}
                        className={mergeClasses(
                            "inline-flex items-center gap-1.5",
                            item.disabled ? "opacity-40" : ""
                        )}
                    >
                        {content}
                    </span>
                );
            })}
        </div>
    );
}

export default ChartLegend;
