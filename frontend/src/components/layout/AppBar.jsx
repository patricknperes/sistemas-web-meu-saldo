import {
    RiMenuFoldLine,
    RiMenuLine,
    RiMenuUnfoldLine,
} from "react-icons/ri";

import ThemeToggle from "../theme/ThemeToggle.jsx";
import UserMenu from "./UserMenu.jsx";

function AppBar({
    sidebarCollapsed,
    mobileSidebarOpen,
    onOpenMobileSidebar,
    onToggleDesktopSidebar,
}) {
    return (
        <header
            className="
                sticky top-0 z-20
                flex h-16 shrink-0
                items-center justify-between
                border-b border-border
                bg-surface/95
                px-3
                backdrop-blur-sm
                sm:px-4
            "
        >
            <div className="flex min-w-0 items-center">
                <button
                    type="button"
                    onClick={onOpenMobileSidebar}
                    aria-label="Abrir menu lateral"
                    aria-expanded={mobileSidebarOpen}
                    className="
                        inline-flex size-9
                        shrink-0
                        items-center justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        lg:hidden
                    "
                >
                    <RiMenuLine size={20} />
                </button>

                <button
                    type="button"
                    onClick={onToggleDesktopSidebar}
                    aria-label={
                        sidebarCollapsed
                            ? "Expandir menu lateral"
                            : "Recolher menu lateral"
                    }
                    aria-expanded={!sidebarCollapsed}
                    title={
                        sidebarCollapsed
                            ? "Expandir menu"
                            : "Recolher menu"
                    }
                    className="
                        hidden size-9
                        shrink-0
                        items-center justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        lg:inline-flex
                    "
                >
                    {sidebarCollapsed ? (
                        <RiMenuUnfoldLine size={19} />
                    ) : (
                        <RiMenuFoldLine size={19} />
                    )}
                </button>
            </div>

            <div
                className="
                    flex min-w-0
                    items-center gap-1
                "
            >
                <ThemeToggle />

                <UserMenu />
            </div>
        </header>
    );
}

export default AppBar;