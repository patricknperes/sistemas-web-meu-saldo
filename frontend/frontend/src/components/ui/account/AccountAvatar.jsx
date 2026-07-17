import {
    getUserInitials,
    normalizeUserStatus,
} from "./accountUtils.js";

const sizeClasses = {
    sm: "size-8 text-caption",
    md: "size-10 text-body-sm",
    lg: "size-12 text-body",
    xl: "size-16 text-section-title",
};

const statusClasses = {
    ACTIVE: "bg-success ring-success-muted",
    INACTIVE: "bg-muted-foreground ring-surface-muted",
    PENDING: "bg-warning ring-warning-muted",
    BLOCKED: "bg-danger ring-danger-muted",
};

function AccountAvatar({
    name,
    src,
    alt,
    size = "md",
    status = "ACTIVE",
    showStatus = false,
    className = "",
}) {
    const normalizedStatus = normalizeUserStatus(status);
    const initials = getUserInitials(name);

    return (
        <span
            className={`
                relative inline-flex shrink-0
                ${className}
            `}
        >
            <span
                className={`
                    flex items-center justify-center overflow-hidden
                    rounded-full border border-primary/15
                    bg-primary-muted font-extrabold text-primary
                    shadow-xs
                    ${sizeClasses[size] ?? sizeClasses.md}
                `}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || name || "Foto do usuário"}
                        className="size-full object-cover"
                    />
                ) : (
                    <span aria-hidden="true">{initials}</span>
                )}
            </span>

            {showStatus ? (
                <span
                    aria-label={`Status ${normalizedStatus.toLowerCase()}`}
                    className={`
                        absolute bottom-0 right-0
                        size-3 rounded-full border-2 border-surface
                        ring-2
                        ${statusClasses[normalizedStatus]}
                    `}
                />
            ) : null}
        </span>
    );
}

export default AccountAvatar;
