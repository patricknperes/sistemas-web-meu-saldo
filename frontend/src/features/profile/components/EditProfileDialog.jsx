import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, UserRound } from "lucide-react";
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
import { profileDetailsSchema } from "../schemas/profileSchemas.js";

function EditProfileDialog({ open, profile, loading, onClose, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(profileDetailsSchema),
        defaultValues: { name: "", email: "", currentPassword: "" },
    });

    const currentEmail = String(profile?.email ?? "").toLowerCase();
    const watchedEmail = String(form.watch("email") ?? "").toLowerCase();
    const emailChanged = Boolean(currentEmail && watchedEmail && currentEmail !== watchedEmail);

    useEffect(() => {
        if (!open) return;
        form.reset({ name: profile?.name ?? "", email: profile?.email ?? "", currentPassword: "" });
    }, [form, open, profile]);

    async function handleSubmit(values) {
        if (emailChanged && profile?.authMethods?.password && !values.currentPassword) {
            form.setError("currentPassword", { type: "manual", message: "Informe sua senha atual para alterar o e-mail." });
            return;
        }

        await onSubmit({
            name: values.name,
            email: values.email,
            ...(emailChanged && values.currentPassword ? { currentPassword: values.currentPassword } : {}),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar perfil</DialogTitle>
                    <DialogDescription>Atualize seu nome e endereço de e-mail. Alterações sensíveis exigem confirmação.</DialogDescription>
                </DialogHeader>

                <form id="edit-profile-form" className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <Input label="Nome completo" leadingIcon={UserRound} autoComplete="name" error={form.formState.errors.name?.message} {...form.register("name")} />
                    <Input label="E-mail" type="email" leadingIcon={Mail} autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />

                    {emailChanged && profile?.authMethods?.password && (
                        <PasswordInput
                            label="Senha atual"
                            autoComplete="current-password"
                            hint="Necessária apenas para confirmar a alteração do e-mail."
                            error={form.formState.errors.currentPassword?.message}
                            {...form.register("currentPassword")}
                        />
                    )}

                    {emailChanged && !profile?.authMethods?.password && (
                        <p role="alert" className="rounded-card-sm border border-warning/20 bg-warning-muted px-4 py-3 text-sm leading-5 text-warning">
                            Contas que utilizam somente o Google ainda não podem alterar o e-mail por esta tela.
                        </p>
                    )}
                </form>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" form="edit-profile-form" disabled={loading || (emailChanged && !profile?.authMethods?.password)}>
                        {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {loading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfileDialog;
