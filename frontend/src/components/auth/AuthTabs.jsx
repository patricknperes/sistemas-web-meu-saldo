import {
    LayoutGroup,
    motion,
} from "motion/react";

import {
    Link,
    useLocation,
} from "react-router";

const tabs = [
    {
        label: "Entrar",
        path: "/login",
    },
    {
        label: "Criar conta",
        path: "/cadastro",
    },
];

function AuthTabs() {
    const location = useLocation();

    return (
        <LayoutGroup id="auth-navigation">
            <nav
                aria-label="Navegação de autenticação"
                className="
                    grid grid-cols-2 gap-1
                    rounded-control
                    bg-surface-muted
                    p-1
                "
            >
                {tabs.map((tab) => {
                    const active =
                        location.pathname === tab.path;

                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            aria-current={
                                active ? "page" : undefined
                            }
                            className={`
                                relative
                                flex min-h-11 min-w-0
                                items-center justify-center
                                overflow-hidden
                                rounded-[0.6rem]
                                px-3
                                text-sm font-medium
                                transition-colors
                                ${active
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }
                            `}
                        >
                            {active && (
                                <motion.span
                                    layoutId="auth-active-tab"
                                    className="
                                        absolute inset-0
                                        rounded-[0.6rem]
                                        border border-border
                                        bg-surface
                                        shadow-sm
                                    "
                                    transition={{
                                        type: "spring",
                                        stiffness: 420,
                                        damping: 34,
                                    }}
                                />
                            )}

                            <span className="relative z-10 truncate">
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