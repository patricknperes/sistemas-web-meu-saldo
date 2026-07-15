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
    ] = useState(
        getInitialCollapsedState
    );

    useEffect(() => {
        try {
            localStorage.setItem(
                "sidebar-collapsed",
                String(
                    sidebarCollapsed
                )
            );
        } catch {
            // A Sidebar continua funcionando.
        }
    }, [sidebarCollapsed]);

    useEffect(() => {
        function handleKeyDown(
            event
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                setMobileSidebarOpen(
                    false
                );
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
            document.body.style
                .overflow;

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
            (currentState) =>
                !currentState
        );
    }

    return (
        <div
            className="
                relative
                flex
                h-screen h-dvh
                min-w-0
                overflow-hidden
                bg-background
                text-foreground
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -right-40 -top-52
                        size-[420px]
                        rounded-full
                        bg-primary/[0.025]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-56 left-1/3
                        size-[420px]
                        rounded-full
                        bg-sky-500/[0.02]
                        blur-3xl
                    "
                />
            </div>

            <Sidebar
                mode="desktop"
                collapsed={
                    sidebarCollapsed
                }
            />

            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.button
                            key="sidebar-overlay"
                            type="button"
                            aria-label="Fechar menu lateral"
                            onClick={
                                closeMobileSidebar
                            }
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
                                fixed inset-0
                                z-40
                                bg-slate-950/55
                                backdrop-blur-sm
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
                                stiffness: 340,
                                damping: 34,
                                mass: 0.8,
                            }}
                            className="
                                fixed inset-y-0
                                left-0 z-50
                                w-[min(86vw,288px)]
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
                    relative z-10
                    flex min-w-0
                    flex-1 flex-col
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
                        scroll-smooth
                        scrollbar-subtle
                    "
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 6,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.24,
                        }}
                        className="
                            min-h-full
                        "
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

export default PrivateLayout;