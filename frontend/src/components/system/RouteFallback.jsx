import BrandMark from "../ui/BrandMark.jsx";

function RouteFallback({ fullScreen = false, label = "Carregando interface" }) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className={`flex min-w-0 items-center justify-center bg-background px-4 ${fullScreen ? "min-h-screen min-h-dvh" : "min-h-64"}`}
        >
            <div className="flex flex-col items-center gap-5 text-center">
                <BrandMark />
                <span className="relative flex size-10 items-center justify-center" aria-hidden="true">
                    <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">{label}...</span>
            </div>
        </div>
    );
}

export default RouteFallback;
