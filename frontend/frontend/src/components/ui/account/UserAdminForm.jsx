import {
    RiMailLine,
    RiSave3Line,
    RiUserLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import FormField from "../forms/FormField.jsx";
import Input from "../forms/Input.jsx";

import UserRoleSelect from "./UserRoleSelect.jsx";
import UserStatusControl from "./UserStatusControl.jsx";

function UserAdminForm({
    value = {},
    onChange,
    onSubmit,
    submitting = false,
    ownAccount = false,
    showActions = true,
    className = "",
}) {
    function updateField(field, fieldValue) {
        onChange?.({
            ...value,
            [field]: fieldValue,
        });
    }

    return (
        <form
            className={`grid gap-6 ${className}`}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.(value, event);
            }}
        >
            <div className="grid gap-5 lg:grid-cols-2">
                <FormField label="Nome completo" required>
                    <Input
                        value={value.name ?? ""}
                        onChange={(event) => updateField("name", event.target.value)}
                        leadingIcon={<RiUserLine size={18} aria-hidden="true" />}
                        placeholder="Nome do usuário"
                    />
                </FormField>

                <FormField label="E-mail" required>
                    <Input
                        type="email"
                        value={value.email ?? ""}
                        onChange={(event) => updateField("email", event.target.value)}
                        leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                        placeholder="usuario@exemplo.com"
                    />
                </FormField>
            </div>

            <div>
                <div className="mb-3">
                    <p className="text-body-sm font-bold text-foreground">
                        Tipo de conta
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                        A função define quais áreas e ações administrativas ficarão disponíveis.
                    </p>
                </div>

                <UserRoleSelect
                    value={value.role ?? "USER"}
                    onChange={(role) => updateField("role", role)}
                    disabled={ownAccount}
                />
            </div>

            <UserStatusControl
                status={value.status ?? "ACTIVE"}
                onChange={(status) => updateField("status", status)}
                ownAccount={ownAccount}
            />

            {showActions ? (
                <div className="flex justify-end border-t border-border pt-5">
                    <Button
                        type="submit"
                        loading={submitting}
                        leadingIcon={<RiSave3Line size={18} aria-hidden="true" />}
                    >
                        Atualizar usuário
                    </Button>
                </div>
            ) : null}
        </form>
    );
}

export default UserAdminForm;
