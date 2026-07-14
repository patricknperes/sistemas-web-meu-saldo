import { useState } from "react";
import { Outlet } from "react-router";

import AppBar from "./AppBar.jsx";
import Sidebar from "./Sidebar.jsx";

function PrivateLayout() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    function openSidebar() {
        setSidebarOpen(true);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="min-h-screen bg-slate-100 lg:flex">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                />
            )}

            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <AppBar onMenuClick={openSidebar} />

                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PrivateLayout;