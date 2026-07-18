export function getApiErrorMessage(error, fallbackMessage = "Não foi possível concluir a operação.") {
    const responseData = error?.response?.data;

    if (typeof responseData?.error === "string" && responseData.error.trim()) {
        return responseData.error;
    }

    if (typeof responseData?.message === "string" && responseData.message.trim()) {
        return responseData.message;
    }

    if (typeof error?.message === "string" && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
}
