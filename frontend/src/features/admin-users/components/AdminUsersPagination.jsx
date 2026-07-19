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

const PAGE_SIZE_OPTIONS = [
    5,
    10,
    20,
    50,
];

function AdminUsersPagination({
    pagination,
    disabled = false,
    onPageChange,
    onPageSizeChange,
}) {
    const pageSize = Math.max(
        Number(
            pagination?.pageSize
            ?? pagination?.limit
            ?? pagination?.size
            ?? 10,
        ) || 10,
        1,
    );

    const totalItems = Math.max(
        Number(
            pagination?.totalItems
            ?? pagination?.total
            ?? 0,
        ) || 0,
        0,
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

    function handlePageSizeChange(nextPageSize) {
        const normalizedPageSize = Number(nextPageSize);

        if (
            disabled
            || !Number.isFinite(normalizedPageSize)
            || normalizedPageSize <= 0
            || normalizedPageSize === pageSize
        ) {
            return;
        }

        onPageSizeChange?.(normalizedPageSize);
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
                <div
                    className="
                        flex shrink-0
                        flex-nowrap
                        items-center
                        gap-2
                    "
                >
                    <span className="hidden text-xs text-subtle-foreground sm:inline">
                        Itens por página:
                    </span>

                    <Select
                        value={String(pageSize)}
                        disabled={disabled}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger
                            aria-label="Itens por página"
                            className="
                                h-9 w-[72px]
                                shrink-0
                                px-2.5
                                text-sm
                            "
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent align="start">
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option}
                                    value={String(option)}
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span
                        aria-hidden="true"
                        className="mx-1 h-6 w-px shrink-0 bg-border"
                    />

                    <span className="text-xs text-subtle-foreground">
                        {firstItem}–{lastItem} de {totalItems}
                    </span>
                </div>

                <nav
                    aria-label="Paginação de usuários"
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
                            aria-label="Selecionar página de usuários"
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

export default AdminUsersPagination;
