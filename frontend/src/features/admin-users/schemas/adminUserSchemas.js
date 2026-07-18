import { z } from "zod";

export const adminUserSchema = z.object({
    name: z.string().trim().min(2, "Informe o nome do usuário.").max(100, "O nome deve possuir no máximo 100 caracteres."),
    email: z.string().trim().min(1, "Informe o e-mail.").email("Informe um endereço de e-mail válido.").max(254, "O e-mail informado é muito longo.").transform((value) => value.toLowerCase()),
    role: z.enum(["USER", "ADMIN"], { error: "Selecione um nível de acesso válido." }),
    isActive: z.boolean(),
});
