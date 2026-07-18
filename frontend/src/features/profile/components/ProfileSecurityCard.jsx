import { KeyRound, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card.jsx";

function SecurityItem({ icon: Icon, title, description, action }) {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-card-sm border border-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
                </div>
            </div>
            {action}
        </div>
    );
}

function ProfileSecurityCard({ profile, onChangePassword, onDeleteAccount }) {
    const hasPassword = Boolean(profile?.authMethods?.password);
    const hasGoogle = Boolean(profile?.authMethods?.google);
    const canDelete = profile?.role !== "ADMIN" && hasPassword;

    return (
        <Card className="lg:col-span-5">
            <CardHeader className="border-b border-border pb-4">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">Segurança e acesso</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Revise seus métodos de autenticação e ações sensíveis.</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
                <SecurityItem
                    icon={hasPassword ? LockKeyhole : ShieldCheck}
                    title={hasPassword ? "Senha local ativa" : "Conta sem senha local"}
                    description={hasPassword ? "Sua conta pode ser acessada com e-mail e senha." : "Esta conta utiliza autenticação externa para entrar."}
                    action={hasPassword ? <Button variant="secondary" size="sm" onClick={onChangePassword}><KeyRound className="size-4" aria-hidden="true" />Alterar senha</Button> : null}
                />

                {hasGoogle && (
                    <SecurityItem
                        icon={ShieldCheck}
                        title="Google conectado"
                        description="Você também pode acessar sua conta com o Google."
                    />
                )}

                <div className="rounded-card-sm border border-danger/20 bg-danger-muted/55 p-4">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-danger-muted text-danger">
                            <TriangleAlert className="size-4.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-danger">Zona de perigo</h3>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                {profile?.role === "ADMIN"
                                    ? "Administradores não podem excluir a própria conta por esta tela."
                                    : hasPassword
                                      ? "A exclusão remove permanentemente seus lançamentos, recorrências e tags."
                                      : "Contas exclusivas do Google ainda não podem ser excluídas por esta tela."}
                            </p>
                            <Button className="mt-4" variant="danger" size="sm" onClick={onDeleteAccount} disabled={!canDelete}>Excluir minha conta</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProfileSecurityCard;
