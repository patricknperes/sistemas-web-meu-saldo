import { ListFilter, Plus } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";

function TransactionEmptyState({ title, description, hasFilters, onCreate, onClearFilters }) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-card bg-primary-soft text-primary">
                <ListFilter className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
            <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
                {hasFilters && <Button variant="secondary" onClick={onClearFilters}>Limpar filtros</Button>}
                <Button onClick={onCreate}><Plus className="size-4" aria-hidden="true" />Cadastrar</Button>
            </div>
        </div>
    );
}

export default TransactionEmptyState;
