import {
    motion,
} from "motion/react";

import {
    NavLink,
} from "react-router";

function SidebarItem({
    item,
    collapsed = false,
    onNavigate,
    layoutId,
}) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={onNavigate}
            title={
                collapsed
                    ? item.label
                    : undefined
            }
            aria-label={item.label}
            className={({ isActive }) => `
                relative
                grid h-11 min-w-0
                items-center
                overflow-hidden
                rounded-xl
                text-sm font-medium
                outline-none
                transition-colors
                duration-200

                ${collapsed
                    ? `
                            grid-cols-[20px]
                            justify-center
                            px-0
                        `
                    : `
                            grid-cols-[20px_minmax(0,1fr)]
                            gap-3
                            px-3
                        `
                }

                ${isActive
                    ? `
                            text-primary-foreground
                        `
                    : `
                            text-muted-foreground
                            hover:bg-surface-hover
                            hover:text-foreground
                        `
                }
            `}
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId={layoutId}
                            aria-hidden="true"
                            transition={{
                                type: "spring",
                                stiffness: 480,
                                damping: 38,
                                mass: 0.7,
                            }}
                            className={`
                                absolute z-0
                                bg-primary
                                shadow-sm

                                ${collapsed
                                    ? `
                                            left-1/2 top-1/2
                                            size-10
                                            -translate-x-1/2
                                            -translate-y-1/2
                                            rounded-xl
                                        `
                                    : `
                                            inset-0
                                            rounded-xl
                                        `
                                }
                            `}
                        />
                    )}

                    <motion.span
                        aria-hidden="true"
                        animate={{
                            scale: isActive
                                ? 1.05
                                : 1,
                        }}
                        transition={{
                            duration: 0.18,
                        }}
                        className="
                            relative z-10
                            flex size-5
                            items-center justify-center
                        "
                    >
                        <Icon size={20} />
                    </motion.span>

                    {!collapsed && (
                        <span
                            className="
                                relative z-10
                                min-w-0 truncate
                            "
                        >
                            {item.label}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
}

export default SidebarItem;