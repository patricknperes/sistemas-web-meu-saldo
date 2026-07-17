import {
    useId,
    useRef,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiCloseLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import Portal from "./Portal.jsx";
import {
    mergeClassNames,
    useBodyScrollLock,
    useEscapeKey,
    useFocusTrap,
} from "./overlayUtils.js";

const positionClasses = {
    right: "inset-y-0 right-0 h-full w-[min(92vw,28rem)] border-l",
    left: "inset-y-0 left-0 h-full w-[min(92vw,28rem)] border-r",
    bottom: "inset-x-0 bottom-0 max-h-[88dvh] w-full rounded-t-2xl border-t",
};

const initialByPosition = {
    right: { x: "100%", y: 0 },
    left: { x: "-100%", y: 0 },
    bottom: { x: 0, y: "100%" },
};

function Drawer({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    children,
    footer,
    position = "right",
    closeLabel = "Fechar painel",
    closeOnBackdrop = true,
    closeOnEscape = true,
    initialFocusRef,
    returnFocusRef,
    className = "",
}) {
    const generatedId = useId().replace(/:/g, "");
    const titleId = `${generatedId}-title`;
    const descriptionId = `${generatedId}-description`;
    const drawerRef = useRef(null);
    const resolvedPosition = positionClasses[position] ? position : "right";

    function close() {
        onOpenChange?.(false);
    }

    useBodyScrollLock(open);
    useEscapeKey(open && closeOnEscape, close);
    useFocusTrap({
        enabled: open,
        containerRef: drawerRef,
        initialFocusRef,
        returnFocusRef,
    });

    return (
        <AnimatePresence>
            {open ? (
                <Portal>
                    <div className="fixed inset-0 z-[100]">
                        <motion.button
                            type="button"
                            aria-label={closeOnBackdrop ? closeLabel : undefined}
                            aria-hidden={!closeOnBackdrop}
                            tabIndex={-1}
                            className="absolute inset-0 cursor-default bg-overlay backdrop-blur-[2px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={closeOnBackdrop ? close : undefined}
                        />

                        <motion.aside
                            ref={drawerRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={title ? titleId : undefined}
                            aria-describedby={description ? descriptionId : undefined}
                            tabIndex={-1}
                            className={mergeClassNames(
                                "absolute z-10 flex flex-col overflow-hidden border-border bg-surface-elevated shadow-dialog",
                                positionClasses[resolvedPosition],
                                className
                            )}
                            initial={initialByPosition[resolvedPosition]}
                            animate={{ x: 0, y: 0 }}
                            exit={initialByPosition[resolvedPosition]}
                            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {resolvedPosition === "bottom" ? (
                                <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 rounded-pill bg-border-strong" />
                            ) : null}

                            <header className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
                                {Icon ? (
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                                        <Icon size={20} aria-hidden="true" />
                                    </span>
                                ) : null}

                                <div className="min-w-0 flex-1 pt-0.5">
                                    {title ? (
                                        <h2 id={titleId} className="text-section-title font-bold">
                                            {title}
                                        </h2>
                                    ) : null}

                                    {description ? (
                                        <p id={descriptionId} className="mt-1 text-body-sm text-muted-foreground">
                                            {description}
                                        </p>
                                    ) : null}
                                </div>

                                <IconButton
                                    icon={<RiCloseLine size={20} aria-hidden="true" />}
                                    label={closeLabel}
                                    variant="ghost"
                                    size="sm"
                                    onClick={close}
                                    className="-mr-1 -mt-1 shrink-0"
                                />
                            </header>

                            <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                                {children}
                            </div>

                            {footer ? (
                                <footer className="flex flex-col-reverse gap-3 border-t border-border bg-surface-subtle px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                    {footer}
                                </footer>
                            ) : null}
                        </motion.aside>
                    </div>
                </Portal>
            ) : null}
        </AnimatePresence>
    );
}

export default Drawer;
