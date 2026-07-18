import { forwardRef } from "react";

import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Checkbox = forwardRef(function Checkbox({ className, ...props }, ref) {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                "peer inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-primary-foreground outline-none transition data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator>
                <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});

export default Checkbox;
