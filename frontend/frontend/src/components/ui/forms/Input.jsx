import {
    forwardRef,
} from "react";

import {
    getInputClassName,
    mergeDescribedBy,
    normalizeClassName,
} from "./fieldStyles.js";

import {
    useFormFieldContext,
} from "./FormFieldContext.js";

const Input = forwardRef(function Input({
    id,
    size = "md",
    status,
    leadingIcon,
    leadingText,
    trailingElement,
    className = "",
    wrapperClassName = "",
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

    const hasLeading = Boolean(leadingIcon || leadingText);
    const hasTrailing = Boolean(trailingElement);

    return (
        <div
            className={normalizeClassName(`
                relative min-w-0
                ${wrapperClassName}
            `)}
        >
            {hasLeading ? (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground"
                >
                    {leadingIcon || (
                        <span className="text-caption font-semibold">
                            {leadingText}
                        </span>
                    )}
                </span>
            ) : null}

            <input
                ref={ref}
                id={resolvedId}
                required={required ?? field?.required}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                className={getInputClassName({
                    size,
                    status: resolvedStatus,
                    invalid,
                    hasLeading,
                    hasTrailing,
                    className,
                })}
                {...props}
            />

            {hasTrailing ? (
                <span className="absolute inset-y-0 right-0 flex w-10 items-center justify-center">
                    {trailingElement}
                </span>
            ) : null}
        </div>
    );
});

export default Input;
