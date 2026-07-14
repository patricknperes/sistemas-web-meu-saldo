import {
    FiBarChart2,
    FiDollarSign,
    FiLogOut,
    FiTrendingDown,
    FiTrendingUp,
    FiUser,
    FiUsers,
    FiClock,
    FiX,
} from "react-icons/fi";

import {
    NavLink,
    useNavigate,
} from "react-router";

import { useAuth } from "../../hooks/useAuth.js";

const menuItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: FiBarChart2,
    },
    {
        label: "Receitas",
        path: "/receitas",
        icon: FiTrendingUp,
    },
    {
        label: "Despesas",
        path: "/despesas",
        icon: FiTrendingDown,
    },
    {
        label: "Histórico",
        path: "/historico",
        icon: FiClock,
    }, ,
    {
        label: "Meu perfil",
        path: "/perfil",
        icon: FiUser,
    },
    {
        label: "Usuários",
        path: "/usuarios",
        icon: FiUsers,
        adminOnly: true,
    },
];

function Sidebar({
    isOpen,
    onClose,
}) {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const visibleMenuItems = menuItems.filter(
        (item) =>
            !item.adminOnly ||
            user?.role === "ADMIN"
    );

    function handleLogout() {
        logout();
        onClose();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <aside
            className={[
                "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-white",
                "transform transition-transform duration-200",
                "lg:static lg:min-h-screen lg:translate-x-0",
                isOpen
                    ? "translate-x-0"
                    : "-translate-x-full",
            ].join(" ")}
        >
            <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-slate-900">
                        <FiDollarSign size={20} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate font-bold">
                            Minhas Finanças
                        </h1>

                        <p className="truncate text-xs text-slate-400">
                            Gerenciamento financeiro
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar menu"
                    className="rounded-md p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
                >
                    <FiX size={21} />
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {visibleMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                                    isActive
                                        ? "bg-slate-700 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                ].join(" ")
                            }
                        >
                            <Icon
                                size={19}
                                className="shrink-0"
                            />

                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-700 p-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    <FiLogOut size={19} />

                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;