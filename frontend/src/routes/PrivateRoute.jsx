import { Navigate, Outlet, useLocation } from "react-router";

import RouteFallback from "../components/system/RouteFallback.jsx";
import { useAuth } from "../hooks/useAuth.js";

function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <RouteFallback fullScreen label="Verificando sua sessão" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default PrivateRoute;
