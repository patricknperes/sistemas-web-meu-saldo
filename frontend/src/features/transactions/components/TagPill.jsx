import { X } from "lucide-react";

import { cn } from "../../../lib/cn.js";

const DEFAULT_TAG_COLOR = "#64748B";

function normalizeHexColor(value) {
    const color = String(value ?? "").trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return color.toUpperCase();
    }

    if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
        const [red, green, blue] = color.slice(1);

        return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase();
    }

    return DEFAULT_TAG_COLOR;
}

function hexToRgb(hex) {
    const normalizedColor = normalizeHexColor(hex);
    const numericColor = Number.parseInt(normalizedColor.slice(1), 16);

    return {
        red: (numericColor >> 16) & 255,
        green: (numericColor >> 8) & 255,
        blue: numericColor & 255,
    };
}

function toRgba(hex, alpha) {
    const { red, green, blue } = hexToRgb(hex);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function mixColors(sourceHex, targetHex, targetWeight) {
    const source = hexToRgb(sourceHex);
    const target = hexToRgb(targetHex);
    const weight = Math.min(1, Math.max(0, targetWeight));

    const red = Math.round(source.red * (1 - weight) + target.red * weight);
    const green = Math.round(source.green * (1 - weight) + target.green * weight);
    const blue = Math.round(source.blue * (1 - weight) + target.blue * weight);

    return `rgb(${red}, ${green}, ${blue})`;
}

function getRelativeLuminance(hex) {
    const { red, green, blue } = hexToRgb(hex);

    const channels = [red, green, blue].map((channel) => {
        const normalizedChannel = channel / 255;

        return normalizedChannel <= 0.03928
            ? normalizedChannel / 12.92
            : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
    });

    return (
        0.2126 * channels[0]
        + 0.7152 * channels[1]
        + 0.0722 * channels[2]
    );
}

function getTagStyle(color) {
    const luminance = getRelativeLuminance(color);
    const lightTextWeight = luminance > 0.55 ? 0.72 : 0.52;
    const darkTextWeight = luminance < 0.22 ? 0.58 : 0.24;

    return {
        "--tag-color": color,
        "--tag-background": toRgba(color, 0.16),
        "--tag-background-hover": toRgba(color, 0.22),
        "--tag-border": toRgba(color, 0.24),
        "--tag-foreground": mixColors(color, "#0F172A", lightTextWeight),
        "--tag-background-dark": toRgba(color, 0.24),
        "--tag-background-dark-hover": toRgba(color, 0.31),
        "--tag-border-dark": toRgba(color, 0.32),
        "--tag-foreground-dark": mixColors(color, "#FFFFFF", darkTextWeight),
    };
}

function TagPill({
    tag,
    className,
    removable = false,
    onRemove,
}) {
    const color = normalizeHexColor(tag?.color);
    const name = String(tag?.name ?? "").trim() || "Tag";

    function handleRemove(event) {
        event.preventDefault();
        event.stopPropagation();

        onRemove?.(tag?.id);
    }

    return (
        <span
            title={name}
            style={getTagStyle(color)}
            className={cn(
                `
                    inline-flex h-7
                    min-w-0 max-w-full
                    shrink-0
                    items-center gap-2
                    rounded-md
                    border-[0.5px]
                    border-[var(--tag-border)]
                    bg-[var(--tag-background)]
                    px-2.5
                    text-xs
                    font-semibold
                    tracking-[-0.01em]
                    text-[var(--tag-foreground)]
                    transition-colors
                    duration-150
                    hover:bg-[var(--tag-background-hover)]
                    dark:border-[var(--tag-border-dark)]
                    dark:bg-[var(--tag-background-dark)]
                    dark:text-[var(--tag-foreground-dark)]
                    dark:hover:bg-[var(--tag-background-dark-hover)]
                `,
                className,
            )}
        >
            <span className="min-w-0 max-w-32 truncate">
                {name}
            </span>

            {removable && (
                <button
                    type="button"
                    onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onClick={handleRemove}
                    aria-label={`Remover tag ${name}`}
                    title={`Remover ${name}`}
                    className="
                        -mr-1
                        inline-flex size-5
                        shrink-0
                        items-center justify-center
                        rounded-sm
                        text-current
                        opacity-60
                        outline-none
                        transition-[background-color,opacity,transform]
                        hover:bg-black/10
                        hover:opacity-100
                        active:scale-90
                        focus-visible:ring-2
                        focus-visible:ring-[var(--tag-color)]
                        dark:hover:bg-white/10
                    "
                >
                    <X
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={2.4}
                    />
                </button>
            )}
        </span>
    );
}

export default TagPill;