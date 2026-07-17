import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RiAddLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import FormField from "../forms/FormField.jsx";
import Input from "../forms/Input.jsx";
import {
    normalizeClassName,
} from "../forms/fieldStyles.js";

import TagBadge from "./TagBadge.jsx";
import TagColorPicker from "./TagColorPicker.jsx";
import TagScopeSelect from "./TagScopeSelect.jsx";
import {
    DEFAULT_TAG_COLOR,
    normalizeTagColor,
    normalizeTagScope,
    normalizeTagSearch,
} from "./tagUtils.js";

function getErrorMessage(error, fallbackMessage) {
    if (typeof error === "string" && error.trim()) {
        return error;
    }

    if (typeof error?.response?.data?.error === "string") {
        return error.response.data.error;
    }

    if (typeof error?.response?.data?.message === "string") {
        return error.response.data.message;
    }

    if (typeof error?.message === "string" && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
}

function getInitialFormData(initialValue, defaultScope) {
    return {
        name: String(initialValue?.name ?? ""),
        color: normalizeTagColor(initialValue?.color, DEFAULT_TAG_COLOR),
        scope: normalizeTagScope(initialValue?.scope ?? defaultScope),
    };
}

function TagCreateForm({
    initialValue,
    defaultScope = "BOTH",
    existingTags = [],
    onSubmit,
    onCancel,
    submitLabel = "Criar tag",
    cancelLabel = "Cancelar",
    showScope = true,
    showActions = true,
    resetOnSuccess = true,
    disabled = false,
    className = "",
}) {
    const [formData, setFormData] = useState(() =>
        getInitialFormData(initialValue, defaultScope)
    );
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setFormData(getInitialFormData(initialValue, defaultScope));
        setFormError("");
    }, [defaultScope, initialValue]);

    const duplicateNames = useMemo(() => new Set(
        existingTags.map((tag) => normalizeTagSearch(tag?.name ?? tag?.label))
    ), [existingTags]);

    function updateField(field, value) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
        setFormError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const normalizedName = formData.name.trim();

        if (normalizedName.length < 2) {
            setFormError("Informe um nome com pelo menos 2 caracteres.");
            return;
        }

        if (normalizedName.length > 30) {
            setFormError("O nome da tag deve ter no máximo 30 caracteres.");
            return;
        }

        if (duplicateNames.has(normalizeTagSearch(normalizedName))) {
            setFormError("Já existe uma tag com esse nome.");
            return;
        }

        const payload = {
            name: normalizedName,
            color: normalizeTagColor(formData.color),
            scope: normalizeTagScope(formData.scope),
        };

        setSubmitting(true);
        setFormError("");

        try {
            const result = await onSubmit?.(payload);

            if (resetOnSuccess) {
                setFormData(getInitialFormData(undefined, defaultScope));
            }

            return result;
        } catch (error) {
            setFormError(getErrorMessage(error, "Não foi possível criar a tag."));
            return undefined;
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            className={normalizeClassName(`grid gap-5 ${className}`)}
            onSubmit={handleSubmit}
        >
            <FormField
                label="Nome da tag"
                required
                errorMessage={formError}
                helperText={!formError ? "Use um nome curto e fácil de reconhecer." : undefined}
            >
                <Input
                    value={formData.name}
                    maxLength={30}
                    autoComplete="off"
                    placeholder="Ex.: Moradia"
                    disabled={disabled || submitting}
                    onChange={(event) => updateField("name", event.target.value)}
                />
            </FormField>

            <div>
                <p className="mb-2 text-body-sm font-semibold tracking-label text-foreground-soft">
                    Pré-visualização
                </p>

                <div className="flex min-h-11 items-center rounded-lg border border-border bg-surface-subtle px-3">
                    <TagBadge
                        label={formData.name.trim() || "Nome da tag"}
                        color={formData.color}
                        size="md"
                        maxWidth="100%"
                    />
                </div>
            </div>

            <TagColorPicker
                legend="Cor"
                value={formData.color}
                disabled={disabled || submitting}
                onChange={(nextColor) => updateField("color", nextColor)}
            />

            {showScope ? (
                <div>
                    <p className="mb-2 text-body-sm font-semibold tracking-label text-foreground-soft">
                        Disponível em
                    </p>

                    <TagScopeSelect
                        value={formData.scope}
                        disabled={disabled || submitting}
                        onChange={(nextScope) => updateField("scope", nextScope)}
                    />
                </div>
            ) : null}

            {showActions ? (
                <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                    {onCancel ? (
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={submitting}
                            onClick={onCancel}
                        >
                            {cancelLabel}
                        </Button>
                    ) : null}

                    <Button
                        type="submit"
                        loading={submitting}
                        loadingText="Criando..."
                        disabled={disabled}
                        leadingIcon={<RiAddLine size={18} aria-hidden="true" />}
                    >
                        {submitLabel}
                    </Button>
                </div>
            ) : null}
        </form>
    );
}

export default TagCreateForm;
