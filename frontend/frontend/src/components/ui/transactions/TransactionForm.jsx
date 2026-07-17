import {
    RiArrowDownCircleLine,
    RiArrowUpCircleLine,
    RiFileTextLine,
    RiRepeat2Line,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import DateField from "../date-picker/DateField.jsx";
import CurrencyInput from "../forms/CurrencyInput.jsx";
import FormField from "../forms/FormField.jsx";
import Input from "../forms/Input.jsx";
import SegmentedControl from "../forms/SegmentedControl.jsx";
import TextArea from "../forms/TextArea.jsx";
import TagSelector from "../tags/TagSelector.jsx";
import Divider from "../surfaces/Divider.jsx";

import TransactionRecurrenceFields from "./TransactionRecurrenceFields.jsx";

const typeOptions = [
    {
        value: "income",
        label: "Receita",
        icon: RiArrowUpCircleLine,
    },
    {
        value: "expense",
        label: "Despesa",
        icon: RiArrowDownCircleLine,
    },
];

const kindOptions = [
    {
        value: "single",
        label: "Única",
        icon: RiFileTextLine,
    },
    {
        value: "recurring",
        label: "Recorrente",
        icon: RiRepeat2Line,
    },
];

function normalizeFormValue(value = {}) {
    const today = new Date().toISOString().slice(0, 10);

    return {
        kind: value.kind === "recurring" ? "recurring" : "single",
        type: value.type === "income" ? "income" : "expense",
        description: value.description || "",
        category: value.category || "",
        amount: value.amount ?? null,
        date: value.date || today,
        notes: value.notes || "",
        tagIds: Array.isArray(value.tagIds) ? value.tagIds : [],
        recurrence: {
            startDate: value.recurrence?.startDate || today,
            endDate: value.recurrence?.endDate || "",
            dayOfMonth: Number(value.recurrence?.dayOfMonth) || Number(today.slice(8, 10)),
            intervalMonths: Number(value.recurrence?.intervalMonths) || 1,
        },
    };
}

function TransactionForm({
    value,
    onChange,
    onSubmit,
    onCancel,
    errors = {},
    tagOptions = [],
    selectedTagOptions = [],
    onCreateTag,
    onTagCreated,
    disabled = false,
    submitting = false,
    showActions = true,
    showTypeSelector = true,
    showKindSelector = true,
    submitLabel = "Salvar movimentação",
    className = "",
}) {
    const form = normalizeFormValue(value);

    function updateField(field, nextValue) {
        onChange?.({
            ...form,
            [field]: nextValue,
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit?.(form, event);
    }

    const showConfigurationGrid = showTypeSelector || showKindSelector;

    return (
        <form onSubmit={handleSubmit} className={`grid gap-6 ${className}`}>
            {showConfigurationGrid ? (
                <div className={`grid gap-4 ${showTypeSelector && showKindSelector ? "md:grid-cols-2" : ""}`}>
                    {showTypeSelector ? (
                        <FormField label="Tipo" required>
                            <SegmentedControl
                                value={form.type}
                                options={typeOptions}
                                fullWidth
                                disabled={disabled || submitting}
                                onValueChange={(nextValue) => updateField("type", nextValue)}
                            />
                        </FormField>
                    ) : null}

                    {showKindSelector ? (
                        <FormField label="Frequência do lançamento" required>
                            <SegmentedControl
                                value={form.kind}
                                options={kindOptions}
                                fullWidth
                                disabled={disabled || submitting}
                                onValueChange={(nextValue) => updateField("kind", nextValue)}
                            />
                        </FormField>
                    ) : null}
                </div>
            ) : null}

            {showConfigurationGrid ? <Divider /> : null}

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Descrição"
                    required
                    errorMessage={errors.description}
                    className="sm:col-span-2"
                >
                    <Input
                        value={form.description}
                        maxLength={120}
                        placeholder="Ex.: Compra do supermercado"
                        disabled={disabled || submitting}
                        onChange={(event) => updateField("description", event.target.value)}
                    />
                </FormField>

                <FormField
                    label="Valor"
                    required
                    errorMessage={errors.amount}
                >
                    <CurrencyInput
                        value={form.amount}
                        placeholder="0,00"
                        disabled={disabled || submitting}
                        onValueChange={(nextValue) => updateField("amount", nextValue)}
                    />
                </FormField>

                {form.kind === "single" ? (
                    <FormField
                        label="Data"
                        required
                        errorMessage={errors.date}
                    >
                        <DateField
                            value={form.date}
                            clearable={false}
                            disabled={disabled || submitting}
                            onChange={(nextValue) => updateField("date", nextValue)}
                        />
                    </FormField>
                ) : (
                    <FormField
                        label="Categoria"
                        optional
                        errorMessage={errors.category}
                    >
                        <Input
                            value={form.category}
                            maxLength={80}
                            placeholder="Ex.: Moradia"
                            disabled={disabled || submitting}
                            onChange={(event) => updateField("category", event.target.value)}
                        />
                    </FormField>
                )}

                {form.kind === "single" ? (
                    <FormField
                        label="Categoria"
                        optional
                        errorMessage={errors.category}
                        className="sm:col-span-2"
                    >
                        <Input
                            value={form.category}
                            maxLength={80}
                            placeholder="Ex.: Alimentação, salário ou transporte"
                            disabled={disabled || submitting}
                            onChange={(event) => updateField("category", event.target.value)}
                        />
                    </FormField>
                ) : null}

                <FormField
                    label="Tags"
                    optional
                    helperText="Use tags para agrupar e encontrar movimentações mais tarde."
                    className="sm:col-span-2"
                >
                    <TagSelector
                        value={form.tagIds}
                        options={tagOptions}
                        selectedOptions={selectedTagOptions}
                        defaultCreateScope={form.type === "income" ? "INCOME" : "EXPENSE"}
                        allowCreate={Boolean(onCreateTag)}
                        onCreate={onCreateTag}
                        onTagCreated={onTagCreated}
                        disabled={disabled || submitting}
                        onValueChange={(nextValue) => updateField("tagIds", nextValue)}
                    />
                </FormField>

                <FormField
                    label="Observações"
                    optional
                    errorMessage={errors.notes}
                    className="sm:col-span-2"
                >
                    <TextArea
                        value={form.notes}
                        maxLength={500}
                        rows={4}
                        placeholder="Adicione informações úteis sobre esta movimentação."
                        disabled={disabled || submitting}
                        onChange={(event) => updateField("notes", event.target.value)}
                    />
                </FormField>
            </div>

            {form.kind === "recurring" ? (
                <>
                    <Divider />
                    <TransactionRecurrenceFields
                        value={form.recurrence}
                        errors={errors.recurrence}
                        disabled={disabled || submitting}
                        onChange={(nextValue) => updateField("recurrence", nextValue)}
                    />
                </>
            ) : null}

            {showActions ? (
                <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
                    {onCancel ? (
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={disabled || submitting}
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                    ) : null}

                    <Button
                        type="submit"
                        loading={submitting}
                        disabled={disabled}
                    >
                        {submitLabel}
                    </Button>
                </div>
            ) : null}
        </form>
    );
}

export default TransactionForm;
