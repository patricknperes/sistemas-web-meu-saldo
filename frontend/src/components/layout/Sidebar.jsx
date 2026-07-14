import {
    LayoutGroup,
} from "motion/react";

import {
    RiArrowDownCircleLine,
    RiArrowUpCircleLine,
    RiCloseLine,
    RiDashboardLine,
    RiGroupLine,
    RiHistoryLine,
    RiLogoutBoxRLine,
    RiUser3Line,
    RiWallet3Line,
} from "react-icons/ri";

import {
    Link,
    useNavigate,
} from "react-router";

import { useAuth } from "../../hooks/useAuth.js";

import UserAvatar from "../ui/UserAvatar.jsx";
import SidebarItem from "./SidebarItem.jsx";

const menuItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: RiDashboardLine,
    },
    {
        label: "Receitas",
        path: "/receitas",
        icon: RiArrowUpCircleLine,
    },
    {
        label: "Despesas",
        path: "/despesas",
        icon: RiArrowDownCircleLine,
    },
    {
        label: "Histórico",
        path: "/historico",
        icon: RiHistoryLine,
    },
    {
        label: "Meu perfil",
        path: "/perfil",
        icon: RiUser3Line,
    },
    {
        label: "Usuários",
        path: "/usuarios",
        icon: RiGroupLine,
        adminOnly: true,
    },
];

function getUserInformation(user) {
    const fullName =
        user?.name?.trim() || "Usuário";

    const roleLabel =
        user?.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

    return {
        fullName,
        roleLabel,
    };
}

function Sidebar({
    mode = "desktop",
    collapsed = false,
    onClose,
}) {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const mobile = mode === "mobile";

    const labelsVisible =
        mobile || !collapsed;

    const {
        fullName,
        roleLabel,
    } = getUserInformation(user);

    const visibleMenuItems = menuItems.filter(
        (item) =>
            !item.adminOnly ||
            user?.role === "ADMIN"
    );

    function handleLogout() {
        logout();
        onClose?.();

        navigate("/login", {
            replace: true,
        });
    }

    function handleNavigation() {
        if (mobile) {
            onClose?.();
        }
    }

    return (
        <aside
            aria-label="Menu principal"
            className={`
                flex h-full shrink-0
                flex-col
                overflow-hidden
                border-r border-border
                bg-surface
                transition-[width]
                duration-300
                ease-smooth

                ${mobile
                    ? "w-full"
                    : `
                            hidden h-dvh
                            lg:flex

                            ${collapsed
                        ? "w-[72px]"
                        : "w-[272px]"
                    }
                        `
                }
            `}
        >
            <header
                className={`
                    flex h-16 shrink-0
                    items-center
                    border-b border-border
                    px-4

                    ${labelsVisible
                        ? "justify-between"
                        : "justify-center"
                    }
                `}
            >
                <Link
                    to="/dashboard"
                    onClick={handleNavigation}
                    aria-label="Ir para a Dashboard"
                    title={
                        collapsed
                            ? "Meu Saldo"
                            : undefined
                    }
                    className="
                        flex min-w-0
                        items-center gap-3
                        overflow-hidden
                    "
                >
                    <span
                        className="
                            flex size-10
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-primary
                            text-primary-foreground
                        "
                    >
                        <RiWallet3Line size={21} />
                    </span>

                    {labelsVisible && (
                        <span className="min-w-0">
                            <strong
                                className="
                                    block truncate
                                    text-sm font-semibold
                                    text-foreground
                                "
                            >
                                Meu Saldo
                            </strong>

                            <span
                                className="
                                    block truncate
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Controle financeiro
                            </span>
                        </span>
                    )}
                </Link>

                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar menu lateral"
                        className="
                            inline-flex size-9
                            shrink-0
                            items-center justify-center
                            rounded-lg
                            text-muted-foreground
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                        "
                    >
                        <RiCloseLine size={20} />
                    </button>
                )}
            </header>

            <LayoutGroup
                id={`sidebar-${mode}`}
            >
                <nav
                    className="
                        flex min-h-0 flex-1
                        flex-col gap-1
                        overflow-x-hidden
                        overflow-y-auto
                        p-3
                        scrollbar-subtle
                    "
                >
                    {visibleMenuItems.map(
                        (item) => (
                            <SidebarItem
                                key={item.path}
                                item={item}
                                collapsed={
                                    !mobile &&
                                    collapsed
                                }
                                onNavigate={
                                    handleNavigation
                                }
                                layoutId={`sidebar-active-${mode}`}
                            />
                        )
                    )}
                </nav>
            </LayoutGroup>

            <footer
                className="
                    shrink-0
                    border-t border-border
                    p-3
                "
            >
                {labelsVisible ? (
                    <div
                        className="
                            flex min-w-0
                            items-center gap-2
                        "
                    >
                        <Link
                            to="/perfil"
                            onClick={handleNavigation}
                            title={fullName}
                            aria-label={`Abrir perfil de ${fullName}`}
                            className="
                                flex min-w-0 flex-1
                                items-center gap-3
                                overflow-hidden
                                rounded-xl
                                p-1
                                transition-colors
                                hover:bg-surface-hover
                            "
                        >
                            <UserAvatar
                                name={fullName}
                                size="md"
                                showTitle={false}
                            />

                            <span className="min-w-0 flex-1">
                                <strong
                                    title={fullName}
                                    className="
                                        block truncate
                                        text-sm font-medium
                                        text-foreground
                                    "
                                >
                                    {fullName}
                                </strong>

                                <span
                                    className="
                                        block truncate
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    {roleLabel}
                                </span>
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label="Sair da conta"
                            title="Sair"
                            className="
                                inline-flex size-9
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                text-muted-foreground
                                transition-colors
                                hover:bg-danger-muted
                                hover:text-danger
                            "
                        >
                            <RiLogoutBoxRLine
                                size={19}
                            />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Sair da conta"
                        title="Sair"
                        className="
                            mx-auto
                            flex size-10
                            items-center justify-center
                            rounded-xl
                            text-muted-foreground
                            transition-colors
                            hover:bg-danger-muted
                            hover:text-danger
                        "
                    >
                        <RiLogoutBoxRLine
                            size={19}
                        />
                    </button>
                )}
            </footer>
        </aside>
    );
}

export default Sidebar;