import {
    Outlet,
} from "react-router";

import {
    useAuth,
} from "../hooks/useAuth.js";

import AccessDenied from "../pages/AccessDenied/AccessDenied.jsx";

function AdminRoute() {
    const { user } = useAuth();

    if (user?.role !== "ADMIN") {
        return <AccessDenied />;
    }

    return <Outlet />;
}

export default AdminRoute;
