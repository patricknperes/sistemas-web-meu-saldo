import { Filter, Search, X } from "lucide-react";

import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { getHistoryPeriodLabel, getHistoryTypeLabel } from "../utils/historyFormatters.js";

function HistoryToolbar({ filters, tags = [], onSearchChange, onOpenFilters, onReset }) {
    const selectedTag = tags.find((tag) => Number(tag.id) === Number(filters.tagId));
    const hasAdvancedFilters = filters.mode !== "YEAR" || filters.type !== "ALL" || Boolean(filters.tagId);

    return (
        <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Input
                    className="min-w-0 flex-1"
                    leadingIcon={Search}
                    value={filters.search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Pesquisar descrição, categoria, observação ou tag"
                    aria-label="Pesquisar no histórico"
                    trailingElement={filters.search ? (
                        <button type="button" onClick={() => onSearchChange("")} className="rounded-full p-1 text-subtle-foreground transition hover:bg-surface-muted hover:text-foreground" aria-label="Limpar pesquisa">
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    ) : null}
                />

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" onClick={onOpenFilters}>
                        <Filter className="size-4" aria-hidden="true" />
                        Filtros
                    </Button>
                    {(hasAdvancedFilters || filters.search) && (
                        <Button variant="ghost" onClick={onReset}>Limpar</Button>
                    )}
                </div>
            </div>

            <div className="mt-3 flex min-w-0 flex-wrap gap-2 border-t border-border pt-3">
                <Badge variant="primary" className="max-w-full truncate">{getHistoryPeriodLabel(filters)}</Badge>
                <Badge>{getHistoryTypeLabel(filters.type)}</Badge>
                {selectedTag && <Badge variant="secondary" className="max-w-full truncate">Tag: {selectedTag.name}</Badge>}
            </div>
        </Card>
    );
}

export default HistoryToolbar;
