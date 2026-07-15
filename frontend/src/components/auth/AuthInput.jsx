import {
    useState,
} from "react";

import {
    RiEyeLine,
    RiEyeOffLine,
} from "react-icons/ri";

function AuthInput({
    id,
    label,
    icon: Icon,
    type = "text",
    helperText = "",
    ...inputProperties
}) {
    const isPassword =
        type === "password";

    const [
        passwordVisible,
        setPasswordVisible,
    ] = useState(false);

    const resolvedType =
        isPassword &&
            passwordVisible
            ? "text"
            : type;

    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative min-w-0">
                {Icon && (
                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            left-2 top-1/2
                            z-10
                            flex size-8
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary-muted
                            text-primary
                        "
                    >
                        <Icon size={16} />
                    </span>
                )}

                <input
                    {...inputProperties}
                    id={id}
                    type={resolvedType}
                    className={`
                        h-12 w-full
                        min-w-0
                        rounded-2xl
                        border border-border
                        bg-background
                        py-2.5
                        text-sm
                        font-medium
                        text-foreground
                        outline-none
                        transition-all
                        duration-200
                        placeholder:font-normal
                        placeholder:text-muted-foreground/60
                        hover:border-border-strong
                        focus:border-primary/50
                        focus:ring-4
                        focus:ring-primary/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        ${Icon
                            ? "pl-12"
                            : "pl-4"
                        }

                        ${isPassword
                            ? "pr-12"
                            : "pr-4"
                        }
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setPasswordVisible(
                                (currentValue) =>
                                    !currentValue
                            )
                        }
                        disabled={
                            inputProperties.disabled
                        }
                        aria-label={
                            passwordVisible
                                ? "Ocultar senha"
                                : "Mostrar senha"
                        }
                        title={
                            passwordVisible
                                ? "Ocultar senha"
                                : "Mostrar senha"
                        }
                        className="
                            absolute
                            right-2 top-1/2
                            inline-flex size-8
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-xl
                            text-muted-foreground
                            outline-none
                            transition
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:ring-2
                            focus-visible:ring-ring/20
                            disabled:pointer-events-none
                            disabled:opacity-40
                        "
                    >
                        {passwordVisible ? (
                            <RiEyeOffLine
                                size={18}
                                aria-hidden="true"
                            />
                        ) : (
                            <RiEyeLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                )}
            </div>

            {helperText && (
                <p
                    className="
                        mt-2
                        text-xs
                        leading-5
                        text-muted-foreground
                    "
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}

export default AuthInput;