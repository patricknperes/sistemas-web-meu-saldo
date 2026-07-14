import {
    Navigate,
    Outlet,
} from "react-router";

import { useAuth } from "../hooks/useAuth.js";

function AdminRoute() {
    const { user } = useAuth();

    if (user?.role !== "ADMIN") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}

export default AdminRoute;