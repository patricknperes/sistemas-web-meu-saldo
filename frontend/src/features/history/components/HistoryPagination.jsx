import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import { buildHistoryPaginationItems } from "../utils/historyFormatters.js";

const PAGE_SIZE = 10;

function HistoryPagination({
    pagination,
    onPageChange,
    disabled = false,
}) {
    const totalItems = Number(
        pagination?.totalItems
        ?? pagination?.total
        ?? 0,
    );

    const pageSize = Number(
        pagination?.pageSize
        ?? pagination?.limit
        ?? pagination?.size
        ?? PAGE_SIZE,
    ) || PAGE_SIZE;

    const apiTotalPages = Number(
        pagination?.totalPages,
    ) || 0;

    const calculatedTotalPages = Math.ceil(
        totalItems / pageSize,
    );

    const totalPages = Math.max(
        apiTotalPages,
        calculatedTotalPages,
    );

    const requestedPage = Number(
        pagination?.page,
    ) || 1;

    const currentPage = Math.min(
        Math.max(requestedPage, 1),
        Math.max(totalPages, 1),
    );

    const pages = buildHistoryPaginationItems(
        currentPage,
        totalPages,
    );

    if (totalItems <= 0) {
        return null;
    }

    if (totalPages <= 1) {
        return (
            <p
                className="
                    border-t border-border
                    px-4 py-3
                    text-center
                    text-xs
                    text-subtle-foreground
                    sm:px-5
                "
            >
                {totalItems}{" "}
                {totalItems === 1
                    ? "movimentação encontrada"
                    : "movimentações encontradas"}
            </p>
        );
    }

    const firstItem = (
        (currentPage - 1) * pageSize
    ) + 1;

    const lastItem = Math.min(
        currentPage * pageSize,
        totalItems,
    );

    function handlePageChange(nextPage) {
        if (
            disabled
            || nextPage < 1
            || nextPage > totalPages
            || nextPage === currentPage
        ) {
            return;
        }

        onPageChange?.(nextPage);
    }

    return (
        <footer
            className="
                flex flex-col gap-3
                border-t border-border
                px-4 py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
            "
        >
            <p className="text-center text-xs text-subtle-foreground sm:text-left">
                Exibindo {firstItem}–{lastItem} de{" "}
                {totalItems} movimentações
            </p>

            <nav
                aria-label="Paginação do histórico"
                className="
                    flex min-w-0
                    items-center justify-center
                    gap-1
                    sm:justify-end
                "
            >
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                        disabled
                        || currentPage <= 1
                    }
                    onClick={() => {
                        handlePageChange(
                            currentPage - 1,
                        );
                    }}
                    aria-label="Página anterior"
                    title="Página anterior"
                    className="
                        size-9
                        min-h-9 min-w-9
                        shrink-0
                    "
                >
                    <ChevronLeft
                        aria-hidden="true"
                        className="size-4"
                    />
                </Button>

                {pages.map((page, index) => {
                    const previousPage = pages[index - 1];

                    const hasGap = previousPage
                        && page - previousPage > 1;

                    return (
                        <span
                            key={page}
                            className="contents"
                        >
                            {hasGap && (
                                <span
                                    aria-hidden="true"
                                    className="
                                        inline-flex size-9
                                        items-center justify-center
                                        text-sm
                                        text-subtle-foreground
                                    "
                                >
                                    …
                                </span>
                            )}

                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => {
                                    handlePageChange(page);
                                }}
                                aria-label={`Ir para a página ${page}`}
                                aria-current={
                                    page === currentPage
                                        ? "page"
                                        : undefined
                                }
                                className="
                                    inline-flex size-9
                                    shrink-0
                                    items-center justify-center
                                    rounded-control-sm
                                    text-sm font-semibold
                                    text-muted-foreground
                                    outline-none
                                    transition-colors

                                    hover:bg-primary-soft
                                    hover:text-primary

                                    focus-visible:ring-2
                                    focus-visible:ring-primary/30

                                    aria-[current=page]:bg-primary
                                    aria-[current=page]:text-primary-foreground

                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                {page}
                            </button>
                        </span>
                    );
                })}

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                        disabled
                        || currentPage >= totalPages
                    }
                    onClick={() => {
                        handlePageChange(
                            currentPage + 1,
                        );
                    }}
                    aria-label="Próxima página"
                    title="Próxima página"
                    className="
                        size-9
                        min-h-9 min-w-9
                        shrink-0
                    "
                >
                    <ChevronRight
                        aria-hidden="true"
                        className="size-4"
                    />
                </Button>
            </nav>
        </footer>
    );
}

export default HistoryPagination;