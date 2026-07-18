import { LayoutGroup, motion } from "motion/react";
import { LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router";

const tabs = [
    { label: "Entrar", path: "/login", icon: LogIn },
    { label: "Criar conta", path: "/cadastro", icon: UserPlus },
];

function AuthTabs() {
    const { pathname } = useLocation();

    return (
        <LayoutGroup id="auth-navigation">
            <nav aria-label="Navegação de autenticação" className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface-muted/60 p-1">
                {tabs.map(({ label, path, icon: Icon }) => {
                    const active = pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            aria-current={active ? "page" : undefined}
                            className={`relative flex min-h-10 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/20 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            {active && (
                                <motion.span
                                    layoutId="auth-active-tab"
                                    className="absolute inset-0 rounded-xl border border-border bg-surface shadow-xs"
                                    transition={{ type: "spring", stiffness: 430, damping: 36, mass: 0.75 }}
                                />
                            )}
                            <Icon size={16} strokeWidth={1.9} aria-hidden="true" className="relative z-10 shrink-0" />
                            <span className="relative z-10 truncate">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </LayoutGroup>
    );
}

export default AuthTabs;
