import {
    LayoutGroup,
    motion,
} from "motion/react";

import {
    RiLoginBoxLine,
    RiUserAddLine,
} from "react-icons/ri";

import {
    Link,
    useLocation,
} from "react-router";

const tabs = [
    {
        label: "Entrar",
        path: "/login",
        icon: RiLoginBoxLine,
    },
    {
        label: "Criar conta",
        path: "/cadastro",
        icon: RiUserAddLine,
    },
];

function AuthTabs() {
    const location =
        useLocation();

    return (
        <LayoutGroup id="auth-navigation">
            <nav
                aria-label="Navegação de autenticação"
                className="
                    grid grid-cols-2
                    gap-1
                    rounded-2xl
                    border border-border
                    bg-surface-muted/55
                    p-1
                "
            >
                {tabs.map((tab) => {
                    const active =
                        location.pathname ===
                        tab.path;

                    const Icon =
                        tab.icon;

                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            aria-current={
                                active
                                    ? "page"
                                    : undefined
                            }
                            className={`
                                relative
                                flex min-h-11
                                min-w-0
                                items-center
                                justify-center
                                gap-2
                                overflow-hidden
                                rounded-xl
                                px-3
                                text-sm
                                font-semibold
                                outline-none
                                transition-colors
                                focus-visible:ring-2
                                focus-visible:ring-ring/20

                                ${active
                                    ? "text-foreground"
                                    : `
                                            text-muted-foreground
                                            hover:text-foreground
                                        `
                                }
                            `}
                        >
                            {active && (
                                <motion.span
                                    layoutId="auth-active-tab"
                                    className="
                                        absolute inset-0
                                        rounded-xl
                                        border border-border
                                        bg-surface
                                        shadow-sm
                                    "
                                    transition={{
                                        type: "spring",
                                        stiffness: 430,
                                        damping: 36,
                                        mass: 0.75,
                                    }}
                                />
                            )}

                            <Icon
                                size={16}
                                aria-hidden="true"
                                className="
                                    relative z-10
                                    shrink-0
                                "
                            />

                            <span
                                className="
                                    relative z-10
                                    truncate
                                "
                            >
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </LayoutGroup>
    );
}

export default AuthTabs;