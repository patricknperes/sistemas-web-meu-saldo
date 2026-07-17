import {
    RiArrowDownLine,
    RiArrowUpLine,
    RiExchangeFundsLine,
    RiWallet3Line,
} from "react-icons/ri";

import FinancialSummary from "../finance/FinancialSummary.jsx";

function TransactionSummary({
    title = "Resumo das movimentações",
    description,
    openingBalance,
    income = 0,
    expense = 0,
    endingBalance,
    count,
    loading = false,
    columns = 4,
    className = "",
}) {
    const computedEndingBalance = endingBalance ?? (
        Number(openingBalance || 0) + Number(income || 0) - Math.abs(Number(expense || 0))
    );

    const items = [
        openingBalance !== undefined
            ? {
                id: "opening",
                label: "Saldo inicial",
                value: openingBalance,
                icon: RiWallet3Line,
                tone: "neutral",
            }
            : null,
        {
            id: "income",
            label: "Entradas",
            value: Math.abs(Number(income || 0)),
            icon: RiArrowUpLine,
            tone: "positive",
        },
        {
            id: "expense",
            label: "Saídas",
            value: -Math.abs(Number(expense || 0)),
            icon: RiArrowDownLine,
            tone: "negative",
        },
        {
            id: "balance",
            label: "Resultado",
            value: computedEndingBalance,
            icon: RiExchangeFundsLine,
            tone: computedEndingBalance >= 0 ? "primary" : "negative",
        },
    ].filter(Boolean);

    return (
        <FinancialSummary
            title={title}
            description={
                description || (
                    count !== undefined
                        ? `${count} movimentações consideradas no período selecionado.`
                        : "Valores consolidados para o período selecionado."
                )
            }
            items={items}
            columns={Math.min(columns, items.length)}
            loading={loading}
            className={className}
        />
    );
}

export default TransactionSummary;
