const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESET_TOKEN_PATTERN =
    /^[a-f0-9]{64}$/i;

const API_URL =
    String(
        import.meta.env
            .VITE_API_URL ??
            "http://localhost:3000/api",
    )
        .trim()
        .replace(
            /\/+$/,
            "",
        );

function createValidationError(
    message,
    code,
) {
    const error =
        new Error(message);

    error.code =
        code;

    error.isValidationError =
        true;

    return error;
}

function createRequestError({
    message,
    code,
    status,
    data,
}) {
    const error =
        new Error(message);

    error.code =
        code;

    error.status =
        status;

    /*
     * Mantém compatibilidade com os
     * getErrorMessage existentes, que
     * utilizam error.response.data.
     */
    error.response = {
        status,
        data,
    };

    return error;
}

function normalizeEmail(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function validateEmail(value) {
    const email =
        normalizeEmail(value);

    if (!email) {
        throw createValidationError(
            "Informe seu endereço de e-mail.",
            "EMAIL_REQUIRED",
        );
    }

    if (
        email.length > 254 ||
        !EMAIL_PATTERN.test(
            email,
        )
    ) {
        throw createValidationError(
            "Informe um endereço de e-mail válido.",
            "INVALID_EMAIL",
        );
    }

    return email;
}

function normalizeToken(value) {
    return String(value ?? "")
        .trim();
}

function validateToken(value) {
    const token =
        normalizeToken(value);

    if (!token) {
        throw createValidationError(
            "O link de recuperação está incompleto.",
            "RESET_TOKEN_REQUIRED",
        );
    }

    if (
        !RESET_TOKEN_PATTERN.test(
            token,
        )
    ) {
        throw createValidationError(
            "O link de recuperação é inválido.",
            "INVALID_RESET_TOKEN",
        );
    }

    return token;
}

function validatePassword(value) {
    const password =
        typeof value === "string"
            ? value
            : "";

    if (!password) {
        throw createValidationError(
            "Informe sua nova senha.",
            "PASSWORD_REQUIRED",
        );
    }

    if (password.length < 8) {
        throw createValidationError(
            "A nova senha deve possuir pelo menos 8 caracteres.",
            "WEAK_PASSWORD",
        );
    }

    if (password.length > 128) {
        throw createValidationError(
            "A nova senha deve possuir no máximo 128 caracteres.",
            "PASSWORD_TOO_LONG",
        );
    }

    if (/\s/.test(password)) {
        throw createValidationError(
            "A nova senha não pode conter espaços.",
            "WEAK_PASSWORD",
        );
    }

    if (!/[a-z]/.test(password)) {
        throw createValidationError(
            "A nova senha deve possuir pelo menos uma letra minúscula.",
            "WEAK_PASSWORD",
        );
    }

    if (!/[A-Z]/.test(password)) {
        throw createValidationError(
            "A nova senha deve possuir pelo menos uma letra maiúscula.",
            "WEAK_PASSWORD",
        );
    }

    if (!/[0-9]/.test(password)) {
        throw createValidationError(
            "A nova senha deve possuir pelo menos um número.",
            "WEAK_PASSWORD",
        );
    }

    if (
        !/[^A-Za-z0-9]/.test(
            password,
        )
    ) {
        throw createValidationError(
            "A nova senha deve possuir pelo menos um caractere especial.",
            "WEAK_PASSWORD",
        );
    }

    return password;
}

function validatePasswordConfirmation(
    password,
    passwordConfirmation,
) {
    const confirmation =
        typeof passwordConfirmation ===
        "string"
            ? passwordConfirmation
            : "";

    if (!confirmation) {
        throw createValidationError(
            "Confirme sua nova senha.",
            "PASSWORD_CONFIRMATION_REQUIRED",
        );
    }

    if (
        password !==
        confirmation
    ) {
        throw createValidationError(
            "A confirmação não corresponde à nova senha.",
            "PASSWORD_CONFIRMATION_MISMATCH",
        );
    }

    return confirmation;
}

async function parseResponse(
    response,
) {
    const contentType =
        response.headers.get(
            "content-type",
        ) ?? "";

    if (
        contentType.includes(
            "application/json",
        )
    ) {
        try {
            return await response.json();
        } catch {
            return {};
        }
    }

    try {
        const text =
            await response.text();

        return text
            ? {
                  message:
                      text,
              }
            : {};
    } catch {
        return {};
    }
}

async function request(
    path,
    {
        method = "GET",
        body,
        signal,
    } = {},
) {
    let response;

    try {
        response =
            await fetch(
                `${API_URL}${path}`,
                {
                    method,

                    headers: {
                        Accept:
                            "application/json",

                        ...(body
                            ? {
                                  "Content-Type":
                                      "application/json",
                              }
                            : {}),
                    },

                    body:
                        body
                            ? JSON.stringify(
                                  body,
                              )
                            : undefined,

                    signal,
                },
            );
    } catch (error) {
        if (
            error?.name ===
            "AbortError"
        ) {
            throw error;
        }

        throw createRequestError({
            message:
                "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",

            code:
                "NETWORK_ERROR",

            status: 0,

            data: {
                error:
                    "Não foi possível conectar ao servidor.",
            },
        });
    }

    const data =
        await parseResponse(
            response,
        );

    if (!response.ok) {
        const message =
            data?.error ??
            data?.message ??
            "Não foi possível concluir a solicitação.";

        throw createRequestError({
            message,

            code:
                data?.code ??
                `HTTP_${response.status}`,

            status:
                response.status,

            data,
        });
    }

    return data;
}

export async function requestPasswordReset(
    emailValue,
) {
    const email =
        validateEmail(
            emailValue,
        );

    return request(
        "/auth/forgot-password",
        {
            method:
                "POST",

            body: {
                email,
            },
        },
    );
}

export async function validatePasswordResetToken(
    tokenValue,
) {
    const token =
        validateToken(
            tokenValue,
        );

    const searchParams =
        new URLSearchParams({
            token,
        });

    const data =
        await request(
            `/auth/reset-password/validate?${searchParams.toString()}`,
        );

    return {
        ...data,

        valid:
            Boolean(
                data?.valid,
            ),
    };
}

export async function resetPassword({
    token: tokenValue,
    password: passwordValue,
    passwordConfirmation:
        passwordConfirmationValue,
} = {}) {
    const token =
        validateToken(
            tokenValue,
        );

    const password =
        validatePassword(
            passwordValue,
        );

    const passwordConfirmation =
        validatePasswordConfirmation(
            password,
            passwordConfirmationValue,
        );

    return request(
        "/auth/reset-password",
        {
            method:
                "POST",

            body: {
                token,
                password,
                passwordConfirmation,
            },
        },
    );
}

export const forgotPassword =
    requestPasswordReset;

export const verifyResetToken =
    validatePasswordResetToken;

export const redefinePassword =
    resetPassword;

export const passwordResetService =
    Object.freeze({
        requestPasswordReset,

        forgotPassword:
            requestPasswordReset,

        validatePasswordResetToken,

        verifyResetToken:
            validatePasswordResetToken,

        resetPassword,

        redefinePassword:
            resetPassword,
    });

export default passwordResetService;