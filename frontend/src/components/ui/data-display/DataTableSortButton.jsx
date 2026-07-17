import {
    RiArrowDownLine,
    RiArrowUpDownLine,
    RiArrowUpLine,
} from "react-icons/ri";

import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

function DataTableSortButton({
    children,
    direction,
    onSort,
    disabled = false,
    className = "",
}) {
    const Icon = direction === "asc"
        ? RiArrowUpLine
        : direction === "desc"
            ? RiArrowDownLine
            : RiArrowUpDownLine;

    const nextDirection = direction === "asc" ? "desc" : "asc";

    return (
        <button
            type="button"
            disabled={disabled}
            aria-label={`Ordenar por ${String(children)} em ordem ${nextDirection === "asc" ? "crescente" : "decrescente"}`}
            className={mergeClassNames(
                "-ml-2 inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-left transition-colors",
                "hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
                "disabled:pointer-events-none disabled:opacity-50",
                direction ? "text-primary" : "text-muted-foreground",
                className
            )}
            onClick={() => onSort?.(nextDirection)}
        >
            <span>{children}</span>
            <Icon size={15} aria-hidden="true" className="shrink-0" />
        </button>
    );
}

export default DataTableSortButton;
