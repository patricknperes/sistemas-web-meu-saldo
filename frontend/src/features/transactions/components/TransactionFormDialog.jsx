import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, LoaderCircle, Repeat2, WalletCards } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import CurrencyField from "../../../components/forms/CurrencyField.jsx";
import DatePicker from "../../../components/forms/DatePicker.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import { getTransactionTypeConfig } from "../../../config/transactionTypeConfig.js";
import { cn } from "../../../lib/cn.js";
import {
    recurringTransactionSchema,
    transactionSchema,
} from "../schemas/transactionSchemas.js";
import {
    dateInputToDate,
    getApiErrorMessage,
    toDateInputValue,
} from "../utils/transactionFormatters.js";
import TagMultiSelect from "./TagMultiSelect.jsx";

const today = () => toDateInputValue(new Date());

function getDefaults(entity, kind) {
    const common = {
        description: entity?.description ?? "",
        amountCents: Number(entity?.amountCents) || 0,
        category: entity?.category === "Outros" ? "" : entity?.category ?? "",
        notes: entity?.notes ?? "",
        tagIds: (entity?.tags ?? []).map((tag) => tag.id),
    };

    if (kind === "recurring") {
        return {
            ...common,
            startDate: toDateInputValue(entity?.startDate) || today(),
            endDate: toDateInputValue(entity?.endDate),
            dayOfMonth: Number(entity?.dayOfMonth) || new Date().getDate(),
            intervalMonths: Number(entity?.intervalMonths) || 1,
        };
    }

    return {
        ...common,
        date: toDateInputValue(entity?.date) || today(),
    };
}

function FieldLabel({ children }) {
    return <span className="mb-2 block text-sm font-semibold text-foreground">{children}</span>;
}

function TransactionFormDialog({
    open,
    onClose,
    type,
    kind = "single",
    onKindChange,
    entity,
    tags = [],
    onManageTags,
    onSave,
}) {
    const config = useMemo(() => getTransactionTypeConfig(type), [type]);
    const [requestError, setRequestError] = useState("");
    const editing = Boolean(entity?.id);
    const schema = kind === "recurring" ? recurringTransactionSchema : transactionSchema;

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaults(entity, kind),
    });

    useEffect(() => {
        if (!open) return;
        reset(getDefaults(entity, kind));
        setRequestError("");
    }, [entity, kind, open, reset]);

    async function submitForm(data) {
        setRequestError("");
        const payload = {
            ...data,
            type,
            category: data.category?.trim() || ((data.tagIds ?? []).length > 0 ? undefined : "Outros"),
            notes: data.notes?.trim() || null,
            tagIds: data.tagIds ?? [],
            ...(kind === "recurring" ? { endDate: data.endDate || null } : {}),
        };

        try {
            await onSave?.({ payload, kind, entity });
            onClose?.();
        } catch (error) {
            setRequestError(getApiErrorMessage(error));
        }
    }

    const title = editing
        ? kind === "recurring" ? `Editar ${config.singular} recorrente` : config.editModalTitle
        : kind === "recurring" ? config.recurringCreateLabel : config.createModalTitle;

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !isSubmitting && onClose?.()}>
            <DialogContent className="max-w-2xl p-0">
                <div className="border-b border-border px-5 py-5 sm:px-6">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {kind === "recurring"
                                ? "Defina o valor, a classificação e a agenda das próximas ocorrências."
                                : "Preencha os dados da movimentação. Os campos serão validados antes do envio."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(submitForm)} className="min-h-0">
                    <div className="max-h-[calc(100dvh-13rem)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                        {!editing && (
                            <div>
                                <FieldLabel>Tipo de lançamento</FieldLabel>
                                <div className="grid grid-cols-2 gap-1 rounded-control bg-surface-muted p-1">
                                    <button
                                        type="button"
                                        onClick={() => onKindChange?.("single")}
                                        aria-pressed={kind === "single"}
                                        className={cn("flex min-h-10 items-center justify-center gap-2 rounded-control-sm px-3 text-sm font-semibold text-muted-foreground transition", kind === "single" && "bg-surface text-foreground shadow-xs")}
                                    >
                                        <CalendarDays className="size-4" aria-hidden="true" />Única
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onKindChange?.("recurring")}
                                        aria-pressed={kind === "recurring"}
                                        className={cn("flex min-h-10 items-center justify-center gap-2 rounded-control-sm px-3 text-sm font-semibold text-muted-foreground transition", kind === "recurring" && "bg-surface text-foreground shadow-xs")}
                                    >
                                        <Repeat2 className="size-4" aria-hidden="true" />Recorrente
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                className="sm:col-span-2"
                                label="Descrição"
                                placeholder={config.descriptionPlaceholder}
                                maxLength={150}
                                error={errors.description?.message}
                                {...register("description")}
                            />

                            <Controller
                                name="amountCents"
                                control={control}
                                render={({ field }) => (
                                    <CurrencyField
                                        label={config.amountLabel}
                                        value={field.value ? field.value / 100 : ""}
                                        onValueChange={(values) => field.onChange(Math.round((values.floatValue ?? 0) * 100))}
                                        onBlur={field.onBlur}
                                        error={errors.amountCents?.message}
                                        placeholder="R$ 0,00"
                                    />
                                )}
                            />

                            {kind === "single" ? (
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <FieldLabel>{config.dateLabel}</FieldLabel>
                                            <DatePicker
                                                value={dateInputToDate(field.value)}
                                                onChange={(date) => field.onChange(toDateInputValue(date))}
                                                placeholder="Selecione a data"
                                            />
                                            {errors.date?.message && <p className="mt-1.5 text-xs text-danger">{errors.date.message}</p>}
                                        </div>
                                    )}
                                />
                            ) : (
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <FieldLabel>Início da recorrência</FieldLabel>
                                            <DatePicker
                                                value={dateInputToDate(field.value)}
                                                onChange={(date) => field.onChange(toDateInputValue(date))}
                                                placeholder="Selecione a data"
                                            />
                                            {errors.startDate?.message && <p className="mt-1.5 text-xs text-danger">{errors.startDate.message}</p>}
                                        </div>
                                    )}
                                />
                            )}

                            <Input
                                className="sm:col-span-2"
                                label="Categoria"
                                hint="Opcional. Sem categoria, a primeira tag será usada; caso contrário, será classificada como Outros."
                                placeholder="Ex.: Moradia, Salário ou Alimentação"
                                maxLength={80}
                                error={errors.category?.message}
                                {...register("category")}
                            />

                            <Controller
                                name="tagIds"
                                control={control}
                                render={({ field }) => (
                                    <TagMultiSelect
                                        tags={tags}
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                        onManageTags={onManageTags}
                                        error={errors.tagIds?.message}
                                        className="sm:col-span-2"
                                    />
                                )}
                            />
                        </div>

                        {kind === "recurring" && (
                            <section className="rounded-card-sm border border-border bg-surface-raised p-4">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-control bg-primary-soft text-primary">
                                        <Repeat2 className="size-4" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Agenda da recorrência</p>
                                        <p className="text-xs text-subtle-foreground">Somente ocorrências com data alcançada serão lançadas.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Dia do mês"
                                        type="text"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        error={errors.dayOfMonth?.message}
                                        {...register("dayOfMonth")}
                                    />

                                    <Controller
                                        name="intervalMonths"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <FieldLabel>Frequência</FieldLabel>
                                                <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Mensal</SelectItem>
                                                        <SelectItem value="2">Bimestral</SelectItem>
                                                        <SelectItem value="3">Trimestral</SelectItem>
                                                        <SelectItem value="6">Semestral</SelectItem>
                                                        <SelectItem value="12">Anual</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.intervalMonths?.message && <p className="mt-1.5 text-xs text-danger">{errors.intervalMonths.message}</p>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="sm:col-span-2">
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <span className="text-sm font-semibold text-foreground">Data final</span>
                                                    {field.value && <button type="button" onClick={() => field.onChange("")} className="text-xs font-semibold text-primary hover:underline">Sem data final</button>}
                                                </div>
                                                <DatePicker
                                                    value={dateInputToDate(field.value)}
                                                    onChange={(date) => field.onChange(toDateInputValue(date))}
                                                    placeholder="Sem data final"
                                                />
                                                {errors.endDate?.message && <p className="mt-1.5 text-xs text-danger">{errors.endDate.message}</p>}
                                            </div>
                                        )}
                                    />
                                </div>
                            </section>
                        )}

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-foreground">Observações</span>
                            <textarea
                                rows="4"
                                maxLength="500"
                                placeholder="Inclua informações adicionais, caso necessário."
                                className="w-full resize-y rounded-control border border-border bg-surface px-3 py-3 text-sm text-foreground shadow-xs outline-none transition placeholder:text-subtle-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                                {...register("notes")}
                            />
                            {errors.notes?.message && <span className="mt-1.5 block text-xs text-danger">{errors.notes.message}</span>}
                        </label>

                        {requestError && (
                            <div role="alert" className="rounded-card-sm border border-danger/15 bg-danger-muted px-4 py-3 text-sm leading-5 text-danger">
                                {requestError}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t border-border px-5 py-4 sm:px-6">
                        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <WalletCards className="size-4" aria-hidden="true" />}
                            {isSubmitting ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default TransactionFormDialog;
