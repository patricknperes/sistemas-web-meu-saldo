import { useMemo, useState } from "react";

import { Check, ChevronsUpDown, Plus, Search, Settings2 } from "lucide-react";
import { Command } from "cmdk";

import Button from "../../../components/ui/Button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/Popover.jsx";
import { ScrollArea } from "../../../components/ui/ScrollArea.jsx";
import { cn } from "../../../lib/cn.js";
import TagPill from "./TagPill.jsx";

function TagMultiSelect({ tags = [], value = [], onChange, label = "Tags", error, disabled, onManageTags }) {
    const [open, setOpen] = useState(false);
    const selectedTags = useMemo(
        () => tags.filter((tag) => value.includes(tag.id)),
        [tags, value],
    );

    function toggleTag(tagId) {
        const nextValue = value.includes(tagId)
            ? value.filter((currentId) => currentId !== tagId)
            : [...value, tagId];
        onChange(nextValue.slice(0, 10));
    }

    return (
        <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <button type="button" onClick={onManageTags} className="text-xs font-semibold text-primary hover:underline" disabled={disabled}>
                    Gerenciar
                </button>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn("h-auto min-h-11 w-full justify-between px-3 py-2", error && "border-danger")}
                    >
                        <span className="min-w-0 flex-1 text-left">
                            {selectedTags.length > 0 ? (
                                <span className="flex flex-wrap gap-1.5">
                                    {selectedTags.slice(0, 3).map((tag) => <TagPill key={tag.id} tag={tag} />)}
                                    {selectedTags.length > 3 && <span className="text-xs text-subtle-foreground">+{selectedTags.length - 3}</span>}
                                </span>
                            ) : (
                                <span className="text-subtle-foreground">Selecione até 10 tags</span>
                            )}
                        </span>
                        <ChevronsUpDown className="size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command className="overflow-hidden rounded-[inherit] bg-transparent" shouldFilter>
                        <div className="flex h-11 items-center gap-2 border-b border-border px-3">
                            <Search className="size-4 text-subtle-foreground" aria-hidden="true" />
                            <Command.Input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle-foreground" placeholder="Pesquisar tags..." />
                        </div>
                        <Command.Empty className="px-4 py-8 text-center text-sm text-subtle-foreground">
                            Nenhuma tag encontrada.
                        </Command.Empty>
                        <ScrollArea className="max-h-64">
                            <Command.List className="p-1.5">
                                {tags.map((tag) => {
                                    const selected = value.includes(tag.id);
                                    return (
                                        <Command.Item
                                            key={tag.id}
                                            value={`${tag.name} ${tag.scope}`}
                                            onSelect={() => toggleTag(tag.id)}
                                            className="flex min-h-10 cursor-default items-center gap-2 rounded-control-sm px-2.5 py-2 text-sm outline-none data-[selected=true]:bg-surface-hover"
                                        >
                                            <span className={cn("flex size-5 items-center justify-center rounded-control-sm border", selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface")}>
                                                {selected && <Check className="size-3.5" aria-hidden="true" />}
                                            </span>
                                            <span className="size-2.5 rounded-full" style={{ backgroundColor: tag.color }} aria-hidden="true" />
                                            <span className="min-w-0 flex-1 truncate">{tag.name}</span>
                                            <span className="text-[11px] text-subtle-foreground">{tag.scope === "BOTH" ? "Ambos" : tag.scope === "INCOME" ? "Receita" : "Despesa"}</span>
                                        </Command.Item>
                                    );
                                })}
                            </Command.List>
                        </ScrollArea>
                        <div className="grid grid-cols-2 gap-2 border-t border-border p-2">
                            <Button variant="ghost" size="sm" onClick={() => onChange([])} disabled={value.length === 0}>
                                Limpar
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => { setOpen(false); onManageTags?.(); }}>
                                <Settings2 className="size-4" aria-hidden="true" />Gerenciar
                            </Button>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
            {!error && tags.length === 0 && (
                <button type="button" onClick={onManageTags} className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <Plus className="size-3.5" aria-hidden="true" />Criar a primeira tag
                </button>
            )}
        </div>
    );
}

export default TagMultiSelect;
