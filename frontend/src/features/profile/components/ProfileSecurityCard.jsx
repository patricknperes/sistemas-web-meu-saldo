import { KeyRound, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card.jsx";

function SecurityItem({ icon: Icon, title, description, action }) {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-card-sm border border-border bg-surface-raised p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-5 text-foreground">{title}</h3>
                    <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p>
                </div>
            </div>

            {action && (
                <div className="shrink-0 sm:pl-3">
                    {action}
                </div>
            )}
        </div>
    );
}

function ProfileSecurityCard({ profile, onChangePassword, onDeleteAccount }) {
    const hasPassword = Boolean(profile?.authMethods?.password);
    const hasGoogle = Boolean(profile?.authMethods?.google);
    const isAdmin = profile?.role === "ADMIN";
    const canDelete = !isAdmin && hasPassword;

    const deleteDescription = isAdmin
        ? "Administradores não podem excluir a própria conta por esta tela."
        : hasPassword
            ? "A exclusão remove permanentemente seus lançamentos, recorrências e tags."
            : "Contas exclusivas do Google ainda não podem ser excluídas por esta tela.";

    return (
        <Card className="h-fit self-start lg:col-span-5">
            <CardHeader className="border-b border-border px-5 py-4">
                <h2 className="text-base font-bold tracking-[-0.02em] text-foreground">
                    Segurança e acesso
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                    Gerencie seus métodos de acesso e ações sensíveis.
                </p>
            </CardHeader>

            <CardContent className="space-y-3 p-4 sm:p-5">
                <SecurityItem
                    icon={hasPassword ? LockKeyhole : ShieldCheck}
                    title={hasPassword ? "Senha local ativa" : "Conta sem senha local"}
                    description={
                        hasPassword
                            ? "Acesse sua conta utilizando e-mail e senha."
                            : "Esta conta utiliza autenticação externa."
                    }
                    action={
                        hasPassword ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onChangePassword}
                                className="w-full whitespace-nowrap sm:w-auto"
                            >
                                <KeyRound className="size-4" aria-hidden="true" />
                                Alterar senha
                            </Button>
                        ) : null
                    }
                />

                {hasGoogle && (
                    <SecurityItem
                        icon={ShieldCheck}
                        title="Google conectado"
                        description="Sua conta também pode ser acessada pelo Google."
                    />
                )}

                <div className="rounded-card-sm border border-danger/20 bg-danger-muted/55 p-3.5">
                    <div className="flex min-w-0 items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-danger-muted text-danger">
                            <TriangleAlert className="size-4" aria-hidden="true" />
                        </span>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold leading-5 text-danger">
                                Zona de perigo
                            </h3>

                            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                                {deleteDescription}
                            </p>

                            <Button
                                className="mt-3 w-full sm:w-auto"
                                variant="danger"
                                size="sm"
                                onClick={onDeleteAccount}
                                disabled={!canDelete}
                            >
                                Excluir minha conta
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProfileSecurityCard;