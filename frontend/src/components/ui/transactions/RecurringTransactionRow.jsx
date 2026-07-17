import {
    RiPauseLine,
    RiPlayLine,
} from "react-icons/ri";

import {
    DataTableCell,
    DataTableRow,
} from "../data-display/index.js";

import RecurrenceFrequency from "./RecurrenceFrequency.jsx";
import RecurrencePeriod from "./RecurrencePeriod.jsx";
import RecurrenceStatusBadge from "./RecurrenceStatusBadge.jsx";
import TransactionActions from "./TransactionActions.jsx";
import TransactionAmount from "./TransactionAmount.jsx";
import TransactionDescription from "./TransactionDescription.jsx";
import {
    normalizeRecurrenceStatus,
} from "./transactionUtils.js";

function RecurringTransactionRow({
    recurrence,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
    deleting = false,
    selected = false,
    onClick,
    className = "",
}) {
    const status = normalizeRecurrenceStatus(recurrence?.status, recurrence);
    const paused = status === "PAUSED";

    return (
        <DataTableRow
            selected={selected}
            interactive={Boolean(onClick)}
            onClick={onClick ? () => onClick(recurrence) : undefined}
            className={className}
        >
            <DataTableCell className="min-w-64">
                <TransactionDescription
                    transaction={recurrence}
                    showCategory
                    showTags
                    compact
                    generatedByRecurrence={false}
                />
            </DataTableCell>

            <DataTableCell className="min-w-44">
                <RecurrenceFrequency
                    intervalMonths={recurrence?.intervalMonths}
                    dayOfMonth={recurrence?.dayOfMonth}
                    compact
                />
            </DataTableCell>

            <DataTableCell className="min-w-52">
                <RecurrencePeriod
                    startDate={recurrence?.startDate}
                    endDate={recurrence?.endDate}
                    compact
                />
            </DataTableCell>

            <DataTableCell>
                <RecurrenceStatusBadge
                    status={status}
                    recurrence={recurrence}
                />
            </DataTableCell>

            <DataTableCell align="right" numeric className="whitespace-nowrap">
                <TransactionAmount
                    amount={recurrence?.amount}
                    amountCents={recurrence?.amountCents}
                    type={recurrence?.type}
                    size="sm"
                />
            </DataTableCell>

            <DataTableCell align="right" className="w-14">
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
            </DataTableCell>
        </DataTableRow>
    );
}

export default RecurringTransactionRow;
