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
import { dateInputToDate, toDateInputValue } from "../../transactions/utils/transactionFormatters.js";

const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Field({ label, children, className = "" }) {
    return (
        <div className={className}>
            <span className="mb-2 block text-sm font-semibold text-foreground">{label}</span>
            {children}
        </div>
    );
}

function HistoryFiltersDialog({ open, onClose, filters, onChange, onReset, tags = [] }) {
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
        const values = Array.from({ length: 18 }, (_, index) => currentYear + 2 - index);
        if (!values.includes(Number(filters.year))) values.push(Number(filters.year));
        return values.filter((year) => year >= 1900 && year <= 2100).sort((a, b) => b - a);
    }, [currentYear, filters.year]);

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Filtros do histórico</DialogTitle>
                    <DialogDescription>Refine o período, o tipo de movimentação e a tag exibidos nos totais, gráficos e lançamentos.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Período" className="sm:col-span-2">
                        <Select value={filters.mode} onValueChange={(mode) => onChange({ mode })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MONTH">Mês específico</SelectItem>
                                <SelectItem value="YEAR">Ano completo</SelectItem>
                                <SelectItem value="RANGE">Intervalo personalizado</SelectItem>
                                <SelectItem value="ALL">Todo o histórico</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    {filters.mode === "MONTH" && (
                        <Field label="Mês">
                            <Select value={String(filters.month)} onValueChange={(month) => onChange({ month: Number(month) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {months.map((month, index) => <SelectItem key={month} value={String(index + 1)}>{month}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    {(filters.mode === "MONTH" || filters.mode === "YEAR") && (
                        <Field label="Ano" className={filters.mode === "YEAR" ? "sm:col-span-2" : ""}>
                            <Select value={String(filters.year)} onValueChange={(year) => onChange({ year: Number(year) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    {filters.mode === "RANGE" && (
                        <>
                            <Field label="Data inicial">
                                <DatePicker
                                    value={dateInputToDate(filters.startDate)}
                                    onChange={(date) => onChange({ startDate: toDateInputValue(date) })}
                                    placeholder="Início do período"
                                />
                            </Field>
                            <Field label="Data final">
                                <DatePicker
                                    value={dateInputToDate(filters.endDate)}
                                    onChange={(date) => onChange({ endDate: toDateInputValue(date) })}
                                    placeholder="Fim do período"
                                />
                            </Field>
                        </>
                    )}

                    <Field label="Tipo de movimentação">
                        <Select value={filters.type} onValueChange={(type) => onChange({ type })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Receitas e despesas</SelectItem>
                                <SelectItem value="INCOME">Somente receitas</SelectItem>
                                <SelectItem value="EXPENSE">Somente despesas</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Tag">
                        <Select value={filters.tagId ? String(filters.tagId) : "ALL"} onValueChange={(tagId) => onChange({ tagId: tagId === "ALL" ? "" : Number(tagId) })}>
                            <SelectTrigger><SelectValue placeholder="Todas as tags" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas as tags</SelectItem>
                                {tags.map((tag) => <SelectItem key={tag.id} value={String(tag.id)}>{tag.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <div className="flex items-start gap-3 rounded-card-sm border border-info/15 bg-info-muted p-3 text-sm text-info">
                    <CalendarRange className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p className="leading-5">Os indicadores, gráficos, categorias e a paginação sempre utilizam os mesmos filtros.</p>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onReset}><RotateCcw className="size-4" aria-hidden="true" />Restaurar padrão</Button>
                    <Button onClick={onClose}>Aplicar filtros</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default HistoryFiltersDialog;
