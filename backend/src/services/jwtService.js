import jwt from "jsonwebtoken";

import {
    env,
} from "../config/env.js";

const JWT_ALGORITHM =
    "HS256";

function createJwtError({
    message,
    code,
    statusCode = 401,
    cause,
}) {
    const error =
        new Error(
            message,
            cause
                ? {
                      cause,
                  }
                : undefined,
        );

    error.code =
        code;

    error.statusCode =
        statusCode;

    return error;
}

function normalizeUserId(
    value,
) {
    const userId =
        Number(value);

    if (
        !Number.isInteger(
            userId,
        ) ||
        userId <= 0
    ) {
        throw createJwtError({
            message:
                "Não foi possível gerar o token de autenticação.",

            code:
                "INVALID_TOKEN_USER",

            statusCode: 500,
        });
    }

    return userId;
}

function normalizeTokenVersion(
    value,
) {
    const tokenVersion =
        Number(value ?? 0);

    if (
        !Number.isInteger(
            tokenVersion,
        ) ||
        tokenVersion < 0
    ) {
        throw createJwtError({
            message:
                "A versão do token de autenticação é inválida.",

            code:
                "INVALID_TOKEN_VERSION",

            statusCode: 500,
        });
    }

    return tokenVersion;
}

function normalizeRole(
    value,
) {
    const role =
        String(
            value ?? "USER",
        )
            .trim()
            .toUpperCase();

    if (
        ![
            "USER",
            "ADMIN",
        ].includes(role)
    ) {
        return "USER";
    }

    return role;
}

function normalizeToken(
    value,
) {
    const token =
        String(value ?? "")
            .trim();

    if (!token) {
        throw createJwtError({
            message:
                "Token de autenticação não informado.",

            code:
                "AUTH_TOKEN_MISSING",
        });
    }

    return token;
}

export function generateAuthToken(
    user,
) {
    if (
        !user ||
        typeof user !==
            "object"
    ) {
        throw createJwtError({
            message:
                "Não foi possível gerar o token de autenticação.",

            code:
                "INVALID_TOKEN_USER",

            statusCode: 500,
        });
    }

    const userId =
        normalizeUserId(
            user.id,
        );

    const tokenVersion =
        normalizeTokenVersion(
            user.tokenVersion,
        );

    const role =
        normalizeRole(
            user.role,
        );

    return jwt.sign(
        {
            tokenVersion,
            role,
        },
        env.jwt.secret,
        {
            algorithm:
                JWT_ALGORITHM,

            expiresIn:
                env.jwt.expiresIn,

            issuer:
                env.jwt.issuer,

            audience:
                env.jwt.audience,

            subject:
                String(
                    userId,
                ),
        },
    );
}

export function verifyAuthToken(
    tokenValue,
) {
    const token =
        normalizeToken(
            tokenValue,
        );

    try {
        const payload =
            jwt.verify(
                token,
                env.jwt.secret,
                {
                    algorithms: [
                        JWT_ALGORITHM,
                    ],

                    issuer:
                        env.jwt.issuer,

                    audience:
                        env.jwt.audience,
                },
            );

        if (
            !payload ||
            typeof payload ===
                "string"
        ) {
            throw createJwtError({
                message:
                    "Token de autenticação inválido.",

                code:
                    "AUTH_TOKEN_INVALID",
            });
        }

        const userId =
            Number(
                payload.sub,
            );

        const tokenVersion =
            Number(
                payload.tokenVersion,
            );

        if (
            !Number.isInteger(
                userId,
            ) ||
            userId <= 0
        ) {
            throw createJwtError({
                message:
                    "Token de autenticação inválido.",

                code:
                    "AUTH_TOKEN_INVALID",
            });
        }

        if (
            !Number.isInteger(
                tokenVersion,
            ) ||
            tokenVersion < 0
        ) {
            throw createJwtError({
                message:
                    "Token de autenticação inválido.",

                code:
                    "AUTH_TOKEN_INVALID",
            });
        }

        return {
            userId,
            tokenVersion,

            role:
                normalizeRole(
                    payload.role,
                ),

            issuedAt:
                payload.iat,

            expiresAt:
                payload.exp,

            issuer:
                payload.iss,

            audience:
                payload.aud,
        };
    } catch (error) {
        if (
            error?.code ===
            "AUTH_TOKEN_INVALID"
        ) {
            throw error;
        }

        if (
            error?.name ===
            "TokenExpiredError"
        ) {
            throw createJwtError({
                message:
                    "Sua sessão expirou. Entre novamente para continuar.",

                code:
                    "AUTH_TOKEN_EXPIRED",

                cause:
                    error,
            });
        }

        if (
            error?.name ===
            "NotBeforeError"
        ) {
            throw createJwtError({
                message:
                    "Este token de autenticação ainda não está disponível.",

                code:
                    "AUTH_TOKEN_NOT_ACTIVE",

                cause:
                    error,
            });
        }

        throw createJwtError({
            message:
                "Token de autenticação inválido.",

            code:
                "AUTH_TOKEN_INVALID",

            cause:
                error,
        });
    }
}

export function extractBearerToken(
    authorizationHeader,
) {
    const header =
        String(
            authorizationHeader ??
                "",
        ).trim();

    if (!header) {
        throw createJwtError({
            message:
                "Token de autenticação não informado.",

            code:
                "AUTH_TOKEN_MISSING",
        });
    }

    const match =
        header.match(
            /^Bearer\s+(.+)$/i,
        );

    if (
        !match ||
        !match[1]
    ) {
        throw createJwtError({
            message:
                "O token de autenticação deve ser enviado no formato Bearer.",

            code:
                "AUTH_TOKEN_FORMAT_INVALID",
        });
    }

    return normalizeToken(
        match[1],
    );
}