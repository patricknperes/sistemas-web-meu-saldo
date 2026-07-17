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

function getPageStart(year, pageSize) {
    return year - (year % pageSize);
}

function YearPicker({
    value,
    onChange,
    minYear = 1970,
    maxYear = new Date().getFullYear() + 20,
    pageSize = 12,
    className = "",
}) {
    const fallbackYear = Number(value) || new Date().getFullYear();
    const [pageStart, setPageStart] = useState(() =>
        getPageStart(fallbackYear, pageSize)
    );

    useEffect(() => {
        if (value) {
            setPageStart(getPageStart(Number(value), pageSize));
        }
    }, [pageSize, value]);

    const years = useMemo(
        () => Array.from({ length: pageSize }, (_, index) => pageStart + index),
        [pageSize, pageStart]
    );

    const columns = pageSize === 12 ? "grid-cols-3" : "grid-cols-4";

    return (
        <div className={className}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <IconButton
                    icon={<RiArrowLeftSLine size={20} aria-hidden="true" />}
                    label="Anos anteriores"
                    variant="ghost"
                    size="sm"
                    disabled={pageStart <= minYear}
                    onClick={() => setPageStart(pageStart - pageSize)}
                />

                <p className="text-body-sm font-title text-foreground">
                    {pageStart} – {pageStart + pageSize - 1}
                </p>

                <IconButton
                    icon={<RiArrowRightSLine size={20} aria-hidden="true" />}
                    label="Próximos anos"
                    variant="ghost"
                    size="sm"
                    disabled={pageStart + pageSize - 1 >= maxYear}
                    onClick={() => setPageStart(pageStart + pageSize)}
                />
            </div>

            <div role="grid" aria-label="Selecionar ano" className={`grid ${columns} gap-2`}>
                {years.map((year) => {
                    const active = Number(value) === year;
                    const disabled = year < minYear || year > maxYear;

                    return (
                        <button
                            key={year}
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
                                ${disabled ? "cursor-not-allowed opacity-35" : ""}
                            `}
                            onClick={() => onChange?.(year)}
                        >
                            {year}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default YearPicker;
