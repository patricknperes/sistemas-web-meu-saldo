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
    ...inputProperties
}) {
    const isPassword = type === "password";

    const [passwordVisible, setPasswordVisible] =
        useState(false);

    const resolvedType =
        isPassword && passwordVisible
            ? "text"
            : type;

    function togglePasswordVisibility() {
        setPasswordVisible(
            (currentVisibility) =>
                !currentVisibility
        );
    }

    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="
                    mb-1.5 block
                    truncate
                    text-sm font-medium
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative min-w-0">
                {Icon && (
                    <Icon
                        size={19}
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute left-3.5 top-1/2
                            z-10
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />
                )}

                <input
                    {...inputProperties}
                    id={id}
                    type={resolvedType}
                    className={`
                        h-12 w-full min-w-0
                        rounded-control
                        border border-border
                        bg-background
                        py-2.5
                        text-sm
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground
                        hover:border-border-strong
                        focus:border-border-strong
                        focus:ring-2
                        focus:ring-ring/20
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        ${Icon ? "pl-11" : "pl-3.5"}
                        ${isPassword
                            ? "pr-12"
                            : "pr-3.5"
                        }
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={
                            togglePasswordVisibility
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
                            clickable-area
                            absolute right-0.5 top-1/2
                            inline-flex
                            -translate-y-1/2
                            items-center justify-center
                            rounded-lg
                            text-muted-foreground
                            transition-colors
                            hover:text-foreground
                        "
                    >
                        {passwordVisible ? (
                            <RiEyeOffLine size={19} />
                        ) : (
                            <RiEyeLine size={19} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default AuthInput;