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
    compact: "px-3 py-2.5",
    default: "px-4 py-3.5",
    comfortable: "px-5 py-4.5",
};

const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const DataTableCell = forwardRef(
    function DataTableCell(
        {
            children,
            align = "left",
            numeric = false,
            muted = false,
            truncate = false,
            className = "",
            ...props
        },
        ref
    ) {
        const { density } = useDataTableContext();

        return (
            <td
                ref={ref}
                className={mergeClassNames(
                    "align-middle text-body-sm",
                    densityClasses[density] || densityClasses.default,
                    alignmentClasses[align] || alignmentClasses.left,
                    numeric ? "numeric-value tabular-nums" : "",
                    muted ? "text-muted-foreground" : "text-foreground-soft",
                    truncate ? "max-w-0 truncate" : "",
                    className
                )}
                {...props}
            >
                {children}
            </td>
        );
    }
);

export default DataTableCell;
