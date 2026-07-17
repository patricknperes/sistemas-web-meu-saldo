const controlSizes = {
    sm: "h-9 rounded-md px-3 text-caption",
    md: "h-10 rounded-lg px-3.5 text-body-sm",
    lg: "h-12 rounded-lg px-4 text-body",
};

const textareaSizes = {
    sm: "min-h-24 rounded-md px-3 py-2 text-caption",
    md: "min-h-28 rounded-lg px-3.5 py-2.5 text-body-sm",
    lg: "min-h-32 rounded-lg px-4 py-3 text-body",
};

const controlStates = {
    default: `
        border-border-strong
        hover:border-primary/35
        focus:border-primary
        focus:ring-primary/15
    `,

    error: `
        border-danger
        focus:border-danger
        focus:ring-danger/15
    `,

    success: `
        border-success
        focus:border-success
        focus:ring-success/15
    `,
};

const baseControlClassName = `
    w-full min-w-0
    border
    bg-surface
    text-foreground
    shadow-xs
    outline-none
    placeholder:text-subtle-foreground
    transition-[background-color,border-color,box-shadow,color]
    duration-150
    ease-smooth
    focus:ring-4
    disabled:cursor-not-allowed
    disabled:border-border
    disabled:bg-surface-muted
    disabled:text-disabled-foreground
    disabled:shadow-none
    read-only:bg-surface-subtle
`;

function normalizeClassName(value = "") {
    return value
        .replace(/\s+/g, " ")
        .trim();
}

function getControlState({
    status = "default",
    invalid = false,
} = {}) {
    if (invalid) {
        return "error";
    }

    if (status === "error" || status === "success") {
        return status;
    }

    return "default";
}

export function getInputClassName({
    size = "md",
    status = "default",
    invalid = false,
    hasLeading = false,
    hasTrailing = false,
    className = "",
} = {}) {
    const resolvedState = getControlState({
        status,
        invalid,
    });

    return normalizeClassName(`
        ${baseControlClassName}
        ${controlSizes[size] ?? controlSizes.md}
        ${controlStates[resolvedState]}
        ${hasLeading ? "pl-10" : ""}
        ${hasTrailing ? "pr-10" : ""}
        ${className}
    `);
}

export function getTextAreaClassName({
    size = "md",
    status = "default",
    invalid = false,
    resize = "vertical",
    className = "",
} = {}) {
    const resizeClassName = {
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
    }[resize] ?? "resize-y";

    const resolvedState = getControlState({
        status,
        invalid,
    });

    return normalizeClassName(`
        ${baseControlClassName}
        ${textareaSizes[size] ?? textareaSizes.md}
        ${controlStates[resolvedState]}
        ${resizeClassName}
        ${className}
    `);
}

export function mergeDescribedBy(...values) {
    return values
        .filter(Boolean)
        .join(" ") || undefined;
}

export {
    controlSizes,
    controlStates,
    normalizeClassName,
    textareaSizes,
};
