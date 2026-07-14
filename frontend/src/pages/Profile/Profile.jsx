import { useEffect, useState } from "react";

import {
    FiAlertTriangle,
    FiLock,
    FiSave,
    FiTrash2,
    FiUser,
} from "react-icons/fi";

import { useNavigate } from "react-router";

import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { formatDate } from "../../utils/formatDate.js";

function Profile() {
    const navigate = useNavigate();

    const {
        user,
        logout,
        updateAuthenticatedUser,
    } = useAuth();

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        currentPassword: "",
    });

    const [passwordForm, setPasswordForm] =
        useState({
            currentPassword: "",
            newPassword: "",
            passwordConfirmation: "",
        });

    const [deletePassword, setDeletePassword] =
        useState("");

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingPassword, setSavingPassword] =
        useState(false);

    const [deletingAccount, setDeletingAccount] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name ?? "",
                email: user.email ?? "",
                currentPassword: "",
            });
        }
    }, [user]);

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    function handleProfileChange(event) {
        const { name, value } = event.target;

        setProfileForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    function handlePasswordChange(event) {
        const { name, value } = event.target;

        setPasswordForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    async function handleProfileSubmit(event) {
        event.preventDefault();

        clearMessages();

        const name = profileForm.name.trim();
        const email = profileForm.email
            .trim()
            .toLowerCase();

        if (name.length < 2) {
            setErrorMessage(
                "O nome deve possuir pelo menos 2 caracteres."
            );

            return;
        }

        if (!email) {
            setErrorMessage(
                "Informe um endereço de e-mail."
            );

            return;
        }

        const emailChanged = email !== user?.email;

        if (
            emailChanged &&
            !profileForm.currentPassword
        ) {
            setErrorMessage(
                "Informe sua senha atual para alterar o e-mail."
            );

            return;
        }

        const requestData = {
            name,
            email,
        };

        if (profileForm.currentPassword) {
            requestData.currentPassword =
                profileForm.currentPassword;
        }

        setSavingProfile(true);

        try {
            const response =
                await userService.updateOwnProfile(
                    requestData
                );

            updateAuthenticatedUser(response.user);

            setProfileForm((currentForm) => ({
                ...currentForm,
                name: response.user.name,
                email: response.user.email,
                currentPassword: "",
            }));

            setSuccessMessage(
                "Perfil atualizado com sucesso."
            );
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível atualizar o perfil."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();

        clearMessages();

        if (!passwordForm.currentPassword) {
            setErrorMessage(
                "Informe sua senha atual."
            );

            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setErrorMessage(
                "A nova senha deve possuir pelo menos 8 caracteres."
            );

            return;
        }

        if (
            passwordForm.newPassword !==
            passwordForm.passwordConfirmation
        ) {
            setErrorMessage(
                "A confirmação da nova senha está diferente."
            );

            return;
        }

        setSavingPassword(true);

        try {
            const response =
                await userService.updateOwnProfile({
                    currentPassword:
                        passwordForm.currentPassword,

                    newPassword:
                        passwordForm.newPassword,
                });

            updateAuthenticatedUser(response.user);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                passwordConfirmation: "",
            });

            setSuccessMessage(
                "Senha alterada com sucesso."
            );
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível alterar a senha."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    async function handleDeleteAccount(event) {
        event.preventDefault();

        clearMessages();

        if (user?.role === "ADMIN") {
            setErrorMessage(
                "Um administrador não pode excluir a própria conta."
            );

            return;
        }

        if (!deletePassword) {
            setErrorMessage(
                "Informe sua senha para excluir a conta."
            );

            return;
        }

        const confirmed = window.confirm(
            "Deseja realmente excluir sua conta? Todas as suas receitas e despesas também serão excluídas."
        );

        if (!confirmed) {
            return;
        }

        setDeletingAccount(true);

        try {
            await userService.deleteOwnAccount(
                deletePassword
            );

            logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível excluir a conta."
            );
        } finally {
            setDeletingAccount(false);
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Meu perfil
                </h1>

                <p className="text-sm text-slate-500">
                    Gerencie os dados da sua conta.
                </p>
            </div>

            {errorMessage && (
                <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center gap-2">
                        <FiUser />

                        <h2 className="font-semibold text-slate-800">
                            Dados pessoais
                        </h2>
                    </div>

                    <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="mb-1 block text-sm font-medium"
                            >
                                Nome
                            </label>

                            <input
                                id="profile-name"
                                name="name"
                                type="text"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                required
                                minLength={2}
                                maxLength={100}
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="profile-email"
                                className="mb-1 block text-sm font-medium"
                            >
                                E-mail
                            </label>

                            <input
                                id="profile-email"
                                name="email"
                                type="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="profile-current-password"
                                className="mb-1 block text-sm font-medium"
                            >
                                Senha atual
                            </label>

                            <input
                                id="profile-current-password"
                                name="currentPassword"
                                type="password"
                                value={
                                    profileForm.currentPassword
                                }
                                onChange={handleProfileChange}
                                autoComplete="current-password"
                                placeholder="Necessária para alterar o e-mail"
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <p className="mt-1 text-xs text-slate-500">
                                A senha só é necessária caso o
                                e-mail seja alterado.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                        >
                            <FiSave />

                            {savingProfile
                                ? "Salvando..."
                                : "Salvar dados"}
                        </button>
                    </form>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center gap-2">
                        <FiLock />

                        <h2 className="font-semibold text-slate-800">
                            Alterar senha
                        </h2>
                    </div>

                    <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="password-current"
                                className="mb-1 block text-sm font-medium"
                            >
                                Senha atual
                            </label>

                            <input
                                id="password-current"
                                name="currentPassword"
                                type="password"
                                value={
                                    passwordForm.currentPassword
                                }
                                onChange={handlePasswordChange}
                                required
                                autoComplete="current-password"
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password-new"
                                className="mb-1 block text-sm font-medium"
                            >
                                Nova senha
                            </label>

                            <input
                                id="password-new"
                                name="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password-confirmation"
                                className="mb-1 block text-sm font-medium"
                            >
                                Confirmar nova senha
                            </label>

                            <input
                                id="password-confirmation"
                                name="passwordConfirmation"
                                type="password"
                                value={
                                    passwordForm.passwordConfirmation
                                }
                                onChange={handlePasswordChange}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                        >
                            <FiLock />

                            {savingPassword
                                ? "Alterando..."
                                : "Alterar senha"}
                        </button>
                    </form>
                </section>
            </div>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-4 font-semibold text-slate-800">
                    Informações da conta
                </h2>

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                        <p className="text-slate-500">
                            Identificador
                        </p>

                        <p className="font-medium">
                            #{user?.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500">
                            Tipo de usuário
                        </p>

                        <p className="font-medium">
                            {user?.role === "ADMIN"
                                ? "Administrador"
                                : "Usuário"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500">
                            Cadastrado em
                        </p>

                        <p className="font-medium">
                            {formatDate(user?.createdAt)}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-red-700">
                    <FiAlertTriangle />

                    <h2 className="font-semibold">
                        Excluir conta
                    </h2>
                </div>

                {user?.role === "ADMIN" ? (
                    <p className="text-sm text-red-700">
                        Administradores não podem excluir a
                        própria conta. Outro administrador
                        precisa realizar essa operação.
                    </p>
                ) : (
                    <form
                        onSubmit={handleDeleteAccount}
                        className="max-w-md"
                    >
                        <p className="mb-4 text-sm text-red-700">
                            Esta operação excluirá permanentemente
                            sua conta, receitas e despesas.
                        </p>

                        <label
                            htmlFor="delete-password"
                            className="mb-1 block text-sm font-medium text-red-800"
                        >
                            Confirme sua senha
                        </label>

                        <input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(event) =>
                                setDeletePassword(
                                    event.target.value
                                )
                            }
                            required
                            autoComplete="current-password"
                            className="mb-3 w-full rounded-md border border-red-300 bg-white px-3 py-2"
                        />

                        <button
                            type="submit"
                            disabled={deletingAccount}
                            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                        >
                            <FiTrash2 />

                            {deletingAccount
                                ? "Excluindo..."
                                : "Excluir minha conta"}
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
}

export default Profile;