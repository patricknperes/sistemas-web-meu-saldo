const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    metrics:
        "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    content:
        "grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]",
};

const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-5",
    xl: "gap-6",
};

function PageGrid({
    children,
    columns = 2,
    gap = "md",
    className = "",
}) {
    return (
        <div
            className={`
                grid min-w-0
                ${columnClasses[columns] ??
                    columnClasses[2]}
                ${gapClasses[gap] ??
                    gapClasses.md}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

export default PageGrid;
