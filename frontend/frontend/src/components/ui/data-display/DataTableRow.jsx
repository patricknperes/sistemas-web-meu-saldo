import {
    forwardRef,
} from "react";

import {
    useDataTableContext,
} from "./DataTableContext.js";
import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const DataTableRow = forwardRef(
    function DataTableRow(
        {
            children,
            selected = false,
            interactive = false,
            hoverable: hoverableOverride,
            className = "",
            onClick,
            ...props
        },
        ref
    ) {
        const { hoverable } = useDataTableContext();
        const isHoverable = hoverableOverride ?? hoverable;
        const canInteract = interactive || typeof onClick === "function";

        function handleKeyDown(event) {
            props.onKeyDown?.(event);

            if (
                !canInteract ||
                event.defaultPrevented ||
                !["Enter", " "].includes(event.key)
            ) {
                return;
            }

            event.preventDefault();
            onClick?.(event);
        }

        return (
            <tr
                ref={ref}
                data-selected={selected || undefined}
                tabIndex={canInteract ? 0 : undefined}
                className={mergeClassNames(
                    "group/row transition-colors duration-150",
                    isHoverable ? "hover:bg-surface-subtle" : "",
                    selected ? "bg-primary-muted/55 hover:bg-primary-muted/70" : "",
                    canInteract
                        ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/30"
                        : "",
                    className
                )}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </tr>
        );
    }
);

export default DataTableRow;
