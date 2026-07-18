import { forwardRef } from "react";

import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const ScrollArea = forwardRef(function ScrollArea({ className, children, ...props }, ref) {
    return (
        <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
            <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
});

const ScrollBar = forwardRef(function ScrollBar({ className, orientation = "vertical", ...props }, ref) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            ref={ref}
            orientation={orientation}
            className={cn(
                "flex touch-none select-none p-0.5 transition",
                orientation === "vertical" && "h-full w-2.5",
                orientation === "horizontal" && "h-2.5 flex-col",
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border-strong" />
        </ScrollAreaPrimitive.Scrollbar>
    );
});

export { ScrollArea, ScrollBar };
