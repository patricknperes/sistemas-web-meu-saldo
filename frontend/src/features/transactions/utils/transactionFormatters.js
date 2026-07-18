import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatCurrencyCents(value) {
    const cents = Number(value);
    return currencyFormatter.format(Number.isFinite(cents) ? cents / 100 : 0);
}

export function formatTransactionDate(value, pattern = "dd 'de' MMM 'de' yyyy") {
    if (!value) return "—";
    const date = value instanceof Date ? value : parseISO(String(value));
    if (!isValid(date)) return "—";
    return format(date, pattern, { locale: ptBR });
}

export function toDateInputValue(value) {
    if (!value) return "";
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const date = value instanceof Date ? value : parseISO(text);
    return isValid(date) ? format(date, "yyyy-MM-dd") : "";
}

export function dateInputToDate(value) {
    if (!value) return undefined;
    const [year, month, day] = String(value).split("-").map(Number);
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function getApiErrorMessage(error, fallback = "Não foi possível concluir a operação.") {
    const data = error?.response?.data;
    if (typeof data?.error === "string" && data.error) return data.error;
    if (typeof data?.message === "string" && data.message) return data.message;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === "string") return first;
        if (typeof first?.message === "string") return first.message;
    }
    if (typeof error?.message === "string" && error.message) return error.message;
    return fallback;
}

export function getRecurringStatusLabel(status) {
    const labels = {
        ACTIVE: "Ativa",
        PAUSED: "Pausada",
        FINISHED: "Finalizada",
    };
    return labels[status] ?? "Pausada";
}

export function getRecurringStatusVariant(status) {
    if (status === "ACTIVE") return "success";
    if (status === "FINISHED") return "neutral";
    return "warning";
}

export function getIntervalLabel(intervalMonths) {
    const value = Number(intervalMonths) || 1;
    if (value === 1) return "Todo mês";
    if (value === 2) return "A cada 2 meses";
    if (value === 3) return "A cada 3 meses";
    if (value === 6) return "A cada 6 meses";
    if (value === 12) return "Todo ano";
    return `A cada ${value} meses`;
}

export function getPeriodLabel(filters) {
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    if (filters.mode === "MONTH") return `${monthNames[Number(filters.month) - 1]} de ${filters.year}`;
    if (filters.mode === "YEAR") return `Ano de ${filters.year}`;
    if (filters.mode === "RANGE") {
        const start = filters.startDate ? formatTransactionDate(filters.startDate, "dd/MM/yyyy") : "início";
        const end = filters.endDate ? formatTransactionDate(filters.endDate, "dd/MM/yyyy") : "hoje";
        return `${start} até ${end}`;
    }
    return "Todo o histórico";
}

export function buildPaginationItems(currentPage, totalPages) {
    const current = Math.max(1, Number(currentPage) || 1);
    const total = Math.max(0, Number(totalPages) || 0);
    if (total <= 1) return total === 1 ? [1] : [];
    const pages = new Set([1, total, current - 1, current, current + 1]);
    return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}
