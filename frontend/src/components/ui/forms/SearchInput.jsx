import {
    forwardRef,
    useState,
} from "react";

import {
    RiCloseLine,
    RiSearch2Line,
} from "react-icons/ri";

import Input from "./Input.jsx";

const SearchInput = forwardRef(function SearchInput({
    value,
    defaultValue = "",
    onChange,
    onValueChange,
    onClear,
    clearable = true,
    clearLabel = "Limpar pesquisa",
    ...props
}, ref) {
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const currentValue = controlled
        ? value ?? ""
        : internalValue;

    function handleChange(event) {
        if (!controlled) {
            setInternalValue(event.target.value);
        }

        onValueChange?.(event.target.value);
        onChange?.(event);
    }

    function handleClear() {
        if (!controlled) {
            setInternalValue("");
        }

        onValueChange?.("");
        onClear?.();
    }

    const showClearButton = clearable && String(currentValue || "").length > 0;

    return (
        <Input
            {...props}
            ref={ref}
            type="search"
            value={currentValue}
            onChange={handleChange}
            leadingIcon={
                <RiSearch2Line
                    size={18}
                    aria-hidden="true"
                />
            }
            trailingElement={
                showClearButton ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label={clearLabel}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                    >
                        <RiCloseLine
                            size={17}
                            aria-hidden="true"
                        />
                    </button>
                ) : null
            }
        />
    );
});

export default SearchInput;
