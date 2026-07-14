import { RiUser3Line } from "react-icons/ri";

const avatarSizes = {
    sm: {
        container: "size-8 text-xs",
        icon: 17,
    },
    md: {
        container: "size-10 text-sm",
        icon: 19,
    },
    lg: {
        container: "size-11 text-base",
        icon: 21,
    },
};

function UserAvatar({
    name,
    size = "md",
    className = "",
    showTitle = true,
}) {
    const normalizedName =
        name?.trim() || "Usuário";

    const initial = normalizedName
        .charAt(0)
        .toUpperCase();

    const selectedSize =
        avatarSizes[size] ?? avatarSizes.md;

    return (
        <span
            title={
                showTitle
                    ? normalizedName
                    : undefined
            }
            aria-hidden="true"
            className={`
                flex shrink-0
                items-center justify-center
                overflow-hidden
                rounded-full
                border border-border
                bg-surface-muted
                font-semibold
                text-foreground
                ${selectedSize.container}
                ${className}
            `}
        >
            {initial ? (
                initial
            ) : (
                <RiUser3Line
                    size={selectedSize.icon}
                />
            )}
        </span>
    );
}

export default UserAvatar;