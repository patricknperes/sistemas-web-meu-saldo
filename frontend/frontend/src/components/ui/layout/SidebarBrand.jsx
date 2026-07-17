import {
    Link,
} from "react-router";

import {
    useSidebarContext,
} from "./SidebarContext.js";

function SidebarBrand({
    icon,
    title = "Meu Saldo",
    subtitle = "Controle financeiro",
    to = "/dashboard",
    onClick,
    className = "",
}) {
    const {
        collapsed,
        mode,
        closeMobileSidebar,
    } = useSidebarContext();

    const labelsVisible =
        mode === "mobile" ||
        !collapsed;

    function handleClick(event) {
        onClick?.(event);

        if (!event.defaultPrevented) {
            closeMobileSidebar();
        }
    }

    const content = (
        <>
            <span
                className="
                    flex size-9 shrink-0
                    items-center justify-center
                    rounded-[10px]
                    bg-primary
                    text-primary-foreground
                    shadow-sm
                "
            >
                {icon}
            </span>

            {labelsVisible && (
                <span className="min-w-0">
                    <strong
                        className="
                            block truncate
                            text-sm font-bold
                            tracking-label
                            text-foreground
                        "
                    >
                        {title}
                    </strong>

                    {subtitle && (
                        <span
                            className="
                                mt-0.5 block
                                truncate
                                text-[10px]
                                font-medium
                                text-muted-foreground
                            "
                        >
                            {subtitle}
                        </span>
                    )}
                </span>
            )}
        </>
    );

    const sharedClassName = `
        flex min-w-0
        items-center gap-3
        overflow-hidden
        rounded-lg
        outline-none
        focus-visible:ring-2
        focus-visible:ring-ring/25

        ${collapsed
            ? "justify-center"
            : "justify-start"
        }

        ${className}
    `;

    return (
        <div
            className={`
                flex h-16 shrink-0
                items-center
                border-b border-border-subtle
                px-4

                ${collapsed
                    ? "justify-center"
                    : "justify-start"
                }
            `}
        >
            {to ? (
                <Link
                    to={to}
                    onClick={handleClick}
                    aria-label={
                        labelsVisible
                            ? undefined
                            : title
                    }
                    title={
                        labelsVisible
                            ? undefined
                            : title
                    }
                    className={
                        sharedClassName
                    }
                >
                    {content}
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    aria-label={
                        labelsVisible
                            ? undefined
                            : title
                    }
                    title={
                        labelsVisible
                            ? undefined
                            : title
                    }
                    className={
                        sharedClassName
                    }
                >
                    {content}
                </button>
            )}
        </div>
    );
}

export default SidebarBrand;
