function AuthForm({
    children,
    onSubmit,
    spacing = "default",
    className = "",
    ...props
}) {
    const spacingClassName = {
        compact: "gap-3.5",
        default: "gap-5",
        relaxed: "gap-6",
    }[spacing] ?? "gap-5";

    return (
        <form
            noValidate
            onSubmit={onSubmit}
            className={`grid min-w-0 ${spacingClassName} ${className}`}
            {...props}
        >
            {children}
        </form>
    );
}

export default AuthForm;
