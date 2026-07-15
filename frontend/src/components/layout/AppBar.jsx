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
                bg-surface/90
                px-3
                backdrop-blur-xl
                supports-[backdrop-filter]:bg-surface/80
                sm:px-5
            "
        >
            <div
                className="
                    flex min-w-0
                    items-center gap-3
                "
            >
                <button
                    type="button"
                    onClick={
                        onOpenMobileSidebar
                    }
                    aria-label="Abrir menu lateral"
                    aria-expanded={
                        mobileSidebarOpen
                    }
                    title="Abrir menu"
                    className="
                        flex size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-muted-foreground
                        outline-none
                        transition
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:ring-2
                        focus-visible:ring-ring/20
                        active:scale-95
                        lg:hidden
                    "
                >
                    <RiMenuLine
                        size={21}
                        aria-hidden="true"
                    />
                </button>

                <button
                    type="button"
                    onClick={
                        onToggleDesktopSidebar
                    }
                    aria-label={
                        sidebarCollapsed
                            ? "Expandir menu lateral"
                            : "Recolher menu lateral"
                    }
                    aria-expanded={
                        !sidebarCollapsed
                    }
                    title={
                        sidebarCollapsed
                            ? "Expandir menu"
                            : "Recolher menu"
                    }
                    className="
                        hidden size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-muted-foreground
                        outline-none
                        transition
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:ring-2
                        focus-visible:ring-ring/20
                        active:scale-95
                        lg:flex
                    "
                >
                    {sidebarCollapsed ? (
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

                <div
                    aria-hidden="true"
                    className="
                        hidden h-5 w-px
                        bg-border
                        lg:block
                    "
                />

                <div
                    className="
                        hidden min-w-0
                        lg:block
                    "
                >
                    <p
                        className="
                            truncate
                            text-sm
                            font-semibold
                            text-foreground
                        "
                    >
                        Meu Saldo
                    </p>

                    <p
                        className="
                            mt-0.5 truncate
                            text-[11px]
                            text-muted-foreground
                        "
                    >
                        Controle financeiro
                    </p>
                </div>
            </div>

            <div
                className="
                    flex min-w-0
                    items-center gap-1
                "
            >
                <ThemeToggle />

                <div
                    aria-hidden="true"
                    className="
                        mx-1 h-5 w-px
                        bg-border
                    "
                />

                <UserMenu />
            </div>
        </header>
    );
}

export default AppBar;