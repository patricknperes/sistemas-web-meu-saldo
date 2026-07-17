import {
    RiCloseLine,
    RiFilter3Line,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import DateField from "../date-picker/DateField.jsx";
import CurrencyInput from "../forms/CurrencyInput.jsx";
import FormField from "../forms/FormField.jsx";
import Select from "../forms/Select.jsx";
import SegmentedControl from "../forms/SegmentedControl.jsx";
import TagSelector from "../tags/TagSelector.jsx";
import Surface from "../surfaces/Surface.jsx";

const typeOptions = [
    { value: "all", label: "Todas" },
    { value: "income", label: "Receitas" },
    { value: "expense", label: "Despesas" },
];

const originOptions = [
    { value: "all", label: "Qualquer origem" },
    { value: "manual", label: "Lançamento manual" },
    { value: "recurring", label: "Gerada por recorrência" },
];

const statusOptions = [
    { value: "all", label: "Todos os estados" },
    { value: "active", label: "Ativa" },
    { value: "paused", label: "Pausada" },
    { value: "scheduled", label: "Agendada" },
    { value: "ended", label: "Encerrada" },
];

import {
    countTransactionFilters,
    emptyTransactionFilters,
} from "./transactionOperationUtils.js";

function TransactionFilters({
    value = emptyTransactionFilters,
    onChange,
    onApply,
    onClear,
    tagOptions = [],
    selectedTagOptions = [],
    mode = "transactions",
    disabled = false,
    showActions = true,
    className = "",
}) {
    const filters = {
        ...emptyTransactionFilters,
        ...value,
        tagIds: Array.isArray(value?.tagIds) ? value.tagIds : [],
    };

    function updateField(field, nextValue) {
        onChange?.({
            ...filters,
            [field]: nextValue,
        });
    }

    function clearFilters() {
        onChange?.({ ...emptyTransactionFilters });
        onClear?.();
    }

    const invalidDateRange = Boolean(
        filters.startDate &&
        filters.endDate &&
        filters.startDate > filters.endDate
    );

    const invalidAmountRange = Boolean(
        Number.isFinite(Number(filters.minAmount)) &&
        Number.isFinite(Number(filters.maxAmount)) &&
        Number(filters.minAmount) > Number(filters.maxAmount)
    );

    return (
        <div className={`grid gap-5 ${className}`}>
            <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                    <RiFilter3Line size={20} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                    <h3 className="text-card-title font-bold text-foreground">
                        Filtros avançados
                    </h3>
                    <p className="mt-1 text-caption text-muted-foreground">
                        Combine critérios para encontrar lançamentos específicos sem alterar o período principal.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Tipo de movimentação" className="md:col-span-2">
                    <SegmentedControl
                        value={filters.type}
                        options={typeOptions}
                        fullWidth
                        disabled={disabled}
                        onValueChange={(nextValue) => updateField("type", nextValue)}
                    />
                </FormField>

                <FormField label="Origem">
                    <Select
                        value={filters.origin}
                        options={originOptions}
                        disabled={disabled}
                        onChange={(event) => updateField("origin", event.target.value)}
                    />
                </FormField>

                {mode === "recurring" ? (
                    <FormField label="Status da recorrência">
                        <Select
                            value={filters.status}
                            options={statusOptions}
                            disabled={disabled}
                            onChange={(event) => updateField("status", event.target.value)}
                        />
                    </FormField>
                ) : (
                    <div className="hidden md:block" aria-hidden="true" />
                )}

                <FormField
                    label="Data inicial"
                    errorMessage={invalidDateRange ? "A data inicial deve ser anterior à data final." : undefined}
                >
                    <DateField
                        value={filters.startDate}
                        max={filters.endDate || undefined}
                        disabled={disabled}
                        onChange={(nextValue) => updateField("startDate", nextValue)}
                    />
                </FormField>

                <FormField label="Data final">
                    <DateField
                        value={filters.endDate}
                        min={filters.startDate || undefined}
                        disabled={disabled}
                        onChange={(nextValue) => updateField("endDate", nextValue)}
                    />
                </FormField>

                <FormField
                    label="Valor mínimo"
                    errorMessage={invalidAmountRange ? "O valor mínimo não pode ser maior que o máximo." : undefined}
                >
                    <CurrencyInput
                        value={filters.minAmount}
                        disabled={disabled}
                        placeholder="0,00"
                        onValueChange={(nextValue) => updateField("minAmount", nextValue)}
                    />
                </FormField>

                <FormField label="Valor máximo">
                    <CurrencyInput
                        value={filters.maxAmount}
                        disabled={disabled}
                        placeholder="0,00"
                        onValueChange={(nextValue) => updateField("maxAmount", nextValue)}
                    />
                </FormField>

                <FormField
                    label="Tags"
                    optional
                    helperText="É possível combinar até dez tags."
                    className="md:col-span-2"
                >
                    <TagSelector
                        value={filters.tagIds}
                        options={tagOptions}
                        selectedOptions={selectedTagOptions}
                        disabled={disabled}
                        onValueChange={(nextValue) => updateField("tagIds", nextValue)}
                    />
                </FormField>
            </div>

            {showActions ? (
                <Surface variant="subtle" padding="sm" className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="ghost"
                        leadingIcon={<RiCloseLine size={17} aria-hidden="true" />}
                        disabled={disabled || countTransactionFilters(filters) === 0}
                        onClick={clearFilters}
                    >
                        Limpar filtros
                    </Button>

                    <Button
                        disabled={disabled || invalidDateRange || invalidAmountRange}
                        onClick={() => onApply?.(filters)}
                    >
                        Aplicar filtros
                    </Button>
                </Surface>
            ) : null}
        </div>
    );
}

export default TransactionFilters;
