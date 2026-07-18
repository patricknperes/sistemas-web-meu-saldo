import { cn } from "../../../lib/cn.js";

function AuthPanelHeader({ eyebrow, title, description, icon: Icon, className }) {
    return (
        <header className={cn("mb-7", className)}>
            <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary-muted text-primary shadow-xs">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </div>
            {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}
            <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.035em] text-foreground">{title}</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        </header>
    );
}

export default AuthPanelHeader;
