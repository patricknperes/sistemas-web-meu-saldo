import { userService } from "../../../services/userService.js";

export const adminUserKeys = {
    all: ["admin-users"],
    list: (filters) => [...adminUserKeys.all, "list", filters],
    detail: (id) => [...adminUserKeys.all, "detail", id],
};

export function fetchAdminUsers(filters) {
    return userService.list(filters);
}

export async function fetchAdminUser(id) {
    const response = await userService.getById(id);
    return response?.user ?? response;
}
