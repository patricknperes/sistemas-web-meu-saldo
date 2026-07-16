import nodemailer from "nodemailer";

import { env } from "../config/env.js";

let transporter = null;

function normalizeEmail(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function validateEmail(
    value,
    fieldName = "e-mail",
) {
    const email =
        normalizeEmail(value);

    const valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email,
        );

    if (!valid) {
        throw new Error(
            `O ${fieldName} informado é inválido.`,
        );
    }

    return email;
}

function validateMessageData({
    to,
    subject,
    text,
    html,
}) {
    const recipient =
        validateEmail(
            to,
            "e-mail do destinatário",
        );

    const normalizedSubject =
        String(subject ?? "")
            .trim();

    if (!normalizedSubject) {
        throw new Error(
            "O assunto do e-mail é obrigatório.",
        );
    }

    if (
        normalizedSubject.length >
        150
    ) {
        throw new Error(
            "O assunto do e-mail deve possuir no máximo 150 caracteres.",
        );
    }

    const normalizedText =
        typeof text === "string"
            ? text.trim()
            : "";

    const normalizedHtml =
        typeof html === "string"
            ? html.trim()
            : "";

    if (
        !normalizedText &&
        !normalizedHtml
    ) {
        throw new Error(
            "O e-mail precisa possuir uma versão em texto ou HTML.",
        );
    }

    return {
        recipient,
        subject:
            normalizedSubject,
        text:
            normalizedText ||
            undefined,
        html:
            normalizedHtml ||
            undefined,
    };
}

function createTransporter() {
    if (!env.smtp.isConfigured) {
        throw new Error(
            [
                "O serviço de e-mail não está configurado.",
                "Confira as variáveis SMTP no arquivo .env.",
            ].join(" "),
        );
    }

    return nodemailer.createTransport({
        host:
            env.smtp.host,

        port:
            env.smtp.port,

        secure:
            env.smtp.secure,

        auth: {
            user:
                env.smtp.user,

            pass:
                env.smtp.password,
        },

        /*
         * Mantém algumas conexões abertas
         * para reutilização, evitando criar
         * uma nova conexão a cada envio.
         */
        pool: true,

        maxConnections: 3,
        maxMessages: 50,

        connectionTimeout: 15_000,
        greetingTimeout: 15_000,
        socketTimeout: 30_000,

        /*
         * Impede que o HTML do e-mail
         * tente carregar arquivos locais
         * ou URLs externas automaticamente.
         */
        disableFileAccess: true,
        disableUrlAccess: true,
    });
}

function getTransporter() {
    if (!transporter) {
        transporter =
            createTransporter();
    }

    return transporter;
}

export function isEmailServiceConfigured() {
    return env.smtp.isConfigured;
}

export async function verifyEmailConnection() {
    const emailTransporter =
        getTransporter();

    try {
        await emailTransporter.verify();

        console.log(
            "[E-mail] Conexão SMTP validada com sucesso.",
        );

        return true;
    } catch (error) {
        console.error(
            "[E-mail] Não foi possível validar a conexão SMTP.",
        );

        /*
         * Não mostramos usuário, senha ou
         * outras credenciais no terminal.
         */
        console.error(
            error?.message ??
            error,
        );

        throw new Error(
            "Não foi possível conectar ao servidor de e-mail.",
            {
                cause: error,
            },
        );
    }
}

export async function sendEmail({
    to,
    subject,
    text,
    html,
    replyTo,
}) {
    const message =
        validateMessageData({
            to,
            subject,
            text,
            html,
        });

    const normalizedReplyTo =
        replyTo
            ? validateEmail(
                  replyTo,
                  "e-mail de resposta",
              )
            : undefined;

    const emailTransporter =
        getTransporter();

    try {
        const information =
            await emailTransporter.sendMail({
                from: {
                    name:
                        env.smtp.fromName,

                    address:
                        env.smtp.fromEmail,
                },

                to:
                    message.recipient,

                subject:
                    message.subject,

                text:
                    message.text,

                html:
                    message.html,

                replyTo:
                    normalizedReplyTo,

                /*
                 * Cabeçalhos informativos.
                 * Não colocamos tokens ou
                 * informações sensíveis aqui.
                 */
                headers: {
                    "X-Application":
                        "Meu Saldo",
                },

                disableFileAccess: true,
                disableUrlAccess: true,
            });

        const accepted =
            Array.isArray(
                information.accepted,
            )
                ? information.accepted
                : [];

        const rejected =
            Array.isArray(
                information.rejected,
            )
                ? information.rejected
                : [];

        if (
            accepted.length === 0
        ) {
            throw new Error(
                "O servidor de e-mail não aceitou o destinatário.",
            );
        }

        console.log(
            [
                "[E-mail] Mensagem enviada.",
                `ID: ${information.messageId}.`,
                `Destinatários aceitos: ${accepted.length}.`,
                `Destinatários rejeitados: ${rejected.length}.`,
            ].join(" "),
        );

        return {
            messageId:
                information.messageId,

            accepted,

            rejected,

            response:
                information.response,
        };
    } catch (error) {
        console.error(
            "[E-mail] Falha ao enviar a mensagem.",
        );

        console.error(
            error?.message ??
            error,
        );

        throw new Error(
            "Não foi possível enviar o e-mail.",
            {
                cause: error,
            },
        );
    }
}

export async function closeEmailConnection() {
    if (!transporter) {
        return;
    }

    if (
        typeof transporter.close ===
        "function"
    ) {
        transporter.close();
    }

    transporter = null;

    console.log(
        "[E-mail] Conexão SMTP encerrada.",
    );
}