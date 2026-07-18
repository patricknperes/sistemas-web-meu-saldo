import { cn } from "../../lib/cn.js";

function PageHeader({ eyebrow, title, description, actions, className }) {
    return (
        <header
            className={cn(
                "flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
                className,
            )}
        >
            <div className="min-w-0">
                {eyebrow && (
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                        {eyebrow}
                    </p>
                )}

                <h1 className="truncate-text text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-[2rem]">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </header>
    );
}

export default PageHeader;
