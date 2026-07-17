import {
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiInformationLine,
} from "react-icons/ri";

const statusMeta = {
    allowed: {
        label: "Permitido",
        icon: RiCheckboxCircleLine,
        iconClass: "bg-success-muted text-success",
    },
    limited: {
        label: "Limitado",
        icon: RiInformationLine,
        iconClass: "bg-warning-muted text-warning",
    },
    denied: {
        label: "Sem acesso",
        icon: RiErrorWarningLine,
        iconClass: "bg-danger-muted text-danger",
    },
};

function PermissionItem({
    title,
    description,
    status = "allowed",
    className = "",
}) {
    const meta = statusMeta[status] ?? statusMeta.allowed;
    const Icon = meta.icon;

    return (
        <div className={`flex min-w-0 items-start gap-3 py-3 ${className}`}>
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.iconClass}`}>
                <Icon size={17} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body-sm font-semibold text-foreground-soft">
                        {title}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-overline text-muted-foreground">
                        {meta.label}
                    </span>
                </div>

                {description ? (
                    <p className="mt-1 text-caption text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

function PermissionList({
    children,
    className = "",
}) {
    return (
        <div className={`divide-y divide-border ${className}`}>
            {children}
        </div>
    );
}

export {
    PermissionItem,
};

export default PermissionList;
