import {
    forwardRef,
} from "react";

import {
    RiCloseLine,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

import {
    getTagStyle,
    normalizeTag,
} from "./tagUtils.js";

const sizeClasses = {
    sm: "h-6 gap-1.5 px-2 text-[0.6875rem]",
    md: "h-7 gap-1.5 px-2.5 text-caption",
};

const dotSizeClasses = {
    sm: "size-1.5",
    md: "size-2",
};

const TagBadge = forwardRef(function TagBadge({
    tag,
    label,
    color,
    size = "sm",
    dot = true,
    icon: Icon,
    selected = false,
    disabled = false,
    removable = false,
    onRemove,
    removeLabel,
    onClick,
    maxWidth = "11rem",
    className = "",
    title,
    ...props
}, ref) {
    const normalizedTag = normalizeTag({
        ...(tag && typeof tag === "object" ? tag : {}),
        name: label ?? tag?.name ?? tag?.label ?? tag,
        color: color ?? tag?.color,
    });

    const resolvedSize = sizeClasses[size] ? size : "sm";
    const interactive = typeof onClick === "function";
    const Component = interactive ? "button" : "span";

    function handleRemove(event) {
        event.stopPropagation();
        onRemove?.(normalizedTag, event);
    }

    return (
        <Component
            ref={ref}
            type={interactive ? "button" : undefined}
            disabled={interactive ? disabled : undefined}
            aria-pressed={interactive ? selected : undefined}
            title={title || normalizedTag.name}
            onClick={onClick}
            className={normalizeClassName(`
                inline-flex min-w-0 shrink-0 items-center
                rounded-md border
                border-[var(--tag-border)]
                bg-[var(--tag-background)]
                font-semibold
                text-[var(--tag-foreground)]
                transition-[background-color,border-color,box-shadow,opacity]
                duration-150 ease-smooth
                ${sizeClasses[resolvedSize]}
                ${interactive ? "cursor-pointer hover:bg-[var(--tag-background-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--tag-ring)]" : ""}
                ${selected ? "border-[var(--tag-color)] shadow-[0_0_0_3px_var(--tag-ring)]" : ""}
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
                ${className}
            `)}
            style={{
                ...getTagStyle(normalizedTag.color),
                maxWidth,
            }}
            {...props}
        >
            {Icon ? (
                <Icon
                    aria-hidden="true"
                    className="shrink-0"
                    size={resolvedSize === "sm" ? 13 : 14}
                />
            ) : dot ? (
                <span
                    aria-hidden="true"
                    className={normalizeClassName(`
                        shrink-0 rounded-full
                        bg-[var(--tag-color)]
                        ${dotSizeClasses[resolvedSize]}
                    `)}
                />
            ) : null}

            <span className="min-w-0 truncate">
                {normalizedTag.name}
            </span>

            {removable ? (
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={removeLabel || `Remover tag ${normalizedTag.name}`}
                    className="-mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-[var(--tag-foreground)] transition-colors hover:bg-[var(--tag-background-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tag-color)] disabled:cursor-not-allowed"
                    onClick={handleRemove}
                >
                    <RiCloseLine
                        size={13}
                        aria-hidden="true"
                    />
                </button>
            ) : null}
        </Component>
    );
});

export default TagBadge;
