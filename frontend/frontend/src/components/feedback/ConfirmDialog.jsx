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
    RiDeleteBinLine,
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
    const titleId =
        useId();

    const descriptionId =
        useId();

    const dialogReference =
        useRef(null);

    const cancelButtonReference =
        useRef(null);

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

        document.body.style.overflow =
            "hidden";

        const focusFrame =
            window.requestAnimationFrame(
                () => {
                    cancelButtonReference
                        .current
                        ?.focus();
                }
            );

        function handleKeyDown(
            event
        ) {
            if (
                event.key ===
                "Escape" &&
                !loading
            ) {
                onCancel?.();
                return;
            }

            if (
                event.key !==
                "Tab"
            ) {
                return;
            }

            const dialog =
                dialogReference.current;

            if (!dialog) {
                return;
            }

            const focusableElements =
                Array.from(
                    dialog.querySelectorAll(
                        [
                            "button:not(:disabled)",
                            "a[href]",
                            "input:not(:disabled)",
                            "select:not(:disabled)",
                            "textarea:not(:disabled)",
                            '[tabindex]:not([tabindex="-1"])',
                        ].join(",")
                    )
                );

            if (
                focusableElements.length ===
                0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length -
                1
                ];

            if (
                event.shiftKey &&
                document.activeElement ===
                firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement ===
                lastElement
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
            window.cancelAnimationFrame(
                focusFrame
            );

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

    function handleBackdropClick(
        event
    ) {
        if (
            event.target ===
            event.currentTarget &&
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

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="confirm-dialog-backdrop"
                    role="presentation"
                    onMouseDown={
                        handleBackdropClick
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
                        z-[200]
                        flex items-end
                        justify-center
                        bg-slate-950/55
                        backdrop-blur-sm
                        sm:items-center
                        sm:p-5
                    "
                >
                    <motion.div
                        ref={
                            dialogReference
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={
                            titleId
                        }
                        aria-describedby={
                            descriptionId
                        }
                        initial={{
                            opacity: 0,
                            y: 28,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.25,
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
                            rounded-t-[28px]
                            border border-border
                            bg-surface
                            text-foreground
                            shadow-2xl
                            sm:rounded-[28px]
                        "
                    >
                        <header
                            className="
                                relative
                                isolate
                                overflow-hidden
                                bg-gradient-to-br
                                from-rose-500
                                via-rose-600
                                to-red-700
                                px-5 py-5
                                text-white
                                sm:px-6
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    -right-10 -top-12
                                    size-32
                                    rounded-full
                                    bg-white/15
                                    blur-2xl
                                "
                            />

                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    -bottom-16 left-1/3
                                    size-36
                                    rounded-full
                                    bg-black/10
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    relative z-10
                                    flex min-w-0
                                    items-start gap-3
                                "
                            >
                                <span
                                    className="
                                        flex size-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-white/15
                                        ring-1
                                        ring-inset
                                        ring-white/20
                                        backdrop-blur-sm
                                    "
                                >
                                    <RiAlertLine
                                        size={21}
                                        aria-hidden="true"
                                    />
                                </span>

                                <div
                                    className="
                                        min-w-0 flex-1
                                    "
                                >
                                    <span
                                        className="
                                            inline-flex
                                            rounded-full
                                            bg-white/15
                                            px-2.5 py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.1em]
                                            text-white/85
                                            ring-1
                                            ring-inset
                                            ring-white/15
                                        "
                                    >
                                        Atenção
                                    </span>

                                    <h2
                                        id={titleId}
                                        title={title}
                                        className="
                                            mt-2
                                            truncate
                                            text-lg
                                            font-semibold
                                            tracking-tight
                                            sm:text-xl
                                        "
                                    >
                                        {title}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        loading
                                    }
                                    aria-label="Fechar diálogo"
                                    title="Fechar"
                                    className="
                                        inline-flex size-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-white/10
                                        text-white/80
                                        ring-1
                                        ring-inset
                                        ring-white/15
                                        transition
                                        hover:bg-white/20
                                        hover:text-white
                                        focus-visible:outline-none
                                        focus-visible:ring-4
                                        focus-visible:ring-white/15
                                        disabled:pointer-events-none
                                        disabled:opacity-40
                                    "
                                >
                                    <RiCloseLine
                                        size={20}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </header>

                        <div
                            className="
                                px-5 py-5
                                sm:px-6
                            "
                        >
                            <div
                                className="
                                    flex items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-rose-500/15
                                    bg-rose-500/[0.045]
                                    p-4
                                "
                            >
                                <span
                                    className="
                                        mt-0.5
                                        flex size-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-rose-500/10
                                        text-rose-600
                                        ring-1
                                        ring-inset
                                        ring-rose-500/15
                                        dark:text-rose-400
                                    "
                                >
                                    <RiDeleteBinLine
                                        size={17}
                                        aria-hidden="true"
                                    />
                                </span>

                                <p
                                    id={
                                        descriptionId
                                    }
                                    className="
                                        max-h-32
                                        overflow-y-auto
                                        break-words
                                        text-sm
                                        leading-6
                                        text-muted-foreground
                                        scrollbar-subtle
                                    "
                                >
                                    {description}
                                </p>
                            </div>

                            <p
                                className="
                                    mt-4
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Confirme apenas se tiver certeza. Esta ação pode não ser reversível.
                            </p>
                        </div>

                        <footer
                            className="
                                flex
                                flex-col-reverse
                                gap-2.5
                                border-t
                                border-border
                                bg-surface-muted/35
                                px-5 py-4
                                sm:flex-row
                                sm:justify-end
                                sm:px-6
                            "
                        >
                            <button
                                ref={
                                    cancelButtonReference
                                }
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-foreground
                                    transition
                                    hover:border-border-strong
                                    hover:bg-surface-hover
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-ring/20
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >
                                <span className="truncate">
                                    {cancelLabel}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleConfirm
                                }
                                disabled={
                                    loading
                                }
                                aria-busy={
                                    loading
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-rose-500
                                    via-rose-600
                                    to-red-700
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-rose-500/20
                                    transition
                                    hover:-translate-y-0.5
                                    hover:shadow-xl
                                    hover:shadow-rose-500/25
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-rose-500/25
                                    disabled:pointer-events-none
                                    disabled:opacity-60
                                    sm:w-auto
                                "
                            >
                                {loading ? (
                                    <RiLoader4Line
                                        size={18}
                                        aria-hidden="true"
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RiDeleteBinLine
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}

                                <span className="truncate">
                                    {loading
                                        ? "Excluindo..."
                                        : confirmLabel
                                    }
                                </span>
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default ConfirmDialog;