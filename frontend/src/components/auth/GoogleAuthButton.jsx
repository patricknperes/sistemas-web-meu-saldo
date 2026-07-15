import {
    FcGoogle,
} from "react-icons/fc";

function GoogleAuthButton({
    onClick,
    disabled = false,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="
                group
                inline-flex min-h-12
                w-full min-w-0
                items-center
                justify-center gap-3
                rounded-2xl
                border border-border
                bg-background
                px-4
                text-sm
                font-semibold
                text-foreground
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-border-strong
                hover:bg-surface-hover
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-ring/10
                active:scale-[0.99]
                disabled:pointer-events-none
                disabled:opacity-60
            "
        >
            <span
                className="
                    flex size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    shadow-sm
                    ring-1
                    ring-slate-200/80
                "
            >
                <FcGoogle
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <span className="truncate">
                Continuar com Google
            </span>

            <span
                className="
                    shrink-0
                    rounded-full
                    bg-surface-muted
                    px-2 py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                "
            >
                Em breve
            </span>
        </button>
    );
}

export default GoogleAuthButton;