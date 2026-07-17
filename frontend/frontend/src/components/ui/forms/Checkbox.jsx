import {
    forwardRef,
    useEffect,
    useId,
    useRef,
} from "react";

import {
    RiCheckLine,
    RiSubtractLine,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "./fieldStyles.js";

import useControllableState from "./useControllableState.js";

const Checkbox = forwardRef(function Checkbox({
    id,
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    indeterminate = false,
    label,
    description,
    size = "md",
    disabled = false,
    invalid = false,
    className = "",
    ...props
}, forwardedRef) {
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || `checkbox-${generatedId}`;
    const descriptionId = description
        ? `${resolvedId}-description`
        : undefined;

    const internalRef = useRef(null);
    const [currentChecked, setCurrentChecked] = useControllableState({
        value: checked,
        defaultValue: defaultChecked,
        onChange: onCheckedChange,
    });

    function setRefs(node) {
        internalRef.current = node;

        if (typeof forwardedRef === "function") {
            forwardedRef(node);
        } else if (forwardedRef) {
            forwardedRef.current = node;
        }
    }

    useEffect(() => {
        if (internalRef.current) {
            internalRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    function handleChange(event) {
        setCurrentChecked(event.target.checked);
        onChange?.(event);
    }

    const controlSize = size === "sm"
        ? "size-4 rounded-[5px]"
        : "size-5 rounded-md";

    const iconSize = size === "sm" ? 13 : 15;

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
                    ref={setRefs}
                    id={resolvedId}
                    type="checkbox"
                    checked={Boolean(currentChecked)}
                    disabled={disabled}
                    aria-invalid={invalid || undefined}
                    aria-describedby={descriptionId}
                    onChange={handleChange}
                    className="peer sr-only"
                    {...props}
                />

                <span
                    aria-hidden="true"
                    className={normalizeClassName(`
                        flex items-center justify-center border bg-surface text-transparent shadow-xs transition-all duration-150 ease-smooth
                        ${controlSize}
                        ${invalid ? "border-danger" : "border-border-strong"}
                        ${indeterminate ? "border-primary bg-primary text-primary-foreground" : ""}
                        peer-focus-visible:ring-4 peer-focus-visible:ring-primary/15
                        peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground
                        group-hover:border-primary/50
                    `)}
                >
                    {indeterminate ? (
                        <RiSubtractLine size={iconSize} strokeWidth={2.4} />
                    ) : (
                        <RiCheckLine size={iconSize} strokeWidth={2.4} />
                    )}
                </span>
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

export default Checkbox;
