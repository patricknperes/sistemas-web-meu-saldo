import {
    RiAddLine,
    RiInbox2Line,
} from "react-icons/ri";

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
import EmptyState from "../ui/feedback/EmptyState.jsx";
import { LoadingState } from "../ui/feedback/LoadingState.jsx";
import TransactionCard from "../ui/transactions/TransactionCard.jsx";
import TransactionRow from "../ui/transactions/TransactionRow.jsx";

import {
    prepareTransactionForView,
} from "./transactionPageUtils.js";

function TransactionDataView({
    transactions = [],
    loading = false,
    deletingId = null,
    pagination = {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    },
    singularLabel = "movimentação",
    pluralLabel = "movimentações",
    emptyTitle = "Nenhuma movimentação encontrada",
    emptyDescription = "Os lançamentos cadastrados aparecerão aqui.",
    onEdit,
    onDelete,
    onCreate,
    onPageChange,
}) {
    const preparedTransactions = transactions.map(prepareTransactionForView);
    const totalPages = Number(pagination?.totalPages) || 0;
    const currentPage = Number(pagination?.page) || 1;
    const totalItems = Number(pagination?.totalItems) || 0;
    const pageSize = Number(pagination?.limit) || 10;

    const emptyAction = onCreate ? (
        <Button
            size="sm"
            leadingIcon={<RiAddLine size={17} aria-hidden="true" />}
            onClick={onCreate}
        >
            Nova {singularLabel}
        </Button>
    ) : null;

    const loadingOrEmptyMobile = loading ? (
        <LoadingState
            title={`Carregando ${pluralLabel}`}
            description="Aguarde enquanto atualizamos os lançamentos."
            compact
        />
    ) : (
        <EmptyState
            icon={RiInbox2Line}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            compact
        />
    );

    const footer = totalPages > 1 ? (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            itemLabel={pluralLabel}
            compact
            onPageChange={onPageChange}
        />
    ) : totalItems > 0 ? (
        <p className="text-caption text-muted-foreground">
            {totalItems} {totalItems === 1 ? singularLabel : pluralLabel} no período selecionado.
        </p>
    ) : null;

    return (
        <ResponsiveDataView
            breakpoint="md"
            desktop={
                <DataTable
                    stickyHeader
                    density="default"
                    footer={footer}
                    tableClassName="min-w-[58rem]"
                >
                    <DataTableHeader>
                        <DataTableRow>
                            <DataTableHead>Movimentação</DataTableHead>
                            <DataTableHead>Classificação</DataTableHead>
                            <DataTableHead>Data</DataTableHead>
                            <DataTableHead align="right">Valor</DataTableHead>
                            <DataTableHead align="right">
                                <span className="sr-only">Ações</span>
                            </DataTableHead>
                        </DataTableRow>
                    </DataTableHeader>

                    <DataTableBody>
                        {loading || preparedTransactions.length === 0 ? (
                            <DataTableState
                                colSpan={5}
                                loading={loading}
                                title={emptyTitle}
                                description={emptyDescription}
                                action={emptyAction}
                            />
                        ) : (
                            preparedTransactions.map((transaction) => (
                                <TransactionRow
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    deleting={deletingId === transaction.id}
                                />
                            ))
                        )}
                    </DataTableBody>
                </DataTable>
            }
            mobile={
                <div className="grid gap-4">
                    {preparedTransactions.length > 0 && !loading ? (
                        <DataList>
                            {preparedTransactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    deleting={deletingId === transaction.id}
                                />
                            ))}
                        </DataList>
                    ) : loadingOrEmptyMobile}

                    {footer ? (
                        <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-xs">
                            {footer}
                        </div>
                    ) : null}
                </div>
            }
        />
    );
}

export default TransactionDataView;
