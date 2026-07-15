import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import {
    RiLoader4Line,
    RiLockPasswordLine,
    RiMailLine,
    RiUser3Line,
    RiUserAddLine,
} from "react-icons/ri";

import AuthInput from "../../components/auth/AuthInput.jsx";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import {
    useAuth,
} from "../../hooks/useAuth.js";

function Register() {
    const navigate =
        useNavigate();

    const {
        register,
    } = useAuth();

    const [
        formData,
        setFormData,
    ] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
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

    const passwordProgress =
        useMemo(() => {
            const password =
                formData.password;

            let progress = 0;

            if (password.length >= 8) {
                progress += 1;
            }

            if (
                /[a-z]/.test(password) &&
                /[A-Z]/.test(password)
            ) {
                progress += 1;
            }

            if (/\d/.test(password)) {
                progress += 1;
            }

            return progress;
        }, [formData.password]);

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

    function handleGoogleRegister() {
        showNotification(
            "info",
            "O cadastro com Google será disponibilizado em breve."
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        clearNotification();

        const name =
            formData.name.trim();

        const email =
            formData.email
                .trim()
                .toLowerCase();

        if (name.length < 2) {
            showNotification(
                "error",
                "Informe seu nome completo."
            );

            return;
        }

        if (!email) {
            showNotification(
                "error",
                "Informe um endereço de e-mail válido."
            );

            return;
        }

        if (
            formData.password.length <
            8
        ) {
            showNotification(
                "error",
                "Crie uma senha com pelo menos 8 caracteres."
            );

            return;
        }

        if (
            formData.password !==
            formData.passwordConfirmation
        ) {
            showNotification(
                "error",
                "A confirmação não corresponde à senha criada."
            );

            return;
        }

        setSubmitting(true);

        try {
            await register({
                name,
                email,
                password:
                    formData.password,
            });

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível criar sua conta."
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
                        <RiUserAddLine
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
                        Crie sua conta
                    </h2>

                    <p
                        className="
                            mt-1.5
                            text-sm
                            leading-6
                            text-muted-foreground
                        "
                    >
                        Preencha seus dados para começar a organizar sua vida financeira.
                    </p>
                </header>

                <GoogleAuthButton
                    onClick={
                        handleGoogleRegister
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
                    <div
                        className="
                            grid min-w-0
                            gap-5
                            sm:grid-cols-2
                        "
                    >
                        <AuthInput
                            id="register-name"
                            name="name"
                            type="text"
                            label="Nome completo"
                            icon={RiUser3Line}
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            required
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            placeholder="Digite seu nome"
                            disabled={
                                submitting
                            }
                        />

                        <AuthInput
                            id="register-email"
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
                            id="register-password"
                            name="password"
                            type="password"
                            label="Crie uma senha"
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
                            autoComplete="new-password"
                            placeholder="Mínimo de 8 caracteres"
                            disabled={
                                submitting
                            }
                        />

                        <AuthInput
                            id="register-password-confirmation"
                            name="passwordConfirmation"
                            type="password"
                            label="Confirme sua senha"
                            icon={
                                RiLockPasswordLine
                            }
                            value={
                                formData
                                    .passwordConfirmation
                            }
                            onChange={
                                handleChange
                            }
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Digite novamente"
                            disabled={
                                submitting
                            }
                        />
                    </div>

                    <div
                        className="
                            rounded-2xl
                            border border-border
                            bg-surface-muted/40
                            p-3.5
                        "
                    >
                        <div
                            className="
                                flex items-center
                                justify-between
                                gap-3
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Segurança da senha
                            </p>

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-muted-foreground
                                "
                            >
                                Mínimo de 8 caracteres
                            </span>
                        </div>

                        <div
                            className="
                                mt-3 grid
                                grid-cols-3 gap-1.5
                            "
                        >
                            {[1, 2, 3].map(
                                (level) => (
                                    <span
                                        key={level}
                                        className={`
                                            h-1.5
                                            rounded-full
                                            transition-colors

                                            ${passwordProgress >=
                                                level
                                                ? "bg-primary"
                                                : "bg-border"
                                            }
                                        `}
                                    />
                                )
                            )}
                        </div>
                    </div>

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
                            <RiUserAddLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}

                        <span className="truncate">
                            {submitting
                                ? "Criando conta..."
                                : "Criar minha conta"
                            }
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
}

export default Register;