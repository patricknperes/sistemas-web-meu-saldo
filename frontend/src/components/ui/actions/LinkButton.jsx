import {
    forwardRef,
} from "react";

import {
    Link,
} from "react-router";

import ActionContent from "./ActionContent.jsx";
import {
    getButtonClassName,
} from "./buttonStyles.js";

const LinkButton = forwardRef(
    function LinkButton(
        {
            children,
            to,
            href,
            external = false,
            variant = "primary",
            size = "md",
            leadingIcon,
            trailingIcon,
            fullWidth = false,
            disabled = false,
            className = "",
            onClick,
            ...props
        },
        ref
    ) {
        const commonProps = {
            ref,
            "aria-disabled":
                disabled || undefined,
            tabIndex: disabled
                ? -1
                : props.tabIndex,
            className: getButtonClassName({
                variant,
                size,
                fullWidth,
                className: `${
                    disabled
                        ? "pointer-events-none opacity-55"
                        : ""
                } ${className}`,
            }),
            onClick: (event) => {
                if (disabled) {
                    event.preventDefault();
                    return;
                }

                onClick?.(event);
            },
        };

        const content = (
            <ActionContent
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
            >
                {children}
            </ActionContent>
        );

        if (href) {
            return (
                <a
                    {...props}
                    {...commonProps}
                    href={href}
                    target={
                        external
                            ? "_blank"
                            : props.target
                    }
                    rel={
                        external
                            ? "noreferrer"
                            : props.rel
                    }
                >
                    {content}
                </a>
            );
        }

        return (
            <Link
                {...props}
                {...commonProps}
                to={to}
            >
                {content}
            </Link>
        );
    }
);

export default LinkButton;
