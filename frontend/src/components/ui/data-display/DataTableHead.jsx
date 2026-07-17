import {
    forwardRef,
} from "react";

import {
    useDataTableContext,
} from "./DataTableContext.js";
import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const densityClasses = {
    compact: "h-10 px-3",
    default: "h-11 px-4",
    comfortable: "h-12 px-5",
};

const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const DataTableHead = forwardRef(
    function DataTableHead(
        {
            children,
            align = "left",
            sortDirection,
            scope = "col",
            className = "",
            ...props
        },
        ref
    ) {
        const { density } = useDataTableContext();
        const ariaSort = sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
                ? "descending"
                : sortDirection === "none"
                    ? "none"
                    : undefined;

        return (
            <th
                ref={ref}
                scope={scope}
                aria-sort={ariaSort}
                className={mergeClassNames(
                    "whitespace-nowrap border-b border-border text-overline font-label uppercase tracking-overline text-muted-foreground",
                    densityClasses[density] || densityClasses.default,
                    alignmentClasses[align] || alignmentClasses.left,
                    className
                )}
                {...props}
            >
                {children}
            </th>
        );
    }
);

export default DataTableHead;
