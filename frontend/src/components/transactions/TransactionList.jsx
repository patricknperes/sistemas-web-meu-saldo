import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownSLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiDeleteBinLine,
    RiEditLine,
    RiFileList3Line,
    RiLoader4Line,
    RiWallet3Line,
} from "react-icons/ri";

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const DEFAULT_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
];

function normalizeNumber(
    value,
    fallback = 0
) {
    const normalizedValue =
        Number(value);

    return Number.isFinite(
        normalizedValue
    )
        ? normalizedValue
        : fallback;
}

function getPaginationItems(
    currentPage,
    totalPages
) {
    if (totalPages <= 5) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) => index + 1
        );
    }

    if (currentPage <= 3) {
        return [
            1,
            2,
            3,
            4,
            "ellipsis-right",
            totalPages,
        ];
    }

    if (
        currentPage >=
        totalPages - 2
    ) {
        return [
            1,
            "ellipsis-left",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "ellipsis-left",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis-right",
        totalPages,
    ];
}

function TransactionList({
    transactions = [],
    type = "INCOME",

    title = "Transações",
    singularLabel,
    pluralLabel,
    emptyMessage,

    totalCents = 0,
    totalLabel,

    loading = false,
    deletingId = null,

    pagination = {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    },

    currentPage = 1,
    pageSize = 10,
    pageSizeOptions =
    DEFAULT_PAGE_SIZE_OPTIONS,

    onEdit,
    onDelete,

    onPageChange,
    onPageSizeChange,
    onPreviousPage,
    onNextPage,
}) {
    const isIncome =
        type === "INCOME";

    const resolvedSingularLabel =
        singularLabel ??
        (
            isIncome
                ? "receita"
                : "despesa"
        );

    const resolvedPluralLabel =
        pluralLabel ??
        (
            isIncome
                ? "receitas"
                : "despesas"
        );

    const resolvedEmptyMessage =
        emptyMessage ??
        `Nenhuma ${resolvedSingularLabel} encontrada para os filtros selecionados.`;

    const resolvedTotalLabel =
        totalLabel ??
        (
            isIncome
                ? "Total das receitas"
                : "Total das despesas"
        );

    const normalizedTotalItems =
        Math.max(
            0,
            Math.trunc(
                normalizeNumber(
                    pagination.totalItems,
                    transactions.length
                )
            )
        );

    const normalizedPageSize =
        Math.max(
            1,
            Math.trunc(
                normalizeNumber(
                    pagination.limit,
                    pageSize
                )
            )
        );

    const calculatedTotalPages =
        normalizedTotalItems > 0
            ? Math.ceil(
                normalizedTotalItems /
                normalizedPageSize
            )
            : 0;

    const normalizedTotalPages =
        Math.max(
            0,
            Math.trunc(
                normalizeNumber(
                    pagination.totalPages,
                    calculatedTotalPages
                )
            )
        );

    const displayedPage =
        Math.min(
            Math.max(
                1,
                Math.trunc(
                    normalizeNumber(
                        pagination.page,
                        currentPage
                    )
                )
            ),
            Math.max(
                normalizedTotalPages,
                1
            )
        );

    const canGoPrevious =
        displayedPage > 1 &&
        !loading;

    const canGoNext =
        displayedPage <
        normalizedTotalPages &&
        !loading;

    /*
     * O rodapé com paginação e quantidade
     * por página só aparece quando existem
     * mais de 10 registros.
     */
    const showPagination =
        normalizedTotalItems > 10;

    const firstVisibleItem =
        normalizedTotalItems === 0
            ? 0
            : (
                displayedPage - 1
            ) *
            normalizedPageSize +
            1;

    const lastVisibleItem =
        normalizedTotalItems === 0
            ? 0
            : Math.min(
                displayedPage *
                normalizedPageSize,
                normalizedTotalItems
            );

    const paginationItems =
        getPaginationItems(
            displayedPage,
            normalizedTotalPages
        );

    const amountClassName =
        isIncome
            ? "text-success"
            : "text-danger";

    const totalContainerClassName =
        isIncome
            ? "bg-success-muted text-success"
            : "bg-danger-muted text-danger";

    const countLabel = `${normalizedTotalItems} ${normalizedTotalItems === 1
        ? resolvedSingularLabel
        : resolvedPluralLabel
        }`;

    function handlePageChange(
        nextPage
    ) {
        if (
            loading ||
            nextPage < 1 ||
            nextPage >
            normalizedTotalPages ||
            nextPage === displayedPage
        ) {
            return;
        }

        onPageChange?.(nextPage);
    }

    function handlePrevious() {
        if (!canGoPrevious) {
            return;
        }

        if (onPreviousPage) {
            onPreviousPage();
            return;
        }

        handlePageChange(
            displayedPage - 1
        );
    }

    function handleNext() {
        if (!canGoNext) {
            return;
        }

        if (onNextPage) {
            onNextPage();
            return;
        }

        handlePageChange(
            displayedPage + 1
        );
    }

    function handlePageSizeChange(
        event
    ) {
        const nextPageSize =
            Number(
                event.target.value
            );

        if (
            !Number.isInteger(
                nextPageSize
            ) ||
            nextPageSize <= 0 ||
            nextPageSize ===
            normalizedPageSize
        ) {
            return;
        }

        onPageSizeChange?.(
            nextPageSize
        );
    }

    return (
        <section
            className="
                w-full min-w-0
                overflow-hidden
                rounded-2xl
                border border-border
                bg-surface
                shadow-card
            "
        >
            <header
                className="
                    flex min-w-0
                    flex-col gap-4
                    border-b border-border
                    px-4 py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >
                <div className="min-w-0">
                    <h2
                        title={title}
                        className="
                            truncate
                            text-base
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        {title}
                    </h2>

                    <p
                        aria-live="polite"
                        className="
                            mt-0.5
                            truncate
                            text-xs
                            text-muted-foreground
                        "
                    >
                        {countLabel}
                    </p>
                </div>

                <div
                    className={`
                        flex min-w-0
                        items-center gap-3
                        rounded-xl
                        px-3.5 py-2.5
                        sm:max-w-[280px]

                        ${totalContainerClassName}
                    `}
                >
                    <span
                        className="
                            flex size-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-surface/60
                        "
                    >
                        <RiWallet3Line
                            size={17}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p
                            title={
                                resolvedTotalLabel
                            }
                            className="
                                truncate
                                text-[11px]
                                font-medium
                                opacity-80
                            "
                        >
                            {resolvedTotalLabel}
                        </p>

                        <p
                            title={formatCurrency(
                                totalCents
                            )}
                            className="
                                mt-0.5
                                truncate
                                text-sm
                                font-semibold
                                tracking-tight
                            "
                        >
                            {formatCurrency(
                                totalCents
                            )}
                        </p>
                    </div>
                </div>
            </header>

            {loading ? (
                <LoadingState
                    pluralLabel={
                        resolvedPluralLabel
                    }
                />
            ) : transactions.length ===
                0 ? (
                <EmptyState
                    message={
                        resolvedEmptyMessage
                    }
                />
            ) : (
                <>
                    <DesktopTable
                        transactions={
                            transactions
                        }
                        singularLabel={
                            resolvedSingularLabel
                        }
                        amountClassName={
                            amountClassName
                        }
                        deletingId={
                            deletingId
                        }
                        onEdit={onEdit}
                        onDelete={
                            onDelete
                        }
                    />

                    <MobileCardList
                        transactions={
                            transactions
                        }
                        singularLabel={
                            resolvedSingularLabel
                        }
                        amountClassName={
                            amountClassName
                        }
                        deletingId={
                            deletingId
                        }
                        onEdit={onEdit}
                        onDelete={
                            onDelete
                        }
                    />
                </>
            )}

            {showPagination && (
                <Pagination
                    currentPage={
                        displayedPage
                    }
                    totalPages={
                        normalizedTotalPages
                    }
                    totalItems={
                        normalizedTotalItems
                    }
                    firstVisibleItem={
                        firstVisibleItem
                    }
                    lastVisibleItem={
                        lastVisibleItem
                    }
                    pageSize={
                        normalizedPageSize
                    }
                    pageSizeOptions={
                        pageSizeOptions
                    }
                    paginationItems={
                        paginationItems
                    }
                    loading={loading}
                    canGoPrevious={
                        canGoPrevious
                    }
                    canGoNext={
                        canGoNext
                    }
                    onPageChange={
                        handlePageChange
                    }
                    onPageSizeChange={
                        handlePageSizeChange
                    }
                    onPrevious={
                        handlePrevious
                    }
                    onNext={
                        handleNext
                    }
                />
            )}
        </section>
    );
}

function LoadingState({
    pluralLabel,
}) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="
                flex min-h-64
                flex-col
                items-center
                justify-center
                gap-3
                px-5 py-12
                text-center
            "
        >
            <RiLoader4Line
                size={24}
                aria-hidden="true"
                className="
                    animate-spin
                    text-muted-foreground
                "
            />

            <p
                className="
                    text-sm
                    text-muted-foreground
                "
            >
                Carregando{" "}
                {pluralLabel}...
            </p>
        </div>
    );
}

function EmptyState({
    message,
}) {
    return (
        <div
            className="
                flex min-h-64
                flex-col
                items-center
                justify-center
                px-5 py-12
                text-center
            "
        >
            <span
                className="
                    flex size-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-surface-muted
                    text-muted-foreground
                "
            >
                <RiFileList3Line
                    size={21}
                    aria-hidden="true"
                />
            </span>

            <h3
                className="
                    mt-4
                    text-sm
                    font-medium
                    text-foreground
                "
            >
                Nenhum registro
                encontrado
            </h3>

            <p
                className="
                    mt-1
                    max-w-sm
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >
                {message}
            </p>
        </div>
    );
}

function DesktopTable({
    transactions,
    singularLabel,
    amountClassName,
    deletingId,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="
                hidden w-full
                lg:block
            "
        >
            <table
                className="
                    w-full
                    table-fixed
                    border-collapse
                    text-left
                "
            >
                <thead>
                    <tr
                        className="
                            bg-surface-muted/60
                            text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        <th
                            scope="col"
                            className="
                                w-[32%]
                                px-5 py-3
                            "
                        >
                            Descrição
                        </th>

                        <th
                            scope="col"
                            className="
                                w-[20%]
                                px-4 py-3
                            "
                        >
                            Categoria
                        </th>

                        <th
                            scope="col"
                            className="
                                w-[16%]
                                px-4 py-3
                            "
                        >
                            Data
                        </th>

                        <th
                            scope="col"
                            className="
                                w-[20%]
                                px-4 py-3
                                text-right
                            "
                        >
                            Valor
                        </th>

                        <th
                            scope="col"
                            className="
                                w-[12%]
                                px-5 py-3
                                text-right
                            "
                        >
                            Ações
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map(
                        (transaction) => {
                            const deleting =
                                deletingId ===
                                transaction.id;

                            return (
                                <tr
                                    key={
                                        transaction.id
                                    }
                                    className="
                                        border-t
                                        border-border
                                        transition-colors
                                        hover:bg-surface-muted/35
                                    "
                                >
                                    <td
                                        className="
                                            min-w-0
                                            px-5 py-4
                                            align-middle
                                        "
                                    >
                                        <div className="min-w-0">
                                            <p
                                                title={
                                                    transaction.description
                                                }
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                "
                                            >
                                                {
                                                    transaction.description
                                                }
                                            </p>

                                            {transaction.notes && (
                                                <p
                                                    title={
                                                        transaction.notes
                                                    }
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-xs
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        transaction.notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    <td
                                        className="
                                            min-w-0
                                            px-4 py-4
                                            align-middle
                                        "
                                    >
                                        <span
                                            title={
                                                transaction.category
                                            }
                                            className="
                                                block
                                                truncate
                                                text-sm
                                                text-muted-foreground
                                            "
                                        >
                                            {
                                                transaction.category
                                            }
                                        </span>
                                    </td>

                                    <td
                                        className="
                                            px-4 py-4
                                            align-middle
                                        "
                                    >
                                        <span
                                            className="
                                                block
                                                truncate
                                                text-sm
                                                text-muted-foreground
                                            "
                                        >
                                            {formatDate(
                                                transaction.date
                                            )}
                                        </span>
                                    </td>

                                    <td
                                        className="
                                            min-w-0
                                            px-4 py-4
                                            text-right
                                            align-middle
                                        "
                                    >
                                        <span
                                            title={formatCurrency(
                                                transaction.amountCents
                                            )}
                                            className={`
                                                block
                                                truncate
                                                text-sm
                                                font-semibold
                                                ${amountClassName}
                                            `}
                                        >
                                            {formatCurrency(
                                                transaction.amountCents
                                            )}
                                        </span>
                                    </td>

                                    <td
                                        className="
                                            px-5 py-4
                                            align-middle
                                        "
                                    >
                                        <ActionButtons
                                            transaction={
                                                transaction
                                            }
                                            singularLabel={
                                                singularLabel
                                            }
                                            deleting={
                                                deleting
                                            }
                                            onEdit={
                                                onEdit
                                            }
                                            onDelete={
                                                onDelete
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </div>
    );
}

function MobileCardList({
    transactions,
    singularLabel,
    amountClassName,
    deletingId,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="
                grid w-full
                min-w-0 gap-3
                p-3
                sm:grid-cols-2
                lg:hidden
            "
        >
            <AnimatePresence
                initial={false}
                mode="popLayout"
            >
                {transactions.map(
                    (transaction) => {
                        const deleting =
                            deletingId ===
                            transaction.id;

                        return (
                            <motion.article
                                key={
                                    transaction.id
                                }
                                layout
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
                                    scale: 0.98,
                                }}
                                transition={{
                                    duration: 0.18,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                }}
                                className="
                                    flex min-w-0
                                    flex-col
                                    rounded-xl
                                    border border-border
                                    bg-background
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex min-w-0
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <h3
                                            title={
                                                transaction.description
                                            }
                                            className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            {
                                                transaction.description
                                            }
                                        </h3>

                                        <p
                                            title={
                                                transaction.category
                                            }
                                            className="
                                                mt-1
                                                truncate
                                                text-xs
                                                text-muted-foreground
                                            "
                                        >
                                            {
                                                transaction.category
                                            }
                                        </p>
                                    </div>

                                    <strong
                                        title={formatCurrency(
                                            transaction.amountCents
                                        )}
                                        className={`
                                            max-w-[48%]
                                            shrink-0
                                            truncate
                                            text-sm
                                            font-semibold
                                            ${amountClassName}
                                        `}
                                    >
                                        {formatCurrency(
                                            transaction.amountCents
                                        )}
                                    </strong>
                                </div>

                                {transaction.notes && (
                                    <p
                                        title={
                                            transaction.notes
                                        }
                                        className="
                                            mt-3
                                            truncate-text-2
                                            text-xs
                                            leading-5
                                            text-muted-foreground
                                        "
                                    >
                                        {
                                            transaction.notes
                                        }
                                    </p>
                                )}

                                <div
                                    className="
                                        mt-auto
                                        flex min-w-0
                                        items-center
                                        justify-between
                                        gap-3
                                        pt-4
                                    "
                                >
                                    <span
                                        className="
                                            min-w-0
                                            truncate
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        {formatDate(
                                            transaction.date
                                        )}
                                    </span>

                                    <ActionButtons
                                        transaction={
                                            transaction
                                        }
                                        singularLabel={
                                            singularLabel
                                        }
                                        deleting={
                                            deleting
                                        }
                                        onEdit={onEdit}
                                        onDelete={
                                            onDelete
                                        }
                                        compact
                                    />
                                </div>
                            </motion.article>
                        );
                    }
                )}
            </AnimatePresence>
        </div>
    );
}

function ActionButtons({
    transaction,
    singularLabel,
    deleting,
    onEdit,
    onDelete,
    compact = false,
}) {
    return (
        <div
            className={`
                flex shrink-0
                items-center gap-1

                ${compact
                    ? ""
                    : "justify-end"
                }
            `}
        >
            <button
                type="button"
                onClick={() =>
                    onEdit?.(
                        transaction
                    )
                }
                disabled={deleting}
                aria-label={`Editar ${singularLabel} ${transaction.description}`}
                title={`Editar ${singularLabel}`}
                className="
                    inline-flex size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-surface-hover
                    hover:text-foreground
                    disabled:pointer-events-none
                    disabled:opacity-40
                "
            >
                <RiEditLine
                    size={17}
                    aria-hidden="true"
                />
            </button>

            <button
                type="button"
                onClick={() =>
                    onDelete?.(
                        transaction
                    )
                }
                disabled={deleting}
                aria-label={`Excluir ${singularLabel} ${transaction.description}`}
                title={`Excluir ${singularLabel}`}
                className="
                    inline-flex size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-danger-muted
                    hover:text-danger
                    disabled:pointer-events-none
                    disabled:opacity-40
                "
            >
                {deleting ? (
                    <RiLoader4Line
                        size={17}
                        aria-hidden="true"
                        className="animate-spin"
                    />
                ) : (
                    <RiDeleteBinLine
                        size={17}
                        aria-hidden="true"
                    />
                )}
            </button>
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    totalItems,
    firstVisibleItem,
    lastVisibleItem,
    pageSize,
    pageSizeOptions,
    paginationItems,
    loading,
    canGoPrevious,
    canGoNext,
    onPageChange,
    onPageSizeChange,
    onPrevious,
    onNext,
}) {
    return (
        <footer
            className="
                flex min-w-0
                flex-col gap-4
                border-t border-border
                px-4 py-4
                sm:px-5
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
        >
            <div
                className="
                    flex min-w-0
                    flex-col gap-3
                    sm:flex-row
                    sm:items-center
                "
            >
                <p
                    className="
                        min-w-0
                        text-xs
                        text-muted-foreground
                        sm:text-sm
                    "
                >
                    Mostrando{" "}
                    <span
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {firstVisibleItem}
                    </span>
                    {"–"}
                    <span
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {lastVisibleItem}
                    </span>{" "}
                    de{" "}
                    <span
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {totalItems}
                    </span>
                </p>

                <div
                    className="
                        flex items-center
                        gap-2
                    "
                >
                    <label
                        htmlFor="transaction-page-size"
                        className="
                            shrink-0
                            text-xs
                            text-muted-foreground
                        "
                    >
                        Itens por página
                    </label>

                    <div
                        className="
                            relative
                            w-20 shrink-0
                        "
                    >
                        <select
                            id="transaction-page-size"
                            value={pageSize}
                            onChange={
                                onPageSizeChange
                            }
                            disabled={loading}
                            className="
                                h-9 w-full
                                appearance-none
                                rounded-lg
                                border border-border
                                bg-background
                                py-1
                                pl-3 pr-8
                                text-xs
                                font-medium
                                text-foreground
                                outline-none
                                transition
                                hover:border-border-strong
                                focus:ring-2
                                focus:ring-ring/15
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {pageSizeOptions.map(
                                (
                                    option
                                ) => (
                                    <option
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                    >
                                        {
                                            option
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <RiArrowDownSLine
                            size={16}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                right-2.5 top-1/2
                                -translate-y-1/2
                                text-muted-foreground
                            "
                        />
                    </div>
                </div>
            </div>

            <nav
                aria-label="Paginação"
                className="
                    flex min-w-0
                    items-center
                    justify-between
                    gap-2
                    sm:justify-end
                "
            >
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={
                        !canGoPrevious
                    }
                    aria-label="Página anterior"
                    title="Página anterior"
                    className="
                        inline-flex size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border border-border
                        bg-surface
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-35
                    "
                >
                    <RiArrowLeftSLine
                        size={20}
                        aria-hidden="true"
                    />
                </button>

                <div
                    className="
                        flex min-w-0
                        items-center gap-1
                    "
                >
                    {paginationItems.map(
                        (
                            item,
                            index
                        ) => {
                            if (
                                typeof item ===
                                "string"
                            ) {
                                return (
                                    <span
                                        key={`${item}-${index}`}
                                        aria-hidden="true"
                                        className="
                                            inline-flex
                                            size-9
                                            items-center
                                            justify-center
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        …
                                    </span>
                                );
                            }

                            const isCurrent =
                                item ===
                                currentPage;

                            return (
                                <button
                                    key={
                                        item
                                    }
                                    type="button"
                                    onClick={() =>
                                        onPageChange(
                                            item
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    aria-label={`Ir para a página ${item}`}
                                    aria-current={
                                        isCurrent
                                            ? "page"
                                            : undefined
                                    }
                                    className={`
                                        inline-flex
                                        size-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        text-xs
                                        font-medium
                                        transition-colors
                                        disabled:pointer-events-none
                                        disabled:opacity-50

                                        ${isCurrent
                                            ? `
                                                    border-primary
                                                    bg-primary
                                                    text-primary-foreground
                                                `
                                            : `
                                                    border-transparent
                                                    bg-surface
                                                    text-muted-foreground
                                                    hover:border-border
                                                    hover:bg-surface-hover
                                                    hover:text-foreground
                                                `
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            );
                        }
                    )}
                </div>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    aria-label="Próxima página"
                    title="Próxima página"
                    className="
                        inline-flex size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border border-border
                        bg-surface
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-35
                    "
                >
                    <RiArrowRightSLine
                        size={20}
                        aria-hidden="true"
                    />
                </button>
            </nav>
        </footer>
    );
}

export default TransactionList;