import {
    useEffect,
    useState,
} from "react";

import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiEye,
    FiEyeOff,
    FiHash,
    FiLoader,
    FiLock,
    FiMail,
    FiSave,
    FiShield,
    FiTrash2,
    FiUser,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router";

import ConfirmDialog from "../../components/feedback/ConfirmDialog.jsx";
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

    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]
        }`.toUpperCase();
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
}) {
    const [
        passwordVisible,
        setPasswordVisible,
    ] = useState(false);

    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-foreground
                "
            >
                {label}
            </label>

            <div className="relative min-w-0">
                <FiLock
                    size={16}
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-3.5 top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                    "
                />

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
                        h-11 w-full
                        min-w-0
                        rounded-xl
                        border border-border
                        bg-background
                        py-2
                        pl-10 pr-11
                        text-sm
                        text-foreground
                        outline-none
                        transition
                        placeholder:text-muted-foreground/70
                        hover:border-border-strong
                        focus:border-foreground/40
                        focus:ring-2
                        focus:ring-ring/15
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
                        right-1.5 top-1/2
                        inline-flex size-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-hover
                        hover:text-foreground
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
                        mt-1.5
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

function SectionHeader({
    icon: Icon,
    title,
    description,
    tone = "neutral",
}) {
    const iconClasses = {
        neutral:
            "bg-surface-muted text-muted-foreground",

        info:
            "bg-info-muted text-info",

        warning:
            "bg-warning-muted text-warning",

        danger:
            "bg-danger-muted text-danger",
    };

    return (
        <header
            className="
                flex min-w-0
                items-start gap-3
                border-b border-border
                px-5 py-4
            "
        >
            <span
                className={`
                    flex size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${iconClasses[tone] ??
                    iconClasses.neutral
                    }
                `}
            >
                <Icon
                    size={17}
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0">
                <h2
                    className="
                        truncate
                        text-sm
                        font-semibold
                        text-foreground
                    "
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className="
                            mt-0.5
                            text-xs
                            leading-5
                            text-muted-foreground
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </header>
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
        deleteDialogOpen,
        setDeleteDialogOpen,
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
            name: user.name ?? "",
            email: user.email ?? "",
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

    function handleProfileChange(event) {
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

    function handlePasswordChange(event) {
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
                "O nome deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        if (!email) {
            showNotification(
                "error",
                "Informe um endereço de e-mail."
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
                "Informe sua senha atual para alterar o e-mail."
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

            setProfileForm({
                name:
                    response.user.name ??
                    name,

                email:
                    response.user.email ??
                    email,

                currentPassword: "",
            });

            showNotification(
                "success",
                "Perfil atualizado com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível atualizar o perfil."
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
                "Informe sua senha atual."
            );

            return;
        }

        if (
            passwordForm.newPassword
                .length < 8
        ) {
            showNotification(
                "error",
                "A nova senha deve possuir pelo menos 8 caracteres."
            );

            return;
        }

        if (
            passwordForm.newPassword ===
            passwordForm.currentPassword
        ) {
            showNotification(
                "error",
                "A nova senha deve ser diferente da senha atual."
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
                "A confirmação da nova senha está diferente."
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

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                passwordConfirmation: "",
            });

            showNotification(
                "success",
                "Senha alterada com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível alterar a senha."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    function handleDeleteRequest(event) {
        event.preventDefault();

        clearNotification();

        if (
            user?.role === "ADMIN"
        ) {
            showNotification(
                "error",
                "Um administrador não pode excluir a própria conta."
            );

            return;
        }

        if (!deletePassword) {
            showNotification(
                "error",
                "Informe sua senha para excluir a conta."
            );

            return;
        }

        setDeleteDialogOpen(true);
    }

    function cancelDeleteAccount() {
        if (deletingAccount) {
            return;
        }

        setDeleteDialogOpen(false);
    }

    async function confirmDeleteAccount() {
        if (
            deletingAccount ||
            !deletePassword
        ) {
            return;
        }

        setDeletingAccount(true);
        clearNotification();

        try {
            await userService
                .deleteOwnAccount(
                    deletePassword
                );

            setDeleteDialogOpen(false);

            logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            setDeleteDialogOpen(false);

            showNotification(
                "error",
                error.response?.data
                    ?.error ??
                "Não foi possível excluir a conta."
            );
        } finally {
            setDeletingAccount(false);
        }
    }

    const userInitials =
        getInitials(user?.name);

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
                    flex w-full min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header>
                    <h1
                        className="
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Meu perfil
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Gerencie seus dados pessoais,
                        segurança e informações da conta.
                    </p>
                </header>

                <section
                    className="
                        flex min-w-0
                        flex-col gap-4
                        rounded-2xl
                        border border-border
                        bg-surface
                        p-5
                        shadow-card
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
                                flex size-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-primary
                                text-base
                                font-semibold
                                text-primary-foreground
                            "
                        >
                            {userInitials}
                        </span>

                        <div className="min-w-0">
                            <h2
                                className="
                                    truncate
                                    text-base
                                    font-semibold
                                    text-foreground
                                "
                            >
                                {user?.name ??
                                    "Usuário"}
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                {user?.email ??
                                    "E-mail não informado"}
                            </p>

                            <span
                                className="
                                    mt-2
                                    inline-flex
                                    items-center gap-1.5
                                    rounded-full
                                    bg-surface-muted
                                    px-2.5 py-1
                                    text-xs
                                    font-medium
                                    text-muted-foreground
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

                    <div
                        className="
                            flex items-center
                            gap-2
                            text-xs
                            text-muted-foreground
                        "
                    >
                        <FiCalendar
                            size={15}
                            aria-hidden="true"
                        />

                        Conta criada em{" "}
                        {createdAt}
                    </div>
                </section>

                <div
                    className="
                        grid min-w-0
                        gap-5
                        xl:grid-cols-2
                    "
                >
                    <section
                        className="
                            min-w-0
                            overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-surface
                            shadow-card
                        "
                    >
                        <SectionHeader
                            icon={FiUser}
                            title="Dados pessoais"
                            description="Atualize seu nome e endereço de e-mail."
                            tone="info"
                        />

                        <form
                            onSubmit={
                                handleProfileSubmit
                            }
                            className="
                                space-y-5
                                p-5
                            "
                        >
                            <div className="min-w-0">
                                <label
                                    htmlFor="profile-name"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-foreground
                                    "
                                >
                                    Nome
                                </label>

                                <div className="relative min-w-0">
                                    <FiUser
                                        size={16}
                                        aria-hidden="true"
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5 top-1/2
                                            -translate-y-1/2
                                            text-muted-foreground
                                        "
                                    />

                                    <input
                                        id="profile-name"
                                        name="name"
                                        type="text"
                                        value={
                                            profileForm.name
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        disabled={
                                            savingProfile
                                        }
                                        autoComplete="name"
                                        className="
                                            h-11 w-full
                                            min-w-0
                                            rounded-xl
                                            border border-border
                                            bg-background
                                            py-2
                                            pl-10 pr-3.5
                                            text-sm
                                            text-foreground
                                            outline-none
                                            transition
                                            placeholder:text-muted-foreground/70
                                            hover:border-border-strong
                                            focus:border-foreground/40
                                            focus:ring-2
                                            focus:ring-ring/15
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <label
                                    htmlFor="profile-email"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-foreground
                                    "
                                >
                                    E-mail
                                </label>

                                <div className="relative min-w-0">
                                    <FiMail
                                        size={16}
                                        aria-hidden="true"
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5 top-1/2
                                            -translate-y-1/2
                                            text-muted-foreground
                                        "
                                    />

                                    <input
                                        id="profile-email"
                                        name="email"
                                        type="email"
                                        value={
                                            profileForm.email
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        required
                                        disabled={
                                            savingProfile
                                        }
                                        autoComplete="email"
                                        className="
                                            h-11 w-full
                                            min-w-0
                                            rounded-xl
                                            border border-border
                                            bg-background
                                            py-2
                                            pl-10 pr-3.5
                                            text-sm
                                            text-foreground
                                            outline-none
                                            transition
                                            placeholder:text-muted-foreground/70
                                            hover:border-border-strong
                                            focus:border-foreground/40
                                            focus:ring-2
                                            focus:ring-ring/15
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    />
                                </div>
                            </div>

                            <PasswordField
                                id="profile-current-password"
                                name="currentPassword"
                                label="Senha atual"
                                value={
                                    profileForm
                                        .currentPassword
                                }
                                onChange={
                                    handleProfileChange
                                }
                                autoComplete="current-password"
                                placeholder="Necessária para alterar o e-mail"
                                disabled={
                                    savingProfile
                                }
                                helperText="A senha atual só é necessária quando o endereço de e-mail for alterado."
                            />

                            <div
                                className="
                                    flex
                                    justify-end
                                    border-t
                                    border-border
                                    pt-5
                                "
                            >
                                <button
                                    type="submit"
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
                                        font-medium
                                        text-primary-foreground
                                        transition-colors
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
                                        : "Salvar dados"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section
                        className="
                            min-w-0
                            overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-surface
                            shadow-card
                        "
                    >
                        <SectionHeader
                            icon={FiLock}
                            title="Alterar senha"
                            description="Use uma senha diferente e com pelo menos 8 caracteres."
                            tone="warning"
                        />

                        <form
                            onSubmit={
                                handlePasswordSubmit
                            }
                            className="
                                space-y-5
                                p-5
                            "
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
                                placeholder="Mínimo de 8 caracteres"
                                disabled={
                                    savingPassword
                                }
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
                                        rounded-xl
                                        bg-success-muted
                                        px-3 py-2.5
                                        text-xs
                                        font-medium
                                        text-success
                                    "
                                >
                                    <FiCheckCircle
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    As senhas coincidem.
                                </div>
                            )}

                            <div
                                className="
                                    flex
                                    justify-end
                                    border-t
                                    border-border
                                    pt-5
                                "
                            >
                                <button
                                    type="submit"
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
                                        font-medium
                                        text-primary-foreground
                                        transition-colors
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
                                        : "Alterar senha"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <section
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <SectionHeader
                        icon={FiShield}
                        title="Informações da conta"
                        description="Dados internos associados ao seu cadastro."
                        tone="neutral"
                    />

                    <div
                        className="
                            grid gap-3
                            p-5
                            sm:grid-cols-3
                        "
                    >
                        <article
                            className="
                                flex min-w-0
                                items-center gap-3
                                rounded-xl
                                bg-surface-muted
                                p-4
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-surface
                                    text-muted-foreground
                                "
                            >
                                <FiHash
                                    size={16}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Identificador
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    #{user?.id ?? "—"}
                                </p>
                            </div>
                        </article>

                        <article
                            className="
                                flex min-w-0
                                items-center gap-3
                                rounded-xl
                                bg-surface-muted
                                p-4
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-surface
                                    text-muted-foreground
                                "
                            >
                                <FiShield
                                    size={16}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Tipo de usuário
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {userRole}
                                </p>
                            </div>
                        </article>

                        <article
                            className="
                                flex min-w-0
                                items-center gap-3
                                rounded-xl
                                bg-surface-muted
                                p-4
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-surface
                                    text-muted-foreground
                                "
                            >
                                <FiCalendar
                                    size={16}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Cadastrado em
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {createdAt}
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                <section
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border border-danger/25
                        bg-surface
                        shadow-card
                    "
                >
                    <SectionHeader
                        icon={FiAlertTriangle}
                        title="Zona de perigo"
                        description="A exclusão da conta é permanente e não poderá ser desfeita."
                        tone="danger"
                    />

                    <div className="p-5">
                        {user?.role ===
                            "ADMIN" ? (
                            <div
                                className="
                                    flex items-start
                                    gap-3
                                    rounded-xl
                                    bg-danger-muted
                                    p-4
                                    text-sm
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

                                <p className="leading-6">
                                    Administradores não
                                    podem excluir a própria
                                    conta. Outro
                                    administrador precisa
                                    realizar essa operação.
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={
                                    handleDeleteRequest
                                }
                                className="
                                    flex min-w-0
                                    flex-col gap-5
                                    lg:flex-row
                                    lg:items-end
                                    lg:justify-between
                                "
                            >
                                <div
                                    className="
                                        min-w-0
                                        max-w-xl
                                        flex-1
                                    "
                                >
                                    <p
                                        className="
                                            mb-4
                                            text-sm
                                            leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        Ao excluir sua conta,
                                        todas as receitas,
                                        despesas e demais
                                        informações
                                        financeiras também
                                        serão removidas.
                                    </p>

                                    <PasswordField
                                        id="delete-password"
                                        name="deletePassword"
                                        label="Confirme sua senha"
                                        value={
                                            deletePassword
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDeletePassword(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha atual"
                                        disabled={
                                            deletingAccount
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        deletingAccount
                                    }
                                    className="
                                        inline-flex
                                        min-h-11
                                        w-full
                                        shrink-0
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-danger
                                        px-5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:opacity-90
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                        lg:w-auto
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
                                        : "Excluir minha conta"}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Excluir sua conta?"
                description="Sua conta e todos os dados financeiros associados serão excluídos permanentemente. Esta ação não poderá ser desfeita."
                confirmLabel="Excluir conta"
                cancelLabel="Cancelar"
                loading={deletingAccount}
                onConfirm={
                    confirmDeleteAccount
                }
                onCancel={
                    cancelDeleteAccount
                }
            />

            <Snackbar
                message={
                    notification.message
                }
                type={notification.type}
                duration={4500}
                onClose={clearNotification}
            />
        </div>
    );
}

export default Profile;