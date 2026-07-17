import {
    forwardRef,
} from "react";

import {
    RiArrowDownSLine,
} from "react-icons/ri";

import {
    getInputClassName,
    mergeDescribedBy,
    normalizeClassName,
} from "./fieldStyles.js";

import {
    useFormFieldContext,
} from "./FormFieldContext.js";

const Select = forwardRef(function Select({
    id,
    size = "md",
    status,
    options,
    placeholder,
    leadingIcon,
    className = "",
    wrapperClassName = "",
    children,
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

    return (
        <div
            className={normalizeClassName(`
                relative min-w-0
                ${wrapperClassName}
            `)}
        >
            {leadingIcon ? (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-center text-muted-foreground"
                >
                    {leadingIcon}
                </span>
            ) : null}

            <select
                ref={ref}
                id={resolvedId}
                required={required ?? field?.required}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                className={getInputClassName({
                    size,
                    status: resolvedStatus,
                    invalid,
                    hasLeading: Boolean(leadingIcon),
                    hasTrailing: true,
                    className: normalizeClassName(`
                        appearance-none cursor-pointer
                        ${className}
                    `),
                })}
                {...props}
            >
                {placeholder ? (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                ) : null}

                {options
                    ? options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))
                    : children}
            </select>

            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
            >
                <RiArrowDownSLine size={19} />
            </span>
        </div>
    );
});

export default Select;
