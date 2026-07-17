import {
    RiPauseLine,
    RiPlayLine,
} from "react-icons/ri";

import {
    DataCard,
    DataCardBody,
    DataCardField,
    DataCardFooter,
    DataCardHeader,
} from "../data-display/index.js";

import RecurrenceFrequency from "./RecurrenceFrequency.jsx";
import RecurrencePeriod from "./RecurrencePeriod.jsx";
import RecurrenceStatusBadge from "./RecurrenceStatusBadge.jsx";
import TransactionActions from "./TransactionActions.jsx";
import TransactionAmount from "./TransactionAmount.jsx";
import TransactionTypeMark from "./TransactionTypeMark.jsx";
import {
    normalizeRecurrenceStatus,
} from "./transactionUtils.js";

function RecurringTransactionCard({
    recurrence,
    selected = false,
    onClick,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
    deleting = false,
    className = "",
}) {
    const status = normalizeRecurrenceStatus(recurrence?.status, recurrence);
    const paused = status === "PAUSED";

    return (
        <DataCard
            selected={selected}
            interactive={Boolean(onClick)}
            onClick={onClick ? () => onClick(recurrence) : undefined}
            className={className}
        >
            <DataCardHeader
                leading={<TransactionTypeMark type={recurrence?.type} />}
                title={recurrence?.description || "Recorrência sem descrição"}
                description={recurrence?.category || "Movimentação recorrente"}
                value={
                    <TransactionAmount
                        amount={recurrence?.amount}
                        amountCents={recurrence?.amountCents}
                        type={recurrence?.type}
                        size="sm"
                    />
                }
                actions={
                    <TransactionActions
                        transaction={recurrence}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        deleting={deleting}
                        additionalActions={
                            onToggleStatus
                                ? [{
                                    id: "toggle-status",
                                    label: paused ? "Reativar" : "Pausar",
                                    icon: paused
                                        ? <RiPlayLine size={16} aria-hidden="true" />
                                        : <RiPauseLine size={16} aria-hidden="true" />,
                                    onSelect: () => onToggleStatus(recurrence, paused ? "ACTIVE" : "PAUSED"),
                                    separatorBefore: true,
                                }]
                                : []
                        }
                    />
                }
            />

            <div className="mt-3">
                <RecurrenceStatusBadge
                    status={status}
                    recurrence={recurrence}
                />
            </div>

            <DataCardBody className="grid-cols-1 sm:grid-cols-2">
                <DataCardField
                    label="Frequência"
                    value={
                        <RecurrenceFrequency
                            intervalMonths={recurrence?.intervalMonths}
                            dayOfMonth={recurrence?.dayOfMonth}
                            compact
                        />
                    }
                />

                <DataCardField
                    label="Período"
                    value={
                        <RecurrencePeriod
                            startDate={recurrence?.startDate}
                            endDate={recurrence?.endDate}
                            compact
                        />
                    }
                />
            </DataCardBody>

            {recurrence?.notes ? (
                <DataCardFooter>
                    <p className="line-clamp-2 text-caption text-muted-foreground">
                        {recurrence.notes}
                    </p>
                </DataCardFooter>
            ) : null}
        </DataCard>
    );
}

export default RecurringTransactionCard;
