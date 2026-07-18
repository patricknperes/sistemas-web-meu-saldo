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
    Edit3,
    MoreVertical,
    RotateCw,
    Trash2,
} from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import { cn } from "../../../lib/cn.js";
import {
    formatCurrencyCents,
    formatTransactionDate,
} from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";
import TransactionEmptyState from "./TransactionEmptyState.jsx";
import TransactionLoadingState from "./TransactionLoadingState.jsx";
import TransactionPagination from "./TransactionPagination.jsx";

const TAG_GAP = 6;

function TransactionTypeIcon({
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
                bg-success-muted/70
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

function TagsCell({
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

function TransactionActionsMenu({
    transaction,
    onEdit,
    onDelete,
}) {
    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={
                        `Abrir ações de ${transaction.description}`
                    }
                    title="Mais ações"
                >
                    <MoreVertical
                        aria-hidden="true"
                        className="size-4"
                    />
                </IconButton>
            </DropdownMenuPrimitive.Trigger>

            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align="end"
                    sideOffset={6}
                    collisionPadding={12}
                    className="
                        z-[100]
                        min-w-44
                        overflow-hidden
                        rounded-control
                        border border-border
                        bg-surface
                        p-1.5
                        shadow-dialog
                        outline-none

                        data-[state=open]:animate-in
                        data-[state=open]:fade-in-0
                        data-[state=open]:zoom-in-95
                        data-[side=bottom]:slide-in-from-top-1
                        data-[side=top]:slide-in-from-bottom-1
                    "
                >
                    <DropdownMenuPrimitive.Item
                        onSelect={() => {
                            onEdit(transaction);
                        }}
                        className="
                            flex h-9
                            cursor-pointer
                            select-none
                            items-center gap-2.5
                            rounded-control-sm
                            px-2.5
                            text-sm font-medium
                            text-foreground
                            outline-none
                            transition-colors
                            focus:bg-surface-hover
                        "
                    >
                        <Edit3
                            aria-hidden="true"
                            className="
                                size-4
                                text-muted-foreground
                            "
                        />

                        Editar
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Separator
                        className="my-1 h-px bg-border"
                    />

                    <DropdownMenuPrimitive.Item
                        onSelect={() => {
                            onDelete(transaction);
                        }}
                        className="
                            flex h-9
                            cursor-pointer
                            select-none
                            items-center gap-2.5
                            rounded-control-sm
                            px-2.5
                            text-sm font-medium
                            text-danger
                            outline-none
                            transition-colors
                            focus:bg-danger-muted
                            focus:text-danger
                        "
                    >
                        <Trash2
                            aria-hidden="true"
                            className="size-4"
                        />

                        Excluir
                    </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}

function TransactionList({
    transactions = [],
    pagination,
    config,
    loading,
    error,
    hasFilters,
    onRetry,
    onCreate,
    onClearFilters,
    onEdit,
    onDelete,
    onPageChange,
}) {
    const columns = useMemo(
        () => [
            {
                id: "description",
                header: "Movimentação",
                cell: ({ row }) => (
                    <div className="flex min-w-0 items-center gap-3">
                        <TransactionTypeIcon
                            type={config.type}
                            recurring={row.original.isRecurring}
                        />

                        <div className="min-w-0">
                            <p
                                title={row.original.description}
                                className="
                                    truncate
                                    text-sm font-bold
                                    text-foreground
                                "
                            >
                                {row.original.description}
                            </p>

                            <p
                                title={
                                    row.original.notes
                                    || row.original.category
                                }
                                className="
                                    mt-0.5 truncate
                                    text-xs
                                    text-subtle-foreground
                                "
                            >
                                {row.original.notes
                                    || row.original.category
                                    || "Sem observações"}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                id: "date",
                header: "Data",
                cell: ({ row }) => (
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatTransactionDate(
                            row.original.date,
                            "dd/MM/yyyy",
                        )}
                    </span>
                ),
            },
            {
                id: "tags",
                header: "Tags",
                cell: ({ row }) => (
                    <div className="min-w-[190px] max-w-[300px]">
                        <TagsCell
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
                cell: ({ row }) => (
                    <span
                        className={cn(
                            `
                                money-nums
                                block whitespace-nowrap
                                text-right
                                text-sm font-bold
                            `,
                            config.type === "INCOME"
                                ? "text-success"
                                : "text-danger",
                        )}
                    >
                        {config.type === "INCOME" ? "+" : "−"}{" "}
                        {formatCurrencyCents(
                            row.original.amountCents,
                        )}
                    </span>
                ),
            },
            {
                id: "actions",
                header: () => (
                    <span className="sr-only">
                        Ações
                    </span>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <TransactionActionsMenu
                            transaction={row.original}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                ),
            },
        ],
        [
            config.type,
            onDelete,
            onEdit,
        ],
    );

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="overflow-hidden">
            {loading && transactions.length === 0 ? (
                <TransactionLoadingState />
            ) : error ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                    <h3 className="text-base font-bold text-foreground">
                        Não foi possível carregar a lista
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
                <TransactionEmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    hasFilters={hasFilters}
                    onCreate={onCreate}
                    onClearFilters={onClearFilters}
                />
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[840px] table-fixed">
                            <colgroup>
                                <col className="w-[34%]" />
                                <col className="w-[15%]" />
                                <col className="w-[29%]" />
                                <col className="w-[16%]" />
                                <col className="w-[6%]" />
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
                                    .map((row) => (
                                        <tr
                                            key={row.id}
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
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-border lg:hidden">
                        {transactions.map((transaction) => (
                            <article
                                key={transaction.id}
                                className="
                                    px-4 py-4
                                    transition-colors
                                    active:bg-surface-raised/65
                                "
                            >
                                <div className="min-w-0">
                                    <div className="flex min-w-0 items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
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

                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <p
                                                    className="
                                                        flex items-center
                                                        gap-1.5
                                                        text-xs
                                                        text-subtle-foreground
                                                    "
                                                >
                                                    <CalendarDays
                                                        aria-hidden="true"
                                                        className="
                                                            size-3.5
                                                            shrink-0
                                                        "
                                                    />

                                                    {formatTransactionDate(
                                                        transaction.date,
                                                        "dd/MM/yyyy",
                                                    )}
                                                </p>

                                                {transaction.isRecurring && (
                                                    <RecurringIndicator />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-start gap-1">
                                            <p
                                                className={cn(
                                                    `
                                                        money-nums
                                                        whitespace-nowrap
                                                        pt-1.5
                                                        text-sm font-bold
                                                    `,
                                                    config.type === "INCOME"
                                                        ? "text-success"
                                                        : "text-danger",
                                                )}
                                            >
                                                {config.type === "INCOME"
                                                    ? "+"
                                                    : "−"}{" "}
                                                {formatCurrencyCents(
                                                    transaction.amountCents,
                                                )}
                                            </p>

                                            <TransactionActionsMenu
                                                transaction={transaction}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 w-full min-w-0">
                                        <TagsCell
                                            tags={transaction.tags}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <TransactionPagination
                pagination={pagination}
                onPageChange={onPageChange}
                disabled={loading}
            />
        </Card>
    );
}

export default TransactionList;