import {
    getMonthName,
} from "../../../utils/months.js";

const STORAGE_KEY = "meu-saldo:history-period";

function toFiniteNumber(value) {
    const normalized = Number(value);

    return Number.isFinite(normalized) ? normalized : 0;
}

function toCount(value) {
    return Math.max(0, Math.trunc(toFiniteNumber(value)));
}

function currentMonthKey() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function normalizeHistoryPeriod(value = {}) {
    const now = new Date();
    const mode = ["all", "month", "year"].includes(value?.mode)
        ? value.mode
        : "year";
    const month = /^\d{4}-\d{2}$/.test(String(value?.month ?? ""))
        ? String(value.month)
        : currentMonthKey();
    const yearValue = Number(value?.year);
    const year = Number.isInteger(yearValue) && yearValue >= 1900 && yearValue <= 2100
        ? yearValue
        : now.getFullYear();

    return {
        mode,
        month,
        year,
    };
}

export function readHistoryPeriod(userId) {
    if (typeof window === "undefined") {
        return normalizeHistoryPeriod();
    }

    try {
        const raw = window.localStorage.getItem(`${STORAGE_KEY}:${userId ?? "guest"}`);

        return normalizeHistoryPeriod(raw ? JSON.parse(raw) : undefined);
    } catch {
        return normalizeHistoryPeriod();
    }
}

export function saveHistoryPeriod(userId, period) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            `${STORAGE_KEY}:${userId ?? "guest"}`,
            JSON.stringify(normalizeHistoryPeriod(period)),
        );
    } catch {
        // A falha de persistência não deve impedir o uso da página.
    }
}

export function getHistoryRequestYear(period) {
    const normalized = normalizeHistoryPeriod(period);

    if (normalized.mode === "year") {
        return normalized.year;
    }

    if (normalized.mode === "month") {
        return Number(normalized.month.slice(0, 4));
    }

    return undefined;
}

export function filterHistoryByPeriod(history = [], period) {
    const normalized = normalizeHistoryPeriod(period);
    const items = Array.isArray(history) ? history : [];

    if (normalized.mode === "month") {
        return items.filter((item) => item?.key === normalized.month);
    }

    if (normalized.mode === "year") {
        return items.filter((item) => Number(item?.year) === normalized.year);
    }

    return items;
}

export function normalizeMonthItem(item = {}) {
    const year = Number(item?.year);
    const month = Number(item?.month);
    const key = typeof item?.key === "string"
        ? item.key
        : `${year}-${String(month).padStart(2, "0")}`;
    const income = toFiniteNumber(item?.totalIncomeCents);
    const expense = toFiniteNumber(item?.totalExpenseCents);

    return {
        ...item,
        key,
        year,
        month,
        totalIncomeCents: income,
        totalExpenseCents: expense,
        balanceCents: toFiniteNumber(item?.balanceCents ?? income - expense),
        transactionCount: toCount(item?.transactionCount),
        incomeCount: toCount(item?.incomeCount),
        expenseCount: toCount(item?.expenseCount),
    };
}

export function sortHistory(history = []) {
    return (Array.isArray(history) ? history : [])
        .map(normalizeMonthItem)
        .sort((first, second) => second.key.localeCompare(first.key));
}

export function aggregateHistory(history = []) {
    return sortHistory(history).reduce(
        (summary, item) => ({
            totalIncomeCents: summary.totalIncomeCents + item.totalIncomeCents,
            totalExpenseCents: summary.totalExpenseCents + item.totalExpenseCents,
            balanceCents: summary.balanceCents + item.balanceCents,
            transactionCount: summary.transactionCount + item.transactionCount,
            incomeCount: summary.incomeCount + item.incomeCount,
            expenseCount: summary.expenseCount + item.expenseCount,
            monthsWithMovement: summary.monthsWithMovement + 1,
        }),
        {
            totalIncomeCents: 0,
            totalExpenseCents: 0,
            balanceCents: 0,
            transactionCount: 0,
            incomeCount: 0,
            expenseCount: 0,
            monthsWithMovement: 0,
        },
    );
}

export function groupHistoryByYear(history = []) {
    const groups = new Map();

    for (const item of sortHistory(history)) {
        if (!groups.has(item.year)) {
            groups.set(item.year, []);
        }

        groups.get(item.year).push(item);
    }

    return Array.from(groups.entries())
        .map(([year, months]) => ({
            year,
            months,
            summary: aggregateHistory(months),
        }))
        .sort((first, second) => second.year - first.year);
}

export function getPeriodLabel(period) {
    const normalized = normalizeHistoryPeriod(period);

    if (normalized.mode === "month") {
        const [year, month] = normalized.month.split("-").map(Number);

        return `${getMonthName(month)} de ${year}`;
    }

    if (normalized.mode === "year") {
        return String(normalized.year);
    }

    return "todo o histórico";
}

export function getPeriodDescription(period) {
    const normalized = normalizeHistoryPeriod(period);

    if (normalized.mode === "month") {
        return "Acompanhe o resumo e todos os lançamentos do mês selecionado.";
    }

    if (normalized.mode === "year") {
        return "Compare os meses e acompanhe a evolução financeira do ano selecionado.";
    }

    return "Visualize a evolução completa das suas finanças, agrupada por ano e por mês.";
}

export function getTransactionFilters(period, search, page, limit) {
    const normalized = normalizeHistoryPeriod(period);
    const filters = {
        page,
        limit,
    };

    if (typeof search === "string" && search.trim()) {
        filters.search = search.trim();
    }

    if (normalized.mode === "year") {
        filters.year = normalized.year;
    }

    if (normalized.mode === "month") {
        const [year, month] = normalized.month.split("-").map(Number);

        filters.year = year;
        filters.month = month;
    }

    return filters;
}

export function getBalanceStatus(balanceCents) {
    const balance = toFiniteNumber(balanceCents);

    if (balance > 0) {
        return {
            status: "healthy",
            label: "Saldo positivo",
            description: "As receitas superaram as despesas neste período.",
        };
    }

    if (balance < 0) {
        return {
            status: "critical",
            label: "Saldo negativo",
            description: "As despesas superaram as receitas neste período.",
        };
    }

    return {
        status: "stable",
        label: "Saldo equilibrado",
        description: "Receitas e despesas ficaram no mesmo nível.",
    };
}

export function getMonthLabel(item) {
    return `${getMonthName(Number(item?.month))} de ${Number(item?.year)}`;
}

export function getErrorMessage(error, fallback) {
    return error?.response?.data?.error
        || error?.response?.data?.message
        || error?.message
        || fallback;
}
