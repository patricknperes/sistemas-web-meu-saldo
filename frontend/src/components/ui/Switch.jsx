import { forwardRef } from "react";

import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Switch = forwardRef(function Switch({ className, ...props }, ref) {
    return (
        <SwitchPrimitive.Root
            ref={ref}
            className={cn(
                "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-surface-muted p-0.5 outline-none transition data-[state=checked]:bg-primary focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-white shadow-xs transition-transform data-[state=checked]:translate-x-5" />
        </SwitchPrimitive.Root>
    );
});

export default Switch;
