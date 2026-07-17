import {
    RiCheckLine,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "../forms/fieldStyles.js";
import useControllableState from "../forms/useControllableState.js";

import {
    normalizeTagColor,
    TAG_COLOR_PRESETS,
} from "./tagUtils.js";

function TagColorPicker({
    value,
    defaultValue = TAG_COLOR_PRESETS[0].value,
    onChange,
    onValueChange,
    colors = TAG_COLOR_PRESETS,
    disabled = false,
    name = "tag-color",
    legend,
    className = "",
}) {
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange: (nextValue) => {
            onChange?.(nextValue);
            onValueChange?.(nextValue);
        },
    });
    const resolvedValue = normalizeTagColor(currentValue);

    return (
        <fieldset
            disabled={disabled}
            className={normalizeClassName(`min-w-0 ${className}`)}
        >
            {legend ? (
                <legend className="mb-2 text-body-sm font-semibold tracking-label text-foreground-soft">
                    {legend}
                </legend>
            ) : null}

            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend || "Cor da tag"}>
                {colors.map((colorOption) => {
                    const optionValue = normalizeTagColor(colorOption.value);
                    const selected = optionValue === resolvedValue;

                    return (
                        <label
                            key={colorOption.key || optionValue}
                            className={normalizeClassName(`
                                group relative inline-flex size-9 cursor-pointer
                                items-center justify-center rounded-lg border
                                bg-surface shadow-xs
                                transition-[border-color,box-shadow,transform]
                                hover:-translate-y-0.5 hover:border-primary/30
                                focus-within:outline-none focus-within:ring-4 focus-within:ring-primary/15
                                ${selected ? "border-primary shadow-sm" : "border-border"}
                                ${disabled ? "cursor-not-allowed opacity-50 hover:translate-y-0" : ""}
                            `)}
                            title={colorOption.label}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={optionValue}
                                checked={selected}
                                disabled={disabled}
                                aria-label={colorOption.label}
                                className="sr-only"
                                onChange={() => setCurrentValue(optionValue)}
                            />

                            <span
                                aria-hidden="true"
                                className="flex size-5 items-center justify-center rounded-full text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_20%)]"
                                style={{
                                    backgroundColor: optionValue,
                                }}
                            >
                                {selected ? (
                                    <RiCheckLine size={14} />
                                ) : null}
                            </span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

export default TagColorPicker;
