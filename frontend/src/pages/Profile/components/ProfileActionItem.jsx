import {
    RiArrowRightSLine,
} from "react-icons/ri";

function ProfileActionItem({
    icon: Icon,
    title,
    description,
    onClick,
    disabled = false,
    tone = "default",
    badge,
}) {
    const danger = tone === "danger";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                group flex w-full min-w-0 items-center gap-3 px-4 py-4 text-left
                transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring
                disabled:cursor-not-allowed disabled:opacity-55
                ${danger
                    ? "hover:bg-danger-muted/70"
                    : "hover:bg-surface-hover"
                }
            `}
        >
            <span
                className={`
                    flex size-10 shrink-0 items-center justify-center rounded-lg border
                    ${danger
                        ? "border-danger/15 bg-danger-muted text-danger"
                        : "border-border bg-surface-subtle text-foreground-soft group-hover:border-primary/20 group-hover:bg-primary-muted group-hover:text-primary"
                    }
                `}
            >
                <Icon size={19} aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
                <span className={`block text-body-sm font-bold ${danger ? "text-danger" : "text-foreground"}`}>
                    {title}
                </span>
                <span className="mt-0.5 block text-caption leading-5 text-muted-foreground">
                    {description}
                </span>
            </span>

            {badge ? <span className="shrink-0">{badge}</span> : null}

            <RiArrowRightSLine
                size={20}
                aria-hidden="true"
                className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${danger ? "text-danger" : "text-subtle-foreground"}`}
            />
        </button>
    );
}

export default ProfileActionItem;
