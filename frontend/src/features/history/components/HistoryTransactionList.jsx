import {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    FileText,
    RotateCw,
} from "lucide-react";
import { motion } from "motion/react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { cn } from "../../../lib/cn.js";
import TagPill from "../../transactions/components/TagPill.jsx";
import {
    formatHistoryCurrency,
    formatHistoryDate,
} from "../utils/historyFormatters.js";
import HistoryPagination from "./HistoryPagination.jsx";

const TAG_GAP = 6;
const PAGE_SIZE = 10;

const ITEM_TRANSITION = {
    duration: 0.24,
    ease: [0.22, 1, 0.36, 1],
};

function HistoryTypeIcon({
    type,
    recurring = false,
}) {
    const Icon = recurring
        ? RotateCw
        : type === "INCOME"
            ? ArrowUpRight
            : ArrowDownRight;

    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-control",
                recurring || type === "INCOME"
                    ? "bg-success-muted text-success"
                    : "bg-danger-muted text-danger",
            )}
        >
            <Icon
                className="size-[18px]"
                strokeWidth={2.2}
            />
        </span>
    );
}

function RecurringIndicator() {
    return (
        <span
            title="Movimentação recorrente"
            aria-label="Movimentação recorrente"
            className="
                inline-flex size-6
                shrink-0
                items-center justify-center
                rounded-full
                bg-success-muted
                text-success
            "
        >
            <RotateCw
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={2.2}
            />
        </span>
    );
}

function TypeBadge({
    type,
}) {
    const income = type === "INCOME";

    return (
        <Badge
            variant={income ? "success" : "danger"}
            className="
                inline-flex h-7
                shrink-0
                items-center gap-1
                rounded-md
                px-2
                text-xs font-semibold
            "
        >
            {income ? (
                <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                />
            ) : (
                <ArrowDownRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                />
            )}

            {income ? "Receita" : "Despesa"}
        </Badge>
    );
}

function AdaptiveTags({
    tags = [],
}) {
    const containerRef = useRef(null);
    const measureRef = useRef(null);

    const normalizedTags = useMemo(
        () => Array.isArray(tags) ? tags : [],
        [tags],
    );

    const [visibleCount, setVisibleCount] = useState(
        normalizedTags.length,
    );

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measureContainer = measureRef.current;

        if (!container || !measureContainer) {
            return undefined;
        }

        function calculateVisibleTags() {
            const availableWidth = container.clientWidth;

            const tagElements = Array.from(
                measureContainer.querySelectorAll(
                    "[data-tag-measure]",
                ),
            );

            const counterElement = measureContainer.querySelector(
                "[data-counter-measure]",
            );

            if (!availableWidth || tagElements.length === 0) {
                setVisibleCount(normalizedTags.length);
                return;
            }

            const tagWidths = tagElements.map(
                (element) => element
                    .getBoundingClientRect()
                    .width,
            );

            const counterWidth = counterElement
                ?.getBoundingClientRect()
                .width ?? 32;

            let nextVisibleCount = 0;

            for (
                let count = tagWidths.length;
                count >= 0;
                count -= 1
            ) {
                const hiddenCount = tagWidths.length - count;

                let requiredWidth = tagWidths
                    .slice(0, count)
                    .reduce(
                        (total, width) => total + width,
                        0,
                    );

                if (count > 1) {
                    requiredWidth += TAG_GAP * (count - 1);
                }

                if (hiddenCount > 0) {
                    requiredWidth += counterWidth;

                    if (count > 0) {
                        requiredWidth += TAG_GAP;
                    }
                }

                if (requiredWidth <= availableWidth) {
                    nextVisibleCount = count;
                    break;
                }
            }

            setVisibleCount(nextVisibleCount);
        }

        calculateVisibleTags();

        if (typeof ResizeObserver === "undefined") {
            return undefined;
        }

        const resizeObserver = new ResizeObserver(
            calculateVisibleTags,
        );

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [normalizedTags]);

    if (normalizedTags.length === 0) {
        return (
            <span className="text-xs text-subtle-foreground">
                Sem tags
            </span>
        );
    }

    const visibleTags = normalizedTags.slice(
        0,
        visibleCount,
    );

    const hiddenCount = Math.max(
        0,
        normalizedTags.length - visibleTags.length,
    );

    return (
        <div className="relative w-full min-w-0">
            <div
                ref={measureRef}
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute left-[-9999px] top-0
                    flex flex-nowrap
                    items-center gap-1.5
                    opacity-0
                "
            >
                {normalizedTags.map((tag) => (
                    <span
                        key={tag.id}
                        data-tag-measure
                        className="shrink-0"
                    >
                        <TagPill
                            tag={tag}
                            className="
                                max-w-28
                                sm:max-w-32
                                xl:max-w-40
                            "
                        />
                    </span>
                ))}

                <span
                    data-counter-measure
                    className="
                        inline-flex h-7
                        min-w-8 shrink-0
                        items-center justify-center
                        rounded-md
                        border border-border
                        bg-surface-muted
                        px-2
                        text-xs font-semibold
                        leading-none
                    "
                >
                    +{normalizedTags.length}
                </span>
            </div>

            <div
                ref={containerRef}
                className="
                    flex w-full min-w-0
                    items-center gap-1.5
                    overflow-hidden
                "
            >
                {visibleTags.map((tag) => (
                    <TagPill
                        key={tag.id}
                        tag={tag}
                        className="
                            max-w-28 shrink-0
                            sm:max-w-32
                            xl:max-w-40
                        "
                    />
                ))}

                {hiddenCount > 0 && (
                    <span
                        title={`${hiddenCount} tags adicionais`}
                        aria-label={`${hiddenCount} tags adicionais`}
                        className="
                            inline-flex h-7
                            min-w-8 shrink-0
                            items-center justify-center
                            rounded-md
                            border border-border
                            bg-surface-muted
                            px-2
                            text-xs font-semibold
                            leading-none
                            text-muted-foreground
                        "
                    >
                        +{hiddenCount}
                    </span>
                )}
            </div>
        </div>
    );
}

function HistoryTransactionList({
    data,
    loading,
    error,
    onRetry,
    onPageChange,
    hasFilters,
    onClearFilters,
}) {
    const transactions = Array.isArray(data?.transactions)
        ? data.transactions
        : [];

    const rawPagination = data?.pagination ?? {};

    const totalItems = Number(
        rawPagination.totalItems
        ?? rawPagination.total
        ?? transactions.length,
    ) || 0;

    const pageSize = Number(
        rawPagination.pageSize
        ?? rawPagination.limit
        ?? rawPagination.size
        ?? PAGE_SIZE,
    ) || PAGE_SIZE;

    const currentPage = Number(
        rawPagination.page,
    ) || 1;

    const calculatedTotalPages = Math.ceil(
        totalItems / pageSize,
    );

    const totalPages = Number(
        rawPagination.totalPages,
    ) || calculatedTotalPages;

    const pagination = {
        ...rawPagination,
        page: currentPage,
        pageSize,
        limit: pageSize,
        totalItems,
        totalPages,
    };

    const columns = useMemo(
        () => [
            {
                id: "description",
                header: "Movimentação",
                cell: ({ row }) => {
                    const transaction = row.original;

                    return (
                        <div className="flex min-w-0 items-center gap-3">
                            <HistoryTypeIcon
                                type={transaction.type}
                                recurring={transaction.isRecurring}
                            />

                            <div className="min-w-0">
                                <p
                                    title={transaction.description}
                                    className="
                                        truncate
                                        text-sm font-bold
                                        text-foreground
                                    "
                                >
                                    {transaction.description}
                                </p>

                                <p
                                    title={
                                        transaction.notes
                                        || transaction.category
                                    }
                                    className="
                                        mt-0.5 truncate
                                        text-xs
                                        text-subtle-foreground
                                    "
                                >
                                    {transaction.notes
                                        || transaction.category
                                        || "Sem observações"}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "type",
                header: "Tipo",
                cell: ({ row }) => (
                    <TypeBadge
                        type={row.original.type}
                    />
                ),
            },
            {
                id: "date",
                header: "Data",
                cell: ({ row }) => (
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatHistoryDate(
                            row.original.date,
                        )}
                    </span>
                ),
            },
            {
                id: "tags",
                header: "Tags",
                cell: ({ row }) => (
                    <div className="w-full min-w-0">
                        <AdaptiveTags
                            tags={row.original.tags}
                        />
                    </div>
                ),
            },
            {
                id: "amount",
                header: () => (
                    <span className="block text-right">
                        Valor
                    </span>
                ),
                cell: ({ row }) => {
                    const income = row.original.type === "INCOME";

                    return (
                        <span
                            className={cn(
                                `
                                    money-nums
                                    block whitespace-nowrap
                                    text-right
                                    text-sm font-bold
                                `,
                                income
                                    ? "text-success"
                                    : "text-danger",
                            )}
                        >
                            {income ? "+" : "−"}{" "}
                            {formatHistoryCurrency(
                                row.original.amountCents,
                            )}
                        </span>
                    );
                },
            },
        ],
        [],
    );

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="overflow-hidden">
            <header
                className="
                    flex min-w-0
                    items-start justify-between
                    gap-4
                    border-b border-border
                    px-4 py-4
                    sm:items-center
                    sm:px-5
                "
            >
                <div className="min-w-0">
                    <h2 className="text-base font-bold text-foreground">
                        Movimentações detalhadas
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Receitas e despesas conforme os filtros aplicados.
                    </p>
                </div>

                {totalItems > 0 && (
                    <Badge
                        className="
                            h-7 shrink-0
                            rounded-md
                            px-2.5
                            text-xs font-semibold
                        "
                    >
                        {totalItems}{" "}
                        {totalItems === 1 ? "item" : "itens"}
                    </Badge>
                )}
            </header>

            {loading && transactions.length === 0 ? (
                <div className="space-y-3 p-4 sm:p-5">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="
                                h-[68px]
                                animate-pulse
                                rounded-card-sm
                                bg-surface-muted
                            "
                        />
                    ))}
                </div>
            ) : error ? (
                <div
                    className="
                        flex min-h-72
                        flex-col
                        items-center justify-center
                        px-5 py-12
                        text-center
                    "
                >
                    <h3 className="text-base font-bold text-foreground">
                        Não foi possível carregar as movimentações
                    </h3>

                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                        {error}
                    </p>

                    <Button
                        className="mt-5"
                        variant="secondary"
                        onClick={onRetry}
                    >
                        Tentar novamente
                    </Button>
                </div>
            ) : transactions.length === 0 ? (
                <div
                    className="
                        flex min-h-72
                        flex-col
                        items-center justify-center
                        px-5 py-12
                        text-center
                    "
                >
                    <span
                        className="
                            flex size-12
                            items-center justify-center
                            rounded-card-sm
                            bg-surface-muted
                            text-muted-foreground
                        "
                    >
                        <FileText
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <h3 className="mt-4 text-base font-bold text-foreground">
                        Nenhuma movimentação encontrada
                    </h3>

                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                        {hasFilters
                            ? "Tente ajustar ou remover os filtros para ampliar os resultados."
                            : "As receitas e despesas cadastradas aparecerão aqui."}
                    </p>

                    {hasFilters && (
                        <Button
                            className="mt-5"
                            variant="secondary"
                            onClick={onClearFilters}
                        >
                            Limpar filtros
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[900px] table-fixed">
                            <colgroup>
                                <col className="w-[34%]" />
                                <col className="w-[13%]" />
                                <col className="w-[14%]" />
                                <col className="w-[25%]" />
                                <col className="w-[14%]" />
                            </colgroup>

                            <thead className="bg-surface-raised">
                                {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                        <tr
                                            key={headerGroup.id}
                                            className="border-b border-border"
                                        >
                                            {headerGroup.headers.map(
                                                (header) => (
                                                    <th
                                                        key={header.id}
                                                        className="
                                                            px-5 py-3
                                                            text-left
                                                            text-xs font-bold
                                                            uppercase
                                                            tracking-[0.06em]
                                                            text-subtle-foreground
                                                        "
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext(),
                                                            )}
                                                    </th>
                                                ),
                                            )}
                                        </tr>
                                    ))}
                            </thead>

                            <tbody className="divide-y divide-border">
                                {table
                                    .getRowModel()
                                    .rows
                                    .map((row, index) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{
                                                opacity: 0,
                                                y: 8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                ...ITEM_TRANSITION,
                                                delay: Math.min(
                                                    index * 0.035,
                                                    0.18,
                                                ),
                                            }}
                                            className="
                                                transition-colors
                                                hover:bg-surface-raised/70
                                            "
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="
                                                            px-5 py-3.5
                                                            align-middle
                                                        "
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef
                                                                .cell,
                                                            cell.getContext(),
                                                        )}
                                                    </td>
                                                ))}
                                        </motion.tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-border lg:hidden">
                        {transactions.map((transaction, index) => {
                            const income = transaction.type === "INCOME";

                            return (
                                <motion.article
                                    key={transaction.id}
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        ...ITEM_TRANSITION,
                                        delay: Math.min(
                                            index * 0.035,
                                            0.18,
                                        ),
                                    }}
                                    className="
                                        px-4 py-4
                                        transition-colors
                                        active:bg-surface-raised/65
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
                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                {transaction.isRecurring && (
                                                    <RecurringIndicator />
                                                )}

                                                <h3
                                                    title={transaction.description}
                                                    className="
                                                        truncate
                                                        text-sm font-bold
                                                        text-foreground
                                                    "
                                                >
                                                    {transaction.description}
                                                </h3>
                                            </div>

                                            <p
                                                title={
                                                    transaction.notes
                                                    || transaction.category
                                                }
                                                className="
                                                    mt-1 truncate
                                                    text-xs
                                                    text-subtle-foreground
                                                "
                                            >
                                                {transaction.notes
                                                    || transaction.category
                                                    || "Sem observações"}
                                            </p>
                                        </div>

                                        <p
                                            className={cn(
                                                `
                                                    money-nums
                                                    shrink-0
                                                    whitespace-nowrap
                                                    text-sm font-bold
                                                `,
                                                income
                                                    ? "text-success"
                                                    : "text-danger",
                                            )}
                                        >
                                            {income ? "+" : "−"}{" "}
                                            {formatHistoryCurrency(
                                                transaction.amountCents,
                                            )}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            mt-2.5
                                            flex flex-wrap
                                            items-center gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                inline-flex
                                                items-center gap-1.5
                                                text-xs
                                                text-subtle-foreground
                                            "
                                        >
                                            <CalendarDays
                                                aria-hidden="true"
                                                className="size-3.5 shrink-0"
                                            />

                                            {formatHistoryDate(
                                                transaction.date,
                                            )}
                                        </span>

                                        <TypeBadge
                                            type={transaction.type}
                                        />
                                    </div>

                                    <div className="mt-3 w-full min-w-0">
                                        <AdaptiveTags
                                            tags={transaction.tags}
                                        />
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </>
            )}

            {totalItems > PAGE_SIZE && (
                <HistoryPagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    disabled={loading}
                />
            )}
        </Card>
    );
}

export default HistoryTransactionList;