import {
    RiWallet3Line,
} from "react-icons/ri";

import {
    useNavigate,
} from "react-router";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    AccountAvatar,
} from "../ui/account/index.js";

import {
    Sidebar as SidebarPrimitive,
    SidebarAccount,
    SidebarBrand,
    SidebarNavigation,
} from "../ui/layout/index.js";

import {
    getVisibleNavigationSections,
} from "./navigationConfig.js";

function getShortName(name) {
    return String(
        name || "Usuário"
    )
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(" ");
}

function Sidebar({
    mode = "desktop",
}) {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const fullName =
        user?.name?.trim() ||
        "Usuário";

    const roleLabel =
        user?.role === "ADMIN"
            ? "Administrador"
            : "Conta pessoal";

    const sections =
        getVisibleNavigationSections(
            user?.role
        );

    function handleLogout() {
        logout();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <SidebarPrimitive
            mode={mode}
            className="shadow-[1px_0_0_var(--color-border-subtle)]"
        >
            <SidebarBrand
                icon={
                    <RiWallet3Line
                        size={19}
                        aria-hidden="true"
                    />
                }
                title="Meu Saldo"
                subtitle="Clareza financeira"
            />

            <SidebarNavigation
                sections={sections}
            />

            <SidebarAccount
                name={getShortName(
                    fullName
                )}
                role={roleLabel}
                avatar={
                    <AccountAvatar
                        name={fullName}
                        size="sm"
                        status={
                            user?.status ??
                            "ACTIVE"
                        }
                        showStatus
                    />
                }
                onLogout={handleLogout}
            />
        </SidebarPrimitive>
    );
}

export default Sidebar;
