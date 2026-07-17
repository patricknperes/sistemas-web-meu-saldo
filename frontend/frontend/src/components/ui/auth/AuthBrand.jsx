import {
    RiWallet3Line,
} from "react-icons/ri";

function AuthBrand({
    title = "Meu Saldo",
    subtitle = "Controle financeiro pessoal",
    icon,
    inverse = false,
    compact = false,
    className = "",
}) {
    return (
        <div
            className={`
                flex min-w-0 items-center
                ${compact ? "gap-2.5" : "gap-3"}
                ${className}
            `}
        >
            <span
                className={`
                    flex shrink-0 items-center justify-center
                    ${compact ? "size-9 rounded-lg" : "size-11 rounded-xl"}
                    ${inverse
                        ? "border border-white/15 bg-white/10 text-white"
                        : "border border-primary/10 bg-primary text-primary-foreground shadow-sm"
                    }
                `}
            >
                {icon ?? (
                    <RiWallet3Line
                        size={compact ? 18 : 21}
                        aria-hidden="true"
                    />
                )}
            </span>

            <span className="min-w-0">
                <strong
                    className={`
                        block truncate font-extrabold tracking-heading
                        ${compact ? "text-body-sm" : "text-card-title"}
                        ${inverse ? "text-white" : "text-foreground"}
                    `}
                >
                    {title}
                </strong>

                {subtitle ? (
                    <span
                        className={`
                            mt-0.5 block truncate text-caption
                            ${inverse ? "text-white/65" : "text-muted-foreground"}
                        `}
                    >
                        {subtitle}
                    </span>
                ) : null}
            </span>
        </div>
    );
}

export default AuthBrand;
