import {
    Navigate,
    Route,
    Routes,
} from "react-router";

import AdminRoute from "./AdminRoute.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

import AuthLayout from "../components/auth/AuthLayout.jsx";
import PrivateLayout from "../components/layout/PrivateLayout.jsx";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Expenses from "../pages/Expenses/Expenses.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx";
import History from "../pages/History/History.jsx";
import Login from "../pages/Login/Login.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Register from "../pages/Register/Register.jsx";
import ResetPassword from "../pages/ResetPassword/ResetPassword.jsx";
import Revenues from "../pages/Revenues/Revenues.jsx";
import Users from "../pages/Users/Users.jsx";

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

            <Route element={<AuthLayout />}>
                <Route
                    path="login"
                    element={<Login />}
                />

                <Route
                    path="cadastro"
                    element={<Register />}
                />

                <Route
                    path="esqueci-senha"
                    element={
                        <ForgotPassword />
                    }
                />

                <Route
                    path="redefinir-senha"
                    element={
                        <ResetPassword />
                    }
                />
            </Route>

            <Route
                element={
                    <PrivateRoute />
                }
            >
                <Route
                    element={
                        <PrivateLayout />
                    }
                >
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />

                    <Route
                        path="/receitas"
                        element={
                            <Revenues />
                        }
                    />

                    <Route
                        path="/despesas"
                        element={
                            <Expenses />
                        }
                    />

                    <Route
                        path="/historico"
                        element={
                            <History />
                        }
                    />

                    <Route
                        path="/perfil"
                        element={
                            <Profile />
                        }
                    />

                    <Route
                        element={
                            <AdminRoute />
                        }
                    >
                        <Route
                            path="/usuarios"
                            element={
                                <Users />
                            }
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <NotFound />
                }
            />
        </Routes>
    );
}

export default AppRoutes;