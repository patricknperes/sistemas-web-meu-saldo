import { forwardRef, useId } from "react";

import { cn } from "../../lib/cn.js";

const Input = forwardRef(function Input(
    {
        id,
        label,
        hint,
        error,
        leadingIcon: LeadingIcon,
        trailingElement,
        className,
        inputClassName,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;

    return (
        <label htmlFor={inputId} className={cn("block min-w-0", className)}>
            {label && (
                <span className="mb-2 block text-sm font-semibold text-foreground">
                    {label}
                </span>
            )}

            <span
                className={cn(
                    "flex h-11 min-w-0 items-center gap-2 rounded-control border bg-surface px-3 shadow-xs transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
                    error ? "border-danger" : "border-border",
                )}
            >
                {LeadingIcon && (
                    <LeadingIcon
                        size={18}
                        aria-hidden="true"
                        className="shrink-0 text-subtle-foreground"
                    />
                )}

                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    aria-describedby={hint || error ? descriptionId : undefined}
                    className={cn(
                        "min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle-foreground",
                        inputClassName,
                    )}
                    {...props}
                />

                {trailingElement}
            </span>

            {(error || hint) && (
                <span
                    id={descriptionId}
                    className={cn(
                        "mt-1.5 block text-xs",
                        error ? "text-danger" : "text-subtle-foreground",
                    )}
                >
                    {error || hint}
                </span>
            )}
        </label>
    );
});

export default Input;
