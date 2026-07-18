import { forwardRef } from "react";

import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = forwardRef(function PopoverContent(
    { className, align = "center", sideOffset = 8, ...props },
    ref,
) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 min-w-48 rounded-card-sm border border-border bg-surface-raised p-2 text-foreground shadow-popover outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
});

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
