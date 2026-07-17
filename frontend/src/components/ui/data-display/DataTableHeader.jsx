import {
    forwardRef,
} from "react";

import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataTableHeader = forwardRef(
    function DataTableHeader(
        {
            children,
            className = "",
            ...props
        },
        ref
    ) {
        return (
            <thead
                ref={ref}
                className={mergeClassNames(
                    "bg-surface-subtle text-muted-foreground [&_tr]:border-b [&_tr]:border-border",
                    "[table[data-sticky-header]_&]:sticky [table[data-sticky-header]_&]:top-0 [table[data-sticky-header]_&]:z-10 [table[data-sticky-header]_&]:shadow-[0_1px_0_var(--app-border)]",
                    className
                )}
                {...props}
            >
                {children}
            </thead>
        );
    }
);

export default DataTableHeader;
