import CurrencyValue from "../finance/CurrencyValue.jsx";

import {
    mergeClasses,
    resolveTransactionAmount,
    resolveTransactionTone,
} from "./transactionUtils.js";

function TransactionAmount({
    amount,
    amountCents,
    type = "EXPENSE",
    size = "md",
    compact = false,
    showSign = true,
    suffix,
    className = "",
}) {
    const value = resolveTransactionAmount({
        amount,
        amountCents,
        type,
        signed: true,
    });

    return (
        <CurrencyValue
            value={value}
            tone={resolveTransactionTone(type)}
            size={size}
            compact={compact}
            showPositiveSign={showSign}
            showNegativeSign={showSign}
            suffix={suffix}
            className={mergeClasses("justify-end", className)}
        />
    );
}

export default TransactionAmount;
