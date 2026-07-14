import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    FiDollarSign,
    FiRefreshCw,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";

import { dashboardService } from "../../services/dashboardService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response =
                await dashboardService.getSummary();

            setSummary(response.summary);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível carregar a Dashboard."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center p-6">
                <p className="text-slate-500">
                    Carregando Dashboard...
                </p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="mt-3 flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                    >
                        <FiRefreshCw />

                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "Saldo atual",
            value: formatCurrency(summary?.balanceCents),
            icon: FiDollarSign,
        },
        {
            title: "Total de receitas",
            value: formatCurrency(
                summary?.totalIncomeCents
            ),
            icon: FiTrendingUp,
        },
        {
            title: "Total de despesas",
            value: formatCurrency(
                summary?.totalExpenseCents
            ),
            icon: FiTrendingDown,
        },
    ];

    const recentTransactions =
        summary?.recentTransactions ?? [];

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Resumo financeiro
                    </h1>

                    <p className="text-sm text-slate-500">
                        Acompanhe sua situação financeira.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadDashboard}
                    className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                >
                    <FiRefreshCw />

                    Atualizar
                </button>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.title}
                            className="rounded-lg border border-slate-200 bg-white p-5"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                    {card.title}
                                </p>

                                <Icon
                                    size={22}
                                    className="text-slate-600"
                                />
                            </div>

                            <p className="text-2xl font-bold text-slate-800">
                                {card.value}
                            </p>
                        </article>
                    );
                })}
            </section>

            <section className="mt-4 grid gap-4 sm:grid-cols-3">
                <article className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Transações
                    </p>

                    <p className="mt-1 text-xl font-bold">
                        {summary?.transactionCount ?? 0}
                    </p>
                </article>

                <article className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Receitas cadastradas
                    </p>

                    <p className="mt-1 text-xl font-bold">
                        {summary?.incomeCount ?? 0}
                    </p>
                </article>

                <article className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Despesas cadastradas
                    </p>

                    <p className="mt-1 text-xl font-bold">
                        {summary?.expenseCount ?? 0}
                    </p>
                </article>
            </section>

            <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Transações recentes
                    </h2>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-sm text-slate-500">
                            Nenhuma transação cadastrada.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">
                                        Descrição
                                    </th>

                                    <th className="px-4 py-3">
                                        Categoria
                                    </th>

                                    <th className="px-4 py-3">
                                        Data
                                    </th>

                                    <th className="px-4 py-3">
                                        Tipo
                                    </th>

                                    <th className="px-4 py-3 text-right">
                                        Valor
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentTransactions.map(
                                    (transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                {transaction.description}
                                            </td>

                                            <td className="px-4 py-3 text-slate-600">
                                                {transaction.category}
                                            </td>

                                            <td className="px-4 py-3 text-slate-600">
                                                {formatDate(transaction.date)}
                                            </td>

                                            <td className="px-4 py-3">
                                                {transaction.type ===
                                                    "INCOME"
                                                    ? "Receita"
                                                    : "Despesa"}
                                            </td>

                                            <td className="px-4 py-3 text-right font-medium">
                                                {formatCurrency(
                                                    transaction.amountCents
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;