import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
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
import { changePasswordSchema } from "../schemas/profileSchemas.js";

function ChangePasswordDialog({
    open,
    loading,
    onClose,
    onSubmit,
}) {
    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            passwordConfirmation: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [
        form,
        open,
    ]);

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen && !loading) {
                    onClose?.();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Alterar senha
                    </DialogTitle>

                    <DialogDescription>
                        Escolha uma senha forte e diferente da atual. A alteração passa a valer imediatamente.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="change-password-form"
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <PasswordInput
                        label="Senha atual"
                        placeholder="Digite sua senha atual"
                        autoComplete="current-password"
                        error={
                            form.formState.errors
                                .currentPassword?.message
                        }
                        {...form.register("currentPassword")}
                    />

                    <PasswordInput
                        label="Nova senha"
                        placeholder="Digite uma nova senha"
                        autoComplete="new-password"
                        showStrengthPopover
                        error={
                            form.formState.errors
                                .newPassword?.message
                        }
                        {...form.register("newPassword")}
                    />

                    <PasswordInput
                        label="Confirmar nova senha"
                        placeholder="Digite novamente a nova senha"
                        autoComplete="new-password"
                        error={
                            form.formState.errors
                                .passwordConfirmation?.message
                        }
                        {...form.register(
                            "passwordConfirmation",
                        )}
                    />
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        form="change-password-form"
                        disabled={loading}
                    >
                        {loading && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {loading
                            ? "Alterando..."
                            : "Alterar senha"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordDialog;