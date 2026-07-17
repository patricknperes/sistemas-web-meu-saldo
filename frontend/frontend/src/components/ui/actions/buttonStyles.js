const buttonVariants = {
    primary: `
        border-primary
        bg-primary
        text-primary-foreground
        shadow-sm
        hover:border-primary-hover
        hover:bg-primary-hover
        active:border-primary-active
        active:bg-primary-active
    `,

    secondary: `
        border-border
        bg-surface-muted
        text-foreground
        hover:border-border-strong
        hover:bg-surface-hover
        active:bg-surface-active
    `,

    outline: `
        border-border-strong
        bg-surface
        text-foreground-soft
        hover:border-primary/35
        hover:bg-primary-muted
        hover:text-primary
        active:bg-primary-muted-hover
    `,

    ghost: `
        border-transparent
        bg-transparent
        text-foreground-soft
        hover:bg-surface-hover
        hover:text-foreground
        active:bg-surface-active
    `,

    danger: `
        border-danger
        bg-danger
        text-white
        shadow-sm
        hover:border-danger-hover
        hover:bg-danger-hover
        active:border-danger-strong
        active:bg-danger-strong
    `,

    soft: `
        border-primary/10
        bg-primary-muted
        text-primary
        hover:border-primary/15
        hover:bg-primary-muted-hover
        active:bg-primary-muted-hover
    `,
};

const buttonSizes = {
    sm: `
        h-8
        rounded-md
        px-3
        text-caption
    `,

    md: `
        h-10
        rounded-lg
        px-4
        text-body-sm
    `,

    lg: `
        h-12
        rounded-lg
        px-5
        text-body
    `,
};

const iconButtonSizes = {
    sm: `
        size-8
        rounded-md
    `,

    md: `
        size-10
        rounded-lg
    `,

    lg: `
        size-12
        rounded-lg
    `,
};

const baseButtonClassName = `
    relative
    inline-flex shrink-0
    items-center justify-center
    gap-2
    whitespace-nowrap
    border
    font-semibold
    tracking-label
    select-none
    transition-[background-color,border-color,color,box-shadow,transform]
    duration-150
    ease-smooth
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring/25
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    active:translate-y-px
    disabled:pointer-events-none
    disabled:translate-y-0
`;

function normalizeClassName(value = "") {
    return value
        .replace(/\s+/g, " ")
        .trim();
}

export function getButtonClassName({
    variant = "primary",
    size = "md",
    iconOnly = false,
    fullWidth = false,
    className = "",
} = {}) {
    const selectedVariant =
        buttonVariants[variant] ??
        buttonVariants.primary;

    const selectedSize = iconOnly
        ? iconButtonSizes[size] ??
          iconButtonSizes.md
        : buttonSizes[size] ??
          buttonSizes.md;

    return normalizeClassName(`
        ${baseButtonClassName}
        ${selectedVariant}
        ${selectedSize}
        ${fullWidth ? "w-full" : ""}
        ${iconOnly ? "p-0" : ""}
        ${className}
    `);
}

export {
    buttonSizes,
    buttonVariants,
    iconButtonSizes,
};
