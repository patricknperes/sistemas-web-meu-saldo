import AccountAvatar from "./AccountAvatar.jsx";
import UserRoleBadge from "./UserRoleBadge.jsx";
import UserStatusBadge from "./UserStatusBadge.jsx";

function UserIdentity({
    name,
    email,
    description,
    avatarUrl,
    role = "USER",
    status = "ACTIVE",
    size = "md",
    showRole = true,
    showStatus = true,
    actions,
    className = "",
}) {
    const avatarSize = size === "lg" ? "xl" : size === "sm" ? "sm" : "lg";

    return (
        <div
            className={`
                flex min-w-0 items-start gap-3
                ${className}
            `}
        >
            <AccountAvatar
                name={name}
                src={avatarUrl}
                size={avatarSize}
                status={status}
                showStatus
            />

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p
                            className={`
                                truncate font-bold text-foreground
                                ${size === "lg" ? "text-section-title" : "text-body"}
                            `}
                        >
                            {name || "Usuário sem nome"}
                        </p>

                        {email ? (
                            <p className="mt-0.5 truncate text-caption text-muted-foreground">
                                {email}
                            </p>
                        ) : null}
                    </div>

                    {actions ? <div className="shrink-0">{actions}</div> : null}
                </div>

                {description ? (
                    <p className="mt-2 text-caption text-muted-foreground">
                        {description}
                    </p>
                ) : null}

                {showRole || showStatus ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {showRole ? <UserRoleBadge role={role} size="sm" /> : null}
                        {showStatus ? <UserStatusBadge status={status} size="sm" /> : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default UserIdentity;
