import { ChartNoAxesCombined, WalletCards } from "lucide-react";

import { cn } from "../../lib/cn.js";

function BrandMark({ className, compact = false }) {
    return (
        <div className={cn("flex min-w-0 items-center gap-3", className)}>
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-primary text-primary-foreground shadow-card">
                <WalletCards size={21} aria-hidden="true" />
                <ChartNoAxesCombined
                    size={12}
                    aria-hidden="true"
                    className="absolute bottom-1 right-1 opacity-80"
                />
            </span>

            {!compact && (
                <span className="min-w-0">
                    <strong className="block truncate text-sm font-bold tracking-[-0.01em] text-foreground">
                        Meu Saldo
                    </strong>
                    <span className="block truncate text-[11px] text-subtle-foreground">
                        Finanças com clareza
                    </span>
                </span>
            )}
        </div>
    );
}

export default BrandMark;
