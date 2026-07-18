import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

import AuthLayout from "../components/auth/AuthLayout.jsx";
import PrivateLayout from "../components/layout/PrivateLayout.jsx";
import RouteFallback from "../components/system/RouteFallback.jsx";
import { lazyWithRetry } from "../lib/lazyWithRetry.js";
import AdminRoute from "./AdminRoute.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

const Dashboard = lazyWithRetry(() => import("../pages/Dashboard/Dashboard.jsx"));
const DesignSystem = lazyWithRetry(() => import("../pages/DesignSystem/DesignSystem.jsx"));
const Expenses = lazyWithRetry(() => import("../pages/Expenses/Expenses.jsx"));
const ForgotPassword = lazyWithRetry(() => import("../pages/ForgotPassword/ForgotPassword.jsx"));
const History = lazyWithRetry(() => import("../pages/History/History.jsx"));
const Login = lazyWithRetry(() => import("../pages/Login/Login.jsx"));
const NotFound = lazyWithRetry(() => import("../pages/NotFound/NotFound.jsx"));
const Profile = lazyWithRetry(() => import("../pages/Profile/Profile.jsx"));
const Register = lazyWithRetry(() => import("../pages/Register/Register.jsx"));
const ResetPassword = lazyWithRetry(() => import("../pages/ResetPassword/ResetPassword.jsx"));
const Revenues = lazyWithRetry(() => import("../pages/Revenues/Revenues.jsx"));
const Users = lazyWithRetry(() => import("../pages/Users/Users.jsx"));

function AppRoutes() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="cadastro" element={<Register />} />
                    <Route path="esqueci-senha" element={<ForgotPassword />} />
                    <Route path="redefinir-senha" element={<ResetPassword />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route element={<PrivateLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/receitas" element={<Revenues />} />
                        <Route path="/despesas" element={<Expenses />} />
                        <Route path="/historico" element={<History />} />
                        <Route path="/perfil" element={<Profile />} />

                        <Route element={<AdminRoute />}>
                            <Route path="/usuarios" element={<Users />} />
                            <Route path="/design-system" element={<DesignSystem />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
