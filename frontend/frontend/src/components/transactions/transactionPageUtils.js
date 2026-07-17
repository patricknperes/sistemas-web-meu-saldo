export function getErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data;

    if (typeof responseData?.error === "string" && responseData.error.trim()) {
        return responseData.error;
    }

    if (typeof responseData?.message === "string" && responseData.message.trim()) {
        return responseData.message;
    }

    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
        const firstError = responseData.errors[0];

        if (typeof firstError === "string" && firstError.trim()) {
            return firstError;
        }

        if (typeof firstError?.message === "string" && firstError.message.trim()) {
            return firstError.message;
        }
    }

    if (typeof error?.message === "string" && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
}

export function normalizePositiveInteger(value, fallbackValue = 1) {
    const normalizedValue = Number(value);

    return Number.isInteger(normalizedValue) && normalizedValue > 0
        ? normalizedValue
        : fallbackValue;
}

export function normalizeTransactionListResponse(response, fallbackPage = 1, fallbackLimit = 10) {
    const transactions = Array.isArray(response?.transactions)
        ? response.transactions
        : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.data)
                ? response.data
                : [];

    const paginationSource = response?.pagination ?? response?.meta ?? {};
    const totalItems = Math.max(
        0,
        Number(paginationSource.totalItems ?? paginationSource.total ?? transactions.length) || 0
    );
    const page = normalizePositiveInteger(
        paginationSource.page ?? paginationSource.currentPage,
        fallbackPage
    );
    const limit = normalizePositiveInteger(
        paginationSource.limit ?? paginationSource.pageSize,
        fallbackLimit
    );
    const totalPagesCandidate = Number(paginationSource.totalPages);
    const totalPages = Number.isInteger(totalPagesCandidate) && totalPagesCandidate >= 0
        ? totalPagesCandidate
        : totalItems > 0
            ? Math.max(1, Math.ceil(totalItems / limit))
            : 0;

    return {
        transactions,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
        },
        totalAmountCents: Number(
            response?.summary?.totalAmountCents ??
            response?.summary?.amountCents ??
            response?.totalAmountCents ??
            0
        ) || 0,
    };
}

export function normalizeRecurringListResponse(response, fallbackPage = 1, fallbackLimit = 8) {
    const recurringTransactions = Array.isArray(response?.recurringTransactions)
        ? response.recurringTransactions
        : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.data)
                ? response.data
                : [];

    const paginationSource = response?.pagination ?? response?.meta ?? {};
    const totalItems = Math.max(
        0,
        Number(paginationSource.totalItems ?? paginationSource.total ?? recurringTransactions.length) || 0
    );
    const page = normalizePositiveInteger(
        paginationSource.page ?? paginationSource.currentPage,
        fallbackPage
    );
    const limit = normalizePositiveInteger(
        paginationSource.limit ?? paginationSource.pageSize,
        fallbackLimit
    );
    const totalPagesCandidate = Number(paginationSource.totalPages);
    const totalPages = Number.isInteger(totalPagesCandidate) && totalPagesCandidate >= 0
        ? totalPagesCandidate
        : totalItems > 0
            ? Math.max(1, Math.ceil(totalItems / limit))
            : 0;

    return {
        recurringTransactions,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
        },
    };
}

export function extractEntityTags(entity) {
    if (!Array.isArray(entity?.tags)) {
        return [];
    }

    const tagsById = new Map();

    entity.tags.forEach((item) => {
        const tag = item?.tag && typeof item.tag === "object"
            ? item.tag
            : item;
        const id = Number(tag?.id);

        if (!Number.isInteger(id) || id <= 0) {
            return;
        }

        tagsById.set(id, {
            ...tag,
            id,
            value: id,
            active: tag?.isActive ?? tag?.active ?? true,
        });
    });

    return [...tagsById.values()];
}

export function extractEntityTagIds(entity) {
    return extractEntityTags(entity).map((tag) => tag.id);
}

export function normalizeTagListResponse(response) {
    const tags = Array.isArray(response)
        ? response
        : response?.tag && typeof response.tag === "object"
            ? [response.tag]
            : Array.isArray(response?.tags)
                ? response.tags
                : Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

    return tags
        .map((tag) => {
            const id = Number(tag?.id);

            if (!Number.isInteger(id) || id <= 0) {
                return null;
            }

            return {
                ...tag,
                id,
                value: id,
                active: tag?.isActive ?? tag?.active ?? true,
            };
        })
        .filter(Boolean);
}

export function normalizeDateInput(value) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value.slice(0, 10);
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 10);
}

export function getTodayInputValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function isGeneratedByRecurrence(transaction) {
    return Boolean(
        transaction?.generatedByRecurrence ||
        transaction?.recurringTransactionId ||
        transaction?.recurringTransaction?.id ||
        transaction?.occurrenceDate
    );
}

export function prepareTransactionForView(transaction) {
    return {
        ...transaction,
        date: transaction?.date ?? transaction?.occurrenceDate ?? transaction?.createdAt,
        generatedByRecurrence: isGeneratedByRecurrence(transaction),
    };
}

export function periodToRequestFilters(period) {
    if (period?.mode === "month" && typeof period.month === "string") {
        const [year, month] = period.month.split("-").map(Number);

        if (Number.isInteger(year) && Number.isInteger(month)) {
            return { year, month };
        }
    }

    if (period?.mode === "year") {
        const year = Number(period.year);

        if (Number.isInteger(year)) {
            return { year };
        }
    }

    return {};
}

export function capitalizeFirst(value) {
    const text = String(value ?? "");

    return text
        ? `${text.charAt(0).toUpperCase()}${text.slice(1)}`
        : "";
}
