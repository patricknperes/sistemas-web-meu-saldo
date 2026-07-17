function PageDescription({
    children,
    as: Component = "p",
    className = "",
}) {
    return (
        <Component
            className={`
                max-w-3xl
                text-body
                text-muted-foreground
                ${className}
            `}
        >
            {children}
        </Component>
    );
}

export default PageDescription;
