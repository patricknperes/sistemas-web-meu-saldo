import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
});

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const shortMonthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function formatHistoryCurrency(value) {
    const cents = Number(value);
    return currencyFormatter.format(Number.isFinite(cents) ? cents / 100 : 0);
}

export function formatHistoryCompactCurrency(value) {
    const cents = Number(value);
    return compactCurrencyFormatter.format(Number.isFinite(cents) ? cents / 100 : 0);
}

export function formatHistoryDate(value, pattern = "dd/MM/yyyy") {
    if (!value) return "—";
    const date = value instanceof Date ? value : parseISO(String(value));
    if (!isValid(date)) return "—";
    return format(date, pattern, { locale: ptBR });
}

export function getHistoryPeriodLabel(filters) {
    if (filters.mode === "MONTH") {
        return `${monthNames[Number(filters.month) - 1] ?? "Mês"} de ${filters.year}`;
    }

    if (filters.mode === "YEAR") {
        return `Ano de ${filters.year}`;
    }

    if (filters.mode === "RANGE") {
        const start = filters.startDate ? formatHistoryDate(filters.startDate) : "início";
        const end = filters.endDate ? formatHistoryDate(filters.endDate) : "hoje";
        return `${start} até ${end}`;
    }

    return "Todo o histórico";
}

export function getHistoryTypeLabel(type) {
    if (type === "INCOME") return "Somente receitas";
    if (type === "EXPENSE") return "Somente despesas";
    return "Receitas e despesas";
}

export function buildHistoryApiFilters(filters, searchValue = filters.search) {
    const apiFilters = {
        ...(searchValue?.trim() ? { search: searchValue.trim() } : {}),
        ...(filters.type && filters.type !== "ALL" ? { type: filters.type } : {}),
        ...(filters.tagId ? { tagId: Number(filters.tagId) } : {}),
    };

    if (filters.mode === "MONTH") {
        apiFilters.month = Number(filters.month);
        apiFilters.year = Number(filters.year);
    } else if (filters.mode === "YEAR") {
        apiFilters.year = Number(filters.year);
    } else if (filters.mode === "RANGE") {
        if (filters.startDate) apiFilters.startDate = filters.startDate;
        if (filters.endDate) apiFilters.endDate = filters.endDate;
    }

    return apiFilters;
}

export function normalizeHistoryAnalytics(response) {
    const analytics = response?.analytics ?? response ?? {};
    const summary = analytics.summary ?? {};

    return {
        summary: {
            totalIncomeCents: Number(summary.totalIncomeCents) || 0,
            totalExpenseCents: Number(summary.totalExpenseCents) || 0,
            balanceCents: Number(summary.balanceCents) || 0,
            transactionCount: Number(summary.transactionCount) || 0,
            incomeCount: Number(summary.incomeCount) || 0,
            expenseCount: Number(summary.expenseCount) || 0,
            averageTransactionCents: Number(summary.averageTransactionCents) || 0,
        },
        monthly: Array.isArray(analytics.monthly) ? analytics.monthly : [],
        expenseCategories: Array.isArray(analytics.expenseCategories)
            ? analytics.expenseCategories
            : [],
    };
}

export function toHistoryChartData(monthly = []) {
    const spansMultipleYears = new Set(monthly.map((item) => item.year)).size > 1;

    return monthly.map((item) => ({
        ...item,
        label: spansMultipleYears
            ? `${shortMonthNames[Number(item.month) - 1] ?? "Mês"}/${String(item.year).slice(-2)}`
            : shortMonthNames[Number(item.month) - 1] ?? "Mês",
        fullLabel: `${monthNames[Number(item.month) - 1] ?? "Mês"} de ${item.year}`,
        income: (Number(item.totalIncomeCents) || 0) / 100,
        expense: (Number(item.totalExpenseCents) || 0) / 100,
        balance: (Number(item.balanceCents) || 0) / 100,
        cumulativeBalance: (Number(item.cumulativeBalanceCents) || 0) / 100,
    }));
}

export function getHistorySavingsRate(summary) {
    const income = Number(summary?.totalIncomeCents) || 0;
    const balance = Number(summary?.balanceCents) || 0;
    if (income <= 0) return 0;
    return Math.round((balance / income) * 1000) / 10;
}

export function buildHistoryPaginationItems(currentPage, totalPages) {
    const current = Math.max(1, Number(currentPage) || 1);
    const total = Math.max(0, Number(totalPages) || 0);
    if (total <= 1) return total === 1 ? [1] : [];
    const pages = new Set([1, total, current - 1, current, current + 1]);
    return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function getHistoryApiError(error, fallback = "Não foi possível carregar o histórico.") {
    const data = error?.response?.data;
    if (typeof data?.error === "string" && data.error) return data.error;
    if (typeof data?.message === "string" && data.message) return data.message;
    if (typeof error?.message === "string" && error.message) return error.message;
    return fallback;
}
