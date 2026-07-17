import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiBarChartGroupedLine,
    RiExchangeFundsLine,
    RiFundsLine,
    RiPieChart2Line,
    RiRefreshLine,
    RiWallet3Line,
} from "react-icons/ri";

import {
    Button,
} from "../../components/ui/actions/index.js";
import {
    PeriodPicker,
} from "../../components/ui/date-picker/index.js";
import {
    Alert,
    ErrorState,
    Skeleton,
} from "../../components/ui/feedback/index.js";
import {
    BalanceStatus,
    ChartCard,
    FinancialSummary,
    MetricCard,
} from "../../components/ui/finance/index.js";
import {
    Page,
    PageGrid,
    PageHeader,
    PageSection,
} from "../../components/ui/layout/index.js";
import {
    Card,
} from "../../components/ui/surfaces/index.js";

import {
    useAuth,
} from "../../hooks/useAuth.js";
import {
    dashboardService,
} from "../../services/dashboardService.js";

import CashComposition from "./components/CashComposition.jsx";
import MonthlyFlowChart from "./components/MonthlyFlowChart.jsx";
import RecentTransactionsPanel from "./components/RecentTransactionsPanel.jsx";
import {
    calculateSavingsRate,
    createHistorySeries,
    createSummaryFilters,
    dashboardFilterToPeriod,
    formatPercent,
    getBalanceHealth,
    getChartCopy,
    getHistoryYear,
    getPeriodLabel,
    getSelectedMonthKey,
    normalizeCents,
    normalizeDashboardFilter,
    periodToDashboardFilter,
    readDashboardFilter,
    saveDashboardFilter,
} from "./components/dashboardUtils.js";

function getErrorMessage(error, fallback) {
    return error?.response?.data?.error
        || error?.response?.data?.message
        || error?.message
        || fallback;
}

function BalanceSparkline({
    data = [],
    positive = true,
}) {
    const values = data.map((item) => normalizeCents(item.balanceCents));

    if (!values.length) {
        return null;
    }

    const width = 240;
    const height = 54;
    const padding = 4;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(maxValue - minValue, 1);
    const step = values.length > 1
        ? (width - padding * 2) / (values.length - 1)
        : 0;
    const points = values.map((value, index) => {
        const x = padding + index * step;
        const y = padding + ((maxValue - value) / range) * (height - padding * 2);

        return `${x},${y}`;
    }).join(" ");

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-14 w-full"
            role="img"
            aria-label="Variação do saldo mensal"
        >
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "var(--app-success)" : "var(--app-danger)"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {points.split(" ").map((point, index) => {
                const [cx, cy] = point.split(",");

                return (
                    <circle
                        key={`${cx}-${cy}-${index}`}
                        cx={cx}
                        cy={cy}
                        r={index === values.length - 1 ? "3.5" : "2"}
                        fill={positive ? "var(--app-success)" : "var(--app-danger)"}
                    />
                );
            })}
        </svg>
    );
}

function DashboardLoading() {
    return (
        <Page>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <Skeleton className="h-8 w-52 rounded-lg" />
                    <Skeleton className="mt-3 h-4 w-full max-w-xl rounded-md" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-40 rounded-lg" />
                    <Skeleton className="h-10 w-36 rounded-lg" />
                </div>
            </div>

            <PageGrid columns="metrics">
                <Skeleton className="h-48 sm:col-span-2 xl:col-span-2 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </PageGrid>

            <Skeleton className="h-24 rounded-xl" />

            <PageGrid columns="content" gap="lg">
                <Skeleton className="h-[26rem] rounded-xl" />
                <Skeleton className="h-[26rem] rounded-xl" />
            </PageGrid>

            <Skeleton className="h-80 rounded-xl" />
        </Page>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const [dashboardFilter, setDashboardFilter] = useState(() => readDashboardFilter(user?.id));
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [historyError, setHistoryError] = useState("");

    const loadDashboard = useCallback(async ({
        initial = false,
        filter,
    } = {}) => {
        const activeFilter = normalizeDashboardFilter(filter);

        if (initial) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setErrorMessage("");
        setHistoryError("");

        const [summaryResult, historyResult] = await Promise.allSettled([
            dashboardService.getSummary(createSummaryFilters(activeFilter)),
            dashboardService.getHistory(getHistoryYear(activeFilter)),
        ]);

        if (summaryResult.status === "fulfilled") {
            setSummary(summaryResult.value?.summary ?? null);
        } else {
            setErrorMessage(getErrorMessage(
                summaryResult.reason,
                "Não foi possível carregar o resumo financeiro.",
            ));
        }

        if (historyResult.status === "fulfilled") {
            setHistory(Array.isArray(historyResult.value?.history)
                ? historyResult.value.history
                : []);
        } else {
            setHistoryError(getErrorMessage(
                historyResult.reason,
                "Não foi possível carregar a evolução mensal.",
            ));
        }

        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        const savedFilter = readDashboardFilter(user?.id);

        setDashboardFilter(savedFilter);
        loadDashboard({
            initial: true,
            filter: savedFilter,
        });
    }, [loadDashboard, user?.id]);

    const handlePeriodChange = useCallback((period) => {
        const nextFilter = periodToDashboardFilter(period);

        setDashboardFilter(nextFilter);
        saveDashboardFilter(user?.id, nextFilter);
        loadDashboard({ filter: nextFilter });
    }, [loadDashboard, user?.id]);

    const handleRefresh = useCallback(() => {
        loadDashboard({ filter: dashboardFilter });
    }, [dashboardFilter, loadDashboard]);

    const historySeries = useMemo(
        () => createHistorySeries(history, dashboardFilter),
        [dashboardFilter, history],
    );
    const chartCopy = useMemo(
        () => getChartCopy(dashboardFilter),
        [dashboardFilter],
    );
    const selectedMonthKey = getSelectedMonthKey(dashboardFilter);

    if (loading) {
        return <DashboardLoading />;
    }

    if (!summary) {
        return (
            <Page>
                <ErrorState
                    title="Não foi possível abrir a Dashboard"
                    description={errorMessage || "Tente carregar os dados novamente."}
                    action={
                        <Button
                            leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                            onClick={() => loadDashboard({
                                initial: true,
                                filter: dashboardFilter,
                            })}
                        >
                            Tentar novamente
                        </Button>
                    }
                />
            </Page>
        );
    }

    const balanceCents = normalizeCents(summary.balanceCents);
    const totalIncomeCents = normalizeCents(summary.totalIncomeCents);
    const totalExpenseCents = normalizeCents(summary.totalExpenseCents);
    const transactionCount = normalizeCents(summary.transactionCount);
    const incomeCount = normalizeCents(summary.incomeCount);
    const expenseCount = normalizeCents(summary.expenseCount);
    const savingsRate = calculateSavingsRate(balanceCents, totalIncomeCents);
    const balanceHealth = getBalanceHealth(balanceCents, totalIncomeCents);
    const recentTransactions = Array.isArray(summary.recentTransactions)
        ? summary.recentTransactions
        : [];
    const hasHistory = historySeries.some((item) => item.transactionCount > 0);
    const firstName = String(user?.name || "").trim().split(/\s+/)[0];

    const countItems = [
        {
            id: "transactions",
            label: "Movimentações",
            description: "Lançamentos no período",
            formattedValue: String(transactionCount),
            icon: RiExchangeFundsLine,
            tone: "primary",
        },
        {
            id: "income",
            label: "Receitas cadastradas",
            description: "Entradas consideradas",
            formattedValue: String(incomeCount),
            icon: RiArrowUpLine,
            tone: "positive",
        },
        {
            id: "expenses",
            label: "Despesas cadastradas",
            description: "Saídas consideradas",
            formattedValue: String(expenseCount),
            icon: RiArrowDownLine,
            tone: "negative",
        },
    ];

    return (
        <Page>
            <PageHeader
                eyebrow="Visão geral"
                title={firstName ? `Olá, ${firstName}` : "Resumo financeiro"}
                description="Acompanhe seu saldo, a composição dos gastos e as movimentações mais recentes em uma única visão."
                meta={
                    <span className="inline-flex items-center gap-2 rounded-pill border border-primary/15 bg-primary-muted px-3 py-1 text-caption font-bold text-primary">
                        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                        {getPeriodLabel(dashboardFilter)}
                    </span>
                }
                actions={
                    <>
                        <PeriodPicker
                            value={dashboardFilterToPeriod(dashboardFilter)}
                            onChange={handlePeriodChange}
                            disabled={refreshing}
                            className="w-full sm:w-auto sm:min-w-44"
                        />
                        <Button
                            variant="outline"
                            leadingIcon={
                                <RiRefreshLine
                                    size={17}
                                    aria-hidden="true"
                                    className={refreshing ? "animate-spin" : ""}
                                />
                            }
                            loading={refreshing}
                            loadingText="Atualizando"
                            onClick={handleRefresh}
                        >
                            Atualizar
                        </Button>
                    </>
                }
            />

            {errorMessage ? (
                <Alert variant="danger" title="Os dados não foram atualizados">
                    {errorMessage} A última versão carregada continua sendo exibida.
                </Alert>
            ) : null}

            <PageSection aria-label="Indicadores financeiros">
                <PageGrid columns="metrics">
                    <MetricCard
                        label="Saldo disponível"
                        value={balanceCents / 100}
                        tone={balanceCents < 0 ? "negative" : "positive"}
                        icon={RiWallet3Line}
                        size="lg"
                        className="sm:col-span-2 xl:col-span-2"
                        status={
                            <BalanceStatus
                                compact
                                status={balanceHealth.status}
                                label={balanceHealth.label}
                            />
                        }
                        description={balanceHealth.description}
                        chart={
                            <BalanceSparkline
                                data={historySeries}
                                positive={balanceCents >= 0}
                            />
                        }
                    />

                    <MetricCard
                        label="Total de receitas"
                        value={totalIncomeCents / 100}
                        tone="positive"
                        icon={RiArrowUpLine}
                        description={`${incomeCount} ${incomeCount === 1 ? "entrada registrada" : "entradas registradas"}`}
                    />

                    <MetricCard
                        label="Total de despesas"
                        value={totalExpenseCents / 100}
                        tone="negative"
                        icon={RiArrowDownLine}
                        description={`${expenseCount} ${expenseCount === 1 ? "saída registrada" : "saídas registradas"}`}
                    />
                </PageGrid>
            </PageSection>

            <PageGrid columns={2} gap="md" className="lg:grid-cols-[minmax(0,1fr)_18rem]">
                <FinancialSummary
                    title="Atividade do período"
                    description="Quantidade de lançamentos considerados no resumo atual."
                    columns={3}
                    items={countItems}
                />

                <Card className="flex min-w-0 items-center gap-4 p-4 sm:p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary-muted text-primary">
                        <RiFundsLine size={21} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-caption font-semibold text-muted-foreground">
                            Taxa de economia
                        </p>
                        <strong className={`mt-1 block text-section-title font-extrabold tabular-nums ${savingsRate < 0 ? "text-danger" : "text-foreground"}`}>
                            {formatPercent(savingsRate)}
                        </strong>
                        <p className="mt-1 text-[0.6875rem] text-subtle-foreground">
                            Percentual das receitas que permaneceu no saldo.
                        </p>
                    </div>
                </Card>
            </PageGrid>

            <PageGrid columns="content" gap="lg">
                <ChartCard
                    eyebrow="Desempenho"
                    title={chartCopy.title}
                    description={chartCopy.description}
                    icon={RiBarChartGroupedLine}
                    legend={[
                        {
                            id: "income",
                            label: "Receitas",
                            color: "var(--app-success)",
                        },
                        {
                            id: "expenses",
                            label: "Despesas",
                            color: "var(--app-danger)",
                        },
                    ]}
                    state={historyError ? "error" : hasHistory ? "ready" : "empty"}
                    stateTitle={historyError ? "Evolução mensal indisponível" : "Sem dados para o gráfico"}
                    stateDescription={historyError || "Registre movimentações para visualizar a evolução financeira."}
                    onRetry={handleRefresh}
                    height={350}
                    bodyClassName="px-3 pb-2 pt-4 sm:px-4"
                >
                    <MonthlyFlowChart
                        data={historySeries}
                        selectedKey={selectedMonthKey}
                    />
                </ChartCard>

                <ChartCard
                    eyebrow="Composição"
                    title="Entradas e saídas"
                    description="Veja como o volume financeiro se distribui no período."
                    icon={RiPieChart2Line}
                    state={transactionCount > 0 ? "ready" : "empty"}
                    stateTitle="Sem movimentações"
                    stateDescription="A composição será exibida quando houver receitas ou despesas."
                    height={350}
                    bodyClassName="px-4 py-5"
                >
                    <CashComposition
                        incomeCents={totalIncomeCents}
                        expenseCents={totalExpenseCents}
                        balanceCents={balanceCents}
                    />
                </ChartCard>
            </PageGrid>

            <RecentTransactionsPanel transactions={recentTransactions} />
        </Page>
    );
}

export default Dashboard;
