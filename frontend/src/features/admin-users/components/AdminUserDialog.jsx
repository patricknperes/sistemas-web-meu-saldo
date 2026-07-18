import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import Badge from "../../../components/ui/Badge.jsx";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import Switch from "../../../components/ui/Switch.jsx";
import UserAvatar from "../../../components/ui/UserAvatar.jsx";
import { adminUserSchema } from "../schemas/adminUserSchemas.js";
import { getAdminUserAuthLabel, getAdminUserDate, isSameUser } from "../utils/adminUserFormatters.js";

function ActivityItem({ label, value }) {
    return (
        <div className="rounded-control border border-border bg-surface-raised px-3 py-2.5 text-center">
            <p className="text-lg font-bold tabular-nums text-foreground">{Number(value) || 0}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-subtle-foreground">{label}</p>
        </div>
    );
}

function AdminUserDialog({ open, targetUser, authenticatedUserId, loading, onClose, onSubmit }) {
    const ownAccount = isSameUser(targetUser?.id, authenticatedUserId);
    const form = useForm({
        resolver: zodResolver(adminUserSchema),
        defaultValues: { name: "", email: "", role: "USER", isActive: true },
    });

    useEffect(() => {
        if (!open || !targetUser) return;
        form.reset({
            name: targetUser.name ?? "",
            email: targetUser.email ?? "",
            role: targetUser.role ?? "USER",
            isActive: Boolean(targetUser.isActive),
        });
    }, [form, open, targetUser]);

    if (!targetUser) return null;

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="mb-2 flex min-w-0 items-center gap-3">
                        <UserAvatar name={targetUser.name} src={targetUser.avatarUrl} size="xl" showTitle={false} />
                        <div className="min-w-0">
                            <DialogTitle className="truncate">Gerenciar usuário</DialogTitle>
                            <DialogDescription className="truncate">Conta #{targetUser.id} · criada em {getAdminUserDate(targetUser.createdAt)}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-2">
                    <ActivityItem label="Lançamentos" value={targetUser.activity?.transactions} />
                    <ActivityItem label="Recorrências" value={targetUser.activity?.recurringTransactions} />
                    <ActivityItem label="Tags" value={targetUser.activity?.tags} />
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-card-sm border border-border bg-surface-muted/55 px-4 py-3 text-xs text-muted-foreground">
                    <Badge variant={targetUser.authMethods?.google ? "info" : "neutral"}>{getAdminUserAuthLabel(targetUser.authMethods)}</Badge>
                    {ownAccount && <Badge variant="warning">Sua conta administrativa</Badge>}
                </div>

                <form id="admin-user-form" className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
                    <Input label="Nome completo" leadingIcon={UserRound} error={form.formState.errors.name?.message} {...form.register("name")} />
                    <Input label="E-mail" type="email" leadingIcon={Mail} error={form.formState.errors.email?.message} {...form.register("email")} />

                    <Controller
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <label className="block min-w-0">
                                <span className="mb-2 block text-sm font-semibold text-foreground">Nível de acesso</span>
                                <Select value={field.value} onValueChange={field.onChange} disabled={ownAccount}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuário</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                                {ownAccount && <span className="mt-1.5 block text-xs text-subtle-foreground">Você não pode remover seu próprio acesso administrativo.</span>}
                            </label>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <div className="rounded-control border border-border bg-surface px-3 py-2.5 shadow-xs">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground">Conta ativa</p>
                                        <p className="mt-0.5 text-xs text-subtle-foreground">Permite autenticação e uso do sistema.</p>
                                    </div>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={ownAccount} aria-label="Alterar status da conta" />
                                </div>
                            </div>
                        )}
                    />
                </form>

                <div className="flex items-start gap-3 rounded-card-sm border border-info/20 bg-info-muted px-4 py-3 text-sm text-info">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p>Alterações de acesso entram em vigor imediatamente. O sistema preserva pelo menos um administrador ativo.</p>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" form="admin-user-form" disabled={loading}>
                        {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {loading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AdminUserDialog;
