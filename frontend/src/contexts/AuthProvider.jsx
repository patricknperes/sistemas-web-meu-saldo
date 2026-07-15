import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { AuthContext } from "./AuthContext.js";
import { authService } from "../services/authService.js";
import { TOKEN_KEY } from "../services/api.js";

function AuthProvider({ children }) {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const saveAuthenticatedSession =
        useCallback((response) => {
            if (
                !response?.token ||
                !response?.user
            ) {
                throw new Error(
                    "A resposta de autenticação é inválida."
                );
            }

            localStorage.setItem(
                TOKEN_KEY,
                response.token
            );

            setUser(response.user);

            return response;
        }, []);

    useEffect(() => {
        let componentIsMounted = true;

        async function loadUser() {
            const token =
                localStorage.getItem(
                    TOKEN_KEY
                );

            if (!token) {
                if (componentIsMounted) {
                    setLoading(false);
                }

                return;
            }

            try {
                const response =
                    await authService.getCurrentUser();

                if (componentIsMounted) {
                    setUser(response.user);
                }
            } catch {
                localStorage.removeItem(
                    TOKEN_KEY
                );

                if (componentIsMounted) {
                    setUser(null);
                }
            } finally {
                if (componentIsMounted) {
                    setLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            componentIsMounted = false;
        };
    }, []);

    const login = useCallback(
        async (credentials) => {
            const response =
                await authService.login(
                    credentials
                );

            return saveAuthenticatedSession(
                response
            );
        },
        [saveAuthenticatedSession]
    );

    const register = useCallback(
        async (userData) => {
            const response =
                await authService.register(
                    userData
                );

            return saveAuthenticatedSession(
                response
            );
        },
        [saveAuthenticatedSession]
    );

    const authenticateWithGoogle =
        useCallback(
            async (credential) => {
                const response =
                    await authService
                        .authenticateWithGoogle(
                            credential
                        );

                return saveAuthenticatedSession(
                    response
                );
            },
            [saveAuthenticatedSession]
        );

    const updateAuthenticatedUser =
        useCallback(
            (updatedUser) => {
                setUser((currentUser) => ({
                    ...currentUser,
                    ...updatedUser,
                }));
            },
            []
        );

    const logout = useCallback(() => {
        localStorage.removeItem(
            TOKEN_KEY
        );

        setUser(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated:
                Boolean(user),

            login,
            register,
            authenticateWithGoogle,
            logout,
            updateAuthenticatedUser,
        }),
        [
            user,
            loading,
            login,
            register,
            authenticateWithGoogle,
            logout,
            updateAuthenticatedUser,
        ]
    );

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;