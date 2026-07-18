import { formatCurrency } from "../../../utils/formatCurrency.js";

export const DASHBOARD_FILTER_MODES = Object.freeze({
    MONTH: "MONTH",
    YEAR: "YEAR",
    ALL: "ALL",
});

export const MONTHS = Object.freeze([
    { value: 1, label: "Janeiro", shortLabel: "Jan" },
    { value: 2, label: "Fevereiro", shortLabel: "Fev" },
    { value: 3, label: "Março", shortLabel: "Mar" },
    { value: 4, label: "Abril", shortLabel: "Abr" },
    { value: 5, label: "Maio", shortLabel: "Mai" },
    { value: 6, label: "Junho", shortLabel: "Jun" },
    { value: 7, label: "Julho", shortLabel: "Jul" },
    { value: 8, label: "Agosto", shortLabel: "Ago" },
    { value: 9, label: "Setembro", shortLabel: "Set" },
    { value: 10, label: "Outubro", shortLabel: "Out" },
    { value: 11, label: "Novembro", shortLabel: "Nov" },
    { value: 12, label: "Dezembro", shortLabel: "Dez" },
]);

export function normalizeDashboardFilters(filters = {}) {
    const now = new Date();
    const filterMode = Object.values(DASHBOARD_FILTER_MODES).includes(filters.filterMode)
        ? filters.filterMode
        : DASHBOARD_FILTER_MODES.MONTH;
    const month = Number(filters.month);
    const year = Number(filters.year);

    return {
        filterMode,
        month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : now.getMonth() + 1,
        year: Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : now.getFullYear(),
    };
}

export function getDashboardPeriodLabel(filters) {
    const normalized = normalizeDashboardFilters(filters);

    if (normalized.filterMode === DASHBOARD_FILTER_MODES.MONTH) {
        const month = MONTHS.find((item) => item.value === normalized.month)?.label ?? "Mês";
        return `${month} de ${normalized.year}`;
    }

    if (normalized.filterMode === DASHBOARD_FILTER_MODES.YEAR) {
        return `Ano de ${normalized.year}`;
    }

    return "Todo o histórico";
}

export function getDashboardHistoryYear(filters) {
    const normalized = normalizeDashboardFilters(filters);
    return normalized.filterMode === DASHBOARD_FILTER_MODES.ALL ? undefined : normalized.year;
}

export function buildChartData(history = [], filters = {}) {
    const normalized = normalizeDashboardFilters(filters);
    const byKey = new Map((history ?? []).map((item) => [item.key, item]));
    let records;

    if (normalized.filterMode === DASHBOARD_FILTER_MODES.ALL) {
        records = [...(history ?? [])]
            .sort((first, second) => first.key.localeCompare(second.key))
            .slice(-18);
    } else {
        records = MONTHS.map((month) => {
            const key = `${normalized.year}-${String(month.value).padStart(2, "0")}`;
            return byKey.get(key) ?? {
                key,
                year: normalized.year,
                month: month.value,
                totalIncomeCents: 0,
                totalExpenseCents: 0,
                balanceCents: 0,
                transactionCount: 0,
                incomeCount: 0,
                expenseCount: 0,
            };
        });
    }

    let cumulativeBalanceCents = 0;

    return records.map((item) => {
        cumulativeBalanceCents += Number(item.balanceCents) || 0;
        const month = MONTHS.find((entry) => entry.value === Number(item.month));
        const label = normalized.filterMode === DASHBOARD_FILTER_MODES.ALL
            ? `${month?.shortLabel ?? item.month}/${String(item.year).slice(-2)}`
            : month?.shortLabel ?? String(item.month);

        return {
            ...item,
            label,
            income: (Number(item.totalIncomeCents) || 0) / 100,
            expense: (Number(item.totalExpenseCents) || 0) / 100,
            balance: (Number(item.balanceCents) || 0) / 100,
            cumulativeBalance: cumulativeBalanceCents / 100,
        };
    });
}

export function getFinancialIndicators(summary = {}) {
    const income = Number(summary.totalIncomeCents) || 0;
    const expense = Number(summary.totalExpenseCents) || 0;
    const balance = Number(summary.balanceCents) || 0;
    const count = Number(summary.transactionCount) || 0;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expense / income) * 100 : expense > 0 ? 100 : 0;
    const averageTransaction = count > 0 ? (income + expense) / count : 0;

    return {
        savingsRate,
        expenseRatio,
        averageTransactionCents: Math.round(averageTransaction),
        healthTone: balance < 0 ? "danger" : savingsRate >= 20 ? "success" : savingsRate > 0 ? "warning" : "neutral",
    };
}

export function formatCompactCurrency(value) {
    const number = Number(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: Math.abs(number) >= 10000 ? "compact" : "standard",
        maximumFractionDigits: Math.abs(number) >= 10000 ? 1 : 2,
    }).format(number);
}

export function formatTooltipCurrency(value) {
    return formatCurrency(Math.round((Number(value) || 0) * 100));
}

export function getApiErrorMessage(error, fallback = "Não foi possível carregar os dados financeiros.") {
    return error?.response?.data?.message ?? error?.message ?? fallback;
}
