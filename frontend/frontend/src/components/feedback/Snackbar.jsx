import {
    useEffect,
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
    RiCheckboxCircleLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiInformationLine,
} from "react-icons/ri";

const SNACKBAR_VARIANTS = {
    success: {
        title: "Sucesso",
        icon: RiCheckboxCircleLine,

        iconContainer:
            "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400",

        badge:
            "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-300",

        accent:
            "from-emerald-500 to-teal-500",

        progress:
            "bg-emerald-500",
    },

    error: {
        title: "Erro",
        icon: RiErrorWarningLine,

        iconContainer:
            "bg-rose-500/10 text-rose-600 ring-1 ring-inset ring-rose-500/15 dark:text-rose-400",

        badge:
            "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/15 dark:text-rose-300",

        accent:
            "from-rose-500 to-red-500",

        progress:
            "bg-rose-500",
    },

    warning: {
        title: "Aviso",
        icon: RiErrorWarningLine,

        iconContainer:
            "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/15 dark:text-amber-400",

        badge:
            "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/15 dark:text-amber-300",

        accent:
            "from-amber-500 to-orange-500",

        progress:
            "bg-amber-500",
    },

    info: {
        title: "Informação",
        icon: RiInformationLine,

        iconContainer:
            "bg-sky-500/10 text-sky-600 ring-1 ring-inset ring-sky-500/15 dark:text-sky-400",

        badge:
            "bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-500/15 dark:text-sky-300",

        accent:
            "from-sky-500 to-blue-500",

        progress:
            "bg-sky-500",
    },
};

function Snackbar({
    message = "",
    type = "info",
    duration = 4500,
    onClose,
}) {
    const onCloseReference =
        useRef(onClose);

    useEffect(() => {
        onCloseReference.current =
            onClose;
    }, [onClose]);

    useEffect(() => {
        if (
            !message ||
            duration <= 0
        ) {
            return undefined;
        }

        const timeout =
            window.setTimeout(
                () => {
                    onCloseReference
                        .current
                        ?.();
                },
                duration
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        message,
        duration,
    ]);

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    const selectedVariant =
        SNACKBAR_VARIANTS[type] ??
        SNACKBAR_VARIANTS.info;

    const Icon =
        selectedVariant.icon;

    function handleClose() {
        onCloseReference
            .current
            ?.();
    }

    return createPortal(
        <AnimatePresence>
            {message && (
                <div
                    className="
                        pointer-events-none
                        fixed inset-x-3 top-3
                        z-[300]
                        flex justify-center
                        sm:inset-x-auto
                        sm:right-5 sm:top-5
                        sm:justify-end
                    "
                >
                    <motion.div
                        key={`${type}-${message}`}
                        role={
                            type === "error"
                                ? "alert"
                                : "status"
                        }
                        aria-live={
                            type === "error"
                                ? "assertive"
                                : "polite"
                        }
                        aria-atomic="true"
                        initial={{
                            opacity: 0,
                            x: 22,
                            y: -10,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            x: 18,
                            y: -8,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.24,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            pointer-events-auto
                            relative
                            w-full max-w-[430px]
                            overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-surface/95
                            text-foreground
                            shadow-2xl
                            shadow-slate-950/10
                            backdrop-blur-xl
                        "
                    >
                        <div
                            className={`
                                h-1 w-full
                                bg-gradient-to-r

                                ${selectedVariant.accent}
                            `}
                        />

                        <div
                            className="
                                flex min-w-0
                                items-start gap-3
                                px-4 py-4
                            "
                        >
                            <span
                                className={`
                                    flex size-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl

                                    ${selectedVariant.iconContainer}
                                `}
                            >
                                <Icon
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <div
                                className="
                                    min-w-0 flex-1
                                "
                            >
                                <div
                                    className="
                                        flex min-w-0
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div className="min-w-0 flex-1">
                                        <span
                                            className={`
                                                inline-flex
                                                rounded-full
                                                px-2.5 py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.1em]

                                                ${selectedVariant.badge}
                                            `}
                                        >
                                            {
                                                selectedVariant.title
                                            }
                                        </span>

                                        <p
                                            title={message}
                                            className="
                                                mt-2
                                                line-clamp-3
                                                break-words
                                                text-sm
                                                leading-6
                                                text-muted-foreground
                                            "
                                        >
                                            {message}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleClose
                                        }
                                        aria-label="Fechar notificação"
                                        title="Fechar"
                                        className="
                                            -mr-1 -mt-1
                                            inline-flex size-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            text-muted-foreground
                                            transition
                                            hover:bg-surface-hover
                                            hover:text-foreground
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-ring/20
                                        "
                                    >
                                        <RiCloseLine
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {duration > 0 && (
                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-x-0 bottom-0
                                    h-0.5
                                    bg-surface-muted
                                "
                            >
                                <motion.span
                                    key={`${type}-${message}-progress`}
                                    initial={{
                                        scaleX: 1,
                                    }}
                                    animate={{
                                        scaleX: 0,
                                    }}
                                    transition={{
                                        duration:
                                            duration /
                                            1000,

                                        ease: "linear",
                                    }}
                                    className={`
                                        block h-full w-full
                                        origin-left

                                        ${selectedVariant.progress}
                                    `}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default Snackbar;