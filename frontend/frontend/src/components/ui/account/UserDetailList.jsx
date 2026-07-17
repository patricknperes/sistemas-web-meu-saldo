function UserDetailItem({
    icon: Icon,
    label,
    value,
    description,
    action,
    className = "",
}) {
    return (
        <div
            className={`
                grid min-w-0 gap-3 py-4
                sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)_auto]
                sm:items-center
                ${className}
            `}
        >
            <div className="flex min-w-0 items-center gap-2.5 text-caption font-semibold text-muted-foreground">
                {Icon ? (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-foreground-soft">
                        <Icon size={16} aria-hidden="true" />
                    </span>
                ) : null}
                <span>{label}</span>
            </div>

            <div className="min-w-0">
                <p className="break-words text-body-sm font-semibold text-foreground-soft">
                    {value || "Não informado"}
                </p>

                {description ? (
                    <p className="mt-0.5 text-caption text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="justify-self-start sm:justify-self-end">{action}</div> : null}
        </div>
    );
}

function UserDetailList({
    children,
    divided = true,
    className = "",
}) {
    return (
        <div
            className={`
                min-w-0
                ${divided ? "divide-y divide-border" : "grid gap-2"}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

export {
    UserDetailItem,
};

export default UserDetailList;
