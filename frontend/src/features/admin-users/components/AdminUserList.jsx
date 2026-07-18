import { useMemo } from "react";

import { Pencil, ShieldCheck, Trash2 } from "lucide-react";

import DataTable from "../../../components/data-display/DataTable.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import Switch from "../../../components/ui/Switch.jsx";
import UserAvatar from "../../../components/ui/UserAvatar.jsx";
import { getAdminUserDate, getAdminUserRoleLabel, isSameUser } from "../utils/adminUserFormatters.js";
import AdminUsersPagination from "./AdminUsersPagination.jsx";

function UserIdentity({ user }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={user.name} src={user.avatarUrl} size="md" showTitle={false} />
            <div className="min-w-0">
                <p className="max-w-56 truncate font-semibold text-foreground" title={user.name}>{user.name}</p>
                <p className="mt-0.5 max-w-56 truncate text-xs text-subtle-foreground" title={user.email}>{user.email}</p>
            </div>
        </div>
    );
}

function UserActions({ user, ownAccount, disabled, onEdit, onDelete }) {
    return (
        <div className="flex justify-end gap-1">
            <IconButton variant="ghost" size="sm" onClick={() => onEdit(user)} disabled={disabled} aria-label={`Editar ${user.name}`} title="Editar usuário">
                <Pencil className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton variant="ghost" size="sm" className="text-danger hover:bg-danger-muted hover:text-danger" onClick={() => onDelete(user)} disabled={disabled || ownAccount} aria-label={`Excluir ${user.name}`} title={ownAccount ? "Você não pode excluir sua própria conta" : "Excluir usuário"}>
                <Trash2 className="size-4" aria-hidden="true" />
            </IconButton>
        </div>
    );
}

function AdminUserList({ users, pagination, authenticatedUserId, loading, mutatingUserId, onEdit, onToggleStatus, onDelete, onPageChange, onPageSizeChange }) {
    const columns = useMemo(() => [
        { id: "user", header: "Usuário", cell: ({ row }) => <UserIdentity user={row.original} /> },
        {
            accessorKey: "role",
            header: "Acesso",
            cell: ({ row }) => (
                <Badge variant={row.original.role === "ADMIN" ? "secondary" : "primary"}>
                    {row.original.role === "ADMIN" && <ShieldCheck className="size-3.5" aria-hidden="true" />}
                    {getAdminUserRoleLabel(row.original.role)}
                </Badge>
            ),
        },
        {
            id: "activity",
            header: "Atividade",
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    <strong className="text-sm text-foreground">{Number(row.original.activity?.transactions) || 0}</strong> lançamentos
                    <span className="mx-1.5 text-border-strong">·</span>
                    {Number(row.original.activity?.recurringTransactions) || 0} recorrências
                </div>
            ),
        },
        { accessorKey: "createdAt", header: "Cadastro", cell: ({ row }) => <span className="whitespace-nowrap text-sm text-muted-foreground">{getAdminUserDate(row.original.createdAt)}</span> },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
                const ownAccount = isSameUser(row.original.id, authenticatedUserId);
                const disabled = ownAccount || String(mutatingUserId) === String(row.original.id);
                return (
                    <div className="flex items-center gap-2">
                        <Switch checked={row.original.isActive} onCheckedChange={(checked) => onToggleStatus(row.original, checked)} disabled={disabled} aria-label={`${row.original.isActive ? "Desativar" : "Ativar"} ${row.original.name}`} />
                        <span className={`text-xs font-semibold ${row.original.isActive ? "text-success" : "text-danger"}`}>{row.original.isActive ? "Ativo" : "Inativo"}</span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: <span className="sr-only">Ações</span>,
            cell: ({ row }) => (
                <UserActions
                    user={row.original}
                    ownAccount={isSameUser(row.original.id, authenticatedUserId)}
                    disabled={String(mutatingUserId) === String(row.original.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ], [authenticatedUserId, mutatingUserId, onDelete, onEdit, onToggleStatus]);

    if (loading && !users.length) {
        return (
            <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card" aria-label="Carregando usuários" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-18 animate-pulse border-b border-border bg-surface last:border-0" />)}
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-border bg-surface px-6 text-center shadow-card">
                <div className="flex size-12 items-center justify-center rounded-card-sm bg-surface-muted text-subtle-foreground">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-base font-bold text-foreground">Nenhum usuário encontrado</h2>
                <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">Ajuste a pesquisa ou os filtros para localizar outras contas.</p>
            </div>
        );
    }

    return (
        <section className="overflow-hidden rounded-card border border-border bg-surface shadow-card" aria-label="Lista de usuários">
            <div className="hidden lg:block">
                <DataTable columns={columns} data={users} className="rounded-none border-0 shadow-none" />
            </div>

            <div className="divide-y divide-border lg:hidden">
                {users.map((user) => {
                    const ownAccount = isSameUser(user.id, authenticatedUserId);
                    const disabled = String(mutatingUserId) === String(user.id);
                    return (
                        <article key={user.id} className="p-4 sm:p-5">
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <UserIdentity user={user} />
                                <UserActions user={user} ownAccount={ownAccount} disabled={disabled} onEdit={onEdit} onDelete={onDelete} />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant={user.role === "ADMIN" ? "secondary" : "primary"}>{getAdminUserRoleLabel(user.role)}</Badge>
                                <Badge variant={user.isActive ? "success" : "danger"}>{user.isActive ? "Ativo" : "Inativo"}</Badge>
                                {ownAccount && <Badge variant="warning">Sua conta</Badge>}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                <div><span className="block font-semibold uppercase tracking-[0.07em] text-subtle-foreground">Cadastro</span><span className="mt-1 block text-sm text-foreground">{getAdminUserDate(user.createdAt)}</span></div>
                                <div><span className="block font-semibold uppercase tracking-[0.07em] text-subtle-foreground">Atividade</span><span className="mt-1 block text-sm text-foreground">{Number(user.activity?.transactions) || 0} lançamentos</span></div>
                            </div>
                            <div className="mt-4 flex items-center justify-between rounded-control bg-surface-muted px-3 py-2.5">
                                <div><p className="text-sm font-semibold text-foreground">Acesso ao sistema</p><p className="text-xs text-subtle-foreground">{user.isActive ? "Conta liberada" : "Conta bloqueada"}</p></div>
                                <Switch checked={user.isActive} onCheckedChange={(checked) => onToggleStatus(user, checked)} disabled={disabled || ownAccount} aria-label={`${user.isActive ? "Desativar" : "Ativar"} ${user.name}`} />
                            </div>
                        </article>
                    );
                })}
            </div>

            <AdminUsersPagination pagination={pagination} disabled={loading} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
        </section>
    );
}

export default AdminUserList;
