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

export const dashboardService = {
    getSummary,
    getHistory,
};