import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    RiAddLine,
    RiArrowDownCircleLine,
    RiLoader4Line,
    RiRefreshLine,
} from "react-icons/ri";

import ConfirmDialog from "../../components/feedback/ConfirmDialog.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import TransactionFilters from "../../components/transactions/TransactionFilters.jsx";
import TransactionFormModal from "../../components/transactions/TransactionFormModal.jsx";
import TransactionList from "../../components/transactions/TransactionList.jsx";

import {
    transactionService,
} from "../../services/transactionService.js";

import {
    getMonthName,
} from "../../utils/months.js";

const DEFAULT_PAGE_SIZE = 10;

const PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
];

function createEmptyPagination(
    limit = DEFAULT_PAGE_SIZE
) {
    return {
        page: 1,
        limit,
        totalItems: 0,
        totalPages: 0,
    };
}

function getTodayInputValue() {
    const now = new Date();

    const localDate = new Date(
        now.getTime() -
        now.getTimezoneOffset() *
        60 *
        1000
    );

    return localDate
        .toISOString()
        .slice(0, 10);
}

function createDateForSelectedPeriod(
    filterMode,
    selectedMonth,
    selectedYear
) {
    const currentDate =
        new Date();

    const currentMonth =
        currentDate.getMonth() + 1;

    const currentYear =
        currentDate.getFullYear();

    const normalizedYear =
        Number(selectedYear);

    if (
        filterMode === "MONTH" &&
        normalizedYear >= 1900
    ) {
        if (
            Number(selectedMonth) ===
            currentMonth &&
            normalizedYear ===
            currentYear
        ) {
            return getTodayInputValue();
        }

        return `${normalizedYear}-${String(
            selectedMonth
        ).padStart(2, "0")}-01`;
    }

    if (
        filterMode === "YEAR" &&
        normalizedYear >= 1900
    ) {
        if (
            normalizedYear ===
            currentYear
        ) {
            return getTodayInputValue();
        }

        return `${normalizedYear}-01-01`;
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

function Expenses() {
    const currentDate =
        new Date();

    /*
     * Impede que respostas antigas substituam
     * resultados de filtros ou pesquisas novas.
     */
    const requestSequenceReference =
        useRef(0);

    const [
        filterMode,
        setFilterMode,
    ] = useState("MONTH");

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState(
        () =>
            currentDate.getMonth() + 1
    );

    const [
        selectedYear,
        setSelectedYear,
    ] = useState(
        () =>
            currentDate.getFullYear()
    );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        debouncedSearchTerm,
        setDebouncedSearchTerm,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pageSize,
        setPageSize,
    ] = useState(
        DEFAULT_PAGE_SIZE
    );

    const [
        pagination,
        setPagination,
    ] = useState(() =>
        createEmptyPagination(
            DEFAULT_PAGE_SIZE
        )
    );

    const [
        totalFilteredCents,
        setTotalFilteredCents,
    ] = useState(0);

    const [
        expenses,
        setExpenses,
    ] = useState([]);

    const [
        formData,
        setFormData,
    ] = useState(() =>
        createInitialFormData(
            getTodayInputValue()
        )
    );

    const [
        formVisible,
        setFormVisible,
    ] = useState(false);

    const [
        editingId,
        setEditingId,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        transactionToDelete,
        setTransactionToDelete,
    ] = useState(null);

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    const showNotification =
        useCallback(
            (type, message) => {
                setNotification({
                    type,
                    message,
                });
            },
            []
        );

    const clearNotification =
        useCallback(() => {
            setNotification({
                type: "info",
                message: "",
            });
        }, []);

    /*
     * Evita realizar uma consulta à API
     * a cada tecla digitada.
     */
    useEffect(() => {
        const timeout =
            window.setTimeout(() => {
                setDebouncedSearchTerm(
                    searchTerm.trim()
                );
            }, 350);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [searchTerm]);

    const loadExpenses =
        useCallback(async () => {
            const requestSequence =
                requestSequenceReference
                    .current + 1;

            requestSequenceReference.current =
                requestSequence;

            const year =
                Number(selectedYear);

            if (
                filterMode !== "ALL" &&
                (
                    !Number.isInteger(
                        year
                    ) ||
                    year < 1900 ||
                    year > 2100
                )
            ) {
                setExpenses([]);
                setTotalFilteredCents(0);

                setPagination(
                    createEmptyPagination(
                        pageSize
                    )
                );

                setLoading(false);

                showNotification(
                    "error",
                    "Informe um ano válido entre 1900 e 2100."
                );

                return;
            }

            setLoading(true);

            try {
                const params = {
                    type: "EXPENSE",
                    page,
                    limit: pageSize,
                };

                if (
                    filterMode ===
                    "MONTH"
                ) {
                    params.month =
                        Number(
                            selectedMonth
                        );

                    params.year =
                        year;
                }

                if (
                    filterMode ===
                    "YEAR"
                ) {
                    params.year =
                        year;
                }

                /*
                 * Pesquisa realizada no backend,
                 * considerando todos os registros.
                 */
                if (
                    debouncedSearchTerm
                ) {
                    params.search =
                        debouncedSearchTerm;
                }

                const response =
                    await transactionService
                        .list(params);

                if (
                    requestSequence !==
                    requestSequenceReference
                        .current
                ) {
                    return;
                }

                const responsePagination = {
                    ...createEmptyPagination(
                        pageSize
                    ),
                    ...(response.pagination ??
                        {}),
                };

                /*
                 * Volta para uma página válida caso
                 * a página atual deixe de existir.
                 */
                if (
                    responsePagination
                        .totalPages > 0 &&
                    page >
                    responsePagination
                        .totalPages
                ) {
                    setPage(
                        responsePagination
                            .totalPages
                    );

                    return;
                }

                setExpenses(
                    Array.isArray(
                        response.transactions
                    )
                        ? response.transactions
                        : []
                );

                setTotalFilteredCents(
                    Number(
                        response.summary
                            ?.totalAmountCents
                    ) || 0
                );

                setPagination(
                    responsePagination
                );
            } catch (error) {
                if (
                    requestSequence !==
                    requestSequenceReference
                        .current
                ) {
                    return;
                }

                setExpenses([]);
                setTotalFilteredCents(0);

                setPagination(
                    createEmptyPagination(
                        pageSize
                    )
                );

                showNotification(
                    "error",
                    error.response?.data
                        ?.error ??
                    "Não foi possível carregar as despesas."
                );
            } finally {
                if (
                    requestSequence ===
                    requestSequenceReference
                        .current
                ) {
                    setLoading(false);
                }
            }
        }, [
            filterMode,
            selectedMonth,
            selectedYear,
            debouncedSearchTerm,
            page,
            pageSize,
            showNotification,
        ]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (currentFormData) => ({
                ...currentFormData,
                [name]: value,
            })
        );
    }

    function handleSearchChange(
        value
    ) {
        clearNotification();

        setSearchTerm(value);
        setPage(1);
    }

    function handleApplyFilters(
        filters
    ) {
        clearNotification();

        setFilterMode(
            filters.filterMode
        );

        setSelectedMonth(
            Number(
                filters.selectedMonth
            )
        );

        setSelectedYear(
            Number(
                filters.selectedYear
            )
        );

        setPage(1);
    }

    function handlePageChange(
        nextPage
    ) {
        const normalizedPage =
            Number(nextPage);

        if (
            loading ||
            !Number.isInteger(
                normalizedPage
            ) ||
            normalizedPage < 1 ||
            normalizedPage >
            pagination.totalPages
        ) {
            return;
        }

        setPage(normalizedPage);
    }

    function handlePageSizeChange(
        nextPageSize
    ) {
        const normalizedPageSize =
            Number(nextPageSize);

        if (
            !PAGE_SIZE_OPTIONS.includes(
                normalizedPageSize
            )
        ) {
            return;
        }

        setPageSize(
            normalizedPageSize
        );

        setPage(1);
    }

    function openCreateForm() {
        const defaultDate =
            createDateForSelectedPeriod(
                filterMode,
                selectedMonth,
                selectedYear
            );

        clearNotification();

        setEditingId(null);

        setFormData(
            createInitialFormData(
                defaultDate
            )
        );

        setFormVisible(true);
    }

    function openEditForm(
        expense
    ) {
        clearNotification();

        setEditingId(
            expense.id
        );

        setFormData({
            description:
                expense.description ??
                "",

            /*
             * O modal recebe o valor em
             * centavos sem formatação.
             */
            amount: String(
                expense.amountCents ??
                ""
            ),

            category:
                expense.category ??
                "",

            date:
                expense.date?.slice(
                    0,
                    10
                ) ??
                getTodayInputValue(),

            notes:
                expense.notes ?? "",
        });

        setFormVisible(true);
    }

    function closeForm() {
        if (submitting) {
            return;
        }

        setFormVisible(false);
        setEditingId(null);

        setFormData(
            createInitialFormData(
                getTodayInputValue()
            )
        );
    }

    async function handleSubmit(
        event
    ) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        clearNotification();

        const description =
            String(
                formData.description ??
                ""
            ).trim();

        const category =
            String(
                formData.category ??
                ""
            ).trim();

        const notes =
            String(
                formData.notes ?? ""
            ).trim();

        const amountDigits =
            String(
                formData.amount ?? ""
            ).replace(/\D/g, "");

        let amountCentsBigInt;

        try {
            amountCentsBigInt =
                amountDigits
                    ? BigInt(
                        amountDigits
                    )
                    : 0n;
        } catch {
            showNotification(
                "error",
                "Informe um valor financeiro válido."
            );

            return;
        }

        if (
            amountCentsBigInt <= 0n
        ) {
            showNotification(
                "error",
                "Informe um valor maior que zero."
            );

            return;
        }

        if (
            amountCentsBigInt >
            BigInt(
                Number.MAX_SAFE_INTEGER
            )
        ) {
            showNotification(
                "error",
                "O valor informado ultrapassa o limite seguro aceito pela aplicação."
            );

            return;
        }

        if (
            description.length < 2
        ) {
            showNotification(
                "error",
                "A descrição deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        if (
            category.length < 2
        ) {
            showNotification(
                "error",
                "A categoria deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        if (!formData.date) {
            showNotification(
                "error",
                "Informe a data da despesa."
            );

            return;
        }

        const transactionData = {
            description,

            amountCents: Number(
                amountCentsBigInt
            ),

            type: "EXPENSE",

            category,

            date: formData.date,

            notes:
                notes || null,
        };

        setSubmitting(true);

        try {
            if (editingId) {
                await transactionService
                    .update(
                        editingId,
                        transactionData
                    );

                showNotification(
                    "success",
                    "Despesa atualizada com sucesso."
                );
            } else {
                await transactionService
                    .create(
                        transactionData
                    );

                showNotification(
                    "success",
                    "Despesa cadastrada com sucesso."
                );
            }

            setFormVisible(false);
            setEditingId(null);

            setFormData(
                createInitialFormData(
                    getTodayInputValue()
                )
            );

            if (page === 1) {
                await loadExpenses();
            } else {
                setPage(1);
            }
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível salvar a despesa."
            );
        } finally {
            setSubmitting(false);
        }
    }

    function requestDelete(
        expense
    ) {
        clearNotification();

        setTransactionToDelete(
            expense
        );
    }

    function cancelDelete() {
        if (
            deletingId !== null
        ) {
            return;
        }

        setTransactionToDelete(
            null
        );
    }

    async function confirmDelete() {
        if (
            !transactionToDelete ||
            deletingId !== null
        ) {
            return;
        }

        const expense =
            transactionToDelete;

        setDeletingId(
            expense.id
        );

        clearNotification();

        try {
            await transactionService
                .remove(expense.id);

            setTransactionToDelete(
                null
            );

            showNotification(
                "success",
                "Despesa excluída com sucesso."
            );

            const isLastItemOnPage =
                expenses.length === 1 &&
                page > 1;

            if (
                isLastItemOnPage
            ) {
                setPage(
                    (currentPage) =>
                        Math.max(
                            currentPage -
                            1,
                            1
                        )
                );
            } else {
                await loadExpenses();
            }
        } catch (error) {
            setTransactionToDelete(
                null
            );

            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível excluir a despesa."
            );
        } finally {
            setDeletingId(null);
        }
    }

    function getListTitle() {
        if (
            filterMode === "MONTH"
        ) {
            return `Despesas de ${getMonthName(
                selectedMonth
            )} de ${selectedYear}`;
        }

        if (
            filterMode === "YEAR"
        ) {
            return `Despesas do ano de ${selectedYear}`;
        }

        return "Histórico completo de despesas";
    }

    function getTotalLabel() {
        if (
            debouncedSearchTerm
        ) {
            return "Total encontrado";
        }

        if (
            filterMode === "MONTH"
        ) {
            return `Total de ${getMonthName(
                selectedMonth
            )}`;
        }

        if (
            filterMode === "YEAR"
        ) {
            return `Total de ${selectedYear}`;
        }

        return "Total do histórico";
    }

    return (
        <div
            className="
                w-full min-w-0
                max-w-none
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex w-full min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex min-w-0
                        flex-col gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex min-w-0
                            items-center gap-3
                        "
                    >
                        <span
                            className="
                                hidden size-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-rose-500
                                via-rose-600
                                to-red-700
                                text-white
                                shadow-lg
                                shadow-rose-500/20
                                sm:flex
                            "
                        >
                            <RiArrowDownCircleLine
                                size={22}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <div
                                className="
                                    flex flex-wrap
                                    items-center gap-2
                                "
                            >
                                <h1
                                    className="
                                        truncate
                                        text-2xl
                                        font-semibold
                                        tracking-tight
                                        text-foreground
                                    "
                                >
                                    Despesas
                                </h1>

                                <span
                                    className="
                                        rounded-full
                                        bg-rose-500/10
                                        px-2.5 py-1
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-rose-700
                                        ring-1
                                        ring-inset
                                        ring-rose-500/15
                                        dark:text-rose-300
                                    "
                                >
                                    Saídas
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Cadastre e acompanhe suas saídas financeiras.
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            grid w-full
                            grid-cols-2 gap-2
                            sm:flex
                            sm:w-auto
                            sm:shrink-0
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                loadExpenses
                            }
                            disabled={loading}
                            aria-label="Atualizar despesas"
                            className="
                                inline-flex
                                min-h-10
                                min-w-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border border-border
                                bg-surface
                                px-4
                                text-sm
                                font-medium
                                text-foreground
                                shadow-sm
                                transition-all
                                hover:-translate-y-0.5
                                hover:border-rose-500/35
                                hover:bg-surface-hover
                                hover:shadow-md
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-rose-500/20
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <RiLoader4Line
                                    size={18}
                                    aria-hidden="true"
                                    className="
                                        shrink-0
                                        animate-spin
                                        text-rose-600
                                        dark:text-rose-400
                                    "
                                />
                            ) : (
                                <RiRefreshLine
                                    size={18}
                                    aria-hidden="true"
                                    className="
                                        shrink-0
                                        text-rose-600
                                        dark:text-rose-400
                                    "
                                />
                            )}

                            <span className="truncate">
                                {loading
                                    ? "Atualizando..."
                                    : "Atualizar"
                                }
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={
                                openCreateForm
                            }
                            className="
                                inline-flex
                                min-h-10
                                min-w-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-rose-500
                                via-rose-600
                                to-red-700
                                px-4
                                text-sm
                                font-semibold
                                text-white
                                shadow-md
                                shadow-rose-500/20
                                transition-all
                                hover:-translate-y-0.5
                                hover:shadow-lg
                                hover:shadow-rose-500/25
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-rose-500/25
                                active:scale-[0.99]
                            "
                        >
                            <RiAddLine
                                size={19}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            <span className="truncate">
                                Nova despesa
                            </span>
                        </button>
                    </div>
                </header>

                <TransactionFilters
                    idPrefix="expense"
                    searchTerm={
                        searchTerm
                    }
                    totalItems={
                        pagination.totalItems
                    }
                    filterMode={
                        filterMode
                    }
                    selectedMonth={
                        selectedMonth
                    }
                    selectedYear={
                        selectedYear
                    }
                    disabled={submitting}
                    onSearchChange={
                        handleSearchChange
                    }
                    onApplyFilters={
                        handleApplyFilters
                    }
                />

                <TransactionList
                    transactions={
                        expenses
                    }
                    type="EXPENSE"
                    title={
                        getListTitle()
                    }
                    singularLabel="despesa"
                    pluralLabel="despesas"
                    emptyMessage={
                        searchTerm.trim()
                            ? `Nenhuma despesa encontrada para "${searchTerm.trim()}".`
                            : "Nenhuma despesa encontrada para os filtros selecionados."
                    }
                    totalCents={
                        totalFilteredCents
                    }
                    totalLabel={
                        getTotalLabel()
                    }
                    loading={loading}
                    deletingId={
                        deletingId
                    }
                    pagination={
                        pagination
                    }
                    currentPage={page}
                    pageSize={pageSize}
                    pageSizeOptions={
                        PAGE_SIZE_OPTIONS
                    }
                    onEdit={
                        openEditForm
                    }
                    onDelete={
                        requestDelete
                    }
                    onPageChange={
                        handlePageChange
                    }
                    onPageSizeChange={
                        handlePageSizeChange
                    }
                />
            </div>

            <TransactionFormModal
                open={formVisible}
                type="EXPENSE"
                editing={Boolean(
                    editingId
                )}
                formData={formData}
                submitting={submitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onClose={closeForm}
            />

            <ConfirmDialog
                open={Boolean(
                    transactionToDelete
                )}
                title="Excluir despesa?"
                description={
                    transactionToDelete
                        ? `A despesa "${transactionToDelete.description}" será excluída permanentemente. Esta ação não poderá ser desfeita.`
                        : ""
                }
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                loading={
                    deletingId ===
                    transactionToDelete?.id
                }
                onConfirm={
                    confirmDelete
                }
                onCancel={
                    cancelDelete
                }
            />

            <Snackbar
                message={
                    notification.message
                }
                type={
                    notification.type
                }
                duration={4500}
                onClose={
                    clearNotification
                }
            />
        </div>
    );
}

export default Expenses;