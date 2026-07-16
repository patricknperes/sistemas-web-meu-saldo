import "dotenv/config";

function readRequiredString(
    variableName,
) {
    const value =
        process.env[variableName]
            ?.trim();

    if (!value) {
        throw new Error(
            `A variável de ambiente ${variableName} é obrigatória.`,
        );
    }

    return value;
}

function readOptionalString(
    variableName,
    fallbackValue = "",
) {
    return (
        process.env[variableName]
            ?.trim() ??
        fallbackValue
    );
}

function readInteger(
    variableName,
    fallbackValue,
    {
        minimum = Number.MIN_SAFE_INTEGER,
        maximum = Number.MAX_SAFE_INTEGER,
    } = {},
) {
    const rawValue =
        process.env[variableName];

    if (
        rawValue === undefined ||
        rawValue === null ||
        rawValue.trim() === ""
    ) {
        return fallbackValue;
    }

    const value =
        Number(rawValue);

    if (
        !Number.isInteger(value) ||
        value < minimum ||
        value > maximum
    ) {
        throw new Error(
            [
                `A variável ${variableName} deve ser um número inteiro`,
                `entre ${minimum} e ${maximum}.`,
            ].join(" "),
        );
    }

    return value;
}

function readBoolean(
    variableName,
    fallbackValue = false,
) {
    const rawValue =
        process.env[variableName];

    if (
        rawValue === undefined ||
        rawValue === null ||
        rawValue.trim() === ""
    ) {
        return fallbackValue;
    }

    const normalizedValue =
        rawValue
            .trim()
            .toLowerCase();

    if (
        [
            "true",
            "1",
            "yes",
            "sim",
        ].includes(normalizedValue)
    ) {
        return true;
    }

    if (
        [
            "false",
            "0",
            "no",
            "nao",
            "não",
        ].includes(normalizedValue)
    ) {
        return false;
    }

    throw new Error(
        `A variável ${variableName} deve possuir o valor true ou false.`,
    );
}

function readUrl(
    variableName,
    fallbackValue,
) {
    const value =
        readOptionalString(
            variableName,
            fallbackValue,
        );

    try {
        const parsedUrl =
            new URL(value);

        if (
            ![
                "http:",
                "https:",
            ].includes(
                parsedUrl.protocol,
            )
        ) {
            throw new Error();
        }
    } catch {
        throw new Error(
            `A variável ${variableName} deve possuir uma URL HTTP ou HTTPS válida.`,
        );
    }

    return value.replace(
        /\/+$/,
        "",
    );
}

function validateEmail(
    variableName,
    value,
) {
    if (!value) {
        return "";
    }

    const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value,
        );

    if (!validEmail) {
        throw new Error(
            `A variável ${variableName} deve possuir um e-mail válido.`,
        );
    }

    return value;
}

function createSmtpConfig() {
    const host =
        readOptionalString(
            "SMTP_HOST",
        );

    const port =
        readInteger(
            "SMTP_PORT",
            587,
            {
                minimum: 1,
                maximum: 65535,
            },
        );

    const secure =
        readBoolean(
            "SMTP_SECURE",
            false,
        );

    const user =
        readOptionalString(
            "SMTP_USER",
        );

    const password =
        readOptionalString(
            "SMTP_PASSWORD",
        );

    const fromName =
        readOptionalString(
            "SMTP_FROM_NAME",
            "Meu Saldo",
        );

    const fromEmail =
        validateEmail(
            "SMTP_FROM_EMAIL",
            readOptionalString(
                "SMTP_FROM_EMAIL",
                user,
            ),
        );

    const informedValues = [
        host,
        user,
        password,
        fromEmail,
    ];

    const partiallyConfigured =
        informedValues.some(Boolean) &&
        informedValues.some(
            (value) => !value,
        );

    if (partiallyConfigured) {
        throw new Error(
            [
                "A configuração SMTP está incompleta.",
                "Informe SMTP_HOST, SMTP_USER, SMTP_PASSWORD",
                "e SMTP_FROM_EMAIL.",
            ].join(" "),
        );
    }

    return Object.freeze({
        host,
        port,
        secure,
        user,
        password,
        fromName,
        fromEmail,

        isConfigured:
            informedValues.every(
                Boolean,
            ),
    });
}

const nodeEnv =
    readOptionalString(
        "NODE_ENV",
        "development",
    );

const port =
    readInteger(
        "PORT",
        3000,
        {
            minimum: 1,
            maximum: 65535,
        },
    );

const databaseUrl =
    readOptionalString(
        "DATABASE_URL",
        "file:./dev.db",
    );

const jwtSecret =
    readRequiredString(
        "JWT_SECRET",
    );

if (jwtSecret.length < 32) {
    throw new Error(
        "A variável JWT_SECRET deve possuir pelo menos 32 caracteres.",
    );
}

const jwtExpiresIn =
    readOptionalString(
        "JWT_EXPIRES_IN",
        "7d",
    );

const jwtIssuer =
    readOptionalString(
        "JWT_ISSUER",
        "finance-manager-api",
    );

const jwtAudience =
    readOptionalString(
        "JWT_AUDIENCE",
        "finance-manager-web",
    );

const frontendUrl =
    readUrl(
        "FRONTEND_URL",
        "http://localhost:5173",
    );

const passwordResetExpiresMinutes =
    readInteger(
        "PASSWORD_RESET_EXPIRES_MINUTES",
        30,
        {
            minimum: 5,
            maximum: 120,
        },
    );

const smtp =
    createSmtpConfig();

const googleClientId =
    readOptionalString(
        "GOOGLE_CLIENT_ID",
    );

const googleClientSecret =
    readOptionalString(
        "GOOGLE_CLIENT_SECRET",
    );

const googleCallbackUrl =
    readOptionalString(
        "GOOGLE_CALLBACK_URL",
    );

const recurrenceTimezone =
    readOptionalString(
        "RECURRENCE_TIMEZONE",
        "America/Sao_Paulo",
    );

const adminName =
    readOptionalString(
        "ADMIN_NAME",
        "Administrador",
    );

const adminEmail =
    readOptionalString(
        "ADMIN_EMAIL",
    );

const adminPassword =
    readOptionalString(
        "ADMIN_PASSWORD",
    );

export const env =
    Object.freeze({
        nodeEnv,

        isDevelopment:
            nodeEnv ===
            "development",

        isProduction:
            nodeEnv ===
            "production",

        isTest:
            nodeEnv ===
            "test",

        port,
        databaseUrl,
        frontendUrl,

        jwtSecret,
        jwtExpiresIn,
        jwtIssuer,
        jwtAudience,

        jwt: Object.freeze({
            secret:
                jwtSecret,

            expiresIn:
                jwtExpiresIn,

            issuer:
                jwtIssuer,

            audience:
                jwtAudience,
        }),

        googleClientId,
        googleClientSecret,
        googleCallbackUrl,

        google: Object.freeze({
            clientId:
                googleClientId,

            clientSecret:
                googleClientSecret,

            callbackUrl:
                googleCallbackUrl,

            isConfigured:
                Boolean(
                    googleClientId &&
                    googleClientSecret,
                ),
        }),

        recurrenceTimezone,

        smtpHost:
            smtp.host,

        smtpPort:
            smtp.port,

        smtpSecure:
            smtp.secure,

        smtpUser:
            smtp.user,

        smtpPassword:
            smtp.password,

        smtpFromName:
            smtp.fromName,

        smtpFromEmail:
            smtp.fromEmail,

        smtp,

        passwordResetExpiresMinutes,

        adminName,
        adminEmail,
        adminPassword,

        admin: Object.freeze({
            name:
                adminName,

            email:
                adminEmail,

            password:
                adminPassword,
        }),
    });