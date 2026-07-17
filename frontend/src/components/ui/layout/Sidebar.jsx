import {
    RiCloseLine,
} from "react-icons/ri";

import {
    SidebarContext,
} from "./SidebarContext.js";

import {
    useAppShell,
} from "./AppShellContext.js";

function Sidebar({
    children,
    mode = "desktop",
    className = "",
    ariaLabel = "Navegação principal",
}) {
    const {
        collapsed,
        closeMobileSidebar,
    } = useAppShell();

    const mobile =
        mode === "mobile";

    const sidebarCollapsed =
        !mobile && collapsed;

    return (
        <SidebarContext.Provider
            value={{
                collapsed:
                    sidebarCollapsed,
                mode,
                closeMobileSidebar,
            }}
        >
            <aside
                aria-label={ariaLabel}
                className={`
                    relative
                    flex h-full shrink-0
                    flex-col overflow-hidden
                    border-r border-border
                    bg-surface
                    transition-[width]
                    duration-300
                    ease-smooth

                    ${mobile
                        ? "w-full"
                        : sidebarCollapsed
                            ? "w-[72px]"
                            : "w-[244px]"
                    }

                    ${className}
                `}
            >
                {mobile && (
                    <button
                        type="button"
                        onClick={
                            closeMobileSidebar
                        }
                        aria-label="Fechar menu lateral"
                        className="
                            absolute right-3 top-3
                            z-10
                            inline-flex size-9
                            items-center justify-center
                            rounded-lg
                            text-muted-foreground
                            outline-none
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/25
                        "
                    >
                        <RiCloseLine
                            size={20}
                            aria-hidden="true"
                        />
                    </button>
                )}

                {children}
            </aside>
        </SidebarContext.Provider>
    );
}

export default Sidebar;
