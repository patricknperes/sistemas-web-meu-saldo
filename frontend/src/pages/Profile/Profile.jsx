import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";

import Snackbar from "../../components/feedback/Snackbar.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { fetchOwnProfile, profileKeys } from "../../features/profile/api/profileQueries.js";
import ChangePasswordDialog from "../../features/profile/components/ChangePasswordDialog.jsx";
import DeleteAccountDialog from "../../features/profile/components/DeleteAccountDialog.jsx";
import EditProfileDialog from "../../features/profile/components/EditProfileDialog.jsx";
import ProfileHero from "../../features/profile/components/ProfileHero.jsx";
import ProfileOverview from "../../features/profile/components/ProfileOverview.jsx";
import ProfileSecurityCard from "../../features/profile/components/ProfileSecurityCard.jsx";
import ProfileSkeleton from "../../features/profile/components/ProfileSkeleton.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.js";

function Profile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, updateAuthenticatedUser, logout } = useAuth();
    const [activeDialog, setActiveDialog] = useState("");
    const [notice, setNotice] = useState({ type: "info", message: "" });

    const profileQuery = useQuery({
        queryKey: profileKeys.own(),
        queryFn: fetchOwnProfile,
        initialData: user ? { ...user, authMethods: user.authMethods ?? {} } : undefined,
    });

    const updateProfileMutation = useMutation({
        mutationFn: userService.updateOwnProfile,
        onSuccess: (response) => {
            const updatedProfile = response?.user ?? response;
            queryClient.setQueryData(profileKeys.own(), updatedProfile);
            updateAuthenticatedUser(updatedProfile);
            setActiveDialog("");
            setNotice({ type: "success", message: response?.message ?? "Perfil atualizado com sucesso." });
        },
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error, "Não foi possível atualizar o perfil.") }),
    });

    const changePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }) => userService.updateOwnProfile({ currentPassword, newPassword }),
        onSuccess: (response) => {
            const updatedProfile = response?.user ?? profileQuery.data;
            queryClient.setQueryData(profileKeys.own(), updatedProfile);
            setActiveDialog("");
            setNotice({ type: "success", message: "Senha alterada com sucesso." });
        },
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error, "Não foi possível alterar a senha.") }),
    });

    const deleteAccountMutation = useMutation({
        mutationFn: ({ password }) => userService.deleteOwnAccount(password),
        onSuccess: () => {
            setActiveDialog("");
            queryClient.clear();
            logout();
            navigate("/login", { replace: true, state: { message: "Sua conta foi excluída com sucesso." } });
        },
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error, "Não foi possível excluir a conta.") }),
    });

    const profile = profileQuery.data;
    const isRefreshing = profileQuery.isFetching;

    if (profileQuery.isPending && !profile) {
        return (
            <PageContainer className="py-5 sm:py-7 lg:py-8">
                <ProfileSkeleton />
            </PageContainer>
        );
    }

    if (profileQuery.error && !profile) {
        return (
            <PageContainer className="py-5 sm:py-7 lg:py-8">
                <div className="flex min-h-80 flex-col items-center justify-center rounded-card border border-danger/20 bg-danger-muted px-6 text-center">
                    <h1 className="text-lg font-bold text-danger">Não foi possível carregar seu perfil</h1>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{getApiErrorMessage(profileQuery.error)}</p>
                    <Button className="mt-5" variant="secondary" onClick={() => profileQuery.refetch()}>Tentar novamente</Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="space-y-6 py-5 sm:py-7 lg:space-y-7 lg:py-8">
            <PageHeader
                eyebrow="Sua conta"
                title="Perfil"
                description="Gerencie seus dados pessoais, métodos de acesso e opções de segurança."
                actions={(
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => profileQuery.refetch()}
                        disabled={isRefreshing}
                        aria-label="Atualizar perfil"
                        title="Atualizar perfil"
                    >
                        <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                    </Button>
                )}
            />

            {profileQuery.error && profile && (
                <div role="status" className="rounded-card-sm border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-warning">
                    Não foi possível atualizar os dados agora. As últimas informações carregadas continuam disponíveis.
                </div>
            )}

            <ProfileHero profile={profile} onEdit={() => setActiveDialog("EDIT")} />

            <section className="grid gap-4 lg:grid-cols-12" aria-label="Informações e segurança da conta">
                <ProfileOverview profile={profile} />
                <ProfileSecurityCard
                    profile={profile}
                    onChangePassword={() => setActiveDialog("PASSWORD")}
                    onDeleteAccount={() => setActiveDialog("DELETE")}
                />
            </section>

            <EditProfileDialog
                open={activeDialog === "EDIT"}
                profile={profile}
                loading={updateProfileMutation.isPending}
                onClose={() => setActiveDialog("")}
                onSubmit={async (values) => {
                    try {
                        await updateProfileMutation.mutateAsync(values);
                    } catch {
                        // A mensagem é exibida pelo Snackbar da mutação.
                    }
                }}
            />

            <ChangePasswordDialog
                open={activeDialog === "PASSWORD"}
                loading={changePasswordMutation.isPending}
                onClose={() => setActiveDialog("")}
                onSubmit={async (values) => {
                    try {
                        await changePasswordMutation.mutateAsync(values);
                    } catch {
                        // A mensagem é exibida pelo Snackbar da mutação.
                    }
                }}
            />

            <DeleteAccountDialog
                open={activeDialog === "DELETE"}
                loading={deleteAccountMutation.isPending}
                onClose={() => setActiveDialog("")}
                onSubmit={async (values) => {
                    try {
                        await deleteAccountMutation.mutateAsync(values);
                    } catch {
                        // A mensagem é exibida pelo Snackbar da mutação.
                    }
                }}
            />

            <Snackbar message={notice.message} type={notice.type} onClose={() => setNotice((current) => ({ ...current, message: "" }))} />
        </PageContainer>
    );
}

export default Profile;
