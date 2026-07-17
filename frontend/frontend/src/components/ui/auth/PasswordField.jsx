import FormField from "../forms/FormField.jsx";
import PasswordInput from "../forms/PasswordInput.jsx";
import PasswordRequirements from "./PasswordRequirements.jsx";
import PasswordStrength from "./PasswordStrength.jsx";

function PasswordField({
    value = "",
    label = "Senha",
    helperText,
    errorMessage,
    successMessage,
    required = false,
    optional = false,
    showStrength = false,
    showRequirements = false,
    requirements,
    requirementColumns = 2,
    fieldClassName = "",
    ...inputProps
}) {
    return (
        <FormField
            label={label}
            helperText={helperText}
            errorMessage={errorMessage}
            successMessage={successMessage}
            required={required}
            optional={optional}
            className={fieldClassName}
        >
            <PasswordInput
                value={value}
                {...inputProps}
            />

            {showStrength ? (
                <PasswordStrength
                    password={value}
                    requirements={requirements}
                    className="mt-3"
                />
            ) : null}

            {showRequirements ? (
                <PasswordRequirements
                    password={value}
                    requirements={requirements}
                    columns={requirementColumns}
                    className="mt-3"
                />
            ) : null}
        </FormField>
    );
}

export default PasswordField;
