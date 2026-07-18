import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../hooks/useAuth.js";
import UserAvatar from "../ui/UserAvatar.jsx";

function getShortName(name) {
    return String(name ?? "Usuário").trim().split(/\s+/).filter(Boolean).slice(0, 2).join(" ");
}

function UserMenu() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const fullName = String(user?.name ?? "Usuário").trim() || "Usuário";
    const shortName = getShortName(fullName);
    const roleLabel = user?.role === "ADMIN" ? "Administrador" : "Usuário";

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menu do usuário"
                    title={fullName}
                    className="group flex h-11 min-w-0 items-center gap-2 rounded-control px-1.5 outline-none transition hover:bg-surface-hover focus-visible:ring-4 focus-visible:ring-primary/10 data-[state=open]:bg-surface-hover"
                >
                    <UserAvatar name={fullName} src={user?.avatarUrl} size="md" showTitle={false} />
                    <span className="hidden min-w-0 max-w-32 truncate text-sm font-semibold text-foreground md:block">{shortName}</span>
                    <ChevronDown className="hidden size-4 shrink-0 text-subtle-foreground transition-transform group-data-[state=open]:rotate-180 md:block" aria-hidden="true" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-[120] w-72 max-w-[calc(100vw-1.5rem)] rounded-card-sm border border-border bg-surface-raised p-2 text-foreground shadow-popover outline-none"
                >
                    <div className="flex min-w-0 items-center gap-3 rounded-control bg-surface-muted/70 p-3">
                        <UserAvatar name={fullName} src={user?.avatarUrl} size="lg" showTitle={false} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-foreground" title={fullName}>{shortName}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ShieldCheck className="size-3.5" aria-hidden="true" />
                                {roleLabel}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu.Separator className="my-2 h-px bg-border" />

                    <DropdownMenu.Item asChild>
                        <Link
                            to="/perfil"
                            className="flex min-h-10 items-center gap-3 rounded-control px-3 text-sm font-semibold text-muted-foreground outline-none transition hover:bg-surface-hover hover:text-foreground focus:bg-surface-hover focus:text-foreground"
                        >
                            <UserRound className="size-4" aria-hidden="true" />
                            Meu perfil
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={handleLogout}
                        className="flex min-h-10 cursor-default items-center gap-3 rounded-control px-3 text-sm font-semibold text-danger outline-none transition hover:bg-danger-muted focus:bg-danger-muted"
                    >
                        <LogOut className="size-4" aria-hidden="true" />
                        Sair da conta
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export default UserMenu;
