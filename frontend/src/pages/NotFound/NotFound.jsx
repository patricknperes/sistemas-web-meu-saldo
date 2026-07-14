import {
    FiArrowLeft,
    FiAlertCircle,
} from "react-icons/fi";

import {
    Link,
} from "react-router";

function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center">
                <FiAlertCircle
                    size={48}
                    className="mx-auto mb-4 text-slate-500"
                />

                <p className="mb-2 text-sm font-medium text-slate-500">
                    Erro 404
                </p>

                <h1 className="mb-3 text-2xl font-bold text-slate-800">
                    Página não encontrada
                </h1>

                <p className="mb-6 text-sm text-slate-600">
                    O endereço acessado não existe ou foi removido.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                >
                    <FiArrowLeft />

                    Voltar para a Dashboard
                </Link>
            </section>
        </main>
    );
}

export default NotFound;