import {
    forwardRef,
} from "react";

import {
    RiInbox2Line,
} from "react-icons/ri";

import EmptyState from "../feedback/EmptyState.jsx";
import {
    LoadingState,
} from "../feedback/LoadingState.jsx";

const DataTableState = forwardRef(
    function DataTableState(
        {
            colSpan,
            loading = false,
            title = "Nenhum resultado encontrado",
            description = "Não há itens para exibir com os filtros atuais.",
            icon = RiInbox2Line,
            action,
            className = "",
            ...props
        },
        ref
    ) {
        return (
            <tr ref={ref} {...props}>
                <td colSpan={colSpan} className={`px-5 py-10 ${className}`}>
                    {loading ? (
                        <LoadingState
                            title="Carregando dados"
                            description="Aguarde enquanto atualizamos as informações."
                            compact
                        />
                    ) : (
                        <EmptyState
                            icon={icon}
                            title={title}
                            description={description}
                            action={action}
                            compact
                        />
                    )}
                </td>
            </tr>
        );
    }
);

export default DataTableState;
