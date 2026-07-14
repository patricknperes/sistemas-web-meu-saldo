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
                ? "Total de receitas"
                : "Total de despesas"
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
                w-full
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-surface
                shadow-card
            "
        >
            <header
                className="
                    flex
                    min-w-0
                    flex-col
                    gap-4
                    border-b
                    border-border
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >
                <div className="min-w-0">
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
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

                        <span
                            aria-label={`${normalizedTotalItems} registros`}
                            className="
                                shrink-0
                                rounded-md
                                bg-surface-muted
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                                text-muted-foreground
                            "
                        >
                            {normalizedTotalItems}
                        </span>
                    </div>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-muted-foreground
                        "
                    >
                        Visualize e gerencie seus
                        registros.
                    </p>
                </div>

                <div
                    className="
                        min-w-0
                        sm:text-right
                    "
                >
                    <p
                        title={
                            resolvedTotalLabel
                        }
                        className="
                            truncate
                            text-[11px]
                            font-medium
                            text-muted-foreground
                        "
                    >
                        {resolvedTotalLabel}
                    </p>

                    <p
                        title={formatCurrency(
                            totalCents
                        )}
                        className={`
                            mt-0.5
                            truncate
                            text-lg
                            font-semibold
                            tracking-tight

                            ${amountClassName}
                        `}
                    >
                        {formatCurrency(
                            totalCents
                        )}
                    </p>
                </div>
            </header>

            {loading ? (
                <LoadingState />
            ) : transactions.length ===
                0 ? (
                <EmptyState
                    message={
                        resolvedEmptyMessage
                    }
                />
            ) : (
                <TransactionContent
                    transactions={
                        transactions
                    }
                    singularLabel={
                        resolvedSingularLabel
                    }
                    deletingId={
                        deletingId
                    }
                    amountClassName={
                        amountClassName
                    }
                    onEdit={onEdit}
                    onDelete={
                        onDelete
                    }
                />
            )}

            {showPagination && (
                <Pagination
                    currentPage={
                        displayedPage
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

function TransactionContent({
    transactions,
    singularLabel,
    deletingId,
    amountClassName,
    onEdit,
    onDelete,
}) {
    return (
        <div className="min-w-0">
            <div
                className="
                    hidden
                    grid-cols-[minmax(220px,1.8fr)_minmax(120px,0.8fr)_120px_140px_80px]
                    items-center
                    gap-4
                    border-b
                    border-border
                    bg-surface-muted/35
                    px-5
                    py-2.5
                    text-[11px]
                    font-medium
                    text-muted-foreground
                    md:grid
                "
            >
                <span>Descrição</span>

                <span>
                    Categoria
                </span>

                <span>Data</span>

                <span className="text-right">
                    Valor
                </span>

                <span className="text-right">
                    Ações
                </span>
            </div>

            <AnimatePresence
                initial={false}
                mode="popLayout"
            >
                <div
                    className="
                        divide-y
                        divide-border
                    "
                >
                    {transactions.map(
                        (
                            transaction,
                            index
                        ) => {
                            const deleting =
                                deletingId ===
                                transaction.id;

                            return (
                                <TransactionRow
                                    key={
                                        transaction.id
                                    }
                                    transaction={
                                        transaction
                                    }
                                    index={index}
                                    deleting={
                                        deleting
                                    }
                                    singularLabel={
                                        singularLabel
                                    }
                                    amountClassName={
                                        amountClassName
                                    }
                                    onEdit={onEdit}
                                    onDelete={
                                        onDelete
                                    }
                                />
                            );
                        }
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}

function TransactionRow({
    transaction,
    index,
    deleting,
    singularLabel,
    amountClassName,
    onEdit,
    onDelete,
}) {
    const category =
        transaction.category ||
        "Sem categoria";

    return (
        <motion.article
            layout
            initial={{
                opacity: 0,
                y: 4,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                height: 0,
            }}
            transition={{
                duration: 0.18,
                delay: Math.min(
                    index * 0.02,
                    0.12
                ),
            }}
            className="
                group
                min-w-0
                px-4
                py-4
                transition-colors
                hover:bg-surface-muted/25
                sm:px-5
            "
        >
            <div
                className="
                    grid
                    min-w-0
                    gap-3
                    md:grid-cols-[minmax(220px,1.8fr)_minmax(120px,0.8fr)_120px_140px_80px]
                    md:items-center
                    md:gap-4
                "
            >
                <div className="min-w-0">
                    <h3
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
                    </h3>

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

                    <div
                        className="
                            mt-2
                            flex
                            min-w-0
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1
                            text-xs
                            text-muted-foreground
                            md:hidden
                        "
                    >
                        <span
                            title={category}
                            className="
                                max-w-[160px]
                                truncate
                            "
                        >
                            {category}
                        </span>

                        <span
                            aria-hidden="true"
                        >
                            ·
                        </span>

                        <span>
                            {formatDate(
                                transaction.date
                            )}
                        </span>
                    </div>
                </div>

                <span
                    title={category}
                    className="
                        hidden
                        truncate
                        text-sm
                        text-muted-foreground
                        md:block
                    "
                >
                    {category}
                </span>

                <span
                    className="
                        hidden
                        truncate
                        text-sm
                        text-muted-foreground
                        md:block
                    "
                >
                    {formatDate(
                        transaction.date
                    )}
                </span>

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-3
                        md:block
                        md:text-right
                    "
                >
                    <span
                        className="
                            text-xs
                            text-muted-foreground
                            md:hidden
                        "
                    >
                        Valor
                    </span>

                    <strong
                        title={formatCurrency(
                            transaction.amountCents
                        )}
                        className={`
                            min-w-0
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
                />
            </div>
        </motion.article>
    );
}

function ActionButtons({
    transaction,
    singularLabel,
    deleting,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-1
            "
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
                    inline-flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-surface-muted
                    hover:text-foreground
                    disabled:pointer-events-none
                    disabled:opacity-40
                "
            >
                <RiEditLine
                    size={16}
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
                    inline-flex
                    size-8
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
                        size={16}
                        aria-hidden="true"
                        className="
                            animate-spin
                        "
                    />
                ) : (
                    <RiDeleteBinLine
                        size={16}
                        aria-hidden="true"
                    />
                )}
            </button>
        </div>
    );
}

function LoadingState() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="
                divide-y
                divide-border
            "
        >
            {Array.from({
                length: 5,
            }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="
                            grid
                            animate-pulse
                            gap-3
                            px-4
                            py-4
                            sm:px-5
                            md:grid-cols-[minmax(220px,1.8fr)_minmax(120px,0.8fr)_120px_140px_80px]
                            md:items-center
                            md:gap-4
                        "
                    >
                        <div
                            className="
                                min-w-0
                            "
                        >
                            <div
                                className="
                                    h-4
                                    w-2/3
                                    rounded
                                    bg-surface-muted
                                "
                            />

                            <div
                                className="
                                    mt-2
                                    h-3
                                    w-1/2
                                    rounded
                                    bg-surface-muted
                                "
                            />
                        </div>

                        <div
                            className="
                                hidden
                                h-4
                                w-20
                                rounded
                                bg-surface-muted
                                md:block
                            "
                        />

                        <div
                            className="
                                hidden
                                h-4
                                w-16
                                rounded
                                bg-surface-muted
                                md:block
                            "
                        />

                        <div
                            className="
                                h-4
                                w-24
                                rounded
                                bg-surface-muted
                                md:ml-auto
                            "
                        />

                        <div
                            className="
                                hidden
                                h-8
                                w-16
                                rounded-lg
                                bg-surface-muted
                                md:block
                            "
                        />
                    </div>
                )
            )}

            <span className="sr-only">
                Carregando transações...
            </span>
        </div>
    );
}

function EmptyState({
    message,
}) {
    return (
        <div
            className="
                flex
                min-h-64
                flex-col
                items-center
                justify-center
                px-5
                py-12
                text-center
            "
        >
            <span
                className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-surface-muted
                    text-muted-foreground
                "
            >
                <RiFileList3Line
                    size={19}
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
                Nenhum registro encontrado
            </h3>

            <p
                className="
                    mt-1.5
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

function Pagination({
    currentPage,
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
                flex
                min-w-0
                flex-col
                gap-4
                border-t
                border-border
                px-4
                py-3.5
                sm:px-5
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
        >
            <div
                className="
                    flex
                    min-w-0
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                "
            >
                <p
                    className="
                        text-xs
                        text-muted-foreground
                    "
                >
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
                    </span>

                    {" de "}

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
                        hidden
                        h-4
                        w-px
                        bg-border
                        sm:block
                    "
                />

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <label
                        htmlFor="transaction-page-size"
                        className="
                            text-xs
                            text-muted-foreground
                        "
                    >
                        Por página
                    </label>

                    <div
                        className="
                            relative
                            w-16
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
                                h-8
                                w-full
                                appearance-none
                                rounded-lg
                                border
                                border-border
                                bg-background
                                pl-2.5
                                pr-7
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
                            size={14}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                right-2
                                top-1/2
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
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-1
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
                        inline-flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-muted
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    <RiArrowLeftSLine
                        size={18}
                        aria-hidden="true"
                    />
                </button>

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
                                        size-8
                                        items-center
                                        justify-center
                                        text-xs
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
                                key={item}
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
                                    size-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-xs
                                    font-medium
                                    transition-colors
                                    disabled:pointer-events-none
                                    disabled:opacity-50

                                    ${isCurrent
                                        ? `
                                                bg-primary
                                                text-primary-foreground
                                            `
                                        : `
                                                text-muted-foreground
                                                hover:bg-surface-muted
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

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    aria-label="Próxima página"
                    title="Próxima página"
                    className="
                        inline-flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-muted
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    <RiArrowRightSLine
                        size={18}
                        aria-hidden="true"
                    />
                </button>
            </nav>
        </footer>
    );
}

export default TransactionList;