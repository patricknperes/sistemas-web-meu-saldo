import {
    forwardRef,
} from "react";

import {
    DataTableContext,
} from "./DataTableContext.js";
import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataTable = forwardRef(
    function DataTable(
        {
            children,
            density = "default",
            hoverable = true,
            stickyHeader = false,
            footer,
            className = "",
            scrollClassName = "",
            tableClassName = "",
            ...props
        },
        ref
    ) {
        return (
            <DataTableContext.Provider
                value={{
                    density,
                    hoverable,
                }}
            >
                <div
                    className={mergeClassNames(
                        "min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
                        className
                    )}
                >
                    <div
                        className={mergeClassNames(
                            "max-w-full overflow-x-auto overscroll-x-contain",
                            scrollClassName
                        )}
                    >
                        <table
                            ref={ref}
                            data-density={density}
                            data-sticky-header={stickyHeader || undefined}
                            className={mergeClassNames(
                                "w-full min-w-[44rem] border-separate border-spacing-0 text-left text-body-sm text-foreground",
                                tableClassName
                            )}
                            {...props}
                        >
                            {children}
                        </table>
                    </div>

                    {footer ? (
                        <div className="border-t border-border bg-surface-subtle px-4 py-3 sm:px-5">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </DataTableContext.Provider>
        );
    }
);

export default DataTable;
