import {
    forwardRef,
    useMemo,
    useState,
} from "react";

import Input from "./Input.jsx";

function normalizeNumericValue(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? value
            : null;
    }

    const source = String(value).trim();

    const normalized = Number(
        /^-?\d+(?:\.\d+)?$/.test(source)
            ? source
            : source
                  .replace(/\./g, "")
                  .replace(",", ".")
    );

    return Number.isFinite(normalized)
        ? normalized
        : null;
}

function parseCurrencyText(
    value,
    allowNegative,
    fractionDigits
) {
    const source = String(value ?? "");
    const negative = allowNegative && source.includes("-");
    const digits = source.replace(/\D/g, "");

    if (!digits) {
        return null;
    }

    const divisor = 10 ** fractionDigits;
    const amount = Number(digits) / divisor;

    return negative
        ? amount * -1
        : amount;
}

const CurrencyInput = forwardRef(function CurrencyInput({
    value,
    defaultValue = null,
    onChange,
    onValueChange,
    locale = "pt-BR",
    currency = "BRL",
    allowNegative = false,
    fractionDigits = 2,
    currencyLabel,
    ...props
}, ref) {
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(() =>
        normalizeNumericValue(defaultValue)
    );

    const numericValue = controlled
        ? normalizeNumericValue(value)
        : internalValue;

    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            }),
        [fractionDigits, locale]
    );

    const symbol = useMemo(() => {
        if (currencyLabel) {
            return currencyLabel;
        }

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            currencyDisplay: "narrowSymbol",
        })
            .formatToParts(0)
            .find((part) => part.type === "currency")
            ?.value || currency;
    }, [currency, currencyLabel, locale]);

    const formattedValue = numericValue === null
        ? ""
        : formatter.format(numericValue);

    function handleChange(event) {
        const nextValue = parseCurrencyText(
            event.target.value,
            allowNegative,
            fractionDigits
        );

        if (!controlled) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
        onChange?.(event, nextValue);
    }

    return (
        <Input
            {...props}
            ref={ref}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={formattedValue}
            onChange={handleChange}
            leadingText={symbol}
        />
    );
});

export default CurrencyInput;
