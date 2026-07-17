import {
    useId,
    useMemo,
} from "react";

import {
    RiCalendar2Line,
    RiCalendarEventLine,
    RiInformationLine,
    RiRepeat2Line,
    RiTimeLine,
} from "react-icons/ri";

const INTERVAL_OPTIONS = [
    {
        value: 1,
        label: "Todo mês",
    },
    {
        value: 2,
        label: "A cada 2 meses",
    },
    {
        value: 3,
        label: "A cada 3 meses",
    },
    {
        value: 6,
        label: "A cada 6 meses",
    },
    {
        value: 12,
        label: "Todo ano",
    },
];

const DAY_OPTIONS = Array.from(
    {
        length: 31,
    },
    (_, index) => index + 1,
);

function normalizeDateInput(value) {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        return "";
    }

    return value
        .trim()
        .slice(0, 10);
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

function formatDate(value) {
    const normalizedDate =
        normalizeDateInput(value);

    if (!normalizedDate) {
        return "";
    }

    const [
        year,
        month,
        day,
    ] = normalizedDate
        .split("-")
        .map(Number);

    if (
        !year ||
        !month ||
        !day
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        },
    ).format(
        new Date(
            Date.UTC(
                year,
                month - 1,
                day,
            ),
        ),
    );
}

function getIntervalDescription(
    intervalMonths,
) {
    const normalizedInterval =
        normalizePositiveInteger(
            intervalMonths,
            1,
        );

    if (normalizedInterval === 1) {
        return "todos os meses";
    }

    if (normalizedInterval === 12) {
        return "todos os anos";
    }

    return `a cada ${normalizedInterval} meses`;
}

function buildRecurrenceSummary({
    startDate,
    endDate,
    dayOfMonth,
    intervalMonths,
}) {
    const normalizedStartDate =
        normalizeDateInput(
            startDate,
        );

    const normalizedEndDate =
        normalizeDateInput(
            endDate,
        );

    const normalizedDay =
        normalizePositiveInteger(
            dayOfMonth,
            1,
        );

    const intervalDescription =
        getIntervalDescription(
            intervalMonths,
        );

    const parts = [
        `A movimentação será registrada no dia ${normalizedDay}, ${intervalDescription}.`,
    ];

    if (normalizedStartDate) {
        parts.push(
            `O período começa em ${formatDate(
                normalizedStartDate,
            )}.`,
        );
    }

    if (normalizedEndDate) {
        parts.push(
            `A última ocorrência poderá acontecer até ${formatDate(
                normalizedEndDate,
            )}.`,
        );
    } else {
        parts.push(
            "A recorrência continuará sem uma data final definida.",
        );
    }

    return parts.join(" ");
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
                text-xs
                font-medium
                leading-5
                text-danger
            "
        >
            {message}
        </p>
    );
}

function RecurrenceFields({
    value = {},
    onChange,
    disabled = false,
    errors = {},
    title = "Configuração da recorrência",
    description = "Defina quando e com qual frequência essa movimentação deverá ser registrada.",
}) {
    const generatedId = useId();

    const startDate =
        normalizeDateInput(
            value.startDate,
        );

    const endDate =
        normalizeDateInput(
            value.endDate,
        );

    const dayOfMonth =
        normalizePositiveInteger(
            value.dayOfMonth,
            1,
        );

    const intervalMonths =
        normalizePositiveInteger(
            value.intervalMonths,
            1,
        );

    const hasEndDate =
        Boolean(endDate);

    const recurrenceSummary =
        useMemo(
            () =>
                buildRecurrenceSummary({
                    startDate,
                    endDate,
                    dayOfMonth,
                    intervalMonths,
                }),
            [
                startDate,
                endDate,
                dayOfMonth,
                intervalMonths,
            ],
        );

    function emitChange(
        fieldName,
        fieldValue,
    ) {
        onChange?.({
            ...value,
            [fieldName]:
                fieldValue,
        });
    }

    function handleStartDateChange(
        event,
    ) {
        const nextStartDate =
            event.target.value;

        const nextValue = {
            ...value,
            startDate:
                nextStartDate,
        };

        if (
            endDate &&
            nextStartDate &&
            endDate <
            nextStartDate
        ) {
            nextValue.endDate =
                nextStartDate;
        }

        onChange?.(nextValue);
    }

    function handleEndDateToggle(
        event,
    ) {
        const shouldHaveEndDate =
            event.target.checked;

        if (!shouldHaveEndDate) {
            emitChange(
                "endDate",
                null,
            );

            return;
        }

        emitChange(
            "endDate",
            startDate || "",
        );
    }

    function handleEndDateChange(
        event,
    ) {
        emitChange(
            "endDate",
            event.target.value,
        );
    }

    function handleDayChange(
        event,
    ) {
        emitChange(
            "dayOfMonth",
            Number(
                event.target.value,
            ),
        );
    }

    function handleIntervalChange(
        event,
    ) {
        emitChange(
            "intervalMonths",
            Number(
                event.target.value,
            ),
        );
    }

    const inputBaseClasses = `
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
        hover:border-border-strong
        focus:ring-4
        disabled:cursor-not-allowed
        disabled:opacity-60
    `;

    return (
        <section
            aria-labelledby={`${generatedId}-title`}
            className="
                overflow-hidden
                rounded-2xl
                border border-border
                bg-surface
            "
        >
            <header
                className="
                    flex items-start
                    gap-3
                    border-b border-border
                    bg-surface-muted/40
                    px-4 py-4
                    sm:px-5
                "
            >
                <div
                    className="
                        inline-flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border border-border
                        bg-background
                        text-primary
                    "
                >
                    <RiRepeat2Line
                        size={20}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <h3
                        id={`${generatedId}-title`}
                        className="
                            text-sm
                            font-semibold
                            text-foreground
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-muted-foreground
                        "
                    >
                        {description}
                    </p>
                </div>
            </header>

            <div
                className="
                    space-y-5
                    p-4
                    sm:p-5
                "
            >
                <div
                    className="
                        grid gap-4
                        sm:grid-cols-2
                    "
                >
                    <div>
                        <label
                            htmlFor={`${generatedId}-start-date`}
                            className="
                                mb-1.5
                                flex items-center
                                gap-2
                                text-xs
                                font-semibold
                                text-foreground
                            "
                        >
                            <RiCalendar2Line
                                size={15}
                                aria-hidden="true"
                                className="text-muted-foreground"
                            />

                            Início da recorrência
                        </label>

                        <input
                            id={`${generatedId}-start-date`}
                            type="date"
                            value={startDate}
                            onChange={
                                handleStartDateChange
                            }
                            disabled={
                                disabled
                            }
                            aria-invalid={
                                Boolean(
                                    errors.startDate,
                                )
                            }
                            className={`
                                ${inputBaseClasses}

                                ${errors.startDate
                                    ? "border-danger focus:border-danger focus:ring-danger/10"
                                    : "border-border focus:border-primary/50 focus:ring-primary/10"
                                }
                            `}
                        />

                        <FieldError
                            message={
                                errors.startDate
                            }
                        />
                    </div>

                    <div>
                        <label
                            htmlFor={`${generatedId}-day`}
                            className="
                                mb-1.5
                                flex items-center
                                gap-2
                                text-xs
                                font-semibold
                                text-foreground
                            "
                        >
                            <RiCalendarEventLine
                                size={15}
                                aria-hidden="true"
                                className="text-muted-foreground"
                            />

                            Dia da ocorrência
                        </label>

                        <select
                            id={`${generatedId}-day`}
                            value={dayOfMonth}
                            onChange={
                                handleDayChange
                            }
                            disabled={
                                disabled
                            }
                            aria-invalid={
                                Boolean(
                                    errors.dayOfMonth,
                                )
                            }
                            className={`
                                ${inputBaseClasses}

                                ${errors.dayOfMonth
                                    ? "border-danger focus:border-danger focus:ring-danger/10"
                                    : "border-border focus:border-primary/50 focus:ring-primary/10"
                                }
                            `}
                        >
                            {DAY_OPTIONS.map(
                                (day) => (
                                    <option
                                        key={
                                            day
                                        }
                                        value={
                                            day
                                        }
                                    >
                                        Dia{" "}
                                        {
                                            day
                                        }
                                    </option>
                                ),
                            )}
                        </select>

                        <FieldError
                            message={
                                errors.dayOfMonth
                            }
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor={`${generatedId}-interval`}
                        className="
                            mb-1.5
                            flex items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-foreground
                        "
                    >
                        <RiTimeLine
                            size={15}
                            aria-hidden="true"
                            className="text-muted-foreground"
                        />

                        Frequência
                    </label>

                    <select
                        id={`${generatedId}-interval`}
                        value={
                            intervalMonths
                        }
                        onChange={
                            handleIntervalChange
                        }
                        disabled={
                            disabled
                        }
                        aria-invalid={
                            Boolean(
                                errors.intervalMonths,
                            )
                        }
                        className={`
                            ${inputBaseClasses}

                            ${errors.intervalMonths
                                ? "border-danger focus:border-danger focus:ring-danger/10"
                                : "border-border focus:border-primary/50 focus:ring-primary/10"
                            }
                        `}
                    >
                        {INTERVAL_OPTIONS.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            ),
                        )}
                    </select>

                    <FieldError
                        message={
                            errors.intervalMonths
                        }
                    />
                </div>

                <div
                    className="
                        rounded-2xl
                        border border-border
                        bg-background
                        p-4
                    "
                >
                    <label
                        className="
                            flex cursor-pointer
                            items-start gap-3
                        "
                    >
                        <input
                            type="checkbox"
                            checked={
                                hasEndDate
                            }
                            onChange={
                                handleEndDateToggle
                            }
                            disabled={
                                disabled
                            }
                            className="
                                mt-0.5
                                size-4
                                shrink-0
                                rounded
                                border-border
                                text-primary
                                focus:ring-primary/20
                                disabled:cursor-not-allowed
                            "
                        />

                        <span className="min-w-0">
                            <span
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Definir uma data final
                            </span>

                            <span
                                className="
                                    mt-1
                                    block
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Quando desativado, a recorrência continuará até ser pausada ou excluída.
                            </span>
                        </span>
                    </label>

                    {hasEndDate && (
                        <div className="mt-4">
                            <label
                                htmlFor={`${generatedId}-end-date`}
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Fim da recorrência
                            </label>

                            <input
                                id={`${generatedId}-end-date`}
                                type="date"
                                min={
                                    startDate ||
                                    undefined
                                }
                                value={
                                    endDate
                                }
                                onChange={
                                    handleEndDateChange
                                }
                                disabled={
                                    disabled
                                }
                                aria-invalid={
                                    Boolean(
                                        errors.endDate,
                                    )
                                }
                                className={`
                                    ${inputBaseClasses}

                                    ${errors.endDate
                                        ? "border-danger focus:border-danger focus:ring-danger/10"
                                        : "border-border focus:border-primary/50 focus:ring-primary/10"
                                    }
                                `}
                            />

                            <FieldError
                                message={
                                    errors.endDate
                                }
                            />
                        </div>
                    )}
                </div>

                <div
                    className="
                        flex items-start
                        gap-3
                        rounded-2xl
                        border border-primary/15
                        bg-primary/5
                        p-4
                    "
                >
                    <RiInformationLine
                        size={19}
                        aria-hidden="true"
                        className="
                            mt-0.5
                            shrink-0
                            text-primary
                        "
                    />

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-semibold
                                text-foreground
                            "
                        >
                            Resumo da recorrência
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
                                recurrenceSummary
                            }
                        </p>
                    </div>
                </div>

                {dayOfMonth > 28 && (
                    <div
                        className="
                            flex items-start
                            gap-3
                            rounded-xl
                            border border-border
                            bg-surface-muted/40
                            px-3.5 py-3
                        "
                    >
                        <RiInformationLine
                            size={17}
                            aria-hidden="true"
                            className="
                                mt-0.5
                                shrink-0
                                text-muted-foreground
                            "
                        />

                        <p
                            className="
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            Nos meses que não possuem o dia{" "}
                            {dayOfMonth}, a movimentação será registrada no último dia disponível do mês.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RecurrenceFields;