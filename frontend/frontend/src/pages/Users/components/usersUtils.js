const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function getUserStatus(user) {
    return user?.isActive ? "ACTIVE" : "INACTIVE";
}

function getUsersStatistics(users = []) {
    const total = users.length;
    const administrators = users.filter(
        (user) => user.role === "ADMIN"
    ).length;
    const active = users.filter(
        (user) => Boolean(user.isActive)
    ).length;

    return {
        total,
        administrators,
        active,
        inactive: total - active,
    };
}

function filterUsers(
    users = [],
    {
        search = "",
        role = "ALL",
        status = "ALL",
    } = {}
) {
    const normalizedSearch = String(search)
        .trim()
        .toLocaleLowerCase("pt-BR");

    return users.filter((user) => {
        const searchableContent = [
            user.name,
            user.email,
        ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("pt-BR");

        const matchesSearch =
            !normalizedSearch ||
            searchableContent.includes(normalizedSearch);

        const matchesRole =
            role === "ALL" || user.role === role;

        const userStatus = getUserStatus(user);
        const matchesStatus =
            status === "ALL" || userStatus === status;

        return matchesSearch && matchesRole && matchesStatus;
    });
}

function toUserFormValue(user) {
    return {
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "USER",
        status: getUserStatus(user),
    };
}

function validateUserForm(value = {}) {
    const name = String(value.name ?? "").trim();
    const email = String(value.email ?? "").trim().toLowerCase();

    if (name.length < 2) {
        return "O nome deve possuir pelo menos 2 caracteres.";
    }

    if (name.length > 100) {
        return "O nome deve possuir no máximo 100 caracteres.";
    }

    if (!EMAIL_PATTERN.test(email)) {
        return "Informe um endereço de e-mail válido.";
    }

    if (!["USER", "ADMIN"].includes(value.role)) {
        return "Selecione um tipo de conta válido.";
    }

    if (!["ACTIVE", "INACTIVE"].includes(value.status)) {
        return "Selecione um estado de acesso válido.";
    }

    return "";
}

function createUserUpdatePayload(
    currentUser,
    formValue,
    ownAccount = false
) {
    const payload = {};
    const normalizedName = String(formValue.name ?? "").trim();
    const normalizedEmail = String(formValue.email ?? "")
        .trim()
        .toLowerCase();

    if (normalizedName !== String(currentUser?.name ?? "").trim()) {
        payload.name = normalizedName;
    }

    if (
        normalizedEmail !==
        String(currentUser?.email ?? "").trim().toLowerCase()
    ) {
        payload.email = normalizedEmail;
    }

    if (!ownAccount) {
        if (formValue.role !== (currentUser?.role ?? "USER")) {
            payload.role = formValue.role;
        }

        const nextActiveStatus = formValue.status === "ACTIVE";

        if (nextActiveStatus !== Boolean(currentUser?.isActive)) {
            payload.isActive = nextActiveStatus;
        }
    }

    return payload;
}

function getErrorMessage(
    error,
    fallback = "Não foi possível concluir a operação."
) {
    return (
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
}

export {
    createUserUpdatePayload,
    filterUsers,
    getErrorMessage,
    getUsersStatistics,
    getUserStatus,
    isSameUser,
    toUserFormValue,
    validateUserForm,
};
