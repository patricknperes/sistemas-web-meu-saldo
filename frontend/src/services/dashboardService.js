import { api } from "./api.js";

function buildSummaryParams(
    filters = {},
) {
    const params = {};

    const filterMode =
        filters.filterMode ??
        filters.mode;

    if (
        filterMode === "MONTH"
    ) {
        const month = Number(
            filters.month,
        );

        const year = Number(
            filters.year,
        );

        if (
            Number.isInteger(month) &&
            month >= 1 &&
            month <= 12
        ) {
            params.month = month;
        }

        if (
            Number.isInteger(year) &&
            year >= 1900 &&
            year <= 2100
        ) {
            params.year = year;
        }

        return params;
    }

    if (
        filterMode === "YEAR"
    ) {
        const year = Number(
            filters.year,
        );

        if (
            Number.isInteger(year) &&
            year >= 1900 &&
            year <= 2100
        ) {
            params.year = year;
        }

        return params;
    }

    /*
     * No modo ALL, nenhum parâmetro
     * é enviado. Assim, o backend
     * retorna todo o histórico.
     */
    return params;
}

async function getSummary(
    filters = {},
) {
    const params =
        buildSummaryParams(filters);

    const response = await api.get(
        "/dashboard/summary",
        {
            params,
        },
    );

    return response.data;
}

async function getHistory(year) {
    const normalizedYear =
        Number(year);

    const hasValidYear =
        Number.isInteger(
            normalizedYear,
        ) &&
        normalizedYear >= 1900 &&
        normalizedYear <= 2100;

    const response = await api.get(
        "/dashboard/history",
        {
            params: hasValidYear
                ? {
                      year:
                          normalizedYear,
                  }
                : {},
        },
    );

    return response.data;
}

function buildHistoryAnalyticsParams(filters = {}) {
    const params = {};

    for (const field of [
        "month",
        "year",
        "startDate",
        "endDate",
        "type",
        "tagId",
        "search",
    ]) {
        const value = filters[field];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            params[field] = value;
        }
    }

    return params;
}

async function getHistoryAnalytics(filters = {}) {
    const response = await api.get(
        "/dashboard/history/analytics",
        {
            params: buildHistoryAnalyticsParams(filters),
        },
    );

    return response.data;
}

async function exportCsv(filters = {}) {
    const params = buildSummaryParams(filters);

    const response = await api.get(
        "/dashboard/export/csv",
        {
            params,
            responseType: "blob",
            timeout: 30000,
        },
    );

    return response.data;
}

export const dashboardService = {
    getSummary,
    getHistory,
    getHistoryAnalytics,
    exportCsv,
};