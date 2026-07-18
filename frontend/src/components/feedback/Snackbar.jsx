import { useEffect } from "react";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import IconButton from "../ui/IconButton.jsx";

const variants = {
    success: { title: "Sucesso", icon: CheckCircle2, className: "bg-success-muted text-success" },
    error: { title: "Erro", icon: AlertCircle, className: "bg-danger-muted text-danger" },
    warning: { title: "Aviso", icon: TriangleAlert, className: "bg-warning-muted text-warning" },
    info: { title: "Informação", icon: Info, className: "bg-info-muted text-info" },
};

function Snackbar({ message = "", type = "info", duration = 4500, onClose }) {
    useEffect(() => {
        if (!message || duration <= 0) return undefined;
        const timeout = window.setTimeout(() => onClose?.(), duration);
        return () => window.clearTimeout(timeout);
    }, [duration, message, onClose]);

    const variant = variants[type] ?? variants.info;
    const Icon = variant.icon;

    return (
        <AnimatePresence>
            {message && (
                <div className="pointer-events-none fixed inset-x-3 top-3 z-[300] flex justify-center sm:inset-x-auto sm:right-5 sm:top-5">
                    <motion.div
                        role={type === "error" ? "alert" : "status"}
                        aria-live={type === "error" ? "assertive" : "polite"}
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-card-sm border border-border bg-surface/95 p-4 shadow-popover backdrop-blur-xl"
                    >
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-control ${variant.className}`}>
                            <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground">{variant.title}</p>
                            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{message}</p>
                        </div>
                        <IconButton size="sm" variant="ghost" onClick={onClose} aria-label="Fechar notificação">
                            <X className="size-4" aria-hidden="true" />
                        </IconButton>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default Snackbar;
