import { useState } from "react";

import {
    CalendarDays,
    CalendarRange,
    Check,
    ChevronRight,
    History,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";

import {
    DASHBOARD_FILTER_MODES,
    MONTHS,
} from "../utils/dashboardFormatters.js";

const FILTER_OPTIONS = [
    {
        value: DASHBOARD_FILTER_MODES.MONTH,
        label: "Mês específico",
        icon: CalendarDays,
    },
    {
        value: DASHBOARD_FILTER_MODES.YEAR,
        label: "Ano completo",
        icon: CalendarRange,
    },
    {
        value: DASHBOARD_FILTER_MODES.ALL,
        label: "Todo o histórico",
        icon: History,
    },
];

function buildYearOptions(selectedYear) {
    const currentYear = new Date().getFullYear();
    const normalizedYear = Number(selectedYear) || currentYear;
    const firstYear = Math.max(2020, currentYear - 8);
    const lastYear = Math.max(currentYear + 1, normalizedYear);
    const years = [];

    for (let year = lastYear; year >= firstYear; year -= 1) {
        years.push(year);
    }

    return years;
}

function MonthItems({
    selectedMonth,
    onSelect,
}) {
    return MONTHS.map((month) => {
        const isSelected = Number(selectedMonth) === month.value;

        return (
            <DropdownMenu.Item
                key={month.value}
                onSelect={(event) => onSelect(event, month.value)}
                className="
                    relative
                    flex min-h-9
                    cursor-default
                    select-none
                    items-center
                    rounded-control
                    px-3 pr-9
                    text-sm
                    text-muted-foreground
                    outline-none
                    transition-colors
                    hover:bg-primary-soft
                    hover:text-primary
                    focus:bg-primary-soft
                    focus:text-primary
                "
            >
                {month.label}

                {isSelected && (
                    <Check
                        aria-hidden="true"
                        className="absolute right-3 size-4 text-primary"
                        strokeWidth={2}
                    />
                )}
            </DropdownMenu.Item>
        );
    });
}

function YearItems({
    years,
    selectedYear,
    onSelect,
}) {
    return years.map((year) => {
        const isSelected = Number(selectedYear) === year;

        return (
            <DropdownMenu.Item
                key={year}
                onSelect={(event) => onSelect(event, year)}
                className="
                    relative
                    flex min-h-9
                    cursor-default
                    select-none
                    items-center
                    rounded-control
                    px-3 pr-9
                    text-sm
                    text-muted-foreground
                    outline-none
                    transition-colors
                    hover:bg-primary-soft
                    hover:text-primary
                    focus:bg-primary-soft
                    focus:text-primary
                "
            >
                {year}

                {isSelected && (
                    <Check
                        aria-hidden="true"
                        className="absolute right-3 size-4 text-primary"
                        strokeWidth={2}
                    />
                )}
            </DropdownMenu.Item>
        );
    });
}

function DashboardPeriodFilter({
    filters,
    onChange,
    disabled,
}) {
    const [desktopOpen, setDesktopOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);

    const years = buildYearOptions(filters.year);
    const showMonth = filters.filterMode === DASHBOARD_FILTER_MODES.MONTH;
    const showYear = filters.filterMode !== DASHBOARD_FILTER_MODES.ALL;

    const selectedOption = FILTER_OPTIONS.find(
        (option) => option.value === filters.filterMode,
    ) ?? FILTER_OPTIONS[0];

    const SelectedIcon = selectedOption.icon;

    function handleDesktopFilterModeSelect(event, filterMode) {
        event.preventDefault();
        onChange({ filterMode });
    }

    function handleDesktopMonthSelect(event, month) {
        event.preventDefault();

        onChange({
            filterMode: DASHBOARD_FILTER_MODES.MONTH,
            month,
        });
    }

    function handleDesktopYearSelect(event, year) {
        event.preventDefault();
        onChange({ year });
    }

    function handleMobileMonthSelect(event, month) {
        event.preventDefault();

        onChange({
            filterMode: DASHBOARD_FILTER_MODES.MONTH,
            month,
        });
    }

    function handleMobileMonthYearSelect(event, year) {
        event.preventDefault();

        onChange({
            filterMode: DASHBOARD_FILTER_MODES.MONTH,
            year,
        });
    }

    function handleMobileYearSelect(event, year) {
        event.preventDefault();

        onChange({
            filterMode: DASHBOARD_FILTER_MODES.YEAR,
            year,
        });
    }

    function handleMonthOpenChange(nextOpen) {
        setMonthOpen(nextOpen);

        if (nextOpen) {
            setYearOpen(false);
            onChange({
                filterMode: DASHBOARD_FILTER_MODES.MONTH,
            });
        }
    }

    function handleYearOpenChange(nextOpen) {
        setYearOpen(nextOpen);

        if (nextOpen) {
            setMonthOpen(false);
            onChange({
                filterMode: DASHBOARD_FILTER_MODES.YEAR,
            });
        }
    }

    function handleAllHistory() {
        setMonthOpen(false);
        setYearOpen(false);

        onChange({
            filterMode: DASHBOARD_FILTER_MODES.ALL,
        });
    }

    return (
        <>
            {/* Mobile */}
            <div
                className="flex items-center gap-0 sm:hidden"
                aria-label="Selecionar período"
            >
                <DropdownMenu.Root
                    open={monthOpen}
                    onOpenChange={handleMonthOpenChange}
                >
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            disabled={disabled}
                            aria-label="Selecionar mês"
                            aria-pressed={
                                filters.filterMode
                                === DASHBOARD_FILTER_MODES.MONTH
                            }
                            title="Mês específico"
                            className={[
                                `
                        inline-flex size-10
                        shrink-0
                        items-center justify-center
                        rounded-md
                        bg-transparent
                        outline-none
                        transition-colors
                        hover:bg-transparent
                        hover:text-primary
                        focus-visible:ring-2
                        focus-visible:ring-primary/25
                        disabled:pointer-events-none
                        disabled:opacity-50
                    `,
                                filters.filterMode === DASHBOARD_FILTER_MODES.MONTH
                                    ? "text-primary"
                                    : "text-muted-foreground",
                            ].join(" ")}
                        >
                            <CalendarDays
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={1.9}
                            />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            sideOffset={8}
                            collisionPadding={12}
                            className="
                    z-[120]
                    w-56
                    rounded-card-sm
                    border border-border
                    bg-surface-raised
                    p-2
                    text-foreground
                    shadow-popover
                    outline-none
                "
                        >
                            <DropdownMenu.Label
                                className="
                        px-3 py-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-subtle-foreground
                    "
                            >
                                Selecionar mês
                            </DropdownMenu.Label>

                            <div
                                className="
                        max-h-64
                        overflow-y-auto
                        overscroll-contain
                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                            >
                                <MonthItems
                                    selectedMonth={filters.month}
                                    onSelect={handleMobileMonthSelect}
                                />
                            </div>

                            <div className="mt-2 rounded-lg bg-primary-soft/60 p-1">
                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger
                                        className="
                                flex min-h-10
                                cursor-default
                                select-none
                                items-center gap-3
                                rounded-control
                                px-3
                                text-sm
                                font-medium
                                text-primary
                                outline-none
                                transition-colors
                                hover:bg-surface/70
                                focus:bg-surface/70
                                data-[state=open]:bg-surface/70
                            "
                                    >
                                        <CalendarRange
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                            strokeWidth={1.8}
                                        />

                                        <span className="flex-1">
                                            Ano
                                        </span>

                                        <span className="text-xs font-semibold">
                                            {filters.year}
                                        </span>

                                        <ChevronRight
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                        />
                                    </DropdownMenu.SubTrigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.SubContent
                                            sideOffset={6}
                                            alignOffset={-4}
                                            collisionPadding={12}
                                            className="
                                    z-[130]
                                    max-h-72
                                    min-w-32
                                    overflow-y-auto
                                    overscroll-contain
                                    rounded-card-sm
                                    border border-border
                                    bg-surface-raised
                                    p-2
                                    text-foreground
                                    shadow-popover
                                    outline-none
                                    [scrollbar-width:none]
                                    [-ms-overflow-style:none]
                                    [&::-webkit-scrollbar]:hidden
                                "
                                        >
                                            <YearItems
                                                years={years}
                                                selectedYear={filters.year}
                                                onSelect={handleMobileMonthYearSelect}
                                            />
                                        </DropdownMenu.SubContent>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Sub>
                            </div>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <span
                    aria-hidden="true"
                    className="mx-1 h-5 w-px shrink-0 bg-border"
                />

                <DropdownMenu.Root
                    open={yearOpen}
                    onOpenChange={handleYearOpenChange}
                >
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            disabled={disabled}
                            aria-label="Selecionar ano"
                            aria-pressed={
                                filters.filterMode
                                === DASHBOARD_FILTER_MODES.YEAR
                            }
                            title="Ano completo"
                            className={[
                                `
                        inline-flex size-10
                        shrink-0
                        items-center justify-center
                        rounded-md
                        bg-transparent
                        outline-none
                        transition-colors
                        hover:bg-transparent
                        hover:text-primary
                        focus-visible:ring-2
                        focus-visible:ring-primary/25
                        disabled:pointer-events-none
                        disabled:opacity-50
                    `,
                                filters.filterMode === DASHBOARD_FILTER_MODES.YEAR
                                    ? "text-primary"
                                    : "text-muted-foreground",
                            ].join(" ")}
                        >
                            <CalendarRange
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={1.9}
                            />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="center"
                            sideOffset={8}
                            collisionPadding={12}
                            className="
                    z-[120]
                    max-h-72
                    min-w-36
                    overflow-y-auto
                    overscroll-contain
                    rounded-card-sm
                    border border-border
                    bg-surface-raised
                    p-2
                    text-foreground
                    shadow-popover
                    outline-none
                    [scrollbar-width:none]
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                "
                        >
                            <DropdownMenu.Label
                                className="
                        px-3 py-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-subtle-foreground
                    "
                            >
                                Selecionar ano
                            </DropdownMenu.Label>

                            <YearItems
                                years={years}
                                selectedYear={filters.year}
                                onSelect={handleMobileYearSelect}
                            />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <span
                    aria-hidden="true"
                    className="mx-1 h-5 w-px shrink-0 bg-border"
                />

                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleAllHistory}
                    aria-label="Todo o histórico"
                    aria-pressed={
                        filters.filterMode
                        === DASHBOARD_FILTER_MODES.ALL
                    }
                    title="Todo o histórico"
                    className={[
                        `
                inline-flex size-10
                shrink-0
                items-center justify-center
                rounded-md
                bg-transparent
                outline-none
                transition-colors
                hover:bg-transparent
                hover:text-primary
                focus-visible:ring-2
                focus-visible:ring-primary/25
                disabled:pointer-events-none
                disabled:opacity-50
            `,
                        filters.filterMode === DASHBOARD_FILTER_MODES.ALL
                            ? "text-primary"
                            : "text-muted-foreground",
                    ].join(" ")}
                >
                    <History
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.9}
                    />
                </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:block">
                <DropdownMenu.Root
                    open={desktopOpen}
                    onOpenChange={setDesktopOpen}
                >
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            disabled={disabled}
                            aria-label={`Alterar período: ${selectedOption.label}`}
                            title={`Período: ${selectedOption.label}`}
                            className="
                                inline-flex size-9
                                shrink-0
                                items-center justify-center
                                rounded-md
                                bg-transparent
                                text-primary
                                outline-none
                                transition-colors
                                hover:bg-transparent
                                hover:text-primary-hover
                                focus-visible:ring-2
                                focus-visible:ring-primary/25
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >
                            <SelectedIcon
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={1.9}
                            />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            sideOffset={8}
                            collisionPadding={12}
                            className="
                                z-[120]
                                w-60
                                rounded-card-sm
                                border border-border
                                bg-surface-raised
                                p-2
                                text-foreground
                                shadow-popover
                                outline-none
                            "
                        >
                            <DropdownMenu.Label
                                className="
                                    px-3 py-2
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-subtle-foreground
                                "
                            >
                                Período
                            </DropdownMenu.Label>

                            <DropdownMenu.RadioGroup value={filters.filterMode}>
                                {FILTER_OPTIONS.map((option) => {
                                    const Icon = option.icon;

                                    return (
                                        <DropdownMenu.RadioItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={(event) => {
                                                handleDesktopFilterModeSelect(
                                                    event,
                                                    option.value,
                                                );
                                            }}
                                            className="
                                                relative
                                                flex min-h-10
                                                cursor-default
                                                select-none
                                                items-center gap-3
                                                rounded-control
                                                px-3 pr-9
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                                outline-none
                                                transition-colors
                                                hover:bg-primary-soft
                                                hover:text-primary
                                                focus:bg-primary-soft
                                                focus:text-primary
                                                data-[state=checked]:text-primary
                                            "
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="size-4 shrink-0"
                                                strokeWidth={1.8}
                                            />

                                            <span className="flex-1">
                                                {option.label}
                                            </span>

                                            <DropdownMenu.ItemIndicator
                                                className="
                                                    absolute right-3
                                                    inline-flex
                                                    items-center justify-center
                                                    text-primary
                                                "
                                            >
                                                <Check
                                                    aria-hidden="true"
                                                    className="size-4"
                                                    strokeWidth={2}
                                                />
                                            </DropdownMenu.ItemIndicator>
                                        </DropdownMenu.RadioItem>
                                    );
                                })}
                            </DropdownMenu.RadioGroup>

                            {(showMonth || showYear) && (
                                <DropdownMenu.Separator className="my-2 h-px bg-border" />
                            )}

                            {showMonth && (
                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger
                                        className="
                                            flex min-h-10
                                            cursor-default
                                            select-none
                                            items-center gap-3
                                            rounded-control
                                            px-3
                                            text-sm
                                            font-medium
                                            text-muted-foreground
                                            outline-none
                                            transition-colors
                                            hover:bg-primary-soft
                                            hover:text-primary
                                            focus:bg-primary-soft
                                            focus:text-primary
                                            data-[state=open]:bg-primary-soft
                                            data-[state=open]:text-primary
                                        "
                                    >
                                        <CalendarDays
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                            strokeWidth={1.8}
                                        />

                                        <span className="flex-1">
                                            Mês
                                        </span>

                                        <span className="text-xs text-subtle-foreground">
                                            {MONTHS.find(
                                                (month) =>
                                                    month.value === Number(filters.month),
                                            )?.label}
                                        </span>

                                        <ChevronRight
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                        />
                                    </DropdownMenu.SubTrigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.SubContent
                                            sideOffset={6}
                                            alignOffset={-4}
                                            collisionPadding={12}
                                            className="
                                                z-[130]
                                                max-h-72
                                                min-w-44
                                                overflow-y-auto
                                                overscroll-contain
                                                rounded-card-sm
                                                border border-border
                                                bg-surface-raised
                                                p-2
                                                text-foreground
                                                shadow-popover
                                                outline-none
                                                [scrollbar-width:none]
                                                [-ms-overflow-style:none]
                                                [&::-webkit-scrollbar]:hidden
                                            "
                                        >
                                            <MonthItems
                                                selectedMonth={filters.month}
                                                onSelect={handleDesktopMonthSelect}
                                            />
                                        </DropdownMenu.SubContent>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Sub>
                            )}

                            {showYear && (
                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger
                                        className="
                                            flex min-h-10
                                            cursor-default
                                            select-none
                                            items-center gap-3
                                            rounded-control
                                            px-3
                                            text-sm
                                            font-medium
                                            text-muted-foreground
                                            outline-none
                                            transition-colors
                                            hover:bg-primary-soft
                                            hover:text-primary
                                            focus:bg-primary-soft
                                            focus:text-primary
                                            data-[state=open]:bg-primary-soft
                                            data-[state=open]:text-primary
                                        "
                                    >
                                        <CalendarRange
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                            strokeWidth={1.8}
                                        />

                                        <span className="flex-1">
                                            Ano
                                        </span>

                                        <span className="text-xs text-subtle-foreground">
                                            {filters.year}
                                        </span>

                                        <ChevronRight
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                        />
                                    </DropdownMenu.SubTrigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.SubContent
                                            sideOffset={6}
                                            alignOffset={-4}
                                            collisionPadding={12}
                                            className="
                                                z-[130]
                                                max-h-72
                                                min-w-32
                                                overflow-y-auto
                                                overscroll-contain
                                                rounded-card-sm
                                                border border-border
                                                bg-surface-raised
                                                p-2
                                                text-foreground
                                                shadow-popover
                                                outline-none
                                                [scrollbar-width:none]
                                                [-ms-overflow-style:none]
                                                [&::-webkit-scrollbar]:hidden
                                            "
                                        >
                                            <YearItems
                                                years={years}
                                                selectedYear={filters.year}
                                                onSelect={handleDesktopYearSelect}
                                            />
                                        </DropdownMenu.SubContent>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Sub>
                            )}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </>
    );
}

export default DashboardPeriodFilter;