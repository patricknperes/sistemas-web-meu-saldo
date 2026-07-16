import {
    requestPasswordReset,
    resetPassword,
    validatePasswordResetToken,
} from "../services/passwordResetService.js";

const GENERIC_REQUEST_MESSAGE =
    "Caso exista uma conta vinculada a esse e-mail, enviaremos as instruções para redefinir a senha.";

function disableResponseCache(
    response,
) {
    response.set({
        "Cache-Control":
            "no-store, no-cache, must-revalidate, private",

        Pragma:
            "no-cache",

        Expires:
            "0",
    });
}

function getRequestEmail(
    request,
) {
    return request.body?.email;
}

function getRequestToken(
    request,
) {
    return (
        request.body?.token ??
        request.query?.token
    );
}

function getPasswordConfirmation(
    request,
) {
    /*
     * Aceita os dois nomes para facilitar
     * a integração com o frontend.
     */
    return (
        request.body
            ?.passwordConfirmation ??
        request.body
            ?.confirmPassword
    );
}

export async function requestPasswordResetController(
    request,
    response,
    next,
) {
    disableResponseCache(
        response,
    );

    try {
        const result =
            await requestPasswordReset(
                getRequestEmail(
                    request,
                ),
            );

        return response
            .status(200)
            .json({
                message:
                    result?.message ??
                    GENERIC_REQUEST_MESSAGE,
            });
    } catch (error) {
        /*
         * Uma falha no SMTP não deve informar
         * ao solicitante se o e-mail existe.
         *
         * O erro verdadeiro continuará aparecendo
         * no terminal por meio do emailService.
         */
        if (
            error?.code ===
            "PASSWORD_RESET_EMAIL_FAILED"
        ) {
            return response
                .status(200)
                .json({
                    message:
                        GENERIC_REQUEST_MESSAGE,
                });
        }

        return next(error);
    }
}

export async function validatePasswordResetTokenController(
    request,
    response,
    next,
) {
    disableResponseCache(
        response,
    );

    try {
        const result =
            await validatePasswordResetToken(
                getRequestToken(
                    request,
                ),
            );

        return response
            .status(200)
            .json({
                valid:
                    Boolean(
                        result?.valid,
                    ),
            });
    } catch (error) {
        /*
         * Na validação do link, tokens malformados,
         * inexistentes, expirados ou utilizados
         * serão apresentados da mesma maneira.
         */
        if (
            [
                "INVALID_RESET_TOKEN",
                "RESET_TOKEN_UNAVAILABLE",
            ].includes(
                error?.code,
            )
        ) {
            return response
                .status(200)
                .json({
                    valid:
                        false,
                });
        }

        return next(error);
    }
}

export async function resetPasswordController(
    request,
    response,
    next,
) {
    disableResponseCache(
        response,
    );

    try {
        const result =
            await resetPassword({
                token:
                    getRequestToken(
                        request,
                    ),

                password:
                    request.body
                        ?.password,

                passwordConfirmation:
                    getPasswordConfirmation(
                        request,
                    ),
            });

        return response
            .status(200)
            .json({
                message:
                    result.message,
            });
    } catch (error) {
        return next(error);
    }
}