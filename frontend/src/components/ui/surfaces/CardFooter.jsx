import {
    mergeClasses,
    paddingClasses,
} from "./surfaceStyles.js";

const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
};

function CardFooter({
    as: Component = "footer",
    divider = true,
    align = "between",
    padding = "lg",
    wrap = true,
    className = "",
    children,
    ...props
}) {
    return (
        <Component
            className={mergeClasses(
                "flex min-w-0 items-center gap-3",
                divider ? "border-t border-border" : "",
                alignmentClasses[align] || alignmentClasses.between,
                wrap ? "flex-wrap" : "flex-nowrap",
                paddingClasses[padding] || paddingClasses.lg,
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export default CardFooter;
