import {
    forwardRef,
} from "react";

import {
    mergeClasses,
    paddingClasses,
    radiusClasses,
} from "./surfaceStyles.js";

const variantClasses = {
    default: `
        border border-border
        bg-surface
        shadow-xs
    `,
    subtle: `
        border border-border-subtle
        bg-surface-subtle
    `,
    outlined: `
        border border-border-strong
        bg-transparent
    `,
    elevated: `
        border border-border
        bg-surface-elevated
        shadow-card
    `,
    interactive: `
        border border-border
        bg-surface
        shadow-xs
        transition-[transform,border-color,box-shadow,background-color]
        duration-200 ease-out
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:bg-surface-elevated
        hover:shadow-card
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        active:translate-y-0
    `,
};

const Card = forwardRef(
    function Card(
        {
            as: Component = "article",
            variant = "default",
            radius = "xl",
            padding = "none",
            overflow = "hidden",
            className = "",
            children,
            ...props
        },
        ref
    ) {
        return (
            <Component
                ref={ref}
                className={mergeClasses(
                    "min-w-0 text-foreground",
                    variantClasses[variant] || variantClasses.default,
                    radiusClasses[radius] || radiusClasses.xl,
                    paddingClasses[padding] || paddingClasses.none,
                    overflow === "hidden" ? "overflow-hidden" : "overflow-visible",
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

export default Card;
