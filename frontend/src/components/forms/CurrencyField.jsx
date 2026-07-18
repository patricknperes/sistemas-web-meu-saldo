import { forwardRef, useId } from "react";

import { NumericFormat } from "react-number-format";

import { cn } from "../../lib/cn.js";

const CurrencyField = forwardRef(function CurrencyField(
    { id, label, hint, error, className, inputClassName, onValueChange, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;

    return (
        <label htmlFor={inputId} className={cn("block min-w-0", className)}>
            {label && <span className="mb-2 block text-sm font-semibold text-foreground">{label}</span>}
            <span className={cn(
                "flex h-11 items-center rounded-control border bg-surface px-3 shadow-xs transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
                error ? "border-danger" : "border-border",
            )}>
                <NumericFormat
                    getInputRef={ref}
                    id={inputId}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    prefix="R$ "
                    inputMode="decimal"
                    aria-invalid={Boolean(error)}
                    aria-describedby={hint || error ? descriptionId : undefined}
                    className={cn("money-nums min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle-foreground", inputClassName)}
                    onValueChange={onValueChange}
                    {...props}
                />
            </span>
            {(error || hint) && (
                <span id={descriptionId} className={cn("mt-1.5 block text-xs", error ? "text-danger" : "text-subtle-foreground")}>
                    {error || hint}
                </span>
            )}
        </label>
    );
});

export default CurrencyField;
