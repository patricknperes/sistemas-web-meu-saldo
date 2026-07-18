import { formatDate } from "../../../utils/formatDate.js";

export function isSameUser(firstId, secondId) {
    if (firstId === null || firstId === undefined || secondId === null || secondId === undefined) return false;
    return String(firstId) === String(secondId);
}

export function getAdminUserRoleLabel(role) {
    return role === "ADMIN" ? "Administrador" : "Usuário";
}

export function getAdminUserStatusLabel(isActive) {
    return isActive ? "Ativo" : "Inativo";
}

export function getAdminUserDate(value) {
    const formatted = formatDate(value);
    return formatted === "-" ? "Não informado" : formatted;
}

export function getAdminUserAuthLabel(authMethods = {}) {
    if (authMethods.password && authMethods.google) return "Senha e Google";
    if (authMethods.google) return "Google";
    if (authMethods.password) return "Senha";
    return "Não informado";
}

export function buildAdminPaginationItems(currentPage, totalPages) {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}
