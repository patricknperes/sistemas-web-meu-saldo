import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from "lucide-react";

export const TRANSACTION_TYPES = Object.freeze({
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
});

export const transactionTypeConfig = Object.freeze({
    INCOME: Object.freeze({
        type: "INCOME",
        route: "/receitas",
        title: "Receitas",
        singular: "receita",
        plural: "receitas",
        article: "a",
        articlePlural: "as",
        icon: ArrowUpRight,
        valueIcon: CircleDollarSign,
        tone: "success",
        pageDescription: "Organize entradas, recebimentos e receitas recorrentes em um só lugar.",
        createButtonLabel: "Nova receita",
        createModalTitle: "Cadastrar receita",
        editModalTitle: "Editar receita",
        recurringCreateLabel: "Nova receita recorrente",
        recurringPageTitle: "Receitas recorrentes",
        searchPlaceholder: "Pesquisar receitas...",
        amountLabel: "Valor da receita",
        dateLabel: "Data de recebimento",
        descriptionPlaceholder: "Ex.: Salário, venda ou pagamento recebido",
        emptyTitle: "Nenhuma receita encontrada",
        emptyDescription: "Cadastre uma receita ou ajuste os filtros aplicados.",
        deleteTitle: "Excluir receita",
        deleteDescription: "A receita será removida permanentemente do histórico.",
        deleteConfirmationLabel: "Excluir receita",
        createSuccessMessage: "Receita cadastrada com sucesso.",
        updateSuccessMessage: "Receita atualizada com sucesso.",
        deleteSuccessMessage: "Receita excluída com sucesso.",
        recurringCreateSuccessMessage: "Receita recorrente cadastrada com sucesso.",
        recurringUpdateSuccessMessage: "Receita recorrente atualizada com sucesso.",
        recurringDeleteSuccessMessage: "Receita recorrente excluída com sucesso.",
        totalLabel: "Total de receitas",
        transactionLabel: "Entrada",
        transactionLabelPlural: "Entradas",
    }),
    EXPENSE: Object.freeze({
        type: "EXPENSE",
        route: "/despesas",
        title: "Despesas",
        singular: "despesa",
        plural: "despesas",
        article: "a",
        articlePlural: "as",
        icon: ArrowDownLeft,
        valueIcon: CircleDollarSign,
        tone: "danger",
        pageDescription: "Controle pagamentos, gastos e despesas recorrentes com clareza.",
        createButtonLabel: "Nova despesa",
        createModalTitle: "Cadastrar despesa",
        editModalTitle: "Editar despesa",
        recurringCreateLabel: "Nova despesa recorrente",
        recurringPageTitle: "Despesas recorrentes",
        searchPlaceholder: "Pesquisar despesas...",
        amountLabel: "Valor da despesa",
        dateLabel: "Data do pagamento",
        descriptionPlaceholder: "Ex.: Aluguel, mercado ou conta de internet",
        emptyTitle: "Nenhuma despesa encontrada",
        emptyDescription: "Cadastre uma despesa ou ajuste os filtros aplicados.",
        deleteTitle: "Excluir despesa",
        deleteDescription: "A despesa será removida permanentemente do histórico.",
        deleteConfirmationLabel: "Excluir despesa",
        createSuccessMessage: "Despesa cadastrada com sucesso.",
        updateSuccessMessage: "Despesa atualizada com sucesso.",
        deleteSuccessMessage: "Despesa excluída com sucesso.",
        recurringCreateSuccessMessage: "Despesa recorrente cadastrada com sucesso.",
        recurringUpdateSuccessMessage: "Despesa recorrente atualizada com sucesso.",
        recurringDeleteSuccessMessage: "Despesa recorrente excluída com sucesso.",
        totalLabel: "Total de despesas",
        transactionLabel: "Saída",
        transactionLabelPlural: "Saídas",
    }),
});

export function normalizeTransactionType(value) {
    if (typeof value !== "string") return "";
    const normalizedType = value.trim().toUpperCase();
    return Object.hasOwn(transactionTypeConfig, normalizedType) ? normalizedType : "";
}

export function isValidTransactionType(value) {
    return Boolean(normalizeTransactionType(value));
}

export function getTransactionTypeConfig(value) {
    const normalizedType = normalizeTransactionType(value);
    if (!normalizedType) throw new Error("O tipo da movimentação deve ser INCOME ou EXPENSE.");
    return transactionTypeConfig[normalizedType];
}
