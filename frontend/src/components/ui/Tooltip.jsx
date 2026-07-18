import { forwardRef } from "react";

import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn("z-50 max-w-64 rounded-control-sm bg-foreground px-2.5 py-1.5 text-xs text-background shadow-popover", className)}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
});

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
