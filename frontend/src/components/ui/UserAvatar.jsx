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

const statusSizes = {
    xs: "size-2.5 border-2",
    sm: "size-3 border-2",
    md: "size-3.5 border-2",
    lg: "size-4 border-[3px]",
    xl: "size-[18px] border-[3px]",
    "2xl": "size-5 border-[3px] sm:size-6",
};

function getInitials(name) {
    const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

function UserAvatar({
    name,
    src,
    size = "md",
    role = "USER",
    isActive,
    showStatus = false,
    className,
    showTitle = true,
}) {
    const normalizedName = String(name ?? "").trim() || "Usuário";
    const initials = getInitials(normalizedName);
    const isAdmin = String(role ?? "USER").toUpperCase() === "ADMIN";
    const hasStatus = showStatus && typeof isActive === "boolean";
    const statusLabel = isActive ? "Conta ativa" : "Conta inativa";

    return (
        <span
            role="img"
            aria-label={hasStatus ? `${normalizedName}. ${statusLabel}.` : normalizedName}
            title={showTitle ? (hasStatus ? `${normalizedName} — ${statusLabel}` : normalizedName) : undefined}
            className={cn(
                "relative inline-flex shrink-0 rounded-full",
                avatarSizes[size] ?? avatarSizes.md,
                isAdmin
                    ? "ring-2 ring-[#D6A51F]/70 ring-offset-2 ring-offset-surface"
                    : "ring-1 ring-border ring-offset-2 ring-offset-surface",
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 flex items-center justify-center overflow-hidden rounded-full font-bold shadow-xs",
                    isAdmin
                        ? "bg-gradient-to-br from-[#F2C94C] via-[#D6A51F] to-[#A66A14] text-[#2A1803] dark:from-[#F4D56F] dark:via-[#D7A92B] dark:to-[#A96D16] dark:text-[#241403]"
                        : "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
                )}
            >
                {src ? (
                    <img
                        src={src}
                        alt=""
                        className="size-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : initials ? (
                    initials
                ) : (
                    <UserRound className="size-1/2" aria-hidden="true" />
                )}
            </span>

            {hasStatus && (
                <span
                    aria-hidden="true"
                    className={cn(
                        "absolute bottom-0 right-0 z-10 rounded-full border-surface shadow-sm",
                        statusSizes[size] ?? statusSizes.md,
                        isActive ? "bg-success" : "bg-border",
                    )}
                />
            )}
        </span>
    );
}

export default UserAvatar;