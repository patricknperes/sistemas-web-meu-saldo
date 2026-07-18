import { useMemo } from "react";

import { CalendarRange, RotateCcw } from "lucide-react";

import DatePicker from "../../../components/forms/DatePicker.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { dateInputToDate, toDateInputValue } from "../utils/transactionFormatters.js";

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function FieldLabel({ children }) {
    return <span className="mb-2 block text-sm font-semibold text-foreground">{children}</span>;
}

function TransactionFiltersDialog({ open, onClose, filters, onChange, onReset, tags = [], showPeriod = true }) {
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => Array.from({ length: 12 }, (_, index) => currentYear + 2 - index), [currentYear]);

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Filtrar movimentações</DialogTitle>
                    <DialogDescription>{showPeriod ? "Escolha o período e uma tag para refinar a listagem." : "Escolha uma tag para refinar a lista de recorrências."}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                    {showPeriod && <div className="sm:col-span-2">
                        <FieldLabel>Período</FieldLabel>
                        <Select value={filters.mode} onValueChange={(mode) => onChange({ mode })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MONTH">Mês específico</SelectItem>
                                <SelectItem value="YEAR">Ano completo</SelectItem>
                                <SelectItem value="RANGE">Intervalo personalizado</SelectItem>
                                <SelectItem value="ALL">Todo o histórico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>}

                    {showPeriod && filters.mode === "MONTH" && (
                        <div>
                            <FieldLabel>Mês</FieldLabel>
                            <Select value={String(filters.month)} onValueChange={(month) => onChange({ month: Number(month) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((month, index) => <SelectItem key={month} value={String(index + 1)}>{month}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {showPeriod && (filters.mode === "MONTH" || filters.mode === "YEAR") && (
                        <div>
                            <FieldLabel>Ano</FieldLabel>
                            <Select value={String(filters.year)} onValueChange={(year) => onChange({ year: Number(year) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {showPeriod && filters.mode === "RANGE" && (
                        <>
                            <div>
                                <FieldLabel>Data inicial</FieldLabel>
                                <DatePicker
                                    value={dateInputToDate(filters.startDate)}
                                    onChange={(date) => onChange({ startDate: toDateInputValue(date) })}
                                    placeholder="Início do período"
                                />
                            </div>
                            <div>
                                <FieldLabel>Data final</FieldLabel>
                                <DatePicker
                                    value={dateInputToDate(filters.endDate)}
                                    onChange={(date) => onChange({ endDate: toDateInputValue(date) })}
                                    placeholder="Fim do período"
                                />
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2">
                        <FieldLabel>Tag</FieldLabel>
                        <Select value={filters.tagId ? String(filters.tagId) : "ALL"} onValueChange={(tagId) => onChange({ tagId: tagId === "ALL" ? "" : Number(tagId) })}>
                            <SelectTrigger><SelectValue placeholder="Todas as tags" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas as tags</SelectItem>
                                {tags.map((tag) => <SelectItem key={tag.id} value={String(tag.id)}>{tag.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-card-sm border border-info/15 bg-info-muted p-3 text-sm text-info">
                    <CalendarRange className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p className="leading-5">{showPeriod ? "Os totais, a paginação e a lista respeitam todos os filtros selecionados." : "A pesquisa e a lista de recorrências respeitam a tag selecionada."}</p>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onReset}><RotateCcw className="size-4" aria-hidden="true" />Restaurar</Button>
                    <Button onClick={onClose}>Aplicar filtros</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TransactionFiltersDialog;
