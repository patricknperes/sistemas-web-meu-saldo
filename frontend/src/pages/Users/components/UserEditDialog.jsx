import {
    RiSave3Line,
    RiUserSettingsLine,
} from "react-icons/ri";

import UserAdminForm from "../../../components/ui/account/UserAdminForm.jsx";
import Button from "../../../components/ui/actions/Button.jsx";
import Alert from "../../../components/ui/feedback/Alert.jsx";
import Modal from "../../../components/ui/feedback/Modal.jsx";

function UserEditDialog({
    open,
    user,
    value,
    ownAccount = false,
    submitting = false,
    error = "",
    onOpenChange,
    onChange,
    onSubmit,
}) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Editar usuário"
            description={
                user
                    ? `Atualize os dados e o acesso de ${user.name}.`
                    : "Atualize os dados da conta selecionada."
            }
            icon={RiUserSettingsLine}
            size="lg"
            footer={(
                <>
                    <Button
                        variant="ghost"
                        disabled={submitting}
                        onClick={() => onOpenChange?.(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        loading={submitting}
                        loadingText="Salvando..."
                        leadingIcon={(
                            <RiSave3Line
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                        onClick={() => onSubmit?.(value)}
                    >
                        Salvar alterações
                    </Button>
                </>
            )}
        >
            <div className="grid gap-5">
                {error ? (
                    <Alert variant="danger" title="Não foi possível salvar">
                        {error}
                    </Alert>
                ) : null}

                <UserAdminForm
                    value={value}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    submitting={submitting}
                    ownAccount={ownAccount}
                    showActions={false}
                />
            </div>
        </Modal>
    );
}

export default UserEditDialog;
