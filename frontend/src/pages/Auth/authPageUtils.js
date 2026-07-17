export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

export function getErrorMessage(
    error,
    fallbackMessage = "Não foi possível concluir esta operação."
) {
    const responseData = error?.response?.data;

    if (typeof responseData?.error === "string" && responseData.error) {
        return responseData.error;
    }

    if (typeof responseData?.message === "string" && responseData.message) {
        return responseData.message;
    }

    if (typeof error?.message === "string" && error.message) {
        return error.message;
    }

    return fallbackMessage;
}

export function validateEmail(value) {
    const email = normalizeEmail(value);

    if (!email) {
        return {
            value: email,
            error: "Informe seu endereço de e-mail.",
        };
    }

    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return {
            value: email,
            error: "Informe um endereço de e-mail válido.",
        };
    }

    return {
        value: email,
        error: "",
    };
}

export function createNotification(variant = "info", description = "") {
    return {
        open: Boolean(description),
        variant,
        description,
    };
}
