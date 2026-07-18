import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarDays,
    LoaderCircle,
    Repeat2,
    WalletCards,
    X,
} from "lucide-react";
import { motion } from "motion/react";
import {
    Controller,
    useForm,
} from "react-hook-form";

import CurrencyField from "../../../components/forms/CurrencyField.jsx";
import DatePicker from "../../../components/forms/DatePicker.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

const CONTROL_CLASSNAME = "h-11 min-h-11 w-full";

const MODAL_TRANSITION = {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1],
};

const today = () => toDateInputValue(new Date());

function getDefaults(entity, kind) {
    const common = {
        description: entity?.description ?? "",
        amountCents: Number(entity?.amountCents) || 0,
        category: entity?.category === "Outros"
            ? ""
            : entity?.category ?? "",
        notes: entity?.notes ?? "",
        tagIds: (entity?.tags ?? []).map((tag) => tag.id),
    };

    if (kind === "recurring") {
        return {
            ...common,
            startDate: toDateInputValue(entity?.startDate) || today(),
            endDate: toDateInputValue(entity?.endDate),
            dayOfMonth: Number(entity?.dayOfMonth)
                || new Date().getDate(),
            intervalMonths: Number(entity?.intervalMonths) || 1,
        };
    }

    return {
        ...common,
        date: toDateInputValue(entity?.date) || today(),
    };
}

function FieldLabel({ children }) {
    return (
        <span className="mb-2 block text-sm font-semibold text-foreground">
            {children}
        </span>
    );
}

function FieldError({ children }) {
    if (!children) {
        return null;
    }

    return (
        <p className="mt-1.5 text-xs text-danger">
            {children}
        </p>
    );
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
    const config = useMemo(
        () => getTransactionTypeConfig(type),
        [type],
    );

    const [requestError, setRequestError] = useState("");

    const editing = Boolean(entity?.id);

    const schema = kind === "recurring"
        ? recurringTransactionSchema
        : transactionSchema;

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaults(entity, kind),
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        reset(getDefaults(entity, kind));
        setRequestError("");
    }, [
        entity,
        kind,
        open,
        reset,
    ]);

    async function submitForm(data) {
        setRequestError("");

        const payload = {
            ...data,
            type,
            category: data.category?.trim()
                || (
                    (data.tagIds ?? []).length > 0
                        ? undefined
                        : "Outros"
                ),
            notes: data.notes?.trim() || null,
            tagIds: data.tagIds ?? [],
            ...(kind === "recurring"
                ? {
                    endDate: data.endDate || null,
                }
                : {}),
        };

        try {
            await onSave?.({
                payload,
                kind,
                entity,
            });

            onClose?.();
        } catch (error) {
            setRequestError(
                getApiErrorMessage(error),
            );
        }
    }

    function handleClose() {
        if (!isSubmitting) {
            onClose?.();
        }
    }

    const title = editing
        ? kind === "recurring"
            ? `Editar ${config.singular} recorrente`
            : config.editModalTitle
        : kind === "recurring"
            ? config.recurringCreateLabel
            : config.createModalTitle;

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                className="
                    flex min-h-0
                    max-h-[calc(100svh-1rem)]
                    w-[calc(100vw-1rem)]
                    max-w-2xl
                    overflow-hidden
                    border-0
                    bg-transparent
                    p-0
                    shadow-none
                    [&>button]:hidden
                    sm:max-h-[calc(100svh-2rem)]
                    sm:w-[calc(100vw-2rem)]
                "
            >
                <motion.section
                    initial={{
                        opacity: 0,
                        y: 18,
                        scale: 0.985,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={MODAL_TRANSITION}
                    className="
                        flex min-h-0
                        max-h-[calc(100svh-1rem)]
                        w-full
                        flex-col
                        overflow-hidden
                        rounded-card
                        border border-border
                        bg-surface
                        shadow-dialog
                        sm:max-h-[calc(100svh-2rem)]
                    "
                >
                    <header
                        className="
                            flex w-full shrink-0
                            items-start justify-between
                            gap-3
                            border-b border-border
                            px-4 py-4
                            sm:gap-4
                            sm:px-6
                            sm:py-5
                        "
                    >
                        <div className="min-w-0 flex-1">
                            <DialogHeader>
                                <DialogTitle>
                                    {title}
                                </DialogTitle>

                                <DialogDescription>
                                    {kind === "recurring"
                                        ? "Defina o valor, a classificação e a agenda das próximas ocorrências."
                                        : "Preencha os dados da movimentação. Os campos serão validados."}
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            aria-label="Fechar formulário"
                            className="
                                inline-flex size-9
                                shrink-0
                                items-center justify-center
                                rounded-control-sm
                                text-subtle-foreground
                                outline-none
                                transition-colors
                                hover:bg-surface-hover
                                hover:text-foreground
                                focus-visible:ring-2
                                focus-visible:ring-primary/30
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >
                            <X
                                aria-hidden="true"
                                className="size-4"
                            />
                        </button>
                    </header>

                    <form
                        onSubmit={handleSubmit(submitForm)}
                        className="
                            flex min-h-0
                            flex-1 flex-col
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                min-h-0 flex-1
                                space-y-5
                                overflow-x-hidden
                                overflow-y-auto
                                overscroll-contain
                                px-4 py-4
                                [scrollbar-width:none]
                                [-ms-overflow-style:none]
                                [&::-webkit-scrollbar]:hidden
                                sm:px-6
                                sm:py-5
                            "
                        >
                            {!editing && (
                                <div>
                                    <FieldLabel>
                                        Tipo de lançamento
                                    </FieldLabel>

                                    <div
                                        className="
                                            grid grid-cols-2
                                            gap-1
                                            rounded-control
                                            bg-surface-muted
                                            p-1
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onKindChange?.("single");
                                            }}
                                            aria-pressed={kind === "single"}
                                            className={cn(
                                                `
                                                    flex h-11
                                                    min-w-0
                                                    items-center justify-center
                                                    gap-2
                                                    rounded-control-sm
                                                    px-2
                                                    text-sm font-semibold
                                                    text-muted-foreground
                                                    transition
                                                    sm:px-3
                                                `,
                                                kind === "single"
                                                && `
                                                    bg-surface
                                                    text-foreground
                                                    shadow-xs
                                                `,
                                            )}
                                        >
                                            <CalendarDays
                                                aria-hidden="true"
                                                className="size-4 shrink-0"
                                            />

                                            <span className="truncate">
                                                Única
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                onKindChange?.("recurring");
                                            }}
                                            aria-pressed={kind === "recurring"}
                                            className={cn(
                                                `
                                                    flex h-11
                                                    min-w-0
                                                    items-center justify-center
                                                    gap-2
                                                    rounded-control-sm
                                                    px-2
                                                    text-sm font-semibold
                                                    text-muted-foreground
                                                    transition
                                                    sm:px-3
                                                `,
                                                kind === "recurring"
                                                && `
                                                    bg-surface
                                                    text-foreground
                                                    shadow-xs
                                                `,
                                            )}
                                        >
                                            <Repeat2
                                                aria-hidden="true"
                                                className="size-4 shrink-0"
                                            />

                                            <span className="truncate">
                                                Recorrente
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                                <Input
                                    className="
                                        min-w-0
                                        sm:col-span-2
                                        [&_input]:h-11
                                        [&_input]:min-h-11
                                    "
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
                                        <div
                                            className="
                                                min-w-0
                                                [&_input]:h-11
                                                [&_input]:min-h-11
                                                [&_input]:w-full
                                            "
                                        >
                                            <CurrencyField
                                                label={config.amountLabel}
                                                value={
                                                    field.value
                                                        ? field.value / 100
                                                        : ""
                                                }
                                                onValueChange={(values) => {
                                                    field.onChange(
                                                        Math.round(
                                                            (
                                                                values.floatValue
                                                                ?? 0
                                                            ) * 100,
                                                        ),
                                                    );
                                                }}
                                                onBlur={field.onBlur}
                                                error={errors.amountCents?.message}
                                                placeholder="R$ 0,00"
                                            />
                                        </div>
                                    )}
                                />

                                {kind === "single" ? (
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="min-w-0">
                                                <FieldLabel>
                                                    {config.dateLabel}
                                                </FieldLabel>

                                                <DatePicker
                                                    value={dateInputToDate(
                                                        field.value,
                                                    )}
                                                    onChange={(date) => {
                                                        field.onChange(
                                                            toDateInputValue(date),
                                                        );
                                                    }}
                                                    placeholder="Selecione a data"
                                                    className="w-full min-w-0"
                                                />

                                                <FieldError>
                                                    {errors.date?.message}
                                                </FieldError>
                                            </div>
                                        )}
                                    />
                                ) : (
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="min-w-0">
                                                <FieldLabel>
                                                    Início da recorrência
                                                </FieldLabel>

                                                <DatePicker
                                                    value={dateInputToDate(
                                                        field.value,
                                                    )}
                                                    onChange={(date) => {
                                                        field.onChange(
                                                            toDateInputValue(date),
                                                        );
                                                    }}
                                                    placeholder="Selecione a data"
                                                    className="w-full min-w-0"
                                                />

                                                <FieldError>
                                                    {errors.startDate?.message}
                                                </FieldError>
                                            </div>
                                        )}
                                    />
                                )}

                                <Input
                                    className="
                                        min-w-0
                                        sm:col-span-2
                                        [&_input]:h-11
                                        [&_input]:min-h-11
                                    "
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
                                        <div className="min-w-0 w-full sm:col-span-2">
                                            <TagMultiSelect
                                                tags={tags}
                                                value={field.value ?? []}
                                                onChange={field.onChange}
                                                onManageTags={onManageTags}
                                                error={errors.tagIds?.message}
                                                className="
                                                    w-full min-w-0
                                                    [&>button]:h-11
                                                    [&>button]:min-h-11
                                                    [&>button]:w-full
                                                "
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {kind === "recurring" && (
                                <section
                                    className="
                                        min-w-0
                                        rounded-card-sm
                                        border border-border
                                        bg-surface-raised
                                        p-4
                                    "
                                >
                                    <div className="mb-4 flex min-w-0 items-center gap-3">
                                        <span
                                            className="
                                                flex size-10
                                                shrink-0
                                                items-center justify-center
                                                rounded-control
                                                bg-primary-soft
                                                text-primary
                                            "
                                        >
                                            <Repeat2
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-foreground">
                                                Agenda da recorrência
                                            </p>

                                            <p className="text-xs text-subtle-foreground">
                                                Somente ocorrências com data alcançada serão lançadas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                                        <Input
                                            className="
                                                min-w-0
                                                [&_input]:h-11
                                                [&_input]:min-h-11
                                            "
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
                                                <div className="min-w-0">
                                                    <FieldLabel>
                                                        Frequência
                                                    </FieldLabel>

                                                    <Select
                                                        value={String(field.value)}
                                                        onValueChange={(value) => {
                                                            field.onChange(
                                                                Number(value),
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger
                                                            className={
                                                                CONTROL_CLASSNAME
                                                            }
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="1">
                                                                Mensal
                                                            </SelectItem>

                                                            <SelectItem value="2">
                                                                Bimestral
                                                            </SelectItem>

                                                            <SelectItem value="3">
                                                                Trimestral
                                                            </SelectItem>

                                                            <SelectItem value="6">
                                                                Semestral
                                                            </SelectItem>

                                                            <SelectItem value="12">
                                                                Anual
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <FieldError>
                                                        {errors.intervalMonths?.message}
                                                    </FieldError>
                                                </div>
                                            )}
                                        />

                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="min-w-0 sm:col-span-2">
                                                    <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
                                                        <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                                                            Data final
                                                        </span>

                                                        {field.value && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    field.onChange("");
                                                                }}
                                                                className="
                                                                    shrink-0
                                                                    text-xs font-semibold
                                                                    text-primary
                                                                    hover:underline
                                                                "
                                                            >
                                                                Sem data final
                                                            </button>
                                                        )}
                                                    </div>

                                                    <DatePicker
                                                        value={dateInputToDate(
                                                            field.value,
                                                        )}
                                                        onChange={(date) => {
                                                            field.onChange(
                                                                toDateInputValue(
                                                                    date,
                                                                ),
                                                            );
                                                        }}
                                                        placeholder="Sem data final"
                                                        className="w-full min-w-0"
                                                    />

                                                    <FieldError>
                                                        {errors.endDate?.message}
                                                    </FieldError>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </section>
                            )}

                            <label className="block min-w-0">
                                <span className="mb-2 block text-sm font-semibold text-foreground">
                                    Observações
                                </span>

                                <textarea
                                    rows="4"
                                    maxLength="500"
                                    placeholder="Inclua informações adicionais, caso necessário."
                                    className="
                                        min-h-28
                                        max-h-48
                                        w-full min-w-0
                                        resize-none
                                        rounded-control
                                        border border-border
                                        bg-surface
                                        px-3 py-3
                                        text-sm text-foreground
                                        shadow-xs outline-none
                                        transition
                                        placeholder:text-subtle-foreground
                                        focus:border-primary
                                        focus:ring-4
                                        focus:ring-primary/10
                                        sm:resize-y
                                    "
                                    {...register("notes")}
                                />

                                {errors.notes?.message && (
                                    <span className="mt-1.5 block text-xs text-danger">
                                        {errors.notes.message}
                                    </span>
                                )}
                            </label>

                            {requestError && (
                                <div
                                    role="alert"
                                    className="
                                        min-w-0
                                        break-words
                                        rounded-card-sm
                                        border border-danger/15
                                        bg-danger-muted
                                        px-4 py-3
                                        text-sm leading-5
                                        text-danger
                                    "
                                >
                                    {requestError}
                                </div>
                            )}
                        </div>

                        <footer
                            className="
                                grid shrink-0
                                grid-cols-2 gap-2
                                border-t border-border
                                bg-surface
                                px-4 pt-3
                                sm:flex
                                sm:justify-end
                                sm:px-6
                                sm:pt-4
                            "
                            style={{
                                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                            }}
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="min-w-0 w-full sm:w-auto"
                            >
                                <span className="truncate">
                                    Cancelar
                                </span>
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-0 w-full sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 shrink-0 animate-spin"
                                    />
                                ) : (
                                    <WalletCards
                                        aria-hidden="true"
                                        className="size-4 shrink-0"
                                    />
                                )}

                                <span className="truncate">
                                    {isSubmitting
                                        ? "Salvando..."
                                        : editing
                                            ? "Salvar alterações"
                                            : "Cadastrar"}
                                </span>
                            </Button>
                        </footer>
                    </form>
                </motion.section>
            </DialogContent>
        </Dialog>
    );
}

export default TransactionFormDialog;