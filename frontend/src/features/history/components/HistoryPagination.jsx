import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import { buildHistoryPaginationItems } from "../utils/historyFormatters.js";

function HistoryPagination({ pagination, onPageChange, disabled = false }) {
    const currentPage = Number(pagination?.page) || 1;
    const totalPages = Number(pagination?.totalPages) || 0;
    const totalItems = Number(pagination?.totalItems) || 0;
    const pages = buildHistoryPaginationItems(currentPage, totalPages);

    if (totalPages <= 1) {
        return totalItems > 0 ? (
            <p className="border-t border-border px-4 py-3 text-center text-xs text-subtle-foreground sm:px-5">
                {totalItems} {totalItems === 1 ? "movimentação encontrada" : "movimentações encontradas"}
            </p>
        ) : null;
    }

    return (
        <footer className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-subtle-foreground">Página {currentPage} de {totalPages} · {totalItems} movimentações</p>
            <nav className="flex items-center gap-1" aria-label="Paginação do histórico">
                <Button variant="ghost" size="icon" disabled={disabled || currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Página anterior">
                    <ChevronLeft className="size-4" aria-hidden="true" />
                </Button>
                {pages.map((page, index) => {
                    const previous = pages[index - 1];
                    return (
                        <span key={page} className="contents">
                            {previous && page - previous > 1 && <span className="px-1 text-subtle-foreground">…</span>}
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onPageChange(page)}
                                aria-current={page === currentPage ? "page" : undefined}
                                className="inline-flex size-9 items-center justify-center rounded-control-sm text-sm font-semibold text-muted-foreground transition hover:bg-surface-muted hover:text-foreground aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                            >
                                {page}
                            </button>
                        </span>
                    );
                })}
                <Button variant="ghost" size="icon" disabled={disabled || currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Próxima página">
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
            </nav>
        </footer>
    );
}

export default HistoryPagination;
