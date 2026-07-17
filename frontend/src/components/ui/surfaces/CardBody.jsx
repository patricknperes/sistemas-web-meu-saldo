import {
    mergeClasses,
    paddingClasses,
} from "./surfaceStyles.js";

function CardBody({
    as: Component = "div",
    padding = "lg",
    className = "",
    children,
    ...props
}) {
    return (
        <Component
            className={mergeClasses(
                "min-w-0",
                paddingClasses[padding] || paddingClasses.lg,
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export default CardBody;
