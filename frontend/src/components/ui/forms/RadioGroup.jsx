import {
    useId,
} from "react";

import {
    normalizeClassName,
} from "./fieldStyles.js";

import Radio from "./Radio.jsx";
import useControllableState from "./useControllableState.js";

function RadioGroup({
    name,
    value,
    defaultValue = "",
    onValueChange,
    options = [],
    orientation = "vertical",
    size = "md",
    disabled = false,
    invalid = false,
    className = "",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
}) {
    const generatedId = useId().replace(/:/g, "");
    const resolvedName = name || `radio-group-${generatedId}`;
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-orientation={orientation}
            className={normalizeClassName(`
                ${orientation === "horizontal"
                    ? "flex flex-wrap gap-x-6 gap-y-3"
                    : "grid gap-3"}
                ${className}
            `)}
        >
            {options.map((option) => (
                <Radio
                    key={option.value}
                    name={resolvedName}
                    value={option.value}
                    checked={String(currentValue) === String(option.value)}
                    onChange={() => setCurrentValue(option.value)}
                    label={option.label}
                    description={option.description}
                    disabled={disabled || option.disabled}
                    invalid={invalid}
                    size={size}
                />
            ))}
        </div>
    );
}

export default RadioGroup;
