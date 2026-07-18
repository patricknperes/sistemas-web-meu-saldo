import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import PasswordInput from "../../auth/components/PasswordInput.jsx";
import PasswordStrength from "../../auth/components/PasswordStrength.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import { changePasswordSchema } from "../schemas/profileSchemas.js";

function ChangePasswordDialog({ open, loading, onClose, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { currentPassword: "", newPassword: "", passwordConfirmation: "" },
    });
    const newPassword = form.watch("newPassword");

    useEffect(() => {
        if (open) form.reset();
    }, [form, open]);

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alterar senha</DialogTitle>
                    <DialogDescription>Escolha uma senha forte e diferente da atual. A alteração passa a valer imediatamente.</DialogDescription>
                </DialogHeader>

                <form id="change-password-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <PasswordInput label="Senha atual" autoComplete="current-password" error={form.formState.errors.currentPassword?.message} {...form.register("currentPassword")} />
                    <PasswordInput label="Nova senha" autoComplete="new-password" error={form.formState.errors.newPassword?.message} {...form.register("newPassword")} />
                    <PasswordStrength value={newPassword} />
                    <PasswordInput label="Confirmar nova senha" autoComplete="new-password" error={form.formState.errors.passwordConfirmation?.message} {...form.register("passwordConfirmation")} />
                </form>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" form="change-password-form" disabled={loading}>
                        {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {loading ? "Alterando..." : "Alterar senha"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordDialog;
