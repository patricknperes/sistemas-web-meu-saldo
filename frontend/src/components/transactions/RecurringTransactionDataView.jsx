import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    RiAddLine,
    RiInbox2Line,
    RiRefreshLine,
    RiRepeat2Line,
} from "react-icons/ri";

import {
    recurringTransactionService,
} from "../../services/recurringTransactionService.js";
import Button from "../ui/actions/Button.jsx";
import {
    DataList,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    DataTableState,
    Pagination,
    ResponsiveDataView,
} from "../ui/data-display/index.js";
import Alert from "../ui/feedback/Alert.jsx";
import ConfirmDialog from "../ui/feedback/ConfirmDialog.jsx";
import EmptyState from "../ui/feedback/EmptyState.jsx";
import { LoadingState } from "../ui/feedback/LoadingState.jsx";
import SearchInput from "../ui/forms/SearchInput.jsx";
import Select from "../ui/forms/Select.jsx";
import RecurringTransactionCard from "../ui/transactions/RecurringTransactionCard.jsx";
import RecurringTransactionRow from "../ui/transactions/RecurringTransactionRow.jsx";

import {
    getErrorMessage,
    normalizeRecurringListResponse,
} from "./transactionPageUtils.js";

const PAGE_SIZE = 8;

const statusOptions = [
    { value: "all", label: "Todas as situações" },
    { value: "active", label: "Somente ativas" },
    { value: "paused", label: "Somente pausadas" },
];

function RecurringTransactionDataView({
    type = "INCOME",
    refreshKey = 0,
    singularLabel = "movimentação",
    pluralLabel = "movimentações",
    onCreate,
    onEdit,
    onChanged,
    onError,
}) {
    const requestReference = useRef(0);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [pendingDeletion, setPendingDeletion] = useState(null);
    const [manualRefreshKey, setManualRefreshKey] = useState(0);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [search]);

    const loadItems = useCallback(async () => {
        const requestId = requestReference.current + 1;
        requestReference.current = requestId;
        setLoading(true);
        setLoadError("");

        try {
            const response = await recurringTransactionService.listByType(type, {
                page,
                limit: PAGE_SIZE,
                search: debouncedSearch || undefined,
                isActive: statusFilter === "active"
                    ? true
                    : statusFilter === "paused"
                        ? false
                        : undefined,
            });

            if (requestReference.current !== requestId) {
                return;
            }

            const normalizedResponse = normalizeRecurringListResponse(
                response,
                page,
                PAGE_SIZE
            );

            setItems(normalizedResponse.recurringTransactions);
            setPagination(normalizedResponse.pagination);

            if (
                normalizedResponse.pagination.totalPages > 0 &&
                page > normalizedResponse.pagination.totalPages
            ) {
                setPage(normalizedResponse.pagination.totalPages);
            }
        } catch (error) {
            if (requestReference.current !== requestId) {
                return;
            }

            const message = getErrorMessage(
                error,
                `Não foi possível carregar ${pluralLabel} recorrentes.`
            );
            setItems([]);
            setLoadError(message);
            onError?.(message);
        } finally {
            if (requestReference.current === requestId) {
                setLoading(false);
            }
        }
    }, [debouncedSearch, onError, page, pluralLabel, statusFilter, type]);

    useEffect(() => {
        loadItems();

        return () => {
            requestReference.current += 1;
        };
    }, [loadItems, manualRefreshKey, refreshKey]);

    async function handleToggleStatus(recurrence, nextStatus) {
        if (!recurrence?.id || actionLoadingId) {
            return;
        }

        setActionLoadingId(recurrence.id);

        try {
            if (nextStatus === "PAUSED") {
                await recurringTransactionService.pause(recurrence.id);
            } else {
                await recurringTransactionService.activate(recurrence.id);
            }

            await loadItems();
            await onChanged?.({
                action: nextStatus === "PAUSED" ? "PAUSE" : "ACTIVATE",
                recurringTransaction: recurrence,
            });
        } catch (error) {
            const message = getErrorMessage(
                error,
                nextStatus === "PAUSED"
                    ? "Não foi possível pausar a recorrência."
                    : "Não foi possível reativar a recorrência."
            );
            onError?.(message);
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleDelete() {
        if (!pendingDeletion?.id || actionLoadingId) {
            return;
        }

        const recurrence = pendingDeletion;
        setActionLoadingId(recurrence.id);

        try {
            await recurringTransactionService.remove(recurrence.id);
            setPendingDeletion(null);

            if (items.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                await loadItems();
            }

            await onChanged?.({
                action: "DELETE",
                recurringTransaction: recurrence,
            });
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Não foi possível excluir a recorrência."
            );
            onError?.(message);
        } finally {
            setActionLoadingId(null);
        }
    }

    const totalPages = Number(pagination.totalPages) || 0;
    const totalItems = Number(pagination.totalItems) || 0;
    const footer = totalPages > 1 ? (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            itemLabel={`${pluralLabel} recorrentes`}
            compact
            onPageChange={setPage}
        />
    ) : totalItems > 0 ? (
        <p className="text-caption text-muted-foreground">
            {totalItems} {totalItems === 1 ? singularLabel : pluralLabel} recorrente{totalItems === 1 ? "" : "s"}.
        </p>
    ) : null;

    const emptyAction = onCreate ? (
        <Button
            size="sm"
            leadingIcon={<RiAddLine size={17} aria-hidden="true" />}
            onClick={onCreate}
        >
            Nova recorrência
        </Button>
    ) : null;

    return (
        <div className="grid gap-4">
            <div className="grid gap-3 rounded-xl border border-border bg-surface p-3 shadow-xs lg:grid-cols-[minmax(15rem,1fr)_14rem_auto] lg:items-center">
                <SearchInput
                    value={search}
                    placeholder={`Pesquisar ${pluralLabel} recorrentes`}
                    disabled={loading}
                    onChange={(event) => setSearch(event.target.value)}
                    onClear={() => setSearch("")}
                />

                <Select
                    value={statusFilter}
                    options={statusOptions}
                    disabled={loading}
                    aria-label="Filtrar recorrências por situação"
                    onChange={(event) => {
                        setStatusFilter(event.target.value);
                        setPage(1);
                    }}
                />

                <Button
                    variant="outline"
                    leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                    loading={loading}
                    loadingText="Atualizando"
                    onClick={() => setManualRefreshKey((current) => current + 1)}
                >
                    Atualizar
                </Button>
            </div>

            {loadError ? (
                <Alert
                    variant="danger"
                    title="Não foi possível carregar as recorrências"
                    action={
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setManualRefreshKey((current) => current + 1)}
                        >
                            Tentar novamente
                        </Button>
                    }
                >
                    {loadError}
                </Alert>
            ) : null}

            <ResponsiveDataView
                breakpoint="md"
                desktop={
                    <DataTable
                        stickyHeader
                        footer={footer}
                        tableClassName="min-w-[66rem]"
                    >
                        <DataTableHeader>
                            <DataTableRow>
                                <DataTableHead>Recorrência</DataTableHead>
                                <DataTableHead>Frequência</DataTableHead>
                                <DataTableHead>Período</DataTableHead>
                                <DataTableHead>Situação</DataTableHead>
                                <DataTableHead align="right">Valor</DataTableHead>
                                <DataTableHead align="right">
                                    <span className="sr-only">Ações</span>
                                </DataTableHead>
                            </DataTableRow>
                        </DataTableHeader>

                        <DataTableBody>
                            {loading || items.length === 0 ? (
                                <DataTableState
                                    colSpan={6}
                                    loading={loading}
                                    icon={RiRepeat2Line}
                                    title="Nenhuma recorrência encontrada"
                                    description="As movimentações recorrentes cadastradas aparecerão aqui."
                                    action={emptyAction}
                                />
                            ) : (
                                items.map((recurrence) => (
                                    <RecurringTransactionRow
                                        key={recurrence.id}
                                        recurrence={recurrence}
                                        onEdit={onEdit}
                                        onDelete={setPendingDeletion}
                                        onToggleStatus={handleToggleStatus}
                                        deleting={actionLoadingId === recurrence.id}
                                    />
                                ))
                            )}
                        </DataTableBody>
                    </DataTable>
                }
                mobile={
                    <div className="grid gap-4">
                        {items.length > 0 && !loading ? (
                            <DataList>
                                {items.map((recurrence) => (
                                    <RecurringTransactionCard
                                        key={recurrence.id}
                                        recurrence={recurrence}
                                        onEdit={onEdit}
                                        onDelete={setPendingDeletion}
                                        onToggleStatus={handleToggleStatus}
                                        deleting={actionLoadingId === recurrence.id}
                                    />
                                ))}
                            </DataList>
                        ) : loading ? (
                            <LoadingState
                                title="Carregando recorrências"
                                description="Aguarde enquanto atualizamos as configurações."
                                compact
                            />
                        ) : (
                            <EmptyState
                                icon={RiInbox2Line}
                                title="Nenhuma recorrência encontrada"
                                description="As movimentações recorrentes cadastradas aparecerão aqui."
                                action={emptyAction}
                                compact
                            />
                        )}

                        {footer ? (
                            <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-xs">
                                {footer}
                            </div>
                        ) : null}
                    </div>
                }
            />

            <ConfirmDialog
                open={Boolean(pendingDeletion)}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && !actionLoadingId) {
                        setPendingDeletion(null);
                    }
                }}
                title="Excluir recorrência"
                description="A configuração será removida permanentemente. Os lançamentos já gerados permanecerão no histórico."
                confirmLabel="Excluir recorrência"
                loading={Boolean(actionLoadingId)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

export default RecurringTransactionDataView;
