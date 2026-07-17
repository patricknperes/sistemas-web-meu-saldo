function PageTitle({
    children,
    as: Component = "h1",
    className = "",
}) {
    return (
        <Component
            className={`
                text-page-title
                font-extrabold
                tracking-heading
                text-foreground
                ${className}
            `}
        >
            {children}
        </Component>
    );
}

export default PageTitle;
