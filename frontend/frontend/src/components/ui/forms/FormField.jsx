import {
    useId,
} from "react";

import {
    RiCheckboxCircleLine,
    RiErrorWarningLine,
} from "react-icons/ri";

import {
    normalizeClassName,
} from "./fieldStyles.js";

import FormFieldContext from "./FormFieldContext.js";

function sanitizeReactId(value) {
    return String(value)
        .replace(/:/g, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-");
}


function FieldMessage({
    id,
    tone,
    children,
}) {
    const configuration = {
        error: {
            icon: RiErrorWarningLine,
            className: "text-danger",
            role: "alert",
        },
        success: {
            icon: RiCheckboxCircleLine,
            className: "text-success",
            role: "status",
        },
        helper: {
            icon: null,
            className: "text-muted-foreground",
            role: undefined,
        },
    }[tone];

    const Icon = configuration.icon;

    return (
        <p
            id={id}
            role={configuration.role}
            className={normalizeClassName(`
                mt-2 flex items-start gap-1.5
                text-caption
                ${configuration.className}
            `)}
        >
            {Icon ? (
                <Icon
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    size={14}
                />
            ) : null}

            <span>{children}</span>
        </p>
    );
}

function FormField({
    id,
    label,
    helperText,
    errorMessage,
    successMessage,
    required = false,
    optional = false,
    labelAction,
    children,
    className = "",
}) {
    const reactId = useId();
    const fallbackId = `field-${sanitizeReactId(reactId)}`;
    const controlId = id || fallbackId;

    const tone = errorMessage
        ? "error"
        : successMessage
          ? "success"
          : helperText
            ? "helper"
            : null;

    const message = errorMessage || successMessage || helperText;
    const messageId = message
        ? `${controlId}-${tone}-message`
        : undefined;

    const contextValue = {
        controlId,
        messageId,
        status: errorMessage
            ? "error"
            : successMessage
              ? "success"
              : "default",
        invalid: Boolean(errorMessage),
        required,
    };

    return (
        <FormFieldContext.Provider value={contextValue}>
            <div
                className={normalizeClassName(`
                    min-w-0
                    ${className}
                `)}
            >
                {label ? (
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                            htmlFor={controlId}
                            className="min-w-0 text-body-sm font-semibold tracking-label text-foreground-soft"
                        >
                            {label}

                            {required ? (
                                <span
                                    aria-hidden="true"
                                    className="ml-1 text-danger"
                                >
                                    *
                                </span>
                            ) : null}

                            {!required && optional ? (
                                <span className="ml-1 font-normal text-muted-foreground">
                                    (opcional)
                                </span>
                            ) : null}
                        </label>

                        {labelAction ? (
                            <div className="shrink-0">
                                {labelAction}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {children}

                {message ? (
                    <FieldMessage
                        id={messageId}
                        tone={tone}
                    >
                        {message}
                    </FieldMessage>
                ) : null}
            </div>
        </FormFieldContext.Provider>
    );
}

export default FormField;
