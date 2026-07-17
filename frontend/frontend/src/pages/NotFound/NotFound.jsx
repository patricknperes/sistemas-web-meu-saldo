import {
    useNavigate,
} from "react-router";

import {
    AppLoadingScreen,
    NotFoundPage,
} from "../../components/ui/system/index.js";

import {
    useAuth,
} from "../../hooks/useAuth.js";

function NotFound() {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <AppLoadingScreen message="Verificando a melhor rota para continuar..." />
        );
    }

    return (
        <NotFoundPage
            homeTo={isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            onBack={() => navigate(-1)}
        />
    );
}

export default NotFound;
