import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router";

import AppBar from "./AppBar.jsx";
import MobileBottomNavigation from "./MobileBottomNavigation.jsx";
import Sidebar from "./Sidebar.jsx";

function getInitialCollapsedState() {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
}

function PrivateLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsedState);
    const location = useLocation();

    useEffect(() => {
        try { localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed)); } catch { /* mantém funcionamento sem storage */ }
    }, [sidebarCollapsed]);

    useEffect(() => { setMobileSidebarOpen(false); }, [location.pathname]);

    useEffect(() => {
        if (!mobileSidebarOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKeyDown = (event) => event.key === "Escape" && setMobileSidebarOpen(false);
        window.addEventListener("keydown", onKeyDown);
        return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
    }, [mobileSidebarOpen]);

    return (
        <div className="relative flex h-dvh min-w-0 overflow-hidden bg-background text-foreground">
            <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition focus:translate-y-0">Pular para o conteúdo</a>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-52 -top-64 size-[560px] rounded-full bg-primary/[0.055] blur-3xl" />
                <div className="absolute -bottom-72 left-1/4 size-[620px] rounded-full bg-secondary/[0.035] blur-3xl" />
            </div>

            <Sidebar mode="desktop" collapsed={sidebarCollapsed} />

            <AnimatePresence>
                {mobileSidebarOpen && <>
                    <motion.button key="overlay" type="button" aria-label="Fechar menu" onClick={() => setMobileSidebarOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm lg:hidden" />
                    <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="fixed inset-y-0 right-0 z-50 w-[min(88vw,320px)] lg:hidden">
                        <Sidebar mode="mobile" onClose={() => setMobileSidebarOpen(false)} />
                    </motion.div>
                </>}
            </AnimatePresence>

            <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
                <AppBar sidebarCollapsed={sidebarCollapsed} onToggleDesktopSidebar={() => setSidebarCollapsed((value) => !value)} />
                <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth pb-24 outline-none scrollbar-subtle lg:pb-0">
                    <motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="min-h-full">
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            <MobileBottomNavigation onOpenMenu={() => setMobileSidebarOpen(true)} />
        </div>
    );
}

export default PrivateLayout;
