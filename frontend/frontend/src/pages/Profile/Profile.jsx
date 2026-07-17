import {
    useEffect,
    useState,
} from "react";

import {
    RiRefreshLine,
} from "react-icons/ri";

import {
    useNavigate,
} from "react-router";

import Button from "../../components/ui/actions/Button.jsx";

import {
    ErrorState,
    LoadingState,
    Snackbar,
} from "../../components/ui/feedback/index.js";

import {
    Page,
    PageGrid,
    PageHeader,
} from "../../components/ui/layout/index.js";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    userService,
} from "../../services/userService.js";

import {
    formatDate,
} from "../../utils/formatDate.js";

import ProfileActionsPanel from "./components/ProfileActionsPanel.jsx";
import ProfileDialogs, {
    DIALOGS,
} from "./components/ProfileDialogs.jsx";
import ProfileOverview from "./components/ProfileOverview.jsx";

import {
    getAccountAccessMethod,
    getErrorMessage,
    getPasswordValidation,
    isEmailChanged,
    isValidEmail,
} from "./components/profileUtils.js";

function Profile() {
    const navigate = useNavigate();

    const {
        user,
        logout,
        updateAuthenticatedUser,
    } = useAuth();

    const hasLocalPassword = user?.authMethods?.password ?? true;

    const [activeDialog, setActiveDialog] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        currentPassword: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        passwordConfirmation: "",
    });

    const [deletePassword, setDeletePassword] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        variant: "info",
        title: "",
        description: "",
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

    useEffect(() => {
        let active = true;

        async function loadOwnProfile() {
            setLoadingProfile(true);
            setLoadError("");

            try {
                const response = await userService.getOwnProfile();

                if (active) {
                    updateAuthenticatedUser(response.user);
                }
            } catch (error) {
                if (active) {
                    setLoadError(getErrorMessage(
                        error,
                        "Não foi possível atualizar as informações do perfil."
                    ));
                }
            } finally {
                if (active) {
                    setLoadingProfile(false);
                }
            }
        }

        loadOwnProfile();

        return () => {
            active = false;
        };
    }, [updateAuthenticatedUser]);

    function showNotification(variant, title, description) {
        setNotification({
            open: true,
            variant,
            title,
            description,
        });
    }

    function closeNotification() {
        setNotification((current) => ({
            ...current,
            open: false,
        }));
    }

    async function refreshProfile() {
        setLoadingProfile(true);
        setLoadError("");

        try {
            const response = await userService.getOwnProfile();
            updateAuthenticatedUser(response.user);
            showNotification("success", "Perfil atualizado", "As informações mais recentes foram carregadas.");
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Não foi possível atualizar as informações do perfil."
            );

            setLoadError(message);
            showNotification("danger", "Falha ao atualizar", message);
        } finally {
            setLoadingProfile(false);
        }
    }

    function openDialog(type) {
        if (type === DIALOGS.PASSWORD && !hasLocalPassword) {
            showNotification(
                "info",
                "Acesso com Google",
                "Esta conta ainda não possui uma senha local."
            );
            return;
        }

        if (type === DIALOGS.DELETE && user?.role === "ADMIN") {
            showNotification(
                "danger",
                "Exclusão indisponível",
                "Administradores não podem excluir a própria conta."
            );
            return;
        }

        if (type === DIALOGS.DELETE && !hasLocalPassword) {
            showNotification(
                "info",
                "Exclusão indisponível",
                "A exclusão de contas que utilizam somente o Google ainda não está disponível."
            );
            return;
        }

        if (type === DIALOGS.PROFILE) {
            setProfileForm({
                name: user?.name ?? "",
                email: user?.email ?? "",
                currentPassword: "",
            });
        }

        if (type === DIALOGS.PASSWORD) {
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                passwordConfirmation: "",
            });
        }

        if (type === DIALOGS.DELETE) {
            setDeletePassword("");
        }

        setActiveDialog(type);
    }

    function closeDialog() {
        if (savingProfile || savingPassword || deletingAccount) {
            return;
        }

        setActiveDialog(null);
    }

    async function handleProfileSubmit(formValue) {
        if (savingProfile) {
            return;
        }

        const name = String(formValue.name ?? "").trim();
        const email = String(formValue.email ?? "").trim().toLowerCase();
        const emailWasChanged = isEmailChanged(email, user?.email);

        if (name.length < 2) {
            showNotification("danger", "Nome inválido", "Informe um nome com pelo menos 2 caracteres.");
            return;
        }

        if (!isValidEmail(email)) {
            showNotification("danger", "E-mail inválido", "Informe um endereço de e-mail válido.");
            return;
        }

        if (emailWasChanged && !hasLocalPassword) {
            showNotification(
                "danger",
                "E-mail não alterado",
                "O e-mail de uma conta que utiliza somente o Google não pode ser alterado por esta tela."
            );
            return;
        }

        if (emailWasChanged && !formValue.currentPassword) {
            showNotification(
                "danger",
                "Confirmação necessária",
                "Digite sua senha atual para confirmar a alteração do e-mail."
            );
            return;
        }

        const requestData = { name, email };

        if (formValue.currentPassword) {
            requestData.currentPassword = formValue.currentPassword;
        }

        setSavingProfile(true);

        try {
            const response = await userService.updateOwnProfile(requestData);
            updateAuthenticatedUser(response.user);
            setActiveDialog(null);
            showNotification("success", "Dados atualizados", "Suas informações pessoais foram salvas.");
        } catch (error) {
            showNotification(
                "danger",
                "Não foi possível salvar",
                getErrorMessage(error, "Não foi possível atualizar seus dados.")
            );
        } finally {
            setSavingProfile(false);
        }
    }

    function handlePasswordFieldChange(field, value) {
        setPasswordForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();

        if (savingPassword) {
            return;
        }

        if (!passwordForm.currentPassword) {
            showNotification("danger", "Senha atual necessária", "Digite sua senha atual.");
            return;
        }

        const validation = getPasswordValidation(passwordForm.newPassword);
        const firstInvalid = validation.items.find((item) => !item.valid);

        if (firstInvalid) {
            showNotification(
                "danger",
                "Nova senha incompleta",
                `A nova senha precisa ter: ${firstInvalid.label.toLowerCase()}.`
            );
            return;
        }

        if (passwordForm.newPassword === passwordForm.currentPassword) {
            showNotification("danger", "Escolha outra senha", "A nova senha deve ser diferente da atual.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.passwordConfirmation) {
            showNotification("danger", "Confirmação incorreta", "A confirmação não corresponde à nova senha.");
            return;
        }

        setSavingPassword(true);

        try {
            const response = await userService.updateOwnProfile({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            updateAuthenticatedUser(response.user);
            setActiveDialog(null);
            showNotification("success", "Senha alterada", "Sua nova senha já está ativa.");
        } catch (error) {
            showNotification(
                "danger",
                "Não foi possível alterar a senha",
                getErrorMessage(error, "Verifique sua senha atual e tente novamente.")
            );
        } finally {
            setSavingPassword(false);
        }
    }

    async function handleDeleteAccount(event) {
        event.preventDefault();

        if (deletingAccount) {
            return;
        }

        if (!deletePassword) {
            showNotification("danger", "Senha necessária", "Digite sua senha atual para confirmar a exclusão.");
            return;
        }

        setDeletingAccount(true);

        try {
            await userService.deleteOwnAccount(deletePassword);
            logout();
            navigate("/login", { replace: true });
        } catch (error) {
            showNotification(
                "danger",
                "Não foi possível excluir a conta",
                getErrorMessage(error, "Verifique sua senha e tente novamente.")
            );
        } finally {
            setDeletingAccount(false);
        }
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    const createdAt = user?.createdAt
        ? formatDate(user.createdAt)
        : "Não informado";

    const accessMethod = getAccountAccessMethod(user);
    const profileChanged = String(profileForm.name ?? "").trim() !== String(user?.name ?? "").trim()
        || isEmailChanged(profileForm.email, user?.email);
    const emailChanged = isEmailChanged(profileForm.email, user?.email);
    const passwordValidation = getPasswordValidation(passwordForm.newPassword);
    const passwordsMatch = passwordForm.passwordConfirmation.length > 0
        && passwordForm.newPassword === passwordForm.passwordConfirmation;

    if (loadingProfile && !user) {
        return (
            <Page maxWidth="full">
                <LoadingState
                    title="Carregando seu perfil"
                    description="Estamos buscando as informações mais recentes da conta."
                />
            </Page>
        );
    }

    if (loadError && !user) {
        return (
            <Page maxWidth="full">
                <ErrorState
                    title="Não foi possível abrir o perfil"
                    description={loadError}
                    action={
                        <Button
                            leadingIcon={<RiRefreshLine size={18} aria-hidden="true" />}
                            onClick={refreshProfile}
                        >
                            Tentar novamente
                        </Button>
                    }
                />
            </Page>
        );
    }

    return (
        <Page maxWidth="full">
            <PageHeader
                eyebrow="Conta"
                title="Meu perfil"
                description="Consulte seus dados, gerencie a segurança e controle as opções da conta."
                meta={loadingProfile ? (
                    <span className="inline-flex items-center gap-2 text-caption text-muted-foreground">
                        <RiRefreshLine size={14} aria-hidden="true" className="animate-spin" />
                        Atualizando informações
                    </span>
                ) : null}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                        onClick={refreshProfile}
                        loading={loadingProfile}
                        loadingText="Atualizando..."
                    >
                        Atualizar
                    </Button>
                }
            />

            <PageGrid columns="content" gap="lg" className="items-start">
                <ProfileOverview
                    user={user}
                    accessMethod={accessMethod}
                    createdAt={createdAt}
                />

                <ProfileActionsPanel
                    user={user}
                    hasLocalPassword={hasLocalPassword}
                    onEditProfile={() => openDialog(DIALOGS.PROFILE)}
                    onChangePassword={() => openDialog(DIALOGS.PASSWORD)}
                    onShowAccount={() => openDialog(DIALOGS.ACCOUNT)}
                    onDeleteAccount={() => openDialog(DIALOGS.DELETE)}
                    onLogout={handleLogout}
                />
            </PageGrid>

            <ProfileDialogs
                activeDialog={activeDialog}
                onClose={closeDialog}
                user={user}
                hasLocalPassword={hasLocalPassword}
                accessMethod={accessMethod}
                createdAt={createdAt}
                profileForm={profileForm}
                onProfileFormChange={setProfileForm}
                onProfileSubmit={handleProfileSubmit}
                profileChanged={profileChanged}
                emailChanged={emailChanged}
                savingProfile={savingProfile}
                passwordForm={passwordForm}
                onPasswordFieldChange={handlePasswordFieldChange}
                onPasswordSubmit={handlePasswordSubmit}
                passwordValidation={passwordValidation}
                passwordsMatch={passwordsMatch}
                savingPassword={savingPassword}
                deletePassword={deletePassword}
                onDeletePasswordChange={setDeletePassword}
                onDeleteAccount={handleDeleteAccount}
                deletingAccount={deletingAccount}
            />

            <Snackbar
                open={notification.open}
                onOpenChange={(open) => {
                    if (!open) {
                        closeNotification();
                    }
                }}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
                duration={5000}
            />
        </Page>
    );
}

export default Profile;
