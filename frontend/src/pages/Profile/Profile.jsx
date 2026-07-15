import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiChevronRight,
    FiEye,
    FiEyeOff,
    FiHash,
    FiInfo,
    FiLoader,
    FiLock,
    FiLogOut,
    FiMail,
    FiSave,
    FiShield,
    FiTrash2,
    FiUser,
    FiX,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router";

import Snackbar from "../../components/feedback/Snackbar.jsx";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    userService,
} from "../../services/userService.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

const MODAL_TYPES = {
    PROFILE: "PROFILE",
    PASSWORD: "PASSWORD",
    ACCOUNT: "ACCOUNT",
    DELETE: "DELETE",
};

function getInitials(name) {
    const normalizedName =
        String(name ?? "").trim();

    if (!normalizedName) {
        return "U";
    }

    const nameParts =
        normalizedName
            .split(/\s+/)
            .filter(Boolean);

    if (nameParts.length === 1) {
        return nameParts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${nameParts[0][0]}${nameParts[
        nameParts.length - 1
    ][0]
        }`.toUpperCase();
}

function FormField({
    id,
    name,
    label,
    value,
    onChange,
    type = "text",
    icon: Icon,
    placeholder,
    autoComplete,
    required = false,
    minLength,
    maxLength,
    disabled = false,
    helperText,
}) {
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
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    maxLength={maxLength}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className={`
                        h-12 w-full
                        min-w-0
                        rounded-2xl
                        border border-border
                        bg-background
                        py-2 pr-4
                        text-sm
                        font-medium
                        text-foreground
                        outline-none
                        transition
                        placeholder:font-normal
                        placeholder:text-muted-foreground/65
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
                    `}
                />
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

function PasswordField({
    id,
    name,
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = false,
    minLength,
    disabled = false,
    helperText,
    tone = "primary",
}) {
    const [
        passwordVisible,
        setPasswordVisible,
    ] = useState(false);

    const toneClasses = {
        primary:
            "bg-primary-muted text-primary",

        danger:
            "bg-danger-muted text-danger",
    };

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
                <span
                    aria-hidden="true"
                    className={`
                        pointer-events-none
                        absolute
                        left-2 top-1/2
                        flex size-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-xl

                        ${toneClasses[tone] ??
                        toneClasses.primary
                        }
                    `}
                >
                    <FiLock size={16} />
                </span>

                <input
                    id={id}
                    name={name}
                    type={
                        passwordVisible
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="
                        h-12 w-full
                        min-w-0
                        rounded-2xl
                        border border-border
                        bg-background
                        py-2
                        pl-12 pr-12
                        text-sm
                        font-medium
                        text-foreground
                        outline-none
                        transition
                        placeholder:font-normal
                        placeholder:text-muted-foreground/65
                        hover:border-border-strong
                        focus:border-primary/50
                        focus:ring-4
                        focus:ring-primary/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                />

                <button
                    type="button"
                    onClick={() =>
                        setPasswordVisible(
                            (currentValue) =>
                                !currentValue
                        )
                    }
                    disabled={disabled}
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
                        transition
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring/20
                        disabled:pointer-events-none
                        disabled:opacity-40
                    "
                >
                    {passwordVisible ? (
                        <FiEyeOff
                            size={17}
                            aria-hidden="true"
                        />
                    ) : (
                        <FiEye
                            size={17}
                            aria-hidden="true"
                        />
                    )}
                </button>
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

function ProfileModal({
    open,
    title,
    description,
    icon: Icon,
    tone = "primary",
    loading = false,
    onClose,
    children,
    footer,
}) {
    const titleId =
        useId();

    const descriptionId =
        useId();

    const dialogReference =
        useRef(null);

    const closeButtonReference =
        useRef(null);

    const previousActiveElementReference =
        useRef(null);

    const onCloseReference =
        useRef(onClose);

    const loadingReference =
        useRef(loading);

    useEffect(() => {
        onCloseReference.current =
            onClose;
    }, [onClose]);

    useEffect(() => {
        loadingReference.current =
            loading;
    }, [loading]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        previousActiveElementReference.current =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const focusFrame =
            window.requestAnimationFrame(
                () => {
                    closeButtonReference
                        .current
                        ?.focus();
                }
            );

        function handleKeyDown(event) {
            if (
                event.key ===
                "Escape" &&
                !loadingReference.current
            ) {
                onCloseReference
                    .current
                    ?.();

                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const dialog =
                dialogReference.current;

            if (!dialog) {
                return;
            }

            const focusableElements =
                Array.from(
                    dialog.querySelectorAll(
                        [
                            "button:not(:disabled)",
                            "input:not(:disabled)",
                            "select:not(:disabled)",
                            "textarea:not(:disabled)",
                            "a[href]",
                            '[tabindex]:not([tabindex="-1"])',
                        ].join(",")
                    )
                );

            if (
                focusableElements.length ===
                0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length -
                1
                ];

            if (
                event.shiftKey &&
                document.activeElement ===
                firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement ===
                lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.cancelAnimationFrame(
                focusFrame
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            previousActiveElementReference
                .current
                ?.focus?.();
        };
    }, [open]);

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    const toneClasses = {
        primary: {
            header:
                "from-sky-500 via-blue-600 to-indigo-700",

            icon:
                "bg-white/15 text-white ring-white/20",
        },

        warning: {
            header:
                "from-amber-500 via-orange-500 to-orange-600",

            icon:
                "bg-white/15 text-white ring-white/20",
        },

        neutral: {
            header:
                "from-slate-700 via-slate-800 to-slate-900",

            icon:
                "bg-white/15 text-white ring-white/20",
        },

        danger: {
            header:
                "from-rose-500 via-rose-600 to-red-700",

            icon:
                "bg-white/15 text-white ring-white/20",
        },
    };

    const selectedTone =
        toneClasses[tone] ??
        toneClasses.primary;

    function handleBackdropMouseDown(
        event
    ) {
        if (
            event.target ===
            event.currentTarget &&
            !loading
        ) {
            onClose?.();
        }
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key={`${titleId}-overlay`}
                    role="presentation"
                    onMouseDown={
                        handleBackdropMouseDown
                    }
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="
                        fixed inset-0
                        z-[210]
                        flex items-end
                        justify-center
                        bg-slate-950/55
                        backdrop-blur-sm
                        sm:items-center
                        sm:p-5
                    "
                >
                    <motion.div
                        ref={
                            dialogReference
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={
                            titleId
                        }
                        aria-describedby={
                            description
                                ? descriptionId
                                : undefined
                        }
                        initial={{
                            opacity: 0,
                            y: 28,
                            scale: 0.975,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            flex
                            max-h-[94dvh]
                            w-full
                            max-w-xl
                            flex-col
                            overflow-hidden
                            rounded-t-[30px]
                            border border-border
                            bg-surface
                            text-foreground
                            shadow-2xl
                            sm:rounded-[30px]
                        "
                    >
                        <header
                            className={`
                                relative
                                isolate
                                shrink-0
                                overflow-hidden
                                bg-gradient-to-br
                                px-5 py-5
                                text-white
                                sm:px-6

                                ${selectedTone.header}
                            `}
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    -right-12 -top-14
                                    size-36
                                    rounded-full
                                    bg-white/15
                                    blur-2xl
                                "
                            />

                            <div
                                className="
                                    relative z-10
                                    flex min-w-0
                                    items-start gap-3
                                "
                            >
                                <span
                                    className={`
                                        flex size-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ring-1
                                        ring-inset
                                        backdrop-blur-sm

                                        ${selectedTone.icon}
                                    `}
                                >
                                    <Icon
                                        size={20}
                                        aria-hidden="true"
                                    />
                                </span>

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    <h2
                                        id={titleId}
                                        className="
                                            truncate
                                            text-lg
                                            font-semibold
                                            tracking-tight
                                            sm:text-xl
                                        "
                                    >
                                        {title}
                                    </h2>

                                    {description && (
                                        <p
                                            id={
                                                descriptionId
                                            }
                                            className="
                                                mt-1
                                                text-sm
                                                leading-5
                                                text-white/75
                                            "
                                        >
                                            {description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    ref={
                                        closeButtonReference
                                    }
                                    type="button"
                                    onClick={onClose}
                                    disabled={
                                        loading
                                    }
                                    aria-label="Fechar modal"
                                    title="Fechar"
                                    className="
                                        inline-flex size-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-white/10
                                        text-white/80
                                        ring-1
                                        ring-inset
                                        ring-white/15
                                        transition
                                        hover:bg-white/20
                                        hover:text-white
                                        focus-visible:outline-none
                                        focus-visible:ring-4
                                        focus-visible:ring-white/15
                                        disabled:pointer-events-none
                                        disabled:opacity-40
                                    "
                                >
                                    <FiX
                                        size={20}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </header>

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                px-4 py-5
                                scrollbar-subtle
                                sm:px-6
                                sm:py-6
                            "
                        >
                            {children}
                        </div>

                        {footer && (
                            <footer
                                className="
                                    shrink-0
                                    border-t
                                    border-border
                                    bg-surface
                                    px-4 py-4
                                    sm:px-6
                                "
                            >
                                {footer}
                            </footer>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

function ActionItem({
    icon: Icon,
    title,
    description,
    tone = "primary",
    disabled = false,
    onClick,
}) {
    const toneClasses = {
        primary:
            "bg-primary-muted text-primary",

        warning:
            "bg-warning-muted text-warning",

        neutral:
            "bg-surface-muted text-muted-foreground",

        danger:
            "bg-danger-muted text-danger",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="
                group
                flex min-h-20
                w-full min-w-0
                items-center gap-3
                rounded-2xl
                border border-border
                bg-surface
                p-3.5
                text-left
                transition
                hover:-translate-y-0.5
                hover:border-border-strong
                hover:shadow-card
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-ring/10
                disabled:pointer-events-none
                disabled:opacity-50
            "
        >
            <span
                className={`
                    flex size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl

                    ${toneClasses[tone] ??
                    toneClasses.primary
                    }
                `}
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <span
                className="
                    min-w-0 flex-1
                "
            >
                <span
                    className="
                        block truncate
                        text-sm
                        font-semibold
                        text-foreground
                    "
                >
                    {title}
                </span>

                <span
                    className="
                        mt-1
                        block
                        line-clamp-2
                        text-xs
                        leading-5
                        text-muted-foreground
                    "
                >
                    {description}
                </span>
            </span>

            <FiChevronRight
                size={18}
                aria-hidden="true"
                className="
                    shrink-0
                    text-muted-foreground
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:text-foreground
                "
            />
        </button>
    );
}

function DetailRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div
            className="
                flex min-w-0
                items-center gap-3
                border-b border-border
                px-1 py-4
                last:border-b-0
                sm:px-2
            "
        >
            <span
                className="
                    flex size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-surface-muted
                    text-muted-foreground
                "
            >
                <Icon
                    size={16}
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0 flex-1">
                <p
                    className="
                        text-xs
                        font-medium
                        text-muted-foreground
                    "
                >
                    {label}
                </p>

                <p
                    title={String(value)}
                    className="
                        mt-1
                        truncate
                        text-sm
                        font-semibold
                        text-foreground
                    "
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

function Profile() {
    const navigate =
        useNavigate();

    const {
        user,
        logout,
        updateAuthenticatedUser,
    } = useAuth();

    const [
        activeModal,
        setActiveModal,
    ] = useState(null);

    const [
        profileForm,
        setProfileForm,
    ] = useState({
        name: "",
        email: "",
        currentPassword: "",
    });

    const [
        passwordForm,
        setPasswordForm,
    ] = useState({
        currentPassword: "",
        newPassword: "",
        passwordConfirmation: "",
    });

    const [
        deletePassword,
        setDeletePassword,
    ] = useState("");

    const [
        savingProfile,
        setSavingProfile,
    ] = useState(false);

    const [
        savingPassword,
        setSavingPassword,
    ] = useState(false);

    const [
        deletingAccount,
        setDeletingAccount,
    ] = useState(false);

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    useEffect(() => {
        if (!user) {
            return;
        }

        setProfileForm({
            name:
                user.name ?? "",

            email:
                user.email ?? "",

            currentPassword: "",
        });
    }, [user]);

    function showNotification(
        type,
        message
    ) {
        setNotification({
            type,
            message,
        });
    }

    function clearNotification() {
        setNotification({
            type: "info",
            message: "",
        });
    }

    function openModal(type) {
        clearNotification();

        if (
            type ===
            MODAL_TYPES.PROFILE
        ) {
            setProfileForm({
                name:
                    user?.name ?? "",

                email:
                    user?.email ?? "",

                currentPassword: "",
            });
        }

        if (
            type ===
            MODAL_TYPES.PASSWORD
        ) {
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                passwordConfirmation: "",
            });
        }

        if (
            type ===
            MODAL_TYPES.DELETE
        ) {
            setDeletePassword("");
        }

        setActiveModal(type);
    }

    function closeModal() {
        if (
            savingProfile ||
            savingPassword ||
            deletingAccount
        ) {
            return;
        }

        setActiveModal(null);
    }

    function handleProfileChange(
        event
    ) {
        const {
            name,
            value,
        } = event.target;

        setProfileForm(
            (currentForm) => ({
                ...currentForm,
                [name]: value,
            })
        );
    }

    function handlePasswordChange(
        event
    ) {
        const {
            name,
            value,
        } = event.target;

        setPasswordForm(
            (currentForm) => ({
                ...currentForm,
                [name]: value,
            })
        );
    }

    async function handleProfileSubmit(
        event
    ) {
        event.preventDefault();

        if (savingProfile) {
            return;
        }

        clearNotification();

        const name =
            profileForm.name.trim();

        const email =
            profileForm.email
                .trim()
                .toLowerCase();

        const currentEmail =
            String(
                user?.email ?? ""
            )
                .trim()
                .toLowerCase();

        if (name.length < 2) {
            showNotification(
                "error",
                "Informe um nome com pelo menos 2 caracteres."
            );

            return;
        }

        if (!email) {
            showNotification(
                "error",
                "Informe um endereço de e-mail válido."
            );

            return;
        }

        const emailChanged =
            email !== currentEmail;

        if (
            emailChanged &&
            !profileForm.currentPassword
        ) {
            showNotification(
                "error",
                "Digite sua senha atual para confirmar a alteração do e-mail."
            );

            return;
        }

        const requestData = {
            name,
            email,
        };

        if (
            profileForm.currentPassword
        ) {
            requestData.currentPassword =
                profileForm.currentPassword;
        }

        setSavingProfile(true);

        try {
            const response =
                await userService
                    .updateOwnProfile(
                        requestData
                    );

            updateAuthenticatedUser(
                response.user
            );

            setActiveModal(null);

            showNotification(
                "success",
                "Seus dados foram atualizados."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível atualizar seus dados."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordSubmit(
        event
    ) {
        event.preventDefault();

        if (savingPassword) {
            return;
        }

        clearNotification();

        if (
            !passwordForm.currentPassword
        ) {
            showNotification(
                "error",
                "Digite sua senha atual."
            );

            return;
        }

        if (
            passwordForm.newPassword
                .length < 8
        ) {
            showNotification(
                "error",
                "A nova senha deve ter pelo menos 8 caracteres."
            );

            return;
        }

        if (
            passwordForm.newPassword ===
            passwordForm.currentPassword
        ) {
            showNotification(
                "error",
                "Escolha uma senha diferente da atual."
            );

            return;
        }

        if (
            passwordForm.newPassword !==
            passwordForm
                .passwordConfirmation
        ) {
            showNotification(
                "error",
                "A confirmação não corresponde à nova senha."
            );

            return;
        }

        setSavingPassword(true);

        try {
            const response =
                await userService
                    .updateOwnProfile({
                        currentPassword:
                            passwordForm
                                .currentPassword,

                        newPassword:
                            passwordForm
                                .newPassword,
                    });

            updateAuthenticatedUser(
                response.user
            );

            setActiveModal(null);

            showNotification(
                "success",
                "Sua senha foi alterada."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível alterar sua senha."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    async function handleDeleteAccount(
        event
    ) {
        event.preventDefault();

        if (
            deletingAccount
        ) {
            return;
        }

        clearNotification();

        if (
            user?.role === "ADMIN"
        ) {
            showNotification(
                "error",
                "Administradores não podem excluir a própria conta."
            );

            return;
        }

        if (!deletePassword) {
            showNotification(
                "error",
                "Digite sua senha atual para confirmar a exclusão."
            );

            return;
        }

        setDeletingAccount(true);

        try {
            await userService
                .deleteOwnAccount(
                    deletePassword
                );

            logout();

            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível excluir sua conta."
            );
        } finally {
            setDeletingAccount(false);
        }
    }

    const userInitials =
        getInitials(
            user?.name
        );

    const userRole =
        user?.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

    const createdAt =
        user?.createdAt
            ? formatDate(
                user.createdAt
            )
            : "Não informado";

    const profileChanged =
        profileForm.name.trim() !==
        String(
            user?.name ?? ""
        ).trim() ||
        profileForm.email
            .trim()
            .toLowerCase() !==
        String(
            user?.email ?? ""
        )
            .trim()
            .toLowerCase();

    const passwordsMatch =
        passwordForm
            .passwordConfirmation
            .length > 0 &&
        passwordForm.newPassword ===
        passwordForm
            .passwordConfirmation;

    return (
        <div
            className="
                w-full min-w-0
                max-w-none
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex w-full
                    min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex min-w-0
                        items-center gap-3
                    "
                >
                    <span
                        className="
                            hidden size-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-sky-500
                            via-blue-600
                            to-indigo-700
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            sm:flex
                        "
                    >
                        <FiUser
                            size={21}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <div
                            className="
                                flex flex-wrap
                                items-center gap-2
                            "
                        >
                            <h1
                                className="
                                    truncate
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-foreground
                                "
                            >
                                Meu perfil
                            </h1>

                            <span
                                className="
                                    rounded-full
                                    bg-primary-muted
                                    px-2.5 py-1
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-primary
                                "
                            >
                                Conta
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Consulte seus dados e gerencie as configurações da conta.
                        </p>
                    </div>
                </header>

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border border-border
                        bg-surface
                        p-5
                        shadow-card
                        sm:p-6
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            -right-20 -top-24
                            size-52
                            rounded-full
                            bg-primary/[0.045]
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            relative
                            flex min-w-0
                            flex-col gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-4
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    flex size-16
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-sky-500
                                    via-blue-600
                                    to-indigo-700
                                    text-lg
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-500/20
                                "
                            >
                                {userInitials}
                            </span>

                            <div className="min-w-0">
                                <h2
                                    title={
                                        user?.name ??
                                        "Usuário"
                                    }
                                    className="
                                        break-words
                                        text-lg
                                        font-semibold
                                        leading-tight
                                        text-foreground
                                        sm:text-xl
                                    "
                                >
                                    {user?.name ??
                                        "Usuário"
                                    }
                                </h2>

                                <p
                                    title={
                                        user?.email ??
                                        "E-mail não informado"
                                    }
                                    className="
                                        mt-1
                                        truncate
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    {user?.email ??
                                        "E-mail não informado"
                                    }
                                </p>

                                <span
                                    className="
                                        mt-2.5
                                        inline-flex
                                        items-center gap-1.5
                                        rounded-full
                                        bg-primary-muted
                                        px-2.5 py-1
                                        text-xs
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    <FiShield
                                        size={13}
                                        aria-hidden="true"
                                    />

                                    {userRole}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                openModal(
                                    MODAL_TYPES.PROFILE
                                )
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-primary
                                px-5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:bg-primary-hover
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary/25
                                sm:w-auto
                            "
                        >
                            <FiUser
                                size={17}
                                aria-hidden="true"
                            />

                            Editar perfil
                        </button>
                    </div>
                </section>

                <section
                    aria-label="Configurações do perfil"
                    className="
                        grid gap-3
                        md:grid-cols-2
                    "
                >
                    <ActionItem
                        icon={FiUser}
                        title="Dados pessoais"
                        description="Altere seu nome completo e o endereço de e-mail."
                        onClick={() =>
                            openModal(
                                MODAL_TYPES.PROFILE
                            )
                        }
                    />

                    <ActionItem
                        icon={FiLock}
                        title="Senha e segurança"
                        description="Defina uma nova senha para acessar sua conta."
                        tone="warning"
                        onClick={() =>
                            openModal(
                                MODAL_TYPES.PASSWORD
                            )
                        }
                    />

                    <ActionItem
                        icon={FiInfo}
                        title="Informações da conta"
                        description="Consulte identificador, perfil de acesso e data de cadastro."
                        tone="neutral"
                        onClick={() =>
                            openModal(
                                MODAL_TYPES.ACCOUNT
                            )
                        }
                    />

                    <ActionItem
                        icon={
                            user?.role === "ADMIN"
                                ? FiShield
                                : FiTrash2
                        }
                        title={
                            user?.role === "ADMIN"
                                ? "Conta protegida"
                                : "Excluir minha conta"
                        }
                        description={
                            user?.role === "ADMIN"
                                ? "Administradores não podem excluir a própria conta."
                                : "Remova permanentemente a conta e os dados financeiros."
                        }
                        tone="danger"
                        disabled={
                            user?.role === "ADMIN"
                        }
                        onClick={() =>
                            openModal(
                                MODAL_TYPES.DELETE
                            )
                        }
                    />
                </section>

                <button
                    type="button"
                    onClick={() => {
                        logout();

                        navigate(
                            "/login",
                            {
                                replace: true,
                            }
                        );
                    }}
                    className="
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-border
                        bg-surface
                        px-5
                        text-sm
                        font-semibold
                        text-muted-foreground
                        transition
                        hover:bg-surface-hover
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring/20
                        sm:w-auto
                        sm:self-start
                    "
                >
                    <FiLogOut
                        size={17}
                        aria-hidden="true"
                    />

                    Sair da conta
                </button>
            </div>

            <ProfileModal
                open={
                    activeModal ===
                    MODAL_TYPES.PROFILE
                }
                title="Editar dados pessoais"
                description="Atualize as informações usadas na sua conta."
                icon={FiUser}
                loading={savingProfile}
                onClose={closeModal}
                footer={
                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-2.5
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={
                                savingProfile
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-surface
                                px-5
                                text-sm
                                font-semibold
                                text-foreground
                                transition
                                hover:bg-surface-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="profile-data-form"
                            disabled={
                                savingProfile ||
                                !profileChanged
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-primary
                                px-5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:bg-primary-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            {savingProfile ? (
                                <FiLoader
                                    size={17}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <FiSave
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            {savingProfile
                                ? "Salvando..."
                                : "Salvar alterações"
                            }
                        </button>
                    </div>
                }
            >
                <form
                    id="profile-data-form"
                    onSubmit={
                        handleProfileSubmit
                    }
                    className="space-y-5"
                >
                    <FormField
                        id="profile-name"
                        name="name"
                        label="Nome completo"
                        value={
                            profileForm.name
                        }
                        onChange={
                            handleProfileChange
                        }
                        icon={FiUser}
                        placeholder="Digite seu nome completo"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={
                            savingProfile
                        }
                    />

                    <FormField
                        id="profile-email"
                        name="email"
                        label="Endereço de e-mail"
                        value={
                            profileForm.email
                        }
                        onChange={
                            handleProfileChange
                        }
                        type="email"
                        icon={FiMail}
                        placeholder="Digite seu endereço de e-mail"
                        autoComplete="email"
                        required
                        disabled={
                            savingProfile
                        }
                    />

                    <PasswordField
                        id="profile-current-password"
                        name="currentPassword"
                        label="Senha atual para confirmar"
                        value={
                            profileForm
                                .currentPassword
                        }
                        onChange={
                            handleProfileChange
                        }
                        autoComplete="current-password"
                        placeholder="Obrigatória somente ao alterar o e-mail"
                        disabled={
                            savingProfile
                        }
                        helperText="Você só precisa informar a senha atual quando alterar o endereço de e-mail."
                    />
                </form>
            </ProfileModal>

            <ProfileModal
                open={
                    activeModal ===
                    MODAL_TYPES.PASSWORD
                }
                title="Alterar senha"
                description="Escolha uma senha segura e diferente da atual."
                icon={FiLock}
                tone="warning"
                loading={savingPassword}
                onClose={closeModal}
                footer={
                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-2.5
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={
                                savingPassword
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-surface
                                px-5
                                text-sm
                                font-semibold
                                text-foreground
                                transition
                                hover:bg-surface-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="profile-password-form"
                            disabled={
                                savingPassword
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-primary
                                px-5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:bg-primary-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            {savingPassword ? (
                                <FiLoader
                                    size={17}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <FiLock
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            {savingPassword
                                ? "Alterando..."
                                : "Alterar senha"
                            }
                        </button>
                    </div>
                }
            >
                <form
                    id="profile-password-form"
                    onSubmit={
                        handlePasswordSubmit
                    }
                    className="space-y-5"
                >
                    <PasswordField
                        id="password-current"
                        name="currentPassword"
                        label="Senha atual"
                        value={
                            passwordForm
                                .currentPassword
                        }
                        onChange={
                            handlePasswordChange
                        }
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha atual"
                        disabled={
                            savingPassword
                        }
                    />

                    <PasswordField
                        id="password-new"
                        name="newPassword"
                        label="Nova senha"
                        value={
                            passwordForm
                                .newPassword
                        }
                        onChange={
                            handlePasswordChange
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Use pelo menos 8 caracteres"
                        disabled={
                            savingPassword
                        }
                        helperText="Use uma combinação difícil de adivinhar e diferente da senha atual."
                    />

                    <PasswordField
                        id="password-confirmation"
                        name="passwordConfirmation"
                        label="Confirmar nova senha"
                        value={
                            passwordForm
                                .passwordConfirmation
                        }
                        onChange={
                            handlePasswordChange
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Digite a nova senha novamente"
                        disabled={
                            savingPassword
                        }
                    />

                    {passwordsMatch && (
                        <div
                            className="
                                flex items-center
                                gap-2
                                rounded-2xl
                                bg-success-muted
                                px-3.5 py-3
                                text-xs
                                font-semibold
                                text-success
                            "
                        >
                            <FiCheckCircle
                                size={16}
                                aria-hidden="true"
                            />

                            As senhas coincidem.
                        </div>
                    )}
                </form>
            </ProfileModal>

            <ProfileModal
                open={
                    activeModal ===
                    MODAL_TYPES.ACCOUNT
                }
                title="Informações da conta"
                description="Dados internos associados ao seu cadastro."
                icon={FiInfo}
                tone="neutral"
                onClose={closeModal}
                footer={
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary
                                px-5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:bg-primary-hover
                                sm:w-auto
                            "
                        >
                            Fechar
                        </button>
                    </div>
                }
            >
                <div className="min-w-0">
                    <DetailRow
                        icon={FiHash}
                        label="Identificador da conta"
                        value={`#${user?.id ?? "—"}`}
                    />

                    <DetailRow
                        icon={FiShield}
                        label="Perfil de acesso"
                        value={userRole}
                    />

                    <DetailRow
                        icon={FiCalendar}
                        label="Data de criação"
                        value={createdAt}
                    />

                    <DetailRow
                        icon={FiMail}
                        label="E-mail cadastrado"
                        value={
                            user?.email ??
                            "Não informado"
                        }
                    />
                </div>
            </ProfileModal>

            <ProfileModal
                open={
                    activeModal ===
                    MODAL_TYPES.DELETE
                }
                title="Excluir minha conta"
                description="Esta ação removerá permanentemente sua conta e os dados financeiros."
                icon={FiAlertTriangle}
                tone="danger"
                loading={deletingAccount}
                onClose={closeModal}
                footer={
                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-2.5
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={
                                deletingAccount
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                border border-border
                                bg-surface
                                px-5
                                text-sm
                                font-semibold
                                text-foreground
                                transition
                                hover:bg-surface-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="delete-account-form"
                            disabled={
                                deletingAccount
                            }
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-danger
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-danger-hover
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            {deletingAccount ? (
                                <FiLoader
                                    size={17}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <FiTrash2
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            {deletingAccount
                                ? "Excluindo..."
                                : "Excluir permanentemente"
                            }
                        </button>
                    </div>
                }
            >
                <form
                    id="delete-account-form"
                    onSubmit={
                        handleDeleteAccount
                    }
                    className="space-y-5"
                >
                    <div
                        className="
                            flex items-start
                            gap-3
                            rounded-2xl
                            border
                            border-danger/20
                            bg-danger-muted
                            p-4
                            text-danger
                        "
                    >
                        <FiAlertTriangle
                            size={18}
                            aria-hidden="true"
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <p
                            className="
                                text-sm
                                leading-6
                            "
                        >
                            Receitas, despesas e demais informações vinculadas à conta também serão removidas. Esta ação não poderá ser desfeita.
                        </p>
                    </div>

                    <PasswordField
                        id="delete-password"
                        name="deletePassword"
                        label="Senha atual para confirmar a exclusão"
                        value={
                            deletePassword
                        }
                        onChange={(
                            event
                        ) =>
                            setDeletePassword(
                                event.target.value
                            )
                        }
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha atual"
                        disabled={
                            deletingAccount
                        }
                        tone="danger"
                    />
                </form>
            </ProfileModal>

            <Snackbar
                message={
                    notification.message
                }
                type={
                    notification.type
                }
                duration={4500}
                onClose={
                    clearNotification
                }
            />
        </div>
    );
}

export default Profile;