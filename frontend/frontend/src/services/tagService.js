import { api } from "./api.js";

const VALID_SCOPES = [
    "INCOME",
    "EXPENSE",
    "BOTH",
];

function normalizeScope(scope) {
    if (typeof scope !== "string") {
        return "";
    }

    const normalizedScope =
        scope.trim().toUpperCase();

    return VALID_SCOPES.includes(
        normalizedScope,
    )
        ? normalizedScope
        : "";
}

function buildTagParams(filters = {}) {
    const params = {};

    const scope =
        normalizeScope(
            filters.scope,
        );

    if (scope) {
        params.scope = scope;
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
        typeof filters.isActive ===
        "boolean"
    ) {
        params.isActive =
            filters.isActive;
    }

    return params;
}

function normalizeTagPayload(
    tagData = {},
) {
    const payload = {};

    if (
        typeof tagData.name ===
        "string"
    ) {
        payload.name =
            tagData.name.trim();
    }

    if (
        typeof tagData.color ===
        "string"
    ) {
        payload.color =
            tagData.color
                .trim()
                .toUpperCase();
    }

    const scope =
        normalizeScope(
            tagData.scope,
        );

    if (scope) {
        payload.scope = scope;
    }

    if (
        typeof tagData.isActive ===
        "boolean"
    ) {
        payload.isActive =
            tagData.isActive;
    }

    return payload;
}

function normalizeTagId(tagId) {
    const normalizedTagId =
        Number(tagId);

    if (
        !Number.isInteger(
            normalizedTagId,
        ) ||
        normalizedTagId <= 0
    ) {
        throw new Error(
            "O identificador da tag é inválido.",
        );
    }

    return normalizedTagId;
}

async function list(filters = {}) {
    const response = await api.get(
        "/tags",
        {
            params:
                buildTagParams(
                    filters,
                ),
        },
    );

    return response.data;
}

async function listForTransactionType(
    type,
    options = {},
) {
    const scope =
        normalizeScope(type);

    if (
        ![
            "INCOME",
            "EXPENSE",
        ].includes(scope)
    ) {
        throw new Error(
            "O tipo deve ser INCOME ou EXPENSE.",
        );
    }

    return list({
        ...options,
        scope,
        isActive:
            options.isActive ??
            true,
    });
}

async function getById(tagId) {
    const normalizedTagId =
        normalizeTagId(tagId);

    const response = await api.get(
        `/tags/${normalizedTagId}`,
    );

    return response.data;
}

async function create(tagData) {
    const payload =
        normalizeTagPayload(
            tagData,
        );

    const response = await api.post(
        "/tags",
        payload,
    );

    return response.data;
}

async function update(
    tagId,
    tagData,
) {
    const normalizedTagId =
        normalizeTagId(tagId);

    const payload =
        normalizeTagPayload(
            tagData,
        );

    const response = await api.patch(
        `/tags/${normalizedTagId}`,
        payload,
    );

    return response.data;
}

async function remove(tagId) {
    const normalizedTagId =
        normalizeTagId(tagId);

    const response =
        await api.delete(
            `/tags/${normalizedTagId}`,
        );

    return response.data;
}

async function activate(tagId) {
    return update(tagId, {
        isActive: true,
    });
}

async function deactivate(tagId) {
    return update(tagId, {
        isActive: false,
    });
}

export const tagService = {
    list,
    listForTransactionType,
    getById,
    create,
    update,
    remove,
    activate,
    deactivate,
};