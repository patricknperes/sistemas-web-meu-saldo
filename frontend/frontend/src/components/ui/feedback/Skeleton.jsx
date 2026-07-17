import {
    mergeClassNames,
} from "./overlayUtils.js";

const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

function Skeleton({
    width,
    height,
    radius = "md",
    className = "",
    ...props
}) {
    return (
        <span
            aria-hidden="true"
            className={mergeClassNames(
                "relative block overflow-hidden bg-surface-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[skeleton-shimmer_1.6s_ease-in-out_infinite] before:bg-[linear-gradient(90deg,transparent,var(--app-surface-hover),transparent)]",
                radiusClasses[radius] || radiusClasses.md,
                className
            )}
            style={{ width, height }}
            {...props}
        />
    );
}

function SkeletonText({
    lines = 3,
    className = "",
}) {
    return (
        <div aria-hidden="true" className={mergeClassNames("grid gap-2.5", className)}>
            {Array.from({ length: lines }, (_, index) => (
                <Skeleton
                    key={index}
                    height="0.75rem"
                    width={index === lines - 1 ? "68%" : "100%"}
                />
            ))}
        </div>
    );
}

export {
    Skeleton,
    SkeletonText,
};
