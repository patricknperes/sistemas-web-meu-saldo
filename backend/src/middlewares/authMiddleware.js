import {
    prisma,
} from "../lib/prisma.js";

import {
    extractBearerToken,
    verifyAuthToken,
} from "../services/jwtService.js";

const SESSION_INVALID_MESSAGE =
    "Sua sessão não é mais válida. Entre novamente para continuar.";

function sendUnauthorizedResponse(
    response,
    {
        message =
            "Você precisa estar autenticado para acessar este recurso.",

        code =
            "UNAUTHORIZED",
    } = {},
) {
    response.set({
        "Cache-Control":
            "no-store, no-cache, must-revalidate, private",

        Pragma:
            "no-cache",

        Expires:
            "0",
    });

    return response
        .status(401)
        .json({
            error:
                message,

            code,
        });
}

function getAuthenticationErrorResponse(
    error,
) {
    switch (error?.code) {
        case "AUTH_TOKEN_MISSING":
            return {
                message:
                    "Token de autenticação não informado.",

                code:
                    "AUTH_TOKEN_MISSING",
            };

        case "AUTH_TOKEN_FORMAT_INVALID":
            return {
                message:
                    "O token deve ser enviado no formato Bearer.",

                code:
                    "AUTH_TOKEN_FORMAT_INVALID",
            };

        case "AUTH_TOKEN_EXPIRED":
            return {
                message:
                    "Sua sessão expirou. Entre novamente para continuar.",

                code:
                    "AUTH_TOKEN_EXPIRED",
            };

        case "AUTH_TOKEN_NOT_ACTIVE":
        case "AUTH_TOKEN_INVALID":
            return {
                message:
                    "Token de autenticação inválido.",

                code:
                    "AUTH_TOKEN_INVALID",
            };

        default:
            return null;
    }
}

export async function authMiddleware(
    request,
    response,
    next,
) {
    try {
        const token =
            extractBearerToken(
                request.headers
                    .authorization,
            );

        const tokenPayload =
            verifyAuthToken(
                token,
            );

        const user =
            await prisma.user.findUnique({
                where: {
                    id:
                        tokenPayload.userId,
                },

                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    tokenVersion: true,
                    googleId: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

        if (!user) {
            return sendUnauthorizedResponse(
                response,
                {
                    message:
                        SESSION_INVALID_MESSAGE,

                    code:
                        "AUTH_USER_NOT_FOUND",
                },
            );
        }

        if (!user.isActive) {
            return sendUnauthorizedResponse(
                response,
                {
                    message:
                        "Sua conta está desativada.",

                    code:
                        "AUTH_USER_INACTIVE",
                },
            );
        }

        if (
            tokenPayload.tokenVersion !==
            user.tokenVersion
        ) {
            return sendUnauthorizedResponse(
                response,
                {
                    message:
                        SESSION_INVALID_MESSAGE,

                    code:
                        "AUTH_SESSION_INVALIDATED",
                },
            );
        }

        /*
         * Mantém diferentes propriedades para
         * compatibilidade com controllers e
         * middlewares que já existiam no projeto.
         */
        request.userId =
            user.id;

        request.user =
            user;

        request.authUser =
            user;

        request.auth = {
            token,

            userId:
                user.id,

            tokenVersion:
                user.tokenVersion,

            role:
                user.role,

            issuedAt:
                tokenPayload.issuedAt,

            expiresAt:
                tokenPayload.expiresAt,
        };

        return next();
    } catch (error) {
        const authenticationError =
            getAuthenticationErrorResponse(
                error,
            );

        if (
            authenticationError
        ) {
            return sendUnauthorizedResponse(
                response,
                authenticationError,
            );
        }

        /*
         * Erros inesperados, como indisponibilidade
         * do banco, seguem para o middleware global.
         */
        return next(error);
    }
}

export default authMiddleware;