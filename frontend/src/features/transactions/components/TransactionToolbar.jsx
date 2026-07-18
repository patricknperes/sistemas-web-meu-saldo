import { Filter, RefreshCw, Search, Tags } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import Badge from "../../../components/ui/Badge.jsx";

function TransactionToolbar({
    search,
    onSearchChange,
    searchPlaceholder,
    periodLabel,
    activeFilterCount,
    onOpenFilters,
    onOpenTags,
    onRefresh,
    refreshing,
}) {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-card border border-border bg-surface p-3 shadow-xs sm:p-4 lg:flex-row lg:items-center">
            <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                leadingIcon={Search}
                placeholder={searchPlaceholder}
                aria-label="Pesquisar movimentações"
                className="min-w-0 flex-1"
                inputClassName="text-sm"
            />

            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={onOpenFilters} className="min-w-0 flex-1 sm:flex-none">
                    <Filter className="size-4" aria-hidden="true" />
                    <span className="truncate">{periodLabel}</span>
                    {activeFilterCount > 0 && <Badge variant="primary" className="h-5 px-1.5">{activeFilterCount}</Badge>}
                </Button>
                <Button variant="secondary" onClick={onOpenTags} className="flex-1 sm:flex-none">
                    <Tags className="size-4" aria-hidden="true" />Tags
                </Button>
                <Button variant="ghost" size="icon" onClick={onRefresh} disabled={refreshing} aria-label="Atualizar lista" title="Atualizar lista">
                    <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}

export default TransactionToolbar;
