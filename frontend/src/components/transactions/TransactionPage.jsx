import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiAddLine,
    RiCalendarLine,
    RiErrorWarningLine,
    RiFileList3Line,
    RiRefreshLine,
    RiRepeat2Line,
} from "react-icons/ri";

import ConfirmDialog from "../feedback/ConfirmDialog.jsx";
import Snackbar from "../feedback/Snackbar.jsx";

import {
    getTransactionTypeConfig,
    normalizeTransactionType,
} from "../../config/transactionTypeConfig.js";

import {
    transactionService,
} from "../../services/transactionService.js";

import {
    getMonthName,
} from "../../utils/months.js";

import RecurringTransactionList from "./RecurringTransactionList.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionFormModal from "./TransactionFormModal.jsx";
import TransactionList from "./TransactionList.jsx";

const DEFAULT_PAGE_SIZE = 10;

const PAGE_TABS = Object.freeze({
    TRANSACTIONS: "TRANSACTIONS",
    RECURRING: "RECURRING",
});

function createEmptyPagination() {
    return {
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
    };
}

function formatCurrency(amountCents) {
    const normalizedAmount =
        Number(amountCents);

    const safeAmount =
        Number.isFinite(
            normalizedAmount,
        )
            ? normalizedAmount
            : 0;

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    ).format(
        safeAmount / 100,
    );
}

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error?.response?.data;

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
        Array.isArray(
            responseData?.errors,
        ) &&
        responseData.errors.length > 0
    ) {
        const firstError =
            responseData.errors[0];

        if (
            typeof firstError ===
            "string"
        ) {
            return firstError;
        }

        if (
            typeof firstError?.message ===
            "string"
        ) {
            return firstError.message;
        }
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

function getPeriodLabel({
    filterMode,
    selectedMonth,
    selectedYear,
}) {
    if (filterMode === "MONTH") {
        return `${getMonthName(
            Number(selectedMonth),
        )} de ${selectedYear}`;
    }

    if (filterMode === "YEAR") {
        return `Ano de ${selectedYear}`;
    }

    return "Todo o histórico";
}

function capitalizeFirstLetter(
    value,
) {
    const text =
        String(value ?? "");

    if (!text) {
        return "";
    }

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}

function TransactionPage({
    type = "INCOME",
}) {
    const normalizedType =
        normalizeTransactionType(
            type,
        ) || "INCOME";

    const config =
        useMemo(
            () =>
                getTransactionTypeConfig(
                    normalizedType,
                ),
            [normalizedType],
        );

    const TypeIcon =
        config.icon;

    const currentDate =
        useMemo(
            () => new Date(),
            [],
        );

    const requestSequenceReference =
        useRef(0);

    const [
        activeTab,
        setActiveTab,
    ] = useState(
        PAGE_TABS.TRANSACTIONS,
    );

    const [
        filterMode,
        setFilterMode,
    ] = useState("MONTH");

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState(
        () =>
            currentDate.getMonth() + 1,
    );

    const [
        selectedYear,
        setSelectedYear,
    ] = useState(
        () =>
            currentDate.getFullYear(),
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
        transactions,
        setTransactions,
    ] = useState([]);

    const [
        totalFilteredCents,
        setTotalFilteredCents,
    ] = useState(0);

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pagination,
        setPagination,
    ] = useState(
        createEmptyPagination,
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        transactionToDelete,
        setTransactionToDelete,
    ] = useState(null);

    const [
        formOpen,
        setFormOpen,
    ] = useState(false);

    const [
        formInitialKind,
        setFormInitialKind,
    ] = useState("SINGLE");

    const [
        selectedTransaction,
        setSelectedTransaction,
    ] = useState(null);

    const [
        selectedRecurringTransaction,
        setSelectedRecurringTransaction,
    ] = useState(null);

    const [
        transactionRefreshKey,
        setTransactionRefreshKey,
    ] = useState(0);

    const [
        recurringRefreshKey,
        setRecurringRefreshKey,
    ] = useState(0);

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    const showNotification =
        useCallback(
            (
                notificationType,
                message,
            ) => {
                setNotification({
                    type:
                        notificationType,
                    message,
                });
            },
            [],
        );

    const clearNotification =
        useCallback(() => {
            setNotification({
                type: "info",
                message: "",
            });
        }, []);

    useEffect(() => {
        const timeout =
            window.setTimeout(() => {
                setDebouncedSearchTerm(
                    searchTerm.trim(),
                );

                setPage(1);
            }, 350);

        return () => {
            window.clearTimeout(
                timeout,
            );
        };
    }, [searchTerm]);

    const loadTransactions =
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
                        year,
                    ) ||
                    year < 1900 ||
                    year > 2100
                )
            ) {
                setTransactions([]);
                setTotalFilteredCents(0);

                setPagination(
                    createEmptyPagination(),
                );

                setLoading(false);

                setLoadError(
                    "Informe um ano válido entre 1900 e 2100.",
                );

                return;
            }

            setLoading(true);
            setLoadError("");

            try {
                const filters = {
                    type:
                        normalizedType,

                    page,

                    limit:
                        DEFAULT_PAGE_SIZE,
                };

                if (
                    filterMode ===
                    "MONTH"
                ) {
                    filters.month =
                        Number(
                            selectedMonth,
                        );

                    filters.year =
                        year;
                }

                if (
                    filterMode ===
                    "YEAR"
                ) {
                    filters.year =
                        year;
                }

                if (
                    debouncedSearchTerm
                ) {
                    filters.search =
                        debouncedSearchTerm;
                }

                const response =
                    await transactionService.list(
                        filters,
                    );

                if (
                    requestSequence !==
                    requestSequenceReference
                        .current
                ) {
                    return;
                }

                const receivedTransactions =
                    Array.isArray(
                        response
                            ?.transactions,
                    )
                        ? response.transactions
                        : [];

                const receivedPagination = {
                    ...createEmptyPagination(),

                    ...(response
                        ?.pagination ??
                        {}),
                };

                const totalPages =
                    Number(
                        receivedPagination
                            .totalPages,
                    ) || 0;

                if (
                    totalPages > 0 &&
                    page > totalPages
                ) {
                    setPage(totalPages);
                    return;
                }

                setTransactions(
                    receivedTransactions,
                );

                setTotalFilteredCents(
                    Number(
                        response?.summary
                            ?.totalAmountCents,
                    ) || 0,
                );

                setPagination(
                    receivedPagination,
                );
            } catch (error) {
                if (
                    requestSequence !==
                    requestSequenceReference
                        .current
                ) {
                    return;
                }

                setTransactions([]);
                setTotalFilteredCents(0);

                setPagination(
                    createEmptyPagination(),
                );

                const message =
                    getErrorMessage(
                        error,
                        `Não foi possível carregar ${config.articlePlural} ${config.plural}.`,
                    );

                setLoadError(message);

                showNotification(
                    "error",
                    message,
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
            config,
            debouncedSearchTerm,
            filterMode,
            normalizedType,
            page,
            selectedMonth,
            selectedYear,
            showNotification,
        ]);

    useEffect(() => {
        if (
            activeTab !==
            PAGE_TABS.TRANSACTIONS
        ) {
            return;
        }

        loadTransactions();
    }, [
        activeTab,
        loadTransactions,
        transactionRefreshKey,
    ]);

    useEffect(() => {
        return () => {
            requestSequenceReference
                .current += 1;
        };
    }, []);

    const closeForm =
        useCallback(() => {
            setFormOpen(false);

            setSelectedTransaction(
                null,
            );

            setSelectedRecurringTransaction(
                null,
            );

            setFormInitialKind(
                "SINGLE",
            );
        }, []);

    const openCreateForm =
        useCallback(() => {
            clearNotification();

            setSelectedTransaction(
                null,
            );

            setSelectedRecurringTransaction(
                null,
            );

            setFormInitialKind(
                activeTab ===
                    PAGE_TABS.RECURRING
                    ? "RECURRING"
                    : "SINGLE",
            );

            setFormOpen(true);
        }, [
            activeTab,
            clearNotification,
        ]);

    const openTransactionEditForm =
        useCallback(
            (transaction) => {
                clearNotification();

                setSelectedRecurringTransaction(
                    null,
                );

                setSelectedTransaction(
                    transaction,
                );

                setFormInitialKind(
                    "SINGLE",
                );

                setFormOpen(true);
            },
            [clearNotification],
        );

    const openRecurringEditForm =
        useCallback(
            (
                recurringTransaction,
            ) => {
                clearNotification();

                setSelectedTransaction(
                    null,
                );

                setSelectedRecurringTransaction(
                    recurringTransaction,
                );

                setFormInitialKind(
                    "RECURRING",
                );

                setFormOpen(true);
            },
            [clearNotification],
        );

    const handleFormSaved =
        useCallback(
            async (result) => {
                const recurring =
                    result?.kind ===
                    "RECURRING";

                const updating =
                    result?.action ===
                    "UPDATE";

                let message;

                if (recurring) {
                    message = updating
                        ? config.recurringUpdateSuccessMessage
                        : config.recurringCreateSuccessMessage;
                } else {
                    message = updating
                        ? config.updateSuccessMessage
                        : config.createSuccessMessage;
                }

                showNotification(
                    "success",
                    message,
                );

                setTransactionRefreshKey(
                    (currentKey) =>
                        currentKey + 1,
                );

                setRecurringRefreshKey(
                    (currentKey) =>
                        currentKey + 1,
                );

                setActiveTab(
                    recurring
                        ? PAGE_TABS.RECURRING
                        : PAGE_TABS.TRANSACTIONS,
                );
            },
            [
                config,
                showNotification,
            ],
        );

    function handleSearchChange(
        value,
    ) {
        clearNotification();

        setSearchTerm(value);
        setPage(1);
    }

    function handleApplyFilters(
        filters,
    ) {
        clearNotification();

        setFilterMode(
            filters.filterMode,
        );

        setSelectedMonth(
            Number(
                filters.selectedMonth,
            ),
        );

        setSelectedYear(
            Number(
                filters.selectedYear,
            ),
        );

        setPage(1);
    }

    function handlePreviousPage() {
        if (
            loading ||
            page <= 1
        ) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage - 1,
        );
    }

    function handleNextPage() {
        if (
            loading ||
            page >=
            pagination.totalPages
        ) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage + 1,
        );
    }

    function requestTransactionDelete(
        transaction,
    ) {
        if (
            deletingId ||
            !transaction?.id
        ) {
            return;
        }

        clearNotification();

        setTransactionToDelete(
            transaction,
        );
    }

    function cancelTransactionDelete() {
        if (deletingId) {
            return;
        }

        setTransactionToDelete(
            null,
        );
    }

    async function confirmTransactionDelete() {
        if (
            !transactionToDelete?.id ||
            deletingId
        ) {
            return;
        }

        const transaction =
            transactionToDelete;

        setDeletingId(
            transaction.id,
        );

        try {
            await transactionService.remove(
                transaction.id,
            );

            setTransactionToDelete(
                null,
            );

            showNotification(
                "success",
                config.deleteSuccessMessage,
            );

            if (
                transactions.length ===
                1 &&
                page > 1
            ) {
                setPage(
                    (currentPage) =>
                        currentPage - 1,
                );
            } else {
                setTransactionRefreshKey(
                    (currentKey) =>
                        currentKey + 1,
                );
            }
        } catch (error) {
            showNotification(
                "error",
                getErrorMessage(
                    error,
                    `Não foi possível excluir ${config.article} ${config.singular}.`,
                ),
            );
        } finally {
            setDeletingId(null);
        }
    }

    const handleRecurringChanged =
        useCallback(
            async ({
                action,
            } = {}) => {
                let message =
                    "Recorrência atualizada com sucesso.";

                if (
                    action === "DELETE"
                ) {
                    message =
                        config.recurringDeleteSuccessMessage;
                }

                if (
                    action === "PAUSE"
                ) {
                    message =
                        `${capitalizeFirstLetter(
                            config.singular,
                        )} recorrente pausada com sucesso.`;
                }

                if (
                    action === "ACTIVATE"
                ) {
                    message =
                        `${capitalizeFirstLetter(
                            config.singular,
                        )} recorrente reativada com sucesso.`;
                }

                showNotification(
                    "success",
                    message,
                );

                setTransactionRefreshKey(
                    (currentKey) =>
                        currentKey + 1,
                );
            },
            [
                config,
                showNotification,
            ],
        );

    const handleRecurringError =
        useCallback(
            (message) => {
                showNotification(
                    "error",
                    message,
                );
            },
            [showNotification],
        );

    function handleTabChange(
        nextTab,
    ) {
        if (
            nextTab !==
            PAGE_TABS.TRANSACTIONS &&
            nextTab !==
            PAGE_TABS.RECURRING
        ) {
            return;
        }

        clearNotification();

        setActiveTab(nextTab);
    }

    const periodLabel =
        getPeriodLabel({
            filterMode,
            selectedMonth,
            selectedYear,
        });

    const createButtonLabel =
        activeTab ===
            PAGE_TABS.RECURRING
            ? config.recurringCreateLabel
            : config.createButtonLabel;

    const CreateButtonIcon =
        activeTab ===
            PAGE_TABS.RECURRING
            ? RiRepeat2Line
            : RiAddLine;

    return (
        <main
            className="
                w-full
                min-w-0
                max-w-none
                overflow-x-hidden
                px-4
                py-5
                sm:px-6
                sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex
                    w-full
                    min-w-0
                    flex-col
                    gap-5
                    pb-8
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            gap-3
                        "
                    >
                        <div
                            className={`
                                inline-flex
                                size-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                border

                                ${config.softBackgroundClasses}
                                ${config.borderClasses}
                                ${config.accentClasses}
                            `}
                        >
                            <TypeIcon
                                size={21}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h1
                                className="
                                    text-xl
                                    font-semibold
                                    tracking-tight
                                    text-foreground
                                    sm:text-2xl
                                "
                            >
                                {config.title}
                            </h1>

                            <p
                                className="
                                    mt-1
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-muted-foreground
                                "
                            >
                                {
                                    config.pageDescription
                                }
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            openCreateForm
                        }
                        className="
                            inline-flex
                            min-h-11
                            w-full
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-primary
                            px-4
                            text-sm
                            font-semibold
                            text-primary-foreground
                            transition
                            hover:bg-primary-hover
                            focus-visible:ring-4
                            focus-visible:ring-primary/20
                            sm:w-auto
                        "
                    >
                        <CreateButtonIcon
                            size={18}
                            aria-hidden="true"
                        />

                        {createButtonLabel}
                    </button>
                </header>

                <nav
                    aria-label={`Áreas de ${config.plural}`}
                    className="
                        flex
                        w-full
                        min-w-0
                        items-center
                        gap-1
                        overflow-x-auto
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-1.5
                        shadow-card
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleTabChange(
                                PAGE_TABS.TRANSACTIONS,
                            )
                        }
                        aria-pressed={
                            activeTab ===
                            PAGE_TABS.TRANSACTIONS
                        }
                        className={`
                            inline-flex
                            min-h-10
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            whitespace-nowrap
                            rounded-xl
                            px-4
                            text-sm
                            font-semibold
                            transition

                            ${activeTab ===
                                PAGE_TABS.TRANSACTIONS
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            }
                        `}
                    >
                        <RiFileList3Line
                            size={17}
                            aria-hidden="true"
                        />

                        Lançamentos
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleTabChange(
                                PAGE_TABS.RECURRING,
                            )
                        }
                        aria-pressed={
                            activeTab ===
                            PAGE_TABS.RECURRING
                        }
                        className={`
                            inline-flex
                            min-h-10
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            whitespace-nowrap
                            rounded-xl
                            px-4
                            text-sm
                            font-semibold
                            transition

                            ${activeTab ===
                                PAGE_TABS.RECURRING
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            }
                        `}
                    >
                        <RiRepeat2Line
                            size={17}
                            aria-hidden="true"
                        />

                        Recorrências
                    </button>
                </nav>

                <AnimatePresence
                    initial={false}
                    mode="wait"
                >
                    {activeTab ===
                        PAGE_TABS.TRANSACTIONS ? (
                        <motion.div
                            key="transactions"
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -5,
                            }}
                            transition={{
                                duration: 0.18,
                            }}
                            className="space-y-5"
                        >
                            <div
                                className="
                                    grid
                                    min-w-0
                                    gap-4
                                    xl:grid-cols-[minmax(0,1fr)_18rem]
                                "
                            >
                                <TransactionFilters
                                    idPrefix={
                                        normalizedType.toLowerCase()
                                    }
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
                                    disabled={
                                        loading
                                    }
                                    onSearchChange={
                                        handleSearchChange
                                    }
                                    onApplyFilters={
                                        handleApplyFilters
                                    }
                                />

                                <section
                                    aria-label={
                                        config.totalLabel
                                    }
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        p-4
                                        shadow-card
                                        xl:flex-col
                                        xl:items-start
                                        xl:justify-center
                                    "
                                >
                                    <div
                                        className={`
                                            inline-flex
                                            size-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border

                                            ${config.softBackgroundClasses}
                                            ${config.borderClasses}
                                            ${config.accentClasses}
                                        `}
                                    >
                                        <TypeIcon
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-muted-foreground
                                            "
                                        >
                                            {
                                                config.totalLabel
                                            }
                                        </p>

                                        <p
                                            title={formatCurrency(
                                                totalFilteredCents,
                                            )}
                                            className={`
                                                mt-1
                                                truncate
                                                text-xl
                                                font-bold
                                                tracking-tight
                                                sm:text-2xl

                                                ${config.accentClasses}
                                            `}
                                        >
                                            {formatCurrency(
                                                totalFilteredCents,
                                            )}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                flex
                                                min-w-0
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-muted-foreground
                                            "
                                        >
                                            <RiCalendarLine
                                                size={13}
                                                aria-hidden="true"
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {
                                                    periodLabel
                                                }
                                            </span>
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {loadError &&
                                !loading ? (
                                <section
                                    role="alert"
                                    className="
                                        flex
                                        min-h-64
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        px-5
                                        py-10
                                        text-center
                                        shadow-card
                                    "
                                >
                                    <div
                                        className="
                                            inline-flex
                                            size-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-danger/20
                                            bg-danger/5
                                            text-danger
                                        "
                                    >
                                        <RiErrorWarningLine
                                            size={22}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <h2
                                        className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        Não foi possível carregar
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            max-w-md
                                            text-sm
                                            leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {loadError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            loadTransactions
                                        }
                                        className="
                                            mt-4
                                            inline-flex
                                            min-h-10
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-border
                                            bg-surface
                                            px-4
                                            text-sm
                                            font-semibold
                                            text-foreground
                                            transition
                                            hover:bg-surface-hover
                                        "
                                    >
                                        <RiRefreshLine
                                            size={17}
                                            aria-hidden="true"
                                        />

                                        Tentar novamente
                                    </button>
                                </section>
                            ) : (
                                <TransactionList
                                    transactions={
                                        transactions
                                    }
                                    type={
                                        normalizedType
                                    }
                                    title={
                                        config.transactionLabelPlural
                                    }
                                    singularLabel={
                                        config.singular
                                    }
                                    pluralLabel={
                                        config.plural
                                    }
                                    emptyMessage={
                                        debouncedSearchTerm
                                            ? `Nenhuma ${config.singular} encontrada para essa pesquisa.`
                                            : `Nenhuma ${config.singular} encontrada em ${periodLabel.toLowerCase()}.`
                                    }
                                    loading={
                                        loading
                                    }
                                    deletingId={
                                        deletingId
                                    }
                                    pagination={
                                        pagination
                                    }
                                    currentPage={
                                        page
                                    }
                                    onEdit={
                                        openTransactionEditForm
                                    }
                                    onDelete={
                                        requestTransactionDelete
                                    }
                                    onPageChange={(
                                        nextPage,
                                    ) => {
                                        setPage(
                                            nextPage,
                                        );
                                    }}
                                    onPreviousPage={
                                        handlePreviousPage
                                    }
                                    onNextPage={
                                        handleNextPage
                                    }
                                />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="recurring"
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -5,
                            }}
                            transition={{
                                duration: 0.18,
                            }}
                        >
                            <RecurringTransactionList
                                type={
                                    normalizedType
                                }
                                refreshKey={
                                    recurringRefreshKey
                                }
                                onEdit={
                                    openRecurringEditForm
                                }
                                onChanged={
                                    handleRecurringChanged
                                }
                                onError={
                                    handleRecurringError
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <TransactionFormModal
                    open={
                        formOpen
                    }
                    type={
                        normalizedType
                    }
                    transaction={
                        selectedTransaction
                    }
                    recurringTransaction={
                        selectedRecurringTransaction
                    }
                    initialKind={
                        formInitialKind
                    }
                    onClose={
                        closeForm
                    }
                    onSaved={
                        handleFormSaved
                    }
                />

                <ConfirmDialog
                    open={Boolean(
                        transactionToDelete,
                    )}
                    title={
                        config.deleteTitle
                    }
                    description={
                        transactionToDelete
                            ? `A ${config.singular} "${transactionToDelete.description}" será excluída permanentemente. Essa ação não poderá ser desfeita.`
                            : ""
                    }
                    confirmLabel={
                        config.deleteConfirmationLabel
                    }
                    cancelLabel="Cancelar"
                    loading={
                        deletingId ===
                        transactionToDelete?.id
                    }
                    onConfirm={
                        confirmTransactionDelete
                    }
                    onCancel={
                        cancelTransactionDelete
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
        </main>
    );
}

export default TransactionPage;