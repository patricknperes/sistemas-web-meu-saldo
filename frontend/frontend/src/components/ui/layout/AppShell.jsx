import {
    cloneElement,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    AppShellContext,
} from "./AppShellContext.js";

function readStoredCollapsedState(
    storageKey,
    fallbackValue
) {
    if (
        !storageKey ||
        typeof window === "undefined"
    ) {
        return fallbackValue;
    }

    try {
        const storedValue =
            window.localStorage.getItem(
                storageKey
            );

        if (storedValue === null) {
            return fallbackValue;
        }

        return storedValue === "true";
    } catch {
        return fallbackValue;
    }
}

function renderSidebar(
    sidebar,
    mode
) {
    if (typeof sidebar === "function") {
        return sidebar({ mode });
    }

    if (isValidElement(sidebar)) {
        return cloneElement(
            sidebar,
            { mode }
        );
    }

    return sidebar;
}

function AppShell({
    children,
    sidebar,
    topbar,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    storageKey,
    displayMode = "responsive",
    embedded = false,
    contentClassName = "",
    className = "",
    style,
}) {
    const [internalCollapsed, setInternalCollapsed] =
        useState(() =>
            readStoredCollapsedState(
                storageKey,
                defaultCollapsed
            )
        );

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    const collapsed =
        controlledCollapsed ??
        internalCollapsed;

    const setCollapsed = useCallback(
        (nextValue) => {
            const resolvedValue =
                typeof nextValue === "function"
                    ? nextValue(collapsed)
                    : nextValue;

            if (
                controlledCollapsed ===
                undefined
            ) {
                setInternalCollapsed(
                    resolvedValue
                );
            }

            onCollapsedChange?.(
                resolvedValue
            );
        },
        [
            collapsed,
            controlledCollapsed,
            onCollapsedChange,
        ]
    );

    const toggleCollapsed = useCallback(
        () => {
            setCollapsed(
                (currentValue) =>
                    !currentValue
            );
        },
        [setCollapsed]
    );

    const openMobileSidebar = useCallback(
        () => {
            setMobileSidebarOpen(true);
        },
        []
    );

    const closeMobileSidebar = useCallback(
        () => {
            setMobileSidebarOpen(false);
        },
        []
    );

    const toggleMobileSidebar = useCallback(
        () => {
            setMobileSidebarOpen(
                (currentValue) =>
                    !currentValue
            );
        },
        []
    );

    useEffect(() => {
        if (!storageKey) {
            return;
        }

        try {
            window.localStorage.setItem(
                storageKey,
                String(collapsed)
            );
        } catch {
            // A preferência continua válida durante a sessão atual.
        }
    }, [collapsed, storageKey]);

    useEffect(() => {
        if (!mobileSidebarOpen) {
            return undefined;
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                closeMobileSidebar();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        if (embedded) {
            return () => {
                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        closeMobileSidebar,
        embedded,
        mobileSidebarOpen,
    ]);

    const contextValue = useMemo(
        () => ({
            collapsed,
            mobileSidebarOpen,
            displayMode,
            embedded,
            setCollapsed,
            toggleCollapsed,
            openMobileSidebar,
            closeMobileSidebar,
            toggleMobileSidebar,
        }),
        [
            closeMobileSidebar,
            collapsed,
            displayMode,
            embedded,
            mobileSidebarOpen,
            openMobileSidebar,
            setCollapsed,
            toggleCollapsed,
            toggleMobileSidebar,
        ]
    );

    const desktopSidebarClassName =
        displayMode === "desktop"
            ? "flex"
            : displayMode === "mobile"
                ? "hidden"
                : "hidden lg:flex";

    const mobileVisibilityClassName =
        displayMode === "mobile"
            ? ""
            : displayMode === "desktop"
                ? "hidden"
                : "lg:hidden";

    const overlayPositionClassName =
        embedded
            ? "absolute"
            : "fixed";

    return (
        <AppShellContext.Provider
            value={contextValue}
        >
            <div
                style={style}
                className={`
                    relative isolate
                    flex min-w-0
                    overflow-hidden
                    bg-background
                    text-foreground

                    ${embedded
                        ? "h-[680px] min-h-[560px] rounded-2xl border border-border shadow-card"
                        : "h-dvh min-h-0"
                    }

                    ${className}
                `}
            >
                <div
                    className={`
                        h-full shrink-0
                        ${desktopSidebarClassName}
                    `}
                >
                    {renderSidebar(
                        sidebar,
                        "desktop"
                    )}
                </div>

                <AnimatePresence>
                    {mobileSidebarOpen &&
                        displayMode !==
                            "desktop" && (
                            <>
                                <motion.button
                                    key="app-shell-overlay"
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
                                        duration: 0.18,
                                    }}
                                    className={`
                                        ${overlayPositionClassName}
                                        ${mobileVisibilityClassName}
                                        inset-0 z-40
                                        bg-overlay
                                        backdrop-blur-[2px]
                                    `}
                                />

                                <motion.div
                                    key="app-shell-mobile-sidebar"
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
                                    className={`
                                        ${overlayPositionClassName}
                                        ${mobileVisibilityClassName}
                                        inset-y-0 left-0
                                        z-50
                                        w-[min(86vw,288px)]
                                    `}
                                >
                                    {renderSidebar(
                                        sidebar,
                                        "mobile"
                                    )}
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
                    {topbar}

                    <main
                        className={`
                            min-w-0 flex-1
                            overflow-x-hidden
                            overflow-y-auto
                            scrollbar-subtle
                            ${contentClassName}
                        `}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </AppShellContext.Provider>
    );
}

export default AppShell;
