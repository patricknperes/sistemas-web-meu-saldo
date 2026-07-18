import { cn } from "../../../lib/cn.js";

function TagPill({ tag, className, removable = false, onRemove }) {
    const color = /^#[0-9A-Fa-f]{6}$/.test(tag?.color ?? "") ? tag.color : "#64748B";

    return (
        <span
            className={cn("inline-flex h-6 min-w-0 items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 text-xs font-semibold text-muted-foreground", className)}
            title={tag?.name}
        >
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
            <span className="max-w-28 truncate">{tag?.name}</span>
            {removable && (
                <button
                    type="button"
                    className="-mr-1 inline-flex size-4 items-center justify-center rounded-full text-subtle-foreground transition hover:bg-surface-hover hover:text-foreground"
                    onClick={() => onRemove?.(tag?.id)}
                    aria-label={`Remover tag ${tag?.name}`}
                >
                    ×
                </button>
            )}
        </span>
    );
}

export default TagPill;
