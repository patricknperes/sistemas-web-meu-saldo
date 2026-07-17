import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    RiAddLine,
    RiFileList3Line,
    RiRefreshLine,
    RiRepeat2Line,
} from "react-icons/ri";

import {
    getTransactionTypeConfig,
    normalizeTransactionType,
} from "../../config/transactionTypeConfig.js";
import {
    transactionService,
} from "../../services/transactionService.js";
import Button from "../ui/actions/Button.jsx";
import Alert from "../ui/feedback/Alert.jsx";
import ConfirmDialog from "../ui/feedback/ConfirmDialog.jsx";
import Snackbar from "../ui/feedback/Snackbar.jsx";
import MetricCard from "../ui/finance/MetricCard.jsx";
import {
    Page,
    PageGrid,
    PageHeader,
    PageSection,
} from "../ui/layout/index.js";
import TransactionFilterBar from "../ui/transactions/TransactionFilterBar.jsx";
import TransactionTabs from "../ui/transactions/TransactionTabs.jsx";

import RecurringTransactionDataView from "./RecurringTransactionDataView.jsx";
import TransactionDataView from "./TransactionDataView.jsx";
import TransactionFormDialog from "./TransactionFormDialog.jsx";
import {
    capitalizeFirst,
    getErrorMessage,
    normalizeTransactionListResponse,
    periodToRequestFilters,
} from "./transactionPageUtils.js";

const DEFAULT_PAGE_SIZE = 10;

function createDefaultPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    return {
        mode: "month",
        month: `${year}-${month}`,
        year,
    };
}

function readStoredPeriod(type) {
    if (typeof window === "undefined") {
        return createDefaultPeriod();
    }

    try {
        const storedValue = window.localStorage.getItem(`meu-saldo:${type.toLowerCase()}:period`);
        const parsedValue = storedValue ? JSON.parse(storedValue) : null;

        if (["all", "month", "year"].includes(parsedValue?.mode)) {
            return {
                ...createDefaultPeriod(),
                ...parsedValue,
            };
        }
    } catch {
        return createDefaultPeriod();
    }

    return createDefaultPeriod();
}

function formatPeriodLabel(period) {
    if (period?.mode === "year") {
        return `Ano de ${period.year}`;
    }

    if (period?.mode === "month" && typeof period.month === "string") {
        const [year, month] = period.month.split("-").map(Number);

        if (Number.isInteger(year) && Number.isInteger(month)) {
            const label = new Intl.DateTimeFormat("pt-BR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
            }).format(new Date(Date.UTC(year, month - 1, 1)));

            return capitalizeFirst(label);
        }
    }

    return "Todo o histórico";
}

function TransactionPage({
    type = "INCOME",
}) {
    const normalizedType = normalizeTransactionType(type) || "INCOME";
    const config = useMemo(
        () => getTransactionTypeConfig(normalizedType),
        [normalizedType]
    );
    const requestSequenceReference = useRef(0);

    const [activeTab, setActiveTab] = useState("transactions");
    const [period, setPeriod] = useState(() => readStoredPeriod(normalizedType));
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [totalFilteredCents, setTotalFilteredCents] = useState(0);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formInitialKind, setFormInitialKind] = useState("single");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState(null);
    const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
    const [recurringRefreshKey, setRecurringRefreshKey] = useState(0);
    const [notification, setNotification] = useState({
        open: false,
        variant: "info",
        title: "",
        description: "",
    });

    const showNotification = useCallback((variant, title, description) => {
        setNotification({
            open: true,
            variant: variant === "error" ? "danger" : variant,
            title,
            description,
        });
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        try {
            window.localStorage.setItem(
                `meu-saldo:${normalizedType.toLowerCase()}:period`,
                JSON.stringify(period)
            );
        } catch {
            // A persistência é opcional e não deve interromper a tela.
        }
    }, [normalizedType, period]);

    const loadTransactions = useCallback(async () => {
        const requestSequence = requestSequenceReference.current + 1;
        requestSequenceReference.current = requestSequence;
        setLoading(true);
        setLoadError("");

        try {
            const response = await transactionService.list({
                type: normalizedType,
                page,
                limit: DEFAULT_PAGE_SIZE,
                search: debouncedSearchTerm || undefined,
                ...periodToRequestFilters(period),
            });

            if (requestSequence !== requestSequenceReference.current) {
                return;
            }

            const normalizedResponse = normalizeTransactionListResponse(
                response,
                page,
                DEFAULT_PAGE_SIZE
            );

            setTransactions(normalizedResponse.transactions);
            setTotalFilteredCents(normalizedResponse.totalAmountCents);
            setPagination(normalizedResponse.pagination);

            if (
                normalizedResponse.pagination.totalPages > 0 &&
                page > normalizedResponse.pagination.totalPages
            ) {
                setPage(normalizedResponse.pagination.totalPages);
            }
        } catch (error) {
            if (requestSequence !== requestSequenceReference.current) {
                return;
            }

            const message = getErrorMessage(
                error,
                `Não foi possível carregar ${config.articlePlural} ${config.plural}.`
            );
            setTransactions([]);
            setTotalFilteredCents(0);
            setPagination({
                page: 1,
                limit: DEFAULT_PAGE_SIZE,
                totalItems: 0,
                totalPages: 0,
            });
            setLoadError(message);
            showNotification("danger", "Falha ao carregar os dados", message);
        } finally {
            if (requestSequence === requestSequenceReference.current) {
                setLoading(false);
            }
        }
    }, [
        config.articlePlural,
        config.plural,
        debouncedSearchTerm,
        normalizedType,
        page,
        period,
        showNotification,
    ]);

    useEffect(() => {
        if (activeTab === "transactions") {
            loadTransactions();
        }
    }, [activeTab, loadTransactions, transactionRefreshKey]);

    useEffect(() => () => {
        requestSequenceReference.current += 1;
    }, []);

    function openCreateForm(kind = activeTab === "recurring" ? "recurring" : "single") {
        setSelectedTransaction(null);
        setSelectedRecurringTransaction(null);
        setFormInitialKind(kind);
        setFormOpen(true);
    }

    function openTransactionEditForm(transaction) {
        setSelectedRecurringTransaction(null);
        setSelectedTransaction(transaction);
        setFormInitialKind("single");
        setFormOpen(true);
    }

    function openRecurringEditForm(recurringTransaction) {
        setSelectedTransaction(null);
        setSelectedRecurringTransaction(recurringTransaction);
        setFormInitialKind("recurring");
        setFormOpen(true);
    }

    function handleFormOpenChange(nextOpen) {
        setFormOpen(nextOpen);

        if (!nextOpen) {
            setSelectedTransaction(null);
            setSelectedRecurringTransaction(null);
            setFormInitialKind("single");
        }
    }

    async function handleFormSaved(result) {
        const recurring = result?.kind === "RECURRING";
        const updating = result?.action === "UPDATE";
        const message = recurring
            ? updating
                ? config.recurringUpdateSuccessMessage
                : config.recurringCreateSuccessMessage
            : updating
                ? config.updateSuccessMessage
                : config.createSuccessMessage;

        showNotification("success", "Alterações salvas", message);
        setTransactionRefreshKey((current) => current + 1);
        setRecurringRefreshKey((current) => current + 1);
        setActiveTab(recurring ? "recurring" : "transactions");
    }

    async function confirmTransactionDelete() {
        if (!transactionToDelete?.id || deletingId) {
            return;
        }

        const transaction = transactionToDelete;
        setDeletingId(transaction.id);

        try {
            await transactionService.remove(transaction.id);
            setTransactionToDelete(null);
            showNotification("success", "Movimentação excluída", config.deleteSuccessMessage);

            if (transactions.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                setTransactionRefreshKey((current) => current + 1);
            }
        } catch (error) {
            showNotification(
                "danger",
                "Não foi possível excluir",
                getErrorMessage(
                    error,
                    `Não foi possível excluir ${config.article} ${config.singular}.`
                )
            );
        } finally {
            setDeletingId(null);
        }
    }

    const handleRecurringChanged = useCallback(({ action } = {}) => {
        let message = "Recorrência atualizada com sucesso.";

        if (action === "DELETE") {
            message = config.recurringDeleteSuccessMessage;
        } else if (action === "PAUSE") {
            message = `${capitalizeFirst(config.singular)} recorrente pausada com sucesso.`;
        } else if (action === "ACTIVATE") {
            message = `${capitalizeFirst(config.singular)} recorrente reativada com sucesso.`;
        }

        showNotification("success", "Recorrência atualizada", message);
        setTransactionRefreshKey((current) => current + 1);
    }, [config, showNotification]);

    const handleRecurringError = useCallback((message) => {
        showNotification("danger", "Não foi possível concluir a ação", message);
    }, [showNotification]);

    const periodLabel = formatPeriodLabel(period);
    const totalItems = Number(pagination.totalItems) || 0;
    const createButtonLabel = activeTab === "recurring"
        ? config.recurringCreateLabel
        : config.createButtonLabel;
    const createButtonIcon = activeTab === "recurring"
        ? <RiRepeat2Line size={18} aria-hidden="true" />
        : <RiAddLine size={18} aria-hidden="true" />;
    const tone = normalizedType === "INCOME" ? "positive" : "negative";

    return (
        <Page as="main" maxWidth="2xl">
            <PageHeader
                eyebrow="Movimentações"
                title={config.title}
                description={config.pageDescription}
                meta={
                    <span className="inline-flex items-center rounded-pill bg-surface-muted px-2.5 py-1 text-caption font-semibold text-muted-foreground">
                        {periodLabel}
                    </span>
                }
                actions={
                    <Button
                        leadingIcon={createButtonIcon}
                        onClick={() => openCreateForm()}
                    >
                        {createButtonLabel}
                    </Button>
                }
            />

            <PageSection>
                <TransactionTabs
                    value={activeTab}
                    fullWidth
                    counts={{
                        transactions: totalItems,
                    }}
                    options={[
                        {
                            value: "transactions",
                            label: "Lançamentos",
                            icon: RiFileList3Line,
                        },
                        {
                            value: "recurring",
                            label: "Recorrências",
                            icon: RiRepeat2Line,
                        },
                    ]}
                    onValueChange={setActiveTab}
                />
            </PageSection>

            {activeTab === "transactions" ? (
                <>
                    <PageGrid columns={2} className="lg:grid-cols-[minmax(0,1.5fr)_minmax(17rem,0.5fr)]">
                        <MetricCard
                            label={config.totalLabel}
                            value={totalFilteredCents / 100}
                            tone={tone}
                            icon={config.valueIcon}
                            description={`Soma dos valores em ${periodLabel.toLowerCase()}.`}
                            loading={loading}
                        />

                        <MetricCard
                            label="Lançamentos encontrados"
                            formattedValue={String(totalItems)}
                            icon={RiFileList3Line}
                            description={
                                debouncedSearchTerm
                                    ? `Resultados para “${debouncedSearchTerm}”.`
                                    : "Quantidade de movimentações no filtro atual."
                            }
                            loading={loading}
                        />
                    </PageGrid>

                    <PageSection
                        title={`Lista de ${config.plural}`}
                        description="Pesquise, filtre o período e gerencie cada lançamento sem perder o contexto da página."
                    >
                        <div className="grid gap-4">
                            <TransactionFilterBar
                                searchValue={searchTerm}
                                onSearchChange={(value) => setSearchTerm(value)}
                                onSearchClear={() => setSearchTerm("")}
                                searchPlaceholder={config.searchPlaceholder}
                                period={period}
                                onPeriodChange={(nextPeriod) => {
                                    setPeriod(nextPeriod);
                                    setPage(1);
                                }}
                                resultCount={totalItems}
                                loading={loading}
                            >
                                <Button
                                    variant="outline"
                                    leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                                    loading={loading}
                                    loadingText="Atualizando"
                                    onClick={() => setTransactionRefreshKey((current) => current + 1)}
                                    className="w-full justify-center sm:w-auto"
                                >
                                    Atualizar
                                </Button>
                            </TransactionFilterBar>

                            {loadError ? (
                                <Alert
                                    variant="danger"
                                    title="Não foi possível carregar os lançamentos"
                                    action={
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setTransactionRefreshKey((current) => current + 1)}
                                        >
                                            Tentar novamente
                                        </Button>
                                    }
                                >
                                    {loadError}
                                </Alert>
                            ) : null}

                            <TransactionDataView
                                transactions={transactions}
                                loading={loading}
                                deletingId={deletingId}
                                pagination={pagination}
                                singularLabel={config.singular}
                                pluralLabel={config.plural}
                                emptyTitle={config.emptyTitle}
                                emptyDescription={config.emptyDescription}
                                onEdit={openTransactionEditForm}
                                onDelete={setTransactionToDelete}
                                onCreate={() => openCreateForm("single")}
                                onPageChange={setPage}
                            />
                        </div>
                    </PageSection>
                </>
            ) : (
                <PageSection
                    title={config.recurringPageTitle}
                    description="Cadastre compromissos repetidos, pause temporariamente e ajuste o período sem gerar lançamentos antecipados."
                    actions={
                        <Button
                            size="sm"
                            leadingIcon={<RiAddLine size={17} aria-hidden="true" />}
                            onClick={() => openCreateForm("recurring")}
                        >
                            Nova recorrência
                        </Button>
                    }
                >
                    <RecurringTransactionDataView
                        type={normalizedType}
                        refreshKey={recurringRefreshKey}
                        singularLabel={config.singular}
                        pluralLabel={config.plural}
                        onCreate={() => openCreateForm("recurring")}
                        onEdit={openRecurringEditForm}
                        onChanged={handleRecurringChanged}
                        onError={handleRecurringError}
                    />
                </PageSection>
            )}

            <TransactionFormDialog
                open={formOpen}
                onOpenChange={handleFormOpenChange}
                type={normalizedType}
                initialKind={formInitialKind}
                transaction={selectedTransaction}
                recurringTransaction={selectedRecurringTransaction}
                onSaved={handleFormSaved}
            />

            <ConfirmDialog
                open={Boolean(transactionToDelete)}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && !deletingId) {
                        setTransactionToDelete(null);
                    }
                }}
                title={config.deleteTitle}
                description={config.deleteDescription}
                confirmLabel={config.deleteConfirmationLabel}
                loading={Boolean(deletingId)}
                onConfirm={confirmTransactionDelete}
            />

            <Snackbar
                open={notification.open}
                onOpenChange={(open) => setNotification((current) => ({ ...current, open }))}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />
        </Page>
    );
}

export default TransactionPage;
