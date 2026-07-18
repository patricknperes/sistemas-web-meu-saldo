import { describe, expect, it } from "vitest";

import { changePasswordSchema, deleteAccountSchema, profileDetailsSchema } from "./profileSchemas.js";

describe("profileSchemas", () => {
    it("normaliza o e-mail ao validar o perfil", () => {
        const result = profileDetailsSchema.parse({ name: "Patrick Peres", email: "PATRICK@EXEMPLO.COM", currentPassword: "" });
        expect(result.email).toBe("patrick@exemplo.com");
    });

    it("rejeita confirmação de senha diferente", () => {
        const result = changePasswordSchema.safeParse({
            currentPassword: "Senha@123",
            newPassword: "NovaSenha@123",
            passwordConfirmation: "OutraSenha@123",
        });
        expect(result.success).toBe(false);
    });

    it("exige a confirmação textual da exclusão", () => {
        const result = deleteAccountSchema.safeParse({ password: "Senha@123", confirmation: "excluir" });
        expect(result.success).toBe(false);
    });
});
