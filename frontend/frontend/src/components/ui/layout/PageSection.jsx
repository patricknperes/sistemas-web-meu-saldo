function PageSection({
    children,
    title,
    description,
    eyebrow,
    actions,
    as: Component = "section",
    divided = false,
    className = "",
    contentClassName = "",
}) {
    const hasHeader =
        title ||
        description ||
        eyebrow ||
        actions;

    return (
        <Component
            className={`
                min-w-0
                ${className}
            `}
        >
            {hasHeader && (
                <div
                    className={`
                        flex flex-col gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                        ${divided
                            ? "border-b border-border pb-4"
                            : ""
                        }
                    `}
                >
                    <div className="min-w-0">
                        {eyebrow && (
                            <p
                                className="
                                    mb-1.5
                                    text-overline
                                    font-extrabold uppercase
                                    tracking-overline
                                    text-primary
                                "
                            >
                                {eyebrow}
                            </p>
                        )}

                        {title && (
                            <h2
                                className="
                                    text-section-title
                                    font-extrabold
                                    tracking-heading
                                    text-foreground
                                "
                            >
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p
                                className="
                                    mt-1.5 max-w-3xl
                                    text-body-sm
                                    text-muted-foreground
                                "
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div
                            className="
                                flex flex-wrap
                                items-center gap-2
                            "
                        >
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div
                className={`
                    ${hasHeader
                        ? divided
                            ? "pt-5"
                            : "pt-4"
                        : ""
                    }
                    ${contentClassName}
                `}
            >
                {children}
            </div>
        </Component>
    );
}

export default PageSection;
