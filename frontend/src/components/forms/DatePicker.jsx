import {
    useEffect,
    useState,
} from "react";

import { DayPicker } from "@daypicker/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

import { cn } from "../../lib/cn.js";
import Button from "../ui/Button.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/Popover.jsx";

function isValidDate(value) {
    return (
        value instanceof Date
        && !Number.isNaN(value.getTime())
    );
}

function DatePicker({
    value,
    onChange,
    placeholder = "Selecione uma data",
    disabled,
    className,
}) {
    const [month, setMonth] = useState(
        isValidDate(value)
            ? value
            : new Date(),
    );

    useEffect(() => {
        if (isValidDate(value)) {
            setMonth(value);
        }
    }, [value]);

    function handleSelect(date) {
        if (!date) {
            return;
        }

        onChange?.(date);
        setMonth(date);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        `
                            !h-[44px]
                            !min-h-[44px]
                            !max-h-[44px]
                            w-full
                            justify-start
                            gap-2
                            overflow-hidden
                            !px-3
                            !py-0
                            font-medium
                        `,
                        !value && "text-subtle-foreground",
                        className,
                    )}
                >
                    <CalendarDays
                        aria-hidden="true"
                        className="size-4 shrink-0"
                    />

                    <span className="min-w-0 truncate">
                        {isValidDate(value)
                            ? format(
                                value,
                                "dd 'de' MMMM 'de' yyyy",
                                {
                                    locale: ptBR,
                                },
                            )
                            : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={6}
                className="
                    w-auto
                    overflow-hidden
                    p-3
                    data-[state=open]:animate-in
                    data-[state=open]:fade-in-0
                    data-[state=open]:zoom-in-95
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=closed]:zoom-out-95
                "
            >
                <DayPicker
                    mode="single"
                    required
                    selected={value}
                    onSelect={handleSelect}
                    month={month}
                    onMonthChange={setMonth}
                    locale={ptBR}
                    showOutsideDays
                    classNames={{
                        root: `
                            relative
                            text-sm
                            text-foreground
                        `,

                        months: `
                            relative
                            flex flex-col
                        `,

                        month: `
                            relative
                            block
                        `,

                        month_caption: `
                            mb-3
                            flex h-9
                            items-center justify-center
                            px-10
                            font-bold
                            capitalize
                            text-foreground
                        `,

                        caption_label: `
                            whitespace-nowrap
                            text-sm
                            font-bold
                            text-foreground
                        `,

                        nav: `
                            pointer-events-none
                            absolute
                            inset-x-0 top-0
                            z-20
                            flex h-9
                            items-center justify-between
                        `,

                        button_previous: `
                            pointer-events-auto
                            inline-flex size-9
                            cursor-pointer
                            items-center justify-center
                            rounded-control
                            text-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-muted
                            focus-visible:ring-4
                            focus-visible:ring-primary/10
                            disabled:pointer-events-none
                            disabled:opacity-30
                            dark:text-white
                            dark:hover:bg-white/10
                        `,

                        button_next: `
                            pointer-events-auto
                            inline-flex size-9
                            cursor-pointer
                            items-center justify-center
                            rounded-control
                            text-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-muted
                            focus-visible:ring-4
                            focus-visible:ring-primary/10
                            disabled:pointer-events-none
                            disabled:opacity-30
                            dark:text-white
                            dark:hover:bg-white/10
                        `,

                        chevron: `
                            size-4
                            fill-current
                            stroke-current
                            text-current
                        `,

                        month_grid: `
                            w-full
                            border-collapse
                        `,

                        weekdays: `
                            grid grid-cols-7
                        `,

                        weekday: `
                            flex size-9
                            items-center justify-center
                            text-xs font-semibold
                            text-subtle-foreground
                        `,

                        week: `
                            mt-1
                            grid grid-cols-7
                        `,

                        day: `
                            size-9
                            p-0
                            text-center
                        `,

                        day_button: `
                            inline-flex size-9
                            cursor-pointer
                            items-center justify-center
                            rounded-control-sm
                            text-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-muted
                            focus-visible:ring-4
                            focus-visible:ring-primary/10
                            dark:hover:bg-white/10
                        `,

                        selected: `
                            [&>button]:!bg-primary
                            [&>button]:!font-semibold
                            [&>button]:!text-primary-foreground
                            [&>button]:hover:!bg-primary-hover
                        `,

                        today: `
                            [&>button]:font-bold
                            [&>button]:text-primary
                        `,

                        outside: `
                            opacity-35
                        `,

                        disabled: `
                            pointer-events-none
                            opacity-30
                        `,
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default DatePicker;