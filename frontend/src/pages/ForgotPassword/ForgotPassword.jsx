import {
    useState,
} from "react";

import {
    Link,
} from "react-router";

import {
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiLoader4Line,
    RiLockPasswordLine,
    RiMailLine,
    RiSendPlaneLine,
} from "react-icons/ri";

import AuthInput from "../../components/auth/AuthInput.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import {
    passwordResetService,
} from "../../services/passwordResetService.js";

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INITIAL_NOTIFICATION =
    Object.freeze({
        type: "info",
        message: "",
    });

function getErrorMessage(
    error,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return "Não foi possível enviar as instruções de recuperação.";
}

function ForgotPassword() {
    const [
        email,
        setEmail,
    ] = useState("");

    const [
        submittedEmail,
        setSubmittedEmail,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        requestCompleted,
        setRequestCompleted,
    ] = useState(false);

    const [
        notification,
        setNotification,
    ] = useState(
        INITIAL_NOTIFICATION,
    );

    function showNotification(
        type,
        message,
    ) {
        setNotification({
            type,
            message,
        });
    }

    function clearNotification() {
        setNotification(
            INITIAL_NOTIFICATION,
        );
    }

    function handleEmailChange(
        event,
    ) {
        setEmail(
            event.target.value,
        );

        if (
            notification.message
        ) {
            clearNotification();
        }
    }

    async function handleSubmit(
        event,
    ) {
        event.preventDefault();

        clearNotification();

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        if (!normalizedEmail) {
            showNotification(
                "error",
                "Informe seu endereço de e-mail.",
            );

            return;
        }

        if (
            normalizedEmail.length >
            254 ||
            !EMAIL_PATTERN.test(
                normalizedEmail,
            )
        ) {
            showNotification(
                "error",
                "Informe um endereço de e-mail válido.",
            );

            return;
        }

        setSubmitting(true);

        try {
            await passwordResetService
                .requestPasswordReset(
                    normalizedEmail,
                );

            setSubmittedEmail(
                normalizedEmail,
            );

            setRequestCompleted(
                true,
            );
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                ),
            );
        } finally {
            setSubmitting(false);
        }
    }

    function handleTryAnotherEmail() {
        clearNotification();

        setRequestCompleted(
            false,
        );

        setSubmittedEmail("");

        setEmail("");
    }

    if (requestCompleted) {
        return (
            <>
                <Snackbar
                    type={
                        notification.type
                    }
                    message={
                        notification.message
                    }
                    onClose={
                        clearNotification
                    }
                />

                <div
                    className="
                        min-w-0
                        text-center
                    "
                >
                    <span
                        className="
                            mx-auto
                            flex size-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-emerald-500/15
                            bg-emerald-500/10
                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        <RiCheckboxCircleLine
                            size={27}
                            aria-hidden="true"
                        />
                    </span>

                    <header className="mt-5">
                        <h1
                            className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-foreground
                            "
                        >
                            Verifique seu e-mail
                        </h1>

                        <p
                            className="
                                mx-auto mt-2
                                max-w-sm
                                text-sm
                                leading-6
                                text-muted-foreground
                            "
                        >
                            Caso exista uma conta
                            vinculada ao endereço
                            informado, enviaremos as
                            instruções para redefinir
                            sua senha.
                        </p>
                    </header>

                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border border-border
                            bg-surface-muted/60
                            px-4 py-3
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-medium
                                text-muted-foreground
                            "
                        >
                            Instruções enviadas para
                        </p>

                        <p
                            title={
                                submittedEmail
                            }
                            className="
                                mt-1
                                truncate
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            {submittedEmail}
                        </p>
                    </div>

                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-sky-500/15
                            bg-sky-500/[0.06]
                            p-4
                            text-left
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-sky-500/10
                                    text-sky-600
                                    dark:text-sky-400
                                "
                            >
                                <RiLockPasswordLine
                                    size={17}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    O link expira em
                                    30 minutos
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-muted-foreground
                                    "
                                >
                                    Confira também a
                                    caixa de spam ou
                                    lixo eletrônico.
                                    Cada link pode ser
                                    utilizado somente
                                    uma vez.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            mt-6
                            space-y-3
                        "
                    >
                        <Link
                            to="/login"
                            className="
                                inline-flex
                                min-h-12
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-primary
                                px-4
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:bg-primary-hover
                                focus-visible:outline-none
                                focus-visible:ring-4
                                focus-visible:ring-primary/20
                            "
                        >
                            <RiArrowLeftLine
                                size={18}
                                aria-hidden="true"
                            />

                            Voltar para o login
                        </Link>

                        <button
                            type="button"
                            onClick={
                                handleTryAnotherEmail
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                px-4
                                text-sm
                                font-semibold
                                text-muted-foreground
                                transition-colors
                                hover:bg-surface-hover
                                hover:text-foreground
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring/20
                            "
                        >
                            Usar outro e-mail
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Snackbar
                type={
                    notification.type
                }
                message={
                    notification.message
                }
                onClose={
                    clearNotification
                }
            />

            <div className="min-w-0">
                <header className="mb-6">
                    <span
                        className="
                            flex size-10
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary-muted
                            text-primary
                        "
                    >
                        <RiLockPasswordLine
                            size={19}
                            aria-hidden="true"
                        />
                    </span>

                    <h1
                        className="
                            mt-4
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Esqueceu sua senha?
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-muted-foreground
                        "
                    >
                        Informe o e-mail da sua conta
                        para receber um link seguro de
                        redefinição de senha.
                    </p>
                </header>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                    className="space-y-5"
                >
                    <AuthInput
                        id="forgot-password-email"
                        name="email"
                        type="email"
                        label="E-mail da conta"
                        value={email}
                        onChange={
                            handleEmailChange
                        }
                        icon={
                            RiMailLine
                        }
                        placeholder="nome@exemplo.com"
                        autoComplete="email"
                        inputMode="email"
                        maxLength={254}
                        required
                        disabled={
                            submitting
                        }
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        className="
                            inline-flex
                            min-h-12
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-primary
                            px-4
                            text-sm
                            font-semibold
                            text-primary-foreground
                            transition
                            hover:bg-primary-hover
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-primary/20
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >
                        {submitting ? (
                            <>
                                <RiLoader4Line
                                    size={18}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />

                                Enviando instruções...
                            </>
                        ) : (
                            <>
                                <RiSendPlaneLine
                                    size={18}
                                    aria-hidden="true"
                                />

                                Enviar instruções
                            </>
                        )}
                    </button>
                </form>

                <div
                    className="
                        mt-6
                        border-t
                        border-border
                        pt-5
                    "
                >
                    <Link
                        to="/login"
                        className="
                            inline-flex
                            min-h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            text-sm
                            font-semibold
                            text-muted-foreground
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring/20
                        "
                    >
                        <RiArrowLeftLine
                            size={17}
                            aria-hidden="true"
                        />

                        Voltar para o login
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;