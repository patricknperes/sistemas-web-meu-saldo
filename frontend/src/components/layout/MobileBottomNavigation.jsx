import { MoreHorizontal } from "lucide-react";
import { NavLink } from "react-router";
import { primaryNavigation } from "../../config/navigation.js";

function MobileBottomNavigation({ onOpenMenu }) {
    return (
        <nav aria-label="Navegação mobile" className="fixed inset-x-3 bottom-3 z-30 grid h-16 grid-cols-5 rounded-[22px] border border-border bg-surface/92 px-1.5 shadow-popover backdrop-blur-xl lg:hidden supports-[backdrop-filter]:bg-surface/82">
            {primaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink key={item.path} to={item.path} end={item.path === "/dashboard"} className={({ isActive }) => [
                        "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-medium outline-none transition",
                        "focus-visible:ring-2 focus-visible:ring-ring/30",
                        isActive ? "text-primary" : "text-subtle-foreground",
                    ].join(" ")}>
                        {({ isActive }) => <><span className={isActive ? "absolute inset-x-2 inset-y-1.5 rounded-2xl bg-primary-soft" : ""} /><Icon className="relative" size={19} strokeWidth={1.9} aria-hidden="true" /><span className="relative max-w-full truncate">{item.shortLabel}</span></>}
                    </NavLink>
                );
            })}
            <button type="button" onClick={onOpenMenu} className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-medium text-subtle-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
                <MoreHorizontal size={19} strokeWidth={1.9} aria-hidden="true" />
                <span>Mais</span>
            </button>
        </nav>
    );
}

export default MobileBottomNavigation;
