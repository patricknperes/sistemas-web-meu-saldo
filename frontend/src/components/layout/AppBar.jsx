import {
    Menu,
    X
} from "lucide-react";

import ThemeToggle from "../theme/ThemeToggle.jsx";
import AppBreadcrumb from "./AppBreadcrumb.jsx";
import UserMenu from "./UserMenu.jsx";

function AppBar({
    sidebarCollapsed,
    onToggleDesktopSidebar,
}) {
    return (
        <header
            aria-label="Barra superior"
            className="
                sticky top-0 z-20
                shrink-0
                border-b border-border
                bg-background/88
                backdrop-blur-xl
                supports-[backdrop-filter]:bg-background/72
            "
        >
            <div
                className="
                    mx-auto
                    flex h-[72px]
                    items-center justify-between
                    gap-4
                    px-4
                    sm:px-6
                    xl:px-8
                "
            >
                <div className="flex min-w-0 items-center">
                    <button
                        type="button"
                        onClick={onToggleDesktopSidebar}
                        aria-label={
                            sidebarCollapsed
                                ? "Expandir menu lateral"
                                : "Recolher menu lateral"
                        }
                        aria-expanded={!sidebarCollapsed}
                        className="
                            hidden size-10
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            text-muted-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/30
                            lg:inline-flex
                        "
                    >
                        {sidebarCollapsed ? (
                            <Menu
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={1.8}
                            />
                        ) : (
                            <X
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={1.8}
                            />
                        )}
                    </button>

                    <span
                        aria-hidden="true"
                        className="
                            mx-3
                            hidden h-6
                            w-px shrink-0
                            bg-border
                            lg:block
                        "
                    />

                    <div className="min-w-0">
                        <AppBreadcrumb />
                    </div>
                </div>

                <div
                    className="
                        flex min-w-0
                        shrink-0
                        items-center gap-1.5
                    "
                >
                    <ThemeToggle />

                    <span
                        aria-hidden="true"
                        className="
                            mx-1
                            h-5 w-px
                            shrink-0
                            bg-border
                        "
                    />

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}

export default AppBar;