import {
    RiDeleteBin6Line,
    RiEditLine,
    RiEyeLine,
} from "react-icons/ri";

import DataTableActions from "../data-display/DataTableActions.jsx";

function TransactionActions({
    transaction,
    onView,
    onEdit,
    onDelete,
    canEdit = true,
    canDelete = true,
    deleting = false,
    disabled = false,
    additionalActions = [],
    label = "Abrir ações da movimentação",
    className = "",
}) {
    const actions = [
        onView
            ? {
                id: "view",
                label: "Ver detalhes",
                icon: <RiEyeLine size={16} aria-hidden="true" />,
                onSelect: () => onView(transaction),
                disabled,
            }
            : null,
        onEdit
            ? {
                id: "edit",
                label: "Editar",
                icon: <RiEditLine size={16} aria-hidden="true" />,
                onSelect: () => onEdit(transaction),
                disabled: disabled || !canEdit,
            }
            : null,
        ...additionalActions,
        onDelete
            ? {
                id: "delete",
                label: deleting ? "Excluindo..." : "Excluir",
                icon: <RiDeleteBin6Line size={16} aria-hidden="true" />,
                onSelect: () => onDelete(transaction),
                disabled: disabled || deleting || !canDelete,
                danger: true,
                separatorBefore: Boolean(onView || onEdit || additionalActions.length),
            }
            : null,
    ];

    return (
        <DataTableActions
            actions={actions}
            label={label}
            className={className}
        />
    );
}

export default TransactionActions;
