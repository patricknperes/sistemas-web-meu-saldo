import {
    useMemo,
    useState,
} from "react";

import {
    RiCalendar2Line,
    RiCloseLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import SegmentedControl from "../forms/SegmentedControl.jsx";
import useControllableState from "../forms/useControllableState.js";

import CalendarPopover from "./CalendarPopover.jsx";
import MonthYearPicker from "./MonthYearPicker.jsx";
import YearPicker from "./YearPicker.jsx";
import {
    formatMonthYearLabel,
} from "./dateUtils.js";

const modeOptions = [
    { value: "all", label: "Todo período" },
    { value: "month", label: "Mês" },
    { value: "year", label: "Ano" },
];

function normalizePeriod(value) {
    const currentYear = new Date().getFullYear();
    const currentMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    return {
        mode: value?.mode || "all",
        month: value?.month || currentMonth,
        year: Number(value?.year) || currentYear,
    };
}

function getPeriodLabel(period) {
    if (period.mode === "month") {
        return formatMonthYearLabel(period.month);
    }

    if (period.mode === "year") {
        return String(period.year);
    }

    return "Todo o período";
}

function PeriodPicker({
    value,
    defaultValue,
    onChange,
    minMonth = "1970-01",
    maxMonth = `${new Date().getFullYear() + 20}-12`,
    minYear = 1970,
    maxYear = new Date().getFullYear() + 20,
    disabled = false,
    className = "",
}) {
    const initial = useMemo(
        () => normalizePeriod(defaultValue),
        [defaultValue]
    );
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue: initial,
        onChange,
    });
    const period = normalizePeriod(currentValue);
    const [draft, setDraft] = useState(period);
    const [open, setOpen] = useState(false);

    function updateOpen(nextOpen) {
        if (nextOpen) {
            setDraft(period);
        }

        setOpen(nextOpen);
    }

    function apply(close) {
        setCurrentValue(draft);
        close();
    }

    const trigger = (
        <Button
            variant="outline"
            leadingIcon={<RiCalendar2Line size={18} aria-hidden="true" />}
            disabled={disabled}
            className={`justify-between ${className}`}
        >
            {getPeriodLabel(period)}
        </Button>
    );

    return (
        <CalendarPopover
            trigger={trigger}
            open={open}
            onOpenChange={updateOpen}
            title="Selecionar período"
            description="Defina como os dados financeiros serão agrupados."
            popoverClassName="w-[min(25rem,calc(100vw-1rem))] p-4"
        >
            {({ close }) => (
                <div className="grid gap-5">
                    <SegmentedControl
                        value={draft.mode}
                        onValueChange={(mode) => setDraft((current) => ({ ...current, mode }))}
                        options={modeOptions}
                        aria-label="Tipo de período"
                        fullWidth
                    />

                    {draft.mode === "month" ? (
                        <MonthYearPicker
                            value={draft.month}
                            onChange={(month) => setDraft((current) => ({ ...current, month }))}
                            min={minMonth}
                            max={maxMonth}
                        />
                    ) : null}

                    {draft.mode === "year" ? (
                        <YearPicker
                            value={draft.year}
                            onChange={(year) => setDraft((current) => ({ ...current, year }))}
                            minYear={minYear}
                            maxYear={maxYear}
                        />
                    ) : null}

                    {draft.mode === "all" ? (
                        <div className="rounded-xl border border-border bg-surface-subtle p-4 text-center">
                            <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
                                <RiCalendar2Line size={20} aria-hidden="true" />
                            </span>
                            <p className="mt-3 text-body-sm font-bold text-foreground">
                                Histórico completo
                            </p>
                            <p className="mt-1 text-caption text-muted-foreground">
                                Todos os lançamentos disponíveis serão considerados.
                            </p>
                        </div>
                    ) : null}

                    <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            leadingIcon={<RiCloseLine size={17} aria-hidden="true" />}
                            onClick={() => {
                                const reset = normalizePeriod({ mode: "all" });
                                setDraft(reset);
                                setCurrentValue(reset);
                                close();
                            }}
                        >
                            Limpar
                        </Button>

                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={close}>
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={() => apply(close)}>
                                Aplicar período
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </CalendarPopover>
    );
}

export default PeriodPicker;
