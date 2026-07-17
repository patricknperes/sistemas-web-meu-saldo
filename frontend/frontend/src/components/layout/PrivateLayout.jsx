import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    Outlet,
    useLocation,
} from "react-router";

import {
    AppShell,
} from "../ui/layout/index.js";

import AppBar from "./AppBar.jsx";
import Sidebar from "./Sidebar.jsx";

function PrivateLayout() {
    const location = useLocation();

    return (
        <AppShell
            storageKey="sidebar-collapsed"
            defaultCollapsed={false}
            sidebar={({ mode }) => (
                <Sidebar mode={mode} />
            )}
            topbar={<AppBar />}
            contentClassName="scroll-smooth"
        >
            <AnimatePresence
                mode="wait"
                initial={false}
            >
                <motion.div
                    key={location.pathname}
                    initial={{
                        opacity: 0,
                        y: 5,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: -3,
                    }}
                    transition={{
                        duration: 0.18,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                    }}
                    className="min-h-full"
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </AppShell>
    );
}

export default PrivateLayout;
