import {
    useId,
    useRef,
} from "react";

import {
    normalizeClassName,
} from "./fieldStyles.js";

import useControllableState from "./useControllableState.js";

function SegmentedControl({
    id,
    options = [],
    value,
    defaultValue,
    onValueChange,
    size = "md",
    fullWidth = false,
    disabled = false,
    className = "",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
}) {
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || `segmented-${generatedId}`;
    const buttonRefs = useRef([]);
    const firstEnabledValue = options.find((option) => !option.disabled)?.value;

    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue: defaultValue ?? firstEnabledValue,
        onChange: onValueChange,
    });

    const sizeClassName = {
        sm: "min-h-8 px-2.5 py-1.5 text-caption",
        md: "min-h-9 px-3 py-2 text-body-sm",
        lg: "min-h-11 px-4 py-2.5 text-body",
    }[size] || "min-h-9 px-3 py-2 text-body-sm";

    function focusRelativeOption(currentIndex, direction) {
        let nextIndex = currentIndex;

        for (let attempt = 0; attempt < options.length; attempt += 1) {
            nextIndex = (nextIndex + direction + options.length) % options.length;

            if (!options[nextIndex]?.disabled) {
                buttonRefs.current[nextIndex]?.focus();
                setCurrentValue(options[nextIndex].value);
                return;
            }
        }
    }

    function handleKeyDown(event, index) {
        if (["ArrowRight", "ArrowDown"].includes(event.key)) {
            event.preventDefault();
            focusRelativeOption(index, 1);
        }

        if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            focusRelativeOption(index, -1);
        }

        if (event.key === "Home") {
            event.preventDefault();
            const firstIndex = options.findIndex((option) => !option.disabled);

            if (firstIndex >= 0) {
                buttonRefs.current[firstIndex]?.focus();
                setCurrentValue(options[firstIndex].value);
            }
        }

        if (event.key === "End") {
            event.preventDefault();
            const lastIndex = [...options]
                .reverse()
                .findIndex((option) => !option.disabled);

            if (lastIndex >= 0) {
                const resolvedIndex = options.length - 1 - lastIndex;
                buttonRefs.current[resolvedIndex]?.focus();
                setCurrentValue(options[resolvedIndex].value);
            }
        }
    }

    return (
        <div
            id={resolvedId}
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={normalizeClassName(`
                inline-flex max-w-full items-stretch gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted p-1
                ${fullWidth ? "grid w-full auto-cols-fr grid-flow-col" : ""}
                ${disabled ? "opacity-55" : ""}
                ${className}
            `)}
        >
            {options.map((option, index) => {
                const selected = String(currentValue) === String(option.value);
                const Icon = option.icon;
                const optionDisabled = disabled || option.disabled;

                return (
                    <button
                        key={option.value}
                        ref={(node) => {
                            buttonRefs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        disabled={optionDisabled}
                        onClick={() => setCurrentValue(option.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={normalizeClassName(`
                            flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold outline-none transition-all duration-150 ease-smooth
                            ${sizeClassName}
                            ${selected
                                ? "bg-surface text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"}
                            focus-visible:ring-4 focus-visible:ring-primary/15
                            disabled:cursor-not-allowed
                        `)}
                    >
                        {Icon ? (
                            <Icon
                                size={size === "sm" ? 15 : 17}
                                aria-hidden="true"
                                className={selected ? "text-primary" : ""}
                            />
                        ) : null}

                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default SegmentedControl;
