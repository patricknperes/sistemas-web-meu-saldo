import {
    RiArrowDownSLine,
    RiLogoutBoxRLine,
    RiSettings3Line,
} from "react-icons/ri";

import {
    useNavigate,
} from "react-router";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    AccountAvatar,
    UserRoleBadge,
} from "../ui/account/index.js";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../ui/feedback/DropdownMenu.jsx";

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

function UserMenu() {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const fullName =
        user?.name?.trim() ||
        "Usuário";

    const shortName =
        getShortName(fullName);

    function handleProfile() {
        navigate("/perfil");
    }

    function handleLogout() {
        logout();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <DropdownMenu
            placement="bottom-end"
            className="w-[min(19rem,calc(100vw-1rem))] p-1.5"
            trigger={
                <button
                    type="button"
                    aria-label="Abrir menu da conta"
                    title={fullName}
                    className="
                        group flex h-10 min-w-0
                        items-center gap-2 rounded-lg
                        px-1.5 outline-none
                        transition-colors
                        hover:bg-surface-hover
                        focus-visible:ring-2
                        focus-visible:ring-ring/25
                    "
                >
                    <AccountAvatar
                        name={fullName}
                        size="sm"
                        status={
                            user?.status ??
                            "ACTIVE"
                        }
                        showStatus
                    />

                    <span
                        className="
                            hidden min-w-0
                            max-w-28 truncate
                            text-body-sm font-bold
                            text-foreground
                            md:block
                        "
                    >
                        {shortName}
                    </span>

                    <RiArrowDownSLine
                        size={16}
                        aria-hidden="true"
                        className="
                            hidden shrink-0
                            text-muted-foreground
                            transition-transform
                            group-aria-expanded:rotate-180
                            md:block
                        "
                    />
                </button>
            }
        >
            <div
                className="
                    flex min-w-0 items-center
                    gap-3 rounded-lg
                    bg-surface-muted p-3
                "
            >
                <AccountAvatar
                    name={fullName}
                    size="md"
                    status={
                        user?.status ??
                        "ACTIVE"
                    }
                    showStatus
                />

                <div className="min-w-0 flex-1">
                    <strong
                        title={fullName}
                        className="
                            block truncate
                            text-body-sm font-extrabold
                            text-foreground
                        "
                    >
                        {fullName}
                    </strong>

                    {user?.email && (
                        <span
                            title={user.email}
                            className="
                                mt-0.5 block truncate
                                text-caption
                                text-muted-foreground
                            "
                        >
                            {user.email}
                        </span>
                    )}

                    <UserRoleBadge
                        role={user?.role}
                        size="sm"
                        className="mt-2"
                    />
                </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                icon={RiSettings3Line}
                onSelect={handleProfile}
            >
                Configurações do perfil
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                icon={RiLogoutBoxRLine}
                danger
                onSelect={handleLogout}
            >
                Sair da conta
            </DropdownMenuItem>
        </DropdownMenu>
    );
}

export default UserMenu;
