const VALID_TRANSACTION_TYPES = new Set([
    "INCOME",
    "EXPENSE",
]);

const VALID_RECURRENCE_STATUSES = new Set([
    "ACTIVE",
    "PAUSED",
    "SCHEDULED",
    "ENDED",
]);

function mergeClasses(...values) {
    return values
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeTransactionType(value) {
    if (typeof value !== "string") {
        return "EXPENSE";
    }

    const normalizedValue = value.trim().toUpperCase();

    if (["INCOME", "REVENUE", "RECEITA", "ENTRADA"].includes(normalizedValue)) {
        return "INCOME";
    }

    if (["EXPENSE", "DESPESA", "SAIDA", "SAÍDA"].includes(normalizedValue)) {
        return "EXPENSE";
    }

    return VALID_TRANSACTION_TYPES.has(normalizedValue)
        ? normalizedValue
        : "EXPENSE";
}

function resolveTransactionTone(type) {
    return normalizeTransactionType(type) === "INCOME"
        ? "positive"
        : "negative";
}

function resolveTransactionLabel(type, plural = false) {
    const normalizedType = normalizeTransactionType(type);

    if (normalizedType === "INCOME") {
        return plural ? "Receitas" : "Receita";
    }

    return plural ? "Despesas" : "Despesa";
}

function toFiniteNumber(value, fallback = 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function amountCentsToCurrency(amountCents) {
    return toFiniteNumber(amountCents) / 100;
}

function resolveTransactionAmount({
    amount,
    amountCents,
    type,
    signed = true,
}) {
    const numericAmount = amountCents !== undefined && amountCents !== null
        ? amountCentsToCurrency(amountCents)
        : toFiniteNumber(amount);

    const absoluteAmount = Math.abs(numericAmount);

    if (!signed) {
        return absoluteAmount;
    }

    return normalizeTransactionType(type) === "INCOME"
        ? absoluteAmount
        : -absoluteAmount;
}

function normalizeDateValue(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmedValue);

    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }

    const parsedDate = new Date(trimmedValue);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatTransactionDate(
    value,
    {
        locale = "pt-BR",
        style = "medium",
    } = {}
) {
    const date = normalizeDateValue(value);

    if (!date) {
        return "Data não informada";
    }

    const formatOptions = {
        short: {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        },
        compact: {
            day: "2-digit",
            month: "short",
        },
        medium: {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
        long: {
            day: "2-digit",
            month: "long",
            year: "numeric",
        },
    };

    return new Intl.DateTimeFormat(
        locale,
        {
            ...(formatOptions[style] || formatOptions.medium),
            timeZone: "UTC",
        }
    ).format(date);
}

function formatRelativeDate(value, referenceDate = new Date()) {
    const date = normalizeDateValue(value);

    if (!date) {
        return "";
    }

    const reference = normalizeDateValue(referenceDate) || new Date();
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    const dateUtc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );
    const referenceUtc = Date.UTC(
        reference.getUTCFullYear(),
        reference.getUTCMonth(),
        reference.getUTCDate()
    );
    const difference = Math.round((dateUtc - referenceUtc) / dayInMilliseconds);

    if (difference === 0) {
        return "Hoje";
    }

    if (difference === -1) {
        return "Ontem";
    }

    if (difference === 1) {
        return "Amanhã";
    }

    return "";
}

function normalizeRecurrenceStatus(value, recurrence = {}) {
    if (typeof value === "string") {
        const normalizedValue = value.trim().toUpperCase();

        if (VALID_RECURRENCE_STATUSES.has(normalizedValue)) {
            return normalizedValue;
        }
    }

    if (recurrence.isActive === false) {
        return "PAUSED";
    }

    const today = new Date();
    const startDate = normalizeDateValue(recurrence.startDate);
    const endDate = normalizeDateValue(recurrence.endDate);

    if (endDate && endDate.getTime() < today.getTime()) {
        return "ENDED";
    }

    if (startDate && startDate.getTime() > today.getTime()) {
        return "SCHEDULED";
    }

    return "ACTIVE";
}

function getRecurrenceStatusConfiguration(status, recurrence = {}) {
    const normalizedStatus = normalizeRecurrenceStatus(status, recurrence);

    const configurations = {
        ACTIVE: {
            label: "Ativa",
            description: "Gerando movimentações normalmente.",
            tone: "success",
        },
        PAUSED: {
            label: "Pausada",
            description: "Nenhuma nova movimentação será gerada.",
            tone: "warning",
        },
        SCHEDULED: {
            label: "Agendada",
            description: "Começará na data configurada.",
            tone: "info",
        },
        ENDED: {
            label: "Encerrada",
            description: "O período configurado já terminou.",
            tone: "neutral",
        },
    };

    return {
        status: normalizedStatus,
        ...configurations[normalizedStatus],
    };
}

function normalizePositiveInteger(value, fallback = 1) {
    const numericValue = Number(value);

    return Number.isInteger(numericValue) && numericValue > 0
        ? numericValue
        : fallback;
}

function formatRecurrenceFrequency({
    intervalMonths = 1,
    dayOfMonth = 1,
} = {}) {
    const normalizedInterval = normalizePositiveInteger(intervalMonths, 1);
    const normalizedDay = Math.min(
        31,
        normalizePositiveInteger(dayOfMonth, 1)
    );

    let intervalLabel = "Todo mês";

    if (normalizedInterval === 2) {
        intervalLabel = "A cada 2 meses";
    } else if (normalizedInterval === 3) {
        intervalLabel = "A cada 3 meses";
    } else if (normalizedInterval === 6) {
        intervalLabel = "A cada 6 meses";
    } else if (normalizedInterval === 12) {
        intervalLabel = "Todo ano";
    } else if (normalizedInterval > 1) {
        intervalLabel = `A cada ${normalizedInterval} meses`;
    }

    return {
        label: intervalLabel,
        detail: `No dia ${normalizedDay}`,
        fullLabel: `${intervalLabel}, no dia ${normalizedDay}`,
    };
}

function formatRecurrencePeriod({
    startDate,
    endDate,
} = {}) {
    const normalizedStartDate = normalizeDateValue(startDate);
    const normalizedEndDate = normalizeDateValue(endDate);

    if (!normalizedStartDate && !normalizedEndDate) {
        return {
            label: "Período não definido",
            startLabel: "Sem início",
            endLabel: "Sem término",
        };
    }

    const startLabel = normalizedStartDate
        ? formatTransactionDate(normalizedStartDate, { style: "compact" })
        : "Sem início";
    const endLabel = normalizedEndDate
        ? formatTransactionDate(normalizedEndDate, { style: "compact" })
        : "Sem término";

    return {
        label: normalizedEndDate
            ? `${startLabel} até ${endLabel}`
            : `Desde ${startLabel} · sem término`,
        startLabel,
        endLabel,
    };
}

function resolveRecurringTransaction(transaction = {}) {
    return Boolean(
        transaction.generatedByRecurrence ||
        transaction.recurringTransactionId ||
        transaction.recurringId ||
        transaction.isRecurring
    );
}

function extractTransactionTags(transaction = {}) {
    const source = Array.isArray(transaction.tags)
        ? transaction.tags
        : [];

    return source
        .map((item) => item?.tag || item)
        .filter(Boolean);
}

export {
    amountCentsToCurrency,
    extractTransactionTags,
    formatRecurrenceFrequency,
    formatRecurrencePeriod,
    formatRelativeDate,
    formatTransactionDate,
    getRecurrenceStatusConfiguration,
    mergeClasses,
    normalizeDateValue,
    normalizeRecurrenceStatus,
    normalizeTransactionType,
    resolveRecurringTransaction,
    resolveTransactionAmount,
    resolveTransactionLabel,
    resolveTransactionTone,
    toFiniteNumber,
};
