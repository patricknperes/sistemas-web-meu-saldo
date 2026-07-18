import { useMemo } from "react";

import {
    MoreVertical,
    Pencil,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserX,
} from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import DataTable from "../../../components/data-display/DataTable.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import UserAvatar from "../../../components/ui/UserAvatar.jsx";
import { cn } from "../../../lib/cn.js";
import {
    getAdminUserDate,
    getAdminUserRoleLabel,
    isSameUser,
} from "../utils/adminUserFormatters.js";
import AdminUsersPagination from "./AdminUsersPagination.jsx";

function UserIdentity({ user, ownAccount = false }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
                name={user?.name}
                src={user?.avatarUrl}
                role={user?.role}
                size="md"
                showTitle={false}
            />

            <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                    <p
                        title={user?.name}
                        className="max-w-56 truncate font-semibold text-foreground"
                    >
                        {user?.name || "Usuário"}
                    </p>

                    {ownAccount && (
                        <span className="shrink-0 text-[10px] font-semibold text-warning">
                            Você
                        </span>
                    )}
                </div>

                <p
                    title={user?.email}
                    className="mt-0.5 max-w-56 truncate text-xs text-subtle-foreground"
                >
                    {user?.email || "E-mail não informado"}
                </p>
            </div>
        </div>
    );
}

function UserRoleBadge({ role }) {
    const isAdmin = role === "ADMIN";

    return (
        <Badge variant={isAdmin ? "secondary" : "primary"}>
            {isAdmin && (
                <ShieldCheck
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                />
            )}

            {getAdminUserRoleLabel(role)}
        </Badge>
    );
}

function UserActivity({ user }) {
    const transactions = Number(user?.activity?.transactions) || 0;
    const recurringTransactions = Number(user?.activity?.recurringTransactions) || 0;

    return (
        <div className="min-w-0 text-xs text-muted-foreground">
            <div className="flex items-baseline gap-1">
                <strong className="font-mono text-sm font-bold text-foreground">
                    {transactions}
                </strong>

                <span>
                    {transactions === 1 ? "lançamento" : "lançamentos"}
                </span>
            </div>

            <p className="mt-0.5 text-subtle-foreground">
                {recurringTransactions}{" "}
                {recurringTransactions === 1 ? "recorrência" : "recorrências"}
            </p>
        </div>
    );
}

function UserStatus({ isActive }) {
    return (
        <span
            className={cn(
                "text-xs font-semibold",
                isActive ? "text-success" : "text-subtle-foreground",
            )}
        >
            {isActive ? "Ativo" : "Inativo"}
        </span>
    );
}

function UserActionsMenu({
    user,
    ownAccount,
    disabled,
    onEdit,
    onToggleStatus,
    onDelete,
}) {
    const isActive = Boolean(user?.isActive);
    const statusDisabled = disabled || ownAccount;
    const deleteDisabled = disabled || ownAccount;

    const StatusIcon = isActive ? UserX : UserCheck;
    const statusLabel = isActive ? "Desativar usuário" : "Ativar usuário";

    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    aria-label={`Abrir ações de ${user?.name || "usuário"}`}
                    title="Ações"
                    className="
                        shrink-0
                        text-subtle-foreground
                        hover:bg-surface-muted
                        hover:text-foreground
                        data-[state=open]:bg-surface-muted
                        data-[state=open]:text-foreground
                    "
                >
                    <MoreVertical
                        className="size-4.5"
                        aria-hidden="true"
                    />
                </IconButton>
            </DropdownMenuPrimitive.Trigger>

            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align="end"
                    sideOffset={6}
                    collisionPadding={12}
                    className="
                        z-[120]
                        min-w-48
                        overflow-hidden
                        rounded-control
                        border border-border
                        bg-surface
                        p-1
                        text-foreground
                        shadow-popover
                        outline-none

                        data-[state=open]:animate-in
                        data-[state=open]:fade-in-0
                        data-[state=open]:zoom-in-95
                        data-[side=bottom]:slide-in-from-top-1
                        data-[side=top]:slide-in-from-bottom-1
                    "
                >
                    <DropdownMenuPrimitive.Item
                        disabled={disabled}
                        onSelect={() => onEdit?.(user)}
                        className="
                            flex cursor-pointer
                            select-none items-center
                            gap-2.5
                            rounded-md
                            px-3 py-2
                            text-sm font-medium
                            outline-none
                            transition-colors
                            focus:bg-surface-muted
                            data-[disabled]:pointer-events-none
                            data-[disabled]:opacity-50
                        "
                    >
                        <Pencil
                            className="size-4 shrink-0"
                            aria-hidden="true"
                        />

                        Editar usuário
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Item
                        disabled={statusDisabled}
                        onSelect={() => {
                            onToggleStatus?.(user, !isActive);
                        }}
                        className={cn(
                            `
                                flex cursor-pointer
                                select-none items-center
                                gap-2.5
                                rounded-md
                                px-3 py-2
                                text-sm font-medium
                                outline-none
                                transition-colors
                                data-[disabled]:pointer-events-none
                                data-[disabled]:opacity-50
                            `,
                            isActive
                                ? "text-warning focus:bg-warning-muted focus:text-warning"
                                : "text-success focus:bg-success-muted focus:text-success",
                        )}
                    >
                        <StatusIcon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                        />

                        {statusLabel}
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />

                    <DropdownMenuPrimitive.Item
                        disabled={deleteDisabled}
                        onSelect={() => onDelete?.(user)}
                        className="
                            flex cursor-pointer
                            select-none items-center
                            gap-2.5
                            rounded-md
                            px-3 py-2
                            text-sm font-medium
                            text-danger
                            outline-none
                            transition-colors
                            focus:bg-danger-muted
                            focus:text-danger
                            data-[disabled]:pointer-events-none
                            data-[disabled]:opacity-50
                        "
                    >
                        <Trash2
                            className="size-4 shrink-0"
                            aria-hidden="true"
                        />

                        Excluir usuário
                    </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}

function AdminUserList({
    users = [],
    pagination,
    authenticatedUserId,
    loading,
    mutatingUserId,
    onEdit,
    onToggleStatus,
    onDelete,
    onPageChange,
    onPageSizeChange,
}) {
    const items = Array.isArray(users) ? users : [];

    const columns = useMemo(() => [
        {
            id: "user",
            header: "Usuário",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <UserIdentity
                        user={user}
                        ownAccount={isSameUser(user.id, authenticatedUserId)}
                    />
                );
            },
        },
        {
            accessorKey: "role",
            header: "Acesso",
            cell: ({ row }) => (
                <UserRoleBadge role={row.original.role} />
            ),
        },
        {
            id: "activity",
            header: "Atividade",
            cell: ({ row }) => (
                <UserActivity user={row.original} />
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Cadastro",
            cell: ({ row }) => (
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                    {getAdminUserDate(row.original.createdAt)}
                </span>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <UserStatus isActive={row.original.isActive} />
            ),
        },
        {
            id: "actions",
            header: <span className="sr-only">Ações</span>,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex justify-end">
                        <UserActionsMenu
                            user={user}
                            ownAccount={isSameUser(user.id, authenticatedUserId)}
                            disabled={String(mutatingUserId) === String(user.id)}
                            onEdit={onEdit}
                            onToggleStatus={onToggleStatus}
                            onDelete={onDelete}
                        />
                    </div>
                );
            },
        },
    ], [
        authenticatedUserId,
        mutatingUserId,
        onDelete,
        onEdit,
        onToggleStatus,
    ]);

    if (loading && items.length === 0) {
        return (
            <div
                aria-label="Carregando usuários"
                aria-busy="true"
                className="
                    overflow-hidden
                    rounded-card
                    border border-border
                    bg-surface
                    shadow-card
                "
            >
                {Array.from({ length: 6 }, (_, index) => (
                    <div
                        key={index}
                        className="
                            h-[72px]
                            animate-pulse
                            border-b border-border
                            bg-surface
                            last:border-0
                        "
                    />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div
                className="
                    flex min-h-72
                    flex-col
                    items-center justify-center
                    rounded-card
                    border border-border
                    bg-surface
                    px-6 py-10
                    text-center
                    shadow-card
                "
            >
                <div className="flex size-12 items-center justify-center rounded-card-sm bg-surface-muted text-subtle-foreground">
                    <ShieldCheck
                        className="size-5"
                        aria-hidden="true"
                    />
                </div>

                <h2 className="mt-4 text-base font-bold text-foreground">
                    Nenhum usuário encontrado
                </h2>

                <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                    Ajuste a pesquisa ou os filtros para localizar outras contas.
                </p>
            </div>
        );
    }

    return (
        <section
            aria-label="Lista de usuários"
            className="
                min-w-0
                overflow-hidden
                rounded-card
                border border-border
                bg-surface
                shadow-card
            "
        >
            <div className="hidden min-w-0 lg:block">
                <DataTable
                    columns={columns}
                    data={items}
                    className="rounded-none border-0 shadow-none"
                />
            </div>

            <div className="divide-y divide-border lg:hidden">
                {items.map((user) => {
                    const ownAccount = isSameUser(
                        user.id,
                        authenticatedUserId,
                    );

                    const disabled = String(mutatingUserId)
                        === String(user.id);

                    return (
                        <article
                            key={user.id}
                            className="min-w-0 p-4 sm:p-5"
                        >
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <UserIdentity
                                    user={user}
                                    ownAccount={ownAccount}
                                />

                                <UserActionsMenu
                                    user={user}
                                    ownAccount={ownAccount}
                                    disabled={disabled}
                                    onEdit={onEdit}
                                    onToggleStatus={onToggleStatus}
                                    onDelete={onDelete}
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                                <UserRoleBadge role={user.role} />
                                <UserStatus isActive={user.isActive} />
                            </div>

                            <div
                                className="
                                    mt-4
                                    grid grid-cols-2
                                    gap-3
                                    border-t border-border
                                    pt-3.5
                                "
                            >
                                <div className="min-w-0">
                                    <span
                                        className="
                                            block
                                            text-[10px] font-bold
                                            uppercase
                                            tracking-[0.08em]
                                            text-subtle-foreground
                                        "
                                    >
                                        Cadastro
                                    </span>

                                    <span className="mt-1 block truncate text-sm font-medium text-foreground">
                                        {getAdminUserDate(user.createdAt)}
                                    </span>
                                </div>

                                <div className="min-w-0 border-l border-border pl-3">
                                    <span
                                        className="
                                            block
                                            text-[10px] font-bold
                                            uppercase
                                            tracking-[0.08em]
                                            text-subtle-foreground
                                        "
                                    >
                                        Atividade
                                    </span>

                                    <span className="mt-1 block truncate text-sm font-medium text-foreground">
                                        {Number(user.activity?.transactions) || 0} lançamentos
                                    </span>

                                    <span className="mt-0.5 block truncate text-xs text-subtle-foreground">
                                        {Number(user.activity?.recurringTransactions) || 0} recorrências
                                    </span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <AdminUsersPagination
                pagination={pagination}
                disabled={loading}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </section>
    );
}

export default AdminUserList;