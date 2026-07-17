import {
    RiCheckLine,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

import {
    getTagScopeLabel,
    getTagStyle,
    normalizeTag,
} from "./tagUtils.js";

function TagOption({
    tag,
    selected = false,
    disabled = false,
    onSelect,
    className = "",
}) {
    const normalizedTag = normalizeTag(tag);

    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled}
            className={normalizeClassName(`
                group flex w-full min-w-0 items-center gap-3
                rounded-lg border px-3 py-2.5 text-left
                transition-[background-color,border-color,box-shadow]
                duration-150 ease-smooth
                focus-visible:outline-none focus-visible:ring-4
                ${selected
                    ? "border-[var(--tag-border)] bg-[var(--tag-background)] ring-[var(--tag-ring)]"
                    : "border-transparent bg-transparent hover:border-border hover:bg-surface-hover focus-visible:ring-primary/15"}
                disabled:cursor-not-allowed disabled:opacity-45
                ${className}
            `)}
            style={getTagStyle(normalizedTag.color)}
            onClick={() => onSelect?.(normalizedTag)}
        >
            <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border-2 border-surface shadow-[0_0_0_1px_var(--tag-border)] bg-[var(--tag-color)]"
            />

            <span className="min-w-0 flex-1">
                <span className="block truncate text-body-sm font-semibold text-foreground">
                    {normalizedTag.name}
                </span>

                <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                    {getTagScopeLabel(normalizedTag.scope)}
                </span>
            </span>

            <span
                aria-hidden="true"
                className={normalizeClassName(`
                    flex size-5 shrink-0 items-center justify-center
                    rounded-md border transition-colors
                    ${selected
                        ? "border-[var(--tag-color)] bg-[var(--tag-color)] text-white"
                        : "border-border-strong bg-surface text-transparent group-hover:border-primary/40"}
                `)}
            >
                <RiCheckLine size={13} />
            </span>
        </button>
    );
}

export default TagOption;
