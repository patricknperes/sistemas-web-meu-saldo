import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiCalendarLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiFileTextLine,
    RiLoader4Line,
    RiMoneyDollarCircleLine,
    RiRepeat2Line,
    RiSaveLine,
} from "react-icons/ri";

import {
    getTransactionTypeConfig,
    normalizeTransactionType,
} from "../../config/transactionTypeConfig.js";

import {
    recurringTransactionService,
} from "../../services/recurringTransactionService.js";

import {
    transactionService,
} from "../../services/transactionService.js";

import RecurrenceFields from "./RecurrenceFields.jsx";
import TagSelector from "./TagSelector.jsx";

const FORM_KINDS = Object.freeze({
    SINGLE: "SINGLE",
    RECURRING: "RECURRING",
});

const MAX_AMOUNT_CENTS =
    999_999_999_999;

function getTodayInputValue() {
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1,
        ).padStart(2, "0");

    const day =
        String(
            now.getDate(),
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function normalizeDateInput(value) {
    if (!value) {
        return "";
    }

    if (
        typeof value === "string"
    ) {
        return value.slice(0, 10);
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "";
    }

    return date
        .toISOString()
        .slice(0, 10);
}

function normalizeFormKind(value) {
    return value ===
        FORM_KINDS.RECURRING
        ? FORM_KINDS.RECURRING
        : FORM_KINDS.SINGLE;
}

function normalizePositiveInteger(
    value,
    fallbackValue,
) {
    const normalizedValue =
        Number(value);

    if (
        !Number.isInteger(
            normalizedValue,
        ) ||
        normalizedValue <= 0
    ) {
        return fallbackValue;
    }

    return normalizedValue;
}

function extractTags(entity) {
    if (
        !Array.isArray(
            entity?.tags,
        )
    ) {
        return [];
    }

    return entity.tags
        .map((item) => {
            if (
                item?.tag &&
                typeof item.tag ===
                "object"
            ) {
                return item.tag;
            }

            return item;
        })
        .filter(
            (tag) =>
                Number.isInteger(
                    Number(tag?.id),
                ) &&
                Number(tag.id) > 0,
        );
}

function extractTagIds(entity) {
    return [
        ...new Set(
            extractTags(entity)
                .map((tag) =>
                    Number(tag.id),
                ),
        ),
    ];
}

function formatCurrencyFromCents(
    amountCents,
) {
    const normalizedAmount =
        Number(amountCents);

    const safeAmount =
        Number.isFinite(
            normalizedAmount,
        )
            ? normalizedAmount
            : 0;

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    ).format(
        safeAmount / 100,
    );
}

function parseCurrencyInput(value) {
    const digits =
        String(value ?? "")
            .replace(/\D/g, "")
            .slice(0, 14);

    if (!digits) {
        return 0;
    }

    const amount =
        Number(digits);

    if (
        !Number.isSafeInteger(
            amount,
        )
    ) {
        return 0;
    }

    return Math.min(
        amount,
        MAX_AMOUNT_CENTS,
    );
}

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        Array.isArray(
            responseData?.errors,
        ) &&
        responseData.errors.length > 0
    ) {
        const firstError =
            responseData.errors[0];

        if (
            typeof firstError ===
            "string"
        ) {
            return firstError;
        }

        if (
            typeof firstError?.message ===
            "string"
        ) {
            return firstError.message;
        }
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return fallbackMessage;
}

function createEmptyForm() {
    const today =
        getTodayInputValue();

    return {
        description: "",
        amountCents: 0,
        date: today,
        notes: "",
        tagIds: [],
        tags: [],

        startDate: today,
        endDate: null,
        dayOfMonth:
            new Date().getDate(),
        intervalMonths: 1,
    };
}

function createInitialForm({
    transaction,
    recurringTransaction,
}) {
    const entity =
        recurringTransaction ??
        transaction;

    if (!entity) {
        return createEmptyForm();
    }

    const today =
        getTodayInputValue();

    return {
        description:
            entity.description ??
            "",

        amountCents:
            Number(
                entity.amountCents,
            ) || 0,

        date:
            normalizeDateInput(
                entity.date,
            ) || today,

        notes:
            entity.notes ?? "",

        tagIds:
            extractTagIds(entity),

        tags:
            extractTags(entity),

        startDate:
            normalizeDateInput(
                entity.startDate,
            ) || today,

        endDate:
            normalizeDateInput(
                entity.endDate,
            ) || null,

        dayOfMonth:
            normalizePositiveInteger(
                entity.dayOfMonth,
                new Date().getDate(),
            ),

        intervalMonths:
            normalizePositiveInteger(
                entity.intervalMonths,
                1,
            ),
    };
}

function FieldError({
    message,
}) {
    if (!message) {
        return null;
    }

    return (
        <p
            role="alert"
            className="
                mt-1.5
                flex items-start
                gap-1.5
                text-xs
                font-medium
                leading-5
                text-danger
            "
        >
            <RiErrorWarningLine
                size={14}
                aria-hidden="true"
                className="
                    mt-0.5
                    shrink-0
                "
            />

            <span>
                {message}
            </span>
        </p>
    );
}

function TransactionFormModal({
    open,
    isOpen,
    type = "INCOME",

    transaction = null,
    recurringTransaction = null,

    initialKind = "SINGLE",

    onClose,
    onSaved,
    onSuccess,
}) {
    const visible =
        isOpen ?? open ?? false;

    const normalizedType =
        normalizeTransactionType(
            type,
        ) || "INCOME";

    const config =
        useMemo(
            () =>
                getTransactionTypeConfig(
                    normalizedType,
                ),
            [normalizedType],
        );

    const editingTransaction =
        Boolean(
            transaction?.id,
        );

    const editingRecurring =
        Boolean(
            recurringTransaction?.id,
        );

    const editing =
        editingTransaction ||
        editingRecurring;

    const [formKind, setFormKind] =
        useState(
            editingRecurring
                ? FORM_KINDS.RECURRING
                : normalizeFormKind(
                    initialKind,
                ),
        );

    const [formData, setFormData] =
        useState(
            createInitialForm({
                transaction,
                recurringTransaction,
            }),
        );

    const [fieldErrors, setFieldErrors] =
        useState({});

    const [
        requestError,
        setRequestError,
    ] = useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const recurring =
        formKind ===
        FORM_KINDS.RECURRING;

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        setFormKind(
            editingRecurring
                ? FORM_KINDS.RECURRING
                : editingTransaction
                    ? FORM_KINDS.SINGLE
                    : normalizeFormKind(
                        initialKind,
                    ),
        );

        setFormData(
            createInitialForm({
                transaction,
                recurringTransaction,
            }),
        );

        setFieldErrors({});
        setRequestError("");
        setSubmitting(false);

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        function handleKeyDown(event) {
            if (
                event.key === "Escape" &&
                !submitting
            ) {
                onClose?.();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        visible,
        transaction,
        recurringTransaction,
        initialKind,
        editingTransaction,
        editingRecurring,
        onClose,
        submitting,
    ]);

    const modalTitle =
        useMemo(() => {
            if (editingRecurring) {
                return `Editar ${config.singular} recorrente`;
            }

            if (editingTransaction) {
                return config.editModalTitle;
            }

            if (recurring) {
                return `Cadastrar ${config.singular} recorrente`;
            }

            return config.createModalTitle;
        }, [
            config,
            editingRecurring,
            editingTransaction,
            recurring,
        ]);

    const submitLabel =
        useMemo(() => {
            if (submitting) {
                return editing
                    ? "Salvando alterações..."
                    : "Cadastrando...";
            }

            if (editing) {
                return "Salvar alterações";
            }

            if (recurring) {
                return `Cadastrar ${config.singular} recorrente`;
            }

            return config.createButtonLabel;
        }, [
            config,
            editing,
            recurring,
            submitting,
        ]);

    function updateField(
        fieldName,
        fieldValue,
    ) {
        setFormData(
            (currentData) => ({
                ...currentData,
                [fieldName]:
                    fieldValue,
            }),
        );

        setFieldErrors(
            (currentErrors) => {
                if (
                    !currentErrors[
                    fieldName
                    ]
                ) {
                    return currentErrors;
                }

                const nextErrors = {
                    ...currentErrors,
                };

                delete nextErrors[
                    fieldName
                ];

                return nextErrors;
            },
        );

        setRequestError("");
    }

    function handleKindChange(
        nextKind,
    ) {
        if (
            editing ||
            submitting
        ) {
            return;
        }

        setFormKind(nextKind);
        setFieldErrors({});
        setRequestError("");
    }

    function handleAmountChange(
        event,
    ) {
        updateField(
            "amountCents",
            parseCurrencyInput(
                event.target.value,
            ),
        );
    }

    function handleTagsChange(
        tagIds,
    ) {
        updateField(
            "tagIds",
            tagIds,
        );
    }

    function handleTagCreated(tag) {
        setFormData(
            (currentData) => ({
                ...currentData,
                tags: [
                    ...currentData.tags.filter(
                        (
                            currentTag,
                        ) =>
                            currentTag.id !==
                            tag.id,
                    ),
                    tag,
                ],
            }),
        );
    }

    function handleRecurrenceChange(
        recurrenceData,
    ) {
        setFormData(
            (currentData) => ({
                ...currentData,
                ...recurrenceData,
            }),
        );

        setFieldErrors(
            (currentErrors) => {
                const nextErrors = {
                    ...currentErrors,
                };

                delete nextErrors.startDate;
                delete nextErrors.endDate;
                delete nextErrors.dayOfMonth;
                delete nextErrors.intervalMonths;

                return nextErrors;
            },
        );

        setRequestError("");
    }

    function validateForm() {
        const errors = {};

        const description =
            formData.description
                .trim()
                .replace(/\s+/g, " ");

        if (!description) {
            errors.description =
                "Informe uma descrição.";
        } else if (
            description.length < 2
        ) {
            errors.description =
                "A descrição deve possuir pelo menos 2 caracteres.";
        } else if (
            description.length > 120
        ) {
            errors.description =
                "A descrição deve possuir no máximo 120 caracteres.";
        }

        if (
            !Number.isInteger(
                formData.amountCents,
            ) ||
            formData.amountCents <= 0
        ) {
            errors.amountCents =
                "Informe um valor maior que zero.";
        }

        if (
            formData.amountCents >
            MAX_AMOUNT_CENTS
        ) {
            errors.amountCents =
                "O valor informado ultrapassa o limite permitido.";
        }

        if (
            formData.notes.trim()
                .length > 500
        ) {
            errors.notes =
                "As observações devem possuir no máximo 500 caracteres.";
        }

        if (!recurring) {
            if (!formData.date) {
                errors.date =
                    `Informe ${config.article} ${config.dateLabel.toLowerCase()}.`;
            }
        }

        if (recurring) {
            if (!formData.startDate) {
                errors.startDate =
                    "Informe a data inicial da recorrência.";
            }

            if (
                formData.endDate &&
                formData.startDate &&
                formData.endDate <
                formData.startDate
            ) {
                errors.endDate =
                    "A data final não pode ser anterior à data inicial.";
            }

            const dayOfMonth =
                Number(
                    formData.dayOfMonth,
                );

            if (
                !Number.isInteger(
                    dayOfMonth,
                ) ||
                dayOfMonth < 1 ||
                dayOfMonth > 31
            ) {
                errors.dayOfMonth =
                    "Selecione um dia entre 1 e 31.";
            }

            const intervalMonths =
                Number(
                    formData.intervalMonths,
                );

            if (
                !Number.isInteger(
                    intervalMonths,
                ) ||
                intervalMonths < 1
            ) {
                errors.intervalMonths =
                    "Selecione uma frequência válida.";
            }
        }

        setFieldErrors(errors);

        return {
            valid:
                Object.keys(errors)
                    .length === 0,

            description,
        };
    }

    async function handleSubmit(
        event,
    ) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const validation =
            validateForm();

        if (!validation.valid) {
            return;
        }

        setSubmitting(true);
        setRequestError("");

        const basePayload = {
            description:
                validation.description,

            amountCents:
                formData.amountCents,

            type:
                normalizedType,

            notes:
                formData.notes.trim() ||
                null,

            tagIds:
                formData.tagIds,
        };

        try {
            let response;
            let savedEntity;
            let operationKind;

            if (recurring) {
                const recurringPayload = {
                    ...basePayload,

                    startDate:
                        formData.startDate,

                    endDate:
                        formData.endDate ||
                        null,

                    dayOfMonth:
                        Number(
                            formData.dayOfMonth,
                        ),

                    intervalMonths:
                        Number(
                            formData.intervalMonths,
                        ),
                };

                if (editingRecurring) {
                    response =
                        await recurringTransactionService.update(
                            recurringTransaction.id,
                            recurringPayload,
                        );
                } else {
                    response =
                        await recurringTransactionService.create(
                            recurringPayload,
                        );
                }

                savedEntity =
                    response
                        ?.recurringTransaction ??
                    response;

                operationKind =
                    FORM_KINDS.RECURRING;
            } else {
                const transactionPayload = {
                    ...basePayload,

                    date:
                        formData.date,
                };

                if (editingTransaction) {
                    response =
                        await transactionService.update(
                            transaction.id,
                            transactionPayload,
                        );
                } else {
                    response =
                        await transactionService.create(
                            transactionPayload,
                        );
                }

                savedEntity =
                    response
                        ?.transaction ??
                    response;

                operationKind =
                    FORM_KINDS.SINGLE;
            }

            const result = {
                kind:
                    operationKind,

                action:
                    editing
                        ? "UPDATE"
                        : "CREATE",

                entity:
                    savedEntity,

                response,
            };

            await onSaved?.(result);
            await onSuccess?.(result);

            onClose?.();
        } catch (error) {
            setRequestError(
                getErrorMessage(
                    error,
                    editing
                        ? `Não foi possível atualizar ${config.article} ${config.singular}.`
                        : `Não foi possível cadastrar ${config.article} ${config.singular}.`,
                ),
            );
        } finally {
            setSubmitting(false);
        }
    }

    function handleBackdropMouseDown(
        event,
    ) {
        if (
            event.target !==
            event.currentTarget
        ) {
            return;
        }

        if (!submitting) {
            onClose?.();
        }
    }

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="presentation"
                    onMouseDown={
                        handleBackdropMouseDown
                    }
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.18,
                    }}
                    className="
                        fixed inset-0
                        z-[100]
                        flex
                        items-end
                        justify-center
                        bg-slate-950/45
                        p-0
                        backdrop-blur-[2px]
                        sm:items-center
                        sm:p-5
                    "
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="transaction-form-modal-title"
                        initial={{
                            opacity: 0,
                            y: 24,
                            scale: 0.985,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 16,
                            scale: 0.99,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                        className="
                            flex
                            max-h-[96dvh]
                            w-full
                            flex-col
                            overflow-hidden
                            rounded-t-3xl
                            border border-border
                            bg-surface
                            shadow-2xl
                            sm:max-h-[92dvh]
                            sm:max-w-3xl
                            sm:rounded-3xl
                        "
                    >
                        <header
                            className="
                                flex
                                shrink-0
                                items-start
                                justify-between
                                gap-4
                                border-b border-border
                                px-4 py-4
                                sm:px-6
                                sm:py-5
                            "
                        >
                            <div
                                className="
                                    flex min-w-0
                                    items-start
                                    gap-3
                                "
                            >
                                <div
                                    className={`
                                        inline-flex
                                        size-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        ${config.softBackgroundClasses}
                                        ${config.borderClasses}
                                        ${config.accentClasses}
                                    `}
                                >
                                    {recurring ? (
                                        <RiRepeat2Line
                                            size={20}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <config.icon
                                            size={20}
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="transaction-form-modal-title"
                                        className="
                                            truncate
                                            text-base
                                            font-semibold
                                            text-foreground
                                            sm:text-lg
                                        "
                                    >
                                        {
                                            modalTitle
                                        }
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-muted-foreground
                                            sm:text-sm
                                        "
                                    >
                                        {recurring
                                            ? "Defina os dados e o período da recorrência."
                                            : "Preencha os dados da movimentação."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onClose
                                }
                                disabled={
                                    submitting
                                }
                                aria-label="Fechar formulário"
                                title="Fechar"
                                className="
                                    inline-flex
                                    size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-muted-foreground
                                    transition
                                    hover:bg-surface-hover
                                    hover:text-foreground
                                    focus-visible:ring-4
                                    focus-visible:ring-primary/15
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                <RiCloseLine
                                    size={20}
                                    aria-hidden="true"
                                />
                            </button>
                        </header>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                flex min-h-0
                                flex-1 flex-col
                            "
                        >
                            <div
                                className="
                                    flex-1
                                    overflow-y-auto
                                    overscroll-contain
                                    px-4 py-5
                                    sm:px-6
                                "
                            >
                                <div className="space-y-6">
                                    {!editing && (
                                        <section>
                                            <p
                                                className="
                                                    mb-2
                                                    text-xs
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Tipo de lançamento
                                            </p>

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-2
                                                    gap-2
                                                    rounded-2xl
                                                    border border-border
                                                    bg-surface-muted/40
                                                    p-1.5
                                                "
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleKindChange(
                                                            FORM_KINDS.SINGLE,
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    aria-pressed={
                                                        !recurring
                                                    }
                                                    className={`
                                                        inline-flex
                                                        min-h-11
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        px-3
                                                        text-xs
                                                        font-semibold
                                                        transition
                                                        sm:text-sm

                                                        ${!recurring
                                                            ? "bg-surface text-foreground shadow-sm ring-1 ring-border"
                                                            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                                        }
                                                    `}
                                                >
                                                    <RiCalendarLine
                                                        size={17}
                                                        aria-hidden="true"
                                                    />

                                                    Única
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleKindChange(
                                                            FORM_KINDS.RECURRING,
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    aria-pressed={
                                                        recurring
                                                    }
                                                    className={`
                                                        inline-flex
                                                        min-h-11
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        px-3
                                                        text-xs
                                                        font-semibold
                                                        transition
                                                        sm:text-sm

                                                        ${recurring
                                                            ? "bg-surface text-foreground shadow-sm ring-1 ring-border"
                                                            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                                        }
                                                    `}
                                                >
                                                    <RiRepeat2Line
                                                        size={17}
                                                        aria-hidden="true"
                                                    />

                                                    Recorrente
                                                </button>
                                            </div>
                                        </section>
                                    )}

                                    <section
                                        className="
                                            grid gap-4
                                            sm:grid-cols-2
                                        "
                                    >
                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="transaction-description"
                                                className="
                                                    mb-1.5
                                                    block
                                                    text-xs
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Descrição
                                            </label>

                                            <div className="relative">
                                                <RiFileTextLine
                                                    size={17}
                                                    aria-hidden="true"
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        left-3.5 top-1/2
                                                        -translate-y-1/2
                                                        text-muted-foreground
                                                    "
                                                />

                                                <input
                                                    id="transaction-description"
                                                    type="text"
                                                    autoFocus
                                                    maxLength={
                                                        120
                                                    }
                                                    value={
                                                        formData.description
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        updateField(
                                                            "description",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    aria-invalid={
                                                        Boolean(
                                                            fieldErrors.description,
                                                        )
                                                    }
                                                    placeholder={
                                                        config.descriptionPlaceholder
                                                    }
                                                    className={`
                                                        h-11
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        bg-background
                                                        pl-10
                                                        pr-3
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        placeholder:font-normal
                                                        placeholder:text-muted-foreground/70
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${fieldErrors.description
                                                            ? "border-danger focus:border-danger focus:ring-danger/10"
                                                            : "border-border hover:border-border-strong focus:border-primary/50 focus:ring-primary/10"
                                                        }
                                                    `}
                                                />
                                            </div>

                                            <FieldError
                                                message={
                                                    fieldErrors.description
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="transaction-amount"
                                                className="
                                                    mb-1.5
                                                    block
                                                    text-xs
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                {
                                                    config.amountLabel
                                                }
                                            </label>

                                            <div className="relative">
                                                <RiMoneyDollarCircleLine
                                                    size={18}
                                                    aria-hidden="true"
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        left-3.5 top-1/2
                                                        -translate-y-1/2
                                                        text-muted-foreground
                                                    "
                                                />

                                                <input
                                                    id="transaction-amount"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={formatCurrencyFromCents(
                                                        formData.amountCents,
                                                    )}
                                                    onChange={
                                                        handleAmountChange
                                                    }
                                                    onFocus={(
                                                        event,
                                                    ) =>
                                                        event.target.select()
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    aria-invalid={
                                                        Boolean(
                                                            fieldErrors.amountCents,
                                                        )
                                                    }
                                                    className={`
                                                        h-11
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        bg-background
                                                        pl-10
                                                        pr-3
                                                        text-sm
                                                        font-semibold
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${fieldErrors.amountCents
                                                            ? "border-danger focus:border-danger focus:ring-danger/10"
                                                            : "border-border hover:border-border-strong focus:border-primary/50 focus:ring-primary/10"
                                                        }
                                                    `}
                                                />
                                            </div>

                                            <FieldError
                                                message={
                                                    fieldErrors.amountCents
                                                }
                                            />
                                        </div>

                                        {!recurring && (
                                            <div>
                                                <label
                                                    htmlFor="transaction-date"
                                                    className="
                                                        mb-1.5
                                                        block
                                                        text-xs
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        config.dateLabel
                                                    }
                                                </label>

                                                <input
                                                    id="transaction-date"
                                                    type="date"
                                                    value={
                                                        formData.date
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        updateField(
                                                            "date",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                    aria-invalid={
                                                        Boolean(
                                                            fieldErrors.date,
                                                        )
                                                    }
                                                    className={`
                                                        h-11
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        bg-background
                                                        px-3
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                        outline-none
                                                        transition
                                                        focus:ring-4
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60

                                                        ${fieldErrors.date
                                                            ? "border-danger focus:border-danger focus:ring-danger/10"
                                                            : "border-border hover:border-border-strong focus:border-primary/50 focus:ring-primary/10"
                                                        }
                                                    `}
                                                />

                                                <FieldError
                                                    message={
                                                        fieldErrors.date
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={
                                                recurring
                                                    ? ""
                                                    : "sm:col-span-2"
                                            }
                                        >
                                            <label
                                                htmlFor="transaction-notes"
                                                className="
                                                    mb-1.5
                                                    block
                                                    text-xs
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                Observações
                                                <span
                                                    className="
                                                        ml-1
                                                        font-normal
                                                        text-muted-foreground
                                                    "
                                                >
                                                    (opcional)
                                                </span>
                                            </label>

                                            <textarea
                                                id="transaction-notes"
                                                rows={3}
                                                maxLength={
                                                    500
                                                }
                                                value={
                                                    formData.notes
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    updateField(
                                                        "notes",
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                                disabled={
                                                    submitting
                                                }
                                                aria-invalid={
                                                    Boolean(
                                                        fieldErrors.notes,
                                                    )
                                                }
                                                placeholder="Adicione uma observação sobre esta movimentação."
                                                className={`
                                                    min-h-24
                                                    w-full
                                                    resize-y
                                                    rounded-xl
                                                    border
                                                    bg-background
                                                    px-3 py-3
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                    outline-none
                                                    transition
                                                    placeholder:font-normal
                                                    placeholder:text-muted-foreground/70
                                                    focus:ring-4
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-60

                                                    ${fieldErrors.notes
                                                        ? "border-danger focus:border-danger focus:ring-danger/10"
                                                        : "border-border hover:border-border-strong focus:border-primary/50 focus:ring-primary/10"
                                                    }
                                                `}
                                            />

                                            <div
                                                className="
                                                    mt-1
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                                            >
                                                <FieldError
                                                    message={
                                                        fieldErrors.notes
                                                    }
                                                />

                                                <span
                                                    className="
                                                        ml-auto
                                                        text-[11px]
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        formData
                                                            .notes
                                                            .length
                                                    }
                                                    /500
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <TagSelector
                                        type={
                                            normalizedType
                                        }
                                        value={
                                            formData.tagIds
                                        }
                                        selectedTags={
                                            formData.tags
                                        }
                                        onChange={
                                            handleTagsChange
                                        }
                                        onTagCreated={
                                            handleTagCreated
                                        }
                                        onError={
                                            setRequestError
                                        }
                                        disabled={
                                            submitting
                                        }
                                    />

                                    {recurring && (
                                        <RecurrenceFields
                                            value={{
                                                startDate:
                                                    formData.startDate,

                                                endDate:
                                                    formData.endDate,

                                                dayOfMonth:
                                                    formData.dayOfMonth,

                                                intervalMonths:
                                                    formData.intervalMonths,
                                            }}
                                            onChange={
                                                handleRecurrenceChange
                                            }
                                            errors={{
                                                startDate:
                                                    fieldErrors.startDate,

                                                endDate:
                                                    fieldErrors.endDate,

                                                dayOfMonth:
                                                    fieldErrors.dayOfMonth,

                                                intervalMonths:
                                                    fieldErrors.intervalMonths,
                                            }}
                                            disabled={
                                                submitting
                                            }
                                        />
                                    )}

                                    {requestError && (
                                        <div
                                            role="alert"
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-danger/20
                                                bg-danger/5
                                                px-4 py-3.5
                                            "
                                        >
                                            <RiErrorWarningLine
                                                size={19}
                                                aria-hidden="true"
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                    text-danger
                                                "
                                            />

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-danger
                                                    "
                                                >
                                                    Não foi possível salvar
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        leading-5
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        requestError
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <footer
                                className="
                                    flex
                                    shrink-0
                                    flex-col-reverse
                                    gap-2
                                    border-t border-border
                                    bg-surface
                                    px-4 py-4
                                    sm:flex-row
                                    sm:justify-end
                                    sm:px-6
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        onClose
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        inline-flex
                                        min-h-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border border-border
                                        bg-surface
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-foreground
                                        transition
                                        hover:bg-surface-hover
                                        focus-visible:ring-4
                                        focus-visible:ring-primary/10
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                    "
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        inline-flex
                                        min-h-11
                                        min-w-40
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-primary
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-primary-foreground
                                        transition
                                        hover:bg-primary-hover
                                        focus-visible:ring-4
                                        focus-visible:ring-primary/20
                                        disabled:pointer-events-none
                                        disabled:opacity-70
                                    "
                                >
                                    {submitting ? (
                                        <RiLoader4Line
                                            size={18}
                                            aria-hidden="true"
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <RiSaveLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {
                                        submitLabel
                                    }
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

export default TransactionFormModal;