import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowUpLine,
    RiCalendarLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiFileHistoryLine,
    RiLoader4Line,
    RiPriceTag3Line,
    RiRefreshLine,
    RiRepeat2Line,
    RiSearchLine,
} from "react-icons/ri";

import {
    transactionService,
} from "../../services/transactionService.js";

import {
    formatCurrency,
} from "../../utils/formatCurrency.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const DEFAULT_PAGE_SIZE = 10;

const TYPE_CONFIG = Object.freeze({
    INCOME: {
        label: "Receita",
        icon: RiArrowUpLine,

        amountClasses:
            "text-emerald-600 dark:text-emerald-400",

        iconClasses:
            "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400",

        badgeClasses:
            "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-400/20",
    },

    EXPENSE: {
        label: "Despesa",
        icon: RiArrowDownLine,

        amountClasses:
            "text-rose-600 dark:text-rose-400",

        iconClasses:
            "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400",

        badgeClasses:
            "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-400/20",
    },
});

function normalizePositiveInteger(
    value,
    fallbackValue,
) {
    const normalizedValue =
        Number(value);

    if (
        !Number.isInteger(
            normalizedValue,
        ) ||
        normalizedValue <= 0
    ) {
        return fallbackValue;
    }

    return normalizedValue;
}

function normalizeTransactionType(
    value,
) {
    return value === "EXPENSE"
        ? "EXPENSE"
        : "INCOME";
}

function normalizeResponse(
    response,
    pageSize,
) {
    const transactions =
        Array.isArray(
            response?.transactions,
        )
            ? response.transactions
            : [];

    const receivedPagination =
        response?.pagination ?? {};

    const totalItemsValue =
        Number(
            receivedPagination.totalItems,
        );

    const totalPagesValue =
        Number(
            receivedPagination.totalPages,
        );

    return {
        transactions,

        pagination: {
            page:
                normalizePositiveInteger(
                    receivedPagination.page,
                    1,
                ),

            limit:
                normalizePositiveInteger(
                    receivedPagination.limit,
                    pageSize,
                ),

            totalItems:
                Number.isInteger(
                    totalItemsValue,
                ) &&
                    totalItemsValue >= 0
                    ? totalItemsValue
                    : transactions.length,

            totalPages:
                Number.isInteger(
                    totalPagesValue,
                ) &&
                    totalPagesValue >= 0
                    ? totalPagesValue
                    : transactions.length > 0
                        ? 1
                        : 0,
        },
    };
}

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return fallbackMessage;
}

function extractTags(
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

function isRecurringTransaction(
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
        return [1, 2, 3];
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

function TransactionTags({
    transaction,
}) {
    const tags =
        extractTags(transaction);

    if (tags.length === 0) {
        return (
            <span
                className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-1.5
                    rounded-full
                    border border-border
                    bg-background
                    px-2.5 py-1
                    text-[10px]
                    font-semibold
                    text-muted-foreground
                "
            >
                <RiPriceTag3Line
                    size={12}
                    aria-hidden="true"
                    className="shrink-0"
                />

                <span className="truncate">
                    {transaction.category ||
                        "Sem tags"}
                </span>
            </span>
        );
    }

    const visibleTags =
        tags.slice(0, 3);

    const hiddenTagCount =
        tags.length -
        visibleTags.length;

    return (
        <div
            className="
                flex min-w-0
                flex-wrap
                items-center
                gap-1.5
            "
        >
            {visibleTags.map(
                (tag) => (
                    <span
                        key={tag.id}
                        title={tag.name}
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

            {hiddenTagCount > 0 && (
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
    );
}

function HistoryTransactionItem({
    transaction,
    index,
}) {
    const type =
        normalizeTransactionType(
            transaction.type,
        );

    const config =
        TYPE_CONFIG[type];

    const TypeIcon =
        config.icon;

    const recurring =
        isRecurringTransaction(
            transaction,
        );

    const date =
        transaction.date ??
        transaction.occurrenceDate;

    const amountPrefix =
        type === "INCOME"
            ? "+"
            : "−";

    return (
        <motion.article
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
                y: -5,
            }}
            transition={{
                duration: 0.18,
                delay: Math.min(
                    index * 0.025,
                    0.15,
                ),
            }}
            className="
                min-w-0
                border-b border-border
                px-4 py-4
                transition-colors
                last:border-b-0
                hover:bg-surface-muted/25
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

                        ${config.iconClasses}
                    `}
                >
                    <TypeIcon
                        size={18}
                        aria-hidden="true"
                    />
                </div>

                <div
                    className="
                        min-w-0
                        flex-1
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
                        <div className="min-w-0">
                            <div
                                className="
                                    flex min-w-0
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <h3
                                    title={
                                        transaction.description
                                    }
                                    className="
                                        min-w-0
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

                                <span
                                    className={`
                                        inline-flex
                                        shrink-0
                                        items-center
                                        rounded-full
                                        px-2 py-0.5
                                        text-[10px]
                                        font-semibold
                                        ring-1
                                        ring-inset

                                        ${config.badgeClasses}
                                    `}
                                >
                                    {
                                        config.label
                                    }
                                </span>
                            </div>

                            <div
                                className="
                                    mt-1.5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-3
                                    gap-y-1
                                "
                            >
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    <RiCalendarLine
                                        size={13}
                                        aria-hidden="true"
                                    />

                                    {date
                                        ? formatDate(
                                            date,
                                        )
                                        : "Data não informada"}
                                </span>

                                {recurring && (
                                    <span
                                        title="Movimentação criada automaticamente por uma recorrência."
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            font-medium
                                            text-primary
                                        "
                                    >
                                        <RiRepeat2Line
                                            size={13}
                                            aria-hidden="true"
                                        />

                                        Automática
                                    </span>
                                )}
                            </div>
                        </div>

                        <strong
                            title={formatCurrency(
                                transaction.amountCents,
                            )}
                            className={`
                                shrink-0
                                text-sm
                                font-bold
                                tabular-nums
                                sm:text-base

                                ${config.amountClasses}
                            `}
                        >
                            {amountPrefix}
                            {formatCurrency(
                                transaction.amountCents,
                            )}
                        </strong>
                    </div>

                    <div className="mt-3">
                        <TransactionTags
                            transaction={
                                transaction
                            }
                        />
                    </div>

                    {transaction.notes && (
                        <p
                            title={
                                transaction.notes
                            }
                            className="
                                mt-2
                                line-clamp-2
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            {transaction.notes}
                        </p>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

function LoadingState() {
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
            <RiLoader4Line
                size={24}
                aria-hidden="true"
                className="
                    animate-spin
                    text-primary
                "
            />

            <p
                className="
                    mt-3
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                Carregando movimentações
            </p>

            <p
                className="
                    mt-1
                    text-xs
                    text-muted-foreground
                "
            >
                Aguarde enquanto buscamos o histórico detalhado.
            </p>
        </div>
    );
}

function HistoryTransactionList({
    year,
    refreshKey = 0,
    pageSize = DEFAULT_PAGE_SIZE,
    onError,
}) {
    const requestReference =
        useRef(0);

    const searchTimeoutReference =
        useRef(null);

    const [
        transactions,
        setTransactions,
    ] = useState([]);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: pageSize,
        totalItems: 0,
        totalPages: 0,
    });

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const normalizedYear =
        Number(year);

    useEffect(() => {
        setPage(1);
    }, [normalizedYear]);

    useEffect(() => {
        if (
            searchTimeoutReference.current
        ) {
            clearTimeout(
                searchTimeoutReference.current,
            );
        }

        searchTimeoutReference.current =
            setTimeout(() => {
                setDebouncedSearch(
                    search.trim(),
                );

                setPage(1);
            }, 350);

        return () => {
            if (
                searchTimeoutReference.current
            ) {
                clearTimeout(
                    searchTimeoutReference.current,
                );
            }
        };
    }, [search]);

    const loadTransactions =
        useCallback(async () => {
            if (
                !Number.isInteger(
                    normalizedYear,
                ) ||
                normalizedYear < 1900 ||
                normalizedYear > 2100
            ) {
                setTransactions([]);

                setPagination({
                    page: 1,
                    limit: pageSize,
                    totalItems: 0,
                    totalPages: 0,
                });

                setErrorMessage(
                    "O ano selecionado é inválido.",
                );

                setLoading(false);

                return;
            }

            const requestId =
                requestReference.current +
                1;

            requestReference.current =
                requestId;

            setLoading(true);
            setErrorMessage("");

            try {
                const response =
                    await transactionService.list({
                        year:
                            normalizedYear,

                        page,

                        limit:
                            pageSize,

                        search:
                            debouncedSearch ||
                            undefined,
                    });

                if (
                    requestReference.current !==
                    requestId
                ) {
                    return;
                }

                const normalizedResponse =
                    normalizeResponse(
                        response,
                        pageSize,
                    );

                setTransactions(
                    normalizedResponse.transactions,
                );

                setPagination(
                    normalizedResponse.pagination,
                );

                if (
                    normalizedResponse.pagination
                        .totalPages > 0 &&
                    page >
                    normalizedResponse.pagination
                        .totalPages
                ) {
                    setPage(
                        normalizedResponse
                            .pagination
                            .totalPages,
                    );
                }
            } catch (error) {
                if (
                    requestReference.current !==
                    requestId
                ) {
                    return;
                }

                const message =
                    getErrorMessage(
                        error,
                        "Não foi possível carregar as movimentações do histórico.",
                    );

                setTransactions([]);

                setPagination({
                    page: 1,
                    limit: pageSize,
                    totalItems: 0,
                    totalPages: 0,
                });

                setErrorMessage(
                    message,
                );

                onError?.(message);
            } finally {
                if (
                    requestReference.current ===
                    requestId
                ) {
                    setLoading(false);
                }
            }
        }, [
            debouncedSearch,
            normalizedYear,
            onError,
            page,
            pageSize,
        ]);

    useEffect(() => {
        loadTransactions();

        return () => {
            requestReference.current +=
                1;
        };
    }, [
        loadTransactions,
        refreshKey,
    ]);

    const paginationItems =
        useMemo(
            () =>
                getPaginationItems(
                    page,
                    pagination.totalPages,
                ),
            [
                page,
                pagination.totalPages,
            ],
        );

    function handlePageChange(
        nextPage,
    ) {
        if (
            loading ||
            nextPage < 1 ||
            nextPage >
            pagination.totalPages ||
            nextPage === page
        ) {
            return;
        }

        setPage(nextPage);
    }

    const empty =
        !loading &&
        !errorMessage &&
        transactions.length === 0;

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
                    border-b border-border
                    px-4 py-4
                    sm:px-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
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
                            className="
                                inline-flex
                                size-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-background
                                text-primary
                            "
                        >
                            <RiFileHistoryLine
                                size={19}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-foreground
                                    sm:text-base
                                "
                            >
                                Movimentações de{" "}
                                {normalizedYear}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Consulte receitas, despesas, tags e lançamentos automáticos.
                            </p>
                        </div>
                    </div>

                    <span
                        className="
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            rounded-full
                            border border-border
                            bg-background
                            px-3 py-1.5
                            text-xs
                            font-semibold
                            text-muted-foreground
                        "
                    >
                        {pagination.totalItems}{" "}
                        {pagination.totalItems ===
                            1
                            ? "movimentação"
                            : "movimentações"}
                    </span>
                </div>

                <div
                    className="
                        relative
                        mt-4
                        max-w-lg
                    "
                >
                    <RiSearchLine
                        size={18}
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            left-3.5 top-1/2
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value,
                            )
                        }
                        placeholder="Pesquisar descrição, categoria ou tag..."
                        aria-label="Pesquisar movimentações do histórico"
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border border-border
                            bg-background
                            pl-10 pr-10
                            text-sm
                            font-medium
                            text-foreground
                            outline-none
                            transition
                            placeholder:font-normal
                            placeholder:text-muted-foreground/70
                            hover:border-border-strong
                            focus:border-primary/50
                            focus:ring-4
                            focus:ring-primary/10
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Limpar pesquisa"
                            title="Limpar pesquisa"
                            className="
                                absolute
                                right-2 top-1/2
                                inline-flex
                                size-8
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-lg
                                text-muted-foreground
                                transition
                                hover:bg-surface-hover
                                hover:text-foreground
                            "
                        >
                            <RiCloseLine
                                size={17}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>
            </header>

            {loading && (
                <LoadingState />
            )}

            {!loading &&
                errorMessage && (
                    <div
                        role="alert"
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
                            className="
                            inline-flex
                            size-12
                            items-center
                            justify-center
                            rounded-2xl
                            border border-danger/20
                            bg-danger/5
                            text-danger
                        "
                        >
                            <RiErrorWarningLine
                                size={22}
                                aria-hidden="true"
                            />
                        </div>

                        <h3
                            className="
                            mt-4
                            text-sm
                            font-semibold
                            text-foreground
                        "
                        >
                            Não foi possível carregar
                        </h3>

                        <p
                            className="
                            mt-1
                            max-w-md
                            text-xs
                            leading-5
                            text-muted-foreground
                        "
                        >
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadTransactions
                            }
                            className="
                            mt-4
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border border-border
                            bg-surface
                            px-4
                            text-xs
                            font-semibold
                            text-foreground
                            transition
                            hover:bg-surface-hover
                        "
                        >
                            <RiRefreshLine
                                size={16}
                                aria-hidden="true"
                            />

                            Tentar novamente
                        </button>
                    </div>
                )}

            {empty && (
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
                        className="
                            inline-flex
                            size-12
                            items-center
                            justify-center
                            rounded-2xl
                            border border-border
                            bg-background
                            text-muted-foreground
                        "
                    >
                        <RiFileHistoryLine
                            size={22}
                            aria-hidden="true"
                        />
                    </div>

                    <h3
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-foreground
                        "
                    >
                        Nenhuma movimentação encontrada
                    </h3>

                    <p
                        className="
                            mt-1
                            max-w-md
                            text-xs
                            leading-5
                            text-muted-foreground
                        "
                    >
                        {debouncedSearch
                            ? "Tente pesquisar usando outro termo."
                            : `Não existem receitas ou despesas registradas em ${normalizedYear}.`}
                    </p>
                </div>
            )}

            {!loading &&
                !errorMessage &&
                transactions.length >
                0 && (
                    <div>
                        <AnimatePresence
                            initial={false}
                            mode="popLayout"
                        >
                            {transactions.map(
                                (
                                    transaction,
                                    index,
                                ) => (
                                    <HistoryTransactionItem
                                        key={
                                            transaction.id
                                        }
                                        transaction={
                                            transaction
                                        }
                                        index={
                                            index
                                        }
                                    />
                                ),
                            )}
                        </AnimatePresence>
                    </div>
                )}

            {!loading &&
                !errorMessage &&
                pagination.totalPages >
                1 && (
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
                                {page}
                            </strong>{" "}
                            de{" "}
                            <strong className="text-foreground">
                                {
                                    pagination.totalPages
                                }
                            </strong>
                        </p>

                        <nav
                            aria-label="Paginação do histórico"
                            className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                        "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        page - 1,
                                    )
                                }
                                disabled={
                                    page <= 1 ||
                                    loading
                                }
                                aria-label="Página anterior"
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
                                hover:bg-surface-hover
                                hover:text-foreground
                                disabled:pointer-events-none
                                disabled:opacity-35
                            "
                            >
                                <RiArrowLeftSLine
                                    size={19}
                                    aria-hidden="true"
                                />
                            </button>

                            {paginationItems.map(
                                (
                                    pageNumber,
                                ) => {
                                    const current =
                                        pageNumber ===
                                        page;

                                    return (
                                        <button
                                            key={
                                                pageNumber
                                            }
                                            type="button"
                                            onClick={() =>
                                                handlePageChange(
                                                    pageNumber,
                                                )
                                            }
                                            disabled={
                                                current
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

                                            ${current
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border bg-background text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                                }
                                        `}
                                        >
                                            {
                                                pageNumber
                                            }
                                        </button>
                                    );
                                },
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        page + 1,
                                    )
                                }
                                disabled={
                                    page >=
                                    pagination.totalPages ||
                                    loading
                                }
                                aria-label="Próxima página"
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
                                hover:bg-surface-hover
                                hover:text-foreground
                                disabled:pointer-events-none
                                disabled:opacity-35
                            "
                            >
                                <RiArrowRightSLine
                                    size={19}
                                    aria-hidden="true"
                                />
                            </button>
                        </nav>
                    </footer>
                )}
        </section>
    );
}

export default HistoryTransactionList;