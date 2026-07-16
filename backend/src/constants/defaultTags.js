export const DEFAULT_TAGS = Object.freeze([
  {
    name: "Alimentação",
    normalizedName: "alimentacao",
    color: "#F97316",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Casa",
    normalizedName: "casa",
    color: "#8B5CF6",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Saúde",
    normalizedName: "saude",
    color: "#EF4444",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Educação",
    normalizedName: "educacao",
    color: "#3B82F6",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Transporte",
    normalizedName: "transporte",
    color: "#06B6D4",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Lazer",
    normalizedName: "lazer",
    color: "#EC4899",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Assinaturas",
    normalizedName: "assinaturas",
    color: "#6366F1",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Contas",
    normalizedName: "contas",
    color: "#64748B",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Compras",
    normalizedName: "compras",
    color: "#D946EF",
    scope: "EXPENSE",
    isDefault: true,
  },
  {
    name: "Salário",
    normalizedName: "salario",
    color: "#10B981",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Freelance",
    normalizedName: "freelance",
    color: "#14B8A6",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Investimentos",
    normalizedName: "investimentos",
    color: "#22C55E",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Vendas",
    normalizedName: "vendas",
    color: "#84CC16",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Benefícios",
    normalizedName: "beneficios",
    color: "#0EA5E9",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Presente",
    normalizedName: "presente",
    color: "#F43F5E",
    scope: "INCOME",
    isDefault: true,
  },
  {
    name: "Fixo",
    normalizedName: "fixo",
    color: "#475569",
    scope: "BOTH",
    isDefault: true,
  },
  {
    name: "Pessoal",
    normalizedName: "pessoal",
    color: "#A855F7",
    scope: "BOTH",
    isDefault: true,
  },
  {
    name: "Trabalho",
    normalizedName: "trabalho",
    color: "#2563EB",
    scope: "BOTH",
    isDefault: true,
  },
  {
    name: "Outros",
    normalizedName: "outros",
    color: "#78716C",
    scope: "BOTH",
    isDefault: true,
  },
]);

export function getDefaultTags() {
  return DEFAULT_TAGS.map((tag) => ({
    ...tag,
  }));
}

export function getDefaultTagsByScope(scope) {
  if (
    !["INCOME", "EXPENSE", "BOTH"].includes(
      scope
    )
  ) {
    return getDefaultTags();
  }

  return DEFAULT_TAGS
    .filter(
      (tag) =>
        tag.scope === scope ||
        tag.scope === "BOTH"
    )
    .map((tag) => ({
      ...tag,
    }));
}