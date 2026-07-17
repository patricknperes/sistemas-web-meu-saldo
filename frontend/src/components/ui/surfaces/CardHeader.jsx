import {
    mergeClasses,
    paddingClasses,
} from "./surfaceStyles.js";

function CardHeader({
    icon: Icon,
    eyebrow,
    title,
    description,
    action,
    children,
    divider = false,
    padding = "lg",
    titleAs: TitleComponent = "h3",
    className = "",
    ...props
}) {
    const hasStructuredContent =
        Icon || eyebrow || title || description || action;

    return (
        <header
            className={mergeClasses(
                paddingClasses[padding] || paddingClasses.lg,
                divider ? "border-b border-border" : "",
                className
            )}
            {...props}
        >
            {hasStructuredContent ? (
                <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3.5">
                        {Icon ? (
                            <span
                                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary-muted text-primary"
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
                                <TitleComponent className="text-card-title font-semibold text-foreground">
                                    {title}
                                </TitleComponent>
                            ) : null}

                            {description ? (
                                <p className="mt-1.5 max-w-2xl text-body-sm text-muted-foreground">
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
                </div>
            ) : null}

            {children ? (
                <div className={hasStructuredContent ? "mt-4" : ""}>
                    {children}
                </div>
            ) : null}
        </header>
    );
}

export default CardHeader;
