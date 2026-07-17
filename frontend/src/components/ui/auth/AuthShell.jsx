import AuthBrand from "./AuthBrand.jsx";

const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

function AuthShell({
    children,
    brand,
    aside,
    footer,
    maxWidth = "md",
    embedded = false,
    className = "",
    contentClassName = "",
}) {
    const hasAside = Boolean(aside);

    return (
        <section
            className={`
                relative isolate min-w-0 overflow-hidden bg-background text-foreground
                ${embedded ? "min-h-[680px] rounded-overlay border border-border" : "min-h-screen min-h-dvh"}
                ${className}
            `}
        >
            <div
                aria-hidden="true"
                className="surface-grid pointer-events-none absolute inset-0 opacity-45"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-primary-muted blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-36 -left-24 size-96 rounded-full bg-info-muted/80 blur-3xl"
            />

            <div
                className={`
                    relative z-10 mx-auto grid min-h-[inherit] w-full
                    ${embedded ? "p-3 sm:p-5" : "min-h-screen min-h-dvh p-4 sm:p-6 lg:p-8"}
                    ${hasAside ? "max-w-6xl lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]" : "max-w-2xl"}
                `}
            >
                {hasAside ? (
                    <aside className="hidden min-w-0 overflow-hidden rounded-overlay bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
                        {aside}
                    </aside>
                ) : null}

                <div
                    className={`
                        flex min-w-0 flex-col
                        ${hasAside ? "lg:pl-5" : ""}
                    `}
                >
                    <div className="flex items-center justify-between gap-4 px-1 py-2 sm:px-2">
                        {brand ?? <AuthBrand />}
                    </div>

                    <div className="flex min-h-0 flex-1 items-center justify-center py-5 sm:py-8">
                        <div
                            className={`
                                w-full rounded-card border border-border bg-surface p-5 shadow-xs
                                sm:p-7
                                ${widthClasses[maxWidth] ?? widthClasses.md}
                                ${contentClassName}
                            `}
                        >
                            {children}
                        </div>
                    </div>

                    {footer ? (
                        <footer className="px-2 pb-1 text-center text-caption text-muted-foreground">
                            {footer}
                        </footer>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default AuthShell;
