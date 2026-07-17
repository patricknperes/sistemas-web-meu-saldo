import {
    RiCalendarEventLine,
    RiDeleteBinLine,
    RiFingerprintLine,
    RiInformationLine,
    RiLockPasswordLine,
    RiMailLine,
    RiSave3Line,
    RiShieldUserLine,
    RiUserSettingsLine,
} from "react-icons/ri";

import {
    ProfileForm,
    UserDetailItem,
    UserDetailList,
} from "../../../components/ui/account/index.js";

import Button from "../../../components/ui/actions/Button.jsx";

import PasswordField from "../../../components/ui/auth/PasswordField.jsx";

import {
    Alert,
    Modal,
} from "../../../components/ui/feedback/index.js";

import {
    formatAccountId,
} from "./profileUtils.js";

const DIALOGS = {
    PROFILE: "PROFILE",
    PASSWORD: "PASSWORD",
    ACCOUNT: "ACCOUNT",
    DELETE: "DELETE",
};

function DialogFooter({
    form,
    loading,
    submitLabel,
    loadingText,
    submitVariant = "primary",
    submitIcon,
    onCancel,
    submitDisabled = false,
}) {
    return (
        <>
            <Button
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
            >
                Cancelar
            </Button>

            <Button
                type="submit"
                form={form}
                variant={submitVariant}
                loading={loading}
                loadingText={loadingText}
                disabled={submitDisabled}
                leadingIcon={submitIcon}
            >
                {submitLabel}
            </Button>
        </>
    );
}

function ProfileDialogs({
    activeDialog,
    onClose,
    user,
    hasLocalPassword,
    accessMethod,
    createdAt,
    profileForm,
    onProfileFormChange,
    onProfileSubmit,
    profileChanged,
    emailChanged,
    savingProfile,
    passwordForm,
    onPasswordFieldChange,
    onPasswordSubmit,
    passwordValidation,
    passwordsMatch,
    savingPassword,
    deletePassword,
    onDeletePasswordChange,
    onDeleteAccount,
    deletingAccount,
}) {
    const busy = savingProfile || savingPassword || deletingAccount;

    return (
        <>
            <Modal
                open={activeDialog === DIALOGS.PROFILE}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
                title="Editar dados pessoais"
                description="Atualize as informações exibidas na sua conta."
                icon={RiUserSettingsLine}
                size="md"
                closeOnBackdrop={!busy}
                closeOnEscape={!busy}
                footer={
                    <DialogFooter
                        form="profile-data-form"
                        loading={savingProfile}
                        submitLabel="Salvar alterações"
                        loadingText="Salvando..."
                        submitIcon={<RiSave3Line size={18} aria-hidden="true" />}
                        onCancel={onClose}
                        submitDisabled={!profileChanged}
                    />
                }
            >
                <ProfileForm
                    id="profile-data-form"
                    value={profileForm}
                    onChange={onProfileFormChange}
                    onSubmit={onProfileSubmit}
                    submitting={savingProfile}
                    emailReadOnly={!hasLocalPassword}
                    showActions={false}
                >
                    {emailChanged && hasLocalPassword ? (
                        <PasswordField
                            name="currentPassword"
                            label="Senha atual"
                            value={profileForm.currentPassword ?? ""}
                            onChange={(event) => onProfileFormChange({
                                ...profileForm,
                                currentPassword: event.target.value,
                            })}
                            autoComplete="current-password"
                            placeholder="Confirme a alteração do e-mail"
                            helperText="A senha atual é obrigatória somente porque o e-mail foi alterado."
                            required
                            disabled={savingProfile}
                        />
                    ) : null}
                </ProfileForm>
            </Modal>

            <Modal
                open={activeDialog === DIALOGS.PASSWORD}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
                title="Senha e segurança"
                description="Crie uma senha forte e diferente da credencial atual."
                icon={RiLockPasswordLine}
                size="md"
                closeOnBackdrop={!busy}
                closeOnEscape={!busy}
                footer={
                    <DialogFooter
                        form="change-password-form"
                        loading={savingPassword}
                        submitLabel="Alterar senha"
                        loadingText="Alterando..."
                        submitIcon={<RiLockPasswordLine size={18} aria-hidden="true" />}
                        onCancel={onClose}
                        submitDisabled={!passwordValidation.valid || !passwordsMatch}
                    />
                }
            >
                <form
                    id="change-password-form"
                    className="grid gap-5"
                    onSubmit={onPasswordSubmit}
                >
                    <PasswordField
                        name="currentPassword"
                        label="Senha atual"
                        value={passwordForm.currentPassword}
                        onChange={(event) => onPasswordFieldChange("currentPassword", event.target.value)}
                        autoComplete="current-password"
                        placeholder="Digite sua senha atual"
                        required
                        disabled={savingPassword}
                    />

                    <PasswordField
                        name="newPassword"
                        label="Nova senha"
                        value={passwordForm.newPassword}
                        onChange={(event) => onPasswordFieldChange("newPassword", event.target.value)}
                        autoComplete="new-password"
                        placeholder="Crie uma nova senha"
                        required
                        showStrength
                        showRequirements
                        disabled={savingPassword}
                    />

                    <PasswordField
                        name="passwordConfirmation"
                        label="Confirme a nova senha"
                        value={passwordForm.passwordConfirmation}
                        onChange={(event) => onPasswordFieldChange("passwordConfirmation", event.target.value)}
                        autoComplete="new-password"
                        placeholder="Repita a nova senha"
                        required
                        successMessage={passwordsMatch ? "As senhas coincidem." : undefined}
                        errorMessage={passwordForm.passwordConfirmation && !passwordsMatch
                            ? "A confirmação ainda não corresponde à nova senha."
                            : undefined
                        }
                        disabled={savingPassword}
                    />
                </form>
            </Modal>

            <Modal
                open={activeDialog === DIALOGS.ACCOUNT}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
                title="Informações da conta"
                description="Dados internos e características do seu cadastro."
                icon={RiInformationLine}
                size="md"
                footer={
                    <Button onClick={onClose}>
                        Fechar
                    </Button>
                }
            >
                <UserDetailList>
                    <UserDetailItem
                        icon={RiFingerprintLine}
                        label="Identificador"
                        value={formatAccountId(user?.id)}
                    />
                    <UserDetailItem
                        icon={RiShieldUserLine}
                        label="Perfil de acesso"
                        value={user?.role === "ADMIN" ? "Administrador" : "Usuário"}
                    />
                    <UserDetailItem
                        icon={RiCalendarEventLine}
                        label="Data de criação"
                        value={createdAt}
                    />
                    <UserDetailItem
                        icon={RiMailLine}
                        label="E-mail cadastrado"
                        value={user?.email}
                    />
                    <UserDetailItem
                        icon={RiLockPasswordLine}
                        label="Método de acesso"
                        value={accessMethod}
                    />
                </UserDetailList>
            </Modal>

            <Modal
                open={activeDialog === DIALOGS.DELETE}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
                title="Excluir minha conta"
                description="Esta ação é permanente e não poderá ser desfeita."
                icon={RiDeleteBinLine}
                size="md"
                closeOnBackdrop={!deletingAccount}
                closeOnEscape={!deletingAccount}
                footer={
                    <DialogFooter
                        form="delete-account-form"
                        loading={deletingAccount}
                        submitLabel="Excluir permanentemente"
                        loadingText="Excluindo..."
                        submitVariant="danger"
                        submitIcon={<RiDeleteBinLine size={18} aria-hidden="true" />}
                        onCancel={onClose}
                        submitDisabled={!deletePassword}
                    />
                }
            >
                <form
                    id="delete-account-form"
                    className="grid gap-5"
                    onSubmit={onDeleteAccount}
                >
                    <Alert variant="danger" title="Todos os dados serão removidos">
                        Receitas, despesas, recorrências, tags e demais informações vinculadas à conta também serão excluídas.
                    </Alert>

                    <PasswordField
                        name="deletePassword"
                        label="Senha atual"
                        value={deletePassword}
                        onChange={(event) => onDeletePasswordChange(event.target.value)}
                        autoComplete="current-password"
                        placeholder="Confirme com sua senha atual"
                        helperText="A senha é necessária para confirmar que a solicitação foi feita por você."
                        required
                        disabled={deletingAccount}
                    />
                </form>
            </Modal>
        </>
    );
}

export {
    DIALOGS,
};

export default ProfileDialogs;
