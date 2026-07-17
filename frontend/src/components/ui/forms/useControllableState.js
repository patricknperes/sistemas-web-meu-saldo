import {
    useState,
} from "react";

function useControllableState({
    value,
    defaultValue,
    onChange,
}) {
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const currentValue = controlled
        ? value
        : internalValue;

    function setValue(nextValue) {
        const resolvedValue = typeof nextValue === "function"
            ? nextValue(currentValue)
            : nextValue;

        if (!controlled) {
            setInternalValue(resolvedValue);
        }

        onChange?.(resolvedValue);
    }

    return [currentValue, setValue];
}

export default useControllableState;
