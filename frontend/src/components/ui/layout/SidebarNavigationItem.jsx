import {
    NavLink,
} from "react-router";

import {
    useSidebarContext,
} from "./SidebarContext.js";

function renderIcon(icon) {
    if (!icon) {
        return null;
    }

    if (typeof icon === "function") {
        const Icon = icon;

        return (
            <Icon
                size={19}
                aria-hidden="true"
            />
        );
    }

    return icon;
}

function SidebarNavigationItem({
    label,
    icon,
    to,
    active = false,
    badge,
    disabled = false,
    onClick,
    end,
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
        if (disabled) {
            event.preventDefault();
            return;
        }

        onClick?.(event);

        if (!event.defaultPrevented) {
            closeMobileSidebar();
        }
    }

    function getClassName(isActive) {
        const selected =
            active || isActive;

        return `
            group relative
            flex min-h-10 w-full
            items-center gap-3
            rounded-lg
            px-3 py-2
            text-left
            text-body-sm
            font-semibold
            outline-none
            transition-colors

            ${labelsVisible
                ? "justify-start"
                : "justify-center px-0"
            }

            ${selected
                ? "bg-primary-muted text-primary"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }

            ${disabled
                ? "cursor-not-allowed opacity-45"
                : ""
            }

            focus-visible:ring-2
            focus-visible:ring-ring/25
        `;
    }

    const content = (
        <>
            <span
                aria-hidden="true"
                className="
                    flex size-5 shrink-0
                    items-center justify-center
                "
            >
                {renderIcon(icon)}
            </span>

            {labelsVisible && (
                <span
                    className="
                        min-w-0 flex-1
                        truncate
                    "
                >
                    {label}
                </span>
            )}

            {labelsVisible &&
                badge !== undefined &&
                badge !== null && (
                    <span
                        className="
                            inline-flex min-w-5
                            items-center justify-center
                            rounded-pill
                            bg-surface
                            px-1.5 py-0.5
                            text-[10px]
                            font-bold
                            text-muted-foreground
                            shadow-xs
                        "
                    >
                        {badge}
                    </span>
                )}
        </>
    );

    if (to) {
        return (
            <NavLink
                to={to}
                end={end}
                onClick={handleClick}
                aria-disabled={
                    disabled || undefined
                }
                title={
                    labelsVisible
                        ? undefined
                        : label
                }
                className={({
                    isActive,
                }) =>
                    getClassName(
                        isActive
                    )
                }
            >
                {content}
            </NavLink>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            aria-current={
                active
                    ? "page"
                    : undefined
            }
            title={
                labelsVisible
                    ? undefined
                    : label
            }
            className={getClassName(
                false
            )}
        >
            {content}
        </button>
    );
}

export default SidebarNavigationItem;
