import {
    FiBell,
    FiMenu,
    FiUser,
} from "react-icons/fi";

import {
    Link,
    useLocation,
} from "react-router";

import { useAuth } from "../../hooks/useAuth.js";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/receitas": "Receitas",
    "/despesas": "Despesas",
    "/historico": "Histórico",
    "/perfil": "Meu perfil",
    "/usuarios": "Usuários",
};

function AppBar({ onMenuClick }) {
    const location = useLocation();
    const { user } = useAuth();

    const pageTitle =
        pageTitles[location.pathname] ??
        "Minhas Finanças";

    const roleLabel =
        user?.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Abrir menu"
                    className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
                >
                    <FiMenu size={22} />
                </button>

                <h2 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
                    {pageTitle}
                </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    aria-label="Notificações"
                    className="hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 sm:block"
                >
                    <FiBell size={20} />
                </button>

                <Link
                    to="/perfil"
                    className="flex items-center gap-3 rounded-md p-1 hover:bg-slate-100"
                >
                    <div className="hidden text-right md:block">
                        <p className="max-w-40 truncate text-sm font-medium text-slate-800">
                            {user?.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            {roleLabel}
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 sm:h-10 sm:w-10">
                        <FiUser size={20} />
                    </div>
                </Link>
            </div>
        </header>
    );
}

export default AppBar;