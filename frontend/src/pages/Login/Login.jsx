import { useState } from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router";

import {
    FiLogIn,
} from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth.js";

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
        <main className="flex min-h-screen items-center justify-center p-4">
            <section className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                <div className="mb-6 flex items-center gap-3">
                    <FiLogIn size={26} />

                    <h1 className="text-2xl font-bold">
                        Entrar
                    </h1>
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="seu@email.com"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium"
                        >
                            Senha
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting
                            ? "Entrando..."
                            : "Entrar"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-600">
                    Não possui uma conta?{" "}
                    <Link
                        to="/cadastro"
                        className="font-medium text-slate-900 underline"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Login;