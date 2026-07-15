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

function Login() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login,
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

    function showNotification(
        type,
        message
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

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (currentData) => ({
                ...currentData,
                [name]: value,
            })
        );
    }

    function handleGoogleLogin() {
        showNotification(
            "info",
            "O acesso com Google será disponibilizado em breve."
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        clearNotification();

        const email =
            formData.email
                .trim()
                .toLowerCase();

        if (!email) {
            showNotification(
                "error",
                "Informe seu endereço de e-mail."
            );

            return;
        }

        if (
            formData.password.length <
            8
        ) {
            showNotification(
                "error",
                "A senha deve possuir pelo menos 8 caracteres."
            );

            return;
        }

        setSubmitting(true);

        try {
            await login({
                email,
                password:
                    formData.password,
            });

            const previousPage =
                location.state?.from
                    ?.pathname ??
                "/dashboard";

            navigate(
                previousPage,
                {
                    replace: true,
                }
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível acessar sua conta."
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
                        Informe seus dados para continuar acompanhando suas finanças.
                    </p>
                </header>

                <GoogleAuthButton
                    onClick={
                        handleGoogleLogin
                    }
                    disabled={
                        submitting
                    }
                />

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
                        disabled={
                            submitting
                        }
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
                        minLength={8}
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        helperText="Sua senha deve possuir pelo menos 8 caracteres."
                        disabled={
                            submitting
                        }
                    />

                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
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