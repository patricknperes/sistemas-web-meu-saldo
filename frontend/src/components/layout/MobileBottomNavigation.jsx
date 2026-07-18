import { MoreHorizontal } from "lucide-react";
import {
    NavLink,
    useLocation,
} from "react-router";

import { primaryNavigation } from "../../config/navigation.js";

const mobileNavigation = primaryNavigation.filter(
    (item) => item.path !== "/historico",
);

function isCurrentPath(pathname, path) {
    return (
        pathname === path
        || pathname.startsWith(`${path}/`)
    );
}

function MobileBottomNavigation({
    onOpenMenu,
}) {
    const { pathname } = useLocation();

    const isMoreActive = !mobileNavigation.some((item) =>
        isCurrentPath(pathname, item.path),
    );

    return (
        <nav
            aria-label="Navegação mobile"
            className="
                fixed inset-x-3 bottom-3 z-30
                grid h-16 grid-cols-4
                rounded-[18px]
                border border-border
                bg-surface/92
                px-1.5
                shadow-popover
                backdrop-blur-xl
                supports-[backdrop-filter]:bg-surface/82
                lg:hidden
            "
        >
            {mobileNavigation.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        className={({ isActive }) => [
                            `
                                relative
                                flex min-w-0
                                flex-col
                                items-center justify-center
                                gap-1
                                rounded-lg
                                px-1
                                text-[10px]
                                font-medium
                                outline-none
                                transition-colors
                                focus-visible:ring-2
                                focus-visible:ring-ring/30
                            `,
                            isActive
                                ? "text-primary"
                                : "text-subtle-foreground",
                        ].join(" ")}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span
                                        aria-hidden="true"
                                        className="
                                            absolute
                                            inset-x-2
                                            inset-y-1.5
                                            rounded-lg
                                            bg-primary-soft
                                        "
                                    />
                                )}

                                <Icon
                                    aria-hidden="true"
                                    className="relative"
                                    size={19}
                                    strokeWidth={1.9}
                                />

                                <span
                                    className="
                                        relative
                                        max-w-full
                                        truncate
                                    "
                                >
                                    {item.shortLabel}
                                </span>
                            </>
                        )}
                    </NavLink>
                );
            })}

            <button
                type="button"
                onClick={onOpenMenu}
                aria-label="Abrir menu lateral"
                aria-pressed={isMoreActive}
                className={[
                    `
                        relative
                        flex min-w-0
                        flex-col
                        items-center justify-center
                        gap-1
                        rounded-lg
                        px-1
                        text-[10px]
                        font-medium
                        outline-none
                        transition-colors
                        focus-visible:ring-2
                        focus-visible:ring-ring/30
                    `,
                    isMoreActive
                        ? "text-primary"
                        : "text-subtle-foreground",
                ].join(" ")}
            >
                {isMoreActive && (
                    <span
                        aria-hidden="true"
                        className="
                            absolute
                            inset-x-2
                            inset-y-1.5
                            rounded-lg
                            bg-primary-soft
                        "
                    />
                )}

                <MoreHorizontal
                    aria-hidden="true"
                    className="relative"
                    size={19}
                    strokeWidth={1.9}
                />

                <span className="relative">
                    Mais
                </span>
            </button>
        </nav>
    );
}

export default MobileBottomNavigation;