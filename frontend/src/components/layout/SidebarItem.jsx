import { motion } from "motion/react";
import { NavLink } from "react-router";

function SidebarItem({ item, collapsed = false, onNavigate, layoutId }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            className={({ isActive }) => [
                "group relative flex h-11 min-w-0 items-center overflow-hidden rounded-xl text-sm font-medium outline-none transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring/30",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                isActive ? "text-primary" : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
            ].join(" ")}
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId={layoutId}
                            aria-hidden="true"
                            transition={{ type: "spring", stiffness: 430, damping: 38, mass: 0.75 }}
                            className={[
                                "absolute bg-primary-soft",
                                collapsed ? "inset-0.5 rounded-[11px]" : "inset-0 rounded-xl",
                            ].join(" ")}
                        />
                    )}
                    {isActive && !collapsed && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
                    <span className="relative z-10 flex size-5 shrink-0 items-center justify-center">
                        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    {!collapsed && <span className="relative z-10 min-w-0 truncate">{item.label}</span>}
                </>
            )}
        </NavLink>
    );
}

export default SidebarItem;
