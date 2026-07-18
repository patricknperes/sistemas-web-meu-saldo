import { LayoutGroup } from "motion/react";
import { LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { filterNavigation, primaryNavigation, secondaryNavigation } from "../../config/navigation.js";
import { useAuth } from "../../hooks/useAuth.js";
import BrandMark from "../ui/BrandMark.jsx";
import UserAvatar from "../ui/UserAvatar.jsx";
import SidebarItem from "./SidebarItem.jsx";

function Sidebar({ mode = "desktop", collapsed = false, onClose }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const mobile = mode === "mobile";
    const labelsVisible = mobile || !collapsed;
    const fullName = user?.name?.trim() || "Usuário";
    const roleLabel = user?.role === "ADMIN" ? "Administrador" : "Usuário";
    const mainItems = filterNavigation(primaryNavigation, user?.role);
    const accountItems = filterNavigation(secondaryNavigation, user?.role);

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <aside
            className={[
                "flex h-full shrink-0 flex-col border-r border-border bg-surface/95 backdrop-blur-xl",
                mobile ? "w-full shadow-dialog" : "hidden transition-[width] duration-300 lg:flex",
                !mobile && collapsed ? "w-[76px]" : "w-[252px]",
            ].join(" ")}
        >
            <div className={labelsVisible ? "flex h-20 items-center justify-between px-5" : "flex h-20 items-center justify-center px-3"}>
                <Link to="/dashboard" onClick={onClose} aria-label="Ir para o dashboard" className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 rounded-xl">
                    <BrandMark compact={!labelsVisible} />
                </Link>
                {mobile && (
                    <button type="button" onClick={onClose} aria-label="Fechar menu" className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-surface-hover hover:text-foreground">
                        <X size={20} aria-hidden="true" />
                    </button>
                )}
            </div>

            <nav aria-label="Navegação principal" className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 scrollbar-subtle">
                <LayoutGroup id={mobile ? "mobile-navigation" : "desktop-navigation"}>
                    {labelsVisible && <p className="mb-2 mt-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">Finanças</p>}
                    <div className="space-y-1">
                        {mainItems.map((item) => <SidebarItem key={item.path} item={item} collapsed={!labelsVisible} onNavigate={onClose} layoutId={`${mode}-active-nav`} />)}
                    </div>

                    <div className="my-5 h-px bg-border" />
                    {labelsVisible && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">Conta</p>}
                    <div className="space-y-1">
                        {accountItems.map((item) => <SidebarItem key={item.path} item={item} collapsed={!labelsVisible} onNavigate={onClose} layoutId={`${mode}-active-nav`} />)}
                    </div>
                </LayoutGroup>
            </nav>

            <div className="border-t border-border p-3">
                <div className={labelsVisible ? "mb-2 flex items-center gap-3 rounded-xl bg-surface-muted/70 p-2.5" : "mb-2 flex justify-center py-1"}>
                    <UserAvatar name={fullName} src={user?.avatarUrl} size="md" showTitle={false} />
                    {labelsVisible && <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-foreground">{fullName}</p><p className="truncate text-xs text-muted-foreground">{roleLabel}</p></div>}
                </div>
                <button type="button" onClick={handleLogout} title={!labelsVisible ? "Sair" : undefined} className={[
                    "flex h-10 w-full items-center rounded-xl text-sm font-medium text-muted-foreground transition hover:bg-danger-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/25",
                    labelsVisible ? "gap-3 px-3" : "justify-center",
                ].join(" ")}>
                    <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
                    {labelsVisible && <span>Sair da conta</span>}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
