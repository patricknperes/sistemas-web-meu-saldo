import {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    CalendarClock,
    Edit3,
    MoreVertical,
    Power,
    PowerOff,
    RotateCw,
    Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import { cn } from "../../../lib/cn.js";
import {
    formatCurrencyCents,
    formatTransactionDate,
    getIntervalLabel,
    getRecurringStatusVariant,
} from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";
import TransactionEmptyState from "./TransactionEmptyState.jsx";
import TransactionLoadingState from "./TransactionLoadingState.jsx";
import TransactionPagination from "./TransactionPagination.jsx";

const TAG_GAP = 6;

const ITEM_TRANSITION = {
    duration: 0.24,
    ease: [0.22, 1, 0.36, 1],
};

function getStatusLabel(status) {
    if (status === "ACTIVE") {
        return "Ativa";
    }

    if (status === "FINISHED") {
        return "Finalizada";
    }

    return "Desativada";
}

function RecurringIcon() {
    return (
        <span
            aria-hidden="true"
            className="
                flex size-10 shrink-0
                items-center justify-center
                rounded-control
                bg-success-muted
                text-success
            "
        >
            <RotateCw
                className="size-[18px]"
                strokeWidth={2.2}
            />
        </span>
    );
}

function MobileStatusBadge({ status }) {
    if (status === "ACTIVE") {
        return (
            <span
                className="
                    inline-flex h-6
                    shrink-0 items-center
                    justify-center
                    rounded-md
                    border border-success/20
                    bg-success-muted
                    px-2
                    text-[11px] font-bold
                    leading-none
                    text-success
                "
            >
                Ativa
            </span>
        );
    }

    if (status === "FINISHED") {
        return (
            <span
                className="
                    inline-flex h-6
                    shrink-0 items-center
                    justify-center
                    rounded-md
                    border border-border
                    bg-surface-muted
                    px-2
                    text-[11px] font-bold
                    leading-none
                    text-muted-foreground
                "
            >
                Finalizada
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex h-6
                shrink-0 items-center
                justify-center
                rounded-md
                border border-warning/20
                bg-warning-muted
                px-2
                text-[11px] font-bold
                leading-none
                text-warning
            "
        >
            Desativada
        </span>
    );
}

function AdaptiveTags({
    tags = [],
    className,
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
                (element) => element.getBoundingClientRect().width,
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
        <div
            className={cn(
                "relative w-full min-w-0",
                className,
            )}
        >
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
                                xl:max-w-36
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
                            xl:max-w-36
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

function RecurringActionsMenu({
    item,
    active,
    finished,
    toggling,
    onEdit,
    onDelete,
    onToggle,
}) {
    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={`Abrir ações de ${item.description}`}
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
                            onEdit(item);
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

                    <DropdownMenuPrimitive.Item
                        disabled={finished || toggling}
                        onSelect={() => {
                            onToggle(item, !active);
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
                            data-[disabled]:pointer-events-none
                            data-[disabled]:opacity-45
                        "
                    >
                        {active ? (
                            <PowerOff
                                aria-hidden="true"
                                className="
                                    size-4
                                    text-warning
                                "
                            />
                        ) : (
                            <Power
                                aria-hidden="true"
                                className="
                                    size-4
                                    text-success
                                "
                            />
                        )}

                        {toggling
                            ? "Atualizando..."
                            : active
                                ? "Desativar"
                                : "Ativar"}
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Separator
                        className="my-1 h-px bg-border"
                    />

                    <DropdownMenuPrimitive.Item
                        onSelect={() => {
                            onDelete(item);
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

function RecurringTransactionList({
    items = [],
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
    onToggle,
    onPageChange,
    togglingId,
}) {
    const amountClassName = config.type === "INCOME"
        ? "text-success"
        : "text-danger";

    const amountPrefix = config.type === "INCOME"
        ? "+"
        : "−";

    return (
        <Card className="overflow-hidden">
            {loading && items.length === 0 ? (
                <TransactionLoadingState />
            ) : error ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                    <h3 className="text-base font-bold text-foreground">
                        Não foi possível carregar as recorrências
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
            ) : items.length === 0 ? (
                <TransactionEmptyState
                    title={`Nenhuma ${config.singular} recorrente encontrada`}
                    description={`Crie uma regra para lançar ${config.plural} automaticamente quando a data programada chegar.`}
                    hasFilters={hasFilters}
                    onCreate={onCreate}
                    onClearFilters={onClearFilters}
                />
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[1060px] table-fixed">
                            <thead className="bg-surface-raised">
                                <tr className="border-b border-border">
                                    <th className="w-[27%] px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Recorrência
                                    </th>

                                    <th className="w-[12%] px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Valor
                                    </th>

                                    <th className="w-[15%] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Frequência
                                    </th>

                                    <th className="w-[15%] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Próxima
                                    </th>

                                    <th className="w-[20%] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Tags
                                    </th>

                                    <th className="w-[7%] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                                        Status
                                    </th>

                                    <th className="w-[4%] px-4 py-3">
                                        <span className="sr-only">
                                            Ações
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {items.map((item, index) => {
                                    const active = item.status === "ACTIVE";
                                    const finished = item.status === "FINISHED";
                                    const toggling = togglingId === item.id;

                                    return (
                                        <motion.tr
                                            key={item.id}
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
                                            <td className="px-5 py-3.5 align-middle">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <RecurringIcon />

                                                    <div className="min-w-0">
                                                        <h3
                                                            title={item.description}
                                                            className="
                                                                truncate
                                                                text-sm font-bold
                                                                text-foreground
                                                            "
                                                        >
                                                            {item.description}
                                                        </h3>

                                                        <p className="mt-0.5 truncate text-xs text-subtle-foreground">
                                                            Início em{" "}
                                                            {formatTransactionDate(
                                                                item.startDate,
                                                                "dd/MM/yyyy",
                                                            )}

                                                            {item.endDate
                                                                ? ` • termina em ${formatTransactionDate(
                                                                    item.endDate,
                                                                    "dd/MM/yyyy",
                                                                )}`
                                                                : " • sem data final"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <p
                                                    className={cn(
                                                        `
                                                            money-nums
                                                            whitespace-nowrap
                                                            text-right
                                                            text-sm font-bold
                                                        `,
                                                        amountClassName,
                                                    )}
                                                >
                                                    {amountPrefix}{" "}
                                                    {formatCurrencyCents(
                                                        item.amountCents,
                                                    )}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <p className="truncate text-sm font-semibold text-foreground">
                                                    {getIntervalLabel(
                                                        item.intervalMonths,
                                                    )}
                                                </p>

                                                <p className="mt-0.5 text-xs text-subtle-foreground">
                                                    Todo dia {item.dayOfMonth}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <p className="whitespace-nowrap text-sm font-semibold text-foreground">
                                                    {item.nextOccurrenceDate
                                                        ? formatTransactionDate(
                                                            item.nextOccurrenceDate,
                                                            "dd/MM/yyyy",
                                                        )
                                                        : "Sem previsão"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-subtle-foreground">
                                                    {item.generatedTransactionCount
                                                        ?? 0} geradas
                                                </p>
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <AdaptiveTags
                                                    tags={item.tags}
                                                />
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <Badge
                                                    variant={
                                                        getRecurringStatusVariant(
                                                            item.status,
                                                        )
                                                    }
                                                    className="shrink-0"
                                                >
                                                    {getStatusLabel(
                                                        item.status,
                                                    )}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-3.5 align-middle">
                                                <div className="flex justify-end">
                                                    <RecurringActionsMenu
                                                        item={item}
                                                        active={active}
                                                        finished={finished}
                                                        toggling={toggling}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                        onToggle={onToggle}
                                                    />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-border lg:hidden">
                        {items.map((item, index) => {
                            const active = item.status === "ACTIVE";
                            const finished = item.status === "FINISHED";
                            const toggling = togglingId === item.id;

                            return (
                                <motion.article
                                    key={item.id}
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
                                        active:bg-surface-raised/60
                                    "
                                >
                                    <div className="flex min-w-0 items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <RotateCw
                                                    aria-hidden="true"
                                                    className="
                                                        size-3.5
                                                        shrink-0
                                                        text-success
                                                    "
                                                    strokeWidth={2.2}
                                                />

                                                <h3
                                                    title={item.description}
                                                    className="
                                                        truncate
                                                        text-sm font-bold
                                                        text-foreground
                                                    "
                                                >
                                                    {item.description}
                                                </h3>
                                            </div>

                                            <p className="mt-1.5 truncate text-xs text-subtle-foreground">
                                                {getIntervalLabel(
                                                    item.intervalMonths,
                                                )}, dia {item.dayOfMonth}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1.5">
                                            <MobileStatusBadge
                                                status={item.status}
                                            />

                                            <RecurringActionsMenu
                                                item={item}
                                                active={active}
                                                finished={finished}
                                                toggling={toggling}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onToggle={onToggle}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="flex items-center gap-1.5 text-xs text-subtle-foreground">
                                                <CalendarClock
                                                    aria-hidden="true"
                                                    className="
                                                        size-3.5
                                                        shrink-0
                                                    "
                                                />

                                                Próxima em{" "}
                                                {item.nextOccurrenceDate
                                                    ? formatTransactionDate(
                                                        item.nextOccurrenceDate,
                                                        "dd/MM/yyyy",
                                                    )
                                                    : "data não definida"}
                                            </p>

                                            <p className="mt-1 text-xs text-subtle-foreground">
                                                {item.generatedTransactionCount
                                                    ?? 0} movimentações geradas
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
                                                amountClassName,
                                            )}
                                        >
                                            {amountPrefix}{" "}
                                            {formatCurrencyCents(
                                                item.amountCents,
                                            )}
                                        </p>
                                    </div>

                                    <div className="mt-3 w-full min-w-0">
                                        <AdaptiveTags
                                            tags={item.tags}
                                        />
                                    </div>

                                    <p className="mt-3 border-t border-border pt-2.5 text-xs text-subtle-foreground">
                                        Início em{" "}
                                        {formatTransactionDate(
                                            item.startDate,
                                            "dd/MM/yyyy",
                                        )}

                                        {item.endDate
                                            ? ` • termina em ${formatTransactionDate(
                                                item.endDate,
                                                "dd/MM/yyyy",
                                            )}`
                                            : " • sem data final"}
                                    </p>
                                </motion.article>
                            );
                        })}
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

export default RecurringTransactionList;