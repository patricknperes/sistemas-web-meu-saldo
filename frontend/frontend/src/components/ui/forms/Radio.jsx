import {
    forwardRef,
    useId,
} from "react";

import {
    normalizeClassName,
} from "./fieldStyles.js";

const Radio = forwardRef(function Radio({
    id,
    label,
    description,
    size = "md",
    disabled = false,
    invalid = false,
    className = "",
    ...props
}, ref) {
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || `radio-${generatedId}`;
    const descriptionId = description
        ? `${resolvedId}-description`
        : undefined;

    const controlSize = size === "sm"
        ? "size-4"
        : "size-5";

    const dotSize = size === "sm"
        ? "size-1.5"
        : "size-2";

    return (
        <label
            htmlFor={resolvedId}
            className={normalizeClassName(`
                group flex min-w-0 items-start gap-3
                ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
                ${className}
            `)}
        >
            <span className="relative mt-0.5 shrink-0">
                <input
                    ref={ref}
                    id={resolvedId}
                    type="radio"
                    disabled={disabled}
                    aria-invalid={invalid || undefined}
                    aria-describedby={descriptionId}
                    className="peer sr-only"
                    {...props}
                />

                <span
                    aria-hidden="true"
                    className={normalizeClassName(`
                        flex items-center justify-center rounded-full border bg-surface shadow-xs transition-all duration-150 ease-smooth
                        after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity after:content-[""]
                        ${controlSize}
                        ${dotSize === "size-1.5" ? "after:size-1.5" : "after:size-2"}
                        ${invalid ? "border-danger" : "border-border-strong"}
                        peer-focus-visible:ring-4 peer-focus-visible:ring-primary/15
                        peer-checked:border-primary peer-checked:after:opacity-100
                        group-hover:border-primary/50
                    `)}
                />
            </span>

            {label || description ? (
                <span className="min-w-0 flex-1">
                    {label ? (
                        <span className="block text-body-sm font-semibold text-foreground-soft">
                            {label}
                        </span>
                    ) : null}

                    {description ? (
                        <span
                            id={descriptionId}
                            className="mt-0.5 block text-caption text-muted-foreground"
                        >
                            {description}
                        </span>
                    ) : null}
                </span>
            ) : null}
        </label>
    );
});

export default Radio;
