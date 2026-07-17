import {
    RiErrorWarningLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import Modal from "./Modal.jsx";

function ConfirmDialog({
    open,
    onOpenChange,
    title = "Confirmar ação",
    description,
    children,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmVariant = "danger",
    loading = false,
    onConfirm,
    icon = RiErrorWarningLine,
}) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            icon={icon}
            size="sm"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange?.(false)}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        variant={confirmVariant}
                        loading={loading}
                        loadingText="Processando..."
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            {children}
        </Modal>
    );
}

export default ConfirmDialog;
