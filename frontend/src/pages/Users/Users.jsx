import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import ConfirmDialog from "../../components/feedback/ConfirmDialog.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { adminUserKeys, fetchAdminUsers } from "../../features/admin-users/api/adminUserQueries.js";
import AdminUserDialog from "../../features/admin-users/components/AdminUserDialog.jsx";
import AdminUserList from "../../features/admin-users/components/AdminUserList.jsx";
import AdminUsersSummary from "../../features/admin-users/components/AdminUsersSummary.jsx";
import AdminUsersToolbar from "../../features/admin-users/components/AdminUsersToolbar.jsx";
import { isSameUser } from "../../features/admin-users/utils/adminUserFormatters.js";
import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.js";

const initialFilters = {
    search: "",
    role: "ALL",
    status: "ALL",
    page: 1,
    pageSize: 10,
};

function Users() {
    const queryClient = useQueryClient();
    const { user: authenticatedUser, updateAuthenticatedUser } = useAuth();
    const [filters, setFilters] = useState(initialFilters);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [mutatingUserId, setMutatingUserId] = useState(null);
    const [notice, setNotice] = useState({ type: "info", message: "" });
    const deferredSearch = useDeferredValue(filters.search);

    const queryFilters = useMemo(() => ({
        page: filters.page,
        pageSize: filters.pageSize,
        ...(deferredSearch.trim() ? { search: deferredSearch.trim() } : {}),
        ...(filters.role !== "ALL" ? { role: filters.role } : {}),
        ...(filters.status !== "ALL" ? { status: filters.status } : {}),
    }), [deferredSearch, filters.page, filters.pageSize, filters.role, filters.status]);

    const usersQuery = useQuery({
        queryKey: adminUserKeys.list(queryFilters),
        queryFn: () => fetchAdminUsers(queryFilters),
        placeholderData: (previousData) => previousData,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => userService.update(id, data),
        onMutate: ({ id }) => setMutatingUserId(id),
        onSuccess: async (response) => {
            const updatedUser = response?.user ?? response;
            if (isSameUser(updatedUser?.id, authenticatedUser?.id)) updateAuthenticatedUser(updatedUser);
            setEditingUser(null);
            setNotice({ type: "success", message: response?.message ?? "Usuário atualizado com sucesso." });
            await queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
        },
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error, "Não foi possível atualizar o usuário.") }),
        onSettled: () => setMutatingUserId(null),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => userService.remove(id),
        onMutate: (id) => setMutatingUserId(id),
        onSuccess: async (response) => {
            setDeletingUser(null);
            setNotice({ type: "success", message: response?.message ?? "Usuário excluído com sucesso." });
            await queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
        },
        onError: (error) => setNotice({ type: "error", message: getApiErrorMessage(error, "Não foi possível excluir o usuário.") }),
        onSettled: () => setMutatingUserId(null),
    });

    const data = usersQuery.data ?? {};
    const users = data.users ?? [];
    const pagination = data.pagination ?? { page: filters.page, pageSize: filters.pageSize, totalItems: 0, totalPages: 1 };
    const summary = data.summary ?? { total: 0, active: 0, inactive: 0, admins: 0 };
    const isRefreshing = usersQuery.isFetching;

    useEffect(() => {
        if (pagination.totalPages && filters.page > pagination.totalPages) {
            setFilters((current) => ({ ...current, page: pagination.totalPages }));
        }
    }, [filters.page, pagination.totalPages]);

    function updateFilters(changes) {
        setFilters((current) => ({ ...current, ...changes }));
    }

    function resetFilters() {
        setFilters((current) => ({ ...initialFilters, pageSize: current.pageSize }));
    }

    function toggleStatus(targetUser, isActive) {
        updateMutation.mutate({ id: targetUser.id, data: { isActive } });
    }

    async function saveUser(values) {
        if (!editingUser) return;

        try {
            await updateMutation.mutateAsync({ id: editingUser.id, data: values });
        } catch {
            // A mensagem é exibida pelo Snackbar da mutação.
        }
    }

    if (usersQuery.error && !usersQuery.data) {
        return (
            <PageContainer className="py-5 sm:py-7 lg:py-8">
                <div className="flex min-h-80 flex-col items-center justify-center rounded-card border border-danger/20 bg-danger-muted px-6 text-center">
                    <h1 className="text-lg font-bold text-danger">Não foi possível carregar os usuários</h1>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{getApiErrorMessage(usersQuery.error)}</p>
                    <Button className="mt-5" variant="secondary" onClick={() => usersQuery.refetch()}>Tentar novamente</Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="space-y-6 py-5 sm:py-7 lg:space-y-7 lg:py-8">
            <PageHeader
                eyebrow="Administração"
                title="Usuários"
                description="Gerencie contas, permissões e acessos sem comprometer a segurança administrativa do sistema."
                actions={(
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => usersQuery.refetch()}
                        disabled={isRefreshing}
                        className="
                            bg-transparent
                            text-primary
                            shadow-none
                            hover:bg-transparent
                            hover:text-primary-hover
                            focus-visible:bg-transparent
                            disabled:bg-transparent
                        "
                        aria-label="Atualizar usuários"
                        title="Atualizar usuários"
                    >
                        <RefreshCw className={`size-5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                    </Button>
                )}
            />

            <AdminUsersSummary summary={summary} loading={usersQuery.isPending && !usersQuery.data} />

            <AdminUsersToolbar filters={filters} disabled={isRefreshing} onChange={updateFilters} onReset={resetFilters} />

            {usersQuery.error && usersQuery.data && (
                <div role="status" className="flex flex-col gap-2 rounded-card-sm border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-warning sm:flex-row sm:items-center sm:justify-between">
                    <span>A lista não pôde ser atualizada. Os últimos dados disponíveis continuam visíveis.</span>
                    <button type="button" className="shrink-0 font-bold underline underline-offset-4" onClick={() => usersQuery.refetch()}>Tentar novamente</button>
                </div>
            )}

            <AdminUserList
                users={users}
                pagination={pagination}
                authenticatedUserId={authenticatedUser?.id}
                loading={isRefreshing}
                mutatingUserId={mutatingUserId}
                onEdit={setEditingUser}
                onToggleStatus={toggleStatus}
                onDelete={setDeletingUser}
                onPageChange={(page) => updateFilters({ page })}
                onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
            />

            <AdminUserDialog
                open={Boolean(editingUser)}
                targetUser={editingUser}
                authenticatedUserId={authenticatedUser?.id}
                loading={updateMutation.isPending}
                onClose={() => setEditingUser(null)}
                onSubmit={saveUser}
            />

            <ConfirmDialog
                open={Boolean(deletingUser)}
                title="Excluir usuário"
                description={deletingUser ? `A conta de ${deletingUser.name} e todos os dados financeiros vinculados serão removidos permanentemente.` : ""}
                confirmLabel="Excluir usuário"
                loading={deleteMutation.isPending}
                onCancel={() => setDeletingUser(null)}
                onConfirm={() => deletingUser && deleteMutation.mutate(deletingUser.id)}
            />

            <Snackbar message={notice.message} type={notice.type} onClose={() => setNotice((current) => ({ ...current, message: "" }))} />
        </PageContainer>
    );
}

export default Users;
