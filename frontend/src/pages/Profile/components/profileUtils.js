import {
    evaluatePassword,
} from "../../../components/ui/auth/passwordUtils.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data;

    if (typeof responseData?.error === "string") {
        return responseData.error;
    }

    if (typeof responseData?.message === "string") {
        return responseData.message;
    }

    if (typeof error?.message === "string" && error.message) {
        return error.message;
    }

    return fallbackMessage;
}

function getAccountAccessMethod(user) {
    const hasPassword = user?.authMethods?.password ?? true;
    const usesGoogle = user?.authMethods?.google ?? false;

    if (usesGoogle && hasPassword) {
        return "Google e senha";
    }

    if (usesGoogle) {
        return "Google";
    }

    return "E-mail e senha";
}

function getAccountStatus(user) {
    if (user?.status) {
        return user.status;
    }

    if (user?.active === false) {
        return "INACTIVE";
    }

    return "ACTIVE";
}

function isValidEmail(email) {
    return EMAIL_PATTERN.test(String(email ?? "").trim());
}

function isEmailChanged(formEmail, currentEmail) {
    return String(formEmail ?? "").trim().toLowerCase()
        !== String(currentEmail ?? "").trim().toLowerCase();
}

function getPasswordValidation(password) {
    return evaluatePassword(password);
}

function formatAccountId(id) {
    return id === null || id === undefined || id === ""
        ? "Não informado"
        : `#${id}`;
}

export {
    formatAccountId,
    getAccountAccessMethod,
    getAccountStatus,
    getErrorMessage,
    getPasswordValidation,
    isEmailChanged,
    isValidEmail,
};
