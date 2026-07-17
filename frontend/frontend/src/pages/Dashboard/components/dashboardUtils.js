const DASHBOARD_FILTER_STORAGE_PREFIX = "meu-saldo:dashboard-filter";

const VALID_FILTER_MODES = new Set([
    "ALL",
    "YEAR",
    "MONTH",
]);

export const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export const MONTHS_SHORT = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
];

export function normalizeCents(value) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : 0;
}

export function createDefaultDashboardFilter() {
    const currentDate = new Date();

    return {
        filterMode: "ALL",
        selectedMonth: currentDate.getMonth() + 1,
        selectedYear: currentDate.getFullYear(),
    };
}

export function normalizeDashboardFilter(value) {
    const fallback = createDefaultDashboardFilter();
    const filterMode = VALID_FILTER_MODES.has(value?.filterMode)
        ? value.filterMode
        : fallback.filterMode;
    const month = Number(value?.selectedMonth);
    const year = Number(value?.selectedYear);

    return {
        filterMode,
        selectedMonth:
            Number.isInteger(month) && month >= 1 && month <= 12
                ? month
                : fallback.selectedMonth,
        selectedYear:
            Number.isInteger(year) && year >= 1900 && year <= 2100
                ? year
                : fallback.selectedYear,
    };
}

function getDashboardFilterStorageKey(userId) {
    if (!userId) {
        return null;
    }

    return `${DASHBOARD_FILTER_STORAGE_PREFIX}:${userId}`;
}

export function readDashboardFilter(userId) {
    const fallback = createDefaultDashboardFilter();
    const storageKey = getDashboardFilterStorageKey(userId);

    if (!storageKey || typeof window === "undefined") {
        return fallback;
    }

    try {
        const savedValue = window.localStorage.getItem(storageKey);

        if (!savedValue) {
            return fallback;
        }

        return normalizeDashboardFilter(JSON.parse(savedValue));
    } catch {
        return fallback;
    }
}

export function saveDashboardFilter(userId, filter) {
    const storageKey = getDashboardFilterStorageKey(userId);

    if (!storageKey || typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            storageKey,
            JSON.stringify(normalizeDashboardFilter(filter)),
        );
    } catch {
        // O dashboard continua funcional quando o armazenamento local é bloqueado.
    }
}

export function createSummaryFilters(filter) {
    const normalizedFilter = normalizeDashboardFilter(filter);

    if (normalizedFilter.filterMode === "MONTH") {
        return {
            filterMode: "MONTH",
            month: normalizedFilter.selectedMonth,
            year: normalizedFilter.selectedYear,
        };
    }

    if (normalizedFilter.filterMode === "YEAR") {
        return {
            filterMode: "YEAR",
            year: normalizedFilter.selectedYear,
        };
    }

    return {
        filterMode: "ALL",
    };
}

export function dashboardFilterToPeriod(filter) {
    const normalized = normalizeDashboardFilter(filter);

    return {
        mode: normalized.filterMode.toLowerCase(),
        month: `${normalized.selectedYear}-${String(normalized.selectedMonth).padStart(2, "0")}`,
        year: normalized.selectedYear,
    };
}

export function periodToDashboardFilter(period) {
    const fallback = createDefaultDashboardFilter();
    const mode = String(period?.mode || "all").toUpperCase();

    if (mode === "MONTH") {
        const [yearValue, monthValue] = String(period?.month || "").split("-");

        return normalizeDashboardFilter({
            filterMode: "MONTH",
            selectedMonth: Number(monthValue),
            selectedYear: Number(yearValue),
        });
    }

    if (mode === "YEAR") {
        return normalizeDashboardFilter({
            filterMode: "YEAR",
            selectedMonth: fallback.selectedMonth,
            selectedYear: Number(period?.year),
        });
    }

    return normalizeDashboardFilter({
        filterMode: "ALL",
        selectedMonth: fallback.selectedMonth,
        selectedYear: fallback.selectedYear,
    });
}

export function getHistoryYear(filter) {
    const normalized = normalizeDashboardFilter(filter);

    if (normalized.filterMode === "YEAR" || normalized.filterMode === "MONTH") {
        return normalized.selectedYear;
    }

    return undefined;
}

export function getPeriodLabel(filter) {
    const normalized = normalizeDashboardFilter(filter);

    if (normalized.filterMode === "MONTH") {
        return `${MONTHS[normalized.selectedMonth - 1]} de ${normalized.selectedYear}`;
    }

    if (normalized.filterMode === "YEAR") {
        return `Ano de ${normalized.selectedYear}`;
    }

    return "Todo o histórico";
}

function normalizeHistoryRow(row) {
    const month = Number(row?.month);
    const year = Number(row?.year);

    if (
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12 ||
        !Number.isInteger(year)
    ) {
        return null;
    }

    return {
        key: row?.key || `${year}-${String(month).padStart(2, "0")}`,
        year,
        month,
        label: MONTHS_SHORT[month - 1],
        totalIncomeCents: normalizeCents(row?.totalIncomeCents),
        totalExpenseCents: normalizeCents(row?.totalExpenseCents),
        balanceCents: normalizeCents(row?.balanceCents),
        transactionCount: normalizeCents(row?.transactionCount),
        incomeCount: normalizeCents(row?.incomeCount),
        expenseCount: normalizeCents(row?.expenseCount),
    };
}

export function createHistorySeries(history, filter) {
    const rows = Array.isArray(history)
        ? history.map(normalizeHistoryRow).filter(Boolean)
        : [];
    const normalized = normalizeDashboardFilter(filter);

    if (normalized.filterMode === "YEAR" || normalized.filterMode === "MONTH") {
        const byKey = new Map(rows.map((row) => [row.key, row]));

        return Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const key = `${normalized.selectedYear}-${String(month).padStart(2, "0")}`;

            return byKey.get(key) || {
                key,
                year: normalized.selectedYear,
                month,
                label: MONTHS_SHORT[index],
                totalIncomeCents: 0,
                totalExpenseCents: 0,
                balanceCents: 0,
                transactionCount: 0,
                incomeCount: 0,
                expenseCount: 0,
            };
        });
    }

    return rows
        .sort((first, second) => first.key.localeCompare(second.key))
        .slice(-12);
}

export function getChartCopy(filter) {
    const normalized = normalizeDashboardFilter(filter);

    if (normalized.filterMode === "MONTH") {
        return {
            title: `Fluxo mensal de ${normalized.selectedYear}`,
            description: `O mês de ${MONTHS[normalized.selectedMonth - 1].toLowerCase()} aparece em destaque para dar contexto ao resultado selecionado.`,
        };
    }

    if (normalized.filterMode === "YEAR") {
        return {
            title: `Fluxo mensal de ${normalized.selectedYear}`,
            description: "Compare entradas, saídas e o saldo acumulado ao longo do ano.",
        };
    }

    return {
        title: "Evolução dos últimos 12 meses",
        description: "Acompanhe a relação entre receitas e despesas no histórico mais recente.",
    };
}

export function getSelectedMonthKey(filter) {
    const normalized = normalizeDashboardFilter(filter);

    if (normalized.filterMode !== "MONTH") {
        return null;
    }

    return `${normalized.selectedYear}-${String(normalized.selectedMonth).padStart(2, "0")}`;
}

export function getBalanceHealth(balanceCents, incomeCents) {
    const balance = normalizeCents(balanceCents);
    const income = normalizeCents(incomeCents);

    if (balance < 0) {
        return {
            status: "critical",
            label: "Saldo negativo",
            description: "As despesas superaram as receitas no período.",
        };
    }

    if (income > 0 && balance / income < 0.1) {
        return {
            status: "attention",
            label: "Margem reduzida",
            description: "Pouco do valor recebido permaneceu disponível.",
        };
    }

    if (balance > 0) {
        return {
            status: "healthy",
            label: "Saldo saudável",
            description: "As receitas ficaram acima das despesas no período.",
        };
    }

    return {
        status: "neutral",
        label: "Saldo zerado",
        description: "Não há diferença entre receitas e despesas neste período.",
    };
}

export function calculateSavingsRate(balanceCents, incomeCents) {
    const balance = normalizeCents(balanceCents);
    const income = normalizeCents(incomeCents);

    if (income <= 0) {
        return 0;
    }

    return (balance / income) * 100;
}

export function formatPercent(value) {
    const normalized = Number(value);

    if (!Number.isFinite(normalized)) {
        return "0%";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(normalized / 100);
}

export function formatCompactCurrencyFromCents(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(normalizeCents(value) / 100);
}
