import bcrypt from "bcryptjs";

import {
    prisma,
} from "../lib/prisma.js";

import {
    generateAuthToken,
} from "./jwtService.js";

const PASSWORD_HASH_ROUNDS =
    12;

const MAX_BCRYPT_PASSWORD_BYTES =
    72;

const AUTH_USER_SELECT =
    Object.freeze({
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        googleId: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        tokenVersion: true,
        createdAt: true,
        updatedAt: true,
    });

function createAuthError({
    message,
    statusCode = 400,
    code = "AUTH_ERROR",
}) {
    const error =
        new Error(message);

    error.statusCode =
        statusCode;

    error.code =
        code;

    return error;
}

function normalizeName(value) {
    return String(value ?? "")
        .trim()
        .replace(
            /\s+/g,
            " ",
        );
}

function validateName(value) {
    const name =
        normalizeName(value);

    if (name.length < 2) {
        throw createAuthError({
            message:
                "Informe um nome válido.",

            statusCode: 400,

            code:
                "INVALID_NAME",
        });
    }

    if (name.length > 120) {
        throw createAuthError({
            message:
                "O nome deve possuir no máximo 120 caracteres.",

            statusCode: 400,

            code:
                "NAME_TOO_LONG",
        });
    }

    return name;
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
        throw createAuthError({
            message:
                "Informe um endereço de e-mail válido.",

            statusCode: 400,

            code:
                "INVALID_EMAIL",
        });
    }

    if (email.length > 254) {
        throw createAuthError({
            message:
                "O endereço de e-mail informado é muito longo.",

            statusCode: 400,

            code:
                "EMAIL_TOO_LONG",
        });
    }

    return email;
}

function validatePassword(value) {
    const password =
        typeof value === "string"
            ? value
            : "";

    if (password.length < 8) {
        throw createAuthError({
            message:
                "A senha deve possuir pelo menos 8 caracteres.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (password.length > 128) {
        throw createAuthError({
            message:
                "A senha deve possuir no máximo 128 caracteres.",

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
        throw createAuthError({
            message:
                "A senha informada é muito longa.",

            statusCode: 400,

            code:
                "PASSWORD_TOO_LONG",
        });
    }

    if (/\s/.test(password)) {
        throw createAuthError({
            message:
                "A senha não pode conter espaços.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[a-z]/.test(password)) {
        throw createAuthError({
            message:
                "A senha deve possuir pelo menos uma letra minúscula.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw createAuthError({
            message:
                "A senha deve possuir pelo menos uma letra maiúscula.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    if (!/[0-9]/.test(password)) {
        throw createAuthError({
            message:
                "A senha deve possuir pelo menos um número.",

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
        throw createAuthError({
            message:
                "A senha deve possuir pelo menos um caractere especial.",

            statusCode: 400,

            code:
                "WEAK_PASSWORD",
        });
    }

    return password;
}

function normalizeGoogleId(value) {
    return String(value ?? "")
        .trim();
}

function normalizeAvatarUrl(value) {
    const avatarUrl =
        String(value ?? "")
            .trim();

    if (!avatarUrl) {
        return null;
    }

    try {
        const parsedUrl =
            new URL(avatarUrl);

        if (
            ![
                "http:",
                "https:",
            ].includes(
                parsedUrl.protocol,
            )
        ) {
            return null;
        }

        return avatarUrl;
    } catch {
        return null;
    }
}

function getGoogleEmail(profile) {
    if (profile?.email) {
        return profile.email;
    }

    if (
        Array.isArray(
            profile?.emails,
        )
    ) {
        return (
            profile.emails[0]
                ?.value ??
            ""
        );
    }

    return "";
}

function getGoogleAvatar(profile) {
    const directAvatar =
        profile?.avatarUrl ??
        profile?.picture;

    if (directAvatar) {
        return directAvatar;
    }

    if (
        Array.isArray(
            profile?.photos,
        )
    ) {
        return (
            profile.photos[0]
                ?.value ??
            ""
        );
    }

    return "";
}

function getGoogleName(profile) {
    if (
        typeof profile?.name ===
        "string"
    ) {
        return profile.name;
    }

    if (profile?.displayName) {
        return profile.displayName;
    }

    const givenName =
        profile?.name
            ?.givenName ??
        profile?.givenName ??
        "";

    const familyName =
        profile?.name
            ?.familyName ??
        profile?.familyName ??
        "";

    return [
        givenName,
        familyName,
    ]
        .filter(Boolean)
        .join(" ");
}

function normalizeGoogleProfile(
    profile,
) {
    if (
        !profile ||
        typeof profile !==
            "object"
    ) {
        throw createAuthError({
            message:
                "Não foi possível obter os dados da conta Google.",

            statusCode: 400,

            code:
                "INVALID_GOOGLE_PROFILE",
        });
    }

    const googleId =
        normalizeGoogleId(
            profile.googleId ??
            profile.id ??
            profile.sub,
        );

    if (!googleId) {
        throw createAuthError({
            message:
                "A conta Google não forneceu um identificador válido.",

            statusCode: 400,

            code:
                "INVALID_GOOGLE_ID",
        });
    }

    const email =
        validateEmail(
            getGoogleEmail(
                profile,
            ),
        );

    const rawName =
        normalizeName(
            getGoogleName(
                profile,
            ),
        );

    const emailName =
        email.split("@")[0];

    const name =
        rawName.length >= 2
            ? rawName
            : emailName;

    const avatarUrl =
        normalizeAvatarUrl(
            getGoogleAvatar(
                profile,
            ),
        );

    return {
        googleId,
        email,
        name,
        avatarUrl,
    };
}

function sanitizeAuthenticatedUser(
    user,
) {
    if (!user) {
        return null;
    }

    const {
        passwordHash,
        tokenVersion,
        googleId,
        ...safeUser
    } = user;

    return {
        ...safeUser,

        usesGoogle:
            Boolean(
                googleId,
            ),

        hasLocalPassword:
            Boolean(
                passwordHash,
            ),
    };
}

export function createAuthenticationResult(
    user,
) {
    if (
        !user ||
        typeof user !==
            "object"
    ) {
        throw createAuthError({
            message:
                "Não foi possível concluir a autenticação.",

            statusCode: 500,

            code:
                "AUTH_RESULT_ERROR",
        });
    }

    return {
        user:
            sanitizeAuthenticatedUser(
                user,
            ),

        token:
            generateAuthToken(
                user,
            ),
    };
}

async function seedDefaultTagsSafely(
    userId,
) {
    try {
        const tagServiceModule =
            await import(
                "./tagService.js"
            );

        const seedFunction =
            tagServiceModule
                .seedDefaultTagsForUser ??
            tagServiceModule
                .ensureDefaultTagsForUser ??
            tagServiceModule
                .createDefaultTagsForUser ??
            tagServiceModule
                .seedDefaultTags;

        if (
            typeof seedFunction !==
            "function"
        ) {
            console.warn(
                "[Autenticação] Nenhuma função de criação das tags padrão foi encontrada.",
            );

            return;
        }

        await seedFunction(
            userId,
        );
    } catch (error) {
        /*
         * O cadastro não será cancelado caso
         * ocorra um erro na criação das tags.
         */
        console.error(
            "[Autenticação] Não foi possível criar as tags padrão do usuário.",
        );

        console.error(
            error?.message ??
            error,
        );
    }
}

function isUniqueConstraintError(
    error,
) {
    return (
        error?.code ===
        "P2002"
    );
}

function assertUserIsActive(
    user,
) {
    if (!user?.isActive) {
        throw createAuthError({
            message:
                "Esta conta está desativada.",

            statusCode: 403,

            code:
                "USER_INACTIVE",
        });
    }
}

export async function registerUser({
    name: nameValue,
    email: emailValue,
    password: passwordValue,
} = {}) {
    const name =
        validateName(
            nameValue,
        );

    const email =
        validateEmail(
            emailValue,
        );

    const password =
        validatePassword(
            passwordValue,
        );

    const existingUser =
        await prisma.user.findUnique({
            where: {
                email,
            },

            select: {
                id: true,
                googleId: true,
                passwordHash: true,
            },
        });

    if (existingUser) {
        throw createAuthError({
            message:
                existingUser.googleId &&
                !existingUser.passwordHash
                    ? "Este e-mail já está vinculado a uma conta Google."
                    : "Já existe uma conta cadastrada com este e-mail.",

            statusCode: 409,

            code:
                "EMAIL_ALREADY_REGISTERED",
        });
    }

    const passwordHash =
        await bcrypt.hash(
            password,
            PASSWORD_HASH_ROUNDS,
        );

    let user;

    try {
        user =
            await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                },

                select:
                    AUTH_USER_SELECT,
            });
    } catch (error) {
        if (
            isUniqueConstraintError(
                error,
            )
        ) {
            throw createAuthError({
                message:
                    "Já existe uma conta cadastrada com este e-mail.",

                statusCode: 409,

                code:
                    "EMAIL_ALREADY_REGISTERED",
            });
        }

        throw error;
    }

    await seedDefaultTagsSafely(
        user.id,
    );

    return createAuthenticationResult(
        user,
    );
}

export async function loginUser({
    email: emailValue,
    password: passwordValue,
} = {}) {
    const email =
        validateEmail(
            emailValue,
        );

    const password =
        typeof passwordValue ===
        "string"
            ? passwordValue
            : "";

    if (!password) {
        throw createAuthError({
            message:
                "Informe sua senha.",

            statusCode: 400,

            code:
                "PASSWORD_REQUIRED",
        });
    }

    const user =
        await prisma.user.findUnique({
            where: {
                email,
            },

            select:
                AUTH_USER_SELECT,
        });

    /*
     * Mensagem genérica para não informar
     * se o e-mail está ou não cadastrado.
     */
    if (
        !user ||
        !user.passwordHash
    ) {
        throw createAuthError({
            message:
                "E-mail ou senha incorretos.",

            statusCode: 401,

            code:
                "INVALID_CREDENTIALS",
        });
    }

    assertUserIsActive(
        user,
    );

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.passwordHash,
        );

    if (!passwordMatches) {
        throw createAuthError({
            message:
                "E-mail ou senha incorretos.",

            statusCode: 401,

            code:
                "INVALID_CREDENTIALS",
        });
    }

    return createAuthenticationResult(
        user,
    );
}

async function upsertGoogleUser(
    profile,
) {
    const googleProfile =
        normalizeGoogleProfile(
            profile,
        );

    const [
        userByGoogleId,
        userByEmail,
    ] =
        await Promise.all([
            prisma.user.findUnique({
                where: {
                    googleId:
                        googleProfile.googleId,
                },

                select:
                    AUTH_USER_SELECT,
            }),

            prisma.user.findUnique({
                where: {
                    email:
                        googleProfile.email,
                },

                select:
                    AUTH_USER_SELECT,
            }),
        ]);

    if (
        userByGoogleId &&
        userByEmail &&
        userByGoogleId.id !==
            userByEmail.id
    ) {
        throw createAuthError({
            message:
                "Não foi possível vincular esta conta Google porque o e-mail já pertence a outro usuário.",

            statusCode: 409,

            code:
                "GOOGLE_ACCOUNT_CONFLICT",
        });
    }

    if (userByGoogleId) {
        assertUserIsActive(
            userByGoogleId,
        );

        const updateData = {};

        if (
            googleProfile.avatarUrl &&
            googleProfile.avatarUrl !==
                userByGoogleId.avatarUrl
        ) {
            updateData.avatarUrl =
                googleProfile.avatarUrl;
        }

        if (
            googleProfile.name &&
            googleProfile.name !==
                userByGoogleId.name
        ) {
            updateData.name =
                googleProfile.name;
        }

        if (
            Object.keys(
                updateData,
            ).length === 0
        ) {
            return userByGoogleId;
        }

        return prisma.user.update({
            where: {
                id:
                    userByGoogleId.id,
            },

            data:
                updateData,

            select:
                AUTH_USER_SELECT,
        });
    }

    if (userByEmail) {
        assertUserIsActive(
            userByEmail,
        );

        if (
            userByEmail.googleId &&
            userByEmail.googleId !==
                googleProfile.googleId
        ) {
            throw createAuthError({
                message:
                    "Este e-mail já está vinculado a outra conta Google.",

                statusCode: 409,

                code:
                    "GOOGLE_ACCOUNT_CONFLICT",
            });
        }

        return prisma.user.update({
            where: {
                id:
                    userByEmail.id,
            },

            data: {
                googleId:
                    googleProfile.googleId,

                ...(googleProfile.avatarUrl
                    ? {
                          avatarUrl:
                              googleProfile.avatarUrl,
                      }
                    : {}),
            },

            select:
                AUTH_USER_SELECT,
        });
    }

    let createdUser;

    try {
        createdUser =
            await prisma.user.create({
                data: {
                    name:
                        googleProfile.name,

                    email:
                        googleProfile.email,

                    googleId:
                        googleProfile.googleId,

                    avatarUrl:
                        googleProfile.avatarUrl,

                    passwordHash:
                        null,
                },

                select:
                    AUTH_USER_SELECT,
            });
    } catch (error) {
        if (
            !isUniqueConstraintError(
                error,
            )
        ) {
            throw error;
        }

        /*
         * Trata autenticações simultâneas
         * para a mesma conta Google.
         */
        const existingUser =
            await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            googleId:
                                googleProfile.googleId,
                        },

                        {
                            email:
                                googleProfile.email,
                        },
                    ],
                },

                select:
                    AUTH_USER_SELECT,
            });

        if (!existingUser) {
            throw error;
        }

        assertUserIsActive(
            existingUser,
        );

        createdUser =
            existingUser;
    }

    await seedDefaultTagsSafely(
        createdUser.id,
    );

    return createdUser;
}

export async function findOrCreateGoogleUser(
    profile,
) {
    return upsertGoogleUser(
        profile,
    );
}

export async function authenticateGoogleUser(
    profile,
) {
    const user =
        await upsertGoogleUser(
            profile,
        );

    return createAuthenticationResult(
        user,
    );
}

/*
 * Nome utilizado atualmente pelo
 * authController.js do projeto.
 */
export async function authenticateWithGoogle(
    profile,
) {
    return authenticateGoogleUser(
        profile,
    );
}

export async function getAuthenticatedUser(
    userIdValue,
) {
    const userId =
        Number(
            userIdValue,
        );

    if (
        !Number.isInteger(
            userId,
        ) ||
        userId <= 0
    ) {
        throw createAuthError({
            message:
                "Usuário autenticado inválido.",

            statusCode: 401,

            code:
                "INVALID_AUTH_USER",
        });
    }

    const user =
        await prisma.user.findUnique({
            where: {
                id:
                    userId,
            },

            select:
                AUTH_USER_SELECT,
        });

    if (!user) {
        throw createAuthError({
            message:
                "Usuário não encontrado.",

            statusCode: 404,

            code:
                "USER_NOT_FOUND",
        });
    }

    assertUserIsActive(
        user,
    );

    return sanitizeAuthenticatedUser(
        user,
    );
}

/*
 * Aliases mantidos para compatibilidade
 * com os nomes usados pelos controllers.
 */
export const register =
    registerUser;

export const login =
    loginUser;

export const authenticateUser =
    loginUser;

export const googleLogin =
    authenticateGoogleUser;

export const getCurrentUser =
    getAuthenticatedUser;

export const authService =
    Object.freeze({
        register:
            registerUser,

        registerUser,

        login:
            loginUser,

        loginUser,

        authenticateUser:
            loginUser,

        findOrCreateGoogleUser,

        authenticateGoogleUser,

        authenticateWithGoogle,

        googleLogin:
            authenticateGoogleUser,

        getAuthenticatedUser,

        getCurrentUser:
            getAuthenticatedUser,

        createAuthenticationResult,
    });

export default authService;