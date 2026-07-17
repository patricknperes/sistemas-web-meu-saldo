import {
    useEffect,
    useState,
} from "react";

import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import useControllableState from "../forms/useControllableState.js";

import MonthPicker from "./MonthPicker.jsx";
import YearPicker from "./YearPicker.jsx";
import {
    parseMonthValue,
} from "./dateUtils.js";

function MonthYearPicker({
    value,
    defaultValue,
    onChange,
    min = "1970-01",
    max = `${new Date().getFullYear() + 20}-12`,
    className = "",
}) {
    const fallback = defaultValue || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue: fallback,
        onChange,
    });
    const parsed = parseMonthValue(currentValue) || parseMonthValue(fallback);
    const [visibleYear, setVisibleYear] = useState(parsed.year);
    const [view, setView] = useState("months");
    const minYear = parseMonthValue(min)?.year ?? 1970;
    const maxYear = parseMonthValue(max)?.year ?? new Date().getFullYear() + 20;

    useEffect(() => {
        if (parsed?.year) {
            setVisibleYear(parsed.year);
        }
    }, [parsed?.year]);

    return (
        <div className={className}>
            {view === "months" ? (
                <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <IconButton
                            icon={<RiArrowLeftSLine size={20} aria-hidden="true" />}
                            label="Ano anterior"
                            variant="ghost"
                            size="sm"
                            disabled={visibleYear <= minYear}
                            onClick={() => setVisibleYear((year) => year - 1)}
                        />

                        <button
                            type="button"
                            className="rounded-control px-3 py-2 text-body-sm font-label text-foreground outline-none transition-colors hover:bg-surface-hover focus-visible:ring-4 focus-visible:ring-primary/15"
                            onClick={() => setView("years")}
                        >
                            {visibleYear}
                        </button>

                        <IconButton
                            icon={<RiArrowRightSLine size={20} aria-hidden="true" />}
                            label="Próximo ano"
                            variant="ghost"
                            size="sm"
                            disabled={visibleYear >= maxYear}
                            onClick={() => setVisibleYear((year) => year + 1)}
                        />
                    </div>

                    <MonthPicker
                        year={visibleYear}
                        value={currentValue}
                        onChange={setCurrentValue}
                        min={min}
                        max={max}
                    />
                </>
            ) : (
                <YearPicker
                    value={visibleYear}
                    minYear={minYear}
                    maxYear={maxYear}
                    onChange={(year) => {
                        setVisibleYear(year);
                        setView("months");
                    }}
                />
            )}
        </div>
    );
}

export default MonthYearPicker;
