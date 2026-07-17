import {
    RiCalendarEventLine,
    RiInformationLine,
    RiRepeat2Line,
} from "react-icons/ri";

import DateField from "../date-picker/DateField.jsx";
import FormField from "../forms/FormField.jsx";
import Select from "../forms/Select.jsx";
import Switch from "../forms/Switch.jsx";
import Alert from "../feedback/Alert.jsx";
import Surface from "../surfaces/Surface.jsx";

const intervalOptions = [
    { value: "1", label: "Todo mês" },
    { value: "2", label: "A cada 2 meses" },
    { value: "3", label: "A cada 3 meses" },
    { value: "6", label: "A cada 6 meses" },
    { value: "12", label: "Todo ano" },
];

const dayOptions = Array.from({ length: 31 }, (_, index) => ({
    value: String(index + 1),
    label: `Dia ${index + 1}`,
}));

function normalizeRecurrence(value = {}) {
    const today = new Date().toISOString().slice(0, 10);

    return {
        startDate: value.startDate || today,
        endDate: value.endDate || "",
        dayOfMonth: Number(value.dayOfMonth) || Number(today.slice(8, 10)),
        intervalMonths: Number(value.intervalMonths) || 1,
    };
}

function formatLongDate(value) {
    if (!value) {
        return "a data escolhida";
    }

    const [year, month, day] = value.split("-").map(Number);

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

function frequencyText(intervalMonths) {
    if (Number(intervalMonths) === 1) {
        return "todos os meses";
    }

    if (Number(intervalMonths) === 12) {
        return "todos os anos";
    }

    return `a cada ${intervalMonths} meses`;
}

function TransactionRecurrenceFields({
    value,
    onChange,
    errors = {},
    disabled = false,
    className = "",
}) {
    const recurrence = normalizeRecurrence(value);
    const hasEndDate = Boolean(recurrence.endDate);

    function updateField(field, nextValue) {
        const nextRecurrence = {
            ...recurrence,
            [field]: nextValue,
        };

        if (
            field === "startDate" &&
            nextRecurrence.endDate &&
            nextValue > nextRecurrence.endDate
        ) {
            nextRecurrence.endDate = nextValue;
        }

        onChange?.(nextRecurrence);
    }

    return (
        <section className={`grid gap-4 ${className}`}>
            <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                    <RiRepeat2Line size={20} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                    <h3 className="text-card-title font-bold text-foreground">
                        Configuração da recorrência
                    </h3>
                    <p className="mt-1 text-caption text-muted-foreground">
                        A regra cria uma movimentação somente quando a data de ocorrência chegar.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Início da recorrência"
                    required
                    errorMessage={errors.startDate}
                >
                    <DateField
                        value={recurrence.startDate}
                        disabled={disabled}
                        clearable={false}
                        onChange={(nextValue) => updateField("startDate", nextValue)}
                    />
                </FormField>

                <FormField
                    label="Dia da ocorrência"
                    required
                    errorMessage={errors.dayOfMonth}
                >
                    <Select
                        value={String(recurrence.dayOfMonth)}
                        options={dayOptions}
                        leadingIcon={<RiCalendarEventLine size={18} aria-hidden="true" />}
                        disabled={disabled}
                        onChange={(event) => updateField("dayOfMonth", Number(event.target.value))}
                    />
                </FormField>

                <FormField
                    label="Frequência"
                    required
                    errorMessage={errors.intervalMonths}
                    className="sm:col-span-2"
                >
                    <Select
                        value={String(recurrence.intervalMonths)}
                        options={intervalOptions}
                        disabled={disabled}
                        onChange={(event) => updateField("intervalMonths", Number(event.target.value))}
                    />
                </FormField>
            </div>

            <Surface variant="subtle" padding="md" className="grid gap-4">
                <Switch
                    checked={hasEndDate}
                    disabled={disabled}
                    label="Definir uma data final"
                    description="Quando desativado, a recorrência continua até ser pausada ou excluída."
                    onCheckedChange={(checked) => updateField(
                        "endDate",
                        checked ? recurrence.startDate : ""
                    )}
                />

                {hasEndDate ? (
                    <FormField
                        label="Fim da recorrência"
                        required
                        errorMessage={errors.endDate}
                    >
                        <DateField
                            value={recurrence.endDate}
                            min={recurrence.startDate}
                            disabled={disabled}
                            clearable={false}
                            onChange={(nextValue) => updateField("endDate", nextValue)}
                        />
                    </FormField>
                ) : null}
            </Surface>

            <Alert
                variant="info"
                title="Resumo da regra"
                icon={RiInformationLine}
            >
                O lançamento será criado no dia {recurrence.dayOfMonth}, {frequencyText(recurrence.intervalMonths)}, a partir de {formatLongDate(recurrence.startDate)}{recurrence.endDate ? ` e até ${formatLongDate(recurrence.endDate)}` : ", sem data final"}.
            </Alert>

            {recurrence.dayOfMonth > 28 ? (
                <p className="text-caption text-muted-foreground">
                    Nos meses sem o dia {recurrence.dayOfMonth}, o lançamento deve usar o último dia disponível.
                </p>
            ) : null}
        </section>
    );
}

export default TransactionRecurrenceFields;
