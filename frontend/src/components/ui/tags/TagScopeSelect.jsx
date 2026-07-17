import SegmentedControl from "../forms/SegmentedControl.jsx";

import {
    normalizeTagScope,
} from "./tagUtils.js";

const defaultOptions = [
    {
        value: "INCOME",
        label: "Receitas",
    },
    {
        value: "EXPENSE",
        label: "Despesas",
    },
    {
        value: "BOTH",
        label: "Ambos",
    },
];

function TagScopeSelect({
    value,
    defaultValue = "BOTH",
    onChange,
    onValueChange,
    options = defaultOptions,
    disabled = false,
    fullWidth = true,
    ariaLabel = "Escopo da tag",
    className = "",
}) {
    return (
        <SegmentedControl
            aria-label={ariaLabel}
            value={value === undefined ? undefined : normalizeTagScope(value)}
            defaultValue={normalizeTagScope(defaultValue)}
            onValueChange={(nextValue) => {
                onChange?.(nextValue);
                onValueChange?.(nextValue);
            }}
            options={options}
            disabled={disabled}
            fullWidth={fullWidth}
            className={className}
        />
    );
}

export default TagScopeSelect;
