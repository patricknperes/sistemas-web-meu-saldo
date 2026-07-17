const variantClasses = {
    surface:
        "border border-border bg-surface shadow-xs",
    subtle:
        "border border-border-subtle bg-surface-subtle",
    transparent:
        "border border-transparent bg-transparent",
};

function PageToolbar({
    children,
    startContent,
    endContent,
    variant = "surface",
    sticky = false,
    className = "",
}) {
    return (
        <div
            className={`
                ${sticky
                    ? "sticky top-2 z-20"
                    : "relative"
                }
                flex flex-col gap-3
                rounded-xl
                p-3
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-4

                ${variantClasses[variant] ??
                    variantClasses.surface}

                ${className}
            `}
        >
            <div
                className="
                    flex min-w-0 flex-1
                    flex-col gap-3
                    sm:flex-row
                    sm:items-center
                "
            >
                {startContent}
                {children}
            </div>

            {endContent && (
                <div
                    className="
                        flex shrink-0
                        flex-wrap
                        items-center gap-2
                    "
                >
                    {endContent}
                </div>
            )}
        </div>
    );
}

export default PageToolbar;
