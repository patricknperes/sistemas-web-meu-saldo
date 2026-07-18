import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { AlertDialog } from "radix-ui";

import Button from "../ui/Button.jsx";

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
    return (
        <AlertDialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onCancel?.()}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-[200] bg-overlay backdrop-blur-sm" />
                <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-dialog border border-border bg-surface p-5 shadow-dialog outline-none sm:p-6">
                    <div className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-card-sm bg-danger-muted text-danger">
                            <AlertTriangle className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <AlertDialog.Title className="text-lg font-bold tracking-[-0.02em] text-foreground">
                                {title}
                            </AlertDialog.Title>
                            <AlertDialog.Description className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                {description}
                            </AlertDialog.Description>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <AlertDialog.Cancel asChild>
                            <Button variant="secondary" disabled={loading}>{cancelLabel}</Button>
                        </AlertDialog.Cancel>
                        <Button variant="danger" onClick={onConfirm} disabled={loading} aria-busy={loading}>
                            {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
                            {loading ? "Processando..." : confirmLabel}
                        </Button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

export default ConfirmDialog;
