function PageActions({
    children,
    align = "end",
    className = "",
}) {
    const alignmentClassName =
        align === "start"
            ? "justify-start"
            : align === "center"
                ? "justify-center"
                : "justify-start sm:justify-end";

    return (
        <div
            className={`
                flex w-full
                flex-wrap items-center
                gap-2.5
                sm:w-auto
                ${alignmentClassName}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

export default PageActions;
