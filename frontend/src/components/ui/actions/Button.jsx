import {
    forwardRef,
} from "react";

import ActionContent from "./ActionContent.jsx";
import {
    getButtonClassName,
} from "./buttonStyles.js";

const Button = forwardRef(
    function Button(
        {
            children,
            variant = "primary",
            size = "md",
            type = "button",
            leadingIcon,
            trailingIcon,
            loading = false,
            loadingText,
            fullWidth = false,
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
                disabled={isDisabled}
                aria-busy={
                    loading || undefined
                }
                data-loading={
                    loading || undefined
                }
                className={getButtonClassName({
                    variant,
                    size,
                    fullWidth,
                    className,
                })}
                {...props}
            >
                <ActionContent
                    leadingIcon={leadingIcon}
                    trailingIcon={trailingIcon}
                    loading={loading}
                    loadingText={loadingText}
                >
                    {children}
                </ActionContent>
            </button>
        );
    }
);

export default Button;
