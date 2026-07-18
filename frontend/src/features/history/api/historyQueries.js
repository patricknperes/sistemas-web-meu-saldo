import { dashboardService } from "../../../services/dashboardService.js";
import { tagService } from "../../../services/tagService.js";
import { transactionService } from "../../../services/transactionService.js";
import { normalizeHistoryAnalytics } from "../utils/historyFormatters.js";

export const historyKeys = {
    all: ["history"],
    analytics: (filters) => [...historyKeys.all, "analytics", filters],
    transactions: (filters) => [...historyKeys.all, "transactions", filters],
    tags: () => [...historyKeys.all, "tags"],
};

export async function fetchHistoryAnalytics(filters) {
    return normalizeHistoryAnalytics(await dashboardService.getHistoryAnalytics(filters));
}

export function fetchHistoryTransactions(filters) {
    return transactionService.list(filters);
}

export async function fetchHistoryTags() {
    const response = await tagService.list({ isActive: true });
    return response?.tags ?? response ?? [];
}
