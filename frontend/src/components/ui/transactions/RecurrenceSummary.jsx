import {
    RiCalendarCheckLine,
    RiInformationLine,
} from "react-icons/ri";

import Surface from "../surfaces/Surface.jsx";

import RecurrenceFrequency from "./RecurrenceFrequency.jsx";
import RecurrencePeriod from "./RecurrencePeriod.jsx";
import RecurrenceStatusBadge from "./RecurrenceStatusBadge.jsx";
import TransactionAmount from "./TransactionAmount.jsx";
import {
    formatTransactionDate,
    mergeClasses,
} from "./transactionUtils.js";

function RecurrenceSummary({
    recurrence = {},
    title = "Configuração da recorrência",
    description = "A movimentação será criada somente quando a data programada chegar.",
    showAmount = true,
    className = "",
}) {
    return (
        <Surface
            variant="subtle"
            padding="lg"
            className={mergeClasses("min-w-0", className)}
        >
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary-muted text-primary">
                        <RiCalendarCheckLine size={19} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <h3 className="text-card-title font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    {showAmount && (recurrence.amount !== undefined || recurrence.amountCents !== undefined) ? (
                        <TransactionAmount
                            amount={recurrence.amount}
                            amountCents={recurrence.amountCents}
                            type={recurrence.type}
                            size="md"
                        />
                    ) : null}

                    <RecurrenceStatusBadge
                        status={recurrence.status}
                        recurrence={recurrence}
                    />
                </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-border-subtle pt-5 sm:grid-cols-2">
                <RecurrenceFrequency
                    intervalMonths={recurrence.intervalMonths}
                    dayOfMonth={recurrence.dayOfMonth}
                />
                <RecurrencePeriod
                    startDate={recurrence.startDate}
                    endDate={recurrence.endDate}
                />
            </div>

            {recurrence.nextOccurrenceDate ? (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-info/15 bg-info-muted px-3 py-2.5 text-caption text-info-strong">
                    <RiInformationLine size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>
                        Próxima ocorrência prevista para <strong>{formatTransactionDate(recurrence.nextOccurrenceDate, { style: "long" })}</strong>.
                    </span>
                </div>
            ) : null}
        </Surface>
    );
}

export default RecurrenceSummary;
