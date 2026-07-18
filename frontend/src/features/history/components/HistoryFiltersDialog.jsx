import { useMemo } from "react";

import {
    RotateCcw,
    X,
} from "lucide-react";
import { motion } from "motion/react";

import DatePicker from "../../../components/forms/DatePicker.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import {
    dateInputToDate,
    toDateInputValue,
} from "../../transactions/utils/transactionFormatters.js";

const CONTROL_CLASSNAME = "h-11 min-h-11 w-full min-w-0";

const MODAL_TRANSITION = {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1],
};

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

function Field({
    label,
    children,
    className = "",
}) {
    return (
        <div className={`min-w-0 ${className}`}>
            <span className="mb-2 block text-sm font-semibold text-foreground">
                {label}
            </span>

            {children}
        </div>
    );
}

function HistoryFiltersDialog({
    open,
    onClose,
    filters,
    onChange,
    onReset,
    tags = [],
}) {
    const currentYear = new Date().getFullYear();

    const years = useMemo(() => {
        const values = Array.from(
            { length: 18 },
            (_, index) => currentYear + 2 - index,
        );

        const selectedYear = Number(filters.year);

        if (
            selectedYear
            && !values.includes(selectedYear)
        ) {
            values.push(selectedYear);
        }

        return values
            .filter((year) => year >= 1900 && year <= 2100)
            .sort((a, b) => b - a);
    }, [
        currentYear,
        filters.year,
    ]);

    function handleClose() {
        onClose?.();
    }

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
                    w-[calc(100vw-1.5rem)]
                    max-w-xl
                    overflow-visible
                    border-0
                    bg-transparent
                    p-0
                    shadow-none
                    [&>button]:hidden
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
                    transition={{
                        duration: 0.3,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                    }}
                    className="
                        flex max-h-[calc(100dvh-1.5rem)]
                        min-h-0 w-full
                        flex-col
                        overflow-hidden
                        rounded-card
                        border border-border
                        bg-surface
                        shadow-dialog
                    "
                >
                    <header
                        className="
                            flex w-full shrink-0
                            items-start justify-between
                            gap-4
                            border-b border-border
                            px-5 py-4
                            sm:px-6
                        "
                    >
                        <div className="min-w-0 flex-1">
                            <DialogHeader>
                                <DialogTitle>
                                    Filtros do histórico
                                </DialogTitle>

                                <DialogDescription>
                                    Refine o período, o tipo de movimentação e a tag exibidos nos totais, gráficos e lançamentos.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Fechar filtros"
                            title="Fechar"
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
                            "
                        >
                            <X
                                aria-hidden="true"
                                className="size-4"
                            />
                        </button>
                    </header>
                    <div
                        className="
                            min-h-0 flex-1
                            overflow-y-auto
                            overscroll-contain
                            px-5 py-5 pb-8
                            [scrollbar-width:none]
                            [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:hidden
                            sm:px-6
                        "
                    >
                        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                            <Field
                                label="Período"
                                className="sm:col-span-2"
                            >
                                <Select
                                    value={filters.mode}
                                    onValueChange={(mode) => {
                                        onChange({
                                            mode,
                                        });
                                    }}
                                >
                                    <SelectTrigger className={CONTROL_CLASSNAME}>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="MONTH">
                                            Mês específico
                                        </SelectItem>

                                        <SelectItem value="YEAR">
                                            Ano completo
                                        </SelectItem>

                                        <SelectItem value="RANGE">
                                            Intervalo personalizado
                                        </SelectItem>

                                        <SelectItem value="ALL">
                                            Todo o histórico
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {filters.mode === "MONTH" && (
                                <Field label="Mês">
                                    <Select
                                        value={String(filters.month)}
                                        onValueChange={(month) => {
                                            onChange({
                                                month: Number(month),
                                            });
                                        }}
                                    >
                                        <SelectTrigger className={CONTROL_CLASSNAME}>
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {months.map((month, index) => (
                                                <SelectItem
                                                    key={month}
                                                    value={String(index + 1)}
                                                >
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}

                            {(filters.mode === "MONTH"
                                || filters.mode === "YEAR") && (
                                    <Field
                                        label="Ano"
                                        className={
                                            filters.mode === "YEAR"
                                                ? "sm:col-span-2"
                                                : ""
                                        }
                                    >
                                        <Select
                                            value={String(filters.year)}
                                            onValueChange={(year) => {
                                                onChange({
                                                    year: Number(year),
                                                });
                                            }}
                                        >
                                            <SelectTrigger className={CONTROL_CLASSNAME}>
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={String(year)}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}

                            {filters.mode === "RANGE" && (
                                <>
                                    <Field label="Data inicial">
                                        <DatePicker
                                            value={dateInputToDate(
                                                filters.startDate,
                                            )}
                                            onChange={(date) => {
                                                onChange({
                                                    startDate:
                                                        toDateInputValue(date),
                                                });
                                            }}
                                            placeholder="Início do período"
                                            className="w-full min-w-0"
                                        />
                                    </Field>

                                    <Field label="Data final">
                                        <DatePicker
                                            value={dateInputToDate(
                                                filters.endDate,
                                            )}
                                            onChange={(date) => {
                                                onChange({
                                                    endDate:
                                                        toDateInputValue(date),
                                                });
                                            }}
                                            placeholder="Fim do período"
                                            className="w-full min-w-0"
                                        />
                                    </Field>
                                </>
                            )}

                            <Field label="Tipo de movimentação">
                                <Select
                                    value={filters.type}
                                    onValueChange={(type) => {
                                        onChange({
                                            type,
                                        });
                                    }}
                                >
                                    <SelectTrigger className={CONTROL_CLASSNAME}>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Receitas e despesas
                                        </SelectItem>

                                        <SelectItem value="INCOME">
                                            Somente receitas
                                        </SelectItem>

                                        <SelectItem value="EXPENSE">
                                            Somente despesas
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Tag">
                                <Select
                                    value={
                                        filters.tagId
                                            ? String(filters.tagId)
                                            : "ALL"
                                    }
                                    onValueChange={(tagId) => {
                                        onChange({
                                            tagId: tagId === "ALL"
                                                ? ""
                                                : Number(tagId),
                                        });
                                    }}
                                >
                                    <SelectTrigger className={CONTROL_CLASSNAME}>
                                        <SelectValue placeholder="Todas as tags" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Todas as tags
                                        </SelectItem>

                                        {tags.map((tag) => (
                                            <SelectItem
                                                key={tag.id}
                                                value={String(tag.id)}
                                            >
                                                {tag.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </div>

                    <footer
                        className="
                            grid shrink-0
                            grid-cols-2 gap-2
                            border-t border-border
                            px-5 py-4
                            sm:px-6
                            md:flex
                            md:items-center
                            md:justify-end
                        "
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onReset}
                            className="
                                w-full
                                border border-border
                                bg-surface
                                text-foreground
                                shadow-none
                                hover:border-primary/30
                                hover:bg-primary-soft
                                hover:text-primary
                                md:w-auto
                            "
                        >
                            <RotateCcw
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />

                            <span className="truncate sm:hidden">
                                Restaurar
                            </span>

                            <span className="hidden truncate sm:inline">
                                Restaurar
                            </span>
                        </Button>

                        <Button
                            type="button"
                            onClick={handleClose}
                            className="
                                min-w-0
                                w-full
                                bg-primary
                                text-primary-foreground
                                hover:bg-primary-hover
                                hover:text-primary-foreground
                                sm:w-auto
                            "
                        >
                            <span className="truncate">
                                Aplicar filtros
                            </span>
                        </Button>
                    </footer>
                </motion.section>
            </DialogContent>
        </Dialog>
    );
}

export default HistoryFiltersDialog;