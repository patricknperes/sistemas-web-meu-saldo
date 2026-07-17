const roleOptions = {
    ADMIN: {
        value: "ADMIN",
        label: "Administrador",
        description: "Gerencia usuários, permissões e configurações sensíveis.",
    },
    USER: {
        value: "USER",
        label: "Usuário",
        description: "Acessa as funcionalidades financeiras da própria conta.",
    },
};

const statusOptions = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Ativo",
        description: "Pode entrar e utilizar normalmente o sistema.",
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Inativo",
        description: "O acesso está suspenso até uma nova ativação.",
    },
    PENDING: {
        value: "PENDING",
        label: "Pendente",
        description: "A conta ainda precisa concluir uma etapa de validação.",
    },
    BLOCKED: {
        value: "BLOCKED",
        label: "Bloqueado",
        description: "O acesso foi bloqueado por segurança ou administração.",
    },
};

function normalizeUserRole(value) {
    const normalized = String(value ?? "USER").trim().toUpperCase();
    return roleOptions[normalized] ? normalized : "USER";
}

function normalizeUserStatus(value) {
    const normalized = String(value ?? "ACTIVE").trim().toUpperCase();
    return statusOptions[normalized] ? normalized : "ACTIVE";
}

function getUserRoleMeta(value) {
    return roleOptions[normalizeUserRole(value)];
}

function getUserStatusMeta(value) {
    return statusOptions[normalizeUserStatus(value)];
}

function getUserInitials(name) {
    const parts = String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "US";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

export {
    getUserInitials,
    getUserRoleMeta,
    getUserStatusMeta,
    normalizeUserRole,
    normalizeUserStatus,
    roleOptions,
    statusOptions,
};
