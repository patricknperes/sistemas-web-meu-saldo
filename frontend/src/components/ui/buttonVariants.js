import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex min-w-0 shrink-0 items-center justify-center font-semibold outline-none transition duration-150 ease-smooth focus-visible:ring-4 focus-visible:ring-ring/15 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
                secondary: "border border-border bg-surface text-foreground shadow-xs hover:bg-surface-hover",
                soft: "bg-primary-soft text-primary hover:bg-primary-soft/75",
                ghost: "bg-transparent text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                danger: "bg-danger text-white shadow-xs hover:bg-danger-hover",
            },
            size: {
                sm: "h-9 gap-1.5 rounded-control-sm px-3 text-sm",
                md: "h-10 gap-2 rounded-control px-4 text-sm",
                lg: "h-12 gap-2.5 rounded-control px-5 text-base",
                icon: "size-10 rounded-control",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);
