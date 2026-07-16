import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiCalendar2Line,
    RiCloseLine,
    RiDeleteBinLine,
    RiEditLine,
    RiErrorWarningLine,
    RiLoader4Line,
    RiMore2Line,
    RiPauseCircleLine,
    RiPlayCircleLine,
    RiPriceTag3Line,
    RiRefreshLine,
    RiRepeat2Line,
    RiSearchLine,
    RiTimeLine,
} from "react-icons/ri";

import {
    getTransactionTypeConfig,
    normalizeTransactionType,
} from "../../config/transactionTypeConfig.js";

import {
    recurringTransactionService,
} from "../../services/recurringTransactionService.js";

const STATUS_CONFIG = Object.freeze({
    ACTIVE: {
        label: "Ativa",

        classes:
            "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-400/20",
    },

    PAUSED: {
        label: "Pausada",

        classes:
            "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-400/20",
    },

    FINISHED: {
        label: "Finalizada",

        classes:
            "bg-slate-100 text-slate-600 ring-slate-500/15 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20",
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

function normalizeDateInput(value) {
    if (!value) {
        return "";
    }

    if (
        typeof value === "string"
    ) {
        return value.slice(0, 10);
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "";
    }

    return date
        .toISOString()
        .slice(0, 10);
}

function formatCurrency(
    amountCents,
) {
    const normalizedAmount =
        Number(amountCents);

    const safeAmount =
        Number.isFinite(
            normalizedAmount,
        )
            ? normalizedAmount
            : 0;

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    ).format(
        safeAmount / 100,
    );
}

function formatDate(
    value,
    fallbackValue = "Não definida",
) {
    const normalizedDate =
        normalizeDateInput(value);

    if (!normalizedDate) {
        return fallbackValue;
    }

    const [
        year,
        month,
        day,
    ] = normalizedDate
        .split("-")
        .map(Number);

    if (
        !year ||
        !month ||
        !day
    ) {
        return fallbackValue;
    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        },
    )
        .format(
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day,
                ),
            ),
        )
        .replace(".", "");
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

function getRecurrenceStatus(
    recurringTransaction,
) {
    const informedStatus =
        String(
            recurringTransaction?.status ??
            "",
        )
            .trim()
            .toUpperCase();

    if (
        Object.hasOwn(
            STATUS_CONFIG,
            informedStatus,
        )
    ) {
        return informedStatus;
    }

    if (
        recurringTransaction?.isActive ===
        false
    ) {
        const endDate =
            normalizeDateInput(
                recurringTransaction.endDate,
            );

        const nextOccurrenceDate =
            normalizeDateInput(
                recurringTransaction.nextOccurrenceDate,
            );

        if (
            endDate &&
            !nextOccurrenceDate
        ) {
            return "FINISHED";
        }

        return "PAUSED";
    }

    return "ACTIVE";
}

function getIntervalLabel(
    intervalMonths,
) {
    const normalizedInterval =
        normalizePositiveInteger(
            intervalMonths,
            1,
        );

    if (normalizedInterval === 1) {
        return "Mensal";
    }

    if (normalizedInterval === 2) {
        return "A cada 2 meses";
    }

    if (normalizedInterval === 3) {
        return "Trimestral";
    }

    if (normalizedInterval === 6) {
        return "Semestral";
    }

    if (normalizedInterval === 12) {
        return "Anual";
    }

    return `A cada ${normalizedInterval} meses`;
}

function getRecurrencePeriodLabel(
    recurringTransaction,
) {
    const startDate =
        formatDate(
            recurringTransaction.startDate,
            "",
        );

    const endDate =
        formatDate(
            recurringTransaction.endDate,
            "",
        );

    if (
        startDate &&
        endDate
    ) {
        return `${startDate} até ${endDate}`;
    }

    if (startDate) {
        return `Desde ${startDate}`;
    }

    return "Período não informado";
}

function extractTags(
    recurringTransaction,
) {
    if (
        !Array.isArray(
            recurringTransaction?.tags,
        )
    ) {
        return [];
    }

    return recurringTransaction.tags
        .map((item) => {
            if (
                item?.tag &&
                typeof item.tag ===
                "object"
            ) {
                return item.tag;
            }

            return item;
        })
        .filter(
            (tag) =>
                Number.isInteger(
                    Number(tag?.id),
                ) &&
                Number(tag.id) > 0,
        );
}

function normalizeListResponse(
    response,
) {
    const recurringTransactions =
        Array.isArray(
            response?.recurringTransactions,
        )
            ? response.recurringTransactions
            : Array.isArray(
                response?.items,
            )
                ? response.items
                : Array.isArray(
                    response?.data,
                )
                    ? response.data
                    : [];

    const pagination =
        response?.pagination ??
        response?.meta ??
        {};

    const totalItems =
        normalizePositiveInteger(
            pagination.totalItems ??
            pagination.total ??
            recurringTransactions.length,
            recurringTransactions.length,
        );

    const currentPage =
        normalizePositiveInteger(
            pagination.page ??
            pagination.currentPage,
            1,
        );

    const totalPagesValue =
        Number(
            pagination.totalPages,
        );

    const totalPages =
        Number.isInteger(
            totalPagesValue,
        ) &&
            totalPagesValue >= 0
            ? totalPagesValue
            : recurringTransactions.length >
                0
                ? 1
                : 0;

    return {
        recurringTransactions,

        pagination: {
            page:
                currentPage,

            totalItems,

            totalPages,
        },
    };
}

function ConfirmationDialog({
    open,
    title,
    description,
    confirmLabel,
    loading,
    onCancel,
    onConfirm,
}) {
    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    role="presentation"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget &&
                            !loading
                        ) {
                            onCancel?.();
                        }
                    }}
                    className="
                        fixed inset-0
                        z-[130]
                        flex items-center
                        justify-center
                        bg-slate-950/50
                        p-4
                        backdrop-blur-[2px]
                    "
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="recurring-confirmation-title"
                        initial={{
                            opacity: 0,
                            y: 16,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.99,
                        }}
                        transition={{
                            duration: 0.18,
                        }}
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                        className="
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-3xl
                            border border-border
                            bg-surface
                            shadow-2xl
                        "
                    >
                        <header
                            className="
                                flex items-start
                                justify-between
                                gap-4
                                border-b border-border
                                px-5 py-5
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
                                        border border-danger/20
                                        bg-danger/5
                                        text-danger
                                    "
                                >
                                    <RiDeleteBinLine
                                        size={19}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="recurring-confirmation-title"
                                        className="
                                            text-base
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        {title}
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {
                                            description
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onCancel
                                }
                                disabled={
                                    loading
                                }
                                aria-label="Fechar confirmação"
                                className="
                                    inline-flex
                                    size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-muted-foreground
                                    transition
                                    hover:bg-surface-hover
                                    hover:text-foreground
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                <RiCloseLine
                                    size={19}
                                    aria-hidden="true"
                                />
                            </button>
                        </header>

                        <footer
                            className="
                                flex
                                flex-col-reverse
                                gap-2
                                px-5 py-4
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    onCancel
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-foreground
                                    transition
                                    hover:bg-surface-hover
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    onConfirm
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    min-w-36
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-danger
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:brightness-95
                                    disabled:pointer-events-none
                                    disabled:opacity-70
                                "
                            >
                                {loading ? (
                                    <RiLoader4Line
                                        size={18}
                                        aria-hidden="true"
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RiDeleteBinLine
                                        size={17}
                                        aria-hidden="true"
                                    />
                                )}

                                {
                                    confirmLabel
                                }
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

function RecurringTransactionList({
    type = "INCOME",
    refreshKey = 0,
    pageSize = 6,
    onEdit,
    onChanged,
    onError,
}) {
    const normalizedType =
        normalizeTransactionType(
            type,
        ) || "INCOME";

    const config =
        useMemo(
            () =>
                getTransactionTypeConfig(
                    normalizedType,
                ),
            [normalizedType],
        );

    const requestReference =
        useRef(0);

    const searchTimeoutReference =
        useRef(null);

    const [
        recurringTransactions,
        setRecurringTransactions,
    ] = useState([]);

    const [search, setSearch] =
        useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");

    const [page, setPage] =
        useState(1);

    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        totalItems: 0,
        totalPages: 0,
    });

    const [loading, setLoading] =
        useState(true);

    const [
        actionLoadingId,
        setActionLoadingId,
    ] = useState(null);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        actionError,
        setActionError,
    ] = useState("");

    const [
        menuOpenId,
        setMenuOpenId,
    ] = useState(null);

    const [
        pendingDeletion,
        setPendingDeletion,
    ] = useState(null);

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

    const loadRecurringTransactions =
        useCallback(async () => {
            const requestId =
                requestReference.current +
                1;

            requestReference.current =
                requestId;

            setLoading(true);
            setLoadError("");
            setActionError("");

            try {
                const response =
                    await recurringTransactionService.listByType(
                        normalizedType,
                        {
                            page,
                            limit:
                                pageSize,
                            search:
                                debouncedSearch ||
                                undefined,
                        },
                    );

                if (
                    requestReference.current !==
                    requestId
                ) {
                    return;
                }

                const normalizedResponse =
                    normalizeListResponse(
                        response,
                    );

                setRecurringTransactions(
                    normalizedResponse.recurringTransactions,
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
                        `Não foi possível carregar ${config.articlePlural} ${config.plural} recorrentes.`,
                    );

                setLoadError(message);

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
            config,
            debouncedSearch,
            normalizedType,
            onError,
            page,
            pageSize,
        ]);

    useEffect(() => {
        loadRecurringTransactions();

        return () => {
            requestReference.current +=
                1;
        };
    }, [
        loadRecurringTransactions,
        refreshKey,
    ]);

    useEffect(() => {
        function closeMenu() {
            setMenuOpenId(null);
        }

        window.addEventListener(
            "click",
            closeMenu,
        );

        return () => {
            window.removeEventListener(
                "click",
                closeMenu,
            );
        };
    }, []);

    async function handleToggleStatus(
        recurringTransaction,
    ) {
        const status =
            getRecurrenceStatus(
                recurringTransaction,
            );

        if (
            status === "FINISHED" ||
            actionLoadingId
        ) {
            return;
        }

        setActionLoadingId(
            recurringTransaction.id,
        );

        setActionError("");
        setMenuOpenId(null);

        try {
            if (status === "ACTIVE") {
                await recurringTransactionService.pause(
                    recurringTransaction.id,
                );
            } else {
                await recurringTransactionService.activate(
                    recurringTransaction.id,
                );
            }

            await loadRecurringTransactions();

            await onChanged?.({
                action:
                    status === "ACTIVE"
                        ? "PAUSE"
                        : "ACTIVATE",

                recurringTransaction,
            });
        } catch (error) {
            const message =
                getErrorMessage(
                    error,
                    status === "ACTIVE"
                        ? "Não foi possível pausar a recorrência."
                        : "Não foi possível reativar a recorrência.",
                );

            setActionError(message);

            onError?.(message);
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleDelete() {
        if (
            !pendingDeletion?.id ||
            actionLoadingId
        ) {
            return;
        }

        const recurringTransaction =
            pendingDeletion;

        setActionLoadingId(
            recurringTransaction.id,
        );

        setActionError("");

        try {
            await recurringTransactionService.remove(
                recurringTransaction.id,
            );

            setPendingDeletion(null);

            if (
                recurringTransactions.length ===
                1 &&
                page > 1
            ) {
                setPage(
                    (currentPage) =>
                        currentPage - 1,
                );
            } else {
                await loadRecurringTransactions();
            }

            await onChanged?.({
                action: "DELETE",
                recurringTransaction,
            });
        } catch (error) {
            const message =
                getErrorMessage(
                    error,
                    "Não foi possível excluir a recorrência.",
                );

            setActionError(message);

            onError?.(message);
        } finally {
            setActionLoadingId(null);
        }
    }

    function handleEdit(
        recurringTransaction,
    ) {
        setMenuOpenId(null);

        onEdit?.(
            recurringTransaction,
        );
    }

    function handlePreviousPage() {
        if (
            loading ||
            page <= 1
        ) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage - 1,
        );
    }

    function handleNextPage() {
        if (
            loading ||
            page >=
            pagination.totalPages
        ) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage + 1,
        );
    }

    const empty =
        !loading &&
        !loadError &&
        recurringTransactions.length ===
        0;

    return (
        <section
            className="
                overflow-hidden
                rounded-3xl
                border border-border
                bg-surface
                shadow-sm
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
                        sm:items-center
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
                            className={`
                                inline-flex
                                size-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                ${config.softBackgroundClasses}
                                ${config.borderClasses}
                                ${config.accentClasses}
                            `}
                        >
                            <RiRepeat2Line
                                size={20}
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
                                {
                                    config.recurringPageTitle
                                }
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Gerencie os lançamentos que se repetem automaticamente.
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            rounded-full
                            border border-border
                            bg-surface-muted/50
                            px-3 py-1.5
                            text-xs
                            font-semibold
                            text-muted-foreground
                        "
                    >
                        {pagination.totalItems}{" "}
                        {pagination.totalItems ===
                            1
                            ? "recorrência"
                            : "recorrências"}
                    </div>
                </div>

                <div className="mt-4">
                    <div
                        className="
                            relative
                            max-w-md
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
                            onChange={(
                                event,
                            ) =>
                                setSearch(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder={`Pesquisar ${config.plural} recorrentes...`}
                            aria-label={`Pesquisar ${config.plural} recorrentes`}
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
                </div>
            </header>

            {actionError && (
                <div
                    role="alert"
                    className="
                        flex items-start
                        gap-3
                        border-b border-danger/15
                        bg-danger/5
                        px-4 py-3
                        sm:px-5
                    "
                >
                    <RiErrorWarningLine
                        size={18}
                        aria-hidden="true"
                        className="
                            mt-0.5
                            shrink-0
                            text-danger
                        "
                    />

                    <p
                        className="
                            text-xs
                            font-medium
                            leading-5
                            text-danger
                        "
                    >
                        {actionError}
                    </p>
                </div>
            )}

            <div className="p-3 sm:p-4">
                {loading && (
                    <div
                        className="
                            flex min-h-64
                            flex-col
                            items-center
                            justify-center
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
                            Carregando recorrências
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
                )}

                {!loading &&
                    loadError && (
                        <div
                            role="alert"
                            className="
                            flex min-h-64
                            flex-col
                            items-center
                            justify-center
                            px-4
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

                            <p
                                className="
                                mt-4
                                text-sm
                                font-semibold
                                text-foreground
                            "
                            >
                                Não foi possível carregar
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
                                {loadError}
                            </p>

                            <button
                                type="button"
                                onClick={
                                    loadRecurringTransactions
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
                            px-4
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
                                ${config.softBackgroundClasses}
                                ${config.borderClasses}
                                ${config.accentClasses}
                            `}
                        >
                            <RiRepeat2Line
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
                            {debouncedSearch
                                ? "Nenhuma recorrência encontrada"
                                : `Nenhuma ${config.singular} recorrente cadastrada`}
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
                            {debouncedSearch
                                ? "Tente pesquisar utilizando outro termo."
                                : `As ${config.plural} recorrentes aparecerão aqui depois do cadastro.`}
                        </p>
                    </div>
                )}

                {!loading &&
                    !loadError &&
                    recurringTransactions.length >
                    0 && (
                        <div className="space-y-3">
                            {recurringTransactions.map(
                                (
                                    recurringTransaction,
                                ) => {
                                    const status =
                                        getRecurrenceStatus(
                                            recurringTransaction,
                                        );

                                    const statusConfig =
                                        STATUS_CONFIG[
                                        status
                                        ];

                                    const tags =
                                        extractTags(
                                            recurringTransaction,
                                        );

                                    const actionLoading =
                                        actionLoadingId ===
                                        recurringTransaction.id;

                                    const nextOccurrence =
                                        formatDate(
                                            recurringTransaction.nextOccurrenceDate,
                                            status ===
                                                "FINISHED"
                                                ? "Finalizada"
                                                : "A definir",
                                        );

                                    return (
                                        <article
                                            key={
                                                recurringTransaction.id
                                            }
                                            className="
                                            relative
                                            rounded-2xl
                                            border border-border
                                            bg-background
                                            p-4
                                            transition
                                            hover:border-border-strong
                                            hover:shadow-sm
                                            sm:p-5
                                        "
                                        >
                                            <div
                                                className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
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
                                                        ${config.softBackgroundClasses}
                                                        ${config.borderClasses}
                                                        ${config.accentClasses}
                                                    `}
                                                    >
                                                        <config.icon
                                                            size={19}
                                                            aria-hidden="true"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div
                                                            className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        "
                                                        >
                                                            <h3
                                                                className="
                                                                min-w-0
                                                                truncate
                                                                text-sm
                                                                font-semibold
                                                                text-foreground
                                                                sm:text-base
                                                            "
                                                            >
                                                                {
                                                                    recurringTransaction.description
                                                                }
                                                            </h3>

                                                            <span
                                                                className={`
                                                                inline-flex
                                                                shrink-0
                                                                items-center
                                                                rounded-full
                                                                px-2.5
                                                                py-1
                                                                text-[10px]
                                                                font-semibold
                                                                ring-1
                                                                ring-inset
                                                                ${statusConfig.classes}
                                                            `}
                                                            >
                                                                {
                                                                    statusConfig.label
                                                                }
                                                            </span>
                                                        </div>

                                                        <p
                                                            className={`
                                                            mt-1
                                                            text-lg
                                                            font-bold
                                                            tracking-tight
                                                            ${config.accentClasses}
                                                        `}
                                                        >
                                                            {formatCurrency(
                                                                recurringTransaction.amountCents,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                    relative
                                                    shrink-0
                                                "
                                                    onClick={(
                                                        event,
                                                    ) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMenuOpenId(
                                                                (
                                                                    currentId,
                                                                ) =>
                                                                    currentId ===
                                                                        recurringTransaction.id
                                                                        ? null
                                                                        : recurringTransaction.id,
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        aria-label="Abrir ações da recorrência"
                                                        aria-expanded={
                                                            menuOpenId ===
                                                            recurringTransaction.id
                                                        }
                                                        className="
                                                        inline-flex
                                                        size-9
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        text-muted-foreground
                                                        transition
                                                        hover:bg-surface-hover
                                                        hover:text-foreground
                                                        disabled:pointer-events-none
                                                    "
                                                    >
                                                        {actionLoading ? (
                                                            <RiLoader4Line
                                                                size={18}
                                                                aria-hidden="true"
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <RiMore2Line
                                                                size={19}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </button>

                                                    <AnimatePresence>
                                                        {menuOpenId ===
                                                            recurringTransaction.id && (
                                                                <motion.div
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: -4,
                                                                        scale: 0.98,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0,
                                                                        scale: 1,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        y: -4,
                                                                        scale: 0.98,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.14,
                                                                    }}
                                                                    className="
                                                                absolute
                                                                right-0 top-11
                                                                z-20
                                                                w-48
                                                                overflow-hidden
                                                                rounded-2xl
                                                                border border-border
                                                                bg-surface
                                                                p-1.5
                                                                shadow-xl
                                                            "
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                recurringTransaction,
                                                                            )
                                                                        }
                                                                        className="
                                                                    flex
                                                                    min-h-10
                                                                    w-full
                                                                    items-center
                                                                    gap-2.5
                                                                    rounded-xl
                                                                    px-3
                                                                    text-left
                                                                    text-xs
                                                                    font-semibold
                                                                    text-foreground
                                                                    transition
                                                                    hover:bg-surface-hover
                                                                "
                                                                    >
                                                                        <RiEditLine
                                                                            size={16}
                                                                            aria-hidden="true"
                                                                            className="text-muted-foreground"
                                                                        />

                                                                        Editar recorrência
                                                                    </button>

                                                                    {status !==
                                                                        "FINISHED" && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleToggleStatus(
                                                                                        recurringTransaction,
                                                                                    )
                                                                                }
                                                                                className="
                                                                        flex
                                                                        min-h-10
                                                                        w-full
                                                                        items-center
                                                                        gap-2.5
                                                                        rounded-xl
                                                                        px-3
                                                                        text-left
                                                                        text-xs
                                                                        font-semibold
                                                                        text-foreground
                                                                        transition
                                                                        hover:bg-surface-hover
                                                                    "
                                                                            >
                                                                                {status ===
                                                                                    "ACTIVE" ? (
                                                                                    <RiPauseCircleLine
                                                                                        size={16}
                                                                                        aria-hidden="true"
                                                                                        className="text-muted-foreground"
                                                                                    />
                                                                                ) : (
                                                                                    <RiPlayCircleLine
                                                                                        size={16}
                                                                                        aria-hidden="true"
                                                                                        className="text-muted-foreground"
                                                                                    />
                                                                                )}

                                                                                {status ===
                                                                                    "ACTIVE"
                                                                                    ? "Pausar recorrência"
                                                                                    : "Reativar recorrência"}
                                                                            </button>
                                                                        )}

                                                                    <div
                                                                        className="
                                                                    my-1
                                                                    h-px
                                                                    bg-border
                                                                "
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setMenuOpenId(
                                                                                null,
                                                                            );

                                                                            setPendingDeletion(
                                                                                recurringTransaction,
                                                                            );
                                                                        }}
                                                                        className="
                                                                    flex
                                                                    min-h-10
                                                                    w-full
                                                                    items-center
                                                                    gap-2.5
                                                                    rounded-xl
                                                                    px-3
                                                                    text-left
                                                                    text-xs
                                                                    font-semibold
                                                                    text-danger
                                                                    transition
                                                                    hover:bg-danger/5
                                                                "
                                                                    >
                                                                        <RiDeleteBinLine
                                                                            size={16}
                                                                            aria-hidden="true"
                                                                        />

                                                                        Excluir recorrência
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                mt-4
                                                grid gap-3
                                                rounded-2xl
                                                border border-border
                                                bg-surface
                                                p-3.5
                                                sm:grid-cols-3
                                            "
                                            >
                                                <div
                                                    className="
                                                    flex items-start
                                                    gap-2.5
                                                "
                                                >
                                                    <RiCalendar2Line
                                                        size={17}
                                                        aria-hidden="true"
                                                        className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-muted-foreground
                                                    "
                                                    />

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-muted-foreground
                                                        "
                                                        >
                                                            Próxima ocorrência
                                                        </p>

                                                        <p
                                                            className="
                                                            mt-1
                                                            text-xs
                                                            font-semibold
                                                            text-foreground
                                                        "
                                                        >
                                                            {
                                                                nextOccurrence
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                    flex items-start
                                                    gap-2.5
                                                "
                                                >
                                                    <RiTimeLine
                                                        size={17}
                                                        aria-hidden="true"
                                                        className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-muted-foreground
                                                    "
                                                    />

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-muted-foreground
                                                        "
                                                        >
                                                            Frequência
                                                        </p>

                                                        <p
                                                            className="
                                                            mt-1
                                                            text-xs
                                                            font-semibold
                                                            text-foreground
                                                        "
                                                        >
                                                            {getIntervalLabel(
                                                                recurringTransaction.intervalMonths,
                                                            )}
                                                            {" · "}
                                                            dia{" "}
                                                            {
                                                                recurringTransaction.dayOfMonth
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                    flex items-start
                                                    gap-2.5
                                                "
                                                >
                                                    <RiRepeat2Line
                                                        size={17}
                                                        aria-hidden="true"
                                                        className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-muted-foreground
                                                    "
                                                    />

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-muted-foreground
                                                        "
                                                        >
                                                            Período
                                                        </p>

                                                        <p
                                                            className="
                                                            mt-1
                                                            text-xs
                                                            font-semibold
                                                            leading-5
                                                            text-foreground
                                                        "
                                                        >
                                                            {getRecurrencePeriodLabel(
                                                                recurringTransaction,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {tags.length >
                                                0 && (
                                                    <div
                                                        className="
                                                    mt-3
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                "
                                                    >
                                                        <RiPriceTag3Line
                                                            size={15}
                                                            aria-hidden="true"
                                                            className="text-muted-foreground"
                                                        />

                                                        {tags
                                                            .slice(
                                                                0,
                                                                4,
                                                            )
                                                            .map(
                                                                (
                                                                    tag,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            tag.id
                                                                        }
                                                                        className="
                                                                    inline-flex
                                                                    max-w-40
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    border border-border
                                                                    bg-surface
                                                                    px-2.5
                                                                    py-1
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
                                                                            {
                                                                                tag.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                ),
                                                            )}

                                                        {tags.length >
                                                            4 && (
                                                                <span
                                                                    className="
                                                            text-[10px]
                                                            font-semibold
                                                            text-muted-foreground
                                                        "
                                                                >
                                                                    +
                                                                    {tags.length -
                                                                        4}
                                                                </span>
                                                            )}
                                                    </div>
                                                )}

                                            {recurringTransaction.notes && (
                                                <p
                                                    className="
                                                    mt-3
                                                    line-clamp-2
                                                    text-xs
                                                    leading-5
                                                    text-muted-foreground
                                                "
                                                >
                                                    {
                                                        recurringTransaction.notes
                                                    }
                                                </p>
                                            )}
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    )}
            </div>

            {!loading &&
                !loadError &&
                pagination.totalPages >
                1 && (
                    <footer
                        className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t border-border
                        px-4 py-3.5
                        sm:px-5
                    "
                    >
                        <p
                            className="
                            text-xs
                            text-muted-foreground
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

                        <div
                            className="
                            flex items-center
                            gap-2
                        "
                        >
                            <button
                                type="button"
                                onClick={
                                    handlePreviousPage
                                }
                                disabled={
                                    page <= 1 ||
                                    loading
                                }
                                className="
                                inline-flex
                                min-h-9
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-surface
                                px-3
                                text-xs
                                font-semibold
                                text-foreground
                                transition
                                hover:bg-surface-hover
                                disabled:pointer-events-none
                                disabled:opacity-45
                            "
                            >
                                Anterior
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleNextPage
                                }
                                disabled={
                                    page >=
                                    pagination.totalPages ||
                                    loading
                                }
                                className="
                                inline-flex
                                min-h-9
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-surface
                                px-3
                                text-xs
                                font-semibold
                                text-foreground
                                transition
                                hover:bg-surface-hover
                                disabled:pointer-events-none
                                disabled:opacity-45
                            "
                            >
                                Próxima
                            </button>
                        </div>
                    </footer>
                )}

            <ConfirmationDialog
                open={Boolean(
                    pendingDeletion,
                )}
                title={`Excluir ${config.singular} recorrente`}
                description={`A regra recorrente será excluída. As ${config.plural} que já foram registradas continuarão no histórico.`}
                confirmLabel="Excluir recorrência"
                loading={
                    actionLoadingId ===
                    pendingDeletion?.id
                }
                onCancel={() => {
                    if (
                        !actionLoadingId
                    ) {
                        setPendingDeletion(
                            null,
                        );
                    }
                }}
                onConfirm={
                    handleDelete
                }
            />
        </section>
    );
}

export default RecurringTransactionList;