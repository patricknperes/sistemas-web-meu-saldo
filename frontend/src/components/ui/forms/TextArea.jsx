import {
    forwardRef,
    useState,
} from "react";

import {
    getTextAreaClassName,
    mergeDescribedBy,
} from "./fieldStyles.js";

import {
    useFormFieldContext,
} from "./FormFieldContext.js";

const TextArea = forwardRef(function TextArea({
    id,
    size = "md",
    status,
    resize = "vertical",
    className = "",
    showCount = false,
    value,
    defaultValue,
    maxLength,
    onChange,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    required,
    ...props
}, ref) {
    const field = useFormFieldContext();

    const resolvedId = id || field?.controlId;
    const invalid = ariaInvalid === true || field?.invalid;
    const resolvedStatus = status || field?.status || "default";
    const describedBy = mergeDescribedBy(
        ariaDescribedBy,
        field?.messageId
    );

    const [uncontrolledLength, setUncontrolledLength] = useState(
        String(defaultValue ?? "").length
    );

    const currentLength = value !== undefined
        ? String(value ?? "").length
        : uncontrolledLength;

    function handleChange(event) {
        if (value === undefined) {
            setUncontrolledLength(event.target.value.length);
        }

        onChange?.(event);
    }

    return (
        <div className="min-w-0">
            <textarea
                ref={ref}
                id={resolvedId}
                value={value}
                defaultValue={defaultValue}
                maxLength={maxLength}
                onChange={handleChange}
                required={required ?? field?.required}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                className={getTextAreaClassName({
                    size,
                    status: resolvedStatus,
                    invalid,
                    resize,
                    className,
                })}
                {...props}
            />

            {showCount && maxLength ? (
                <div className="mt-1.5 flex justify-end text-caption text-muted-foreground">
                    <span className="numeric-value">
                        {currentLength}/{maxLength}
                    </span>
                </div>
            ) : null}
        </div>
    );
});

export default TextArea;
