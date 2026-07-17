import {
    RiLoader4Line,
    RiWallet3Line,
} from "react-icons/ri";

function AppLoadingScreen({
    message = "Preparando seu espaço financeiro...",
    embedded = false,
    className = "",
}) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={`
                relative isolate
                flex w-full
                items-center justify-center
                overflow-hidden
                bg-background
                px-page
                text-foreground

                ${embedded
                    ? "min-h-[24rem] rounded-2xl border border-border"
                    : "min-h-dvh"
                }

                ${className}
            `}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute size-64 rounded-full bg-primary/12 blur-3xl"
            />

            <div className="relative flex max-w-sm flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-raised">
                    <RiWallet3Line
                        size={27}
                        aria-hidden="true"
                    />
                </span>

                <div className="mt-6 flex items-center gap-2.5">
                    <RiLoader4Line
                        size={20}
                        aria-hidden="true"
                        className="animate-spin text-primary"
                    />

                    <p className="text-body-sm font-bold text-foreground">
                        Meu Saldo
                    </p>
                </div>

                <p className="mt-2 text-body-sm text-muted-foreground">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default AppLoadingScreen;
