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

import { useAuth } from "../../hooks/useAuth.js";

import AuthInput from "../../components/auth/AuthInput.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setErrorMessage("");
        setSubmitting(true);

        try {
            await login(formData);

            const previousPage =
                location.state?.from?.pathname ??
                "/dashboard";

            navigate(previousPage, {
                replace: true,
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível realizar o login."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Snackbar
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage("")}
            />

            <div className="min-w-0">
                <div className="mb-6 min-w-0">
                    <div
                        className="
                            mb-4
                            flex size-11
                            items-center justify-center
                            rounded-control
                            bg-surface-muted
                            text-foreground
                        "
                    >
                        <RiLoginBoxLine size={22} />
                    </div>

                    <h2
                        className="
                            truncate
                            text-2xl font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Bem-vindo novamente
                    </h2>

                    <p
                        className="
                            mt-1.5
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Entre com seus dados para acessar
                        sua conta.
                    </p>
                </div>

                <form
                    className="min-w-0 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <AuthInput
                        id="login-email"
                        name="email"
                        type="email"
                        label="E-mail"
                        icon={RiMailLine}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="seu@email.com"
                        disabled={submitting}
                    />

                    <AuthInput
                        id="login-password"
                        name="password"
                        type="password"
                        label="Senha"
                        icon={RiLockPasswordLine}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        disabled={submitting}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className="
                            mt-2
                            inline-flex min-h-12
                            w-full min-w-0
                            items-center justify-center
                            gap-2
                            rounded-control
                            bg-primary
                            px-4
                            text-sm font-medium
                            text-primary-foreground
                            transition
                            hover:bg-primary-hover
                            active:scale-[0.99]
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >
                        {submitting && (
                            <RiLoader4Line
                                size={19}
                                className="animate-spin"
                            />
                        )}

                        <span className="truncate">
                            {submitting
                                ? "Entrando..."
                                : "Entrar"}
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;