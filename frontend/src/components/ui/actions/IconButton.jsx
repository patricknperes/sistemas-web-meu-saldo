import {
    forwardRef,
} from "react";

import ActionContent from "./ActionContent.jsx";
import {
    getButtonClassName,
} from "./buttonStyles.js";

const IconButton = forwardRef(
    function IconButton(
        {
            icon,
            label,
            title,
            variant = "ghost",
            size = "md",
            type = "button",
            loading = false,
            disabled = false,
            className = "",
            ...props
        },
        ref
    ) {
        const isDisabled =
            disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                aria-label={label}
                title={title ?? label}
                aria-busy={
                    loading || undefined
                }
                disabled={isDisabled}
                data-loading={
                    loading || undefined
                }
                className={getButtonClassName({
                    variant,
                    size,
                    iconOnly: true,
                    className,
                })}
                {...props}
            >
                <ActionContent
                    loading={loading}
                    iconOnly
                >
                    {icon}
                </ActionContent>
            </button>
        );
    }
);

export default IconButton;
