import {
    RiMailLine,
    RiSave3Line,
    RiUserLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import FormField from "../forms/FormField.jsx";
import Input from "../forms/Input.jsx";

function ProfileForm({
    id,
    value = {},
    onChange,
    onSubmit,
    submitting = false,
    emailReadOnly = false,
    showActions = true,
    submitLabel = "Salvar alterações",
    submitDisabled = false,
    children,
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
            id={id}
            className={`grid gap-5 ${className}`}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.(value, event);
            }}
        >
            <FormField
                label="Nome completo"
                helperText="Este nome será exibido na barra superior e no perfil."
                required
            >
                <Input
                    name="name"
                    value={value.name ?? ""}
                    onChange={(event) => updateField("name", event.target.value)}
                    autoComplete="name"
                    placeholder="Nome completo"
                    leadingIcon={<RiUserLine size={18} aria-hidden="true" />}
                    disabled={submitting}
                />
            </FormField>

            <FormField
                label="E-mail"
                helperText={emailReadOnly
                    ? "O e-mail é usado para autenticação e não pode ser alterado neste fluxo."
                    : "Usado para acesso, recuperação da conta e comunicações importantes."
                }
                required
            >
                <Input
                    name="email"
                    type="email"
                    value={value.email ?? ""}
                    onChange={(event) => updateField("email", event.target.value)}
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                    readOnly={emailReadOnly}
                    disabled={submitting}
                />
            </FormField>

            {children}

            {showActions ? (
                <div className="flex justify-end border-t border-border pt-5">
                    <Button
                        type="submit"
                        loading={submitting}
                        disabled={submitDisabled}
                        leadingIcon={<RiSave3Line size={18} aria-hidden="true" />}
                    >
                        {submitLabel}
                    </Button>
                </div>
            ) : null}
        </form>
    );
}

export default ProfileForm;
