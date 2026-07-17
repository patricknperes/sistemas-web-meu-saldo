function mergeClassNames(...values) {
    return values
        .flat()
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function createPaginationItems(currentPage, totalPages, siblingCount = 1) {
    const normalizedTotal = Math.max(1, Number(totalPages) || 1);
    const normalizedCurrent = clamp(Number(currentPage) || 1, 1, normalizedTotal);
    const normalizedSiblingCount = Math.max(0, Number(siblingCount) || 0);
    const visibleSlots = normalizedSiblingCount * 2 + 5;

    if (normalizedTotal <= visibleSlots) {
        return Array.from({ length: normalizedTotal }, (_, index) => index + 1);
    }

    const leftSibling = Math.max(normalizedCurrent - normalizedSiblingCount, 1);
    const rightSibling = Math.min(
        normalizedCurrent + normalizedSiblingCount,
        normalizedTotal
    );

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < normalizedTotal - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftItemCount = 3 + normalizedSiblingCount * 2;
        const leftRange = Array.from(
            { length: leftItemCount },
            (_, index) => index + 1
        );

        return [...leftRange, "ellipsis-right", normalizedTotal];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
        const rightItemCount = 3 + normalizedSiblingCount * 2;
        const rightRangeStart = normalizedTotal - rightItemCount + 1;
        const rightRange = Array.from(
            { length: rightItemCount },
            (_, index) => rightRangeStart + index
        );

        return [1, "ellipsis-left", ...rightRange];
    }

    const middleRange = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, index) => leftSibling + index
    );

    return [
        1,
        "ellipsis-left",
        ...middleRange,
        "ellipsis-right",
        normalizedTotal,
    ];
}

export {
    clamp,
    createPaginationItems,
    mergeClassNames,
};
