import {
    RiArrowDownCircleLine,
    RiArrowUpCircleLine,
    RiMoneyDollarCircleLine,
} from "react-icons/ri";

export const TRANSACTION_TYPES =
    Object.freeze({
        INCOME: "INCOME",
        EXPENSE: "EXPENSE",
    });

export const transactionTypeConfig =
    Object.freeze({
        INCOME: Object.freeze({
            type: "INCOME",

            route: "/receitas",

            title: "Receitas",
            singular: "receita",
            plural: "receitas",

            article: "a",
            articlePlural: "as",

            icon:
                RiArrowUpCircleLine,

            valueIcon:
                RiMoneyDollarCircleLine,

            pageDescription:
                "Acompanhe e organize todas as entradas financeiras.",

            createButtonLabel:
                "Nova receita",

            createModalTitle:
                "Cadastrar receita",

            editModalTitle:
                "Editar receita",

            recurringCreateLabel:
                "Nova receita recorrente",

            recurringPageTitle:
                "Receitas recorrentes",

            searchPlaceholder:
                "Pesquisar receitas...",

            amountLabel:
                "Valor da receita",

            dateLabel:
                "Data de recebimento",

            descriptionPlaceholder:
                "Ex.: Salário, venda ou pagamento recebido",

            emptyTitle:
                "Nenhuma receita encontrada",

            emptyDescription:
                "As receitas cadastradas aparecerão aqui.",

            deleteTitle:
                "Excluir receita",

            deleteDescription:
                "Essa receita será removida permanentemente do histórico.",

            deleteConfirmationLabel:
                "Excluir receita",

            createSuccessMessage:
                "Receita cadastrada com sucesso.",

            updateSuccessMessage:
                "Receita atualizada com sucesso.",

            deleteSuccessMessage:
                "Receita excluída com sucesso.",

            recurringCreateSuccessMessage:
                "Receita recorrente cadastrada com sucesso.",

            recurringUpdateSuccessMessage:
                "Receita recorrente atualizada com sucesso.",

            recurringDeleteSuccessMessage:
                "Receita recorrente excluída com sucesso.",

            totalLabel:
                "Total de receitas",

            transactionLabel:
                "Entrada",

            transactionLabelPlural:
                "Entradas",

            accentClasses:
                "text-emerald-600 dark:text-emerald-400",

            softBackgroundClasses:
                "bg-emerald-50 dark:bg-emerald-950/30",

            borderClasses:
                "border-emerald-200 dark:border-emerald-900/60",

            badgeClasses:
                "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-400/20",
        }),

        EXPENSE: Object.freeze({
            type: "EXPENSE",

            route: "/despesas",

            title: "Despesas",
            singular: "despesa",
            plural: "despesas",

            article: "a",
            articlePlural: "as",

            icon:
                RiArrowDownCircleLine,

            valueIcon:
                RiMoneyDollarCircleLine,

            pageDescription:
                "Acompanhe e organize todas as suas saídas financeiras.",

            createButtonLabel:
                "Nova despesa",

            createModalTitle:
                "Cadastrar despesa",

            editModalTitle:
                "Editar despesa",

            recurringCreateLabel:
                "Nova despesa recorrente",

            recurringPageTitle:
                "Despesas recorrentes",

            searchPlaceholder:
                "Pesquisar despesas...",

            amountLabel:
                "Valor da despesa",

            dateLabel:
                "Data do pagamento",

            descriptionPlaceholder:
                "Ex.: Aluguel, mercado ou conta de internet",

            emptyTitle:
                "Nenhuma despesa encontrada",

            emptyDescription:
                "As despesas cadastradas aparecerão aqui.",

            deleteTitle:
                "Excluir despesa",

            deleteDescription:
                "Essa despesa será removida permanentemente do histórico.",

            deleteConfirmationLabel:
                "Excluir despesa",

            createSuccessMessage:
                "Despesa cadastrada com sucesso.",

            updateSuccessMessage:
                "Despesa atualizada com sucesso.",

            deleteSuccessMessage:
                "Despesa excluída com sucesso.",

            recurringCreateSuccessMessage:
                "Despesa recorrente cadastrada com sucesso.",

            recurringUpdateSuccessMessage:
                "Despesa recorrente atualizada com sucesso.",

            recurringDeleteSuccessMessage:
                "Despesa recorrente excluída com sucesso.",

            totalLabel:
                "Total de despesas",

            transactionLabel:
                "Saída",

            transactionLabelPlural:
                "Saídas",

            accentClasses:
                "text-rose-600 dark:text-rose-400",

            softBackgroundClasses:
                "bg-rose-50 dark:bg-rose-950/30",

            borderClasses:
                "border-rose-200 dark:border-rose-900/60",

            badgeClasses:
                "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-400/20",
        }),
    });

export function normalizeTransactionType(
    value,
) {
    if (typeof value !== "string") {
        return "";
    }

    const normalizedType =
        value.trim().toUpperCase();

    return Object.hasOwn(
        transactionTypeConfig,
        normalizedType,
    )
        ? normalizedType
        : "";
}

export function isValidTransactionType(
    value,
) {
    return Boolean(
        normalizeTransactionType(value),
    );
}

export function getTransactionTypeConfig(
    value,
) {
    const normalizedType =
        normalizeTransactionType(value);

    if (!normalizedType) {
        throw new Error(
            "O tipo da movimentação deve ser INCOME ou EXPENSE.",
        );
    }

    return transactionTypeConfig[
        normalizedType
    ];
}