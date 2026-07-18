import { FilterX, Search } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";

function AdminUsersToolbar({ filters, disabled, onChange, onReset }) {
    const hasFilters = Boolean(filters.search || filters.role !== "ALL" || filters.status !== "ALL");

    return (
        <section className="rounded-card border border-border bg-surface p-4 shadow-card sm:p-5" aria-label="Filtros de usuários">
            <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
                <Input
                    aria-label="Pesquisar usuários"
                    placeholder="Pesquisar por nome ou e-mail"
                    leadingIcon={Search}
                    value={filters.search}
                    onChange={(event) => onChange({ search: event.target.value, page: 1 })}
                />

                <Select value={filters.role} onValueChange={(role) => onChange({ role, page: 1 })} disabled={disabled}>
                    <SelectTrigger aria-label="Filtrar por nível de acesso"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os acessos</SelectItem>
                        <SelectItem value="USER">Usuários</SelectItem>
                        <SelectItem value="ADMIN">Administradores</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(status) => onChange({ status, page: 1 })} disabled={disabled}>
                    <SelectTrigger aria-label="Filtrar por status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os status</SelectItem>
                        <SelectItem value="ACTIVE">Ativos</SelectItem>
                        <SelectItem value="INACTIVE">Inativos</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="ghost" onClick={onReset} disabled={!hasFilters || disabled}>
                    <FilterX className="size-4" aria-hidden="true" />
                    Limpar
                </Button>
            </div>
        </section>
    );
}

export default AdminUsersToolbar;
