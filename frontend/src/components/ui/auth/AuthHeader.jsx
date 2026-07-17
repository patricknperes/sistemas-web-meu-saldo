function AuthHeader({
    icon,
    eyebrow,
    title,
    description,
    align = "left",
    className = "",
}) {
    const centered = align === "center";

    return (
        <header
            className={`
                min-w-0
                ${centered ? "text-center" : "text-left"}
                ${className}
            `}
        >
            {icon ? (
                <span
                    className={`
                        flex size-10 items-center justify-center rounded-control
                        border border-primary/10 bg-primary-muted text-primary
                        ${centered ? "mx-auto" : ""}
                    `}
                >
                    {icon}
                </span>
            ) : null}

            {eyebrow ? (
                <p
                    className={`
                        text-overline font-label uppercase tracking-overline text-primary
                        ${icon ? "mt-4" : ""}
                    `}
                >
                    {eyebrow}
                </p>
            ) : null}

            <h1
                className={`
                    text-page-title font-heading tracking-heading text-foreground
                    ${icon || eyebrow ? "mt-2" : ""}
                `}
            >
                {title}
            </h1>

            {description ? (
                <p
                    className={`
                        mt-2 text-body-sm text-muted-foreground
                        ${centered ? "mx-auto max-w-md" : "max-w-xl"}
                    `}
                >
                    {description}
                </p>
            ) : null}
        </header>
    );
}

export default AuthHeader;
