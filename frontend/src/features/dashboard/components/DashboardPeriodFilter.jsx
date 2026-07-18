import { CalendarRange } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import { DASHBOARD_FILTER_MODES, MONTHS } from "../utils/dashboardFormatters.js";

function buildYearOptions(selectedYear) {
    const currentYear = new Date().getFullYear();
    const firstYear = Math.max(2020, currentYear - 8);
    const lastYear = Math.max(currentYear + 1, selectedYear);
    const years = [];

    for (let year = lastYear; year >= firstYear; year -= 1) years.push(year);
    return years;
}

function DashboardPeriodFilter({ filters, onChange, disabled }) {
    const years = buildYearOptions(filters.year);
    const showMonth = filters.filterMode === DASHBOARD_FILTER_MODES.MONTH;
    const showYear = filters.filterMode !== DASHBOARD_FILTER_MODES.ALL;

    return (
        <div className="flex min-w-0 flex-col gap-2 rounded-card-sm border border-border bg-surface p-2 shadow-xs sm:flex-row sm:items-center">
            <div className="flex h-10 items-center gap-2 px-2 text-sm font-semibold text-muted-foreground">
                <CalendarRange className="size-4 text-primary" aria-hidden="true" />
                <span className="whitespace-nowrap">Período</span>
            </div>

            <Select
                value={filters.filterMode}
                onValueChange={(filterMode) => onChange({ filterMode })}
                disabled={disabled}
            >
                <SelectTrigger className="sm:w-44" aria-label="Tipo de período">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={DASHBOARD_FILTER_MODES.MONTH}>Mês específico</SelectItem>
                    <SelectItem value={DASHBOARD_FILTER_MODES.YEAR}>Ano completo</SelectItem>
                    <SelectItem value={DASHBOARD_FILTER_MODES.ALL}>Todo o histórico</SelectItem>
                </SelectContent>
            </Select>

            {showMonth && (
                <Select
                    value={String(filters.month)}
                    onValueChange={(month) => onChange({ month: Number(month) })}
                    disabled={disabled}
                >
                    <SelectTrigger className="sm:w-40" aria-label="Mês">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={String(month.value)}>{month.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {showYear && (
                <Select
                    value={String(filters.year)}
                    onValueChange={(year) => onChange({ year: Number(year) })}
                    disabled={disabled}
                >
                    <SelectTrigger className="sm:w-28" aria-label="Ano">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}

export default DashboardPeriodFilter;
