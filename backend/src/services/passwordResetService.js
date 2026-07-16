import {
    createHash,
    randomBytes,
} from "node:crypto";

import bcrypt from "bcryptjs";

import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

import {
    createPasswordResetEmail,
} from "../templates/passwordResetEmail.js";

import {
    sendEmail,
} from "./emailService.js";

const TOKEN_BYTES = 32;
const PASSWORD_HASH_ROUNDS = 12;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const MINIMUM_REQUEST_DURATION_MS =
    500;

const GENERIC_REQUEST_MESSAGE =
    "Caso exista uma conta vinculada a esse e-mail, enviaremos as instruções para redefinir a senha.";

const RESET_SUCCESS_MESSAGE =
    "Senha redefinida com sucesso. Você já pode entrar com a nova senha.";

function createServiceError({
    message,
    statusCode = 400,
    code = "PASSWORD_RESET_ERROR",
}) {
    const error =
        new Error(message);

    error.statusCode =
        statusCode;

    error.code =
        code;

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

    const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email,
        );

    if (!validEmail) {
        throw createServiceError({
            message:
                "Informe um endereço de e-mail válido.",

            statusCode: 400,

            code:
                "INVALID_EMAIL",
        });
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

    /*
     * O token gerado possui 32 bytes
     * representados em hexadecimal:
     *
     * 32 bytes × 2 caracteres = 64 caracteres.
     */
    const validToken =
        /^[a-f0-9]{64}$/i.test(
            token,
        );

    if (!validToken) {
        throw createServiceError({
            message:
                "O link de recuperação é inválido ou está incompleto.",

            statusCode: 400,

            code:
                "INVALID_RESET_TOKEN",
        });
    }

    return token;
}

function validatePassword(value) {
    const password =
        typeof value === "string"
            ? value
            : "";

    if (password.length < 8) {
        throw createServiceError({
            message:
                "A nova senha deve possuir pelo menos 8 caracteres.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (password.length > 128) {
        throw createServiceError({
            message:
                "A nova senha deve possuir no máximo 128 caracteres.",

            statusCode: 400,

            code:
                "PASSWORD_TOO_LONG",
        });
    }

    if (
        Buffer.byteLength(
            password,
            "utf8",
        ) >
        MAX_BCRYPT_PASSWORD_BYTES
    ) {
        throw createServiceError({
            message:
                "A nova senha é muito longa. Utilize uma senha menor.",

            statusCode: 400,

            code:
                "PASSWORD_TOO_LONG",
        });
    }

    if (/\s/.test(password)) {
        throw createServiceError({
            message:
                "A nova senha não pode conter espaços.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[a-z]/.test(password)) {
        throw createServiceError({
            message:
                "A nova senha deve possuir pelo menos uma letra minúscula.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw createServiceError({
            message:
                "A nova senha deve possuir pelo menos uma letra maiúscula.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[0-9]/.test(password)) {
        throw createServiceError({
            message:
                "A nova senha deve possuir pelo menos um número.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (
        !/[^A-Za-z0-9]/.test(
            password,
        )
    ) {
        throw createServiceError({
            message:
                "A nova senha deve possuir pelo menos um caractere especial.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    return password;
}

function validatePasswordConfirmation(
    password,
    passwordConfirmation,
) {
    if (
        passwordConfirmation ===
        undefined
    ) {
        return;
    }

    if (
        password !==
        passwordConfirmation
    ) {
        throw createServiceError({
            message:
                "A confirmação não corresponde à nova senha.",

            statusCode: 400,

            code:
                "PASSWORD_CONFIRMATION_MISMATCH",
        });
    }
}

function generateRawToken() {
    return randomBytes(
        TOKEN_BYTES,
    ).toString("hex");
}

function hashResetToken(token) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

function calculateExpirationDate() {
    const expirationDate =
        new Date();

    expirationDate.setMinutes(
        expirationDate.getMinutes() +
            env.passwordResetExpiresMinutes,
    );

    return expirationDate;
}

function createResetUrl(rawToken) {
    const resetUrl =
        new URL(
            "/redefinir-senha",
            env.frontendUrl,
        );

    resetUrl.searchParams.set(
        "token",
        rawToken,
    );

    return resetUrl.toString();
}

function wait(milliseconds) {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds,
            );
        },
    );
}

async function respectMinimumDuration(
    startedAt,
) {
    const elapsedTime =
        Date.now() - startedAt;

    const remainingTime =
        MINIMUM_REQUEST_DURATION_MS -
        elapsedTime;

    if (remainingTime > 0) {
        await wait(
            remainingTime,
        );
    }
}

function isResetTokenAvailable(
    resetToken,
) {
    if (!resetToken) {
        return false;
    }

    if (resetToken.usedAt) {
        return false;
    }

    const expiresAt =
        new Date(
            resetToken.expiresAt,
        );

    if (
        Number.isNaN(
            expiresAt.getTime(),
        )
    ) {
        return false;
    }

    return (
        expiresAt.getTime() >
        Date.now()
    );
}

export async function requestPasswordReset(
    emailValue,
) {
    const startedAt =
        Date.now();

    const email =
        validateEmail(
            emailValue,
        );

    try {
        const user =
            await prisma.user.findUnique({
                where: {
                    email,
                },

                select: {
                    id: true,
                    name: true,
                    email: true,
                    isActive: true,
                },
            });

        /*
         * Não informamos se a conta existe,
         * está inativa ou não está cadastrada.
         */
        if (
            !user ||
            !user.isActive
        ) {
            return {
                message:
                    GENERIC_REQUEST_MESSAGE,
            };
        }

        const rawToken =
            generateRawToken();

        const tokenHash =
            hashResetToken(
                rawToken,
            );

        const expiresAt =
            calculateExpirationDate();

        /*
         * Cada nova solicitação invalida
         * os links anteriores do usuário.
         */
        await prisma.$transaction([
            prisma.passwordResetToken.deleteMany({
                where: {
                    userId:
                        user.id,
                },
            }),

            prisma.passwordResetToken.create({
                data: {
                    tokenHash,

                    expiresAt,

                    userId:
                        user.id,
                },
            }),
        ]);

        const resetUrl =
            createResetUrl(
                rawToken,
            );

        const emailContent =
            createPasswordResetEmail({
                userName:
                    user.name,

                resetUrl,

                expirationMinutes:
                    env.passwordResetExpiresMinutes,
            });

        try {
            await sendEmail({
                to:
                    user.email,

                subject:
                    emailContent.subject,

                text:
                    emailContent.text,

                html:
                    emailContent.html,
            });
        } catch (error) {
            /*
             * Se o envio falhar, removemos
             * o token que não chegou ao usuário.
             */
            await prisma
                .passwordResetToken
                .deleteMany({
                    where: {
                        tokenHash,
                    },
                })
                .catch(
                    () => {
                        // Preserva o erro original do envio.
                    },
                );

            throw createServiceError({
                message:
                    "Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.",

                statusCode: 503,

                code:
                    "PASSWORD_RESET_EMAIL_FAILED",
            });
        }

        return {
            message:
                GENERIC_REQUEST_MESSAGE,
        };
    } finally {
        /*
         * Reduz a diferença de tempo entre
         * e-mails existentes e inexistentes.
         */
        await respectMinimumDuration(
            startedAt,
        );
    }
}

export async function validatePasswordResetToken(
    tokenValue,
) {
    const token =
        validateToken(
            tokenValue,
        );

    const tokenHash =
        hashResetToken(
            token,
        );

    const resetToken =
        await prisma
            .passwordResetToken
            .findUnique({
                where: {
                    tokenHash,
                },

                select: {
                    usedAt: true,
                    expiresAt: true,

                    user: {
                        select: {
                            isActive: true,
                        },
                    },
                },
            });

    const valid =
        isResetTokenAvailable(
            resetToken,
        ) &&
        resetToken.user.isActive;

    return {
        valid,
    };
}

export async function resetPassword({
    token: tokenValue,
    password: passwordValue,
    passwordConfirmation,
} = {}) {
    const token =
        validateToken(
            tokenValue,
        );

    const password =
        validatePassword(
            passwordValue,
        );

    validatePasswordConfirmation(
        password,
        passwordConfirmation,
    );

    const tokenHash =
        hashResetToken(
            token,
        );

    const resetToken =
        await prisma
            .passwordResetToken
            .findUnique({
                where: {
                    tokenHash,
                },

                select: {
                    id: true,
                    userId: true,
                    usedAt: true,
                    expiresAt: true,

                    user: {
                        select: {
                            isActive: true,
                        },
                    },
                },
            });

    if (
        !isResetTokenAvailable(
            resetToken,
        ) ||
        !resetToken.user.isActive
    ) {
        throw createServiceError({
            message:
                "O link de recuperação é inválido, expirou ou já foi utilizado.",

            statusCode: 400,

            code:
                "RESET_TOKEN_UNAVAILABLE",
        });
    }

    /*
     * O hash da senha é calculado antes
     * da transação para mantê-la curta.
     */
    const passwordHash =
        await bcrypt.hash(
            password,
            PASSWORD_HASH_ROUNDS,
        );

    const now =
        new Date();

    await prisma.$transaction(
        async (transaction) => {
            /*
             * Consome o token somente caso ele
             * continue válido no momento da gravação.
             *
             * Isso evita que duas solicitações
             * utilizem o mesmo token simultaneamente.
             */
            const consumedToken =
                await transaction
                    .passwordResetToken
                    .updateMany({
                        where: {
                            id:
                                resetToken.id,

                            userId:
                                resetToken.userId,

                            tokenHash,

                            usedAt:
                                null,

                            expiresAt: {
                                gt:
                                    now,
                            },
                        },

                        data: {
                            usedAt:
                                now,
                        },
                    });

            if (
                consumedToken.count !==
                1
            ) {
                throw createServiceError({
                    message:
                        "O link de recuperação é inválido, expirou ou já foi utilizado.",

                    statusCode: 400,

                    code:
                        "RESET_TOKEN_UNAVAILABLE",
                });
            }

            const updatedUser =
                await transaction
                    .user
                    .updateMany({
                        where: {
                            id:
                                resetToken.userId,

                            isActive:
                                true,
                        },

                        data: {
                            passwordHash,

                            tokenVersion: {
                                increment:
                                    1,
                            },
                        },
                    });

            if (
                updatedUser.count !==
                1
            ) {
                throw createServiceError({
                    message:
                        "Não foi possível redefinir a senha desta conta.",

                    statusCode: 400,

                    code:
                        "USER_UNAVAILABLE",
                });
            }

            /*
             * Invalida qualquer outro token
             * ainda aberto para o mesmo usuário.
             */
            await transaction
                .passwordResetToken
                .updateMany({
                    where: {
                        userId:
                            resetToken.userId,

                        usedAt:
                            null,
                    },

                    data: {
                        usedAt:
                            now,
                    },
                });
        },
    );

    return {
        message:
            RESET_SUCCESS_MESSAGE,
    };
}

export async function deleteExpiredPasswordResetTokens() {
    const result =
        await prisma
            .passwordResetToken
            .deleteMany({
                where: {
                    OR: [
                        {
                            expiresAt: {
                                lte:
                                    new Date(),
                            },
                        },

                        {
                            usedAt: {
                                not:
                                    null,
                            },
                        },
                    ],
                },
            });

    return {
        deletedCount:
            result.count,
    };
}