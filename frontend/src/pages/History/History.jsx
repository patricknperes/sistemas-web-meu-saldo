import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    FiCalendar,
    FiRefreshCw,
} from "react-icons/fi";

import { dashboardService } from "../../services/dashboardService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { getMonthName } from "../../utils/months.js";

function History() {
    const [history, setHistory] = useState([]);
    const [selectedYear, setSelectedYear] =
        useState(new Date().getFullYear());

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] =
        useState("");

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response =
                await dashboardService.getHistory(
                    selectedYear
                );

            setHistory(response.history ?? []);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível carregar o histórico."
            );
        } finally {
            setLoading(false);
        }
    }, [selectedYear]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">
                        Histórico mensal
                    </h1>

                    <p className="text-sm text-slate-500">
                        Consulte o resumo financeiro de cada mês.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadHistory}
                    className="flex items-center gap-2 rounded-md border bg-white px-4 py-2"
                >
                    <FiRefreshCw />
                    Atualizar
                </button>
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                    Ano
                </label>

                <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={selectedYear}
                    onChange={(event) =>
                        setSelectedYear(
                            Number(event.target.value)
                        )
                    }
                    className="w-32 rounded-md border border-slate-300 px-3 py-2"
                />
            </div>

            {errorMessage && (
                <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p>Carregando histórico...</p>
            ) : history.length === 0 ? (
                <p className="rounded-lg bg-white p-6 text-center text-slate-500">
                    Nenhuma transação encontrada neste ano.
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {history.map((monthData) => (
                        <article
                            key={monthData.key}
                            className="rounded-lg border border-slate-200 bg-white p-5"
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <FiCalendar />

                                <h2 className="font-semibold">
                                    {getMonthName(monthData.month)}{" "}
                                    de {monthData.year}
                                </h2>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Receitas</span>

                                    <strong>
                                        {formatCurrency(
                                            monthData.totalIncomeCents
                                        )}
                                    </strong>
                                </div>

                                <div className="flex justify-between">
                                    <span>Despesas</span>

                                    <strong>
                                        {formatCurrency(
                                            monthData.totalExpenseCents
                                        )}
                                    </strong>
                                </div>

                                <div className="flex justify-between border-t pt-2">
                                    <span>Saldo</span>

                                    <strong>
                                        {formatCurrency(
                                            monthData.balanceCents
                                        )}
                                    </strong>
                                </div>

                                <div className="flex justify-between">
                                    <span>Lançamentos</span>

                                    <strong>
                                        {monthData.transactionCount}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;