import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";

const PAGE_SIZE = 10;

function HistoryPagination({
    pagination,
    onPageChange,
    disabled = false,
}) {
    const totalItems = Math.max(
        Number(
            pagination?.totalItems
            ?? pagination?.total
            ?? 0,
        ) || 0,
        0,
    );

    const pageSize = Math.max(
        Number(
            pagination?.pageSize
            ?? pagination?.limit
            ?? pagination?.size
            ?? PAGE_SIZE,
        ) || PAGE_SIZE,
        1,
    );

    const calculatedTotalPages = Math.ceil(
        totalItems / pageSize,
    );

    const totalPages = Math.max(
        Number(pagination?.totalPages) || 0,
        calculatedTotalPages,
        1,
    );

    const requestedPage = Number(
        pagination?.page,
    ) || 1;

    const currentPage = Math.min(
        Math.max(requestedPage, 1),
        totalPages,
    );

    const firstItem = totalItems > 0
        ? ((currentPage - 1) * pageSize) + 1
        : 0;

    const lastItem = Math.min(
        currentPage * pageSize,
        totalItems,
    );

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    );

    function handlePageChange(nextPage) {
        const normalizedPage = Number(nextPage);

        if (
            disabled
            || !Number.isFinite(normalizedPage)
            || normalizedPage < 1
            || normalizedPage > totalPages
            || normalizedPage === currentPage
        ) {
            return;
        }

        onPageChange?.(normalizedPage);
    }

    if (totalItems <= 0) {
        return null;
    }

    return (
        <footer
            className="
                overflow-x-auto
                overscroll-x-contain
                border-t border-border
                px-4 py-3
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:px-5
            "
        >
            <div
                className="
                    flex min-w-max
                    flex-nowrap
                    items-center justify-between
                    gap-5
                    whitespace-nowrap
                "
            >
                <p className="shrink-0 text-xs text-subtle-foreground">
                    <span className="sm:hidden">
                        {firstItem}–{lastItem} de {totalItems}
                    </span>

                    <span className="hidden sm:inline">
                        Exibindo {firstItem}–{lastItem} de {totalItems} movimentações
                    </span>
                </p>

                <nav
                    aria-label="Paginação do histórico"
                    className="
                        ml-auto
                        flex shrink-0
                        flex-nowrap
                        items-center
                        gap-2
                    "
                >
                    <span className="hidden text-xs text-subtle-foreground sm:inline">
                        Página
                    </span>

                    <Select
                        value={String(currentPage)}
                        disabled={disabled || totalPages <= 1}
                        onValueChange={handlePageChange}
                    >
                        <SelectTrigger
                            aria-label="Selecionar página do histórico"
                            className="
                                h-9 w-[70px]
                                shrink-0
                                px-2.5
                                text-sm
                            "
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent align="end">
                            {pages.map((page) => (
                                <SelectItem
                                    key={page}
                                    value={String(page)}
                                >
                                    {page}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="text-xs text-subtle-foreground">
                        de {totalPages}
                    </span>

                    <span
                        aria-hidden="true"
                        className="mx-1 h-6 w-px shrink-0 bg-border"
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || currentPage <= 1}
                        onClick={() => {
                            handlePageChange(currentPage - 1);
                        }}
                        aria-label="Página anterior"
                        title="Página anterior"
                        className="size-9 shrink-0"
                    >
                        <ChevronLeft
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || currentPage >= totalPages}
                        onClick={() => {
                            handlePageChange(currentPage + 1);
                        }}
                        aria-label="Próxima página"
                        title="Próxima página"
                        className="size-9 shrink-0"
                    >
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Button>
                </nav>
            </div>
        </footer>
    );
}

export default HistoryPagination;
