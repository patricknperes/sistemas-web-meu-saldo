import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .min(1, "Informe seu endereço de e-mail.")
    .email("Informe um endereço de e-mail válido.")
    .max(254, "O e-mail informado é muito longo.")
    .transform((value) => value.toLowerCase());

export const passwordSchema = z
    .string()
    .min(8, "A senha deve possuir pelo menos 8 caracteres.")
    .max(128, "A senha deve possuir no máximo 128 caracteres.")
    .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
    .regex(/[0-9]/, "Inclua ao menos um número.")
    .regex(/[^A-Za-z0-9\s]/, "Inclua ao menos um caractere especial.")
    .refine((value) => !/\s/.test(value), "A senha não pode conter espaços.");

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Informe sua senha.").min(8, "A senha deve possuir pelo menos 8 caracteres."),
});

export const registerSchema = z
    .object({
        name: z.string().trim().min(2, "Informe seu nome completo.").max(120, "O nome deve possuir no máximo 120 caracteres."),
        email: emailSchema,
        password: passwordSchema,
        passwordConfirmation: z.string().min(1, "Confirme sua senha."),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "A confirmação não corresponde à senha.",
    });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        passwordConfirmation: z.string().min(1, "Confirme sua nova senha."),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "A confirmação não corresponde à nova senha.",
    });

export const passwordRules = [
    { label: "8 caracteres", test: (value) => value.length >= 8 },
    { label: "Letra maiúscula", test: (value) => /[A-Z]/.test(value) },
    { label: "Letra minúscula", test: (value) => /[a-z]/.test(value) },
    { label: "Número", test: (value) => /[0-9]/.test(value) },
    { label: "Caractere especial", test: (value) => /[^A-Za-z0-9\s]/.test(value) },
];
