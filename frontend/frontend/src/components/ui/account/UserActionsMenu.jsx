import {
    RiDeleteBin6Line,
    RiEditLine,
    RiKey2Line,
    RiMore2Line,
    RiRefreshLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../feedback/DropdownMenu.jsx";

function UserActionsMenu({
    onEdit,
    onResetPassword,
    onToggleStatus,
    onDelete,
    active = true,
    disabled = false,
    ownAccount = false,
    className = "",
}) {
    const hasPrimaryActions = Boolean(
        onEdit || onResetPassword || onToggleStatus
    );
    const hasDeleteAction = Boolean(onDelete);

    return (
        <DropdownMenu
            trigger={(
                <IconButton
                    variant="ghost"
                    size="sm"
                    label="Abrir ações do usuário"
                    disabled={disabled}
                    loading={disabled}
                    icon={<RiMore2Line size={19} aria-hidden="true" />}
                />
            )}
            className={className}
        >
            <DropdownMenuLabel>Ações da conta</DropdownMenuLabel>

            {onEdit ? (
                <DropdownMenuItem icon={RiEditLine} onSelect={onEdit}>
                    Editar dados
                </DropdownMenuItem>
            ) : null}

            {onResetPassword ? (
                <DropdownMenuItem icon={RiKey2Line} onSelect={onResetPassword}>
                    Redefinir senha
                </DropdownMenuItem>
            ) : null}

            {onToggleStatus ? (
                <DropdownMenuItem
                    icon={RiRefreshLine}
                    onSelect={onToggleStatus}
                    disabled={ownAccount}
                >
                    {active ? "Desativar acesso" : "Ativar acesso"}
                </DropdownMenuItem>
            ) : null}

            {hasPrimaryActions && hasDeleteAction ? (
                <DropdownMenuSeparator />
            ) : null}

            {onDelete ? (
                <DropdownMenuItem
                    icon={RiDeleteBin6Line}
                    onSelect={onDelete}
                    disabled={ownAccount}
                    danger
                >
                    Excluir usuário
                </DropdownMenuItem>
            ) : null}
        </DropdownMenu>
    );
}

export default UserActionsMenu;
