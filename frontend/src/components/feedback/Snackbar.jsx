import {
    useEffect,
    useRef,
} from "react";

import { createPortal } from "react-dom";

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
        iconColor: "text-emerald-500",
        iconWrapper:
            "bg-emerald-50 border border-emerald-100",
        accent:
            "before:bg-emerald-200",
    },

    error: {
        title: "Erro",
        icon: RiErrorWarningLine,
        iconColor: "text-rose-500",
        iconWrapper:
            "bg-rose-50 border border-rose-100",
        accent:
            "before:bg-rose-200",
    },

    warning: {
        title: "Aviso",
        icon: RiErrorWarningLine,
        iconColor: "text-amber-500",
        iconWrapper:
            "bg-amber-50 border border-amber-100",
        accent:
            "before:bg-amber-200",
    },

    info: {
        title: "Informação",
        icon: RiInformationLine,
        iconColor: "text-sky-500",
        iconWrapper:
            "bg-sky-50 border border-sky-100",
        accent:
            "before:bg-sky-200",
    },
};

function Snackbar({
    message = "",
    type = "info",
    duration = 4500,
    onClose,
}) {
    const onCloseReference = useRef(onClose);

    useEffect(() => {
        onCloseReference.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!message || duration <= 0) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            onCloseReference.current?.();
        }, duration);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [message, duration]);

    if (typeof document === "undefined") {
        return null;
    }

    const selectedVariant =
        SNACKBAR_VARIANTS[type] ??
        SNACKBAR_VARIANTS.info;

    const Icon = selectedVariant.icon;

    function handleClose() {
        onCloseReference.current?.();
    }

    return createPortal(
        <AnimatePresence>
            {message && (
                <div
                    className="
                        pointer-events-none
                        fixed inset-x-3 top-3 z-[300]
                        flex justify-center
                        sm:inset-x-auto sm:right-5 sm:top-5 sm:justify-end
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
                            y: -16,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -12,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`
                            pointer-events-auto
                            relative w-full max-w-[420px]
                            overflow-hidden rounded-2xl
                            bg-white text-slate-900
                            shadow-[0_12px_30px_rgba(15,23,42,0.10)]
                            ring-1 ring-slate-200/80

                            before:absolute
                            before:left-0 before:top-0
                            before:h-full before:w-1.5
                            ${selectedVariant.accent}
                        `}
                    >
                        <div
                            className="
                                flex items-start gap-3
                                px-4 py-4
                            "
                        >
                            <div
                                className={`
                                    flex h-12 w-12 shrink-0
                                    items-center justify-center
                                    rounded-2xl
                                    ${selectedVariant.iconWrapper}
                                `}
                            >
                                <Icon
                                    size={22}
                                    aria-hidden="true"
                                    className={selectedVariant.iconColor}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        flex min-w-0 items-start
                                        justify-between gap-3
                                    "
                                >
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                truncate
                                                text-[15px] font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {selectedVariant.title}
                                        </p>

                                        <p
                                            title={message}
                                            className="
                                                mt-1 line-clamp-2
                                                text-sm leading-6
                                                text-slate-500
                                            "
                                        >
                                            {message}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        aria-label="Fechar notificação"
                                        title="Fechar"
                                        className="
                                            inline-flex h-8 w-8 shrink-0
                                            items-center justify-center
                                            rounded-lg
                                            text-slate-400
                                            transition-colors
                                            hover:bg-slate-100
                                            hover:text-slate-600
                                        "
                                    >
                                        <RiCloseLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default Snackbar;