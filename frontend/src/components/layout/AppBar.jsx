import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router";
import { routeMetadata } from "../../config/navigation.js";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import UserMenu from "./UserMenu.jsx";

function AppBar({ sidebarCollapsed, onToggleDesktopSidebar }) {
    const { pathname } = useLocation();
    const meta = routeMetadata[pathname] || routeMetadata["/dashboard"];

    return (
        <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72">
            <div className="mx-auto flex h-[72px] w-full max-w-[1520px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button type="button" onClick={onToggleDesktopSidebar} aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"} aria-expanded={!sidebarCollapsed} className="hidden size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground outline-none transition hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 lg:flex">
                        {sidebarCollapsed ? <PanelLeftOpen size={20} aria-hidden="true" /> : <PanelLeftClose size={20} aria-hidden="true" />}
                    </button>
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{meta.eyebrow}</p>
                        <h1 className="truncate text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">{meta.title}</h1>
                    </div>
                </div>
                <div className="flex min-w-0 items-center gap-1.5">
                    <ThemeToggle />
                    <div aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}

export default AppBar;
