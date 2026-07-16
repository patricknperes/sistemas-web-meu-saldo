const APPLICATION_NAME =
    "Meu Saldo";

const SUPPORT_MESSAGE =
    "Esta é uma mensagem automática. Não responda a este e-mail.";

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;",
        )
        .replaceAll(
            "<",
            "&lt;",
        )
        .replaceAll(
            ">",
            "&gt;",
        )
        .replaceAll(
            '"',
            "&quot;",
        )
        .replaceAll(
            "'",
            "&#039;",
        );
}

function normalizeName(value) {
    const normalizedName =
        String(value ?? "")
            .trim()
            .replace(
                /\s+/g,
                " ",
            );

    if (!normalizedName) {
        return "Olá";
    }

    const firstName =
        normalizedName.split(" ")[0];

    return `Olá, ${firstName}`;
}

function normalizeExpirationMinutes(
    value,
) {
    const expirationMinutes =
        Number(value);

    if (
        !Number.isInteger(
            expirationMinutes,
        ) ||
        expirationMinutes <= 0
    ) {
        return 30;
    }

    return expirationMinutes;
}

function validateResetUrl(value) {
    const resetUrl =
        String(value ?? "")
            .trim();

    if (!resetUrl) {
        throw new Error(
            "A URL de redefinição de senha é obrigatória.",
        );
    }

    try {
        const parsedUrl =
            new URL(resetUrl);

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
            "A URL de redefinição de senha é inválida.",
        );
    }

    return resetUrl;
}

function createTextVersion({
    greeting,
    resetUrl,
    expirationMinutes,
}) {
    return [
        `${greeting}!`,
        "",
        "Recebemos uma solicitação para redefinir a senha da sua conta no Meu Saldo.",
        "",
        "Para criar uma nova senha, acesse o link abaixo:",
        resetUrl,
        "",
        `Este link é válido por ${expirationMinutes} minutos e poderá ser utilizado apenas uma vez.`,
        "",
        "Caso você não tenha solicitado essa alteração, ignore este e-mail. Sua senha atual continuará funcionando normalmente.",
        "",
        "Por segurança, nunca compartilhe este link com outras pessoas.",
        "",
        "Equipe Meu Saldo",
        SUPPORT_MESSAGE,
    ].join("\n");
}

function createHtmlVersion({
    greeting,
    resetUrl,
    expirationMinutes,
    currentYear,
}) {
    const safeGreeting =
        escapeHtml(greeting);

    const safeResetUrl =
        escapeHtml(resetUrl);

    const safeExpirationMinutes =
        escapeHtml(
            expirationMinutes,
        );

    return `
<!doctype html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />

        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />

        <meta
            name="color-scheme"
            content="light"
        />

        <meta
            name="supported-color-schemes"
            content="light"
        />

        <title>
            Redefinição de senha — ${APPLICATION_NAME}
        </title>
    </head>

    <body
        style="
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            color: #0f172a;
        "
    >
        <div
            style="
                display: none;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                color: transparent;
            "
        >
            Use o link deste e-mail para criar uma nova senha no Meu Saldo.
        </div>

        <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
                width: 100%;
                background-color: #f1f5f9;
            "
        >
            <tr>
                <td
                    align="center"
                    style="
                        padding:
                            32px
                            16px;
                    "
                >
                    <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                        "
                    >
                        <tr>
                            <td
                                align="center"
                                style="
                                    padding-bottom: 20px;
                                "
                            >
                                <table
                                    role="presentation"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            valign="middle"
                                            width="48"
                                            height="48"
                                            style="
                                                width: 48px;
                                                height: 48px;
                                                border-radius: 16px;
                                                background-color: #0f2747;
                                                color: #ffffff;
                                                font-size: 22px;
                                                font-weight: 700;
                                            "
                                        >
                                            $
                                        </td>

                                        <td
                                            style="
                                                padding-left: 12px;
                                                color: #0f172a;
                                                font-size: 20px;
                                                font-weight: 700;
                                                letter-spacing: -0.3px;
                                            "
                                        >
                                            ${APPLICATION_NAME}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td
                                style="
                                    overflow: hidden;
                                    border: 1px solid #e2e8f0;
                                    border-radius: 24px;
                                    background-color: #ffffff;
                                    box-shadow:
                                        0 12px 32px
                                        rgba(
                                            15,
                                            23,
                                            42,
                                            0.08
                                        );
                                "
                            >
                                <table
                                    role="presentation"
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                >
                                    <tr>
                                        <td
                                            style="
                                                height: 6px;
                                                background-color: #0f2747;
                                                font-size: 0;
                                                line-height: 0;
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            style="
                                                padding:
                                                    40px
                                                    40px
                                                    32px;
                                            "
                                        >
                                            <table
                                                role="presentation"
                                                width="100%"
                                                cellspacing="0"
                                                cellpadding="0"
                                                border="0"
                                            >
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            padding-bottom: 24px;
                                                        "
                                                    >
                                                        <div
                                                            style="
                                                                display: inline-block;
                                                                width: 64px;
                                                                height: 64px;
                                                                border: 1px solid #dbeafe;
                                                                border-radius: 20px;
                                                                background-color: #eff6ff;
                                                                color: #1d4ed8;
                                                                font-size: 28px;
                                                                font-weight: 700;
                                                                line-height: 64px;
                                                                text-align: center;
                                                            "
                                                        >
                                                            🔐
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            color: #0f172a;
                                                            font-size: 26px;
                                                            font-weight: 700;
                                                            line-height: 34px;
                                                            letter-spacing: -0.5px;
                                                        "
                                                    >
                                                        Redefinição de senha
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            padding-top: 10px;
                                                            color: #64748b;
                                                            font-size: 15px;
                                                            line-height: 24px;
                                                        "
                                                    >
                                                        Recebemos uma solicitação para alterar a senha da sua conta.
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 30px;
                                                            color: #0f172a;
                                                            font-size: 16px;
                                                            font-weight: 600;
                                                            line-height: 24px;
                                                        "
                                                    >
                                                        ${safeGreeting}!
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 12px;
                                                            color: #475569;
                                                            font-size: 15px;
                                                            line-height: 25px;
                                                        "
                                                    >
                                                        Clique no botão abaixo para criar uma nova senha para sua conta no Meu Saldo.
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            padding:
                                                                30px
                                                                0;
                                                        "
                                                    >
                                                        <table
                                                            role="presentation"
                                                            cellspacing="0"
                                                            cellpadding="0"
                                                            border="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    align="center"
                                                                    style="
                                                                        border-radius: 14px;
                                                                        background-color: #0f2747;
                                                                    "
                                                                >
                                                                    <a
                                                                        href="${safeResetUrl}"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style="
                                                                            display: inline-block;
                                                                            padding:
                                                                                15px
                                                                                26px;
                                                                            border-radius: 14px;
                                                                            color: #ffffff;
                                                                            font-size: 15px;
                                                                            font-weight: 700;
                                                                            line-height: 20px;
                                                                            text-decoration: none;
                                                                        "
                                                                    >
                                                                        Redefinir minha senha
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding:
                                                                16px
                                                                18px;
                                                            border: 1px solid #e2e8f0;
                                                            border-radius: 14px;
                                                            background-color: #f8fafc;
                                                            color: #475569;
                                                            font-size: 13px;
                                                            line-height: 21px;
                                                        "
                                                    >
                                                        <strong
                                                            style="
                                                                color: #0f172a;
                                                            "
                                                        >
                                                            Atenção:
                                                        </strong>

                                                        este link é válido por

                                                        <strong
                                                            style="
                                                                color: #0f172a;
                                                            "
                                                        >
                                                            ${safeExpirationMinutes} minutos
                                                        </strong>

                                                        e poderá ser utilizado apenas uma vez.
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 24px;
                                                            color: #64748b;
                                                            font-size: 13px;
                                                            line-height: 21px;
                                                        "
                                                    >
                                                        Caso o botão não funcione, copie e cole este endereço no navegador:
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 8px;
                                                        "
                                                    >
                                                        <div
                                                            style="
                                                                overflow-wrap: anywhere;
                                                                padding:
                                                                    12px
                                                                    14px;
                                                                border-radius: 12px;
                                                                background-color: #f1f5f9;
                                                                color: #334155;
                                                                font-family:
                                                                    Consolas,
                                                                    Monaco,
                                                                    monospace;
                                                                font-size: 12px;
                                                                line-height: 19px;
                                                            "
                                                        >
                                                            ${safeResetUrl}
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 26px;
                                                            color: #475569;
                                                            font-size: 14px;
                                                            line-height: 23px;
                                                        "
                                                    >
                                                        Não solicitou a redefinição? Você pode ignorar esta mensagem. Sua senha continuará a mesma.
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="
                                                            padding-top: 22px;
                                                            color: #0f172a;
                                                            font-size: 14px;
                                                            font-weight: 600;
                                                            line-height: 22px;
                                                        "
                                                    >
                                                        Equipe Meu Saldo
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                padding:
                                                    20px
                                                    32px;
                                                border-top: 1px solid #e2e8f0;
                                                background-color: #f8fafc;
                                                color: #94a3b8;
                                                font-size: 11px;
                                                line-height: 18px;
                                            "
                                        >
                                            ${SUPPORT_MESSAGE}

                                            <br />

                                            © ${currentYear} ${APPLICATION_NAME}. Todos os direitos reservados.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td
                                align="center"
                                style="
                                    padding-top: 18px;
                                    color: #94a3b8;
                                    font-size: 11px;
                                    line-height: 18px;
                                "
                            >
                                Por segurança, nunca compartilhe links de recuperação de senha.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
    `.trim();
}

export function createPasswordResetEmail({
    userName,
    resetUrl,
    expirationMinutes = 30,
} = {}) {
    const validatedResetUrl =
        validateResetUrl(
            resetUrl,
        );

    const normalizedExpirationMinutes =
        normalizeExpirationMinutes(
            expirationMinutes,
        );

    const greeting =
        normalizeName(
            userName,
        );

    const subject =
        "Redefina sua senha no Meu Saldo";

    const text =
        createTextVersion({
            greeting,
            resetUrl:
                validatedResetUrl,
            expirationMinutes:
                normalizedExpirationMinutes,
        });

    const html =
        createHtmlVersion({
            greeting,
            resetUrl:
                validatedResetUrl,
            expirationMinutes:
                normalizedExpirationMinutes,
            currentYear:
                new Date().getFullYear(),
        });

    return {
        subject,
        text,
        html,
    };
}