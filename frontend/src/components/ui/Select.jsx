import { forwardRef } from "react";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef(function SelectTrigger({ className, children, ...props }, ref) {
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-control border border-border bg-surface px-3 text-sm text-foreground shadow-xs outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:pointer-events-none disabled:opacity-50 [&>span]:truncate",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
});

const SelectContent = forwardRef(function SelectContent(
    { className, children, position = "popper", sideOffset = 6, ...props },
    ref,
) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                position={position}
                sideOffset={sideOffset}
                className={cn(
                    "relative z-50 max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-card-sm border border-border bg-surface-raised text-foreground shadow-popover",
                    className,
                )}
                {...props}
            >
                <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center text-subtle-foreground">
                    <ChevronUp className="size-4" aria-hidden="true" />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center text-subtle-foreground">
                    <ChevronDown className="size-4" aria-hidden="true" />
                </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
});

const SelectLabel = forwardRef(function SelectLabel({ className, ...props }, ref) {
    return (
        <SelectPrimitive.Label
            ref={ref}
            className={cn("px-2 py-1.5 text-xs font-semibold text-subtle-foreground", className)}
            {...props}
        />
    );
});

const SelectItem = forwardRef(function SelectItem({ className, children, ...props }, ref) {
    return (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex min-h-9 cursor-default select-none items-center rounded-control-sm py-2 pl-8 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-surface-hover data-[state=checked]:font-semibold data-[state=checked]:text-primary",
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex size-4 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="size-4" aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
});

const SelectSeparator = forwardRef(function SelectSeparator({ className, ...props }, ref) {
    return <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-border", className)} {...props} />;
});

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
