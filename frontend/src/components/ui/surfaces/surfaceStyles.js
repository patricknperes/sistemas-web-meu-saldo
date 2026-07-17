export function mergeClasses(...values) {
    return values
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

export const surfaceVariantClasses = {
    default: `
        border border-border
        bg-surface
        text-foreground
    `,
    subtle: `
        border border-border-subtle
        bg-surface-subtle
        text-foreground
    `,
    muted: `
        border border-transparent
        bg-surface-muted
        text-foreground
    `,
    outlined: `
        border border-border-strong
        bg-transparent
        text-foreground
    `,
    elevated: `
        border border-border
        bg-surface-elevated
        text-foreground
        shadow-raised
    `,
    primary: `
        border border-primary/15
        bg-primary-muted
        text-foreground
    `,
    transparent: `
        border border-transparent
        bg-transparent
        text-foreground
    `,
};

export const radiusClasses = {
    none: "rounded-none",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
};

export const paddingClasses = {
    none: "p-0",
    xs: "p-2.5",
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
    xl: "p-6",
};

export const sectionGapClasses = {
    sm: "gap-3",
    md: "gap-5",
    lg: "gap-7",
    xl: "gap-9",
};
