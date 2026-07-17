import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RiArrowDownCircleLine,
    RiArrowUpCircleLine,
    RiFileEditLine,
    RiRepeat2Line,
} from "react-icons/ri";

import {
    getTransactionTypeConfig,
    normalizeTransactionType,
} from "../../config/transactionTypeConfig.js";
import {
    recurringTransactionService,
} from "../../services/recurringTransactionService.js";
import {
    tagService,
} from "../../services/tagService.js";
import {
    transactionService,
} from "../../services/transactionService.js";
import Modal from "../ui/feedback/Modal.jsx";
import TransactionForm from "../ui/transactions/TransactionForm.jsx";

import {
    extractEntityTagIds,
    extractEntityTags,
    getErrorMessage,
    getTodayInputValue,
    normalizeDateInput,
    normalizeTagListResponse,
} from "./transactionPageUtils.js";

function createEmptyForm(type, kind = "single") {
    const today = getTodayInputValue();

    return {
        kind,
        type: type === "INCOME" ? "income" : "expense",
        description: "",
        category: "",
        amount: null,
        date: today,
        notes: "",
        tagIds: [],
        recurrence: {
            startDate: today,
            endDate: "",
            dayOfMonth: Number(today.slice(8, 10)),
            intervalMonths: 1,
        },
    };
}

function createFormFromEntity({
    type,
    kind,
    transaction,
    recurringTransaction,
}) {
    if (kind === "recurring" && recurringTransaction) {
        return {
            kind: "recurring",
            type: type === "INCOME" ? "income" : "expense",
            description: recurringTransaction.description || "",
            category: recurringTransaction.category || "",
            amount: Number(recurringTransaction.amountCents || 0) / 100,
            date: getTodayInputValue(),
            notes: recurringTransaction.notes || "",
            tagIds: extractEntityTagIds(recurringTransaction),
            recurrence: {
                startDate: normalizeDateInput(recurringTransaction.startDate) || getTodayInputValue(),
                endDate: normalizeDateInput(recurringTransaction.endDate),
                dayOfMonth: Number(recurringTransaction.dayOfMonth) || 1,
                intervalMonths: Number(recurringTransaction.intervalMonths) || 1,
            },
        };
    }

    if (transaction) {
        return {
            kind: "single",
            type: type === "INCOME" ? "income" : "expense",
            description: transaction.description || "",
            category: transaction.category || "",
            amount: Number(transaction.amountCents || 0) / 100,
            date: normalizeDateInput(
                transaction.date || transaction.occurrenceDate || transaction.createdAt
            ) || getTodayInputValue(),
            notes: transaction.notes || "",
            tagIds: extractEntityTagIds(transaction),
            recurrence: createEmptyForm(type, "recurring").recurrence,
        };
    }

    return createEmptyForm(type, kind);
}

function validateForm(form) {
    const errors = {};

    if (!form.description?.trim()) {
        errors.description = "Informe uma descrição.";
    }

    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
        errors.amount = "Informe um valor maior que zero.";
    }

    if (form.kind === "single" && !form.date) {
        errors.date = "Informe a data da movimentação.";
    }

    if (form.kind === "recurring") {
        const recurrenceErrors = {};
        const dayOfMonth = Number(form.recurrence?.dayOfMonth);
        const intervalMonths = Number(form.recurrence?.intervalMonths);

        if (!form.recurrence?.startDate) {
            recurrenceErrors.startDate = "Informe a data de início.";
        }

        if (!Number.isInteger(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
            recurrenceErrors.dayOfMonth = "Informe um dia entre 1 e 31.";
        }

        if (!Number.isInteger(intervalMonths) || intervalMonths < 1) {
            recurrenceErrors.intervalMonths = "Informe uma frequência válida.";
        }

        if (
            form.recurrence?.startDate &&
            form.recurrence?.endDate &&
            form.recurrence.endDate < form.recurrence.startDate
        ) {
            recurrenceErrors.endDate = "A data final deve ser posterior ao início.";
        }

        if (Object.keys(recurrenceErrors).length > 0) {
            errors.recurrence = recurrenceErrors;
        }
    }

    return errors;
}

function TransactionFormDialog({
    open,
    onOpenChange,
    type = "INCOME",
    initialKind = "single",
    transaction,
    recurringTransaction,
    onSaved,
}) {
    const normalizedType = normalizeTransactionType(type) || "INCOME";
    const config = useMemo(
        () => getTransactionTypeConfig(normalizedType),
        [normalizedType]
    );
    const editingRecurring = Boolean(recurringTransaction);
    const editingTransaction = Boolean(transaction);
    const resolvedKind = editingRecurring || initialKind === "recurring"
        ? "recurring"
        : "single";

    const [form, setForm] = useState(() => createEmptyForm(normalizedType, resolvedKind));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTagOptions, setSelectedTagOptions] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        const nextForm = createFormFromEntity({
            type: normalizedType,
            kind: resolvedKind,
            transaction,
            recurringTransaction,
        });

        setForm(nextForm);
        setErrors({});
        setSubmitError("");
        setSelectedTagOptions(
            extractEntityTags(recurringTransaction || transaction)
        );
    }, [
        open,
        normalizedType,
        recurringTransaction,
        resolvedKind,
        transaction,
    ]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        let active = true;
        setLoadingTags(true);

        tagService
            .listForTransactionType(normalizedType)
            .then((response) => {
                if (active) {
                    setTagOptions(normalizeTagListResponse(response));
                }
            })
            .catch(() => {
                if (active) {
                    setTagOptions([]);
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingTags(false);
                }
            });

        return () => {
            active = false;
        };
    }, [open, normalizedType]);

    function closeDialog() {
        if (!submitting) {
            onOpenChange?.(false);
        }
    }

    async function handleCreateTag(payload) {
        const createdTag = await tagService.create({
            ...payload,
            scope: payload.scope || normalizedType,
        });
        const [normalizedCreatedTag] = normalizeTagListResponse([createdTag]);

        if (normalizedCreatedTag) {
            setTagOptions((current) => [
                ...current.filter((tag) => tag.id !== normalizedCreatedTag.id),
                normalizedCreatedTag,
            ]);
        }

        return normalizedCreatedTag || createdTag;
    }

    function handleTagCreated(tag) {
        setSelectedTagOptions((current) => [
            ...current.filter((item) => item.id !== tag.id),
            tag,
        ]);
    }

    async function handleSubmit(nextForm) {
        const validationErrors = validateForm(nextForm);
        setErrors(validationErrors);
        setSubmitError("");

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const commonPayload = {
                description: nextForm.description.trim(),
                amountCents: Math.round(Number(nextForm.amount) * 100),
                type: normalizedType,
                category: nextForm.category?.trim() || "",
                notes: nextForm.notes?.trim() || null,
                tagIds: nextForm.tagIds,
            };

            let response;
            let action;
            let kind;

            if (nextForm.kind === "recurring") {
                const recurringPayload = {
                    ...commonPayload,
                    startDate: nextForm.recurrence.startDate,
                    endDate: nextForm.recurrence.endDate || null,
                    dayOfMonth: Number(nextForm.recurrence.dayOfMonth),
                    intervalMonths: Number(nextForm.recurrence.intervalMonths),
                };

                if (recurringTransaction?.id) {
                    response = await recurringTransactionService.update(
                        recurringTransaction.id,
                        recurringPayload
                    );
                    action = "UPDATE";
                } else {
                    response = await recurringTransactionService.create(recurringPayload);
                    action = "CREATE";
                }

                kind = "RECURRING";
            } else {
                const transactionPayload = {
                    ...commonPayload,
                    date: nextForm.date,
                };

                if (transaction?.id) {
                    response = await transactionService.update(
                        transaction.id,
                        transactionPayload
                    );
                    action = "UPDATE";
                } else {
                    response = await transactionService.create(transactionPayload);
                    action = "CREATE";
                }

                kind = "SINGLE";
            }

            await onSaved?.({
                kind,
                action,
                data: response,
            });

            onOpenChange?.(false);
        } catch (error) {
            setSubmitError(
                getErrorMessage(
                    error,
                    `Não foi possível salvar ${config.article} ${config.singular}.`
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    const ModalIcon = editingTransaction
        ? RiFileEditLine
        : resolvedKind === "recurring"
            ? RiRepeat2Line
            : normalizedType === "INCOME"
                ? RiArrowUpCircleLine
                : RiArrowDownCircleLine;
    const title = editingRecurring
        ? `Editar ${config.singular} recorrente`
        : editingTransaction
            ? config.editModalTitle
            : resolvedKind === "recurring"
                ? config.recurringCreateLabel
                : config.createModalTitle;
    const description = resolvedKind === "recurring"
        ? "Defina a frequência e o período. O valor só será contabilizado quando cada ocorrência chegar."
        : `Preencha os dados para ${editingTransaction ? "atualizar" : "registrar"} ${config.article} ${config.singular}.`;

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            icon={ModalIcon}
            size="lg"
            closeOnBackdrop={!submitting}
            closeOnEscape={!submitting}
            bodyClassName="pb-6"
        >
            {submitError ? (
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-danger/20 bg-danger-muted px-4 py-3 text-body-sm text-danger-strong"
                >
                    {submitError}
                </div>
            ) : null}

            <TransactionForm
                value={form}
                onChange={setForm}
                onSubmit={handleSubmit}
                onCancel={closeDialog}
                errors={errors}
                tagOptions={tagOptions}
                selectedTagOptions={selectedTagOptions}
                onCreateTag={handleCreateTag}
                onTagCreated={handleTagCreated}
                disabled={loadingTags}
                submitting={submitting}
                showTypeSelector={false}
                showKindSelector={!editingTransaction && !editingRecurring}
                submitLabel={
                    editingTransaction || editingRecurring
                        ? "Salvar alterações"
                        : resolvedKind === "recurring"
                            ? `Criar ${config.singular} recorrente`
                            : config.createButtonLabel
                }
            />

            {loadingTags ? (
                <p className="mt-3 text-caption text-muted-foreground">
                    Carregando tags disponíveis…
                </p>
            ) : null}
        </Modal>
    );
}

export default TransactionFormDialog;
