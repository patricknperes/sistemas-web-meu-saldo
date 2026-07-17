import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCalendarLine,
    RiDeleteBinLine,
    RiEditLine,
    RiFileList3Line,
    RiLoader4Line,
    RiPriceTag3Line,
    RiRepeat2Line,
} from "react-icons/ri";

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const TYPE_STYLES = Object.freeze({
    INCOME: {
        amount:
            "text-emerald-600 dark:text-emerald-400",

        icon:
            "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400",

        recurringBadge:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",

        pageActive:
            "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500",

        focusRing:
            "focus-visible:ring-emerald-500/20",
    },

    EXPENSE: {
        amount:
            "text-rose-600 dark:text-rose-400",

        icon:
            "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400",

        recurringBadge:
            "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",

        pageActive:
            "border-rose-600 bg-rose-600 text-white dark:border-rose-500 dark:bg-rose-500",

        focusRing:
            "focus-visible:ring-rose-500/20",
    },
});

function normalizeNumber(
    value,
    fallbackValue = 0,
) {
    const normalizedValue =
        Number(value);

    return Number.isFinite(
        normalizedValue,
    )
        ? normalizedValue
        : fallbackValue;
}

function normalizeTransactionType(
    value,
) {
    return value === "EXPENSE"
        ? "EXPENSE"
        : "INCOME";
}

function extractTransactionTags(
    transaction,
) {
    if (
        !Array.isArray(
            transaction?.tags,
        )
    ) {
        return [];
    }

    const tagsById =
        new Map();

    for (
        const item of
        transaction.tags
    ) {
        const tag =
            item?.tag &&
                typeof item.tag ===
                "object"
                ? item.tag
                : item;

        const tagId =
            Number(tag?.id);

        if (
            !Number.isInteger(tagId) ||
            tagId <= 0
        ) {
            continue;
        }

        tagsById.set(tagId, {
            ...tag,
            id: tagId,
        });
    }

    return Array.from(
        tagsById.values(),
    );
}

function isGeneratedByRecurrence(
    transaction,
) {
    return Boolean(
        transaction
            ?.recurringTransactionId ||
        transaction
            ?.recurringTransaction
            ?.id ||
        transaction
            ?.occurrenceDate,
    );
}

function getTransactionDate(
    transaction,
) {
    return (
        transaction?.date ??
        transaction?.occurrenceDate ??
        ""
    );
}

function getPaginationItems(
    currentPage,
    totalPages,
) {
    if (totalPages <= 3) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) =>
                index + 1,
        );
    }

    if (currentPage <= 2) {
        return [
            1,
            2,
            3,
        ];
    }

    if (
        currentPage >=
        totalPages - 1
    ) {
        return [
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ];
}

function TransactionList({
    transactions = [],
    type = "INCOME",

    title = "Lançamentos",
    singularLabel,
    pluralLabel,
    emptyMessage,

    loading = false,
    deletingId = null,

    pagination = {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    },

    currentPage = 1,

    onEdit,
    onDelete,

    onPageChange,
    onPreviousPage,
    onNextPage,
}) {
    const normalizedType =
        normalizeTransactionType(
            type,
        );

    const styles =
        TYPE_STYLES[
        normalizedType
        ];

    const isIncome =
        normalizedType ===
        "INCOME";

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
        `Nenhuma ${resolvedSingularLabel} encontrada.`;

    const totalItems =
        Math.max(
            0,
            Math.trunc(
                normalizeNumber(
                    pagination
                        ?.totalItems,
                    transactions.length,
                ),
            ),
        );

    const totalPages =
        Math.max(
            0,
            Math.trunc(
                normalizeNumber(
                    pagination
                        ?.totalPages,
                    totalItems > 0
                        ? 1
                        : 0,
                ),
            ),
        );

    const displayedPage =
        Math.min(
            Math.max(
                1,
                Math.trunc(
                    normalizeNumber(
                        pagination?.page,
                        currentPage,
                    ),
                ),
            ),
            Math.max(
                totalPages,
                1,
            ),
        );

    const canGoPrevious =
        displayedPage > 1 &&
        !loading;

    const canGoNext =
        displayedPage <
        totalPages &&
        !loading;

    const paginationItems =
        getPaginationItems(
            displayedPage,
            totalPages,
        );

    const recordsLabel =
        totalItems === 1
            ? resolvedSingularLabel
            : resolvedPluralLabel;

    function handlePageChange(
        nextPage,
    ) {
        if (
            loading ||
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage ===
            displayedPage
        ) {
            return;
        }

        onPageChange?.(
            nextPage,
        );
    }

    function handlePreviousPage() {
        if (!canGoPrevious) {
            return;
        }

        if (onPreviousPage) {
            onPreviousPage();
            return;
        }

        handlePageChange(
            displayedPage - 1,
        );
    }

    function handleNextPage() {
        if (!canGoNext) {
            return;
        }

        if (onNextPage) {
            onNextPage();
            return;
        }

        handlePageChange(
            displayedPage + 1,
        );
    }

    return (
        <section
            aria-busy={loading}
            className="
                min-w-0
                overflow-hidden
                rounded-3xl
                border border-border
                bg-surface
                shadow-card
            "
        >
            <header
                className="
                    flex
                    min-w-0
                    items-start
                    justify-between
                    gap-4
                    border-b border-border
                    px-4 py-4
                    sm:items-center
                    sm:px-5
                "
            >
                <div
                    className="
                        flex min-w-0
                        items-start
                        gap-3
                    "
                >
                    <div
                        className={`
                            inline-flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border

                            ${styles.icon}
                        `}
                    >
                        <RiFileList3Line
                            size={19}
                            aria-hidden="true"
                        />
                    </div>

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
                                    text-sm
                                    font-semibold
                                    text-foreground
                                    sm:text-base
                                "
                            >
                                {title}
                            </h2>

                            <span
                                aria-label={`${totalItems} registros`}
                                className="
                                    inline-flex
                                    min-w-6
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border border-border
                                    bg-background
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-semibold
                                    tabular-nums
                                    text-muted-foreground
                                "
                            >
                                {totalItems}
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            {totalItems > 0
                                ? `${totalItems} ${recordsLabel} encontrada${totalItems === 1 ? "" : "s"}.`
                                : "Os lançamentos cadastrados aparecerão aqui."
                            }
                        </p>
                    </div>
                </div>
            </header>

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

            {!loading &&
                totalPages > 1 && (
                    <Pagination
                        currentPage={
                            displayedPage
                        }
                        totalPages={
                            totalPages
                        }
                        totalItems={
                            totalItems
                        }
                        paginationItems={
                            paginationItems
                        }
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
                        onPreviousPage={
                            handlePreviousPage
                        }
                        onNextPage={
                            handleNextPage
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
    styles,
    onEdit,
    onDelete,
}) {
    return (
        <div className="min-w-0">
            <TransactionTableHeader />

            <div
                className="
                    divide-y
                    divide-border
                "
            >
                <AnimatePresence
                    initial={false}
                    mode="popLayout"
                >
                    {transactions.map(
                        (
                            transaction,
                            index,
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
                                onEdit={
                                    onEdit
                                }
                                onDelete={
                                    onDelete
                                }
                            />
                        ),
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TransactionTableHeader() {
    return (
        <div
            className="
                hidden
                grid-cols-[minmax(220px,1.6fr)_minmax(160px,1fr)_125px_145px_90px]
                items-center
                gap-4
                border-b border-border
                bg-surface-muted/35
                px-5 py-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-muted-foreground
                md:grid
            "
        >
            <span>
                Movimentação
            </span>

            <span>
                Organização
            </span>

            <span>
                Data
            </span>

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
    const tags =
        extractTransactionTags(
            transaction,
        );

    const generatedByRecurrence =
        isGeneratedByRecurrence(
            transaction,
        );

    const transactionDate =
        getTransactionDate(
            transaction,
        );

    return (
        <motion.article
            layout
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity:
                    deleting
                        ? 0.5
                        : 1,

                y: 0,
            }}
            exit={{
                opacity: 0,
                x: -10,
                height: 0,
            }}
            transition={{
                duration: 0.2,

                delay: Math.min(
                    index * 0.02,
                    0.12,
                ),
            }}
            className="
                group
                min-w-0
                px-4 py-4
                transition-colors
                hover:bg-surface-muted/25
                sm:px-5
                md:py-3.5
            "
        >
            <div
                className="
                    grid
                    min-w-0
                    gap-4
                    md:grid-cols-[minmax(220px,1.6fr)_minmax(160px,1fr)_125px_145px_90px]
                    md:items-center
                "
            >
                <TransactionDescription
                    transaction={
                        transaction
                    }
                    generatedByRecurrence={
                        generatedByRecurrence
                    }
                    styles={styles}
                />

                <TransactionTags
                    tags={tags}
                    category={
                        transaction.category
                    }
                />

                <TransactionDate
                    value={
                        transactionDate
                    }
                />

                <TransactionAmount
                    amountCents={
                        transaction
                            .amountCents
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
                    generatedByRecurrence={
                        generatedByRecurrence
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
    generatedByRecurrence,
    styles,
}) {
    return (
        <div className="min-w-0">
            <div
                className="
                    flex
                    min-w-0
                    items-start
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <h3
                        title={
                            transaction
                                .description
                        }
                        className="
                            truncate
                            text-sm
                            font-semibold
                            leading-5
                            text-foreground
                        "
                    >
                        {
                            transaction
                                .description
                        }
                    </h3>

                    {generatedByRecurrence && (
                        <span
                            title="Essa movimentação foi criada automaticamente por uma regra recorrente."
                            className={`
                                mt-1.5
                                inline-flex
                                max-w-full
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-2 py-0.5
                                text-[10px]
                                font-semibold

                                ${styles.recurringBadge}
                            `}
                        >
                            <RiRepeat2Line
                                size={12}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            <span className="truncate">
                                Gerada automaticamente
                            </span>
                        </span>
                    )}

                    {transaction.notes && (
                        <p
                            title={
                                transaction
                                    .notes
                            }
                            className="
                                mt-1.5
                                line-clamp-2
                                text-xs
                                leading-5
                                text-muted-foreground
                                md:truncate
                            "
                        >
                            {
                                transaction
                                    .notes
                            }
                        </p>
                    )}
                </div>

                <strong
                    title={formatCurrency(
                        transaction
                            .amountCents,
                    )}
                    className={`
                        shrink-0
                        text-sm
                        font-semibold
                        tabular-nums
                        md:hidden

                        ${styles.amount}
                    `}
                >
                    {formatCurrency(
                        transaction
                            .amountCents,
                    )}
                </strong>
            </div>
        </div>
    );
}

function TransactionTags({
    tags,
    category,
}) {
    if (tags.length === 0) {
        return (
            <div
                className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    md:block
                "
            >
                <span
                    className="
                        text-xs
                        text-muted-foreground
                        md:hidden
                    "
                >
                    Organização
                </span>

                <span
                    title={
                        category ||
                        "Sem tags"
                    }
                    className="
                        inline-flex
                        max-w-[70%]
                        items-center
                        gap-1.5
                        truncate
                        rounded-full
                        border border-border
                        bg-background
                        px-2.5 py-1
                        text-[10px]
                        font-semibold
                        text-muted-foreground
                        md:max-w-full
                    "
                >
                    <RiPriceTag3Line
                        size={12}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    {category ||
                        "Sem tags"}
                </span>
            </div>
        );
    }

    const visibleTags =
        tags.slice(0, 2);

    const hiddenTagCount =
        tags.length -
        visibleTags.length;

    return (
        <div
            className="
                flex
                min-w-0
                items-start
                justify-between
                gap-3
                md:block
            "
        >
            <span
                className="
                    pt-1
                    text-xs
                    text-muted-foreground
                    md:hidden
                "
            >
                Tags
            </span>

            <div
                className="
                    flex
                    max-w-[72%]
                    flex-wrap
                    justify-end
                    gap-1.5
                    md:max-w-full
                    md:justify-start
                "
            >
                {visibleTags.map(
                    (tag) => (
                        <span
                            key={
                                tag.id
                            }
                            title={
                                tag.name
                            }
                            className="
                                inline-flex
                                max-w-36
                                items-center
                                gap-1.5
                                rounded-full
                                border border-border
                                bg-background
                                px-2.5 py-1
                                text-[10px]
                                font-semibold
                                text-foreground
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    size-1.5
                                    shrink-0
                                    rounded-full
                                "
                                style={{
                                    backgroundColor:
                                        tag.color ??
                                        "#64748B",
                                }}
                            />

                            <span className="truncate">
                                {tag.name}
                            </span>
                        </span>
                    ),
                )}

                {hiddenTagCount >
                    0 && (
                        <span
                            title={`${hiddenTagCount} tags adicionais`}
                            className="
                            inline-flex
                            items-center
                            rounded-full
                            border border-border
                            bg-surface-muted/50
                            px-2.5 py-1
                            text-[10px]
                            font-semibold
                            text-muted-foreground
                        "
                        >
                            +{hiddenTagCount}
                        </span>
                    )}
            </div>
        </div>
    );
}

function TransactionDate({
    value,
}) {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-3
                md:justify-start
            "
        >
            <span
                className="
                    text-xs
                    text-muted-foreground
                    md:hidden
                "
            >
                Data
            </span>

            <time
                dateTime={value}
                className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-2
                    truncate
                    text-sm
                    tabular-nums
                    text-muted-foreground
                "
            >
                <RiCalendarLine
                    size={14}
                    aria-hidden="true"
                    className="
                        hidden
                        shrink-0
                        md:block
                    "
                />

                <span className="truncate">
                    {value
                        ? formatDate(value)
                        : "Não informada"
                    }
                </span>
            </time>
        </div>
    );
}

function TransactionAmount({
    amountCents,
    styles,
}) {
    return (
        <strong
            title={formatCurrency(
                amountCents,
            )}
            className={`
                hidden
                min-w-0
                truncate
                text-right
                text-sm
                font-semibold
                tabular-nums
                md:block

                ${styles.amount}
            `}
        >
            {formatCurrency(
                amountCents,
            )}
        </strong>
    );
}

function ActionButtons({
    transaction,
    singularLabel,
    generatedByRecurrence,
    deleting,
    styles,
    onEdit,
    onDelete,
}) {
    const editLabel =
        generatedByRecurrence
            ? "Editar somente esta ocorrência"
            : `Editar ${singularLabel}`;

    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-2
                border-t border-border
                pt-3
                md:border-0
                md:pt-0
            "
        >
            <button
                type="button"
                onClick={() =>
                    onEdit?.(
                        transaction,
                    )
                }
                disabled={deleting}
                aria-label={
                    editLabel
                }
                title={
                    editLabel
                }
                className={`
                    inline-flex
                    size-9
                    items-center
                    justify-center
                    rounded-xl
                    border border-border
                    bg-background
                    text-muted-foreground
                    transition
                    hover:border-border-strong
                    hover:bg-surface-hover
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-4
                    disabled:pointer-events-none
                    disabled:opacity-45

                    ${styles.focusRing}
                `}
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
                        transaction,
                    )
                }
                disabled={deleting}
                aria-label={`Excluir ${singularLabel}`}
                title={`Excluir ${singularLabel}`}
                className="
                    inline-flex
                    size-9
                    items-center
                    justify-center
                    rounded-xl
                    border border-border
                    bg-background
                    text-muted-foreground
                    transition
                    hover:border-danger/30
                    hover:bg-danger/5
                    hover:text-danger
                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-danger/10
                    disabled:pointer-events-none
                    disabled:opacity-45
                "
            >
                {deleting ? (
                    <RiLoader4Line
                        size={16}
                        aria-hidden="true"
                        className="animate-spin"
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

function LoadingState({
    styles,
}) {
    return (
        <div
            className="
                flex min-h-64
                flex-col
                items-center
                justify-center
                px-5
                text-center
            "
        >
            <div
                className={`
                    inline-flex
                    size-12
                    items-center
                    justify-center
                    rounded-2xl
                    border

                    ${styles.icon}
                `}
            >
                <RiLoader4Line
                    size={22}
                    aria-hidden="true"
                    className="animate-spin"
                />
            </div>

            <p
                className="
                    mt-4
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                Carregando lançamentos
            </p>

            <p
                className="
                    mt-1
                    text-xs
                    text-muted-foreground
                "
            >
                Aguarde enquanto buscamos os dados.
            </p>
        </div>
    );
}

function EmptyState({
    message,
    styles,
}) {
    return (
        <div
            className="
                flex min-h-64
                flex-col
                items-center
                justify-center
                px-5 py-10
                text-center
            "
        >
            <div
                className={`
                    inline-flex
                    size-12
                    items-center
                    justify-center
                    rounded-2xl
                    border

                    ${styles.icon}
                `}
            >
                <RiFileList3Line
                    size={22}
                    aria-hidden="true"
                />
            </div>

            <p
                className="
                    mt-4
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                Nenhum lançamento encontrado
            </p>

            <p
                className="
                    mt-1
                    max-w-sm
                    text-xs
                    leading-5
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
    totalPages,
    totalItems,
    paginationItems,
    canGoPrevious,
    canGoNext,
    styles,
    onPageChange,
    onPreviousPage,
    onNextPage,
}) {
    return (
        <footer
            className="
                flex
                flex-col
                gap-3
                border-t border-border
                px-4 py-3.5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
            "
        >
            <p
                className="
                    text-center
                    text-xs
                    text-muted-foreground
                    sm:text-left
                "
            >
                Página{" "}
                <strong className="text-foreground">
                    {currentPage}
                </strong>{" "}
                de{" "}
                <strong className="text-foreground">
                    {totalPages}
                </strong>

                <span
                    aria-hidden="true"
                    className="mx-2"
                >
                    ·
                </span>

                {totalItems} registros
            </p>

            <nav
                aria-label="Paginação dos lançamentos"
                className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                "
            >
                <button
                    type="button"
                    onClick={
                        onPreviousPage
                    }
                    disabled={
                        !canGoPrevious
                    }
                    aria-label="Página anterior"
                    title="Página anterior"
                    className={`
                        inline-flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border border-border
                        bg-background
                        text-muted-foreground
                        transition
                        hover:border-border-strong
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-4
                        disabled:pointer-events-none
                        disabled:opacity-35

                        ${styles.focusRing}
                    `}
                >
                    <RiArrowLeftSLine
                        size={19}
                        aria-hidden="true"
                    />
                </button>

                {paginationItems.map(
                    (pageNumber) => {
                        const current =
                            pageNumber ===
                            currentPage;

                        return (
                            <button
                                key={
                                    pageNumber
                                }
                                type="button"
                                onClick={() =>
                                    onPageChange(
                                        pageNumber,
                                    )
                                }
                                disabled={
                                    current ||
                                    !onPageChange
                                }
                                aria-current={
                                    current
                                        ? "page"
                                        : undefined
                                }
                                aria-label={`Ir para a página ${pageNumber}`}
                                className={`
                                    inline-flex
                                    size-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    text-xs
                                    font-semibold
                                    tabular-nums
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-4

                                    ${current
                                        ? styles.pageActive
                                        : "border-border bg-background text-muted-foreground hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
                                    }

                                    ${styles.focusRing}
                                `}
                            >
                                {pageNumber}
                            </button>
                        );
                    },
                )}

                <button
                    type="button"
                    onClick={
                        onNextPage
                    }
                    disabled={
                        !canGoNext
                    }
                    aria-label="Próxima página"
                    title="Próxima página"
                    className={`
                        inline-flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border border-border
                        bg-background
                        text-muted-foreground
                        transition
                        hover:border-border-strong
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-4
                        disabled:pointer-events-none
                        disabled:opacity-35

                        ${styles.focusRing}
                    `}
                >
                    <RiArrowRightSLine
                        size={19}
                        aria-hidden="true"
                    />
                </button>
            </nav>
        </footer>
    );
}

export default TransactionList;