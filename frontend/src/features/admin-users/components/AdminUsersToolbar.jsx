import {
    FilterX,
    Search,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";

function AdminUsersToolbar({
    filters,
    disabled,
    onChange,
    onReset,
}) {
    const currentFilters = {
        search: filters?.search ?? "",
        role: filters?.role ?? "ALL",
        status: filters?.status ?? "ALL",
    };

    const hasFilters = Boolean(
        currentFilters.search.trim()
        || currentFilters.role !== "ALL"
        || currentFilters.status !== "ALL",
    );

    function updateFilters(values) {
        onChange?.({
            ...values,
            page: 1,
        });
    }

    return (
        <section
            aria-label="Filtros de usuários"
            className="
                min-w-0
                rounded-card
                border border-border
                bg-surface
                p-4
                shadow-card
                sm:p-5
            "
        >
            <div
                className="
                    grid min-w-0
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-[minmax(260px,1fr)_190px_190px_auto]
                    lg:items-center
                "
            >
                <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                    <Input
                        aria-label="Pesquisar usuários"
                        placeholder="Pesquisar por nome ou e-mail"
                        leadingIcon={Search}
                        value={currentFilters.search}
                        disabled={disabled}
                        onChange={(event) => {
                            updateFilters({
                                search: event.target.value,
                            });
                        }}
                        className="w-full"
                    />
                </div>

                <div className="min-w-0">
                    <Select
                        value={currentFilters.role}
                        disabled={disabled}
                        onValueChange={(role) => {
                            updateFilters({ role });
                        }}
                    >
                        <SelectTrigger
                            aria-label="Filtrar por nível de acesso"
                            className="w-full"
                        >
                            <SelectValue placeholder="Nível de acesso" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">
                                Todos os acessos
                            </SelectItem>

                            <SelectItem value="USER">
                                Usuários
                            </SelectItem>

                            <SelectItem value="ADMIN">
                                Administradores
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-w-0">
                    <Select
                        value={currentFilters.status}
                        disabled={disabled}
                        onValueChange={(status) => {
                            updateFilters({ status });
                        }}
                    >
                        <SelectTrigger
                            aria-label="Filtrar por status"
                            className="w-full"
                        >
                            <SelectValue placeholder="Status da conta" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">
                                Todos os status
                            </SelectItem>

                            <SelectItem value="ACTIVE">
                                Ativos
                            </SelectItem>

                            <SelectItem value="INACTIVE">
                                Inativos
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasFilters && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onReset}
                        disabled={disabled}
                        className="
                            w-full
                            whitespace-nowrap
                            sm:col-span-2
                            lg:col-span-1
                            lg:w-auto
                        "
                    >
                        <FilterX
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />

                        Limpar filtros
                    </Button>
                )}
            </div>
        </section>
    );
}

export default AdminUsersToolbar;