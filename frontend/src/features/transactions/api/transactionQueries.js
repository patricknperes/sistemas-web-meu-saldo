import { recurringTransactionService } from "../../../services/recurringTransactionService.js";
import { tagService } from "../../../services/tagService.js";
import { transactionService } from "../../../services/transactionService.js";

export const transactionKeys = {
    all: ["transactions"],
    list: (type, filters) => [...transactionKeys.all, "list", type, filters],
    recurring: (type, filters) => [...transactionKeys.all, "recurring", type, filters],
    tags: (type) => [...transactionKeys.all, "tags", type],
};

export function fetchTransactions(type, filters) {
    return transactionService.listByType(type, filters);
}

export function fetchRecurringTransactions(type, filters) {
    return recurringTransactionService.listByType(type, filters);
}

export async function fetchTransactionTags(type) {
    const response = await tagService.listForTransactionType(type, { isActive: true });
    return response?.tags ?? response ?? [];
}
