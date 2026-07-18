import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListChecks, Plus, Repeat2 } from "lucide-react";

import ConfirmDialog from "../../../components/feedback/ConfirmDialog.jsx";
import Snackbar from "../../../components/feedback/Snackbar.jsx";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import PageHeader from "../../../components/layout/PageHeader.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/Tabs.jsx";
import { getTransactionTypeConfig } from "../../../config/transactionTypeConfig.js";
import { recurringTransactionService } from "../../../services/recurringTransactionService.js";
import { transactionService } from "../../../services/transactionService.js";
import { dashboardKeys } from "../../dashboard/api/dashboardQueries.js";
import { historyKeys } from "../../history/api/historyQueries.js";
import { useTransactionFilters } from "../hooks/useTransactionFilters.js";
import {
    fetchRecurringTransactions,
    fetchTransactions,
    fetchTransactionTags,
    transactionKeys,
} from "../api/transactionQueries.js";
import {
    getApiErrorMessage,
    getPeriodLabel,
} from "../utils/transactionFormatters.js";
import RecurringTransactionList from "./RecurringTransactionList.jsx";
import TagManagerDialog from "./TagManagerDialog.jsx";
import TransactionFiltersDialog from "./TransactionFiltersDialog.jsx";
import TransactionFormDialog from "./TransactionFormDialog.jsx";
import TransactionHero from "./TransactionHero.jsx";
import TransactionList from "./TransactionList.jsx";
import TransactionToolbar from "./TransactionToolbar.jsx";

const PAGE_SIZE = 10;
const EMPTY_PAGINATION = { page: 1, limit: PAGE_SIZE, totalItems: 0, totalPages: 0 };

function TransactionWorkspace({ type }) {
    const queryClient = useQueryClient();
    const config = useMemo(() => getTransactionTypeConfig(type), [type]);
    const { filters, apiDateFilters, updateFilters, resetFilters } = useTransactionFilters(type);
    const [activeTab, setActiveTab] = useState("transactions");
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search.trim());
    const [transactionPage, setTransactionPage] = useState(1);
    const [recurringPage, setRecurringPage] = useState(1);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [tagManagerOpen, setTagManagerOpen] = useState(false);
    const [formState, setFormState] = useState({ open: false, kind: "single", entity: null });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "info" });

    useEffect(() => {
        setTransactionPage(1);
        setRecurringPage(1);
    }, [deferredSearch, filters, type]);

    const transactionFilters = useMemo(() => ({
        ...apiDateFilters,
        ...(deferredSearch ? { search: deferredSearch } : {}),
        ...(filters.tagId ? { tagId: filters.tagId } : {}),
        page: transactionPage,
        limit: PAGE_SIZE,
    }), [apiDateFilters, deferredSearch, filters.tagId, transactionPage]);

    const recurringFilters = useMemo(() => ({
        ...(deferredSearch ? { search: deferredSearch } : {}),
        ...(filters.tagId ? { tagId: filters.tagId } : {}),
        page: recurringPage,
        limit: PAGE_SIZE,
    }), [deferredSearch, filters.tagId, recurringPage]);

    const transactionQuery = useQuery({
        queryKey: transactionKeys.list(type, transactionFilters),
        queryFn: () => fetchTransactions(type, transactionFilters),
        placeholderData: (previousData) => previousData,
    });

    const recurringQuery = useQuery({
        queryKey: transactionKeys.recurring(type, recurringFilters),
        queryFn: () => fetchRecurringTransactions(type, recurringFilters),
        placeholderData: (previousData) => previousData,
        enabled: activeTab === "recurring",
    });

    const tagsQuery = useQuery({
        queryKey: transactionKeys.tags(type),
        queryFn: () => fetchTransactionTags(type),
    });

    const transactions = transactionQuery.data?.transactions ?? [];
    const transactionPagination = transactionQuery.data?.pagination ?? EMPTY_PAGINATION;
    const totalAmountCents = transactionQuery.data?.summary?.totalAmountCents ?? 0;
    const recurringItems = recurringQuery.data?.recurringTransactions ?? [];
    const recurringPagination = recurringQuery.data?.pagination ?? EMPTY_PAGINATION;
    const tags = tagsQuery.data ?? [];
    const periodLabel = getPeriodLabel(filters);
    const currentDate = new Date();
    const hasPeriodFilter = filters.mode !== "ALL";
    const hasFilters = Boolean(deferredSearch || filters.tagId || hasPeriodFilter);
    const activeFilterCount = Number(Boolean(filters.tagId)) + Number(
        filters.mode !== "MONTH" || Number(filters.month) !== currentDate.getMonth() + 1 || Number(filters.year) !== currentDate.getFullYear(),
    );

    function notify(message, notificationType = "info") {
        setNotification({ message, type: notificationType });
    }

    async function invalidateFinancialData() {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: transactionKeys.all,
                refetchType: "active",
            }),
            queryClient.invalidateQueries({
                queryKey: dashboardKeys.all,
                refetchType: "active",
            }),
            queryClient.invalidateQueries({
                queryKey: historyKeys.all,
                refetchType: "active",
            }),
        ]);
    }

    async function saveEntity({ payload, kind, entity }) {
        let response;
        if (kind === "recurring") {
            response = entity?.id
                ? await recurringTransactionService.update(entity.id, payload)
                : await recurringTransactionService.create(payload);
            notify(entity?.id ? config.recurringUpdateSuccessMessage : config.recurringCreateSuccessMessage, "success");
        } else {
            response = entity?.id
                ? await transactionService.update(entity.id, payload)
                : await transactionService.create(payload);
            notify(entity?.id ? config.updateSuccessMessage : config.createSuccessMessage, "success");
        }
        await invalidateFinancialData();
        return response;
    }

    const deleteMutation = useMutation({
        mutationFn: async ({ kind, entity }) => {
            if (kind === "recurring") return recurringTransactionService.remove(entity.id);
            return transactionService.remove(entity.id);
        },
        onSuccess: async (_response, variables) => {
            await invalidateFinancialData();
            notify(variables.kind === "recurring" ? config.recurringDeleteSuccessMessage : config.deleteSuccessMessage, "success");
            setDeleteTarget(null);
        },
        onError: (error) => notify(getApiErrorMessage(error, "Não foi possível excluir o item."), "error"),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ entity, active }) => active
            ? recurringTransactionService.activate(entity.id)
            : recurringTransactionService.pause(entity.id),
        onSuccess: async (_response, variables) => {
            await invalidateFinancialData();
            notify(variables.active ? "Recorrência ativada com sucesso." : "Recorrência pausada com sucesso.", "success");
        },
        onError: (error) => notify(getApiErrorMessage(error, "Não foi possível alterar a recorrência."), "error"),
    });

    function openCreate(kind = activeTab === "recurring" ? "recurring" : "single") {
        setFormState({ open: true, kind, entity: null });
    }

    function openEdit(entity, kind) {
        setFormState({ open: true, kind, entity });
    }

    function clearFilters() {
        setSearch("");
        updateFilters({ mode: "ALL", tagId: "", startDate: "", endDate: "" });
    }

    async function refreshCurrentTab() {
        if (activeTab === "recurring") {
            await recurringQuery.refetch();
        } else {
            await transactionQuery.refetch();
        }
        await tagsQuery.refetch();
    }

    const activeQuery = activeTab === "recurring" ? recurringQuery : transactionQuery;
    return (
        <PageContainer className="space-y-6 py-5 sm:py-7 lg:space-y-7 lg:py-8">
            <PageHeader
                eyebrow="Movimentações"
                title={config.title}
                description={config.pageDescription}
                actions={(
                    <Button onClick={() => openCreate()}>
                        <Plus className="size-4" aria-hidden="true" />
                        {activeTab === "recurring" ? config.recurringCreateLabel : config.createButtonLabel}
                    </Button>
                )}
            />

            <TransactionHero
                config={config}
                totalAmountCents={totalAmountCents}
                totalItems={transactionPagination.totalItems}
                periodLabel={periodLabel}
                loading={transactionQuery.isPending && !transactionQuery.data}
            />

            <div className="flex min-w-0 flex-col gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="transactions" className="flex-1 gap-2 sm:flex-none">
                            <ListChecks className="size-4" aria-hidden="true" />Lançamentos
                        </TabsTrigger>
                        <TabsTrigger value="recurring" className="flex-1 gap-2 sm:flex-none">
                            <Repeat2 className="size-4" aria-hidden="true" />Recorrências
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <TransactionToolbar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder={activeTab === "recurring" ? `Pesquisar ${config.plural} recorrentes...` : config.searchPlaceholder}
                    periodLabel={activeTab === "recurring" ? (filters.tagId ? "Tag selecionada" : "Filtrar recorrências") : periodLabel}
                    activeFilterCount={activeTab === "recurring" ? Number(Boolean(filters.tagId)) : activeFilterCount}
                    onOpenFilters={() => setFiltersOpen(true)}
                    onOpenTags={() => setTagManagerOpen(true)}
                    onRefresh={refreshCurrentTab}
                    refreshing={activeQuery.isFetching || tagsQuery.isFetching}
                />
            </div>

            {activeTab === "transactions" ? (
                <TransactionList
                    transactions={transactions}
                    pagination={transactionPagination}
                    config={config}
                    loading={transactionQuery.isPending || transactionQuery.isFetching}
                    error={transactionQuery.error ? getApiErrorMessage(transactionQuery.error) : ""}
                    hasFilters={hasFilters}
                    onRetry={() => transactionQuery.refetch()}
                    onCreate={() => openCreate("single")}
                    onClearFilters={clearFilters}
                    onEdit={(entity) => openEdit(entity, "single")}
                    onDelete={(entity) => setDeleteTarget({ kind: "single", entity })}
                    onPageChange={setTransactionPage}
                />
            ) : (
                <RecurringTransactionList
                    items={recurringItems}
                    pagination={recurringPagination}
                    config={config}
                    loading={recurringQuery.isPending || recurringQuery.isFetching}
                    error={recurringQuery.error ? getApiErrorMessage(recurringQuery.error) : ""}
                    hasFilters={Boolean(deferredSearch || filters.tagId)}
                    onRetry={() => recurringQuery.refetch()}
                    onCreate={() => openCreate("recurring")}
                    onClearFilters={() => { setSearch(""); updateFilters({ tagId: "" }); }}
                    onEdit={(entity) => openEdit(entity, "recurring")}
                    onDelete={(entity) => setDeleteTarget({ kind: "recurring", entity })}
                    onToggle={(entity, active) => toggleMutation.mutate({ entity, active })}
                    onPageChange={setRecurringPage}
                    togglingId={toggleMutation.isPending ? toggleMutation.variables?.entity?.id : null}
                />
            )}

            <TransactionFiltersDialog
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                tags={tags}
                showPeriod={activeTab === "transactions"}
            />

            <TagManagerDialog
                open={tagManagerOpen}
                onClose={() => setTagManagerOpen(false)}
                tags={tags}
                type={type}
                onNotify={notify}
            />

            <TransactionFormDialog
                open={formState.open}
                onClose={() => setFormState((current) => ({ ...current, open: false }))}
                type={type}
                kind={formState.kind}
                onKindChange={(kind) => setFormState({ open: true, kind, entity: null })}
                entity={formState.entity}
                tags={tags}
                onManageTags={() => setTagManagerOpen(true)}
                onSave={saveEntity}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={deleteTarget?.kind === "recurring" ? `Excluir ${config.singular} recorrente` : config.deleteTitle}
                description={deleteTarget?.kind === "recurring"
                    ? "A regra recorrente será removida. As movimentações já geradas continuarão no histórico."
                    : config.deleteDescription}
                confirmLabel="Excluir"
                loading={deleteMutation.isPending}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
            />

            <Snackbar
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "info" })}
            />

        </PageContainer>
    );
}

export default TransactionWorkspace;
