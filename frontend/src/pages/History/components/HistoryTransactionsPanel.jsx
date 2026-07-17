import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    RiFileList3Line,
    RiRefreshLine,
} from "react-icons/ri";

import TransactionDataView from "../../../components/transactions/TransactionDataView.jsx";
import {
    normalizeTransactionListResponse,
} from "../../../components/transactions/transactionPageUtils.js";
import {
    Button,
} from "../../../components/ui/actions/index.js";
import {
    Alert,
} from "../../../components/ui/feedback/index.js";
import {
    SearchInput,
} from "../../../components/ui/forms/index.js";
import {
    PageSection,
    PageToolbar,
} from "../../../components/ui/layout/index.js";
import {
    transactionService,
} from "../../../services/transactionService.js";

import {
    getErrorMessage,
    getPeriodLabel,
    getTransactionFilters,
} from "./historyUtils.js";

const PAGE_SIZE = 10;

function HistoryTransactionsPanel({
    period,
    refreshKey = 0,
}) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const loadTransactions = useCallback(async ({
        page = 1,
        initial = false,
    } = {}) => {
        if (initial) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setErrorMessage("");

        try {
            const response = await transactionService.list(
                getTransactionFilters(period, debouncedSearch, page, PAGE_SIZE),
            );
            const normalized = normalizeTransactionListResponse(response, page, PAGE_SIZE);

            setTransactions(normalized.transactions);
            setPagination(normalized.pagination);
        } catch (error) {
            setTransactions([]);
            setPagination({
                page: 1,
                limit: PAGE_SIZE,
                totalItems: 0,
                totalPages: 0,
            });
            setErrorMessage(getErrorMessage(
                error,
                "Não foi possível carregar os lançamentos do histórico.",
            ));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [debouncedSearch, period]);

    useEffect(() => {
        loadTransactions({
            page: 1,
            initial: true,
        });
    }, [loadTransactions, refreshKey]);

    function handlePageChange(page) {
        loadTransactions({ page });
    }

    return (
        <PageSection
            eyebrow="Lançamentos"
            title="Movimentações do período"
            description={`Consulte os registros considerados em ${getPeriodLabel(period)}.`}
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    loading={refreshing}
                    loadingText="Atualizando"
                    leadingIcon={
                        <RiRefreshLine
                            size={17}
                            aria-hidden="true"
                            className={refreshing ? "animate-spin" : ""}
                        />
                    }
                    onClick={() => loadTransactions({ page: pagination.page })}
                >
                    Atualizar lista
                </Button>
            }
        >
            <div className="grid gap-4">
                <PageToolbar
                    startContent={
                        <div className="w-full md:max-w-md">
                            <SearchInput
                                value={search}
                                onValueChange={setSearch}
                                placeholder="Pesquisar por descrição"
                                aria-label="Pesquisar movimentações do histórico"
                            />
                        </div>
                    }
                    endContent={
                        <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-caption font-semibold text-muted-foreground">
                            <RiFileList3Line size={15} aria-hidden="true" />
                            {pagination.totalItems} {pagination.totalItems === 1 ? "registro" : "registros"}
                        </span>
                    }
                />

                {errorMessage ? (
                    <Alert variant="danger" title="Histórico de lançamentos indisponível">
                        {errorMessage}
                    </Alert>
                ) : null}

                <TransactionDataView
                    transactions={transactions}
                    loading={loading}
                    pagination={pagination}
                    singularLabel="movimentação"
                    pluralLabel="movimentações"
                    emptyTitle="Nenhuma movimentação encontrada"
                    emptyDescription="Não há lançamentos para o período e a pesquisa atuais."
                    onPageChange={handlePageChange}
                />
            </div>
        </PageSection>
    );
}

export default HistoryTransactionsPanel;
