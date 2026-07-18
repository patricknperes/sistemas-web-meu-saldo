import { dashboardService } from "../../../services/dashboardService.js";

export const dashboardKeys = {
    all: ["dashboard"],
    summary: (filters) => [...dashboardKeys.all, "summary", filters],
    history: (year) => [...dashboardKeys.all, "history", year ?? "all"],
};

export async function fetchDashboardSummary(filters) {
    const response = await dashboardService.getSummary(filters);
    return response?.summary ?? response;
}

export async function fetchDashboardHistory(year) {
    const response = await dashboardService.getHistory(year);
    return response?.history ?? response ?? [];
}

export async function exportDashboardCsv(filters) {
    return dashboardService.exportCsv(filters);
}
