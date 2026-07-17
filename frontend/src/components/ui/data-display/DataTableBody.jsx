import {
    forwardRef,
} from "react";

import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataTableBody = forwardRef(
    function DataTableBody(
        {
            children,
            className = "",
            ...props
        },
        ref
    ) {
        return (
            <tbody
                ref={ref}
                className={mergeClassNames(
                    "divide-y divide-border-subtle bg-surface",
                    className
                )}
                {...props}
            >
                {children}
            </tbody>
        );
    }
);

export default DataTableBody;
