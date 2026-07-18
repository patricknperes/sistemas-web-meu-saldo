import { UserRound } from "lucide-react";

import { cn } from "../../lib/cn.js";

const avatarSizes = {
    xs: "size-7 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-9 text-sm",
    lg: "size-11 text-base",
    xl: "size-14 text-lg",
    "2xl": "size-20 text-2xl sm:size-24 sm:text-3xl",
};

function getInitials(name) {
    const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

function UserAvatar({ name, src, size = "md", className, showTitle = true }) {
    const normalizedName = String(name ?? "").trim() || "Usuário";
    const initials = getInitials(normalizedName);

    return (
        <span
            title={showTitle ? normalizedName : undefined}
            aria-hidden="true"
            className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-primary-foreground shadow-xs ring-2 ring-surface",
                avatarSizes[size] ?? avatarSizes.md,
                className,
            )}
        >
            {src ? (
                <img src={src} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
            ) : initials ? (
                initials
            ) : (
                <UserRound className="size-1/2" aria-hidden="true" />
            )}
        </span>
    );
}

export default UserAvatar;
