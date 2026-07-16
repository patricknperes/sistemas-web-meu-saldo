import { api } from "./api.js";

const VALID_TRANSACTION_TYPES = [
    "INCOME",
    "EXPENSE",
];

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

function normalizeTransactionType(
    value,
) {
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

function normalizeDateValue(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return undefined;
    }

    if (value === "") {
        return null;
    }

    if (typeof value !== "string") {
        return value;
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
        typeof filters.isActive ===
        "boolean"
    ) {
        params.isActive =
            filters.isActive;
    }

    if (
        typeof filters.search ===
            "string" &&
        filters.search.trim()
    ) {
        params.search =
            filters.search.trim();
    }

    const tagId =
        normalizeOptionalPositiveInteger(
            filters.tagId,
            "tagId",
        );

    if (tagId !== undefined) {
        params.tagId = tagId;
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

function normalizeRecurringPayload(
    recurringData = {},
) {
    const payload = {};

    if (
        typeof recurringData.description ===
        "string"
    ) {
        payload.description =
            recurringData.description.trim();
    }

    if (
        recurringData.amountCents !==
        undefined
    ) {
        payload.amountCents =
            normalizePositiveInteger(
                recurringData.amountCents,
                "amountCents",
            );
    }

    if (
        recurringData.type !==
        undefined
    ) {
        const type =
            normalizeTransactionType(
                recurringData.type,
            );

        if (!type) {
            throw new Error(
                "O tipo da recorrência deve ser INCOME ou EXPENSE.",
            );
        }

        payload.type = type;
    }

    if (
        typeof recurringData.category ===
        "string"
    ) {
        payload.category =
            recurringData.category.trim();
    }

    if (
        recurringData.notes !==
        undefined
    ) {
        payload.notes =
            typeof recurringData.notes ===
            "string"
                ? recurringData.notes.trim()
                : recurringData.notes;
    }

    if (
        recurringData.startDate !==
        undefined
    ) {
        payload.startDate =
            normalizeDateValue(
                recurringData.startDate,
            );
    }

    if (
        recurringData.endDate !==
        undefined
    ) {
        payload.endDate =
            normalizeDateValue(
                recurringData.endDate,
            );
    }

    if (
        recurringData.dayOfMonth !==
        undefined
    ) {
        payload.dayOfMonth =
            normalizePositiveInteger(
                recurringData.dayOfMonth,
                "dayOfMonth",
            );
    }

    if (
        recurringData.intervalMonths !==
        undefined
    ) {
        payload.intervalMonths =
            normalizePositiveInteger(
                recurringData.intervalMonths,
                "intervalMonths",
            );
    }

    if (
        typeof recurringData.isActive ===
        "boolean"
    ) {
        payload.isActive =
            recurringData.isActive;
    }

    if (
        recurringData.tagIds !==
        undefined
    ) {
        payload.tagIds =
            normalizeTagIds(
                recurringData.tagIds,
            );
    }

    return payload;
}

function normalizeRecurringTransactionId(
    recurringTransactionId,
) {
    return normalizePositiveInteger(
        recurringTransactionId,
        "recurringTransactionId",
    );
}

async function list(filters = {}) {
    const response = await api.get(
        "/recurring-transactions",
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
    recurringTransactionId,
) {
    const normalizedId =
        normalizeRecurringTransactionId(
            recurringTransactionId,
        );

    const response = await api.get(
        `/recurring-transactions/${normalizedId}`,
    );

    return response.data;
}

async function create(
    recurringData,
) {
    const payload =
        normalizeRecurringPayload(
            recurringData,
        );

    const response = await api.post(
        "/recurring-transactions",
        payload,
    );

    return response.data;
}

async function update(
    recurringTransactionId,
    recurringData,
) {
    const normalizedId =
        normalizeRecurringTransactionId(
            recurringTransactionId,
        );

    const payload =
        normalizeRecurringPayload(
            recurringData,
        );

    const response = await api.patch(
        `/recurring-transactions/${normalizedId}`,
        payload,
    );

    return response.data;
}

async function pause(
    recurringTransactionId,
) {
    return update(
        recurringTransactionId,
        {
            isActive: false,
        },
    );
}

async function activate(
    recurringTransactionId,
) {
    return update(
        recurringTransactionId,
        {
            isActive: true,
        },
    );
}

async function remove(
    recurringTransactionId,
) {
    const normalizedId =
        normalizeRecurringTransactionId(
            recurringTransactionId,
        );

    const response =
        await api.delete(
            `/recurring-transactions/${normalizedId}`,
        );

    return response.data;
}

export const recurringTransactionService = {
    list,
    listByType,
    getById,
    create,
    update,
    pause,
    activate,
    remove,
};