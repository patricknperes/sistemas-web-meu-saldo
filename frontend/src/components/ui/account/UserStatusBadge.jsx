import {
    getUserStatusMeta,
    normalizeUserStatus,
} from "./accountUtils.js";

const toneClasses = {
    ACTIVE: "border-success/15 bg-success-muted text-success",
    INACTIVE: "border-border bg-surface-muted text-muted-foreground",
    PENDING: "border-warning/15 bg-warning-muted text-warning",
    BLOCKED: "border-danger/15 bg-danger-muted text-danger",
};

const dotClasses = {
    ACTIVE: "bg-success",
    INACTIVE: "bg-muted-foreground",
    PENDING: "bg-warning",
    BLOCKED: "bg-danger",
};

function UserStatusBadge({
    status = "ACTIVE",
    size = "md",
    showDot = true,
    className = "",
}) {
    const normalizedStatus = normalizeUserStatus(status);
    const meta = getUserStatusMeta(normalizedStatus);

    return (
        <span
            className={`
                inline-flex max-w-full items-center rounded-pill border font-label
                ${size === "sm" ? "h-5 gap-1.5 px-2 text-overline" : "h-6 gap-2 px-2.5 text-caption"}
                ${toneClasses[normalizedStatus]}
                ${className}
            `}
        >
            {showDot ? (
                <span
                    aria-hidden="true"
                    className={`size-1.5 shrink-0 rounded-full ${dotClasses[normalizedStatus]}`}
                />
            ) : null}

            <span className="truncate">{meta.label}</span>
        </span>
    );
}

export default UserStatusBadge;
