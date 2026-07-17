function AuthDivider({
    label = "ou continue com",
    className = "",
}) {
    return (
        <div
            className={`flex items-center gap-3 ${className}`}
            role="separator"
            aria-label={label}
        >
            <span className="h-px min-w-0 flex-1 bg-border" />
            <span className="shrink-0 text-caption font-semibold text-muted-foreground">
                {label}
            </span>
            <span className="h-px min-w-0 flex-1 bg-border" />
        </div>
    );
}

export default AuthDivider;
