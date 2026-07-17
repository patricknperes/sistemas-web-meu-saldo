import {
    RiArrowDownLine,
    RiArrowUpLine,
} from "react-icons/ri";

import {
    mergeClasses,
    normalizeTransactionType,
} from "./transactionUtils.js";

const sizeClasses = {
    sm: "size-8 rounded-lg",
    md: "size-10 rounded-xl",
    lg: "size-12 rounded-xl",
};

const iconSizes = {
    sm: 15,
    md: 18,
    lg: 21,
};

function TransactionTypeMark({
    type = "EXPENSE",
    icon: CustomIcon,
    size = "md",
    subtle = false,
    className = "",
}) {
    const normalizedType = normalizeTransactionType(type);
    const Icon = CustomIcon || (
        normalizedType === "INCOME"
            ? RiArrowUpLine
            : RiArrowDownLine
    );
    const toneClasses = normalizedType === "INCOME"
        ? "border-success/20 bg-success-muted text-success-strong"
        : "border-danger/20 bg-danger-muted text-danger-strong";

    return (
        <span
            aria-hidden="true"
            className={mergeClasses(
                "inline-flex shrink-0 items-center justify-center border",
                sizeClasses[size] || sizeClasses.md,
                toneClasses,
                subtle ? "bg-opacity-60" : "",
                className
            )}
        >
            <Icon size={iconSizes[size] || iconSizes.md} />
        </span>
    );
}

export default TransactionTypeMark;
