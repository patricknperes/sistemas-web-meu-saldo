import {
    Filter,
    RefreshCw,
    Search,
    Tags,
} from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import { cn } from "../../../lib/cn.js";

const MONTH_ABBREVIATIONS = {
    janeiro: "Jan",
    fevereiro: "Fev",
    março: "Mar",
    abril: "Abr",
    maio: "Mai",
    junho: "Jun",
    julho: "Jul",
    agosto: "Ago",
    setembro: "Set",
    outubro: "Out",
    novembro: "Nov",
    dezembro: "Dez",
};

function getCompactPeriodLabel(periodLabel) {
    const label = String(periodLabel ?? "").trim();

    const match = label.match(
        /^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de)?\s+(\d{4})$/i,
    );

    if (!match) {
        return label;
    }

    const monthName = match[1].toLocaleLowerCase("pt-BR");
    const abbreviatedMonth = MONTH_ABBREVIATIONS[monthName];

    return abbreviatedMonth
        ? `${abbreviatedMonth} ${match[2]}`
        : label;
}

function TransactionToolbar({
    search,
    onSearchChange,
    searchPlaceholder,
    periodLabel,
    mobileFilterLabel,
    activeFilterCount,
    onOpenFilters,
    onOpenTags,
    onRefresh,
    refreshing,
}) {
    const normalizedActiveFilterCount = Math.max(
        Number(activeFilterCount) || 0,
        0,
    );

    const hasActiveFilters = normalizedActiveFilterCount > 0;

    const compactPeriodLabel = getCompactPeriodLabel(
        periodLabel,
    );

    return (
        <div
            className="
                flex min-w-0
                flex-col gap-3
                rounded-card
                border border-border
                bg-surface
                p-3
                shadow-xs
                sm:p-4
                lg:flex-row
                lg:items-center
            "
        >
            <div
                className="
                    min-w-0 flex-1
                    [&_input]:h-11
                    [&_input]:min-h-11
                    [&_input]:w-full
                    [&_svg]:text-primary
                "
            >
                <Input
                    value={search}
                    onChange={(event) => {
                        onSearchChange(event.target.value);
                    }}
                    leadingIcon={Search}
                    placeholder={searchPlaceholder}
                    aria-label="Pesquisar movimentações"
                    className="w-full min-w-0"
                    inputClassName="
                        h-11
                        min-h-11
                        w-full
                        text-sm
                    "
                />
            </div>

            <div
                className="
                    grid min-w-0
                    grid-cols-2 gap-2
                    sm:flex
                    sm:items-center
                    sm:justify-end
                "
            >
                <Button
                    type="button"
                    onClick={onOpenFilters}
                    title={periodLabel}
                    aria-label={`Abrir filtros: ${periodLabel}`}
                    className="
                        h-11 min-h-11
                        w-full min-w-0
                        justify-center
                        bg-primary
                        px-3
                        text-primary-foreground
                        shadow-xs
                        hover:bg-primary-hover
                        hover:text-primary-foreground
                        active:bg-primary-active
                        sm:w-auto
                        sm:min-w-[170px]
                        sm:px-4
                    "
                >
                    <Filter
                        aria-hidden="true"
                        className="size-4 shrink-0"
                    />

                    <span className="min-w-0 truncate sm:hidden">
                        {mobileFilterLabel || compactPeriodLabel}
                    </span>

                    <span className="hidden min-w-0 truncate sm:inline">
                        {periodLabel}
                    </span>

                    {hasActiveFilters && (
                        <Badge
                            aria-label={`${normalizedActiveFilterCount} filtros ativos`}
                            className="
                                !grid
                                h-5 min-w-5
                                shrink-0
                                place-items-center
                                rounded-full
                                border-0
                                bg-white
                                px-1
                                py-0
                                text-center
                                font-mono
                                text-[10px]
                                font-bold
                                leading-none
                                tabular-nums
                                text-primary
                                shadow-none
                                dark:bg-primary-foreground
                                dark:text-primary
                            "
                        >
                            <span className="block leading-none">
                                {normalizedActiveFilterCount}
                            </span>
                        </Badge>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onOpenTags}
                    className="
                        h-11 min-h-11
                        w-full
                        justify-center
                        border border-primary/20
                        bg-surface
                        px-4
                        text-primary
                        shadow-none
                        hover:border-primary/40
                        hover:bg-primary-soft
                        hover:text-primary
                        sm:w-auto
                        sm:min-w-[112px]
                    "
                >
                    <Tags
                        aria-hidden="true"
                        className="size-4 shrink-0"
                    />

                    Tags
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRefresh}
                    disabled={refreshing}
                    aria-label="Atualizar lista"
                    title="Atualizar lista"
                    className={cn(
                        `
                            hidden size-11
                            min-h-11 min-w-11
                            shrink-0
                            bg-transparent
                            text-primary
                            shadow-none
                            hover:bg-primary-soft
                            hover:text-primary-hover
                            focus-visible:bg-primary-soft
                            disabled:bg-transparent
                            sm:inline-flex
                        `,
                        refreshing && "pointer-events-none",
                    )}
                >
                    <RefreshCw
                        aria-hidden="true"
                        className={cn(
                            "size-5",
                            refreshing && "animate-spin",
                        )}
                    />
                </Button>
            </div>
        </div>
    );
}

export default TransactionToolbar;