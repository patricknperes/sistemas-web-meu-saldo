import {
    ChevronDown,
    LogOut,
    UserRound,
    UsersRound,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import {
    Link,
    useNavigate,
} from "react-router";

import { useAuth } from "../../hooks/useAuth.js";
import UserAvatar from "../ui/UserAvatar.jsx";

function getShortName(name) {
    return String(name ?? "Usuário")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(" ");
}

function UserMenu() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const fullName = String(user?.name ?? "Usuário").trim() || "Usuário";
    const email = String(user?.email ?? "E-mail não informado").trim();
    const shortName = getShortName(fullName);
    const isAdmin = user?.role === "ADMIN";

    function handleLogout() {
        logout();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menu do usuário"
                    title={fullName}
                    className="
                        group
                        flex h-11 min-w-0
                        items-center gap-2
                        rounded-control
                        px-1.5
                        outline-none
                        transition-colors
                        hover:bg-surface-hover
                        focus-visible:ring-4
                        focus-visible:ring-primary/10
                        data-[state=open]:bg-surface-hover
                    "
                >
                    <UserAvatar
                        name={fullName}
                        src={user?.avatarUrl}
                        size="md"
                        role={user?.role}
                        showTitle={false}
                    />

                    <span
                        className="
                            hidden min-w-0
                            max-w-32 truncate
                            text-sm font-semibold
                            text-foreground
                            md:block
                        "
                    >
                        {shortName}
                    </span>

                    <ChevronDown
                        aria-hidden="true"
                        className="
                            hidden size-4 shrink-0
                            text-subtle-foreground
                            transition-transform
                            group-data-[state=open]:rotate-180
                            md:block
                        "
                    />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="
                        z-[120]
                        w-72
                        max-w-[calc(100vw-1.5rem)]
                        rounded-card-sm
                        border border-border
                        bg-surface-raised
                        p-2
                        text-foreground
                        shadow-popover
                        outline-none
                    "
                >
                    <div
                        className="
                            flex min-w-0
                            items-center gap-3
                            rounded-control
                            bg-surface-muted/70
                            p-3
                        "
                    >
                        <UserAvatar
                            name={fullName}
                            src={user?.avatarUrl}
                            size="lg"
                            role={user?.role}
                            showTitle={false}
                        />

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    text-sm font-bold
                                    text-foreground
                                "
                                title={fullName}
                            >
                                {shortName}
                            </p>

                            <p
                                className="
                                    truncate
                                    text-sm
                                    text-muted-foreground
                                "
                                title={email}
                            >
                                {email}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu.Separator className="my-2 h-px bg-border" />

                    {isAdmin && (
                        <DropdownMenu.Item asChild>
                            <Link
                                to="/usuarios"
                                className="
                                    flex min-h-10
                                    items-center gap-3
                                    rounded-control
                                    px-3
                                    text-sm font-semibold
                                    text-muted-foreground
                                    outline-none
                                    transition-colors
                                    hover:bg-primary-soft
                                    hover:text-primary
                                    focus:bg-primary-soft
                                    focus:text-primary
                                "
                            >
                                <UsersRound
                                    aria-hidden="true"
                                    className="size-4"
                                    strokeWidth={1.8}
                                />

                                Gerenciar usuários
                            </Link>
                        </DropdownMenu.Item>
                    )}

                    <DropdownMenu.Item asChild>
                        <Link
                            to="/perfil"
                            className="
                                flex min-h-10
                                items-center gap-3
                                rounded-control
                                px-3
                                text-sm font-semibold
                                text-muted-foreground
                                outline-none
                                transition-colors
                                hover:bg-primary-soft
                                hover:text-primary
                                focus:bg-primary-soft
                                focus:text-primary
                            "
                        >
                            <UserRound
                                aria-hidden="true"
                                className="size-4"
                                strokeWidth={1.8}
                            />

                            Meu perfil
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={handleLogout}
                        className="
                            flex min-h-10
                            cursor-default
                            items-center gap-3
                            rounded-control
                            px-3
                            text-sm font-semibold
                            text-danger
                            cursor-pointer
                            outline-none
                            transition-colors
                            hover:bg-danger-muted
                            focus:bg-danger-muted
                        "
                    >
                        <LogOut
                            aria-hidden="true"
                            className="size-4"
                            strokeWidth={1.8}
                        />

                        Sair da conta
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export default UserMenu;