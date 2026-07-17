const maxWidthClasses = {
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1440px]",
    full: "max-w-none",
};

const spacingClasses = {
    compact: "gap-4 py-4 sm:py-5",
    default: "gap-section py-5 sm:py-6 lg:py-8",
    spacious: "gap-8 py-6 sm:py-8 lg:py-10",
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
                sm:px-5
                lg:px-6

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
