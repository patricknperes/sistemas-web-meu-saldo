import {
    RiLogoutBoxRLine,
} from "react-icons/ri";

import {
    Link,
} from "react-router";

import {
    useSidebarContext,
} from "./SidebarContext.js";

function getInitials(name) {
    const parts = (
        name?.trim() ||
        "Usuário"
    )
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);

    return parts
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function SidebarAccount({
    name = "Usuário",
    role = "Conta pessoal",
    profileTo = "/perfil",
    avatar,
    onLogout,
    logoutLabel = "Sair da conta",
}) {
    const {
        collapsed,
        mode,
        closeMobileSidebar,
    } = useSidebarContext();

    const labelsVisible =
        mode === "mobile" ||
        !collapsed;

    const avatarContent =
        avatar ?? (
            <span
                aria-hidden="true"
                className="
                    flex size-9 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-primary-muted
                    text-xs font-extrabold
                    text-primary
                    ring-1 ring-primary/10
                "
            >
                {getInitials(name)}
            </span>
        );

    function handleProfileClick() {
        closeMobileSidebar();
    }

    function handleLogout() {
        closeMobileSidebar();
        onLogout?.();
    }

    return (
        <footer
            className="
                shrink-0
                border-t border-border-subtle
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
                        to={profileTo}
                        onClick={
                            handleProfileClick
                        }
                        className="
                            flex min-w-0 flex-1
                            items-center gap-3
                            rounded-lg
                            p-1.5
                            outline-none
                            transition-colors
                            hover:bg-surface-hover
                            focus-visible:ring-2
                            focus-visible:ring-ring/25
                        "
                    >
                        {avatarContent}

                        <span className="min-w-0">
                            <strong
                                className="
                                    block truncate
                                    text-body-sm
                                    font-bold
                                    text-foreground
                                "
                            >
                                {name}
                            </strong>

                            <span
                                className="
                                    mt-0.5 block
                                    truncate
                                    text-[10px]
                                    font-medium
                                    text-muted-foreground
                                "
                            >
                                {role}
                            </span>
                        </span>
                    </Link>

                    {onLogout && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label={
                                logoutLabel
                            }
                            title={logoutLabel}
                            className="
                                inline-flex size-9
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                text-muted-foreground
                                outline-none
                                transition-colors
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
                    )}
                </div>
            ) : (
                <div className="grid gap-2">
                    <Link
                        to={profileTo}
                        onClick={
                            handleProfileClick
                        }
                        aria-label={`Abrir perfil de ${name}`}
                        title={name}
                        className="
                            mx-auto rounded-full
                            outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring/25
                        "
                    >
                        {avatarContent}
                    </Link>

                    {onLogout && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label={
                                logoutLabel
                            }
                            title={logoutLabel}
                            className="
                                mx-auto
                                inline-flex size-9
                                items-center justify-center
                                rounded-lg
                                text-muted-foreground
                                outline-none
                                transition-colors
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
                    )}
                </div>
            )}
        </footer>
    );
}

export default SidebarAccount;
