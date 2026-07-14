import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router";

import { FiUserPlus } from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth.js";

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
        <main className="flex min-h-screen items-center justify-center p-4">
            <section className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                <div className="mb-6 flex items-center gap-3">
                    <FiUserPlus size={26} />

                    <h1 className="text-2xl font-bold">
                        Criar conta
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
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium"
                        >
                            Nome
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            placeholder="Digite seu nome"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                        />
                    </div>

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
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Mínimo de 8 caracteres"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="passwordConfirmation"
                            className="mb-1 block text-sm font-medium"
                        >
                            Confirmar senha
                        </label>

                        <input
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            type="password"
                            value={formData.passwordConfirmation}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Digite a senha novamente"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting
                            ? "Cadastrando..."
                            : "Cadastrar"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-600">
                    Já possui uma conta?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-slate-900 underline"
                    >
                        Entrar
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Register;