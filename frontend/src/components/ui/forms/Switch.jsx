import {
    forwardRef,
    useId,
} from "react";

import {
    normalizeClassName,
} from "./fieldStyles.js";

import useControllableState from "./useControllableState.js";

const Switch = forwardRef(function Switch({
    id,
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    label,
    description,
    size = "md",
    disabled = false,
    labelPosition = "right",
    className = "",
    ...props
}, ref) {
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || `switch-${generatedId}`;
    const descriptionId = description
        ? `${resolvedId}-description`
        : undefined;

    const [currentChecked, setCurrentChecked] = useControllableState({
        value: checked,
        defaultValue: defaultChecked,
        onChange: onCheckedChange,
    });

    function handleChange(event) {
        setCurrentChecked(event.target.checked);
        onChange?.(event);
    }

    const dimensions = {
        sm: {
            track: "h-5 w-9",
            thumb: "size-4 translate-x-0.5 peer-checked:translate-x-[18px]",
        },
        md: {
            track: "h-6 w-11",
            thumb: "size-5 translate-x-0.5 peer-checked:translate-x-[22px]",
        },
        lg: {
            track: "h-7 w-13",
            thumb: "size-6 translate-x-0.5 peer-checked:translate-x-[26px]",
        },
    }[size] || {
        track: "h-6 w-11",
        thumb: "size-5 translate-x-0.5 peer-checked:translate-x-[22px]",
    };

    const control = (
        <span className="relative shrink-0">
            <input
                ref={ref}
                id={resolvedId}
                type="checkbox"
                role="switch"
                checked={Boolean(currentChecked)}
                disabled={disabled}
                aria-describedby={descriptionId}
                onChange={handleChange}
                className="peer sr-only"
                {...props}
            />

            <span
                aria-hidden="true"
                className={normalizeClassName(`
                    block rounded-pill border border-border-strong bg-surface-muted shadow-inner transition-all duration-200 ease-smooth
                    peer-focus-visible:ring-4 peer-focus-visible:ring-primary/15
                    peer-checked:border-primary peer-checked:bg-primary
                    ${dimensions.track}
                `)}
            />

            <span
                aria-hidden="true"
                className={normalizeClassName(`
                    pointer-events-none absolute left-0 top-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-smooth
                    ${dimensions.thumb}
                `)}
            />
        </span>
    );

    const text = label || description ? (
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
    ) : null;

    return (
        <label
            htmlFor={resolvedId}
            className={normalizeClassName(`
                flex min-w-0 items-start justify-between gap-4
                ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
                ${className}
            `)}
        >
            {labelPosition === "left" ? (
                <>
                    {text}
                    {control}
                </>
            ) : (
                <>
                    {control}
                    {text}
                </>
            )}
        </label>
    );
});

export default Switch;
