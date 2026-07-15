import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import {
    RiCheckboxCircleLine,
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

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error.response?.data;

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

function Register() {
    const navigate =
        useNavigate();

    const {
        register,
        authenticateWithGoogle,
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

    const [
        googleSubmitting,
        setGoogleSubmitting,
    ] = useState(false);

    const busy =
        submitting ||
        googleSubmitting;

    const passwordRequirements =
        useMemo(() => {
            const password =
                formData.password;

            return [
                {
                    id: "minimum-length",
                    label:
                        "Pelo menos 8 caracteres",
                    valid:
                        password.length >= 8,
                },
                {
                    id: "lowercase",
                    label:
                        "Uma letra minúscula",
                    valid:
                        /[a-z]/.test(
                            password,
                        ),
                },
                {
                    id: "uppercase",
                    label:
                        "Uma letra maiúscula",
                    valid:
                        /[A-Z]/.test(
                            password,
                        ),
                },
                {
                    id: "number",
                    label:
                        "Pelo menos um número",
                    valid:
                        /\d/.test(
                            password,
                        ),
                },
                {
                    id: "special-character",
                    label:
                        "Um caractere especial",
                    valid:
                        /[^A-Za-z0-9\s]/.test(
                            password,
                        ),
                },
            ];
        }, [formData.password]);

    const passwordProgress =
        useMemo(
            () =>
                passwordRequirements.filter(
                    (requirement) =>
                        requirement.valid,
                ).length,
            [passwordRequirements],
        );

    const passwordIsValid =
        passwordProgress ===
        passwordRequirements.length;

    const passwordsMatch =
        formData.passwordConfirmation
            .length > 0 &&
        formData.password ===
        formData.passwordConfirmation;

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

    async function handleGoogleRegister(
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
                "/dashboard",
                {
                    replace: true,
                },
            );
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                    "Não foi possível criar sua conta com o Google.",
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

        const name =
            formData.name.trim();

        const email =
            formData.email
                .trim()
                .toLowerCase();

        if (name.length < 2) {
            showNotification(
                "error",
                "Informe um nome com pelo menos 2 caracteres.",
            );

            return;
        }

        if (name.length > 100) {
            showNotification(
                "error",
                "O nome deve possuir no máximo 100 caracteres.",
            );

            return;
        }

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

        if (!passwordIsValid) {
            showNotification(
                "error",
                "A senha ainda não atende a todos os requisitos de segurança.",
            );

            return;
        }

        if (!passwordsMatch) {
            showNotification(
                "error",
                "A confirmação não corresponde à senha criada.",
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
                },
            );
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                    "Não foi possível criar sua conta.",
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
                        Preencha seus dados ou continue com o Google para começar a organizar sua vida financeira.
                    </p>
                </header>

                <div
                    aria-busy={
                        googleSubmitting
                    }
                >
                    <GoogleAuthButton
                        onCredential={
                            handleGoogleRegister
                        }
                        onError={
                            handleGoogleError
                        }
                        disabled={busy}
                        text="signup_with"
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
                            disabled={busy}
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
                            disabled={busy}
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
                            maxLength={72}
                            autoComplete="new-password"
                            placeholder="Crie uma senha segura"
                            disabled={busy}
                            aria-describedby="password-requirements"
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
                            maxLength={72}
                            autoComplete="new-password"
                            placeholder="Digite novamente"
                            disabled={busy}
                            aria-invalid={
                                formData
                                    .passwordConfirmation
                                    .length > 0 &&
                                !passwordsMatch
                            }
                            helperText={
                                formData
                                    .passwordConfirmation
                                    .length === 0
                                    ? ""
                                    : passwordsMatch
                                        ? "As senhas correspondem."
                                        : "As senhas ainda não correspondem."
                            }
                        />
                    </div>

                    <div
                        id="password-requirements"
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
                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Segurança da senha
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[11px]
                                        text-muted-foreground
                                    "
                                >
                                    Use uma combinação difícil de adivinhar.
                                </p>
                            </div>

                            <span
                                className={`
                                    shrink-0
                                    rounded-full
                                    px-2.5 py-1
                                    text-[10px]
                                    font-bold

                                    ${passwordIsValid
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                        : "bg-surface text-muted-foreground"
                                    }
                                `}
                            >
                                {passwordProgress}/
                                {
                                    passwordRequirements.length
                                }
                            </span>
                        </div>

                        <div
                            className="
                                mt-3 grid
                                grid-cols-5 gap-1.5
                            "
                            aria-hidden="true"
                        >
                            {passwordRequirements.map(
                                (
                                    requirement,
                                    index,
                                ) => (
                                    <span
                                        key={
                                            requirement.id
                                        }
                                        className={`
                                            h-1.5
                                            rounded-full
                                            transition-colors

                                            ${passwordProgress >
                                                index
                                                ? "bg-primary"
                                                : "bg-border"
                                            }
                                        `}
                                    />
                                ),
                            )}
                        </div>

                        <ul
                            className="
                                mt-3
                                grid gap-2
                                sm:grid-cols-2
                            "
                        >
                            {passwordRequirements.map(
                                (
                                    requirement,
                                ) => (
                                    <li
                                        key={
                                            requirement.id
                                        }
                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            transition-colors

                                            ${requirement.valid
                                                ? "font-medium text-emerald-600 dark:text-emerald-400"
                                                : "text-muted-foreground"
                                            }
                                        `}
                                    >
                                        <RiCheckboxCircleLine
                                            size={16}
                                            aria-hidden="true"
                                            className={
                                                requirement.valid
                                                    ? "opacity-100"
                                                    : "opacity-35"
                                            }
                                        />

                                        <span>
                                            {
                                                requirement.label
                                            }
                                        </span>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

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