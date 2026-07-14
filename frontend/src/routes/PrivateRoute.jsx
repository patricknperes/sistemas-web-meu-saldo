import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router";

import { useAuth } from "../hooks/useAuth.js";

function PrivateRoute() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-600">
                    Carregando...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return <Outlet />;
}

export default PrivateRoute;