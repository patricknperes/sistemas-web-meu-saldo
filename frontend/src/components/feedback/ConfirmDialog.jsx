import {
    useEffect,
    useId,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiAlertLine,
    RiCloseLine,
    RiLoader4Line,
} from "react-icons/ri";

function ConfirmDialog({
    open,
    title = "Confirmar ação",
    description = "Tem certeza de que deseja continuar?",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}) {
    const titleId = useId();
    const descriptionId = useId();

    const dialogReference = useRef(null);
    const cancelButtonReference = useRef(null);
    const previousActiveElementReference =
        useRef(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        previousActiveElementReference.current =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const focusTimeout = window.setTimeout(() => {
            cancelButtonReference.current?.focus();
        }, 0);

        function handleKeyDown(event) {
            if (
                event.key === "Escape" &&
                !loading
            ) {
                onCancel?.();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const dialog =
                dialogReference.current;

            if (!dialog) {
                return;
            }

            const focusableElements =
                dialog.querySelectorAll(
                    [
                        "button:not(:disabled)",
                        "a[href]",
                        "input:not(:disabled)",
                        "select:not(:disabled)",
                        "textarea:not(:disabled)",
                        '[tabindex]:not([tabindex="-1"])',
                    ].join(",")
                );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            }

            if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.clearTimeout(focusTimeout);

            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            previousActiveElementReference
                .current
                ?.focus?.();
        };
    }, [
        open,
        loading,
        onCancel,
    ]);

    function handleBackdropClick(event) {
        if (
            event.target === event.currentTarget &&
            !loading
        ) {
            onCancel?.();
        }
    }

    function handleCancel() {
        if (loading) {
            return;
        }

        onCancel?.();
    }

    function handleConfirm() {
        if (loading) {
            return;
        }

        onConfirm?.();
    }

    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="confirm-dialog-backdrop"
                    role="presentation"
                    onMouseDown={handleBackdropClick}
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
                    className="
                        fixed inset-0 z-[200]
                        flex items-center justify-center
                        bg-overlay
                        p-4
                    "
                >
                    <motion.div
                        ref={dialogReference}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        initial={{
                            opacity: 0,
                            y: 14,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            w-full max-w-md
                            overflow-hidden
                            rounded-card
                            border border-border
                            bg-surface
                            text-foreground
                            shadow-dialog
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-start gap-4
                                p-5
                                sm:p-6
                            "
                        >
                            <div
                                className="
                                    flex size-10 shrink-0
                                    items-center justify-center
                                    rounded-full
                                    bg-danger-muted
                                    text-danger
                                "
                            >
                                <RiAlertLine
                                    size={21}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2
                                    id={titleId}
                                    title={title}
                                    className="
                                        truncate
                                        text-base font-semibold
                                        text-foreground
                                    "
                                >
                                    {title}
                                </h2>

                                <p
                                    id={descriptionId}
                                    className="
                                        mt-1.5
                                        max-h-24
                                        overflow-y-auto
                                        break-words
                                        text-sm leading-6
                                        text-muted-foreground
                                        scrollbar-subtle
                                    "
                                >
                                    {description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                aria-label="Fechar diálogo"
                                title="Fechar"
                                className="
                                    -mr-2 -mt-2
                                    inline-flex size-9
                                    shrink-0
                                    items-center justify-center
                                    rounded-lg
                                    text-muted-foreground
                                    transition-colors
                                    hover:bg-surface-hover
                                    hover:text-foreground
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                <RiCloseLine size={20} />
                            </button>
                        </div>

                        <div
                            className="
                                flex flex-col-reverse
                                gap-2
                                border-t border-border
                                bg-surface-muted/40
                                p-4
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <button
                                ref={cancelButtonReference}
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="
                                    inline-flex min-h-11
                                    items-center justify-center
                                    rounded-control
                                    border border-border
                                    bg-surface
                                    px-4
                                    text-sm font-medium
                                    text-foreground
                                    transition-colors
                                    hover:bg-surface-hover
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >
                                <span className="truncate">
                                    {cancelLabel}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                                aria-busy={loading}
                                className="
                                    inline-flex min-h-11
                                    items-center justify-center
                                    gap-2
                                    rounded-control
                                    bg-danger
                                    px-4
                                    text-sm font-medium
                                    text-white
                                    transition-colors
                                    hover:bg-danger-hover
                                    disabled:pointer-events-none
                                    disabled:opacity-60
                                    dark:text-zinc-950
                                "
                            >
                                {loading && (
                                    <RiLoader4Line
                                        size={18}
                                        aria-hidden="true"
                                        className="animate-spin"
                                    />
                                )}

                                <span className="truncate">
                                    {loading
                                        ? "Excluindo..."
                                        : confirmLabel}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default ConfirmDialog;