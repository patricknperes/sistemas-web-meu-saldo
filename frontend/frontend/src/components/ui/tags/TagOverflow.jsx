import {
    RiPriceTag3Line,
} from "react-icons/ri";

import Popover from "../feedback/Popover.jsx";
import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

import TagBadge from "./TagBadge.jsx";
import {
    normalizeTag,
} from "./tagUtils.js";

function TagOverflow({
    tags = [],
    size = "sm",
    placement = "bottom-end",
    label,
    title = "Outras tags",
    className = "",
}) {
    const normalizedTags = tags.map(normalizeTag);

    if (normalizedTags.length === 0) {
        return null;
    }

    const resolvedLabel = label || `+${normalizedTags.length}`;

    return (
        <Popover
            placement={placement}
            className="w-[min(18rem,calc(100vw-1rem))] p-0"
            trigger={
                <button
                    type="button"
                    aria-label={`Mostrar mais ${normalizedTags.length} ${normalizedTags.length === 1 ? "tag" : "tags"}`}
                    className={normalizeClassName(`
                        inline-flex shrink-0 items-center justify-center
                        rounded-md border border-border
                        bg-surface-muted font-semibold text-muted-foreground
                        transition-[background-color,border-color,color,box-shadow]
                        hover:border-primary/25 hover:bg-primary-muted hover:text-primary
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15
                        ${size === "md" ? "h-7 min-w-7 px-2 text-caption" : "h-6 min-w-6 px-1.5 text-[0.6875rem]"}
                        ${className}
                    `)}
                >
                    {resolvedLabel}
                </button>
            }
        >
            <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <RiPriceTag3Line
                        size={16}
                        className="text-primary"
                        aria-hidden="true"
                    />

                    <p className="text-body-sm font-semibold text-foreground">
                        {title}
                    </p>
                </div>

                <p className="mt-1 text-caption text-muted-foreground">
                    {normalizedTags.length} {normalizedTags.length === 1 ? "tag adicional" : "tags adicionais"}
                </p>
            </div>

            <div className="scrollbar-subtle flex max-h-56 flex-wrap gap-2 overflow-y-auto p-4">
                {normalizedTags.map((tag, index) => (
                    <TagBadge
                        key={tag.id || `${tag.name}-${index}`}
                        tag={tag}
                        size={size}
                        maxWidth="100%"
                    />
                ))}
            </div>
        </Popover>
    );
}

export default TagOverflow;
