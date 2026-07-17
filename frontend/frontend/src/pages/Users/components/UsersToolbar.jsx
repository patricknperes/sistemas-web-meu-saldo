import {
    RiFilterOffLine,
    RiShieldUserLine,
    RiUserSearchLine,
} from "react-icons/ri";

import Button from "../../../components/ui/actions/Button.jsx";
import SearchInput from "../../../components/ui/forms/SearchInput.jsx";
import Select from "../../../components/ui/forms/Select.jsx";
import PageToolbar from "../../../components/ui/layout/PageToolbar.jsx";

const roleOptions = [
    { value: "ALL", label: "Todas as funções" },
    { value: "USER", label: "Usuários" },
    { value: "ADMIN", label: "Administradores" },
];

const statusOptions = [
    { value: "ALL", label: "Todos os acessos" },
    { value: "ACTIVE", label: "Ativos" },
    { value: "INACTIVE", label: "Inativos" },
];

function UsersToolbar({
    search,
    role,
    status,
    resultCount,
    hasActiveFilters,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onClear,
}) {
    return (
        <PageToolbar
            startContent={(
                <div className="grid min-w-0 flex-1 gap-3 lg:grid-cols-[minmax(16rem,1fr)_13rem_13rem]">
                    <SearchInput
                        value={search}
                        onValueChange={onSearchChange}
                        placeholder="Buscar por nome ou e-mail"
                        aria-label="Buscar usuários por nome ou e-mail"
                    />

                    <Select
                        value={role}
                        onChange={(event) => onRoleChange?.(event.target.value)}
                        options={roleOptions}
                        aria-label="Filtrar usuários por função"
                        leadingIcon={(
                            <RiShieldUserLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                    />

                    <Select
                        value={status}
                        onChange={(event) => onStatusChange?.(event.target.value)}
                        options={statusOptions}
                        aria-label="Filtrar usuários pelo estado do acesso"
                        leadingIcon={(
                            <RiUserSearchLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                    />
                </div>
            )}
            endContent={(
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <p className="whitespace-nowrap text-caption text-muted-foreground">
                        <strong className="font-bold text-foreground">
                            {resultCount}
                        </strong>{" "}
                        {resultCount === 1 ? "resultado" : "resultados"}
                    </p>

                    {hasActiveFilters ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            leadingIcon={(
                                <RiFilterOffLine
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}
                            onClick={onClear}
                        >
                            Limpar
                        </Button>
                    ) : null}
                </div>
            )}
        />
    );
}

export default UsersToolbar;
