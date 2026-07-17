import {
    RiCalendarLine,
    RiFileTextLine,
    RiPriceTag3Line,
    RiRepeat2Line,
} from "react-icons/ri";

import CurrencyValue from "../finance/CurrencyValue.jsx";
import TagGroup from "../tags/TagGroup.jsx";
import Surface from "../surfaces/Surface.jsx";

function formatDate(value) {
    if (!value) {
        return "Não informada";
    }

    const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

function recurrenceLabel(recurrence = {}) {
    const interval = Number(recurrence.intervalMonths) || 1;
    const intervalText = interval === 1
        ? "mensalmente"
        : interval === 12
          ? "anualmente"
          : `a cada ${interval} meses`;

    return `Dia ${Number(recurrence.dayOfMonth) || 1}, ${intervalText}`;
}

function ReviewItem({
    icon: Icon,
    label,
    value,
    children,
}) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                <Icon size={16} aria-hidden="true" />
            </span>

            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-overline text-subtle-foreground">
                    {label}
                </p>
                {children || (
                    <p className="mt-1 break-words text-body-sm font-semibold text-foreground">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

function TransactionReview({
    value = {},
    tags = [],
    title = "Revise antes de salvar",
    description = "Confira os dados. O valor só será contabilizado conforme a data definida.",
    className = "",
}) {
    const recurring = value.kind === "recurring";
    const type = value.type === "income" ? "income" : "expense";

    return (
        <Surface variant="outlined" padding="none" className={`overflow-hidden ${className}`}>
            <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-card-title font-bold text-foreground">
                        {title}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                        {description}
                    </p>
                </div>

                <CurrencyValue
                    value={(Number(value.amount) || 0) * (type === "income" ? 1 : -1)}
                    tone={type === "income" ? "positive" : "negative"}
                    showPositiveSign={type === "income"}
                    size="lg"
                />
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
                <ReviewItem
                    icon={RiFileTextLine}
                    label="Descrição"
                    value={value.description || "Sem descrição"}
                />

                <ReviewItem
                    icon={RiCalendarLine}
                    label={recurring ? "Início" : "Data"}
                    value={formatDate(recurring ? value.recurrence?.startDate : value.date)}
                />

                <ReviewItem
                    icon={RiRepeat2Line}
                    label="Tipo de lançamento"
                    value={recurring ? recurrenceLabel(value.recurrence) : "Movimentação única"}
                />

                <ReviewItem icon={RiPriceTag3Line} label="Tags">
                    {tags.length > 0 ? (
                        <TagGroup tags={tags} maxVisible={3} size="sm" className="mt-1" />
                    ) : (
                        <p className="mt-1 text-body-sm text-muted-foreground">
                            Nenhuma tag selecionada
                        </p>
                    )}
                </ReviewItem>
            </div>

            {value.notes ? (
                <div className="border-t border-border-subtle px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-overline text-subtle-foreground">
                        Observações
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-body-sm text-muted-foreground">
                        {value.notes}
                    </p>
                </div>
            ) : null}
        </Surface>
    );
}

export default TransactionReview;
