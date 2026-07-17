import CurrencyValue from "./CurrencyValue.jsx";
import {
    mergeClasses,
    toneMutedClasses,
} from "./financeUtils.js";

function FinancialSummaryItem({
    label,
    value,
    formattedValue,
    description,
    icon: Icon,
    tone = "neutral",
    className = "",
}) {
    return (
        <div
            className={mergeClasses(
                "flex min-w-0 items-center gap-3 px-4 py-3.5",
                className
            )}
        >
            {Icon ? (
                <span
                    aria-hidden="true"
                    className={mergeClasses(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                        toneMutedClasses[tone] || toneMutedClasses.neutral
                    )}
                >
                    <Icon size={17} />
                </span>
            ) : null}

            <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-semibold text-muted-foreground">
                    {label}
                </p>

                {description ? (
                    <p className="mt-0.5 truncate text-[0.6875rem] text-subtle-foreground">
                        {description}
                    </p>
                ) : null}
            </div>

            {formattedValue ? (
                <strong className="numeric-value shrink-0 text-body-sm font-extrabold tabular-nums text-foreground">
                    {formattedValue}
                </strong>
            ) : (
                <CurrencyValue
                    value={value}
                    tone={tone === "neutral" ? "auto" : tone}
                    size="sm"
                    className="shrink-0"
                />
            )}
        </div>
    );
}

function FinancialSummary({
    items = [],
    title,
    description,
    columns = 1,
    divided = true,
    className = "",
}) {
    const gridClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    };

    return (
        <section
            className={mergeClasses(
                "overflow-hidden rounded-xl border border-border bg-surface",
                className
            )}
        >
            {title || description ? (
                <header className="border-b border-border-subtle px-4 py-3.5">
                    {title ? (
                        <h3 className="text-card-title font-semibold text-foreground">
                            {title}
                        </h3>
                    ) : null}
                    {description ? (
                        <p className="mt-1 text-caption text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </header>
            ) : null}

            <div className={mergeClasses("grid", gridClasses[columns] || gridClasses[1])}>
                {items.map((item, index) => (
                    <FinancialSummaryItem
                        key={item.id || item.label || index}
                        {...item}
                        className={mergeClasses(
                            divided && index > 0 ? "border-t border-border-subtle" : "",
                            divided && columns > 1
                                ? "sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-border-subtle xl:[&:nth-child(n)]:border-l-0"
                                : ""
                        )}
                    />
                ))}
            </div>
        </section>
    );
}

export {
    FinancialSummaryItem,
};

export default FinancialSummary;
