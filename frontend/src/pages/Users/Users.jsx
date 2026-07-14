import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiAlertCircle,
    FiChevronDown,
    FiLoader,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiToggleLeft,
    FiToggleRight,
    FiTrash2,
    FiUser,
    FiUserCheck,
    FiUsers,
    FiUserX,
} from "react-icons/fi";

import ConfirmDialog from "../../components/feedback/ConfirmDialog.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { formatDate } from "../../utils/formatDate.js";

function getInitials(name) {
    const normalizedName = String(name ?? "").trim();

    if (!normalizedName) {
        return "U";
    }

    const nameParts = normalizedName
        .split(/\s+/)
        .filter(Boolean);

    if (nameParts.length === 1) {
        return nameParts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]
        }`.toUpperCase();
}

function isSameUser(firstId, secondId) {
    if (
        firstId === null ||
        firstId === undefined ||
        secondId === null ||
        secondId === undefined
    ) {
        return false;
    }

    return String(firstId) === String(secondId);
}

function getFormattedDate(value) {
    if (!value) {
        return "Não informado";
    }

    return formatDate(value);
}

function SummaryCard({
    title,
    value,
    icon: Icon,
    tone = "neutral",
}) {
    const tones = {
        neutral: {
            icon: "bg-surface-muted text-muted-foreground",
            value: "text-foreground",
        },

        info: {
            icon: "bg-info-muted text-info",
            value: "text-info",
        },

        success: {
            icon: "bg-success-muted text-success",
            value: "text-success",
        },

        danger: {
            icon: "bg-danger-muted text-danger",
            value: "text-danger",
        },
    };

    const styles =
        tones[tone] ?? tones.neutral;

    return (
        <article
            className="
                flex min-w-0
                items-center gap-3
                rounded-2xl
                border border-border
                bg-surface
                p-4
                shadow-card
            "
        >
            <span
                className={`
                    flex size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${styles.icon}
                `}
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0">
                <p
                    className="
                        truncate
                        text-xs
                        font-medium
                        text-muted-foreground
                    "
                >
                    {title}
                </p>

                <p
                    className={`
                        mt-0.5
                        text-xl
                        font-semibold
                        ${styles.value}
                    `}
                >
                    {value}
                </p>
            </div>
        </article>
    );
}

function LoadingState() {
    return (
        <div className="animate-pulse">
            <div
                className="
                    hidden divide-y
                    divide-border
                    lg:block
                "
            >
                {Array.from({
                    length: 5,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="
                            grid grid-cols-5
                            items-center gap-4
                            px-5 py-4
                        "
                    >
                        <div
                            className="
                                col-span-2
                                flex items-center gap-3
                            "
                        >
                            <div
                                className="
                                    size-10
                                    rounded-xl
                                    bg-surface-muted
                                "
                            />

                            <div className="flex-1 space-y-2">
                                <div
                                    className="
                                        h-4 w-36
                                        rounded
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        h-3 w-48
                                        max-w-full
                                        rounded
                                        bg-surface-muted
                                    "
                                />
                            </div>
                        </div>

                        <div
                            className="
                                h-9 w-32
                                rounded-xl
                                bg-surface-muted
                            "
                        />

                        <div
                            className="
                                h-7 w-20
                                rounded-full
                                bg-surface-muted
                            "
                        />

                        <div
                            className="
                                ml-auto
                                h-9 w-24
                                rounded-xl
                                bg-surface-muted
                            "
                        />
                    </div>
                ))}
            </div>

            <div
                className="
                    grid gap-3 p-4
                    sm:grid-cols-2
                    lg:hidden
                "
            >
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="
                            h-52
                            rounded-2xl
                            bg-surface-muted
                        "
                    />
                ))}
            </div>
        </div>
    );
}

function Users() {
    const {
        user: authenticatedUser,
    } = useAuth();

    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        updatingId,
        setUpdatingId,
    ] = useState(null);

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        userToDelete,
        setUserToDelete,
    ] = useState(null);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("ALL");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("ALL");

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    const showNotification = useCallback(
        (type, message) => {
            setNotification({
                type,
                message,
            });
        },
        []
    );

    const clearNotification = useCallback(
        () => {
            setNotification({
                type: "info",
                message: "",
            });
        },
        []
    );

    const loadUsers = useCallback(
        async ({
            initial = false,
        } = {}) => {
            if (initial) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setLoadError("");

            try {
                const response =
                    await userService.list();

                setUsers(
                    Array.isArray(response.users)
                        ? response.users
                        : []
                );
            } catch (error) {
                const message =
                    error.response?.data?.error ??
                    "Não foi possível carregar os usuários.";

                setLoadError(message);

                if (!initial) {
                    showNotification(
                        "error",
                        message
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [showNotification]
    );

    useEffect(() => {
        loadUsers({
            initial: true,
        });
    }, [loadUsers]);

    const statistics = useMemo(() => {
        const totalUsers = users.length;

        const adminCount = users.filter(
            (selectedUser) =>
                selectedUser.role === "ADMIN"
        ).length;

        const activeCount = users.filter(
            (selectedUser) =>
                selectedUser.isActive
        ).length;

        return {
            totalUsers,
            adminCount,
            activeCount,
            inactiveCount:
                totalUsers - activeCount,
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const normalizedSearch =
            searchTerm
                .trim()
                .toLowerCase();

        return users.filter(
            (selectedUser) => {
                const matchesSearch =
                    !normalizedSearch ||
                    String(
                        selectedUser.name ?? ""
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    String(
                        selectedUser.email ?? ""
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                const matchesRole =
                    roleFilter === "ALL" ||
                    selectedUser.role ===
                    roleFilter;

                const matchesStatus =
                    statusFilter === "ALL" ||
                    (
                        statusFilter ===
                        "ACTIVE" &&
                        selectedUser.isActive
                    ) ||
                    (
                        statusFilter ===
                        "INACTIVE" &&
                        !selectedUser.isActive
                    );

                return (
                    matchesSearch &&
                    matchesRole &&
                    matchesStatus
                );
            }
        );
    }, [
        users,
        searchTerm,
        roleFilter,
        statusFilter,
    ]);

    async function handleRoleChange(
        selectedUser,
        newRole
    ) {
        if (
            selectedUser.role === newRole ||
            updatingId !== null
        ) {
            return;
        }

        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode alterar a função da própria conta."
            );

            return;
        }

        setUpdatingId(selectedUser.id);
        clearNotification();

        try {
            const response =
                await userService.update(
                    selectedUser.id,
                    {
                        role: newRole,
                    }
                );

            setUsers(
                (currentUsers) =>
                    currentUsers.map(
                        (currentUser) =>
                            isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                                ? {
                                    ...currentUser,
                                    ...(response.user ??
                                        {}),
                                    role: newRole,
                                }
                                : currentUser
                    )
            );

            showNotification(
                "success",
                "Função do usuário atualizada com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível alterar a função do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleActiveChange(
        selectedUser
    ) {
        if (updatingId !== null) {
            return;
        }

        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode desativar a própria conta."
            );

            return;
        }

        const newActiveStatus =
            !selectedUser.isActive;

        setUpdatingId(selectedUser.id);
        clearNotification();

        try {
            const response =
                await userService.update(
                    selectedUser.id,
                    {
                        isActive:
                            newActiveStatus,
                    }
                );

            setUsers(
                (currentUsers) =>
                    currentUsers.map(
                        (currentUser) =>
                            isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                                ? {
                                    ...currentUser,
                                    ...(response.user ??
                                        {}),
                                    isActive:
                                        newActiveStatus,
                                }
                                : currentUser
                    )
            );

            showNotification(
                "success",
                newActiveStatus
                    ? "Usuário ativado com sucesso."
                    : "Usuário desativado com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível alterar o estado do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function requestDelete(
        selectedUser
    ) {
        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode excluir a própria conta nesta página."
            );

            return;
        }

        clearNotification();
        setUserToDelete(selectedUser);
    }

    function cancelDelete() {
        if (deletingId !== null) {
            return;
        }

        setUserToDelete(null);
    }

    async function confirmDelete() {
        if (
            !userToDelete ||
            deletingId !== null
        ) {
            return;
        }

        const selectedUser =
            userToDelete;

        setDeletingId(selectedUser.id);
        clearNotification();

        try {
            await userService.remove(
                selectedUser.id
            );

            setUsers(
                (currentUsers) =>
                    currentUsers.filter(
                        (currentUser) =>
                            !isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                    )
            );

            setUserToDelete(null);

            showNotification(
                "success",
                "Usuário excluído com sucesso."
            );
        } catch (error) {
            setUserToDelete(null);

            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível excluir o usuário."
            );
        } finally {
            setDeletingId(null);
        }
    }

    function clearFilters() {
        setSearchTerm("");
        setRoleFilter("ALL");
        setStatusFilter("ALL");
    }

    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL";

    return (
        <div
            className="
                w-full min-w-0
                max-w-none
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex w-full min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex min-w-0
                        flex-col gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex items-center
                                gap-2
                            "
                        >
                            <h1
                                className="
                                    truncate
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-foreground
                                "
                            >
                                Gerenciamento de usuários
                            </h1>

                            <span
                                className="
                                    hidden
                                    rounded-full
                                    bg-info-muted
                                    px-2.5 py-1
                                    text-xs
                                    font-medium
                                    text-info
                                    sm:inline-flex
                                "
                            >
                                Administrador
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Gerencie funções, acessos e
                            contas cadastradas no sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadUsers()
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="
                            inline-flex
                            min-h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border border-border
                            bg-surface
                            px-4
                            text-sm
                            font-medium
                            text-foreground
                            transition-colors
                            hover:bg-surface-hover
                            disabled:pointer-events-none
                            disabled:opacity-50
                            sm:w-auto
                        "
                    >
                        <FiRefreshCw
                            size={17}
                            aria-hidden="true"
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Atualizando..."
                            : "Atualizar"}
                    </button>
                </header>

                <section
                    aria-label="Resumo dos usuários"
                    className="
                        grid gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <SummaryCard
                        title="Usuários cadastrados"
                        value={
                            statistics.totalUsers
                        }
                        icon={FiUsers}
                        tone="info"
                    />

                    <SummaryCard
                        title="Administradores"
                        value={
                            statistics.adminCount
                        }
                        icon={FiShield}
                        tone="neutral"
                    />

                    <SummaryCard
                        title="Usuários ativos"
                        value={
                            statistics.activeCount
                        }
                        icon={FiUserCheck}
                        tone="success"
                    />

                    <SummaryCard
                        title="Usuários inativos"
                        value={
                            statistics.inactiveCount
                        }
                        icon={FiUserX}
                        tone="danger"
                    />
                </section>

                <section
                    className="
                        min-w-0
                        rounded-2xl
                        border border-border
                        bg-surface
                        p-4
                        shadow-card
                    "
                >
                    <div
                        className="
                            grid gap-3
                            md:grid-cols-[minmax(0,1fr)_180px_180px]
                        "
                    >
                        <div className="relative min-w-0">
                            <FiSearch
                                size={17}
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5 top-1/2
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Buscar por nome ou e-mail"
                                aria-label="Buscar usuários"
                                className="
                                    h-11 w-full
                                    min-w-0
                                    rounded-xl
                                    border border-border
                                    bg-background
                                    py-2
                                    pl-10 pr-3.5
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition
                                    placeholder:text-muted-foreground/70
                                    hover:border-border-strong
                                    focus:border-foreground/40
                                    focus:ring-2
                                    focus:ring-ring/15
                                "
                            />
                        </div>

                        <div className="relative min-w-0">
                            <select
                                value={roleFilter}
                                onChange={(event) =>
                                    setRoleFilter(
                                        event.target.value
                                    )
                                }
                                aria-label="Filtrar por função"
                                className="
                                    h-11 w-full
                                    appearance-none
                                    rounded-xl
                                    border border-border
                                    bg-background
                                    px-3.5 pr-10
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition
                                    hover:border-border-strong
                                    focus:border-foreground/40
                                    focus:ring-2
                                    focus:ring-ring/15
                                "
                            >
                                <option value="ALL">
                                    Todas as funções
                                </option>

                                <option value="USER">
                                    Usuários
                                </option>

                                <option value="ADMIN">
                                    Administradores
                                </option>
                            </select>

                            <FiChevronDown
                                size={17}
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3.5 top-1/2
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />
                        </div>

                        <div className="relative min-w-0">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                aria-label="Filtrar por estado"
                                className="
                                    h-11 w-full
                                    appearance-none
                                    rounded-xl
                                    border border-border
                                    bg-background
                                    px-3.5 pr-10
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition
                                    hover:border-border-strong
                                    focus:border-foreground/40
                                    focus:ring-2
                                    focus:ring-ring/15
                                "
                            >
                                <option value="ALL">
                                    Todos os estados
                                </option>

                                <option value="ACTIVE">
                                    Ativos
                                </option>

                                <option value="INACTIVE">
                                    Inativos
                                </option>
                            </select>

                            <FiChevronDown
                                size={17}
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3.5 top-1/2
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />
                        </div>
                    </div>

                    <div
                        className="
                            mt-3
                            flex min-w-0
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <p
                            className="
                                min-w-0
                                truncate
                                text-xs
                                text-muted-foreground
                            "
                        >
                            {filteredUsers.length}{" "}
                            {filteredUsers.length === 1
                                ? "usuário encontrado"
                                : "usuários encontrados"}
                        </p>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    shrink-0
                                    text-xs
                                    font-medium
                                    text-primary
                                    transition-opacity
                                    hover:opacity-75
                                "
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                </section>

                {loadError && !loading && (
                    <div
                        role="alert"
                        className="
                            flex items-center
                            gap-3
                            rounded-xl
                            border border-danger/20
                            bg-danger-muted
                            px-4 py-3
                            text-sm
                            text-danger
                        "
                    >
                        <FiAlertCircle
                            size={18}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <p className="min-w-0 flex-1">
                            {loadError}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                loadUsers({
                                    initial: true,
                                })
                            }
                            className="
                                shrink-0
                                font-medium
                                underline
                                underline-offset-2
                            "
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                <section
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <header
                        className="
                            flex min-w-0
                            items-center
                            justify-between
                            gap-3
                            border-b border-border
                            px-4 py-4
                            sm:px-5
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-info-muted
                                    text-info
                                "
                            >
                                <FiUsers
                                    size={17}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Usuários cadastrados
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Controle de acesso e
                                    permissões.
                                </p>
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <LoadingState />
                    ) : filteredUsers.length ===
                        0 ? (
                        <div
                            className="
                                flex min-h-64
                                flex-col
                                items-center
                                justify-center
                                p-6
                                text-center
                            "
                        >
                            <span
                                className="
                                    flex size-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-surface-muted
                                    text-muted-foreground
                                "
                            >
                                <FiUsers
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <h3
                                className="
                                    mt-4
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Nenhum usuário encontrado
                            </h3>

                            <p
                                className="
                                    mt-1
                                    max-w-sm
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Ajuste os filtros ou faça uma
                                nova atualização da lista.
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-primary
                                    "
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <table
                                    className="
                                        w-full
                                        table-fixed
                                        text-left
                                        text-sm
                                    "
                                >
                                    <thead
                                        className="
                                            bg-surface-muted
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        <tr>
                                            <th
                                                className="
                                                    w-[34%]
                                                    px-5 py-3
                                                "
                                            >
                                                Usuário
                                            </th>

                                            <th
                                                className="
                                                    w-[21%]
                                                    px-4 py-3
                                                "
                                            >
                                                Função
                                            </th>

                                            <th
                                                className="
                                                    w-[14%]
                                                    px-4 py-3
                                                "
                                            >
                                                Estado
                                            </th>

                                            <th
                                                className="
                                                    w-[17%]
                                                    px-4 py-3
                                                "
                                            >
                                                Cadastro
                                            </th>

                                            <th
                                                className="
                                                    w-[14%]
                                                    px-5 py-3
                                                    text-right
                                                "
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.map(
                                            (
                                                selectedUser
                                            ) => {
                                                const isCurrentUser =
                                                    isSameUser(
                                                        selectedUser.id,
                                                        authenticatedUser?.id
                                                    );

                                                const isUpdating =
                                                    isSameUser(
                                                        updatingId,
                                                        selectedUser.id
                                                    );

                                                const isDeleting =
                                                    isSameUser(
                                                        deletingId,
                                                        selectedUser.id
                                                    );

                                                const isBusy =
                                                    isUpdating ||
                                                    isDeleting;

                                                return (
                                                    <tr
                                                        key={
                                                            selectedUser.id
                                                        }
                                                        className="
                                                            border-t
                                                            border-border
                                                            transition-colors
                                                            hover:bg-surface-hover
                                                        "
                                                    >
                                                        <td
                                                            className="
                                                                px-5 py-3.5
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex min-w-0
                                                                    items-center
                                                                    gap-3
                                                                "
                                                            >
                                                                <span
                                                                    className={`
                                                                        flex size-10
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        text-xs
                                                                        font-semibold

                                                                        ${selectedUser.role ===
                                                                            "ADMIN"
                                                                            ? "bg-info-muted text-info"
                                                                            : "bg-surface-muted text-muted-foreground"
                                                                        }
                                                                    `}
                                                                >
                                                                    {getInitials(
                                                                        selectedUser.name
                                                                    )}
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <div
                                                                        className="
                                                                            flex min-w-0
                                                                            items-center
                                                                            gap-2
                                                                        "
                                                                    >
                                                                        <p
                                                                            className="
                                                                                truncate
                                                                                font-medium
                                                                                text-foreground
                                                                            "
                                                                            title={
                                                                                selectedUser.name
                                                                            }
                                                                        >
                                                                            {
                                                                                selectedUser.name
                                                                            }
                                                                        </p>

                                                                        {isCurrentUser && (
                                                                            <span
                                                                                className="
                                                                                    shrink-0
                                                                                    rounded-full
                                                                                    bg-info-muted
                                                                                    px-2 py-0.5
                                                                                    text-[10px]
                                                                                    font-medium
                                                                                    text-info
                                                                                "
                                                                            >
                                                                                Você
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            truncate
                                                                            text-xs
                                                                            text-muted-foreground
                                                                        "
                                                                        title={
                                                                            selectedUser.email
                                                                        }
                                                                    >
                                                                        {
                                                                            selectedUser.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    relative
                                                                    max-w-44
                                                                "
                                                            >
                                                                <select
                                                                    value={
                                                                        selectedUser.role ??
                                                                        "USER"
                                                                    }
                                                                    disabled={
                                                                        isBusy ||
                                                                        isCurrentUser
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleRoleChange(
                                                                            selectedUser,
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    aria-label={`Função de ${selectedUser.name}`}
                                                                    className="
                                                                        h-9 w-full
                                                                        appearance-none
                                                                        rounded-xl
                                                                        border
                                                                        border-border
                                                                        bg-background
                                                                        px-3 pr-9
                                                                        text-xs
                                                                        font-medium
                                                                        text-foreground
                                                                        outline-none
                                                                        transition
                                                                        hover:border-border-strong
                                                                        focus:ring-2
                                                                        focus:ring-ring/15
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >
                                                                    <option value="USER">
                                                                        Usuário
                                                                    </option>

                                                                    <option value="ADMIN">
                                                                        Administrador
                                                                    </option>
                                                                </select>

                                                                {isUpdating ? (
                                                                    <FiLoader
                                                                        size={
                                                                            15
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="
                                                                            pointer-events-none
                                                                            absolute
                                                                            right-3 top-1/2
                                                                            -translate-y-1/2
                                                                            animate-spin
                                                                            text-muted-foreground
                                                                        "
                                                                    />
                                                                ) : (
                                                                    <FiChevronDown
                                                                        size={
                                                                            15
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="
                                                                            pointer-events-none
                                                                            absolute
                                                                            right-3 top-1/2
                                                                            -translate-y-1/2
                                                                            text-muted-foreground
                                                                        "
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                            "
                                                        >
                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    px-2.5 py-1
                                                                    text-xs
                                                                    font-medium

                                                                    ${selectedUser.isActive
                                                                        ? "bg-success-muted text-success"
                                                                        : "bg-danger-muted text-danger"
                                                                    }
                                                                `}
                                                            >
                                                                <span
                                                                    className={`
                                                                        size-1.5
                                                                        rounded-full

                                                                        ${selectedUser.isActive
                                                                            ? "bg-success"
                                                                            : "bg-danger"
                                                                        }
                                                                    `}
                                                                />

                                                                {selectedUser.isActive
                                                                    ? "Ativo"
                                                                    : "Inativo"}
                                                            </span>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {getFormattedDate(
                                                                selectedUser.createdAt
                                                            )}
                                                        </td>

                                                        <td
                                                            className="
                                                                px-5 py-3.5
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex
                                                                    justify-end
                                                                    gap-2
                                                                "
                                                            >
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isBusy ||
                                                                        isCurrentUser
                                                                    }
                                                                    onClick={() =>
                                                                        handleActiveChange(
                                                                            selectedUser
                                                                        )
                                                                    }
                                                                    title={
                                                                        isCurrentUser
                                                                            ? "Você não pode desativar a própria conta"
                                                                            : selectedUser.isActive
                                                                                ? "Desativar usuário"
                                                                                : "Ativar usuário"
                                                                    }
                                                                    aria-label={
                                                                        selectedUser.isActive
                                                                            ? `Desativar ${selectedUser.name}`
                                                                            : `Ativar ${selectedUser.name}`
                                                                    }
                                                                    className={`
                                                                        inline-flex size-9
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        border border-border
                                                                        bg-surface
                                                                        transition-colors
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-40

                                                                        ${selectedUser.isActive
                                                                            ? "text-warning hover:bg-warning-muted"
                                                                            : "text-success hover:bg-success-muted"
                                                                        }
                                                                    `}
                                                                >
                                                                    {isUpdating ? (
                                                                        <FiLoader
                                                                            size={
                                                                                17
                                                                            }
                                                                            className="animate-spin"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : selectedUser.isActive ? (
                                                                        <FiToggleRight
                                                                            size={
                                                                                19
                                                                            }
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <FiToggleLeft
                                                                            size={
                                                                                19
                                                                            }
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isBusy ||
                                                                        isCurrentUser
                                                                    }
                                                                    onClick={() =>
                                                                        requestDelete(
                                                                            selectedUser
                                                                        )
                                                                    }
                                                                    title={
                                                                        isCurrentUser
                                                                            ? "Você não pode excluir a própria conta"
                                                                            : "Excluir usuário"
                                                                    }
                                                                    aria-label={`Excluir ${selectedUser.name}`}
                                                                    className="
                                                                        inline-flex size-9
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        border
                                                                        border-danger/25
                                                                        bg-surface
                                                                        text-danger
                                                                        transition-colors
                                                                        hover:bg-danger-muted
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-40
                                                                    "
                                                                >
                                                                    {isDeleting ? (
                                                                        <FiLoader
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <FiTrash2
                                                                            size={
                                                                                16
                                                                            }
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                className="
                                    grid gap-3 p-4
                                    sm:grid-cols-2
                                    lg:hidden
                                "
                            >
                                {filteredUsers.map(
                                    (
                                        selectedUser
                                    ) => {
                                        const isCurrentUser =
                                            isSameUser(
                                                selectedUser.id,
                                                authenticatedUser?.id
                                            );

                                        const isUpdating =
                                            isSameUser(
                                                updatingId,
                                                selectedUser.id
                                            );

                                        const isDeleting =
                                            isSameUser(
                                                deletingId,
                                                selectedUser.id
                                            );

                                        const isBusy =
                                            isUpdating ||
                                            isDeleting;

                                        return (
                                            <article
                                                key={
                                                    selectedUser.id
                                                }
                                                className="
                                                    min-w-0
                                                    rounded-2xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    p-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex min-w-0
                                                        items-start
                                                        gap-3
                                                    "
                                                >
                                                    <span
                                                        className={`
                                                            flex size-11
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            text-xs
                                                            font-semibold

                                                            ${selectedUser.role ===
                                                                "ADMIN"
                                                                ? "bg-info-muted text-info"
                                                                : "bg-surface-muted text-muted-foreground"
                                                            }
                                                        `}
                                                    >
                                                        {getInitials(
                                                            selectedUser.name
                                                        )}
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <div
                                                            className="
                                                                flex min-w-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            <h3
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-semibold
                                                                    text-foreground
                                                                "
                                                            >
                                                                {
                                                                    selectedUser.name
                                                                }
                                                            </h3>

                                                            {isCurrentUser && (
                                                                <span
                                                                    className="
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-info-muted
                                                                        px-2 py-0.5
                                                                        text-[10px]
                                                                        font-medium
                                                                        text-info
                                                                    "
                                                                >
                                                                    Você
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                truncate
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {
                                                                selectedUser.email
                                                            }
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`
                                                            shrink-0
                                                            rounded-full
                                                            px-2 py-1
                                                            text-[10px]
                                                            font-medium

                                                            ${selectedUser.isActive
                                                                ? "bg-success-muted text-success"
                                                                : "bg-danger-muted text-danger"
                                                            }
                                                        `}
                                                    >
                                                        {selectedUser.isActive
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </span>
                                                </div>

                                                <div
                                                    className="
                                                        mt-4
                                                        grid grid-cols-2
                                                        gap-3
                                                        border-y
                                                        border-border
                                                        py-3
                                                    "
                                                >
                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            Função
                                                        </p>

                                                        <div
                                                            className="
                                                                relative mt-1
                                                            "
                                                        >
                                                            <select
                                                                value={
                                                                    selectedUser.role ??
                                                                    "USER"
                                                                }
                                                                disabled={
                                                                    isBusy ||
                                                                    isCurrentUser
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleRoleChange(
                                                                        selectedUser,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="
                                                                    h-9 w-full
                                                                    appearance-none
                                                                    rounded-xl
                                                                    border
                                                                    border-border
                                                                    bg-surface
                                                                    px-3 pr-8
                                                                    text-xs
                                                                    font-medium
                                                                    text-foreground
                                                                    outline-none
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >
                                                                <option value="USER">
                                                                    Usuário
                                                                </option>

                                                                <option value="ADMIN">
                                                                    Administrador
                                                                </option>
                                                            </select>

                                                            <FiChevronDown
                                                                size={
                                                                    14
                                                                }
                                                                aria-hidden="true"
                                                                className="
                                                                    pointer-events-none
                                                                    absolute
                                                                    right-2.5 top-1/2
                                                                    -translate-y-1/2
                                                                    text-muted-foreground
                                                                "
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            Cadastro
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-2
                                                                truncate
                                                                text-xs
                                                                font-medium
                                                                text-foreground
                                                            "
                                                        >
                                                            {getFormattedDate(
                                                                selectedUser.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        mt-4
                                                        grid grid-cols-2
                                                        gap-2
                                                    "
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isBusy ||
                                                            isCurrentUser
                                                        }
                                                        onClick={() =>
                                                            handleActiveChange(
                                                                selectedUser
                                                            )
                                                        }
                                                        className={`
                                                            inline-flex
                                                            min-h-10
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-border
                                                            bg-surface
                                                            px-3
                                                            text-xs
                                                            font-medium
                                                            transition-colors
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40

                                                            ${selectedUser.isActive
                                                                ? "text-warning hover:bg-warning-muted"
                                                                : "text-success hover:bg-success-muted"
                                                            }
                                                        `}
                                                    >
                                                        {isUpdating ? (
                                                            <FiLoader
                                                                size={
                                                                    16
                                                                }
                                                                className="animate-spin"
                                                                aria-hidden="true"
                                                            />
                                                        ) : selectedUser.isActive ? (
                                                            <FiToggleRight
                                                                size={
                                                                    17
                                                                }
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <FiToggleLeft
                                                                size={
                                                                    17
                                                                }
                                                                aria-hidden="true"
                                                            />
                                                        )}

                                                        {selectedUser.isActive
                                                            ? "Desativar"
                                                            : "Ativar"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isBusy ||
                                                            isCurrentUser
                                                        }
                                                        onClick={() =>
                                                            requestDelete(
                                                                selectedUser
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            min-h-10
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-danger/25
                                                            bg-surface
                                                            px-3
                                                            text-xs
                                                            font-medium
                                                            text-danger
                                                            transition-colors
                                                            hover:bg-danger-muted
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                        "
                                                    >
                                                        {isDeleting ? (
                                                            <FiLoader
                                                                size={
                                                                    15
                                                                }
                                                                className="animate-spin"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <FiTrash2
                                                                size={
                                                                    15
                                                                }
                                                                aria-hidden="true"
                                                            />
                                                        )}

                                                        Excluir
                                                    </button>
                                                </div>

                                                {isCurrentUser && (
                                                    <p
                                                        className="
                                                            mt-3
                                                            text-center
                                                            text-[11px]
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        As ações estão
                                                        desativadas para sua
                                                        própria conta.
                                                    </p>
                                                )}
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>

            <ConfirmDialog
                open={Boolean(userToDelete)}
                title="Excluir usuário?"
                description={
                    userToDelete
                        ? `O usuário "${userToDelete.name}" e todas as transações associadas serão excluídos permanentemente. Esta ação não poderá ser desfeita.`
                        : ""
                }
                confirmLabel="Excluir usuário"
                cancelLabel="Cancelar"
                loading={
                    deletingId ===
                    userToDelete?.id
                }
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <Snackbar
                message={
                    notification.message
                }
                type={notification.type}
                duration={4500}
                onClose={clearNotification}
            />
        </div>
    );
}

export default Users;