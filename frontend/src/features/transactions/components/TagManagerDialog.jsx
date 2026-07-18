import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, LoaderCircle, Plus, Tag, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import { tagService } from "../../../services/tagService.js";
import { transactionKeys } from "../api/transactionQueries.js";
import { tagSchema } from "../schemas/transactionSchemas.js";
import { getApiErrorMessage } from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";

const COLOR_OPTIONS = [
    "#0F766E", "#0891B2", "#1570EF", "#6D5DFB", "#9333EA",
    "#DB2777", "#D92D20", "#DC6803", "#179B62", "#64748B",
];

const EMPTY_TAG = { name: "", color: "#0F766E", scope: "BOTH" };

function TagManagerDialog({ open, onClose, tags = [], type, onNotify }) {
    const queryClient = useQueryClient();
    const [editingTag, setEditingTag] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(tagSchema),
        defaultValues: EMPTY_TAG,
    });

    const selectedColor = watch("color");
    const selectedScope = watch("scope");

    useEffect(() => {
        if (!open) return;
        if (editingTag) {
            reset({ name: editingTag.name, color: editingTag.color, scope: editingTag.scope });
        } else {
            reset({ ...EMPTY_TAG, scope: type });
        }
    }, [editingTag, open, reset, type]);

    const sortedTags = useMemo(
        () => [...tags].sort((first, second) => first.name.localeCompare(second.name, "pt-BR")),
        [tags],
    );

    const saveMutation = useMutation({
        mutationFn: (payload) => editingTag ? tagService.update(editingTag.id, payload) : tagService.create(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            onNotify?.(editingTag ? "Tag atualizada com sucesso." : "Tag criada com sucesso.", "success");
            setEditingTag(null);
            reset({ ...EMPTY_TAG, scope: type });
        },
        onError: (error) => onNotify?.(getApiErrorMessage(error, "Não foi possível salvar a tag."), "error"),
    });

    const deleteMutation = useMutation({
        mutationFn: (tagId) => tagService.remove(tagId),
        onSuccess: async (result) => {
            await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            const message = result?.deletionMode === "DEACTIVATED"
                ? "A tag foi desativada porque já está vinculada ao histórico."
                : "Tag excluída com sucesso.";
            onNotify?.(message, "success");
            if (editingTag?.id === result?.tag?.id) setEditingTag(null);
        },
        onError: (error) => onNotify?.(getApiErrorMessage(error, "Não foi possível excluir a tag."), "error"),
    });

    function submitTag(data) {
        saveMutation.mutate({ ...data, color: data.color.toUpperCase() });
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !saveMutation.isPending && onClose?.()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Gerenciar tags</DialogTitle>
                    <DialogDescription>Crie, edite cores e remova etiquetas usadas para organizar suas movimentações.</DialogDescription>
                </DialogHeader>

                <div className="grid min-h-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
                    <section className="min-h-0 overflow-hidden rounded-card-sm border border-border bg-surface-raised">
                        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                            <div>
                                <p className="text-sm font-bold text-foreground">Tags disponíveis</p>
                                <p className="text-xs text-subtle-foreground">{sortedTags.length} ativas</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setEditingTag(null)}>
                                <Plus className="size-4" aria-hidden="true" />Nova
                            </Button>
                        </header>
                        <div className="max-h-80 divide-y divide-border overflow-y-auto">
                            {sortedTags.length === 0 ? (
                                <div className="px-4 py-10 text-center text-sm text-subtle-foreground">Nenhuma tag cadastrada.</div>
                            ) : sortedTags.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                                    <TagPill tag={item} className="max-w-44" />
                                    <span className="min-w-0 flex-1 truncate text-xs text-subtle-foreground">
                                        {item.usageCount ?? 0} usos · {item.scope === "BOTH" ? "Ambos" : item.scope === "INCOME" ? "Receitas" : "Despesas"}
                                    </span>
                                    <button type="button" onClick={() => setEditingTag(item)} className="inline-flex size-8 items-center justify-center rounded-control-sm text-subtle-foreground transition hover:bg-surface-hover hover:text-foreground" aria-label={`Editar ${item.name}`}>
                                        <Edit3 className="size-4" aria-hidden="true" />
                                    </button>
                                    <button type="button" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending} className="inline-flex size-8 items-center justify-center rounded-control-sm text-subtle-foreground transition hover:bg-danger-muted hover:text-danger" aria-label={`Excluir ${item.name}`}>
                                        <Trash2 className="size-4" aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <form onSubmit={handleSubmit(submitTag)} className="space-y-4 rounded-card-sm border border-border bg-surface p-4">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-control bg-primary-soft text-primary">
                                <Tag className="size-4" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-foreground">{editingTag ? "Editar tag" : "Nova tag"}</p>
                                <p className="text-xs text-subtle-foreground">A cor será usada em listas e filtros.</p>
                            </div>
                        </div>

                        <Input label="Nome" placeholder="Ex.: Moradia" error={errors.name?.message} {...register("name")} />

                        <div>
                            <span className="mb-2 block text-sm font-semibold text-foreground">Cor</span>
                            <div className="flex flex-wrap gap-2">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setValue("color", color, { shouldValidate: true })}
                                        className="flex size-8 items-center justify-center rounded-full border-2 border-surface shadow-xs ring-offset-2 ring-offset-surface transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
                                        style={{ backgroundColor: color, outline: selectedColor === color ? "2px solid var(--app-primary)" : undefined }}
                                        aria-label={`Selecionar cor ${color}`}
                                        aria-pressed={selectedColor === color}
                                    />
                                ))}
                            </div>
                            <Input className="mt-3" aria-label="Cor hexadecimal" error={errors.color?.message} {...register("color")} />
                        </div>

                        <div>
                            <span className="mb-2 block text-sm font-semibold text-foreground">Disponível em</span>
                            <Select value={selectedScope} onValueChange={(value) => setValue("scope", value, { shouldValidate: true })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INCOME">Somente receitas</SelectItem>
                                    <SelectItem value="EXPENSE">Somente despesas</SelectItem>
                                    <SelectItem value="BOTH">Receitas e despesas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.scope?.message && <p className="mt-1.5 text-xs text-danger">{errors.scope.message}</p>}
                        </div>

                        <div className="flex gap-2 pt-1">
                            {editingTag && <Button variant="secondary" className="flex-1" onClick={() => setEditingTag(null)}>Cancelar</Button>}
                            <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
                                {saveMutation.isPending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                                {editingTag ? "Salvar" : "Criar tag"}
                            </Button>
                        </div>
                    </form>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Concluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TagManagerDialog;
