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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let componentIsMounted = true;

        async function loadUser() {
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response =
                    await authService.getCurrentUser();

                if (componentIsMounted) {
                    setUser(response.user);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);

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

    const login = useCallback(async (credentials) => {
        const response = await authService.login(
            credentials
        );

        localStorage.setItem(
            TOKEN_KEY,
            response.token
        );

        setUser(response.user);

        return response;
    }, []);

    const register = useCallback(async (userData) => {
        const response = await authService.register(
            userData
        );

        localStorage.setItem(
            TOKEN_KEY,
            response.token
        );

        setUser(response.user);

        return response;
    }, []);

    const updateAuthenticatedUser = useCallback(
        (updatedUser) => {
            setUser(updatedUser);
        },
        []
    );

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
            updateAuthenticatedUser,
        }),
        [
            user,
            loading,
            login,
            register,
            logout,
            updateAuthenticatedUser,
        ]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;