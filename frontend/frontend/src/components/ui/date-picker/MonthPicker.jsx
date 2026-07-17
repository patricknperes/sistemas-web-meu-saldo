import {
    MONTHS_SHORT,
    formatMonthValue,
    parseMonthValue,
} from "./dateUtils.js";

function MonthPicker({
    year,
    value,
    onChange,
    min,
    max,
    className = "",
}) {
    const selected = parseMonthValue(value);
    const minMonth = parseMonthValue(min);
    const maxMonth = parseMonthValue(max);

    return (
        <div
            role="grid"
            aria-label={`Meses de ${year}`}
            className={`grid grid-cols-3 gap-2 ${className}`}
        >
            {MONTHS_SHORT.map((monthLabel, index) => {
                const month = index + 1;
                const monthValue = formatMonthValue(year, month);
                const disabled = Boolean(
                    (minMonth && monthValue < min) ||
                    (maxMonth && monthValue > max)
                );
                const active = selected?.year === year && selected?.month === month;

                return (
                    <button
                        key={monthValue}
                        type="button"
                        role="gridcell"
                        disabled={disabled}
                        aria-selected={active}
                        className={`
                            h-11 rounded-lg border text-body-sm font-semibold outline-none
                            transition-[background-color,border-color,color,box-shadow] duration-150
                            focus-visible:ring-4 focus-visible:ring-primary/15
                            ${active
                                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                : "border-border bg-surface text-foreground-soft hover:border-primary/35 hover:bg-primary-muted hover:text-primary"}
                            ${disabled ? "cursor-not-allowed opacity-40" : ""}
                        `}
                        onClick={() => onChange?.(monthValue)}
                    >
                        {monthLabel}
                    </button>
                );
            })}
        </div>
    );
}

export default MonthPicker;
