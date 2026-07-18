import { forwardRef } from "react";

import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(function TabsList({ className, ...props }, ref) {
    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn("inline-flex min-h-10 items-center gap-1 rounded-control bg-surface-muted p-1", className)}
            {...props}
        />
    );
});

const TabsTrigger = forwardRef(function TabsTrigger({ className, ...props }, ref) {
    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "inline-flex h-8 min-w-0 items-center justify-center rounded-control-sm px-3 text-sm font-semibold text-muted-foreground outline-none transition hover:text-foreground data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-xs focus-visible:ring-4 focus-visible:ring-primary/10 disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
});

const TabsContent = forwardRef(function TabsContent({ className, ...props }, ref) {
    return <TabsPrimitive.Content ref={ref} className={cn("mt-4 outline-none", className)} {...props} />;
});

export { Tabs, TabsContent, TabsList, TabsTrigger };
