import { describe, expect, it } from "vitest";

import {
    buildHistoryApiFilters,
    buildHistoryPaginationItems,
    getHistoryPeriodLabel,
    getHistorySavingsRate,
    normalizeHistoryAnalytics,
    toHistoryChartData,
} from "./historyFormatters.js";

describe("historyFormatters", () => {
    it("converte filtros de mês para a API", () => {
        expect(buildHistoryApiFilters({
            mode: "MONTH",
            month: 7,
            year: 2026,
            type: "ALL",
            tagId: "",
            search: " mercado ",
        })).toEqual({ month: 7, year: 2026, search: "mercado" });
    });

    it("formata o período selecionado", () => {
        expect(getHistoryPeriodLabel({ mode: "YEAR", year: 2026 })).toBe("Ano de 2026");
    });

    it("normaliza uma resposta vazia", () => {
        expect(normalizeHistoryAnalytics({})).toEqual({
            summary: {
                totalIncomeCents: 0,
                totalExpenseCents: 0,
                balanceCents: 0,
                transactionCount: 0,
                incomeCount: 0,
                expenseCount: 0,
                averageTransactionCents: 0,
            },
            monthly: [],
            expenseCategories: [],
        });
    });

    it("gera dados monetários para gráficos", () => {
        expect(toHistoryChartData([{ year: 2026, month: 7, totalIncomeCents: 10000, totalExpenseCents: 4000, balanceCents: 6000, cumulativeBalanceCents: 6000 }])[0]).toMatchObject({
            label: "Jul",
            income: 100,
            expense: 40,
            balance: 60,
            cumulativeBalance: 60,
        });
    });

    it("calcula a taxa de economia", () => {
        expect(getHistorySavingsRate({ totalIncomeCents: 10000, balanceCents: 2500 })).toBe(25);
    });

    it("mantém páginas essenciais da paginação", () => {
        expect(buildHistoryPaginationItems(5, 10)).toEqual([1, 4, 5, 6, 10]);
    });
});
