import { LayoutGroup } from "motion/react";
import { LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router";

import logoAzulClaro from "../../assets/icons/logo-ms-azul-claro.svg";
import logoAzulEscuro from "../../assets/icons/logo-ms-azul-escuro.svg";
import {
    filterNavigation,
    primaryNavigation,
    secondaryNavigation,
} from "../../config/navigation.js";
import { useAuth } from "../../hooks/useAuth.js";
import UserAvatar from "../ui/UserAvatar.jsx";
import SidebarItem from "./SidebarItem.jsx";

function SidebarLogo({ labelsVisible }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div
                className="
                    relative
                    size-10
                    shrink-0
                    overflow-hidden
                    rounded-xl
                    shadow-xs
                "
            >
                <img
                    src={logoAzulEscuro}
                    alt=""
                    aria-hidden="true"
                    className="
                        block
                        size-full
                        object-contain
                        dark:hidden
                    "
                />

                <img
                    src={logoAzulClaro}
                    alt=""
                    aria-hidden="true"
                    className="
                        hidden
                        size-full
                        object-contain
                        dark:block
                    "
                />
            </div>

            {labelsVisible && (
                <div className="min-w-0">
                    <span
                        className="
                            block
                            truncate
                            text-[15px]
                            font-bold
                            tracking-[-0.025em]
                            text-foreground
                        "
                    >
                        Meu Saldo
                    </span>

                    <span
                        className="
                            block
                            truncate
                            text-[11px]
                            font-medium
                            text-subtle-foreground
                        "
                    >
                        Controle financeiro
                    </span>
                </div>
            )}
        </div>
    );
}

function Sidebar({
    mode = "desktop",
    collapsed = false,
    onClose,
}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const mobile = mode === "mobile";
    const labelsVisible = mobile || !collapsed;

    const fullName = user?.name?.trim() || "Usuário";
    const roleLabel = user?.role === "ADMIN"
        ? "Administrador"
        : "Usuário";

    const mainItems = filterNavigation(
        primaryNavigation,
        user?.role,
    );

    const accountItems = filterNavigation(
        secondaryNavigation,
        user?.role,
    );

    function handleLogout() {
        logout();
        navigate("/login", {
            replace: true,
        });
    }

    return (
        <aside
            className={[
                `
                    flex h-full
                    shrink-0
                    flex-col
                    border-r border-border
                    bg-surface/95
                    backdrop-blur-xl
                `,
                mobile
                    ? "w-full shadow-dialog"
                    : `
                        hidden
                        transition-[width]
                        duration-300
                        lg:flex
                    `,
                !mobile && collapsed
                    ? "w-[76px]"
                    : "w-[252px]",
            ].join(" ")}
        >
            <div
                className={
                    labelsVisible
                        ? `
                            flex h-20
                            items-center
                            justify-between
                            px-5
                        `
                        : `
                            flex h-20
                            items-center
                            justify-center
                            px-3
                        `
                }
            >
                <Link
                    to="/dashboard"
                    onClick={onClose}
                    aria-label="Ir para o Dashboard"
                    className="
                        min-w-0
                        rounded-xl
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring/30
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-surface
                    "
                >
                    <SidebarLogo
                        labelsVisible={labelsVisible}
                    />
                </Link>

                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar menu"
                        className="
                            flex size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-muted-foreground
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring/30
                        "
                    >
                        <X
                            aria-hidden="true"
                            size={20}
                            strokeWidth={1.8}
                        />
                    </button>
                )}
            </div>

            <nav
                aria-label="Navegação principal"
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-3
                    pb-4
                    scrollbar-subtle
                "
            >
                <LayoutGroup
                    id={
                        mobile
                            ? "mobile-navigation"
                            : "desktop-navigation"
                    }
                >
                    {labelsVisible && (
                        <p
                            className="
                                mb-2 mt-2
                                px-3
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-subtle-foreground
                            "
                        >
                            Finanças
                        </p>
                    )}

                    <div className="space-y-1">
                        {mainItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                item={item}
                                collapsed={!labelsVisible}
                                onNavigate={onClose}
                                layoutId={`${mode}-active-nav`}
                            />
                        ))}
                    </div>

                    <div className="my-5 h-px bg-border" />

                    {labelsVisible && (
                        <p
                            className="
                                mb-2
                                px-3
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-subtle-foreground
                            "
                        >
                            Conta
                        </p>
                    )}

                    <div className="space-y-1">
                        {accountItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                item={item}
                                collapsed={!labelsVisible}
                                onNavigate={onClose}
                                layoutId={`${mode}-active-nav`}
                            />
                        ))}
                    </div>
                </LayoutGroup>
            </nav>

            <div className="border-t border-border p-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        !labelsVisible
                            ? "Sair"
                            : undefined
                    }
                    className={[
                        `
                            flex h-10
                            w-full
                            items-center
                            rounded-xl
                            text-sm
                            font-medium
                            text-muted-foreground
                            transition-colors
                            hover:bg-danger-muted
                            hover:text-danger
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-danger/25
                        `,
                        labelsVisible
                            ? "gap-3 px-3"
                            : "justify-center",
                    ].join(" ")}
                >
                    <LogOut
                        aria-hidden="true"
                        size={18}
                        strokeWidth={1.8}
                    />

                    {labelsVisible && (
                        <span>Sair da conta</span>
                    )}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;