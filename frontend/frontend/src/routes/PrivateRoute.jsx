import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router";

import {
    AppLoadingScreen,
} from "../components/ui/system/index.js";

import {
    useAuth,
} from "../hooks/useAuth.js";

function PrivateRoute() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {
        return <AppLoadingScreen />;
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
