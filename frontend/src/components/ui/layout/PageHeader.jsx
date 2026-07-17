import PageActions from "./PageActions.jsx";
import PageDescription from "./PageDescription.jsx";
import PageTitle from "./PageTitle.jsx";

function PageHeader({
    eyebrow,
    title,
    description,
    breadcrumbs,
    meta,
    actions,
    children,
    compact = false,
    className = "",
}) {
    return (
        <header
            className={`
                flex flex-col
                gap-5
                sm:flex-row
                sm:items-start
                sm:justify-between
                ${compact
                    ? ""
                    : "pb-1"
                }
                ${className}
            `}
        >
            <div className="min-w-0 flex-1">
                {breadcrumbs && (
                    <div className="mb-3">
                        {breadcrumbs}
                    </div>
                )}

                {eyebrow && (
                    <p
                        className="
                            mb-2
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
                    <PageTitle>
                        {title}
                    </PageTitle>
                )}

                {description && (
                    <PageDescription
                        className={
                            title
                                ? "mt-2"
                                : ""
                        }
                    >
                        {description}
                    </PageDescription>
                )}

                {meta && (
                    <div
                        className="
                            mt-3 flex
                            flex-wrap
                            items-center gap-2
                        "
                    >
                        {meta}
                    </div>
                )}

                {children}
            </div>

            {actions && (
                <PageActions>
                    {actions}
                </PageActions>
            )}
        </header>
    );
}

export default PageHeader;
