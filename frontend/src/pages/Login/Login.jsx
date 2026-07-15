import {
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router";

import {
    RiLoader4Line,
    RiLockPasswordLine,
    RiLoginBoxLine,
    RiMailLine,
} from "react-icons/ri";

import AuthInput from "../../components/auth/AuthInput.jsx";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import {
    useAuth,
} from "../../hooks/useAuth.js";

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getErrorMessage(
    error,
    fallbackMessage,
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

    return fallbackMessage;
}

function Login() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login,
        authenticateWithGoogle,
    } = useAuth();

    const [
        formData,
        setFormData,
    ] = useState({
        email: "",
        password: "",
    });

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        googleSubmitting,
        setGoogleSubmitting,
    ] = useState(false);

    const busy =
        submitting ||
        googleSubmitting;

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
        setNotification({
            type: "info",
            message: "",
        });
    }

    function getDestinationPage() {
        return (
            location.state?.from
                ?.pathname ??
            "/dashboard"
        );
    }

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (currentData) => ({
                ...currentData,
                [name]: value,
            }),
        );
    }

    async function handleGoogleLogin(
        credential,
    ) {
        if (busy) {
            return;
        }

        clearNotification();
        setGoogleSubmitting(true);

        try {
            await authenticateWithGoogle(
                credential,
            );

            navigate(
                getDestinationPage(),
                {
                    replace: true,
                },
            );
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                    "Não foi possível acessar sua conta com o Google.",
                ),
            );
        } finally {
            setGoogleSubmitting(false);
        }
    }

    function handleGoogleError(error) {
        showNotification(
            "error",
            getErrorMessage(
                error,
                "Não foi possível carregar a autenticação do Google.",
            ),
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (busy) {
            return;
        }

        clearNotification();

        const email =
            formData.email
                .trim()
                .toLowerCase();

        const password =
            formData.password;

        if (
            !EMAIL_PATTERN.test(
                email,
            )
        ) {
            showNotification(
                "error",
                "Informe um endereço de e-mail válido.",
            );

            return;
        }

        /*
         * No login, não verificamos se a senha
         * possui maiúscula, número ou caractere
         * especial.
         *
         * Essas regras são aplicadas apenas no
         * cadastro e na alteração de senha.
         */
        if (!password) {
            showNotification(
                "error",
                "Informe sua senha de acesso.",
            );

            return;
        }

        setSubmitting(true);

        try {
            await login({
                email,
                password,
            });

            navigate(
                getDestinationPage(),
                {
                    replace: true,
                },
            );
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                    "Não foi possível acessar sua conta.",
                ),
            );
        } finally {
            setSubmitting(false);
        }
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
                        <RiLoginBoxLine
                            size={19}
                            aria-hidden="true"
                        />
                    </span>

                    <h2
                        className="
                            mt-4
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Acesse sua conta
                    </h2>

                    <p
                        className="
                            mt-1.5
                            text-sm
                            leading-6
                            text-muted-foreground
                        "
                    >
                        Informe seus dados ou continue com o Google para acompanhar suas finanças.
                    </p>
                </header>

                <div
                    aria-busy={
                        googleSubmitting
                    }
                >
                    <GoogleAuthButton
                        onCredential={
                            handleGoogleLogin
                        }
                        onError={
                            handleGoogleError
                        }
                        disabled={busy}
                        text="signin_with"
                    />
                </div>

                {googleSubmitting && (
                    <p
                        aria-live="polite"
                        className="
                            mt-2
                            flex items-center
                            justify-center
                            gap-2
                            text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        <RiLoader4Line
                            size={15}
                            className="animate-spin"
                            aria-hidden="true"
                        />

                        Autenticando com o Google...
                    </p>
                )}

                <div
                    className="
                        my-5
                        flex items-center
                        gap-3
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            h-px flex-1
                            bg-border
                        "
                    />

                    <span
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-muted-foreground
                        "
                    >
                        ou use seu e-mail
                    </span>

                    <span
                        aria-hidden="true"
                        className="
                            h-px flex-1
                            bg-border
                        "
                    />
                </div>

                <form
                    className="
                        min-w-0 space-y-5
                    "
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <AuthInput
                        id="login-email"
                        name="email"
                        type="email"
                        label="Endereço de e-mail"
                        icon={RiMailLine}
                        value={
                            formData.email
                        }
                        onChange={
                            handleChange
                        }
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="nome@exemplo.com"
                        disabled={busy}
                    />

                    <AuthInput
                        id="login-password"
                        name="password"
                        type="password"
                        label="Senha de acesso"
                        icon={
                            RiLockPasswordLine
                        }
                        value={
                            formData.password
                        }
                        onChange={
                            handleChange
                        }
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        disabled={busy}
                    />

                    <button
                        type="submit"
                        disabled={busy}
                        aria-busy={
                            submitting
                        }
                        className="
                            inline-flex min-h-12
                            w-full min-w-0
                            items-center
                            justify-center gap-2
                            rounded-2xl
                            bg-primary
                            px-4
                            text-sm
                            font-semibold
                            text-primary-foreground
                            shadow-md
                            shadow-primary/20
                            transition-all
                            hover:-translate-y-0.5
                            hover:bg-primary-hover
                            hover:shadow-lg
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-primary/20
                            active:scale-[0.99]
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >
                        {submitting ? (
                            <RiLoader4Line
                                size={19}
                                aria-hidden="true"
                                className="animate-spin"
                            />
                        ) : (
                            <RiLoginBoxLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}

                        <span className="truncate">
                            {submitting
                                ? "Acessando..."
                                : "Entrar na conta"
                            }
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;