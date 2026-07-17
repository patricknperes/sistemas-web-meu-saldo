import {
    forwardRef,
} from "react";

import {
    mergeClasses,
    paddingClasses,
    radiusClasses,
    surfaceVariantClasses,
} from "./surfaceStyles.js";

const Surface = forwardRef(
    function Surface(
        {
            as: Component = "div",
            variant = "default",
            radius = "xl",
            padding = "md",
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
                    "min-w-0",
                    surfaceVariantClasses[variant] || surfaceVariantClasses.default,
                    radiusClasses[radius] || radiusClasses.xl,
                    paddingClasses[padding] || paddingClasses.md,
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

export default Surface;
