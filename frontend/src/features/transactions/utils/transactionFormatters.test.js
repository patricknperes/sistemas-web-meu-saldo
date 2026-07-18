import { describe, expect, it } from "vitest";

import {
    buildPaginationItems,
    formatCurrencyCents,
    getIntervalLabel,
    getPeriodLabel,
} from "./transactionFormatters.js";

describe("transactionFormatters", () => {
    it("formata centavos em real brasileiro", () => {
        expect(formatCurrencyCents(190050)).toContain("1.900,50");
    });

    it("descreve períodos mensais", () => {
        expect(getPeriodLabel({ mode: "MONTH", month: 7, year: 2026 })).toBe("Julho de 2026");
    });

    it("cria paginação compacta", () => {
        expect(buildPaginationItems(5, 10)).toEqual([1, 4, 5, 6, 10]);
    });

    it("descreve intervalos recorrentes", () => {
        expect(getIntervalLabel(1)).toBe("Todo mês");
        expect(getIntervalLabel(3)).toBe("A cada 3 meses");
    });
});
