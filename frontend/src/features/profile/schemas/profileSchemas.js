import { z } from "zod";

import { passwordSchema } from "../../auth/schemas/authSchemas.js";

const emailSchema = z
    .string()
    .trim()
    .min(1, "Informe seu endereço de e-mail.")
    .email("Informe um endereço de e-mail válido.")
    .max(254, "O e-mail informado é muito longo.")
    .transform((value) => value.toLowerCase());

export const profileDetailsSchema = z.object({
    name: z.string().trim().min(2, "Informe seu nome completo.").max(100, "O nome deve possuir no máximo 100 caracteres."),
    email: emailSchema,
    currentPassword: z.string().max(128, "A senha informada é muito longa.").optional().or(z.literal("")),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Informe sua senha atual."),
        newPassword: passwordSchema,
        passwordConfirmation: z.string().min(1, "Confirme sua nova senha."),
    })
    .refine((data) => data.newPassword === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "A confirmação não corresponde à nova senha.",
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        path: ["newPassword"],
        message: "A nova senha precisa ser diferente da senha atual.",
    });

export const deleteAccountSchema = z.object({
    password: z.string().min(1, "Informe sua senha para confirmar."),
    confirmation: z.literal("EXCLUIR", {
        error: "Digite EXCLUIR para confirmar a operação.",
    }),
});
