import { useDeferredValue, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import {
    fetchHistoryAnalytics,
    fetchHistoryTags,
    fetchHistoryTransactions,
    historyKeys,
} from "../../features/history/api/historyQueries.js";
import HistoryBalanceChart from "../../features/history/components/HistoryBalanceChart.jsx";
import HistoryCashFlowChart from "../../features/history/components/HistoryCashFlowChart.jsx";
import HistoryCategoryChart from "../../features/history/components/HistoryCategoryChart.jsx";
import HistoryFiltersDialog from "../../features/history/components/HistoryFiltersDialog.jsx";
import HistoryMonthlyTimeline from "../../features/history/components/HistoryMonthlyTimeline.jsx";
import HistorySummary from "../../features/history/components/HistorySummary.jsx";
import HistoryToolbar from "../../features/history/components/HistoryToolbar.jsx";
import HistoryTransactionList from "../../features/history/components/HistoryTransactionList.jsx";
import { useHistoryFilters } from "../../features/history/hooks/useHistoryFilters.js";
import {
    buildHistoryApiFilters,
    getHistoryApiError,
    getHistoryPeriodLabel,
    toHistoryChartData,
} from "../../features/history/utils/historyFormatters.js";

const emptySummary = {
    totalIncomeCents: 0,
    totalExpenseCents: 0,
    balanceCents: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
    averageTransactionCents: 0,
};

function History() {
    const { filters, updateFilters, setPage, resetFilters } = useHistoryFilters();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const deferredSearch = useDeferredValue(filters.search);

    const analyticsFilters = useMemo(
        () => buildHistoryApiFilters(filters, deferredSearch),
        [deferredSearch, filters],
    );

    const transactionFilters = useMemo(
        () => ({ ...analyticsFilters, page: filters.page, limit: filters.limit }),
        [analyticsFilters, filters.limit, filters.page],
    );

    const analyticsQuery = useQuery({
        queryKey: historyKeys.analytics(analyticsFilters),
        queryFn: () => fetchHistoryAnalytics(analyticsFilters),
        placeholderData: (previousData) => previousData,
    });

    const transactionsQuery = useQuery({
        queryKey: historyKeys.transactions(transactionFilters),
        queryFn: () => fetchHistoryTransactions(transactionFilters),
        placeholderData: (previousData) => previousData,
    });

    const tagsQuery = useQuery({
        queryKey: historyKeys.tags(),
        queryFn: fetchHistoryTags,
        staleTime: 5 * 60 * 1000,
    });

    const analytics = analyticsQuery.data ?? {
        summary: emptySummary,
        monthly: [],
        expenseCategories: [],
    };
    const chartData = useMemo(() => toHistoryChartData(analytics.monthly), [analytics.monthly]);
    const periodLabel = getHistoryPeriodLabel(filters);
    const tags = tagsQuery.data ?? [];
    const isRefreshing = analyticsQuery.isFetching || transactionsQuery.isFetching || tagsQuery.isFetching;
    const hasFilters = Boolean(
        filters.search ||
        filters.tagId ||
        filters.type !== "ALL" ||
        filters.mode !== "YEAR" ||
        Number(filters.year) !== new Date().getFullYear(),
    );

    async function refreshHistory() {
        await Promise.all([
            analyticsQuery.refetch(),
            transactionsQuery.refetch(),
            tagsQuery.refetch(),
        ]);
    }

    function selectMonth(item) {
        if (!item) {
            updateFilters({ mode: "YEAR", year: Number(filters.year) || new Date().getFullYear() });
            return;
        }

        updateFilters({
            mode: "MONTH",
            month: Number(item.month),
            year: Number(item.year),
            startDate: "",
            endDate: "",
        });
    }

    const analyticsError = analyticsQuery.error ? getHistoryApiError(analyticsQuery.error) : "";
    const transactionError = transactionsQuery.error ? getHistoryApiError(transactionsQuery.error, "Não foi possível carregar as movimentações.") : "";

    return (
        <PageContainer className="space-y-6 py-5 sm:py-7 lg:space-y-7 lg:py-8">
            <PageHeader
                eyebrow="Análise financeira"
                title="Histórico"
                description="Explore sua evolução financeira, compare entradas e saídas e encontre qualquer movimentação com precisão."
                actions={(
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={refreshHistory}
                        disabled={isRefreshing}
                        aria-label="Atualizar histórico"
                        title="Atualizar histórico"
                    >
                        <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                    </Button>
                )}
            />

            <HistoryToolbar
                filters={filters}
                tags={tags}
                onSearchChange={(search) => updateFilters({ search })}
                onOpenFilters={() => setFiltersOpen(true)}
                onReset={resetFilters}
            />

            {analyticsError && analyticsQuery.data && (
                <div role="status" className="flex flex-col gap-2 rounded-card-sm border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-warning sm:flex-row sm:items-center sm:justify-between">
                    <span>Os indicadores não puderam ser atualizados. Os últimos valores disponíveis continuam visíveis.</span>
                    <button type="button" className="shrink-0 font-bold underline underline-offset-4" onClick={() => analyticsQuery.refetch()}>Tentar novamente</button>
                </div>
            )}

            <HistorySummary
                summary={analytics.summary}
                periodLabel={periodLabel}
                loading={analyticsQuery.isPending && !analyticsQuery.data}
            />

            {analyticsError && !analyticsQuery.data ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-danger/20 bg-danger-muted px-6 py-12 text-center">
                    <h2 className="text-base font-bold text-danger">Não foi possível montar a análise do histórico</h2>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-danger">{analyticsError}</p>
                    <Button className="mt-5" variant="secondary" onClick={() => analyticsQuery.refetch()}>Tentar novamente</Button>
                </div>
            ) : (
                <>
                    <section className="grid gap-4 xl:grid-cols-12" aria-label="Gráficos do histórico">
                        <HistoryCashFlowChart data={chartData} loading={analyticsQuery.isPending} />
                        <HistoryBalanceChart data={chartData} loading={analyticsQuery.isPending} />
                    </section>

                    <section className="grid gap-4 xl:grid-cols-12" aria-label="Categorias e resumo mensal">
                        <HistoryCategoryChart categories={analytics.expenseCategories} loading={analyticsQuery.isPending} />
                        <HistoryMonthlyTimeline monthly={chartData} loading={analyticsQuery.isPending} onSelectMonth={selectMonth} />
                    </section>
                </>
            )}

            <HistoryTransactionList
                data={transactionsQuery.data}
                loading={transactionsQuery.isPending || transactionsQuery.isFetching}
                error={transactionError}
                onRetry={() => transactionsQuery.refetch()}
                onPageChange={setPage}
                hasFilters={hasFilters}
                onClearFilters={resetFilters}
            />

            <HistoryFiltersDialog
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                tags={tags}
            />
        </PageContainer>
    );
}

export default History;
