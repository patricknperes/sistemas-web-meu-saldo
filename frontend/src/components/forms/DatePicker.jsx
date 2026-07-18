import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "@daypicker/react";

import { cn } from "../../lib/cn.js";
import Button from "../ui/Button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover.jsx";

function DatePicker({ value, onChange, placeholder = "Selecione uma data", disabled, className }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className={cn("w-full justify-start font-medium", !value && "text-subtle-foreground", className)}
                    disabled={disabled}
                >
                    <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{value ? format(value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-3">
                <DayPicker
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    locale={ptBR}
                    showOutsideDays
                    classNames={{
                        root: "text-sm",
                        months: "flex flex-col",
                        month_caption: "mb-3 flex h-9 items-center justify-center font-bold capitalize",
                        nav: "absolute inset-x-3 top-3 flex items-center justify-between",
                        button_previous: "inline-flex size-9 items-center justify-center rounded-control hover:bg-surface-muted",
                        button_next: "inline-flex size-9 items-center justify-center rounded-control hover:bg-surface-muted",
                        month_grid: "border-collapse",
                        weekdays: "grid grid-cols-7",
                        weekday: "flex size-9 items-center justify-center text-xs font-semibold text-subtle-foreground",
                        week: "mt-1 grid grid-cols-7",
                        day: "size-9 text-center",
                        day_button: "inline-flex size-9 items-center justify-center rounded-control-sm outline-none transition hover:bg-surface-muted focus-visible:ring-4 focus-visible:ring-primary/10",
                        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary-hover",
                        today: "[&>button]:font-bold [&>button]:text-primary",
                        outside: "opacity-35",
                        disabled: "pointer-events-none opacity-30",
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default DatePicker;
