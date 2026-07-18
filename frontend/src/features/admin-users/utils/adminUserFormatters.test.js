import { describe, expect, it } from "vitest";

import { buildAdminPaginationItems, getAdminUserAuthLabel, isSameUser } from "./adminUserFormatters.js";

describe("adminUserFormatters", () => {
    it("compara identificadores numéricos e textuais", () => {
        expect(isSameUser(10, "10")).toBe(true);
        expect(isSameUser(10, 11)).toBe(false);
    });

    it("resume os métodos de autenticação", () => {
        expect(getAdminUserAuthLabel({ password: true, google: true })).toBe("Senha e Google");
        expect(getAdminUserAuthLabel({ google: true })).toBe("Google");
    });

    it("monta uma paginação compacta", () => {
        expect(buildAdminPaginationItems(5, 10)).toEqual([1, 4, 5, 6, 10]);
    });
});
