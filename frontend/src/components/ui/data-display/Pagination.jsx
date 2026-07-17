import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import {
    createPaginationItems,
    mergeClassNames,
} from "./dataDisplayUtils.js";

function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems,
    pageSize,
    itemLabel = "itens",
    siblingCount = 1,
    onPageChange,
    showSummary = true,
    compact = false,
    className = "",
}) {
    const normalizedTotalPages = Math.max(1, Number(totalPages) || 1);
    const normalizedCurrentPage = Math.min(
        Math.max(1, Number(currentPage) || 1),
        normalizedTotalPages
    );
    const paginationItems = createPaginationItems(
        normalizedCurrentPage,
        normalizedTotalPages,
        siblingCount
    );

    const startItem = totalItems && pageSize
        ? Math.min((normalizedCurrentPage - 1) * pageSize + 1, totalItems)
        : null;
    const endItem = totalItems && pageSize
        ? Math.min(normalizedCurrentPage * pageSize, totalItems)
        : null;

    function changePage(nextPage) {
        const safePage = Math.min(Math.max(nextPage, 1), normalizedTotalPages);

        if (safePage !== normalizedCurrentPage) {
            onPageChange?.(safePage);
        }
    }

    return (
        <nav
            aria-label="Paginação"
            className={mergeClassNames(
                "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                className
            )}
        >
            {showSummary ? (
                <p className="text-caption text-muted-foreground">
                    {startItem !== null && endItem !== null ? (
                        <>
                            Exibindo <strong className="font-semibold text-foreground">{startItem}–{endItem}</strong> de{" "}
                            <strong className="font-semibold text-foreground">{totalItems}</strong> {itemLabel}
                        </>
                    ) : (
                        <>
                            Página <strong className="font-semibold text-foreground">{normalizedCurrentPage}</strong> de{" "}
                            <strong className="font-semibold text-foreground">{normalizedTotalPages}</strong>
                        </>
                    )}
                </p>
            ) : null}

            <div className="flex items-center justify-between gap-1 sm:justify-end">
                <IconButton
                    icon={<RiArrowLeftSLine size={19} aria-hidden="true" />}
                    label="Ir para a página anterior"
                    variant="outline"
                    size="sm"
                    disabled={normalizedCurrentPage <= 1}
                    onClick={() => changePage(normalizedCurrentPage - 1)}
                />

                <div className={mergeClassNames(
                    "flex items-center gap-1",
                    compact ? "max-sm:hidden" : ""
                )}>
                    {paginationItems.map((item) => {
                        if (typeof item !== "number") {
                            return (
                                <span
                                    key={item}
                                    aria-hidden="true"
                                    className="flex size-8 items-center justify-center text-caption text-subtle-foreground"
                                >
                                    …
                                </span>
                            );
                        }

                        const isCurrent = item === normalizedCurrentPage;

                        return (
                            <button
                                key={item}
                                type="button"
                                aria-label={`Ir para a página ${item}`}
                                aria-current={isCurrent ? "page" : undefined}
                                className={mergeClassNames(
                                    "flex size-8 items-center justify-center rounded-md border text-caption font-semibold transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
                                    isCurrent
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                        : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-surface-hover hover:text-foreground"
                                )}
                                onClick={() => changePage(item)}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                {compact ? (
                    <span className="px-2 text-caption font-semibold text-foreground sm:hidden">
                        {normalizedCurrentPage} / {normalizedTotalPages}
                    </span>
                ) : null}

                <IconButton
                    icon={<RiArrowRightSLine size={19} aria-hidden="true" />}
                    label="Ir para a próxima página"
                    variant="outline"
                    size="sm"
                    disabled={normalizedCurrentPage >= normalizedTotalPages}
                    onClick={() => changePage(normalizedCurrentPage + 1)}
                />
            </div>
        </nav>
    );
}

export default Pagination;
