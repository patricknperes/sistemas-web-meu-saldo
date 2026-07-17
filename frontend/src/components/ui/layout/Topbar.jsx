import {
    RiMenuFoldLine,
    RiMenuLine,
    RiMenuUnfoldLine,
} from "react-icons/ri";

import {
    useAppShell,
} from "./AppShellContext.js";

function Topbar({
    title,
    description,
    startContent,
    actions,
    account,
    showDesktopToggle = true,
    showMobileToggle = true,
    sticky = true,
    className = "",
}) {
    const {
        collapsed,
        mobileSidebarOpen,
        displayMode,
        toggleCollapsed,
        openMobileSidebar,
    } = useAppShell();

    const mobileToggleClassName =
        displayMode === "mobile"
            ? "inline-flex"
            : displayMode === "desktop"
                ? "hidden"
                : "inline-flex lg:hidden";

    const desktopToggleClassName =
        displayMode === "desktop"
            ? "inline-flex"
            : displayMode === "mobile"
                ? "hidden"
                : "hidden lg:inline-flex";

    return (
        <header
            className={`
                ${sticky
                    ? "sticky top-0"
                    : "relative"
                }
                z-30
                flex min-h-16 shrink-0
                items-center justify-between
                gap-4
                border-b border-border
                bg-surface/92
                px-3
                backdrop-blur-xl
                supports-[backdrop-filter]:bg-surface/82
                sm:px-5
                ${className}
            `}
        >
            <div
                className="
                    flex min-w-0
                    items-center gap-2.5
                "
            >
                {showMobileToggle && (
                    <button
                        type="button"
                        onClick={
                            openMobileSidebar
                        }
                        aria-label="Abrir menu lateral"
                        aria-expanded={
                            mobileSidebarOpen
                        }
                        className={`
                            ${mobileToggleClassName}
                            size-10 shrink-0
                            items-center justify-center
                            rounded-lg
                            text-muted-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/25
                        `}
                    >
                        <RiMenuLine
                            size={21}
                            aria-hidden="true"
                        />
                    </button>
                )}

                {showDesktopToggle && (
                    <button
                        type="button"
                        onClick={
                            toggleCollapsed
                        }
                        aria-label={
                            collapsed
                                ? "Expandir menu lateral"
                                : "Recolher menu lateral"
                        }
                        aria-expanded={
                            !collapsed
                        }
                        className={`
                            ${desktopToggleClassName}
                            size-10 shrink-0
                            items-center justify-center
                            rounded-lg
                            text-muted-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/25
                        `}
                    >
                        {collapsed ? (
                            <RiMenuUnfoldLine
                                size={20}
                                aria-hidden="true"
                            />
                        ) : (
                            <RiMenuFoldLine
                                size={20}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                )}

                {startContent}

                {(title || description) && (
                    <div className="min-w-0">
                        {title && (
                            <p
                                className="
                                    truncate
                                    text-body-sm
                                    font-bold
                                    text-foreground
                                "
                            >
                                {title}
                            </p>
                        )}

                        {description && (
                            <p
                                className="
                                    mt-0.5 hidden
                                    truncate
                                    text-[10px]
                                    font-medium
                                    text-muted-foreground
                                    sm:block
                                "
                            >
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div
                className="
                    flex min-w-0
                    items-center gap-1.5
                "
            >
                {actions}
                {account}
            </div>
        </header>
    );
}

export default Topbar;
