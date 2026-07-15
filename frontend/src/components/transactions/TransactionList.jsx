import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownCircleLine,
    RiArrowDownSLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowUpCircleLine,
    RiCalendarLine,
    RiDeleteBinLine,
    RiEditLine,
    RiFileList3Line,
    RiLoader4Line,
    RiPriceTag3Line,
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

const TYPE_STYLES = {
    INCOME: {
        label: "Receita",
        sign: "+",
        HeaderIcon: RiArrowUpCircleLine,

        heroGradient:
            "from-emerald-500 via-emerald-600 to-teal-700",

        heroShadow:
            "shadow-emerald-500/15",

        heroRing:
            "ring-emerald-400/20",

        softBackground:
            "bg-emerald-500/[0.045]",

        softGradient:
            "from-emerald-500/12 via-emerald-500/[0.035] to-transparent",

        icon:
            "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400",

        badge:
            "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",

        amount:
            "text-emerald-600 dark:text-emerald-400",

        rowAccent:
            "bg-emerald-500",

        rowHover:
            "hover:bg-emerald-500/[0.035]",

        pageActive:
            "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20",

        focusRing:
            "focus-visible:ring-emerald-500/25",
    },

    EXPENSE: {
        label: "Despesa",
        sign: "−",
        HeaderIcon: RiArrowDownCircleLine,

        heroGradient:
            "from-rose-500 via-rose-600 to-red-700",

        heroShadow:
            "shadow-rose-500/15",

        heroRing:
            "ring-rose-400/20",

        softBackground:
            "bg-rose-500/[0.045]",

        softGradient:
            "from-rose-500/12 via-rose-500/[0.035] to-transparent",

        icon:
            "bg-rose-500/12 text-rose-600 ring-1 ring-inset ring-rose-500/15 dark:text-rose-400",

        badge:
            "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",

        amount:
            "text-rose-600 dark:text-rose-400",

        rowAccent:
            "bg-rose-500",

        rowHover:
            "hover:bg-rose-500/[0.035]",

        pageActive:
            "border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20",

        focusRing:
            "focus-visible:ring-rose-500/25",
    },
};

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
    const normalizedType =
        type === "EXPENSE"
            ? "EXPENSE"
            : "INCOME";

    const styles =
        TYPE_STYLES[normalizedType];

    const isIncome =
        normalizedType === "INCOME";

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
        normalizedTotalItems >
        Math.min(
            ...pageSizeOptions
        );

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

    const recordsLabel =
        normalizedTotalItems === 1
            ? resolvedSingularLabel
            : resolvedPluralLabel;

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
            aria-busy={loading}
            className="
                w-full
                min-w-0
                overflow-hidden
                rounded-[28px]
                border
                border-border
                bg-surface
                shadow-card
            "
        >
            <TransactionHeader
                title={title}
                totalItems={
                    normalizedTotalItems
                }
                recordsLabel={
                    recordsLabel
                }
                totalLabel={
                    resolvedTotalLabel
                }
                totalCents={totalCents}
                styles={styles}
            />

            <div
                className="
                    min-w-0
                    bg-surface
                "
            >
                {loading ? (
                    <LoadingState
                        styles={styles}
                    />
                ) : transactions.length ===
                    0 ? (
                    <EmptyState
                        message={
                            resolvedEmptyMessage
                        }
                        singularLabel={
                            resolvedSingularLabel
                        }
                        styles={styles}
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
                        styles={styles}
                        onEdit={onEdit}
                        onDelete={
                            onDelete
                        }
                    />
                )}
            </div>

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
                    styles={styles}
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

function TransactionHeader({
    title,
    totalItems,
    recordsLabel,
    totalLabel,
    totalCents,
    styles,
}) {
    const HeaderIcon =
        styles.HeaderIcon;

    return (
        <header
            className={`
                relative
                isolate
                min-w-0
                overflow-hidden
                bg-gradient-to-br
                px-5 py-6
                text-white
                shadow-xl
                sm:px-6
                sm:py-7
                lg:px-7

                ${styles.heroGradient}
                ${styles.heroShadow}
            `}
        >
            <div
                aria-hidden="true"
                className="
                    absolute
                    -right-12 -top-16
                    size-48
                    rounded-full
                    bg-white/10
                    blur-2xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    -bottom-24 left-1/3
                    size-56
                    rounded-full
                    bg-black/10
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    right-8 top-7
                    hidden size-28
                    rounded-full
                    border
                    border-white/10
                    sm:block
                "
            />

            <div
                className="
                    relative
                    z-10
                    grid
                    min-w-0
                    gap-6
                    lg:grid-cols-[minmax(0,1fr)_auto]
                    lg:items-end
                "
            >
                <div className="min-w-0">
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <span
                            className={`
                                flex size-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-white/15
                                text-white
                                ring-1
                                ring-inset
                                backdrop-blur-sm

                                ${styles.heroRing}
                            `}
                        >
                            <HeaderIcon
                                size={22}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <h2
                                    title={title}
                                    className="
                                        truncate
                                        text-xl
                                        font-semibold
                                        tracking-tight
                                        sm:text-2xl
                                    "
                                >
                                    {title}
                                </h2>

                                <span
                                    aria-label={`${totalItems} registros`}
                                    className="
                                        inline-flex
                                        h-6
                                        shrink-0
                                        items-center
                                        rounded-full
                                        bg-white/15
                                        px-2.5
                                        text-[11px]
                                        font-semibold
                                        tabular-nums
                                        text-white
                                        ring-1
                                        ring-inset
                                        ring-white/15
                                        backdrop-blur-sm
                                    "
                                >
                                    {totalItems}
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1.5
                                    max-w-xl
                                    text-sm
                                    leading-5
                                    text-white/75
                                "
                            >
                                {totalItems > 0
                                    ? `${totalItems} ${recordsLabel} no período selecionado.`
                                    : "Os lançamentos adicionados aparecerão organizados aqui."
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="
                        min-w-0
                        rounded-2xl
                        border
                        border-white/15
                        bg-white/10
                        px-4 py-3.5
                        backdrop-blur-md
                        sm:min-w-64
                        lg:text-right
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            lg:justify-end
                        "
                    >
                        <RiWallet3Line
                            size={15}
                            aria-hidden="true"
                            className="
                                shrink-0
                                text-white/70
                            "
                        />

                        <p
                            title={totalLabel}
                            className="
                                truncate
                                text-xs
                                font-medium
                                text-white/70
                            "
                        >
                            {totalLabel}
                        </p>
                    </div>

                    <strong
                        title={formatCurrency(
                            totalCents
                        )}
                        className="
                            mt-1
                            block
                            truncate
                            text-2xl
                            font-semibold
                            tracking-tight
                            tabular-nums
                            text-white
                            sm:text-3xl
                        "
                    >
                        {formatCurrency(
                            totalCents
                        )}
                    </strong>
                </div>
            </div>
        </header>
    );
}

function TransactionContent({
    transactions,
    singularLabel,
    deletingId,
    styles,
    onEdit,
    onDelete,
}) {
    return (
        <div className="min-w-0">
            <TransactionTableHeader />

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
                        ) => (
                            <TransactionRow
                                key={
                                    transaction.id
                                }
                                transaction={
                                    transaction
                                }
                                index={index}
                                deleting={
                                    deletingId ===
                                    transaction.id
                                }
                                singularLabel={
                                    singularLabel
                                }
                                styles={styles}
                                onEdit={onEdit}
                                onDelete={
                                    onDelete
                                }
                            />
                        )
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}

function TransactionTableHeader() {
    return (
        <div
            className="
                hidden
                grid-cols-[minmax(230px,1.7fr)_minmax(130px,0.8fr)_135px_160px_96px]
                items-center
                gap-5
                border-b
                border-border
                bg-surface-muted/55
                px-6
                py-3.5
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
                md:grid
            "
        >
            <span>Movimentação</span>

            <span>Categoria</span>

            <span>Data</span>

            <span className="text-right">
                Valor
            </span>

            <span className="text-right">
                Ações
            </span>
        </div>
    );
}

function TransactionRow({
    transaction,
    index,
    deleting,
    singularLabel,
    styles,
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
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                x: -12,
                height: 0,
            }}
            transition={{
                duration: 0.22,
                delay: Math.min(
                    index * 0.025,
                    0.15
                ),
            }}
            className={`
                group
                relative
                min-w-0
                px-4 py-4
                transition-colors
                sm:px-6

                ${styles.rowHover}
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    absolute
                    bottom-3 left-0 top-3
                    w-1
                    rounded-r-full
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100

                    ${styles.rowAccent}
                `}
            />

            <div
                className="
                    grid
                    min-w-0
                    gap-4
                    md:grid-cols-[minmax(230px,1.7fr)_minmax(130px,0.8fr)_135px_160px_96px]
                    md:items-center
                    md:gap-5
                "
            >
                <TransactionDescription
                    transaction={
                        transaction
                    }
                    category={category}
                    styles={styles}
                />

                <div
                    className="
                        hidden
                        min-w-0
                        md:block
                    "
                >
                    <CategoryBadge
                        category={category}
                        styles={styles}
                    />
                </div>

                <div
                    className="
                        hidden
                        min-w-0
                        items-center
                        gap-2
                        text-sm
                        text-muted-foreground
                        md:flex
                    "
                >
                    <RiCalendarLine
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span
                        className="
                            truncate
                            tabular-nums
                        "
                    >
                        {formatDate(
                            transaction.date
                        )}
                    </span>
                </div>

                <TransactionAmount
                    amountCents={
                        transaction.amountCents
                    }
                    styles={styles}
                />

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
                    styles={styles}
                    onEdit={onEdit}
                    onDelete={
                        onDelete
                    }
                />
            </div>
        </motion.article>
    );
}

function TransactionDescription({
    transaction,
    category,
    styles,
}) {
    const HeaderIcon =
        styles.HeaderIcon;

    return (
        <div
            className="
                flex
                min-w-0
                items-start
                gap-3
            "
        >
            <span
                className={`
                    flex size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl

                    ${styles.icon}
                `}
            >
                <HeaderIcon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0 flex-1">
                <h3
                    title={
                        transaction.description
                    }
                    className="
                        truncate
                        text-sm
                        font-semibold
                        text-foreground
                        sm:text-[15px]
                    "
                >
                    {transaction.description}
                </h3>

                {transaction.notes ? (
                    <p
                        title={
                            transaction.notes
                        }
                        className="
                            mt-1
                            line-clamp-1
                            text-xs
                            leading-5
                            text-muted-foreground
                        "
                    >
                        {transaction.notes}
                    </p>
                ) : (
                    <p
                        className="
                            mt-1
                            text-xs
                            text-muted-foreground/70
                        "
                    >
                        Sem observações adicionais
                    </p>
                )}

                <div
                    className="
                        mt-2.5
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        gap-2
                        md:hidden
                    "
                >
                    <CategoryBadge
                        category={category}
                        styles={styles}
                        compact
                    />

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            tabular-nums
                            text-muted-foreground
                        "
                    >
                        <RiCalendarLine
                            size={13}
                            aria-hidden="true"
                        />

                        {formatDate(
                            transaction.date
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

function CategoryBadge({
    category,
    styles,
    compact = false,
}) {
    return (
        <span
            title={category}
            className={`
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-full
                font-medium

                ${compact
                    ? "px-2 py-1 text-[11px]"
                    : "px-2.5 py-1.5 text-xs"
                }

                ${styles.badge}
            `}
        >
            <RiPriceTag3Line
                size={compact
                    ? 12
                    : 13
                }
                aria-hidden="true"
                className="shrink-0"
            />

            <span className="truncate">
                {category}
            </span>
        </span>
    );
}

function TransactionAmount({
    amountCents,
    styles,
}) {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-3
                rounded-2xl
                bg-surface-muted/55
                px-3.5 py-3
                md:block
                md:bg-transparent
                md:p-0
                md:text-right
            "
        >
            <span
                className="
                    text-xs
                    font-medium
                    text-muted-foreground
                    md:hidden
                "
            >
                Valor da movimentação
            </span>

            <div className="min-w-0">
                <strong
                    title={formatCurrency(
                        amountCents
                    )}
                    className={`
                        block
                        min-w-0
                        truncate
                        text-base
                        font-semibold
                        tracking-tight
                        tabular-nums
                        sm:text-lg

                        ${styles.amount}
                    `}
                >
                    {styles.sign}{" "}
                    {formatCurrency(
                        Math.abs(
                            normalizeNumber(
                                amountCents
                            )
                        )
                    )}
                </strong>

                <span
                    className="
                        mt-0.5
                        hidden
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.08em]
                        text-muted-foreground
                        md:block
                    "
                >
                    {styles.label}
                </span>
            </div>
        </div>
    );
}

function ActionButtons({
    transaction,
    singularLabel,
    deleting,
    styles,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-2
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
                className={`
                    inline-flex
                    h-10
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    px-3
                    text-xs
                    font-medium
                    text-muted-foreground
                    transition
                    hover:border-primary/25
                    hover:bg-primary-muted
                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    disabled:pointer-events-none
                    disabled:opacity-40
                    md:size-10
                    md:flex-none
                    md:px-0

                    ${styles.focusRing}
                `}
            >
                <RiEditLine
                    size={17}
                    aria-hidden="true"
                />

                <span className="md:sr-only">
                    Editar
                </span>
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
                    h-10
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-rose-500/10
                    bg-rose-500/[0.045]
                    px-3
                    text-xs
                    font-medium
                    text-rose-600
                    transition
                    hover:border-rose-500/20
                    hover:bg-rose-500/10
                    hover:text-rose-700
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-500/25
                    disabled:pointer-events-none
                    disabled:opacity-40
                    dark:text-rose-400
                    dark:hover:text-rose-300
                    md:size-10
                    md:flex-none
                    md:px-0
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

                <span className="md:sr-only">
                    {deleting
                        ? "Excluindo"
                        : "Excluir"
                    }
                </span>
            </button>
        </div>
    );
}

function LoadingState({
    styles,
}) {
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
                            gap-4
                            px-4 py-4
                            sm:px-6
                            md:grid-cols-[minmax(230px,1.7fr)_minmax(130px,0.8fr)_135px_160px_96px]
                            md:items-center
                            md:gap-5
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className={`
                                    size-10
                                    shrink-0
                                    rounded-2xl

                                    ${styles.softBackground}
                                `}
                            />

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        h-4
                                        w-2/3
                                        rounded-full
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        mt-2
                                        h-3
                                        w-1/2
                                        rounded-full
                                        bg-surface-muted
                                    "
                                />
                            </div>
                        </div>

                        <div
                            className="
                                hidden
                                h-7
                                w-24
                                rounded-full
                                bg-surface-muted
                                md:block
                            "
                        />

                        <div
                            className="
                                hidden
                                h-4
                                w-20
                                rounded-full
                                bg-surface-muted
                                md:block
                            "
                        />

                        <div
                            className="
                                h-5
                                w-28
                                rounded-full
                                bg-surface-muted
                                md:ml-auto
                            "
                        />

                        <div
                            className="
                                hidden
                                h-10
                                w-[88px]
                                rounded-xl
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
    singularLabel,
    styles,
}) {
    const HeaderIcon =
        styles.HeaderIcon;

    return (
        <div
            className={`
                relative
                flex min-h-80
                flex-col
                items-center
                justify-center
                overflow-hidden
                px-5 py-16
                text-center
                bg-gradient-to-b

                ${styles.softGradient}
            `}
        >
            <div
                aria-hidden="true"
                className="
                    absolute
                    left-1/2 top-1/2
                    size-44
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-current
                    opacity-[0.025]
                    blur-3xl
                "
            />

            <span
                className={`
                    relative
                    flex size-16
                    items-center
                    justify-center
                    rounded-3xl

                    ${styles.icon}
                `}
            >
                <HeaderIcon
                    size={28}
                    aria-hidden="true"
                />
            </span>

            <h3
                className="
                    relative
                    mt-5
                    text-base
                    font-semibold
                    text-foreground
                "
            >
                Nenhuma {singularLabel} encontrada
            </h3>

            <p
                className="
                    relative
                    mt-1.5
                    max-w-sm
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >
                {message}
            </p>

            <div
                className={`
                    relative
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-3 py-1.5
                    text-xs
                    font-medium

                    ${styles.badge}
                `}
            >
                <RiFileList3Line
                    size={14}
                    aria-hidden="true"
                />

                Ajuste os filtros ou adicione um novo registro
            </div>
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
    styles,
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
                bg-surface-muted/35
                px-4 py-4
                sm:px-6
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
                    Exibindo{" "}
                    <span
                        className="
                            font-semibold
                            tabular-nums
                            text-foreground
                        "
                    >
                        {firstVisibleItem}
                    </span>

                    {"–"}

                    <span
                        className="
                            font-semibold
                            tabular-nums
                            text-foreground
                        "
                    >
                        {lastVisibleItem}
                    </span>

                    {" de "}

                    <span
                        className="
                            font-semibold
                            tabular-nums
                            text-foreground
                        "
                    >
                        {totalItems}
                    </span>

                    {" registros"}
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
                            w-[68px]
                        "
                    >
                        <select
                            id="transaction-page-size"
                            value={pageSize}
                            onChange={
                                onPageSizeChange
                            }
                            disabled={loading}
                            className={`
                                h-9
                                w-full
                                appearance-none
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                pl-3 pr-7
                                text-xs
                                font-semibold
                                text-foreground
                                outline-none
                                transition
                                hover:border-border-strong
                                focus:border-border-strong
                                focus:ring-2
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                ${styles.focusRing}
                            `}
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
                                right-2.5
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
                    overflow-x-auto
                    sm:justify-end
                "
            >
                <PaginationArrow
                    direction="previous"
                    disabled={
                        !canGoPrevious
                    }
                    onClick={onPrevious}
                    styles={styles}
                />

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
                                        shrink-0
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
                                    size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    text-xs
                                    font-semibold
                                    tabular-nums
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    disabled:pointer-events-none
                                    disabled:opacity-50

                                    ${styles.focusRing}

                                    ${isCurrent
                                        ? styles.pageActive
                                        : `
                                                border-transparent
                                                text-muted-foreground
                                                hover:border-border
                                                hover:bg-surface
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

                <PaginationArrow
                    direction="next"
                    disabled={!canGoNext}
                    onClick={onNext}
                    styles={styles}
                />
            </nav>
        </footer>
    );
}

function PaginationArrow({
    direction,
    disabled,
    onClick,
    styles,
}) {
    const isPrevious =
        direction === "previous";

    const Icon =
        isPrevious
            ? RiArrowLeftSLine
            : RiArrowRightSLine;

    const label =
        isPrevious
            ? "Página anterior"
            : "Próxima página";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`
                inline-flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-surface
                text-muted-foreground
                transition
                hover:border-border-strong
                hover:bg-surface-hover
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                disabled:pointer-events-none
                disabled:opacity-30

                ${styles.focusRing}
            `}
        >
            <Icon
                size={18}
                aria-hidden="true"
            />
        </button>
    );
}

export default TransactionList;