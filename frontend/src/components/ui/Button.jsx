import { forwardRef } from "react";

import { Slot } from "radix-ui";

import { cn } from "../../lib/cn.js";

import { buttonVariants } from "./buttonVariants.js";

const Button = forwardRef(function Button(
    { asChild = false, className, variant, size, type = "button", children, ...props },
    ref,
) {
    const Component = asChild ? Slot.Root : "button";

    return (
        <Component
            ref={ref}
            type={asChild ? undefined : type}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </Component>
    );
});

export default Button;
