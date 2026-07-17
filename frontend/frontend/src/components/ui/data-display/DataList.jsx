import {
    forwardRef,
} from "react";

import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataList = forwardRef(
    function DataList(
        {
            children,
            as: Component = "div",
            className = "",
            ...props
        },
        ref
    ) {
        return (
            <Component
                ref={ref}
                className={mergeClassNames("grid gap-3", className)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

export default DataList;
