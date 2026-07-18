import { formatDate } from "../../../utils/formatDate.js";

export function getProfileRoleLabel(role) {
    return role === "ADMIN" ? "Administrador" : "Usuário";
}

export function getProfileStatusLabel(isActive) {
    return isActive ? "Conta ativa" : "Conta inativa";
}

export function getProfileAuthMethods(authMethods = {}) {
    const methods = [];

    if (authMethods.password) methods.push("Senha");
    if (authMethods.google) methods.push("Google");

    return methods.length ? methods.join(" e ") : "Não informado";
}

export function getProfileDate(value) {
    const formattedDate = formatDate(value);
    return formattedDate === "-" ? "Não informado" : formattedDate;
}
