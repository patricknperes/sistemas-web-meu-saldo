import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import PasswordInput from "../../auth/components/PasswordInput.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import Input from "../../../components/ui/Input.jsx";
import { deleteAccountSchema } from "../schemas/profileSchemas.js";

function DeleteAccountDialog({ open, loading, onClose, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: { password: "", confirmation: "" },
    });

    useEffect(() => {
        if (open) form.reset();
    }, [form, open]);

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-card-sm bg-danger-muted text-danger">
                        <TriangleAlert className="size-5" aria-hidden="true" />
                    </div>
                    <DialogTitle className="text-danger">Excluir conta permanentemente</DialogTitle>
                    <DialogDescription>Esta ação remove sua conta, movimentações, recorrências e tags. Não será possível recuperar esses dados.</DialogDescription>
                </DialogHeader>

                <form id="delete-account-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <PasswordInput label="Senha atual" autoComplete="current-password" error={form.formState.errors.password?.message} {...form.register("password")} />
                    <Input
                        label="Digite EXCLUIR para confirmar"
                        autoComplete="off"
                        error={form.formState.errors.confirmation?.message}
                        {...form.register("confirmation")}
                    />
                </form>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" form="delete-account-form" variant="danger" disabled={loading}>
                        {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {loading ? "Excluindo..." : "Excluir definitivamente"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteAccountDialog;
