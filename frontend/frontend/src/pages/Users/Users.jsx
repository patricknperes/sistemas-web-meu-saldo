import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RiRefreshLine,
    RiShieldUserLine,
    RiUserSettingsLine,
} from "react-icons/ri";

import Button from "../../components/ui/actions/Button.jsx";
import {
    Alert,
    ConfirmDialog,
    EmptyState,
    ErrorState,
    LoadingState,
    Snackbar,
} from "../../components/ui/feedback/index.js";
import {
    Page,
    PageHeader,
    PageSection,
} from "../../components/ui/layout/index.js";
import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";

import UserEditDialog from "./components/UserEditDialog.jsx";
import UsersDataView from "./components/UsersDataView.jsx";
import UsersSummary from "./components/UsersSummary.jsx";
import UsersToolbar from "./components/UsersToolbar.jsx";
import {
    createUserUpdatePayload,
    filterUsers,
    getErrorMessage,
    getUsersStatistics,
    isSameUser,
    toUserFormValue,
    validateUserForm,
} from "./components/usersUtils.js";

const PAGE_SIZE = 8;

const initialNotification = {
    open: false,
    variant: "info",
    title: "",
    description: "",
};

function Users() {
    const {
        user: authenticatedUser,
        updateAuthenticatedUser,
    } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadError, setLoadError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const [editingUser, setEditingUser] = useState(null);
    const [editValue, setEditValue] = useState({});
    const [editError, setEditError] = useState("");
    const [savingUser, setSavingUser] = useState(false);

    const [notification, setNotification] = useState(initialNotification);

    const showNotification = useCallback((variant, title, description) => {
        setNotification({
            open: true,
            variant,
            title,
            description,
        });
    }, []);

    const loadUsers = useCallback(async ({ initial = false } = {}) => {
        if (initial) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setLoadError("");

        try {
            const response = await userService.list();
            setUsers(Array.isArray(response?.users) ? response.users : []);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Não foi possível carregar os usuários."
            );

            setLoadError(message);

            if (!initial) {
                showNotification(
                    "danger",
                    "Falha ao atualizar",
                    message
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [showNotification]);

    useEffect(() => {
        loadUsers({ initial: true });
    }, [loadUsers]);

    const statistics = useMemo(
        () => getUsersStatistics(users),
        [users]
    );

    const filteredUsers = useMemo(
        () => filterUsers(users, {
            search,
            role: roleFilter,
            status: statusFilter,
        }),
        [users, search, roleFilter, statusFilter]
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / PAGE_SIZE)
    );

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredUsers.slice(start, start + PAGE_SIZE);
    }, [currentPage, filteredUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter, statusFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const hasActiveFilters = Boolean(
        search.trim() ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL"
    );

    function clearFilters() {
        setSearch("");
        setRoleFilter("ALL");
        setStatusFilter("ALL");
    }

    function openEditDialog(user) {
        setEditingUser(user);
        setEditValue(toUserFormValue(user));
        setEditError("");
    }

    function closeEditDialog() {
        if (savingUser) {
            return;
        }

        setEditingUser(null);
        setEditValue({});
        setEditError("");
    }

    async function saveUser() {
        if (!editingUser || savingUser) {
            return;
        }

        const validationError = validateUserForm(editValue);

        if (validationError) {
            setEditError(validationError);
            return;
        }

        const ownAccount = isSameUser(
            editingUser.id,
            authenticatedUser?.id
        );
        const payload = createUserUpdatePayload(
            editingUser,
            editValue,
            ownAccount
        );

        if (Object.keys(payload).length === 0) {
            closeEditDialog();
            showNotification(
                "info",
                "Nenhuma alteração",
                "Os dados do usuário já estão atualizados."
            );
            return;
        }

        setSavingUser(true);
        setUpdatingId(editingUser.id);
        setEditError("");

        try {
            const response = await userService.update(
                editingUser.id,
                payload
            );
            const updatedUser = {
                ...editingUser,
                ...payload,
                ...(response?.user ?? {}),
            };

            setUsers((currentUsers) => currentUsers.map((user) => (
                isSameUser(user.id, editingUser.id)
                    ? updatedUser
                    : user
            )));

            if (ownAccount) {
                updateAuthenticatedUser?.(updatedUser);
            }

            setEditingUser(null);
            setEditValue({});

            showNotification(
                "success",
                "Usuário atualizado",
                "As alterações foram salvas com sucesso."
            );
        } catch (error) {
            setEditError(getErrorMessage(
                error,
                "Não foi possível atualizar o usuário."
            ));
        } finally {
            setSavingUser(false);
            setUpdatingId(null);
        }
    }

    async function toggleUserStatus(user) {
        if (updatingId !== null || deletingId !== null) {
            return;
        }

        if (isSameUser(user.id, authenticatedUser?.id)) {
            showNotification(
                "warning",
                "Conta atual protegida",
                "Você não pode desativar a própria conta administrativa."
            );
            return;
        }

        const nextActiveStatus = !user.isActive;
        setUpdatingId(user.id);

        try {
            const response = await userService.update(user.id, {
                isActive: nextActiveStatus,
            });
            const updatedUser = {
                ...user,
                ...(response?.user ?? {}),
                isActive: nextActiveStatus,
            };

            setUsers((currentUsers) => currentUsers.map((currentUser) => (
                isSameUser(currentUser.id, user.id)
                    ? updatedUser
                    : currentUser
            )));

            showNotification(
                "success",
                nextActiveStatus ? "Acesso ativado" : "Acesso suspenso",
                nextActiveStatus
                    ? `${user.name} pode acessar o sistema novamente.`
                    : `O acesso de ${user.name} foi desativado.`
            );
        } catch (error) {
            showNotification(
                "danger",
                "Não foi possível alterar o acesso",
                getErrorMessage(error)
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function requestDelete(user) {
        if (isSameUser(user.id, authenticatedUser?.id)) {
            showNotification(
                "warning",
                "Conta atual protegida",
                "Você não pode excluir a própria conta nesta página."
            );
            return;
        }

        setUserToDelete(user);
    }

    async function confirmDelete() {
        if (!userToDelete || deletingId !== null) {
            return;
        }

        const selectedUser = userToDelete;
        setDeletingId(selectedUser.id);

        try {
            await userService.remove(selectedUser.id);

            setUsers((currentUsers) => currentUsers.filter(
                (user) => !isSameUser(user.id, selectedUser.id)
            ));
            setUserToDelete(null);

            showNotification(
                "success",
                "Usuário excluído",
                `A conta de ${selectedUser.name} foi removida permanentemente.`
            );
        } catch (error) {
            setUserToDelete(null);
            showNotification(
                "danger",
                "Não foi possível excluir",
                getErrorMessage(error)
            );
        } finally {
            setDeletingId(null);
        }
    }

    const pagination = {
        currentPage,
        totalPages,
        totalItems: filteredUsers.length,
        pageSize: PAGE_SIZE,
        itemLabel: "usuários",
        onPageChange: setCurrentPage,
    };

    return (
        <Page>
            <PageHeader
                eyebrow="Administração"
                title="Usuários"
                description="Gerencie dados, funções e acessos das contas cadastradas no Meu Saldo."
                meta={(
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-pill border border-primary/15 bg-primary-muted px-2.5 text-caption font-bold text-primary">
                        <RiShieldUserLine size={14} aria-hidden="true" />
                        Área administrativa
                    </span>
                )}
                actions={(
                    <Button
                        variant="outline"
                        loading={refreshing}
                        loadingText="Atualizando..."
                        leadingIcon={(
                            <RiRefreshLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                        onClick={() => loadUsers()}
                    >
                        Atualizar
                    </Button>
                )}
            />

            <UsersSummary
                statistics={statistics}
                loading={loading}
            />

            <UsersToolbar
                search={search}
                role={roleFilter}
                status={statusFilter}
                resultCount={filteredUsers.length}
                hasActiveFilters={hasActiveFilters}
                onSearchChange={setSearch}
                onRoleChange={setRoleFilter}
                onStatusChange={setStatusFilter}
                onClear={clearFilters}
            />

            {loadError && users.length > 0 ? (
                <Alert
                    variant="warning"
                    title="A lista pode estar desatualizada"
                    action={(
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadUsers()}
                        >
                            Tentar novamente
                        </Button>
                    )}
                >
                    {loadError}
                </Alert>
            ) : null}

            <PageSection
                title="Contas cadastradas"
                description="Edite dados, altere permissões, suspenda acessos ou remova contas."
                actions={(
                    <span className="inline-flex h-7 items-center rounded-pill border border-border bg-surface-muted px-3 text-caption font-bold text-muted-foreground">
                        {filteredUsers.length}{" "}
                        {filteredUsers.length === 1 ? "conta" : "contas"}
                    </span>
                )}
            >
                {loading ? (
                    <LoadingState
                        title="Carregando usuários"
                        description="Aguarde enquanto buscamos as contas cadastradas."
                    />
                ) : loadError && users.length === 0 ? (
                    <ErrorState
                        title="Não foi possível carregar os usuários"
                        description={loadError}
                        action={(
                            <Button onClick={() => loadUsers({ initial: true })}>
                                Tentar novamente
                            </Button>
                        )}
                    />
                ) : filteredUsers.length === 0 ? (
                    <EmptyState
                        icon={RiUserSettingsLine}
                        title="Nenhum usuário encontrado"
                        description="Ajuste a pesquisa ou os filtros para encontrar outras contas."
                        action={hasActiveFilters ? (
                            <Button variant="outline" onClick={clearFilters}>
                                Limpar filtros
                            </Button>
                        ) : null}
                    />
                ) : (
                    <UsersDataView
                        users={paginatedUsers}
                        authenticatedUserId={authenticatedUser?.id}
                        updatingId={updatingId}
                        deletingId={deletingId}
                        onEdit={openEditDialog}
                        onToggleStatus={toggleUserStatus}
                        onDelete={requestDelete}
                        pagination={pagination}
                    />
                )}
            </PageSection>

            <UserEditDialog
                open={Boolean(editingUser)}
                user={editingUser}
                value={editValue}
                ownAccount={isSameUser(editingUser?.id, authenticatedUser?.id)}
                submitting={savingUser}
                error={editError}
                onOpenChange={(open) => {
                    if (!open) {
                        closeEditDialog();
                    }
                }}
                onChange={(nextValue) => {
                    setEditValue(nextValue);
                    setEditError("");
                }}
                onSubmit={saveUser}
            />

            <ConfirmDialog
                open={Boolean(userToDelete)}
                onOpenChange={(open) => {
                    if (!open && deletingId === null) {
                        setUserToDelete(null);
                    }
                }}
                title="Excluir usuário?"
                description={userToDelete
                    ? `A conta de ${userToDelete.name} e todas as movimentações associadas serão excluídas permanentemente.`
                    : "Esta ação não poderá ser desfeita."
                }
                confirmLabel="Excluir usuário"
                cancelLabel="Cancelar"
                loading={isSameUser(deletingId, userToDelete?.id)}
                onConfirm={confirmDelete}
            >
                <Alert variant="danger" title="Exclusão permanente">
                    Esta ação também remove os dados financeiros vinculados à conta.
                </Alert>
            </ConfirmDialog>

            <Snackbar
                open={notification.open}
                onOpenChange={(open) => setNotification((current) => ({
                    ...current,
                    open,
                }))}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />
        </Page>
    );
}

export default Users;
