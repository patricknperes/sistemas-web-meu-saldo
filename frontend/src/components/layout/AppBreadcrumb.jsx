import {
    ChevronRight,
    House,
} from "lucide-react";

import {
    Link,
    useLocation,
} from "react-router";

import { getPageMeta } from "../../config/pageMeta.js";


function AppBreadcrumb() {
    const { pathname } = useLocation();
    const meta = getPageMeta(pathname);

    return (
        <nav
            aria-label="Navegação estrutural"
            className="
                flex min-w-0
                items-center gap-1
                text-sm
            "
        >
            <Link
                to="/dashboard"
                aria-label="Ir para o Dashboard"
                className="
                    hidden size-8
                    shrink-0
                    items-center justify-center
                    rounded-lg
                    text-subtle-foreground
                    transition-colors
                    hover:bg-surface-hover
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    sm:flex
                "
            >
                <House
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                />
            </Link>

            <ChevronRight
                aria-hidden="true"
                className="
                    hidden size-3.5
                    shrink-0
                    text-border-strong
                    sm:block
                "
            />

            {meta.sectionPath && (
                <>
                    <Link
                        to={meta.sectionPath}
                        className="
                            hidden shrink-0
                            rounded-lg
                            px-2 py-1
                            text-subtle-foreground
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            md:inline-flex
                        "
                    >
                        {meta.section}
                    </Link>

                    <ChevronRight
                        aria-hidden="true"
                        className="
                            hidden size-3.5
                            shrink-0
                            text-border-strong
                            md:block
                        "
                    />
                </>
            )}

            <span
                aria-current="page"
                className="
                    min-w-0 truncate
                    px-1
                    text-[15px] font-semibold
                    tracking-[-0.02em]
                    text-foreground
                    sm:text-base
                "
            >
                {meta.title}
            </span>
        </nav>
    );
}

export default AppBreadcrumb;