import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

import TagBadge from "./TagBadge.jsx";
import TagOverflow from "./TagOverflow.jsx";
import {
    normalizeTag,
} from "./tagUtils.js";

function TagGroup({
    tags = [],
    maxVisible = 2,
    size = "sm",
    removable = false,
    onRemove,
    emptyFallback = null,
    overflowPlacement = "bottom-end",
    className = "",
    badgeClassName = "",
    ariaLabel = "Tags",
}) {
    const normalizedTags = tags
        .filter(Boolean)
        .map(normalizeTag);

    if (normalizedTags.length === 0) {
        return emptyFallback;
    }

    const resolvedMaxVisible = Number.isFinite(maxVisible)
        ? Math.max(0, Math.floor(maxVisible))
        : normalizedTags.length;

    const visibleTags = normalizedTags.slice(0, resolvedMaxVisible);
    const hiddenTags = normalizedTags.slice(resolvedMaxVisible);

    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={normalizeClassName(`
                flex min-w-0 flex-wrap items-center gap-1.5
                ${className}
            `)}
        >
            {visibleTags.map((tag, index) => (
                <TagBadge
                    key={tag.id || `${tag.name}-${index}`}
                    tag={tag}
                    size={size}
                    removable={removable}
                    onRemove={onRemove}
                    className={badgeClassName}
                />
            ))}

            {hiddenTags.length > 0 ? (
                <TagOverflow
                    tags={hiddenTags}
                    size={size}
                    placement={overflowPlacement}
                />
            ) : null}
        </div>
    );
}

export default TagGroup;
