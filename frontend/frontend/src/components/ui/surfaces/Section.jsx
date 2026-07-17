import {
    mergeClasses,
    sectionGapClasses,
} from "./surfaceStyles.js";

function Section({
    as: Component = "section",
    icon: Icon,
    eyebrow,
    title,
    description,
    action,
    children,
    gap = "md",
    titleAs: TitleComponent = "h2",
    headerClassName = "",
    contentClassName = "",
    className = "",
    ...props
}) {
    const hasHeader = Icon || eyebrow || title || description || action;

    return (
        <Component
            className={mergeClasses(
                "grid min-w-0",
                sectionGapClasses[gap] || sectionGapClasses.md,
                className
            )}
            {...props}
        >
            {hasHeader ? (
                <header
                    className={mergeClasses(
                        "flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                        headerClassName
                    )}
                >
                    <div className="flex min-w-0 items-start gap-3.5">
                        {Icon ? (
                            <span
                                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary shadow-xs"
                                aria-hidden="true"
                            >
                                <Icon size={19} />
                            </span>
                        ) : null}

                        <div className="min-w-0">
                            {eyebrow ? (
                                <p className="mb-1 text-overline font-bold uppercase tracking-overline text-primary">
                                    {eyebrow}
                                </p>
                            ) : null}

                            {title ? (
                                <TitleComponent className="text-section-title font-bold text-foreground">
                                    {title}
                                </TitleComponent>
                            ) : null}

                            {description ? (
                                <p className="mt-1.5 max-w-3xl text-body-sm text-muted-foreground">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {action ? (
                        <div className="shrink-0">
                            {action}
                        </div>
                    ) : null}
                </header>
            ) : null}

            <div className={mergeClasses("min-w-0", contentClassName)}>
                {children}
            </div>
        </Component>
    );
}

export default Section;
