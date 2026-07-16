import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router";

import {
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiEyeLine,
    RiEyeOffLine,
    RiLoader4Line,
    RiLockPasswordLine,
    RiShieldCheckLine,
} from "react-icons/ri";

import Snackbar from "../../components/feedback/Snackbar.jsx";

import {
    passwordResetService,
} from "../../services/passwordResetService.js";

const TOKEN_STATUS = Object.freeze({
    CHECKING: "CHECKING",
    VALID: "VALID",
    INVALID: "INVALID",
});

const INITIAL_NOTIFICATION =
    Object.freeze({
        type: "info",
        message: "",
    });

function getErrorMessage(
    error,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return "Não foi possível redefinir sua senha.";
}

function PasswordField({
    id,
    name,
    label,
    value,
    onChange,
    visible,
    onToggleVisibility,
    autoComplete,
    placeholder,
    disabled,
    autoFocus = false,
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative min-w-0">
                <span
                    className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-muted-foreground
                    "
                >
                    <RiLockPasswordLine
                        size={18}
                        aria-hidden="true"
                    />
                </span>

                <input
                    id={id}
                    name={name}
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    autoComplete={
                        autoComplete
                    }
                    placeholder={
                        placeholder
                    }
                    disabled={disabled}
                    autoFocus={autoFocus}
                    required
                    maxLength={128}
                    className="
                        min-h-12
                        w-full
                        min-w-0
                        rounded-control
                        border
                        border-border
                        bg-background
                        py-3
                        pl-11
                        pr-12
                        text-sm
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground
                        hover:border-border-strong
                        focus:border-primary/40
                        focus:ring-4
                        focus:ring-primary/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                />

                <button
                    type="button"
                    onClick={
                        onToggleVisibility
                    }
                    disabled={disabled}
                    aria-label={
                        visible
                            ? "Ocultar senha"
                            : "Mostrar senha"
                    }
                    title={
                        visible
                            ? "Ocultar senha"
                            : "Mostrar senha"
                    }
                    className="
                        absolute
                        right-2
                        top-1/2
                        inline-flex
                        size-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-xl
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        disabled:pointer-events-none
                        disabled:opacity-50
                    "
                >
                    {visible ? (
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
            </div>
        </div>
    );
}

function PasswordRule({
    valid,
    children,
}) {
    return (
        <li
            className={`
                flex
                min-w-0
                items-center
                gap-2
                text-xs
                transition-colors

                ${valid
                    ? `
                            text-emerald-600
                            dark:text-emerald-400
                        `
                    : `
                            text-muted-foreground
                        `
                }
            `}
        >
            <span
                className={`
                    flex
                    size-4
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[9px]
                    font-bold

                    ${valid
                        ? `
                                border-emerald-500
                                bg-emerald-500
                                text-white
                            `
                        : `
                                border-border
                                bg-background
                                text-transparent
                            `
                    }
                `}
            >
                ✓
            </span>

            <span className="min-w-0">
                {children}
            </span>
        </li>
    );
}

function CheckingToken() {
    return (
        <div
            className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center
                text-center
            "
        >
            <span
                className="
                    flex
                    size-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-primary/15
                    bg-primary/10
                    text-primary
                "
            >
                <RiLoader4Line
                    size={27}
                    aria-hidden="true"
                    className="animate-spin"
                />
            </span>

            <h1
                className="
                    mt-5
                    text-xl
                    font-semibold
                    text-foreground
                "
            >
                Validando seu link
            </h1>

            <p
                className="
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >
                Aguarde enquanto verificamos se o
                link de recuperação ainda está
                disponível.
            </p>
        </div>
    );
}

function InvalidToken() {
    return (
        <div
            className="
                min-w-0
                py-2
                text-center
            "
        >
            <span
                className="
                    mx-auto
                    flex
                    size-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-rose-500/15
                    bg-rose-500/10
                    text-rose-600
                    dark:text-rose-400
                "
            >
                <RiCloseCircleLine
                    size={27}
                    aria-hidden="true"
                />
            </span>

            <header className="mt-5">
                <h1
                    className="
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-foreground
                    "
                >
                    Link indisponível
                </h1>

                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Este link é inválido, expirou,
                    já foi utilizado ou foi
                    substituído por uma solicitação
                    mais recente.
                </p>
            </header>

            <div
                className="
                    mt-6
                    rounded-2xl
                    border
                    border-amber-500/15
                    bg-amber-500/[0.07]
                    p-4
                    text-left
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >
                    <span
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-amber-500/10
                            text-amber-600
                            dark:text-amber-400
                        "
                    >
                        <RiShieldCheckLine
                            size={17}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            Solicite um novo link
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            Por segurança, cada link
                            pode ser utilizado apenas
                            uma vez e possui tempo
                            limitado de validade.
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="
                    mt-6
                    space-y-3
                "
            >
                <Link
                    to="/esqueci-senha"
                    className="
                        inline-flex
                        min-h-12
                        w-full
                        items-center
                        justify-center
                        rounded-control
                        bg-primary
                        px-4
                        text-sm
                        font-semibold
                        text-primary-foreground
                        transition
                        hover:bg-primary-hover
                        active:scale-[0.99]
                        focus-visible:outline-none
                        focus-visible:ring-4
                        focus-visible:ring-primary/20
                    "
                >
                    Solicitar novo link
                </Link>

                <Link
                    to="/login"
                    className="
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-control
                        px-4
                        text-sm
                        font-semibold
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                    "
                >
                    <RiArrowLeftLine
                        size={17}
                        aria-hidden="true"
                    />

                    Voltar para o login
                </Link>
            </div>
        </div>
    );
}

function ResetCompleted() {
    return (
        <div
            className="
                min-w-0
                py-2
                text-center
            "
        >
            <span
                className="
                    mx-auto
                    flex
                    size-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-500/15
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                "
            >
                <RiCheckboxCircleLine
                    size={28}
                    aria-hidden="true"
                />
            </span>

            <header className="mt-5">
                <h1
                    className="
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-foreground
                    "
                >
                    Senha redefinida
                </h1>

                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Sua nova senha foi cadastrada com
                    sucesso. Agora você pode entrar
                    novamente na sua conta.
                </p>
            </header>

            <div
                className="
                    mt-6
                    rounded-2xl
                    border
                    border-emerald-500/15
                    bg-emerald-500/[0.07]
                    p-4
                    text-left
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >
                    <span
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-500/10
                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        <RiShieldCheckLine
                            size={17}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            Sua conta está protegida
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            O link utilizado foi
                            invalidado e as sessões
                            anteriores não poderão
                            continuar autenticadas.
                        </p>
                    </div>
                </div>
            </div>

            <Link
                to="/login"
                replace
                className="
                    mt-6
                    inline-flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-control
                    bg-primary
                    px-4
                    text-sm
                    font-semibold
                    text-primary-foreground
                    transition
                    hover:bg-primary-hover
                    active:scale-[0.99]
                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-primary/20
                "
            >
                Ir para o login
            </Link>
        </div>
    );
}

function ResetPassword() {
    const [
        searchParams,
    ] = useSearchParams();

    const token =
        useMemo(
            () =>
                String(
                    searchParams.get(
                        "token",
                    ) ?? "",
                ).trim(),
            [searchParams],
        );

    const [
        tokenStatus,
        setTokenStatus,
    ] = useState(
        TOKEN_STATUS.CHECKING,
    );

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        passwordConfirmation,
        setPasswordConfirmation,
    ] = useState("");

    const [
        passwordVisible,
        setPasswordVisible,
    ] = useState(false);

    const [
        confirmationVisible,
        setConfirmationVisible,
    ] = useState(false);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        resetCompleted,
        setResetCompleted,
    ] = useState(false);

    const [
        notification,
        setNotification,
    ] = useState(
        INITIAL_NOTIFICATION,
    );

    const passwordRules =
        useMemo(
            () => ({
                minimumLength:
                    password.length >= 8,

                lowercase:
                    /[a-z]/.test(
                        password,
                    ),

                uppercase:
                    /[A-Z]/.test(
                        password,
                    ),

                number:
                    /[0-9]/.test(
                        password,
                    ),

                special:
                    /[^A-Za-z0-9]/.test(
                        password,
                    ),

                noSpaces:
                    password.length > 0 &&
                    !/\s/.test(
                        password,
                    ),
            }),
            [password],
        );

    const passwordIsValid =
        useMemo(
            () =>
                Object.values(
                    passwordRules,
                ).every(Boolean),
            [passwordRules],
        );

    useEffect(() => {
        let active = true;

        async function validateToken() {
            setTokenStatus(
                TOKEN_STATUS.CHECKING,
            );

            if (!token) {
                if (active) {
                    setTokenStatus(
                        TOKEN_STATUS.INVALID,
                    );
                }

                return;
            }

            try {
                const result =
                    await passwordResetService
                        .validatePasswordResetToken(
                            token,
                        );

                if (!active) {
                    return;
                }

                setTokenStatus(
                    result.valid
                        ? TOKEN_STATUS.VALID
                        : TOKEN_STATUS.INVALID,
                );
            } catch {
                if (active) {
                    setTokenStatus(
                        TOKEN_STATUS.INVALID,
                    );
                }
            }
        }

        validateToken();

        return () => {
            active = false;
        };
    }, [token]);

    function showNotification(
        type,
        message,
    ) {
        setNotification({
            type,
            message,
        });
    }

    function clearNotification() {
        setNotification(
            INITIAL_NOTIFICATION,
        );
    }

    function handlePasswordChange(
        event,
    ) {
        setPassword(
            event.target.value,
        );

        if (
            notification.message
        ) {
            clearNotification();
        }
    }

    function handleConfirmationChange(
        event,
    ) {
        setPasswordConfirmation(
            event.target.value,
        );

        if (
            notification.message
        ) {
            clearNotification();
        }
    }

    async function handleSubmit(
        event,
    ) {
        event.preventDefault();

        clearNotification();

        if (
            tokenStatus !==
            TOKEN_STATUS.VALID
        ) {
            showNotification(
                "error",
                "O link de recuperação não está disponível.",
            );

            return;
        }

        if (!password) {
            showNotification(
                "error",
                "Informe sua nova senha.",
            );

            return;
        }

        if (!passwordIsValid) {
            showNotification(
                "error",
                "Sua nova senha ainda não atende a todos os requisitos.",
            );

            return;
        }

        if (
            !passwordConfirmation
        ) {
            showNotification(
                "error",
                "Confirme sua nova senha.",
            );

            return;
        }

        if (
            password !==
            passwordConfirmation
        ) {
            showNotification(
                "error",
                "A confirmação não corresponde à nova senha.",
            );

            return;
        }

        setSubmitting(true);

        try {
            await passwordResetService
                .resetPassword({
                    token,
                    password,
                    passwordConfirmation,
                });

            setResetCompleted(
                true,
            );

            setPassword("");
            setPasswordConfirmation("");
        } catch (error) {
            const errorMessage =
                getErrorMessage(
                    error,
                );

            showNotification(
                "error",
                errorMessage,
            );

            if (
                [
                    "INVALID_RESET_TOKEN",
                    "RESET_TOKEN_UNAVAILABLE",
                ].includes(
                    error?.response?.data
                        ?.code ??
                    error?.code,
                )
            ) {
                setTokenStatus(
                    TOKEN_STATUS.INVALID,
                );
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (
        tokenStatus ===
        TOKEN_STATUS.CHECKING
    ) {
        return (
            <CheckingToken />
        );
    }

    if (
        tokenStatus ===
        TOKEN_STATUS.INVALID
    ) {
        return (
            <InvalidToken />
        );
    }

    if (resetCompleted) {
        return (
            <ResetCompleted />
        );
    }

    return (
        <>
            <Snackbar
                type={
                    notification.type
                }
                message={
                    notification.message
                }
                onClose={
                    clearNotification
                }
            />

            <div className="min-w-0">
                <header className="mb-6">
                    <span
                        className="
                            flex
                            size-11
                            items-center
                            justify-center
                            rounded-control
                            bg-surface-muted
                            text-foreground
                        "
                    >
                        <RiLockPasswordLine
                            size={22}
                            aria-hidden="true"
                        />
                    </span>

                    <h1
                        className="
                            mt-4
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Crie uma nova senha
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-muted-foreground
                        "
                    >
                        Escolha uma senha segura e
                        diferente das que você já
                        utilizou anteriormente.
                    </p>
                </header>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                    className="space-y-5"
                >
                    <PasswordField
                        id="reset-password"
                        name="password"
                        label="Nova senha"
                        value={password}
                        onChange={
                            handlePasswordChange
                        }
                        visible={
                            passwordVisible
                        }
                        onToggleVisibility={() =>
                            setPasswordVisible(
                                (
                                    currentValue,
                                ) =>
                                    !currentValue,
                            )
                        }
                        autoComplete="new-password"
                        placeholder="Digite sua nova senha"
                        disabled={
                            submitting
                        }
                        autoFocus
                    />

                    <PasswordField
                        id="reset-password-confirmation"
                        name="passwordConfirmation"
                        label="Confirmar nova senha"
                        value={
                            passwordConfirmation
                        }
                        onChange={
                            handleConfirmationChange
                        }
                        visible={
                            confirmationVisible
                        }
                        onToggleVisibility={() =>
                            setConfirmationVisible(
                                (
                                    currentValue,
                                ) =>
                                    !currentValue,
                            )
                        }
                        autoComplete="new-password"
                        placeholder="Digite novamente"
                        disabled={
                            submitting
                        }
                    />

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-surface-muted/50
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Requisitos da senha
                            </p>

                            <span
                                className={`
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold

                                    ${passwordIsValid
                                        ? `
                                                bg-emerald-500/10
                                                text-emerald-600
                                                dark:text-emerald-400
                                            `
                                        : `
                                                bg-background
                                                text-muted-foreground
                                            `
                                    }
                                `}
                            >
                                {passwordIsValid
                                    ? "Senha válida"
                                    : "Verificação"
                                }
                            </span>
                        </div>

                        <ul
                            className="
                                mt-3
                                grid
                                gap-2
                                sm:grid-cols-2
                            "
                        >
                            <PasswordRule
                                valid={
                                    passwordRules.minimumLength
                                }
                            >
                                Mínimo de 8 caracteres
                            </PasswordRule>

                            <PasswordRule
                                valid={
                                    passwordRules.uppercase
                                }
                            >
                                Uma letra maiúscula
                            </PasswordRule>

                            <PasswordRule
                                valid={
                                    passwordRules.lowercase
                                }
                            >
                                Uma letra minúscula
                            </PasswordRule>

                            <PasswordRule
                                valid={
                                    passwordRules.number
                                }
                            >
                                Um número
                            </PasswordRule>

                            <PasswordRule
                                valid={
                                    passwordRules.special
                                }
                            >
                                Um caractere especial
                            </PasswordRule>

                            <PasswordRule
                                valid={
                                    passwordRules.noSpaces
                                }
                            >
                                Nenhum espaço
                            </PasswordRule>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        aria-busy={
                            submitting
                        }
                        className="
                            inline-flex
                            min-h-12
                            w-full
                            min-w-0
                            items-center
                            justify-center
                            gap-2
                            rounded-control
                            bg-primary
                            px-4
                            text-sm
                            font-semibold
                            text-primary-foreground
                            transition
                            hover:bg-primary-hover
                            active:scale-[0.99]
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-primary/20
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >
                        {submitting ? (
                            <>
                                <RiLoader4Line
                                    size={19}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />

                                Redefinindo senha...
                            </>
                        ) : (
                            <>
                                <RiShieldCheckLine
                                    size={18}
                                    aria-hidden="true"
                                />

                                Redefinir senha
                            </>
                        )}
                    </button>
                </form>

                <div
                    className="
                        mt-6
                        border-t
                        border-border
                        pt-5
                    "
                >
                    <Link
                        to="/login"
                        className="
                            inline-flex
                            min-h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-control
                            px-4
                            text-sm
                            font-semibold
                            text-muted-foreground
                            transition-colors
                            hover:bg-surface-hover
                            hover:text-foreground
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary/20
                        "
                    >
                        <RiArrowLeftLine
                            size={17}
                            aria-hidden="true"
                        />

                        Voltar para o login
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;