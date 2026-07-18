import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, ReceiptText } from "lucide-react";

import Button from "../../components/ui/Button.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import {
    dashboardKeys,
    fetchDashboardHistory,
    fetchDashboardSummary,
} from "../../features/dashboard/api/dashboardQueries.js";
import BalanceEvolutionChart from "../../features/dashboard/components/BalanceEvolutionChart.jsx";
import BalanceHeroCard from "../../features/dashboard/components/BalanceHeroCard.jsx";
import CashFlowChart from "../../features/dashboard/components/CashFlowChart.jsx";
import DashboardErrorState from "../../features/dashboard/components/DashboardErrorState.jsx";
import DashboardMetricCard from "../../features/dashboard/components/DashboardMetricCard.jsx";
import DashboardPeriodFilter from "../../features/dashboard/components/DashboardPeriodFilter.jsx";
import DashboardQuickActions from "../../features/dashboard/components/DashboardQuickActions.jsx";
import DashboardSkeleton from "../../features/dashboard/components/DashboardSkeleton.jsx";
import DashboardSummaryPanel from "../../features/dashboard/components/DashboardSummaryPanel.jsx";
import FinancialHealthCard from "../../features/dashboard/components/FinancialHealthCard.jsx";
import RecentTransactions from "../../features/dashboard/components/RecentTransactions.jsx";
import { useDashboardFilters } from "../../features/dashboard/hooks/useDashboardFilters.js";
import {
    buildChartData,
    getApiErrorMessage,
    getDashboardHistoryYear,
    getDashboardPeriodLabel,
} from "../../features/dashboard/utils/dashboardFormatters.js";

const EMPTY_SUMMARY = {
    balanceCents: 0,
    totalIncomeCents: 0,
    totalExpenseCents: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
    recentTransactions: [],
};

function getFirstName(name) {
    return String(name ?? "").trim().split(/\s+/)[0] || "você";
}

function Dashboard() {
    const { user } = useAuth();
    const { filters, updateFilters } = useDashboardFilters();
    const historyYear = getDashboardHistoryYear(filters);

    const summaryQuery = useQuery({
        queryKey: dashboardKeys.summary(filters),
        queryFn: () => fetchDashboardSummary(filters),
        placeholderData: (previousData) => previousData,
    });

    const historyQuery = useQuery({
        queryKey: dashboardKeys.history(historyYear),
        queryFn: () => fetchDashboardHistory(historyYear),
        placeholderData: (previousData) => previousData,
    });

    const summary = summaryQuery.data ?? EMPTY_SUMMARY;
    const periodLabel = getDashboardPeriodLabel(filters);
    const chartData = useMemo(
        () => buildChartData(historyQuery.data ?? [], filters),
        [historyQuery.data, filters],
    );
    const isInitialLoading = summaryQuery.isPending && !summaryQuery.data;
    const isRefreshing = summaryQuery.isFetching || historyQuery.isFetching;
    const pageError = summaryQuery.error ?? historyQuery.error;

    async function refreshDashboard() {
        await Promise.all([summaryQuery.refetch(), historyQuery.refetch()]);
    }

    if (isInitialLoading) {
        return (
            <PageContainer className="py-5 sm:py-7 lg:py-8">
                <DashboardSkeleton />
            </PageContainer>
        );
    }

    if (pageError && !summaryQuery.data) {
        return (
            <PageContainer className="py-5 sm:py-7 lg:py-8">
                <DashboardErrorState message={getApiErrorMessage(pageError)} onRetry={refreshDashboard} />
            </PageContainer>
        );
    }

    return (
        <PageContainer className="space-y-6 py-5 sm:py-7 lg:space-y-7 lg:py-8">
            <PageHeader
                eyebrow="Visão geral"
                title={`Olá, ${getFirstName(user?.name)}`}
                description={`Acompanhe seu dinheiro com uma leitura clara de ${periodLabel.toLowerCase()}.`}
                actions={(
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={refreshDashboard}
                        disabled={isRefreshing}
                        aria-label="Atualizar dados do Dashboard"
                        title="Atualizar dados"
                    >
                        <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                    </Button>
                )}
            />

            <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <DashboardPeriodFilter filters={filters} onChange={updateFilters} disabled={isRefreshing} />
                <p className="px-1 text-xs leading-5 text-subtle-foreground">
                    Os totais e lançamentos abaixo respeitam o período selecionado.
                </p>
            </div>

            {pageError && summaryQuery.data && (
                <div role="status" className="flex items-center justify-between gap-4 rounded-card-sm border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-warning">
                    <span>Parte dos dados não pôde ser atualizada. Os últimos valores disponíveis continuam visíveis.</span>
                    <button type="button" className="shrink-0 font-bold underline underline-offset-4" onClick={refreshDashboard}>Tentar novamente</button>
                </div>
            )}

            <DashboardQuickActions />

            <section className="grid gap-4 lg:grid-cols-12" aria-label="Balanço e saúde financeira">
                <BalanceHeroCard summary={summary} periodLabel={periodLabel} />
                <FinancialHealthCard summary={summary} />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Indicadores financeiros">
                <DashboardMetricCard
                    title="Receitas"
                    valueCents={summary.totalIncomeCents}
                    detail={`${summary.incomeCount ?? 0} lançamentos de entrada`}
                    icon={ArrowUpRight}
                    tone="success"
                />
                <DashboardMetricCard
                    title="Despesas"
                    valueCents={summary.totalExpenseCents}
                    detail={`${summary.expenseCount ?? 0} lançamentos de saída`}
                    icon={ArrowDownLeft}
                    tone="danger"
                />
                <DashboardMetricCard
                    title="Volume movimentado"
                    valueCents={(Number(summary.totalIncomeCents) || 0) + (Number(summary.totalExpenseCents) || 0)}
                    detail={`${summary.transactionCount ?? 0} movimentações no total`}
                    icon={ReceiptText}
                    tone="primary"
                />
            </section>

            <section className="grid gap-4 lg:grid-cols-12" aria-label="Gráficos financeiros">
                <CashFlowChart data={chartData} loading={historyQuery.isPending} />
                <BalanceEvolutionChart data={chartData} loading={historyQuery.isPending} />
            </section>

            <section className="grid gap-4 lg:grid-cols-12" aria-label="Atividade financeira recente">
                <RecentTransactions transactions={summary.recentTransactions} loading={summaryQuery.isPending} />
                <DashboardSummaryPanel summary={summary} />
            </section>
        </PageContainer>
    );
}

export default Dashboard;
