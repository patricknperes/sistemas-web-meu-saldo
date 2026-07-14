import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit2,
    FiPlus,
    FiRefreshCw,
    FiTrash2,
    FiTrendingUp,
    FiX,
} from "react-icons/fi";

import { transactionService } from "../../services/transactionService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import {
    getMonthName,
    months,
} from "../../utils/months.js";

const ITEMS_PER_PAGE = 20;

function getTodayInputValue() {
    const now = new Date();

    const localDate = new Date(
        now.getTime() -
        now.getTimezoneOffset() * 60 * 1000
    );

    return localDate.toISOString().slice(0, 10);
}

function createDateForSelectedPeriod(
    filterMode,
    selectedMonth,
    selectedYear
) {
    const currentDate = new Date();

    const currentMonth =
        currentDate.getMonth() + 1;

    const currentYear =
        currentDate.getFullYear();

    if (
        filterMode === "MONTH" &&
        Number(selectedYear) >= 1900
    ) {
        if (
            Number(selectedMonth) === currentMonth &&
            Number(selectedYear) === currentYear
        ) {
            return getTodayInputValue();
        }

        return `${selectedYear}-${String(
            selectedMonth
        ).padStart(2, "0")}-01`;
    }

    if (
        filterMode === "YEAR" &&
        Number(selectedYear) >= 1900
    ) {
        if (Number(selectedYear) === currentYear) {
            return getTodayInputValue();
        }

        return `${selectedYear}-01-01`;
    }

    return getTodayInputValue();
}

function createInitialFormData(date) {
    return {
        description: "",
        amount: "",
        category: "",
        date,
        notes: "",
    };
}

function Revenues() {
    const currentDate = new Date();

    const [filterMode, setFilterMode] =
        useState("MONTH");

    const [selectedMonth, setSelectedMonth] =
        useState(
            () => currentDate.getMonth() + 1
        );

    const [selectedYear, setSelectedYear] =
        useState(
            () => currentDate.getFullYear()
        );

    const [page, setPage] = useState(1);

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: ITEMS_PER_PAGE,
            totalItems: 0,
            totalPages: 0,
        });

    const [
        totalFilteredCents,
        setTotalFilteredCents,
    ] = useState(0);

    const [revenues, setRevenues] =
        useState([]);

    const [formData, setFormData] =
        useState(() =>
            createInitialFormData(
                getTodayInputValue()
            )
        );

    const [formVisible, setFormVisible] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const loadRevenues = useCallback(
        async () => {
            setLoading(true);
            setErrorMessage("");

            const year = Number(selectedYear);

            if (
                filterMode !== "ALL" &&
                (!Number.isInteger(year) ||
                    year < 1900 ||
                    year > 2100)
            ) {
                setRevenues([]);
                setTotalFilteredCents(0);

                setPagination({
                    page: 1,
                    limit: ITEMS_PER_PAGE,
                    totalItems: 0,
                    totalPages: 0,
                });

                setErrorMessage(
                    "Informe um ano válido entre 1900 e 2100."
                );

                setLoading(false);
                return;
            }

            try {
                const params = {
                    type: "INCOME",
                    page,
                    limit: ITEMS_PER_PAGE,
                };

                if (filterMode === "MONTH") {
                    params.month = selectedMonth;
                    params.year = year;
                }

                if (filterMode === "YEAR") {
                    params.year = year;
                }

                /*
                  No modo ALL, não enviamos mês nem ano.
                  O backend retorna todo o histórico.
                */

                const response =
                    await transactionService.list(
                        params
                    );

                setRevenues(
                    response.transactions ?? []
                );

                setTotalFilteredCents(
                    response.summary
                        ?.totalAmountCents ?? 0
                );

                setPagination(
                    response.pagination ?? {
                        page: 1,
                        limit: ITEMS_PER_PAGE,
                        totalItems: 0,
                        totalPages: 0,
                    }
                );
            } catch (error) {
                setRevenues([]);
                setTotalFilteredCents(0);

                setPagination({
                    page: 1,
                    limit: ITEMS_PER_PAGE,
                    totalItems: 0,
                    totalPages: 0,
                });

                setErrorMessage(
                    error.response?.data?.error ??
                    "Não foi possível carregar as receitas."
                );
            } finally {
                setLoading(false);
            }
        },
        [
            filterMode,
            selectedMonth,
            selectedYear,
            page,
        ]
    );

    useEffect(() => {
        loadRevenues();
    }, [loadRevenues]);

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    function handleFilterModeChange(event) {
        const newMode = event.target.value;

        setFilterMode(newMode);
        setPage(1);
        clearMessages();
    }

    function handleMonthChange(event) {
        setSelectedMonth(
            Number(event.target.value)
        );

        setPage(1);
        clearMessages();
    }

    function handleYearChange(event) {
        const value = event.target.value;

        setSelectedYear(
            value === "" ? "" : Number(value)
        );

        setPage(1);
        clearMessages();
    }

    function openCreateForm() {
        const defaultDate =
            createDateForSelectedPeriod(
                filterMode,
                selectedMonth,
                selectedYear
            );

        setEditingId(null);

        setFormData(
            createInitialFormData(defaultDate)
        );

        clearMessages();
        setFormVisible(true);
    }

    function openEditForm(revenue) {
        setEditingId(revenue.id);

        setFormData({
            description: revenue.description,

            amount: (
                revenue.amountCents / 100
            ).toFixed(2),

            category: revenue.category,

            date: revenue.date.slice(0, 10),

            notes: revenue.notes ?? "",
        });

        clearMessages();
        setFormVisible(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function closeForm() {
        setFormVisible(false);
        setEditingId(null);

        setFormData(
            createInitialFormData(
                getTodayInputValue()
            )
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        clearMessages();

        const normalizedAmount = String(
            formData.amount
        ).replace(",", ".");

        const amount = Number(normalizedAmount);

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            setErrorMessage(
                "Informe um valor maior que zero."
            );

            return;
        }

        if (
            formData.description.trim().length < 2
        ) {
            setErrorMessage(
                "A descrição deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        if (
            formData.category.trim().length < 2
        ) {
            setErrorMessage(
                "A categoria deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        const amountCents = Math.round(
            amount * 100
        );

        const transactionData = {
            description:
                formData.description.trim(),

            amountCents,

            type: "INCOME",

            category:
                formData.category.trim(),

            date: formData.date,

            notes:
                formData.notes.trim() || null,
        };

        setSubmitting(true);

        try {
            if (editingId) {
                await transactionService.update(
                    editingId,
                    transactionData
                );

                setSuccessMessage(
                    "Receita atualizada com sucesso."
                );
            } else {
                await transactionService.create(
                    transactionData
                );

                setSuccessMessage(
                    "Receita cadastrada com sucesso."
                );
            }

            closeForm();
            setPage(1);

            if (page === 1) {
                await loadRevenues();
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível salvar a receita."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(revenue) {
        const confirmed = window.confirm(
            `Deseja excluir a receita "${revenue.description}"?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(revenue.id);
        clearMessages();

        try {
            await transactionService.remove(
                revenue.id
            );

            setSuccessMessage(
                "Receita excluída com sucesso."
            );

            const isLastItemOnPage =
                revenues.length === 1 &&
                page > 1;

            if (isLastItemOnPage) {
                setPage(
                    (currentPage) =>
                        currentPage - 1
                );
            } else {
                await loadRevenues();
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível excluir a receita."
            );
        } finally {
            setDeletingId(null);
        }
    }

    function getFilterTotalLabel() {
        if (filterMode === "MONTH") {
            return `Total de ${getMonthName(
                selectedMonth
            )} de ${selectedYear}`;
        }

        if (filterMode === "YEAR") {
            return `Total do ano de ${selectedYear}`;
        }

        return "Total de todo o histórico";
    }

    function getListTitle() {
        if (filterMode === "MONTH") {
            return `Receitas de ${getMonthName(
                selectedMonth
            )} de ${selectedYear}`;
        }

        if (filterMode === "YEAR") {
            return `Receitas do ano de ${selectedYear}`;
        }

        return "Histórico completo de receitas";
    }

    function handlePreviousPage() {
        setPage((currentPage) =>
            Math.max(currentPage - 1, 1)
        );
    }

    function handleNextPage() {
        setPage((currentPage) =>
            Math.min(
                currentPage + 1,
                pagination.totalPages
            )
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Receitas
                    </h1>

                    <p className="text-sm text-slate-500">
                        Gerencie suas entradas
                        financeiras.
                    </p>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                    <button
                        type="button"
                        onClick={loadRevenues}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                        <FiRefreshCw
                            className={
                                loading ? "animate-spin" : ""
                            }
                        />

                        Atualizar
                    </button>

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white sm:flex-none"
                    >
                        <FiPlus />

                        Nova receita
                    </button>
                </div>
            </div>

            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label
                            htmlFor="revenue-filter-mode"
                            className="mb-1 block text-sm font-medium text-slate-700"
                        >
                            Visualização
                        </label>

                        <select
                            id="revenue-filter-mode"
                            value={filterMode}
                            onChange={
                                handleFilterModeChange
                            }
                            className="rounded-md border border-slate-300 bg-white px-3 py-2"
                        >
                            <option value="MONTH">
                                Por mês
                            </option>

                            <option value="YEAR">
                                Ano inteiro
                            </option>

                            <option value="ALL">
                                Todo o histórico
                            </option>
                        </select>
                    </div>

                    {filterMode === "MONTH" && (
                        <div>
                            <label
                                htmlFor="revenue-month"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Mês
                            </label>

                            <select
                                id="revenue-month"
                                value={selectedMonth}
                                onChange={
                                    handleMonthChange
                                }
                                className="rounded-md border border-slate-300 bg-white px-3 py-2"
                            >
                                {months.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(filterMode === "MONTH" ||
                        filterMode === "YEAR") && (
                            <div>
                                <label
                                    htmlFor="revenue-year"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Ano
                                </label>

                                <input
                                    id="revenue-year"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={selectedYear}
                                    onChange={
                                        handleYearChange
                                    }
                                    className="w-28 rounded-md border border-slate-300 px-3 py-2"
                                />
                            </div>
                        )}

                    <div className="w-full sm:ml-auto sm:w-auto">
                        <p className="text-sm text-slate-500">
                            {getFilterTotalLabel()}
                        </p>

                        <p className="text-xl font-bold text-slate-800">
                            {formatCurrency(
                                totalFilteredCents
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div
                    role="alert"
                    className="mb-4 rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-700"
                >
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div
                    role="status"
                    className="mb-4 rounded-md border border-green-200 bg-green-100 p-3 text-sm text-green-700"
                >
                    {successMessage}
                </div>
            )}

            {formVisible && (
                <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">
                            {editingId
                                ? "Editar receita"
                                : "Cadastrar receita"}
                        </h2>

                        <button
                            type="button"
                            onClick={closeForm}
                            aria-label="Fechar formulário"
                            title="Fechar formulário"
                            className="rounded-md p-2 hover:bg-slate-100"
                        >
                            <FiX />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div>
                            <label
                                htmlFor="revenue-description"
                                className="mb-1 block text-sm font-medium"
                            >
                                Descrição
                            </label>

                            <input
                                id="revenue-description"
                                name="description"
                                type="text"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={150}
                                placeholder="Ex.: Salário"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="revenue-amount"
                                className="mb-1 block text-sm font-medium"
                            >
                                Valor
                            </label>

                            <input
                                id="revenue-amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0.01"
                                step="0.01"
                                placeholder="0,00"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="revenue-category"
                                className="mb-1 block text-sm font-medium"
                            >
                                Categoria
                            </label>

                            <input
                                id="revenue-category"
                                name="category"
                                type="text"
                                value={
                                    formData.category
                                }
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={80}
                                placeholder="Ex.: Salário"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="revenue-date"
                                className="mb-1 block text-sm font-medium"
                            >
                                Data
                            </label>

                            <input
                                id="revenue-date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                            />

                            <p className="mt-1 text-xs text-slate-500">
                                Para mover a receita para
                                outro mês ou ano, altere a
                                data.
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="revenue-notes"
                                className="mb-1 block text-sm font-medium"
                            >
                                Observações
                            </label>

                            <textarea
                                id="revenue-notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                maxLength={500}
                                rows={3}
                                placeholder="Observações opcionais"
                                className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                            />
                        </div>

                        <div className="flex flex-wrap justify-end gap-2 md:col-span-2">
                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={submitting}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Salvando..."
                                    : editingId
                                        ? "Salvar alterações"
                                        : "Cadastrar receita"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                        <FiTrendingUp />

                        <h2 className="font-semibold">
                            {getListTitle()}
                        </h2>
                    </div>

                    <span className="text-sm text-slate-500">
                        {pagination.totalItems}{" "}
                        {pagination.totalItems === 1
                            ? "receita"
                            : "receitas"}
                    </span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        Carregando receitas...
                    </div>
                ) : revenues.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        Nenhuma receita encontrada
                        para o filtro selecionado.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-170 text-left text-sm">
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

                                    <th className="px-4 py-3 text-right">
                                        Valor
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {revenues.map((revenue) => (
                                    <tr
                                        key={revenue.id}
                                        className="border-t border-slate-200"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {revenue.description}

                                            {revenue.notes && (
                                                <p className="mt-1 max-w-60 truncate text-xs font-normal text-slate-500">
                                                    {revenue.notes}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-slate-600">
                                            {revenue.category}
                                        </td>

                                        <td className="px-4 py-3 text-slate-600">
                                            {formatDate(
                                                revenue.date
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right font-medium text-green-600">
                                            {formatCurrency(
                                                revenue.amountCents
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(
                                                            revenue
                                                        )
                                                    }
                                                    aria-label="Editar receita"
                                                    title="Editar receita"
                                                    className="rounded-md border border-slate-300 p-2 hover:bg-slate-100"
                                                >
                                                    <FiEdit2 />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            revenue
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        revenue.id
                                                    }
                                                    aria-label="Excluir receita"
                                                    title="Excluir receita"
                                                    className="rounded-md border border-red-300 p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
                        <p className="text-sm text-slate-500">
                            Página {pagination.page} de{" "}
                            {pagination.totalPages}
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={
                                    page <= 1 || loading
                                }
                                onClick={
                                    handlePreviousPage
                                }
                                className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiChevronLeft />

                                Anterior
                            </button>

                            <button
                                type="button"
                                disabled={
                                    page >=
                                    pagination.totalPages ||
                                    loading
                                }
                                onClick={handleNextPage}
                                className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Próxima

                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Revenues;