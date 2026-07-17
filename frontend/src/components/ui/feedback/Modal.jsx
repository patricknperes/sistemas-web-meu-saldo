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

const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-xl",
    lg: "sm:max-w-3xl",
    xl: "sm:max-w-5xl",
    full: "sm:max-w-[calc(100vw-3rem)]",
};

function Modal({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    children,
    footer,
    size = "md",
    closeLabel = "Fechar modal",
    closeOnBackdrop = true,
    closeOnEscape = true,
    hideCloseButton = false,
    initialFocusRef,
    returnFocusRef,
    className = "",
    bodyClassName = "",
}) {
    const generatedId = useId().replace(/:/g, "");
    const titleId = `${generatedId}-title`;
    const descriptionId = `${generatedId}-description`;
    const dialogRef = useRef(null);

    function close() {
        onOpenChange?.(false);
    }

    useBodyScrollLock(open);
    useEscapeKey(open && closeOnEscape, close);
    useFocusTrap({
        enabled: open,
        containerRef: dialogRef,
        initialFocusRef,
        returnFocusRef,
    });

    return (
        <AnimatePresence>
            {open ? (
                <Portal>
                    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
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

                        <motion.div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={title ? titleId : undefined}
                            aria-describedby={description ? descriptionId : undefined}
                            tabIndex={-1}
                            className={mergeClassNames(
                                "relative z-10 flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-overlay border border-border bg-surface-elevated shadow-dialog sm:max-h-[calc(100dvh-3rem)] sm:rounded-overlay",
                                sizeClasses[size] || sizeClasses.md,
                                className
                            )}
                            initial={{ opacity: 0, y: 24, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.99 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {(title || description || Icon || !hideCloseButton) ? (
                                <header className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
                                    {Icon ? (
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-muted text-primary">
                                            <Icon size={20} aria-hidden="true" />
                                        </span>
                                    ) : null}

                                    <div className="min-w-0 flex-1 pt-0.5">
                                        {title ? (
                                            <h2 id={titleId} className="text-section-title font-title">
                                                {title}
                                            </h2>
                                        ) : null}

                                        {description ? (
                                            <p id={descriptionId} className="mt-1 text-body-sm text-muted-foreground">
                                                {description}
                                            </p>
                                        ) : null}
                                    </div>

                                    {!hideCloseButton ? (
                                        <IconButton
                                            icon={<RiCloseLine size={20} aria-hidden="true" />}
                                            label={closeLabel}
                                            variant="ghost"
                                            size="sm"
                                            onClick={close}
                                            className="-mr-1 -mt-1 shrink-0"
                                        />
                                    ) : null}
                                </header>
                            ) : null}

                            <div className={mergeClassNames(
                                "scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6",
                                bodyClassName
                            )}>
                                {children}
                            </div>

                            {footer ? (
                                <footer className="flex flex-col-reverse gap-3 border-t border-border bg-surface-subtle px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                    {footer}
                                </footer>
                            ) : null}
                        </motion.div>
                    </div>
                </Portal>
            ) : null}
        </AnimatePresence>
    );
}

export default Modal;
