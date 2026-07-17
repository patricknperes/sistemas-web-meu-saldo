const maxWidthClasses = {
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1440px]",
    full: "max-w-none",
};

const spacingClasses = {
    compact: "gap-section-compact py-page-y-compact",
    default: "gap-section py-page-y",
    spacious: "gap-section-spacious py-page-y-spacious",
};

function Page({
    children,
    as: Component = "div",
    maxWidth = "2xl",
    spacing = "default",
    className = "",
}) {
    return (
        <Component
            className={`
                mx-auto
                flex min-h-full
                w-full flex-col
                px-page

                ${maxWidthClasses[maxWidth] ??
                    maxWidthClasses["2xl"]}

                ${spacingClasses[spacing] ??
                    spacingClasses.default}

                ${className}
            `}
        >
            {children}
        </Component>
    );
}

export default Page;
