import {
    buildChartData,
    DASHBOARD_FILTER_MODES,
    getDashboardPeriodLabel,
    getFinancialIndicators,
} from "./dashboardFormatters.js";

describe("dashboardFormatters", () => {
    it("cria os doze meses do ano mesmo quando não existem lançamentos", () => {
        const data = buildChartData([
            {
                key: "2026-01",
                year: 2026,
                month: 1,
                totalIncomeCents: 200000,
                totalExpenseCents: 50000,
                balanceCents: 150000,
            },
        ], { filterMode: DASHBOARD_FILTER_MODES.YEAR, year: 2026, month: 1 });

        expect(data).toHaveLength(12);
        expect(data[0]).toMatchObject({ label: "Jan", income: 2000, expense: 500, balance: 1500 });
        expect(data[1]).toMatchObject({ label: "Fev", income: 0, expense: 0 });
    });

    it("formata o rótulo do período e calcula os indicadores", () => {
        expect(getDashboardPeriodLabel({ filterMode: "MONTH", month: 7, year: 2026 })).toBe("Julho de 2026");

        expect(getFinancialIndicators({
            totalIncomeCents: 100000,
            totalExpenseCents: 70000,
            balanceCents: 30000,
            transactionCount: 10,
        })).toMatchObject({ savingsRate: 30, expenseRatio: 70, averageTransactionCents: 17000, healthTone: "success" });
    });
});
