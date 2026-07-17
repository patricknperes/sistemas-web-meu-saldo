import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";

import {
    MONTHS_LONG,
    WEEKDAYS_SHORT,
    addMonths,
    buildCalendarDays,
    formatISODate,
    isDateUnavailable,
    isSameDay,
    parseISODate,
    startOfMonth,
} from "./dateUtils.js";

function Calendar({
    value,
    onChange,
    min,
    max,
    isDateDisabled,
    initialMonth,
    showOutsideDays = true,
    className = "",
}) {
    const selectedDate = parseISODate(value);
    const today = new Date();
    const fallbackMonth =
        selectedDate ||
        parseISODate(initialMonth) ||
        today;

    const [visibleMonth, setVisibleMonth] = useState(() =>
        startOfMonth(fallbackMonth)
    );

    useEffect(() => {
        const nextSelectedDate = parseISODate(value);

        if (nextSelectedDate) {
            setVisibleMonth(startOfMonth(nextSelectedDate));
        }
    }, [value]);

    const days = useMemo(
        () => buildCalendarDays(visibleMonth),
        [visibleMonth]
    );

    const minDate = parseISODate(min);
    const maxDate = parseISODate(max);
    const previousMonth = addMonths(visibleMonth, -1);
    const nextMonth = addMonths(visibleMonth, 1);

    const previousDisabled = Boolean(
        minDate &&
        new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0) <
            new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    );

    const nextDisabled = Boolean(
        maxDate &&
        new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1) >
            new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    );

    function selectDate(date) {
        const nextValue = formatISODate(date);

        if (isDateUnavailable(date, { min, max, isDateDisabled })) {
            return;
        }

        onChange?.(nextValue);
    }

    return (
        <div className={`w-full select-none ${className}`}>
            <div className="flex items-center justify-between gap-3">
                <IconButton
                    icon={<RiArrowLeftSLine size={20} aria-hidden="true" />}
                    label="Mês anterior"
                    variant="ghost"
                    size="sm"
                    disabled={previousDisabled}
                    onClick={() => setVisibleMonth(previousMonth)}
                />

                <p
                    className="min-w-0 text-center text-body-sm font-title capitalize text-foreground"
                    aria-live="polite"
                >
                    {MONTHS_LONG[visibleMonth.getMonth()]} de {visibleMonth.getFullYear()}
                </p>

                <IconButton
                    icon={<RiArrowRightSLine size={20} aria-hidden="true" />}
                    label="Próximo mês"
                    variant="ghost"
                    size="sm"
                    disabled={nextDisabled}
                    onClick={() => setVisibleMonth(nextMonth)}
                />
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1" aria-hidden="true">
                {WEEKDAYS_SHORT.map((weekday, index) => (
                    <span
                        key={`${weekday}-${index}`}
                        className="flex h-7 items-center justify-center text-overline font-label uppercase text-subtle-foreground"
                    >
                        {weekday}
                    </span>
                ))}
            </div>

            <div
                role="grid"
                aria-label={`${MONTHS_LONG[visibleMonth.getMonth()]} de ${visibleMonth.getFullYear()}`}
                className="mt-1 grid grid-cols-7 gap-1"
            >
                {days.map(({ date, value: dayValue, outside }) => {
                    const disabled = isDateUnavailable(date, {
                        min,
                        max,
                        isDateDisabled,
                    });
                    const selected = Boolean(selectedDate && isSameDay(date, selectedDate));
                    const current = isSameDay(date, today);
                    const hidden = outside && !showOutsideDays;

                    return (
                        <button
                            key={dayValue}
                            type="button"
                            role="gridcell"
                            tabIndex={selected || (!selectedDate && current) ? 0 : -1}
                            disabled={disabled || hidden}
                            aria-selected={selected}
                            aria-current={current ? "date" : undefined}
                            aria-label={new Intl.DateTimeFormat("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }).format(date)}
                            className={`
                                relative flex aspect-square min-h-9 items-center justify-center rounded-lg
                                text-caption font-semibold outline-none transition-colors duration-150
                                focus-visible:ring-4 focus-visible:ring-primary/15
                                ${hidden ? "invisible" : ""}
                                ${outside ? "text-subtle-foreground" : "text-foreground-soft"}
                                ${!disabled && !selected ? "hover:bg-surface-hover hover:text-foreground" : ""}
                                ${selected ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover" : ""}
                                ${disabled ? "cursor-not-allowed text-disabled-foreground opacity-50" : ""}
                                ${current && !selected ? "after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-primary" : ""}
                            `}
                            onClick={() => selectDate(date)}
                            onKeyDown={(event) => {
                                const movement = {
                                    ArrowLeft: -1,
                                    ArrowRight: 1,
                                    ArrowUp: -7,
                                    ArrowDown: 7,
                                }[event.key];

                                if (!movement) {
                                    return;
                                }

                                event.preventDefault();
                                const targetDate = new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate() + movement
                                );

                                if (isDateUnavailable(targetDate, { min, max, isDateDisabled })) {
                                    return;
                                }

                                setVisibleMonth(startOfMonth(targetDate));
                                onChange?.(formatISODate(targetDate));
                            }}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
