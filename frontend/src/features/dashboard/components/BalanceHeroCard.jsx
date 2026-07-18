import {
    ArrowDownRight,
    ArrowUpRight,
    Minus,
    WalletCards,
} from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import { getFinancialIndicators } from "../utils/dashboardFormatters.js";

function BalanceHeroCard({
    summary,
    periodLabel,
}) {
    const balance = Number(summary.balanceCents) || 0;
    const indicators = getFinancialIndicators(summary);

    const isPositive = balance > 0;
    const isNegative = balance < 0;

    const StatusIcon = isPositive
        ? ArrowUpRight
        : isNegative
            ? ArrowDownRight
            : Minus;

    const statusLabel = isPositive
        ? "Saldo positivo"
        : isNegative
            ? "Saldo negativo"
            : "Saldo equilibrado";

    const statusVariant = isPositive
        ? "success"
        : isNegative
            ? "danger"
            : "neutral";

    const savingsRate = Number.isFinite(indicators.savingsRate)
        ? `${indicators.savingsRate.toFixed(1)}%`
        : "0,0%";

    return (
        <article
            className="
                relative
                min-h-64
                overflow-hidden
                rounded-[1.75rem]
                border border-white/10
                bg-[linear-gradient(145deg,var(--app-primary),var(--app-primary-active)_58%,var(--app-secondary))]
                p-6
                text-white
                shadow-[0_24px_70px_var(--app-glow-primary)]
                sm:p-7
                lg:col-span-7
            "
        >
            <div
                aria-hidden="true"
                className="
                    absolute
                    -right-20
                    -top-24
                    size-72
                    rounded-full
                    bg-white/14
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    -bottom-36
                    -left-20
                    size-80
                    rounded-full
                    bg-blue-300/20
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    bottom-8
                    right-12
                    size-40
                    rounded-full
                    bg-sky-300/12
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-0
                    bg-[linear-gradient(115deg,transparent_20%,rgb(255_255_255_/_6%)_48%,transparent_72%)]
                "
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-1/2
                    bg-[linear-gradient(to_top,rgb(2_6_23_/_18%),transparent)]
                "
            />

            <div
                className="
                    relative
                    flex
                    h-full
                    min-w-0
                    flex-col
                    justify-between
                    gap-8
                "
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/75">
                            Saldo disponível
                        </p>

                        <p className="mt-1 truncate text-xs text-white/55">
                            {periodLabel}
                        </p>
                    </div>

                    <span
                        className="
                            flex
                            size-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border border-white/15
                            bg-white/10
                            shadow-[inset_0_1px_0_rgb(255_255_255_/_12%)]
                            backdrop-blur-xl
                        "
                    >
                        <WalletCards
                            aria-hidden="true"
                            className="size-5"
                            strokeWidth={1.8}
                        />
                    </span>
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            truncate
                            font-mono
                            text-4xl
                            font-bold
                            tracking-[-0.055em]
                            sm:text-5xl
                        "
                    >
                        {formatCurrency(balance)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge
                            variant={statusVariant}
                            className="
                                border-white/10
                                bg-white/12
                                text-white
                                shadow-[inset_0_1px_0_rgb(255_255_255_/_10%)]
                                backdrop-blur-xl
                            "
                        >
                            <StatusIcon
                                aria-hidden="true"
                                className="size-3.5"
                            />

                            {statusLabel}
                        </Badge>

                        <span className="text-xs text-white/60">
                            {summary.transactionCount ?? 0} movimentações no período
                        </span>
                    </div>
                </div>

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        border-t border-white/12
                        pt-5
                    "
                >
                    <div className="min-w-0">
                        <p className="text-xs text-white/55">
                            Taxa de economia
                        </p>

                        <p
                            className="
                                mt-1
                                truncate
                                font-mono
                                text-lg
                                font-bold
                            "
                        >
                            {savingsRate}
                        </p>
                    </div>

                    <div
                        className="
                            min-w-0
                            border-l border-white/12
                            pl-4
                        "
                    >
                        <p className="text-xs text-white/55">
                            Média por lançamento
                        </p>

                        <p
                            className="
                                mt-1
                                truncate
                                font-mono
                                text-lg
                                font-bold
                            "
                        >
                            {formatCurrency(
                                indicators.averageTransactionCents,
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default BalanceHeroCard;