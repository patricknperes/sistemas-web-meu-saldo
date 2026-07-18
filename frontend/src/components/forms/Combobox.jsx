import { useMemo, useState } from "react";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Command } from "cmdk";

import { cn } from "../../lib/cn.js";
import Button from "../ui/Button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover.jsx";
import { ScrollArea } from "../ui/ScrollArea.jsx";

function Combobox({ options, value, onChange, placeholder = "Selecionar", searchPlaceholder = "Pesquisar...", emptyMessage = "Nenhum resultado.", className }) {
    const [open, setOpen] = useState(false);
    const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="secondary" role="combobox" aria-expanded={open} className={cn("w-full justify-between font-medium", className)}>
                    <span className={cn("truncate", !selected && "text-subtle-foreground")}>{selected?.label ?? placeholder}</span>
                    <ChevronsUpDown className="size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command className="overflow-hidden rounded-[inherit] bg-transparent" shouldFilter>
                    <div className="flex h-10 items-center gap-2 border-b border-border px-3">
                        <Search className="size-4 text-subtle-foreground" aria-hidden="true" />
                        <Command.Input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle-foreground" placeholder={searchPlaceholder} />
                    </div>
                    <Command.Empty className="px-3 py-8 text-center text-sm text-subtle-foreground">{emptyMessage}</Command.Empty>
                    <ScrollArea className="max-h-64">
                        <Command.List className="p-1.5">
                            {options.map((option) => (
                                <Command.Item
                                    key={option.value}
                                    value={`${option.label} ${option.value}`}
                                    onSelect={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className="flex min-h-9 cursor-default items-center gap-2 rounded-control-sm px-2.5 py-2 text-sm outline-none data-[selected=true]:bg-surface-hover"
                                >
                                    <Check className={cn("size-4 text-primary", value === option.value ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                                    <span className="truncate">{option.label}</span>
                                </Command.Item>
                            ))}
                        </Command.List>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default Combobox;
