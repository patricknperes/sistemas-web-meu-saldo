export const DEFAULT_TAG_COLOR = "#475569";

export const TAG_COLOR_PRESETS = [
    {
        key: "purple",
        label: "Roxo",
        value: "#7C3AED",
    },
    {
        key: "blue",
        label: "Azul",
        value: "#2563EB",
    },
    {
        key: "cyan",
        label: "Turquesa",
        value: "#0891B2",
    },
    {
        key: "green",
        label: "Verde",
        value: "#15803D",
    },
    {
        key: "orange",
        label: "Laranja",
        value: "#C2410C",
    },
    {
        key: "amber",
        label: "Amarelo",
        value: "#B45309",
    },
    {
        key: "pink",
        label: "Rosa",
        value: "#BE185D",
    },
    {
        key: "red",
        label: "Vermelho",
        value: "#B91C1C",
    },
    {
        key: "slate",
        label: "Cinza",
        value: "#475569",
    },
];

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeTagColor(value, fallback = DEFAULT_TAG_COLOR) {
    const normalizedValue = String(value ?? "").trim();

    if (!HEX_COLOR_PATTERN.test(normalizedValue)) {
        return fallback;
    }

    if (normalizedValue.length === 4) {
        return `#${normalizedValue
            .slice(1)
            .split("")
            .map((character) => character.repeat(2))
            .join("")}`.toUpperCase();
    }

    return normalizedValue.toUpperCase();
}

export function normalizeTagId(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    return String(value);
}

export function normalizeTag(tag, fallbackIndex = 0) {
    const source = tag && typeof tag === "object"
        ? tag
        : {
            name: String(tag ?? ""),
        };

    const rawValue = source.value ?? source.id ?? source.name ?? fallbackIndex;
    const id = normalizeTagId(rawValue);

    return {
        ...source,
        id,
        value: rawValue,
        name: String(source.name ?? source.label ?? "Tag sem nome").trim() || "Tag sem nome",
        color: normalizeTagColor(source.color),
        scope: normalizeTagScope(source.scope),
        active: source.active !== false,
    };
}

export function normalizeTagScope(value) {
    const normalizedValue = String(value ?? "BOTH").toUpperCase();

    if (["INCOME", "EXPENSE", "BOTH"].includes(normalizedValue)) {
        return normalizedValue;
    }

    return "BOTH";
}

export function getTagScopeLabel(scope, compact = false) {
    const normalizedScope = normalizeTagScope(scope);

    if (compact) {
        return {
            INCOME: "Receitas",
            EXPENSE: "Despesas",
            BOTH: "Ambos",
        }[normalizedScope];
    }

    return {
        INCOME: "Somente receitas",
        EXPENSE: "Somente despesas",
        BOTH: "Receitas e despesas",
    }[normalizedScope];
}

export function normalizeTagSearch(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

export function getTagStyle(color) {
    const normalizedColor = normalizeTagColor(color);

    return {
        "--tag-color": normalizedColor,
        "--tag-background": `color-mix(in srgb, ${normalizedColor} 12%, var(--app-surface))`,
        "--tag-background-hover": `color-mix(in srgb, ${normalizedColor} 18%, var(--app-surface))`,
        "--tag-border": `color-mix(in srgb, ${normalizedColor} 24%, var(--app-border))`,
        "--tag-foreground": `color-mix(in srgb, ${normalizedColor} 72%, var(--app-foreground))`,
        "--tag-ring": `color-mix(in srgb, ${normalizedColor} 24%, transparent)`,
    };
}

export function sortTagsByName(firstTag, secondTag) {
    return String(firstTag?.name ?? "").localeCompare(
        String(secondTag?.name ?? ""),
        "pt-BR",
        {
            sensitivity: "base",
        }
    );
}
