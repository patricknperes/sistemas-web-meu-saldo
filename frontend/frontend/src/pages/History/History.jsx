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
    RiCalendarCheckLine,
    RiExchangeFundsLine,
    RiHistoryLine,
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
    EmptyState,
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

import HistoryFlowChart from "./components/HistoryFlowChart.jsx";
import HistoryTransactionsPanel from "./components/HistoryTransactionsPanel.jsx";
import MonthHistoryCard from "./components/MonthHistoryCard.jsx";
import YearHistoryGroup from "./components/YearHistoryGroup.jsx";
import {
    aggregateHistory,
    filterHistoryByPeriod,
    getBalanceStatus,
    getErrorMessage,
    getHistoryRequestYear,
    getPeriodDescription,
    getPeriodLabel,
    groupHistoryByYear,
    normalizeHistoryPeriod,
    readHistoryPeriod,
    saveHistoryPeriod,
    sortHistory,
} from "./components/historyUtils.js";

function HistoryLoading() {
    return (
        <Page>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="mt-3 h-4 w-full max-w-2xl rounded-md" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-44 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            <PageGrid columns="metrics">
                {Array.from({ length: 4 }, (_, index) => (
                    <Skeleton key={index} className="h-44 rounded-xl" />
                ))}
            </PageGrid>

            <PageGrid columns="content" gap="lg">
                <Skeleton className="h-[28rem] rounded-xl" />
                <Skeleton className="h-[28rem] rounded-xl" />
            </PageGrid>

            <Skeleton className="h-96 rounded-xl" />
        </Page>
    );
}

function History() {
    const { user } = useAuth();
    const [period, setPeriod] = useState(() => readHistoryPeriod(user?.id));
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);

    const loadHistory = useCallback(async ({
        nextPeriod,
        initial = false,
    } = {}) => {
        const activePeriod = normalizeHistoryPeriod(nextPeriod);

        if (initial) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setErrorMessage("");

        try {
            const response = await dashboardService.getHistory(
                getHistoryRequestYear(activePeriod),
            );
            const receivedHistory = sortHistory(response?.history);

            setHistory(receivedHistory);
            return true;
        } catch (error) {
            if (initial) {
                setHistory([]);
            }

            setErrorMessage(getErrorMessage(
                error,
                "Não foi possível carregar o histórico financeiro.",
            ));
            return false;
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const savedPeriod = readHistoryPeriod(user?.id);

        setPeriod(savedPeriod);
        loadHistory({
            nextPeriod: savedPeriod,
            initial: true,
        });
    }, [loadHistory, user?.id]);

    const visibleHistory = useMemo(
        () => filterHistoryByPeriod(history, period),
        [history, period],
    );
    const summary = useMemo(
        () => aggregateHistory(visibleHistory),
        [visibleHistory],
    );
    const yearGroups = useMemo(
        () => groupHistoryByYear(visibleHistory),
        [visibleHistory],
    );
    const balancePresentation = getBalanceStatus(summary.balanceCents);
    const periodLabel = getPeriodLabel(period);
    const selectedKey = period.mode === "month" ? period.month : undefined;
    const hasHistory = visibleHistory.length > 0;

    const activityItems = [
        {
            id: "transactions",
            label: "Movimentações",
            description: "Lançamentos considerados",
            formattedValue: String(summary.transactionCount),
            icon: RiExchangeFundsLine,
            tone: "primary",
        },
        {
            id: "income-count",
            label: "Receitas cadastradas",
            description: "Entradas no período",
            formattedValue: String(summary.incomeCount),
            icon: RiArrowUpLine,
            tone: "positive",
        },
        {
            id: "expense-count",
            label: "Despesas cadastradas",
            description: "Saídas no período",
            formattedValue: String(summary.expenseCount),
            icon: RiArrowDownLine,
            tone: "negative",
        },
    ];

    async function handlePeriodChange(nextPeriod) {
        const normalized = normalizeHistoryPeriod(nextPeriod);

        setPeriod(normalized);
        saveHistoryPeriod(user?.id, normalized);
        await loadHistory({
            nextPeriod: normalized,
            initial: true,
        });
        setTransactionRefreshKey((current) => current + 1);
    }

    async function handleRefresh() {
        await loadHistory({ nextPeriod: period });
        setTransactionRefreshKey((current) => current + 1);
    }

    if (loading) {
        return <HistoryLoading />;
    }

    if (errorMessage && !history.length) {
        return (
            <Page>
                <ErrorState
                    title="Não foi possível abrir o histórico"
                    description={errorMessage}
                    action={
                        <Button
                            leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                            onClick={() => loadHistory({
                                nextPeriod: period,
                                initial: true,
                            })}
                        >
                            Tentar novamente
                        </Button>
                    }
                />
            </Page>
        );
    }

    return (
        <Page>
            <PageHeader
                eyebrow="Histórico financeiro"
                title="Evolução das suas finanças"
                description={getPeriodDescription(period)}
                meta={
                    <span className="inline-flex items-center gap-2 rounded-pill border border-primary/15 bg-primary-muted px-3 py-1 text-caption font-bold text-primary">
                        <RiHistoryLine size={14} aria-hidden="true" />
                        {periodLabel}
                    </span>
                }
                actions={
                    <>
                        <PeriodPicker
                            value={period}
                            onChange={handlePeriodChange}
                            minYear={1900}
                            maxYear={2100}
                            minMonth="1900-01"
                            maxMonth="2100-12"
                            disabled={refreshing}
                            className="w-full sm:w-auto sm:min-w-44"
                        />

                        <Button
                            variant="outline"
                            loading={refreshing}
                            loadingText="Atualizando"
                            leadingIcon={
                                <RiRefreshLine
                                    size={17}
                                    aria-hidden="true"
                                    className={refreshing ? "animate-spin" : ""}
                                />
                            }
                            onClick={handleRefresh}
                        >
                            Atualizar
                        </Button>
                    </>
                }
            />

            {errorMessage ? (
                <Alert variant="danger" title="O histórico não foi atualizado">
                    {errorMessage} A última versão carregada continua sendo exibida.
                </Alert>
            ) : null}

            <PageSection aria-label="Resumo financeiro do histórico">
                <PageGrid columns="metrics">
                    <MetricCard
                        label="Resultado do período"
                        value={summary.balanceCents / 100}
                        tone={summary.balanceCents < 0 ? "negative" : "positive"}
                        icon={RiWallet3Line}
                        size="lg"
                        className="sm:col-span-2 xl:col-span-1"
                        status={
                            <BalanceStatus
                                compact
                                status={balancePresentation.status}
                                label={balancePresentation.label}
                            />
                        }
                        description={balancePresentation.description}
                    />

                    <MetricCard
                        label="Receitas acumuladas"
                        value={summary.totalIncomeCents / 100}
                        tone="positive"
                        icon={RiArrowUpLine}
                        description={`${summary.incomeCount} ${summary.incomeCount === 1 ? "entrada registrada" : "entradas registradas"}`}
                    />

                    <MetricCard
                        label="Despesas acumuladas"
                        value={summary.totalExpenseCents / 100}
                        tone="negative"
                        icon={RiArrowDownLine}
                        description={`${summary.expenseCount} ${summary.expenseCount === 1 ? "saída registrada" : "saídas registradas"}`}
                    />

                    <MetricCard
                        label="Meses com movimentação"
                        formattedValue={String(summary.monthsWithMovement)}
                        tone="primary"
                        icon={RiCalendarCheckLine}
                        description={period.mode === "month"
                            ? "Mês selecionado"
                            : "Períodos com registros financeiros"}
                    />
                </PageGrid>
            </PageSection>

            <PageGrid columns="content" gap="lg">
                <ChartCard
                    eyebrow="Evolução"
                    title="Receitas e despesas por mês"
                    description={period.mode === "all"
                        ? "O gráfico apresenta os 12 meses mais recentes do histórico completo."
                        : "Compare o volume de entradas e saídas ao longo do período selecionado."}
                    icon={RiBarChartGroupedLine}
                    legend={[
                        {
                            id: "income",
                            label: "Receitas",
                            color: "var(--app-success)",
                        },
                        {
                            id: "expense",
                            label: "Despesas",
                            color: "var(--app-danger)",
                        },
                    ]}
                    state={hasHistory ? "ready" : "empty"}
                    stateTitle="Sem dados para o gráfico"
                    stateDescription="Registre receitas ou despesas para acompanhar a evolução mensal."
                    height={350}
                    bodyClassName="px-3 pb-2 pt-4 sm:px-4"
                >
                    <HistoryFlowChart
                        data={visibleHistory}
                        selectedKey={selectedKey}
                    />
                </ChartCard>

                <div className="grid content-start gap-4">
                    <FinancialSummary
                        title="Atividade do período"
                        description="Quantidade de lançamentos que compõem este histórico."
                        columns={1}
                        items={activityItems}
                    />

                    <Card className="flex min-w-0 items-start gap-4 p-5">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary-muted text-primary">
                            <RiHistoryLine size={21} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-caption font-semibold text-muted-foreground">
                                Período analisado
                            </p>
                            <strong className="mt-1 block text-card-title font-extrabold text-foreground">
                                {periodLabel}
                            </strong>
                            <p className="mt-2 text-caption leading-5 text-subtle-foreground">
                                Os valores futuros de recorrências não são contabilizados antes da data programada.
                            </p>
                        </div>
                    </Card>
                </div>
            </PageGrid>

            <PageSection
                eyebrow="Organização temporal"
                title={period.mode === "all" ? "Histórico por ano e mês" : "Resumo por mês"}
                description={period.mode === "all"
                    ? "Cada ano reúne os seus indicadores e os meses em que houve movimentação."
                    : `Veja como as movimentações se distribuíram em ${periodLabel}.`}
            >
                {!hasHistory ? (
                    <EmptyState
                        icon={RiHistoryLine}
                        title="Nenhum lançamento no período"
                        description="Não existem receitas ou despesas registradas para a seleção atual."
                    />
                ) : period.mode === "all" ? (
                    <div className="grid gap-5">
                        {yearGroups.map((group) => (
                            <YearHistoryGroup
                                key={group.year}
                                group={group}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibleHistory.map((month) => (
                            <MonthHistoryCard
                                key={month.key}
                                item={month}
                            />
                        ))}
                    </div>
                )}
            </PageSection>

            <HistoryTransactionsPanel
                period={period}
                refreshKey={transactionRefreshKey}
            />
        </Page>
    );
}

export default History;
