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

import {
    useAuth,
} from "../../hooks/useAuth.js";

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

function getShortName(name) {
    return (
        name?.trim() ||
        "Usuário"
    )
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(" ");
}

function Sidebar({
    mode = "desktop",
    collapsed = false,
    onClose,
}) {
    const navigate =
        useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const mobile =
        mode === "mobile";

    const labelsVisible =
        mobile || !collapsed;

    const fullName =
        user?.name?.trim() ||
        "Usuário";

    const shortName =
        getShortName(fullName);

    const roleLabel =
        user?.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

    const visibleMenuItems =
        menuItems.filter(
            (item) =>
                !item.adminOnly ||
                user?.role ===
                "ADMIN"
        );

    function handleLogout() {
        logout();
        onClose?.();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
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
                relative z-30
                flex h-full shrink-0
                flex-col overflow-hidden
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
                        ? "w-[76px]"
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
                        rounded-xl
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-500/20
                    "
                >
                    <span
                        className="
                            flex size-10 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-blue-600
                            to-indigo-600
                            text-white
                            shadow-md
                            shadow-blue-500/20
                        "
                    >
                        <RiWallet3Line
                            size={20}
                            aria-hidden="true"
                        />
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
                                    mt-0.5 block
                                    truncate text-[11px]
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
                            inline-flex size-10
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-border
                            bg-background/70
                            text-muted-foreground
                            outline-none
                            transition
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/20
                        "
                    >
                        <RiCloseLine
                            size={20}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </header>

            <LayoutGroup
                id={`sidebar-${mode}`}
            >
                <nav
                    className="
                        flex min-h-0 flex-1
                        flex-col
                        overflow-x-hidden
                        overflow-y-auto
                        p-3
                        scrollbar-subtle
                    "
                >
                    {labelsVisible && (
                        <p
                            className="
                                mb-2 px-3
                                text-[10px]
                                font-bold uppercase
                                tracking-[0.12em]
                                text-muted-foreground
                            "
                        >
                            Navegação
                        </p>
                    )}

                    <div className="space-y-1">
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
                    </div>
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
                            rounded-2xl
                            border border-border
                            bg-background/60
                            p-2
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
                                rounded-xl p-1
                                outline-none
                                transition
                                hover:bg-surface-hover
                                focus-visible:ring-2
                                focus-visible:ring-ring/20
                            "
                        >
                            <UserAvatar
                                name={fullName}
                                size="md"
                                showTitle={false}
                            />

                            <span className="min-w-0 flex-1">
                                <strong
                                    className="
                                        block truncate
                                        text-sm font-medium
                                        text-foreground
                                    "
                                >
                                    {shortName}
                                </strong>

                                <span
                                    className="
                                        mt-0.5 block
                                        truncate text-[11px]
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
                                rounded-xl
                                text-muted-foreground
                                outline-none
                                transition
                                hover:bg-danger-muted
                                hover:text-danger
                                focus-visible:ring-2
                                focus-visible:ring-danger/20
                            "
                        >
                            <RiLogoutBoxRLine
                                size={18}
                                aria-hidden="true"
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
                            outline-none
                            transition
                            hover:bg-danger-muted
                            hover:text-danger
                            focus-visible:ring-2
                            focus-visible:ring-danger/20
                        "
                    >
                        <RiLogoutBoxRLine
                            size={19}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </footer>
        </aside>
    );
}

export default Sidebar;