import {
    RiCalendarLine,
    RiShieldUserLine,
    RiUserLine,
} from "react-icons/ri";

import {
    UserActionsMenu,
    UserIdentity,
    UserRoleBadge,
    UserStatusBadge,
} from "../../../components/ui/account/index.js";
import {
    DataCard,
    DataCardBody,
    DataCardField,
    DataCardFooter,
    DataList,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    Pagination,
    ResponsiveDataView,
} from "../../../components/ui/data-display/index.js";
import { formatDate } from "../../../utils/formatDate.js";

import {
    getUserStatus,
    isSameUser,
} from "./usersUtils.js";

function AccountMarker() {
    return (
        <span className="inline-flex h-5 items-center rounded-pill border border-info/15 bg-info-muted px-2 text-[10px] font-bold text-info">
            Você
        </span>
    );
}

function UserRowActions({
    user,
    authenticatedUserId,
    busy,
    onEdit,
    onToggleStatus,
    onDelete,
}) {
    const ownAccount = isSameUser(user.id, authenticatedUserId);

    return (
        <UserActionsMenu
            active={Boolean(user.isActive)}
            ownAccount={ownAccount}
            disabled={busy}
            onEdit={() => onEdit?.(user)}
            onToggleStatus={() => onToggleStatus?.(user)}
            onDelete={() => onDelete?.(user)}
        />
    );
}

function UsersDesktopTable({
    users,
    authenticatedUserId,
    updatingId,
    deletingId,
    onEdit,
    onToggleStatus,
    onDelete,
    pagination,
}) {
    return (
        <DataTable
            density="default"
            stickyHeader
            tableClassName="min-w-[58rem]"
            footer={pagination ? <Pagination {...pagination} /> : null}
        >
            <DataTableHeader>
                <DataTableRow hoverable={false}>
                    <DataTableHead className="w-[34%]">
                        Usuário
                    </DataTableHead>
                    <DataTableHead className="w-[18%]">
                        Função
                    </DataTableHead>
                    <DataTableHead className="w-[18%]">
                        Acesso
                    </DataTableHead>
                    <DataTableHead className="w-[20%]">
                        Cadastro
                    </DataTableHead>
                    <DataTableHead align="right" className="w-[10%]">
                        Ações
                    </DataTableHead>
                </DataTableRow>
            </DataTableHeader>

            <DataTableBody>
                {users.map((user) => {
                    const ownAccount = isSameUser(
                        user.id,
                        authenticatedUserId
                    );
                    const busy =
                        isSameUser(user.id, updatingId) ||
                        isSameUser(user.id, deletingId);

                    return (
                        <DataTableRow
                            key={user.id}
                            className={user.isActive ? "" : "opacity-75"}
                        >
                            <DataTableCell>
                                <UserIdentity
                                    name={user.name}
                                    email={user.email}
                                    avatarUrl={user.avatarUrl}
                                    role={user.role}
                                    status={getUserStatus(user)}
                                    showRole={false}
                                    showStatus={false}
                                    actions={ownAccount ? <AccountMarker /> : null}
                                />
                            </DataTableCell>

                            <DataTableCell>
                                <UserRoleBadge role={user.role} />
                            </DataTableCell>

                            <DataTableCell>
                                <UserStatusBadge status={getUserStatus(user)} />
                            </DataTableCell>

                            <DataTableCell muted>
                                <span className="whitespace-nowrap">
                                    {formatDate(user.createdAt)}
                                </span>
                            </DataTableCell>

                            <DataTableCell align="right">
                                <div className="flex justify-end">
                                    <UserRowActions
                                        user={user}
                                        authenticatedUserId={authenticatedUserId}
                                        busy={busy}
                                        onEdit={onEdit}
                                        onToggleStatus={onToggleStatus}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    );
                })}
            </DataTableBody>
        </DataTable>
    );
}

function UsersMobileList({
    users,
    authenticatedUserId,
    updatingId,
    deletingId,
    onEdit,
    onToggleStatus,
    onDelete,
    pagination,
}) {
    return (
        <div className="grid gap-4">
            <DataList>
                {users.map((user) => {
                    const ownAccount = isSameUser(
                        user.id,
                        authenticatedUserId
                    );
                    const busy =
                        isSameUser(user.id, updatingId) ||
                        isSameUser(user.id, deletingId);

                    return (
                        <DataCard
                            key={user.id}
                            className={user.isActive ? "" : "bg-surface-subtle"}
                        >
                            <UserIdentity
                                name={user.name}
                                email={user.email}
                                avatarUrl={user.avatarUrl}
                                role={user.role}
                                status={getUserStatus(user)}
                                showRole={false}
                                showStatus={false}
                                actions={(
                                    <UserRowActions
                                        user={user}
                                        authenticatedUserId={authenticatedUserId}
                                        busy={busy}
                                        onEdit={onEdit}
                                        onToggleStatus={onToggleStatus}
                                        onDelete={onDelete}
                                    />
                                )}
                            />

                            <DataCardBody>
                                <DataCardField
                                    label="Função"
                                    icon={RiShieldUserLine}
                                    value={<UserRoleBadge role={user.role} size="sm" />}
                                />

                                <DataCardField
                                    label="Acesso"
                                    icon={RiUserLine}
                                    value={(
                                        <UserStatusBadge
                                            status={getUserStatus(user)}
                                            size="sm"
                                        />
                                    )}
                                />

                                <DataCardField
                                    label="Cadastro"
                                    icon={RiCalendarLine}
                                    value={formatDate(user.createdAt)}
                                    fullWidth
                                />
                            </DataCardBody>

                            {ownAccount ? (
                                <DataCardFooter>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-caption text-muted-foreground">
                                            Esta é a conta usada na sessão atual.
                                        </p>
                                        <AccountMarker />
                                    </div>
                                </DataCardFooter>
                            ) : null}
                        </DataCard>
                    );
                })}
            </DataList>

            {pagination ? (
                <div className="rounded-xl border border-border bg-surface px-4 py-3">
                    <Pagination {...pagination} compact />
                </div>
            ) : null}
        </div>
    );
}

function UsersDataView(props) {
    return (
        <ResponsiveDataView
            breakpoint="lg"
            desktop={<UsersDesktopTable {...props} />}
            mobile={<UsersMobileList {...props} />}
        />
    );
}

export default UsersDataView;
