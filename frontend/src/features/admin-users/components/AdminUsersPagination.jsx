import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import { buildAdminPaginationItems } from "../utils/adminUserFormatters.js";

function AdminUsersPagination({ pagination, disabled, onPageChange, onPageSizeChange }) {
    const currentPage = Number(pagination?.page) || 1;
    const pageSize = Number(pagination?.pageSize) || 10;
    const totalPages = Number(pagination?.totalPages) || 1;
    const totalItems = Number(pagination?.totalItems) || 0;
    const pages = buildAdminPaginationItems(currentPage, totalPages);

    return (
        <footer className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-subtle-foreground">
                <span>{totalItems} {totalItems === 1 ? "usuário encontrado" : "usuários encontrados"}</span>
                <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))} disabled={disabled}>
                    <SelectTrigger className="h-9 w-28" aria-label="Itens por página"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <nav className="flex items-center gap-1" aria-label="Paginação de usuários">
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
                                className="inline-flex size-9 items-center justify-center rounded-control-sm text-sm font-semibold text-muted-foreground transition hover:bg-surface-muted hover:text-foreground aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
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

export default AdminUsersPagination;
