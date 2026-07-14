import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    FiRefreshCw,
    FiShield,
    FiToggleLeft,
    FiToggleRight,
    FiTrash2,
    FiUser,
    FiUsers,
} from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { formatDate } from "../../utils/formatDate.js";

function Users() {
    const { user: authenticatedUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [updatingId, setUpdatingId] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await userService.list();

            setUsers(response.users ?? []);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível carregar os usuários."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    async function handleRoleChange(
        selectedUser,
        newRole
    ) {
        if (selectedUser.role === newRole) {
            return;
        }

        setUpdatingId(selectedUser.id);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await userService.update(
                selectedUser.id,
                {
                    role: newRole,
                }
            );

            setSuccessMessage(
                "Função do usuário atualizada com sucesso."
            );

            await loadUsers();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível alterar a função do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleActiveChange(selectedUser) {
        setUpdatingId(selectedUser.id);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await userService.update(
                selectedUser.id,
                {
                    isActive: !selectedUser.isActive,
                }
            );

            setSuccessMessage(
                selectedUser.isActive
                    ? "Usuário desativado com sucesso."
                    : "Usuário ativado com sucesso."
            );

            await loadUsers();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível alterar o estado do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleDelete(selectedUser) {
        const confirmed = window.confirm(
            `Deseja excluir o usuário "${selectedUser.name}"? Todas as transações dele também serão excluídas.`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(selectedUser.id);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await userService.remove(selectedUser.id);

            setSuccessMessage(
                "Usuário excluído com sucesso."
            );

            await loadUsers();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ??
                "Não foi possível excluir o usuário."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Usuários
                    </h1>

                    <p className="text-sm text-slate-500">
                        Gerencie os usuários cadastrados.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadUsers}
                    className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm"
                >
                    <FiRefreshCw />

                    Atualizar
                </button>
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

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 border-b border-slate-200 p-4">
                    <FiUsers />

                    <h2 className="font-semibold">
                        Usuários cadastrados
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                        Carregando usuários...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                        Nenhum usuário encontrado.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">
                                        Usuário
                                    </th>

                                    <th className="px-4 py-3">
                                        Função
                                    </th>

                                    <th className="px-4 py-3">
                                        Estado
                                    </th>

                                    <th className="px-4 py-3">
                                        Cadastro
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((selectedUser) => {
                                    const isCurrentUser =
                                        selectedUser.id ===
                                        authenticatedUser?.id;

                                    const isUpdating =
                                        updatingId === selectedUser.id;

                                    const isDeleting =
                                        deletingId === selectedUser.id;

                                    return (
                                        <tr
                                            key={selectedUser.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
                                                        <FiUser />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {selectedUser.name}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {selectedUser.email}
                                                        </p>

                                                        {isCurrentUser && (
                                                            <p className="text-xs font-medium text-blue-600">
                                                                Sua conta
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {selectedUser.role ===
                                                        "ADMIN" ? (
                                                        <FiShield />
                                                    ) : (
                                                        <FiUser />
                                                    )}

                                                    <select
                                                        value={selectedUser.role}
                                                        disabled={
                                                            isUpdating ||
                                                            isCurrentUser
                                                        }
                                                        onChange={(event) =>
                                                            handleRoleChange(
                                                                selectedUser,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-300 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        <option value="USER">
                                                            Usuário
                                                        </option>

                                                        <option value="ADMIN">
                                                            Administrador
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        selectedUser.isActive
                                                            ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                                                            : "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                                                    }
                                                >
                                                    {selectedUser.isActive
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-slate-600">
                                                {formatDate(
                                                    selectedUser.createdAt
                                                )}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isUpdating ||
                                                            isCurrentUser
                                                        }
                                                        onClick={() =>
                                                            handleActiveChange(
                                                                selectedUser
                                                            )
                                                        }
                                                        title={
                                                            selectedUser.isActive
                                                                ? "Desativar usuário"
                                                                : "Ativar usuário"
                                                        }
                                                        className="rounded-md border border-slate-300 p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {selectedUser.isActive ? (
                                                            <FiToggleRight
                                                                size={20}
                                                            />
                                                        ) : (
                                                            <FiToggleLeft
                                                                size={20}
                                                            />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isDeleting ||
                                                            isCurrentUser
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                selectedUser
                                                            )
                                                        }
                                                        title="Excluir usuário"
                                                        className="rounded-md border border-red-300 p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Users;