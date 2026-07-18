import { useMemo } from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";
import {
    CalendarRange,
    RotateCcw,
    X,
} from "lucide-react";

import DatePicker from "../../../components/forms/DatePicker.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
} from "../utils/transactionFormatters.js";

const MONTHS = [
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

const FIELD_ANIMATION = {
    initial: {
        opacity: 0,
        y: 8,
        scale: 0.99,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    exit: {
        opacity: 0,
        y: -5,
        scale: 0.99,
    },
    transition: {
        duration: 0.2,
        ease: [
            0.22,
            1,
            0.36,
            1,
        ],
    },
};

function FieldLabel({ children }) {
    return (
        <span className="mb-2 block text-sm font-semibold text-foreground">
            {children}
        </span>
    );
}

function TagOption({ tag }) {
    return (
        <span className="flex min-w-0 items-center gap-2">
            <span
                aria-hidden="true"
                className="
                    size-2
                    shrink-0
                    rounded-full
                "
                style={{
                    backgroundColor: tag?.color || "#64748B",
                }}
            />

            <span className="truncate">
                {tag?.name}
            </span>
        </span>
    );
}

function TransactionFiltersDialog({
    open,
    onClose,
    filters,
    onChange,
    onReset,
    tags = [],
    showPeriod = true,
}) {
    const currentYear = new Date().getFullYear();

    const years = useMemo(
        () => Array.from(
            {
                length: 12,
            },
            (_, index) => currentYear + 2 - index,
        ),
        [currentYear],
    );

    const description = showPeriod
        ? "Escolha o período e uma tag para refinar a listagem."
        : "Escolha uma tag para refinar a lista de recorrências.";

    const information = showPeriod
        ? "Os totais, a paginação e a lista respeitam todos os filtros selecionados."
        : "A pesquisa e a lista de recorrências respeitam a tag selecionada.";

    function closeDialog() {
        onClose?.();
    }

    function handleDialogOpenChange(nextOpen) {
        if (!nextOpen) {
            closeDialog();
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleDialogOpenChange}
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
                            <DialogTitle>
                                Filtrar movimentações
                            </DialogTitle>

                            <DialogDescription className="mt-1">
                                {description}
                            </DialogDescription>
                        </div>

                        <button
                            type="button"
                            onClick={closeDialog}
                            aria-label="Fechar filtros"
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
                        <div className="grid gap-4 sm:grid-cols-2">
                            {showPeriod && (
                                <div className="sm:col-span-2">
                                    <FieldLabel>
                                        Período
                                    </FieldLabel>

                                    <Select
                                        value={filters.mode}
                                        onValueChange={(mode) => {
                                            onChange({
                                                mode,
                                            });
                                        }}
                                    >
                                        <SelectTrigger>
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
                                </div>
                            )}

                            <AnimatePresence
                                initial={false}
                                mode="popLayout"
                            >
                                {showPeriod && filters.mode === "MONTH" && (
                                    <motion.div
                                        key="month-filter"
                                        layout
                                        {...FIELD_ANIMATION}
                                    >
                                        <FieldLabel>
                                            Mês
                                        </FieldLabel>

                                        <Select
                                            value={String(filters.month)}
                                            onValueChange={(month) => {
                                                onChange({
                                                    month: Number(month),
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {MONTHS.map((month, index) => (
                                                    <SelectItem
                                                        key={month}
                                                        value={String(index + 1)}
                                                    >
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>
                                )}

                                {showPeriod
                                    && (
                                        filters.mode === "MONTH"
                                        || filters.mode === "YEAR"
                                    ) && (
                                        <motion.div
                                            key="year-filter"
                                            layout
                                            {...FIELD_ANIMATION}
                                        >
                                            <FieldLabel>
                                                Ano
                                            </FieldLabel>

                                            <Select
                                                value={String(filters.year)}
                                                onValueChange={(year) => {
                                                    onChange({
                                                        year: Number(year),
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
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
                                        </motion.div>
                                    )}

                                {showPeriod && filters.mode === "RANGE" && (
                                    <motion.div
                                        key="range-filter"
                                        layout
                                        {...FIELD_ANIMATION}
                                        className="
                                            grid gap-4
                                            sm:col-span-2
                                            sm:grid-cols-2
                                        "
                                    >
                                        <div>
                                            <FieldLabel>
                                                Data inicial
                                            </FieldLabel>

                                            <DatePicker
                                                value={dateInputToDate(
                                                    filters.startDate,
                                                )}
                                                onChange={(date) => {
                                                    onChange({
                                                        startDate: toDateInputValue(
                                                            date,
                                                        ),
                                                    });
                                                }}
                                                placeholder="Início do período"
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel>
                                                Data final
                                            </FieldLabel>

                                            <DatePicker
                                                value={dateInputToDate(
                                                    filters.endDate,
                                                )}
                                                onChange={(date) => {
                                                    onChange({
                                                        endDate: toDateInputValue(
                                                            date,
                                                        ),
                                                    });
                                                }}
                                                placeholder="Fim do período"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                layout
                                className="sm:col-span-2"
                                transition={{
                                    duration: 0.2,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                }}
                            >
                                <FieldLabel>
                                    Tag
                                </FieldLabel>

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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas as tags" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className="
                                                        size-2
                                                        rounded-full
                                                        bg-subtle-foreground
                                                    "
                                                />

                                                Todas as tags
                                            </span>
                                        </SelectItem>

                                        {tags.map((tag) => (
                                            <SelectItem
                                                key={tag.id}
                                                value={String(tag.id)}
                                            >
                                                <TagOption tag={tag} />
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
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
                                className="size-4"
                            />

                            Restaurar
                        </Button>

                        <Button
                            type="button"
                            onClick={closeDialog}
                            className="
                                w-full
                                bg-primary
                                text-primary-foreground
                                hover:bg-primary-hover
                                md:w-auto
                            "
                        >
                            Aplicar filtros
                        </Button>
                    </footer>
                </motion.section>
            </DialogContent>
        </Dialog>
    );
}

export default TransactionFiltersDialog;