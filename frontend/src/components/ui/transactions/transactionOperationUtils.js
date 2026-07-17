export const emptyTransactionFilters = Object.freeze({
    type: "all",
    origin: "all",
    status: "all",
    startDate: "",
    endDate: "",
    minAmount: null,
    maxAmount: null,
    tagIds: [],
});

export function countTransactionFilters(value = {}) {
    return [
        value.type && value.type !== "all",
        value.origin && value.origin !== "all",
        value.status && value.status !== "all",
        Boolean(value.startDate),
        Boolean(value.endDate),
        value.minAmount !== null && value.minAmount !== undefined && value.minAmount !== "",
        value.maxAmount !== null && value.maxAmount !== undefined && value.maxAmount !== "",
        Array.isArray(value.tagIds) && value.tagIds.length > 0,
    ].filter(Boolean).length;
}
