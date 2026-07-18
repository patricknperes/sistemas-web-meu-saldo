import { z } from "zod";

const commonFields = {
    description: z.string().trim().min(2, "Informe uma descrição com pelo menos 2 caracteres.").max(150, "Use no máximo 150 caracteres."),
    amountCents: z.coerce.number().int().positive("Informe um valor maior que zero.").max(2147483647, "O valor informado é muito alto."),
    category: z.string().trim().max(80, "Use no máximo 80 caracteres.").optional().or(z.literal("")),
    notes: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional().or(z.literal("")),
    tagIds: z.array(z.number().int().positive()).max(10, "Selecione no máximo 10 tags.").default([]),
};

export const transactionSchema = z.object({
    ...commonFields,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida."),
});

export const recurringTransactionSchema = z.object({
    ...commonFields,
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data inicial."),
    endDate: z.string().optional().or(z.literal("")),
    dayOfMonth: z.coerce.number().int().min(1, "Informe um dia entre 1 e 31.").max(31, "Informe um dia entre 1 e 31."),
    intervalMonths: z.coerce.number().int().min(1, "O intervalo mínimo é de 1 mês.").max(60, "O intervalo máximo é de 60 meses."),
}).superRefine((data, context) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
        context.addIssue({
            code: "custom",
            path: ["endDate"],
            message: "A data final não pode ser anterior à data inicial.",
        });
    }
});

export const tagSchema = z.object({
    name: z.string().trim().min(2, "Informe pelo menos 2 caracteres.").max(40, "Use no máximo 40 caracteres."),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor hexadecimal válida."),
    scope: z.enum(["INCOME", "EXPENSE", "BOTH"]),
});
