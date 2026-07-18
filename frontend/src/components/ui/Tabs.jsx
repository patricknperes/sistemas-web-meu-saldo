import { forwardRef } from "react";

import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(function TabsList({
    className,
    ...props
}, ref) {
    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn(
                `
                    flex min-h-11
                    w-full min-w-0
                    items-end
                    overflow-x-auto
                    overscroll-x-contain
                    border-b border-border
                    bg-transparent
                    [scrollbar-width:none]
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                `,
                className,
            )}
            {...props}
        />
    );
});

const TabsTrigger = forwardRef(function TabsTrigger({
    className,
    ...props
}, ref) {
    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                `
                    relative
                    inline-flex h-11
                    min-w-[112px] flex-1
                    shrink-0
                    items-center justify-center
                    gap-2
                    whitespace-nowrap
                    rounded-t-control-sm
                    px-4
                    text-sm font-semibold
                    text-muted-foreground
                    outline-none

                    transition-[color,background-color]
                    duration-200

                    after:absolute
                    after:inset-x-2
                    after:-bottom-px
                    after:h-0.5
                    after:origin-center
                    after:scale-x-0
                    after:rounded-full
                    after:bg-primary
                    after:transition-transform
                    after:duration-200
                    after:ease-out

                    hover:bg-primary-soft/40
                    hover:text-primary

                    data-[state=active]:bg-primary-soft/90
                    data-[state=active]:text-primary
                    data-[state=active]:after:scale-x-100

                    focus-visible:z-10
                    focus-visible:bg-primary-soft/50
                    focus-visible:ring-4
                    focus-visible:ring-inset
                    focus-visible:ring-primary/10

                    disabled:pointer-events-none
                    disabled:bg-transparent
                    disabled:text-subtle-foreground
                    disabled:opacity-45

                    sm:min-w-0
                    sm:flex-none
                `,
                className,
            )}
            {...props}
        />
    );
});

const TabsContent = forwardRef(function TabsContent({
    className,
    ...props
}, ref) {
    return (
        <TabsPrimitive.Content
            ref={ref}
            className={cn(
                `
                    mt-4
                    min-w-0
                    outline-none

                    data-[state=active]:animate-in
                    data-[state=active]:fade-in-0
                    data-[state=active]:slide-in-from-bottom-1
                    data-[state=active]:duration-200

                    focus-visible:rounded-control
                    focus-visible:ring-4
                    focus-visible:ring-primary/10
                `,
                className,
            )}
            {...props}
        />
    );
});

export {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
};