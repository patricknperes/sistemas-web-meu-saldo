import {
    RiShieldCheckLine,
    RiUserLine,
} from "react-icons/ri";

import {
    getUserRoleMeta,
    normalizeUserRole,
} from "./accountUtils.js";

const sizeClasses = {
    sm: "h-5 gap-1 px-2 text-overline",
    md: "h-6 gap-1.5 px-2.5 text-caption",
};

function UserRoleBadge({
    role = "USER",
    size = "md",
    showIcon = true,
    className = "",
}) {
    const normalizedRole = normalizeUserRole(role);
    const meta = getUserRoleMeta(normalizedRole);
    const Icon = normalizedRole === "ADMIN" ? RiShieldCheckLine : RiUserLine;

    return (
        <span
            className={`
                inline-flex max-w-full items-center rounded-pill
                border font-label
                ${normalizedRole === "ADMIN"
                    ? "border-primary/15 bg-primary-muted text-primary"
                    : "border-border bg-surface-muted text-foreground-soft"
                }
                ${sizeClasses[size] ?? sizeClasses.md}
                ${className}
            `}
        >
            {showIcon ? (
                <Icon size={size === "sm" ? 12 : 14} aria-hidden="true" />
            ) : null}

            <span className="truncate">{meta.label}</span>
        </span>
    );
}

export default UserRoleBadge;
