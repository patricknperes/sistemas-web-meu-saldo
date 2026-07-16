import { api } from "./api.js";

const VALID_TRANSACTION_TYPES = [
    "INCOME",
    "EXPENSE",
];

function normalizeTransactionType(value) {
    if (typeof value !== "string") {
        return "";
    }

    const normalizedType =
        value.trim().toUpperCase();

    return VALID_TRANSACTION_TYPES.includes(
        normalizedType,
    )
        ? normalizedType
        : "";
}

function normalizePositiveInteger(
    value,
    fieldName,
) {
    const normalizedValue =
        Number(value);

    if (
        !Number.isInteger(
            normalizedValue,
        ) ||
        normalizedValue <= 0
    ) {
        throw new Error(
            `O campo ${fieldName} é inválido.`,
        );
    }

    return normalizedValue;
}

function normalizeOptionalPositiveInteger(
    value,
    fieldName,
) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    return normalizePositiveInteger(
        value,
        fieldName,
    );
}

function normalizeMonth(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    const month = Number(value);

    if (
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
    ) {
        throw new Error(
            "O mês deve ser um número entre 1 e 12.",
        );
    }

    return month;
}

function normalizeYear(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    const year = Number(value);

    if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
    ) {
        throw new Error(
            "O ano informado é inválido.",
        );
    }

    return year;
}

function normalizeDateValue(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    if (typeof value !== "string") {
        throw new Error(
            "A data precisa ser informada no formato YYYY-MM-DD.",
        );
    }

    return value.trim();
}

function normalizeTagIds(value) {
    if (value === undefined) {
        return undefined;
    }

    if (!Array.isArray(value)) {
        throw new Error(
            "As tags precisam ser informadas em uma lista.",
        );
    }

    return [
        ...new Set(
            value.map((tagId) =>
                normalizePositiveInteger(
                    tagId,
                    "tag",
                ),
            ),
        ),
    ];
}

function buildListParams(
    filters = {},
) {
    const params = {};

    const type =
        normalizeTransactionType(
            filters.type,
        );

    if (type) {
        params.type = type;
    }

    if (
        typeof filters.search ===
            "string" &&
        filters.search.trim()
    ) {
        params.search =
            filters.search.trim();
    }

    if (
        typeof filters.category ===
            "string" &&
        filters.category.trim()
    ) {
        params.category =
            filters.category.trim();
    }

    const tagId =
        normalizeOptionalPositiveInteger(
            filters.tagId,
            "tagId",
        );

    if (tagId !== undefined) {
        params.tagId = tagId;
    }

    const month =
        normalizeMonth(
            filters.month,
        );

    if (month !== undefined) {
        params.month = month;
    }

    const year =
        normalizeYear(
            filters.year,
        );

    if (year !== undefined) {
        params.year = year;
    }

    const startDate =
        normalizeDateValue(
            filters.startDate,
        );

    if (startDate !== undefined) {
        params.startDate =
            startDate;
    }

    const endDate =
        normalizeDateValue(
            filters.endDate,
        );

    if (endDate !== undefined) {
        params.endDate = endDate;
    }

    const page =
        normalizeOptionalPositiveInteger(
            filters.page,
            "page",
        );

    if (page !== undefined) {
        params.page = page;
    }

    const limit =
        normalizeOptionalPositiveInteger(
            filters.limit,
            "limit",
        );

    if (limit !== undefined) {
        params.limit = limit;
    }

    return params;
}

function normalizeTransactionPayload(
    transactionData = {},
) {
    const payload = {};

    if (
        typeof transactionData.description ===
        "string"
    ) {
        payload.description =
            transactionData.description.trim();
    }

    if (
        transactionData.amountCents !==
        undefined
    ) {
        payload.amountCents =
            normalizePositiveInteger(
                transactionData.amountCents,
                "amountCents",
            );
    }

    if (
        transactionData.type !==
        undefined
    ) {
        const type =
            normalizeTransactionType(
                transactionData.type,
            );

        if (!type) {
            throw new Error(
                "O tipo da transação deve ser INCOME ou EXPENSE.",
            );
        }

        payload.type = type;
    }

    if (
        typeof transactionData.category ===
        "string"
    ) {
        payload.category =
            transactionData.category.trim();
    }

    if (
        transactionData.date !==
        undefined
    ) {
        const date =
            normalizeDateValue(
                transactionData.date,
            );

        if (!date) {
            throw new Error(
                "A data da transação é obrigatória.",
            );
        }

        payload.date = date;
    }

    if (
        transactionData.notes !==
        undefined
    ) {
        if (
            transactionData.notes ===
            null
        ) {
            payload.notes = null;
        } else if (
            typeof transactionData.notes ===
            "string"
        ) {
            const notes =
                transactionData.notes.trim();

            payload.notes =
                notes || null;
        } else {
            payload.notes =
                transactionData.notes;
        }
    }

    if (
        transactionData.tagIds !==
        undefined
    ) {
        payload.tagIds =
            normalizeTagIds(
                transactionData.tagIds,
            );
    }

    return payload;
}

function normalizeTransactionId(
    transactionId,
) {
    return normalizePositiveInteger(
        transactionId,
        "transactionId",
    );
}

async function list(filters = {}) {
    const response = await api.get(
        "/transactions",
        {
            params:
                buildListParams(
                    filters,
                ),
        },
    );

    return response.data;
}

async function listByType(
    type,
    filters = {},
) {
    const normalizedType =
        normalizeTransactionType(type);

    if (!normalizedType) {
        throw new Error(
            "O tipo deve ser INCOME ou EXPENSE.",
        );
    }

    return list({
        ...filters,
        type: normalizedType,
    });
}

async function getById(
    transactionId,
) {
    const normalizedId =
        normalizeTransactionId(
            transactionId,
        );

    const response = await api.get(
        `/transactions/${normalizedId}`,
    );

    return response.data;
}

async function create(
    transactionData,
) {
    const payload =
        normalizeTransactionPayload(
            transactionData,
        );

    const response = await api.post(
        "/transactions",
        payload,
    );

    return response.data;
}

async function createForType(
    type,
    transactionData,
) {
    const normalizedType =
        normalizeTransactionType(type);

    if (!normalizedType) {
        throw new Error(
            "O tipo deve ser INCOME ou EXPENSE.",
        );
    }

    return create({
        ...transactionData,
        type: normalizedType,
    });
}

async function update(
    transactionId,
    transactionData,
) {
    const normalizedId =
        normalizeTransactionId(
            transactionId,
        );

    const payload =
        normalizeTransactionPayload(
            transactionData,
        );

    const response = await api.patch(
        `/transactions/${normalizedId}`,
        payload,
    );

    return response.data;
}

async function remove(
    transactionId,
) {
    const normalizedId =
        normalizeTransactionId(
            transactionId,
        );

    const response =
        await api.delete(
            `/transactions/${normalizedId}`,
        );

    return response.data;
}

export const transactionService = {
    list,
    listByType,
    getById,
    create,
    createForType,
    update,
    remove,
};