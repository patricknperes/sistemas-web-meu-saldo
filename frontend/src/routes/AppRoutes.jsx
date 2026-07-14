import {
    Navigate,
    Route,
    Routes,
} from "react-router";

import AdminRoute from "./AdminRoute.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

import PrivateLayout from "../components/layout/PrivateLayout.jsx";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Expenses from "../pages/Expenses/Expenses.jsx";
import Login from "../pages/Login/Login.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Register from "../pages/Register/Register.jsx";
import Revenues from "../pages/Revenues/Revenues.jsx";
import Users from "../pages/Users/Users.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import History from "../pages/History/History.jsx";


function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/cadastro"
                element={<Register />}
            />

            <Route element={<PrivateRoute />}>
                <Route element={<PrivateLayout />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/receitas"
                        element={<Revenues />}
                    />

                    <Route
                        path="/despesas"
                        element={<Expenses />}
                    />

                    <Route
                        path="/historico"
                        element={<History />}
                    />

                    <Route
                        path="/perfil"
                        element={<Profile />}
                    />

                    <Route element={<AdminRoute />}>
                        <Route
                            path="/usuarios"
                            element={<Users />}
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}

export default AppRoutes;