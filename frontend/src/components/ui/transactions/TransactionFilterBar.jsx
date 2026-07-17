import {
    RiCloseLine,
    RiFilter3Line,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import SearchInput from "../forms/SearchInput.jsx";
import PeriodPicker from "../date-picker/PeriodPicker.jsx";
import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

function TransactionFilterBar({
    searchValue = "",
    onSearchChange,
    onSearchClear,
    searchPlaceholder = "Pesquisar por descrição",
    period,
    onPeriodChange,
    activeFilterCount = 0,
    onOpenFilters,
    onClearFilters,
    resultCount,
    loading = false,
    className = "",
    children,
}) {
    const hasAdvancedFilters = Number(activeFilterCount) > 0;

    return (
        <div
            className={normalizeClassName(`
                grid min-w-0 gap-3
                rounded-xl border border-border
                bg-surface p-3 shadow-xs
                lg:grid-cols-[minmax(15rem,1fr)_auto]
                lg:items-center
                ${className}
            `)}
        >
            <div className="min-w-0">
                <SearchInput
                    value={searchValue}
                    placeholder={searchPlaceholder}
                    disabled={loading}
                    onChange={(event) => onSearchChange?.(event.target.value, event)}
                    onClear={() => {
                        onSearchClear?.();
                        onSearchChange?.("");
                    }}
                />
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <PeriodPicker
                    value={period}
                    onChange={onPeriodChange}
                    disabled={loading}
                    className="w-full sm:w-auto"
                />

                {children}

                {onOpenFilters ? (
                    <Button
                        variant={hasAdvancedFilters ? "soft" : "outline"}
                        leadingIcon={<RiFilter3Line size={17} aria-hidden="true" />}
                        disabled={loading}
                        onClick={onOpenFilters}
                        className="w-full justify-center sm:w-auto"
                    >
                        Filtros
                        {hasAdvancedFilters ? (
                            <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-pill bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        ) : null}
                    </Button>
                ) : null}

                {hasAdvancedFilters && onClearFilters ? (
                    <Button
                        variant="ghost"
                        leadingIcon={<RiCloseLine size={17} aria-hidden="true" />}
                        disabled={loading}
                        onClick={onClearFilters}
                        className="w-full justify-center sm:w-auto"
                    >
                        Limpar
                    </Button>
                ) : null}
            </div>

            {Number.isFinite(Number(resultCount)) ? (
                <p className="text-caption text-muted-foreground lg:col-span-2">
                    {loading
                        ? "Atualizando resultados…"
                        : `${resultCount} ${Number(resultCount) === 1 ? "resultado encontrado" : "resultados encontrados"}`
                    }
                </p>
            ) : null}
        </div>
    );
}

export default TransactionFilterBar;
