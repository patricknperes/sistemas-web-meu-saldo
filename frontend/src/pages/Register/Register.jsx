import {
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

import { useAuth } from "../../hooks/useAuth.js";

import AuthInput from "../../components/auth/AuthInput.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
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

        if (
            formData.password !==
            formData.passwordConfirmation
        ) {
            setErrorMessage(
                "A confirmação da senha está diferente."
            );

            return;
        }

        setSubmitting(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível criar a conta."
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
                        <RiUserAddLine size={22} />
                    </div>

                    <h2
                        className="
                            truncate
                            text-2xl font-semibold
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
                            text-muted-foreground
                        "
                    >
                        Preencha os dados abaixo para começar
                        a organizar suas finanças.
                    </p>
                </div>

                <form
                    className="min-w-0 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <AuthInput
                        id="register-name"
                        name="name"
                        type="text"
                        label="Nome"
                        icon={RiUser3Line}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        placeholder="Digite seu nome"
                        disabled={submitting}
                    />

                    <AuthInput
                        id="register-email"
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

                    <div
                        className="
                            grid min-w-0 gap-4
                            sm:grid-cols-2
                        "
                    >
                        <AuthInput
                            id="register-password"
                            name="password"
                            type="password"
                            label="Senha"
                            icon={RiLockPasswordLine}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Mínimo de 8"
                            disabled={submitting}
                        />

                        <AuthInput
                            id="register-password-confirmation"
                            name="passwordConfirmation"
                            type="password"
                            label="Confirmar senha"
                            icon={RiLockPasswordLine}
                            value={
                                formData.passwordConfirmation
                            }
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Repita a senha"
                            disabled={submitting}
                        />
                    </div>

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
                                ? "Criando conta..."
                                : "Criar conta"}
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
}

export default Register;