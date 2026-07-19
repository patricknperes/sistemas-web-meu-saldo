import {
    useMemo,
} from "react";

import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import {
    Card,
} from "../../../components/ui/Card.jsx";
import {
    cn,
} from "../../../lib/cn.js";
import {
    formatHistoryCurrency,
} from "../utils/historyFormatters.js";

function HistoryMonthlyTimeline({
    monthly = [],
    loading = false,
    onSelectMonth,
}) {
    const orderedMonthly = useMemo(
        () => [...monthly].reverse(),
        [monthly],
    );

    return (
        <Card
            className="
                min-w-0
                overflow-hidden
                xl:col-span-7
            "
        >
            <header
                className="
                    flex min-w-0
                    items-start justify-between
                    gap-4
                    border-b border-border
                    p-5
                    sm:p-6
                "
            >
                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-foreground">
                        Resumo mensal
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        Selecione um mês para abrir o recorte detalhado.
                    </p>
                </div>

                <span
                    className="
                        flex size-10
                        shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-primary-soft
                        text-primary
                    "
                >
                    <CalendarDays
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>
            </header>

            {loading ? (
                <LoadingState />
            ) : orderedMonthly.length === 0 ? (
                <EmptyState />
            ) : (
                <div
                    className="
                        max-h-[288px]
                        divide-y divide-border
                        overflow-y-auto
                        overscroll-y-contain

                        [-ms-overflow-style:none]
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden

                        sm:max-h-[264px]
                    "
                >
                    {orderedMonthly.map(
                        (item) => (
                            <MonthlyItem
                                key={item.key}
                                item={item}
                                onSelect={onSelectMonth}
                            />
                        ),
                    )}
                </div>
            )}

            {orderedMonthly.length > 0 && (
                <footer
                    className="
                        flex min-h-14
                        items-center justify-end
                        border-t border-border
                        px-4 py-2.5
                        sm:px-6
                    "
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            onSelectMonth?.(null)
                        }
                    >
                        Ver período completo
                    </Button>
                </footer>
            )}
        </Card>
    );
}

function MonthlyItem({
    item,
    onSelect,
}) {
    const positive =
        Number(item.balanceCents) >= 0;

    const transactionCount =
        Number(item.transactionCount) || 0;

    return (
        <button
            type="button"
            onClick={() =>
                onSelect?.(item)
            }
            aria-label={`Abrir movimentações de ${item.fullLabel}`}
            className="
                group
                grid h-24
                w-full min-w-0
                grid-cols-[minmax(0,1fr)_auto]
                items-center
                gap-4
                px-4
                text-left
                outline-none
                transition-colors

                hover:bg-surface-raised

                focus-visible:bg-primary-soft
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-primary/25

                sm:h-[88px]
                sm:grid-cols-[minmax(150px,1fr)_minmax(220px,auto)_auto]
                sm:px-6
            "
        >
            <div className="min-w-0">
                <p
                    title={item.fullLabel}
                    className="truncate text-sm font-bold text-foreground"
                >
                    {item.fullLabel}
                </p>

                <p className="mt-1 truncate text-xs text-subtle-foreground">
                    {transactionCount}{" "}
                    {transactionCount === 1
                        ? "movimentação"
                        : "movimentações"}
                </p>
            </div>

            <div
                className="
                    hidden min-w-0
                    items-center
                    justify-end
                    gap-5
                    sm:flex
                "
            >
                <MonthlyValue
                    icon={ArrowUpRight}
                    label="Receitas"
                    valueCents={item.totalIncomeCents}
                    tone="success"
                />

                <MonthlyValue
                    icon={ArrowDownRight}
                    label="Despesas"
                    valueCents={item.totalExpenseCents}
                    tone="danger"
                />
            </div>

            <strong
                title={formatHistoryCurrency(
                    item.balanceCents,
                )}
                className={cn(
                    `
                        money-nums
                        max-w-32
                        shrink-0
                        truncate
                        text-right
                        text-sm font-bold
                        sm:max-w-40
                    `,
                    positive
                        ? "text-success"
                        : "text-danger",
                )}
            >
                {formatHistoryCurrency(
                    item.balanceCents,
                )}
            </strong>

            <div
                className="
                    col-span-2
                    flex min-w-0
                    items-center
                    gap-4
                    sm:hidden
                "
            >
                <MobileMonthlyValue
                    icon={ArrowUpRight}
                    label="Receitas"
                    valueCents={item.totalIncomeCents}
                    tone="success"
                />

                <span
                    aria-hidden="true"
                    className="h-4 w-px shrink-0 bg-border"
                />

                <MobileMonthlyValue
                    icon={ArrowDownRight}
                    label="Despesas"
                    valueCents={item.totalExpenseCents}
                    tone="danger"
                />
            </div>
        </button>
    );
}

function MonthlyValue({
    icon: Icon,
    label,
    valueCents,
    tone,
}) {
    const toneClassName =
        tone === "success"
            ? "text-success"
            : "text-danger";

    return (
        <div className="min-w-0">
            <span
                className="
                    flex items-center
                    gap-1
                    whitespace-nowrap
                    text-[11px]
                    text-subtle-foreground
                "
            >
                <Icon
                    aria-hidden="true"
                    className={cn(
                        "size-3",
                        toneClassName,
                    )}
                />

                {label}
            </span>

            <strong
                className={cn(
                    `
                        money-nums
                        mt-0.5 block
                        max-w-32
                        truncate
                        text-xs
                    `,
                    toneClassName,
                )}
            >
                {formatHistoryCurrency(
                    valueCents,
                )}
            </strong>
        </div>
    );
}

function MobileMonthlyValue({
    icon: Icon,
    label,
    valueCents,
    tone,
}) {
    const toneClassName =
        tone === "success"
            ? "text-success"
            : "text-danger";

    return (
        <span
            className="
                flex min-w-0
                items-center
                gap-1.5
            "
        >
            <Icon
                aria-hidden="true"
                className={cn(
                    "size-3.5 shrink-0",
                    toneClassName,
                )}
            />

            <span className="truncate text-[11px] text-subtle-foreground">
                {label}
            </span>

            <strong
                className={cn(
                    `
                        money-nums
                        max-w-24
                        truncate
                        text-[11px]
                    `,
                    toneClassName,
                )}
            >
                {formatHistoryCurrency(
                    valueCents,
                )}
            </strong>
        </span>
    );
}

function LoadingState() {
    return (
        <div
            className="
                max-h-[288px]
                overflow-hidden
                sm:max-h-[264px]
            "
        >
            {[1, 2, 3].map(
                (item) => (
                    <div
                        key={item}
                        className="
                            flex h-24
                            items-center
                            border-b border-border
                            px-4
                            sm:h-[88px]
                            sm:px-6
                        "
                    >
                        <div className="w-full animate-pulse">
                            <div className="h-3.5 w-32 rounded-full bg-surface-muted" />
                            <div className="mt-2 h-3 w-20 rounded-full bg-surface-muted" />
                        </div>

                        <div className="h-4 w-24 animate-pulse rounded-full bg-surface-muted" />
                    </div>
                ),
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div
            className="
                flex min-h-[264px]
                flex-col
                items-center justify-center
                px-6 py-12
                text-center
            "
        >
            <span
                className="
                    flex size-12
                    items-center justify-center
                    rounded-2xl
                    bg-primary-soft
                    text-primary
                "
            >
                <CalendarDays
                    aria-hidden="true"
                    className="size-5"
                />
            </span>

            <p className="mt-4 text-sm font-semibold text-foreground">
                Nenhum mês encontrado
            </p>

            <p
                className="
                    mt-1
                    max-w-sm
                    text-xs leading-5
                    text-muted-foreground
                "
            >
                Nenhum mês possui movimentações com os filtros atuais.
            </p>
        </div>
    );
}

export default HistoryMonthlyTimeline;