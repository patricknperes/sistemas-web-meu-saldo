import {
    useEffect,
    useState,
} from "react";

import {
    Outlet,
} from "react-router";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import AppBar from "./AppBar.jsx";
import Sidebar from "./Sidebar.jsx";

function getInitialCollapsedState() {
    try {
        return (
            localStorage.getItem(
                "sidebar-collapsed"
            ) === "true"
        );
    } catch {
        return false;
    }
}

function PrivateLayout() {
    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);

    const [
        sidebarCollapsed,
        setSidebarCollapsed,
    ] = useState(getInitialCollapsedState);

    useEffect(() => {
        try {
            localStorage.setItem(
                "sidebar-collapsed",
                String(sidebarCollapsed)
            );
        } catch {
            // A Sidebar continua funcionando.
        }
    }, [sidebarCollapsed]);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setMobileSidebarOpen(false);
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    useEffect(() => {
        if (!mobileSidebarOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [mobileSidebarOpen]);

    function openMobileSidebar() {
        setMobileSidebarOpen(true);
    }

    function closeMobileSidebar() {
        setMobileSidebarOpen(false);
    }

    function toggleDesktopSidebar() {
        setSidebarCollapsed(
            (currentState) => !currentState
        );
    }

    return (
        <div
            className="
                flex
                h-screen h-dvh
                min-w-0
                overflow-hidden
                bg-background
                text-foreground
            "
        >
            <Sidebar
                mode="desktop"
                collapsed={sidebarCollapsed}
            />

            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.button
                            key="sidebar-overlay"
                            type="button"
                            aria-label="Fechar menu lateral"
                            onClick={closeMobileSidebar}
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="
                                fixed inset-0 z-40
                                bg-overlay
                                lg:hidden
                            "
                        />

                        <motion.div
                            key="mobile-sidebar"
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "-100%",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 36,
                                mass: 0.8,
                            }}
                            className="
                                fixed inset-y-0 left-0
                                z-50
                                w-[min(84vw,280px)]
                                lg:hidden
                            "
                        >
                            <Sidebar
                                mode="mobile"
                                onClose={
                                    closeMobileSidebar
                                }
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div
                className="
                    flex min-w-0 flex-1
                    flex-col
                    overflow-hidden
                "
            >
                <AppBar
                    sidebarCollapsed={
                        sidebarCollapsed
                    }
                    mobileSidebarOpen={
                        mobileSidebarOpen
                    }
                    onOpenMobileSidebar={
                        openMobileSidebar
                    }
                    onToggleDesktopSidebar={
                        toggleDesktopSidebar
                    }
                />

                <main
                    className="
                        min-w-0 flex-1
                        overflow-x-hidden
                        overflow-y-auto
                        scrollbar-subtle
                    "
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PrivateLayout;