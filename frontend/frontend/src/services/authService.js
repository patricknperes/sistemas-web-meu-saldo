import { api } from "./api.js";

async function login(credentials) {
    const response = await api.post(
        "/auth/login",
        credentials
    );

    return response.data;
}

async function register(userData) {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
}

async function authenticateWithGoogle(
    credential
) {
    const normalizedCredential =
        typeof credential === "string"
            ? credential.trim()
            : "";

    if (!normalizedCredential) {
        throw new Error(
            "A credencial do Google não foi informada."
        );
    }

    const response = await api.post(
        "/auth/google",
        {
            credential:
                normalizedCredential,
        }
    );

    return response.data;
}

async function getCurrentUser() {
    const response =
        await api.get("/auth/me");

    return response.data;
}

export const authService = {
    login,
    register,
    authenticateWithGoogle,
    getCurrentUser,
};