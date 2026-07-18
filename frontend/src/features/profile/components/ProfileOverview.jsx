import {
    CalendarClock,
    KeyRound,
    LockKeyhole,
    Mail,
    Shield,
    ShieldCheck,
    TriangleAlert,
    UserRoundCheck,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";
import {
    Card,
    CardContent,
    CardHeader,
} from "../../../components/ui/Card.jsx";
import { cn } from "../../../lib/cn.js";
import {
    getProfileAuthMethods,
    getProfileDate,
    getProfileRoleLabel,
} from "../utils/profileFormatters.js";

const TONES = {
    neutral: {
        icon: "bg-surface-muted text-subtle-foreground",
        label: "text-subtle-foreground",
    },
    primary: {
        icon: "bg-primary-soft text-primary",
        label: "text-subtle-foreground",
    },
    success: {
        icon: "bg-success-muted text-success",
        label: "text-subtle-foreground",
    },
    danger: {
        icon: "bg-danger-muted text-danger",
        label: "text-danger",
    },
};

function SectionHeader({
    title,
    description,
}) {
    return (
        <header className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {description}
            </p>
        </header>
    );
}

function DetailItem({
    icon: Icon,
    label,
    value,
    action,
    tone = "neutral",
    className,
}) {
    const styles = TONES[tone] ?? TONES.neutral;

    return (
        <div
            className={cn(
                `
                    flex min-w-0
                    flex-col gap-4
                    rounded-card-sm
                    border border-border
                    bg-surface
                    p-4
                    sm:p-5
                `,
                action
                && `
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    `,
                tone === "danger"
                && `
                        border-danger/15
                        bg-danger-muted/20
                    `,
                className,
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                <span
                    className={cn(
                        `
                            flex size-10
                            shrink-0
                            items-center justify-center
                            rounded-control
                        `,
                        styles.icon,
                    )}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-[18px]"
                        strokeWidth={1.9}
                    />
                </span>

                <div className="min-w-0 flex-1">
                    <p
                        className={cn(
                            `
                                text-xs font-bold
                                uppercase
                                tracking-[0.07em]
                            `,
                            styles.label,
                        )}
                    >
                        {label}
                    </p>

                    <p
                        title={typeof value === "string" ? value : undefined}
                        className="
                            mt-1.5
                            break-words
                            text-sm font-semibold
                            leading-5
                            text-foreground
                        "
                    >
                        {value}
                    </p>
                </div>
            </div>

            {action && (
                <div className="w-full shrink-0 sm:w-auto">
                    {action}
                </div>
            )}
        </div>
    );
}

function ProfileOverview({
    profile,
    onChangePassword,
    onDeleteAccount,
}) {
    const hasPassword = Boolean(
        profile?.authMethods?.password,
    );

    const hasGoogle = Boolean(
        profile?.authMethods?.google,
    );

    const isAdmin = profile?.role === "ADMIN";
    const canDelete = !isAdmin && hasPassword;

    const deleteDescription = isAdmin
        ? "Administradores não podem excluir a própria conta por esta tela."
        : hasPassword
            ? "A exclusão remove permanentemente seus lançamentos, recorrências e tags."
            : "Contas exclusivas do Google ainda não podem ser excluídas por esta tela.";

    return (
        <Card className="w-full min-w-0 overflow-hidden">
            <CardHeader
                className="
                    border-b border-border
                    px-4 py-5
                    sm:px-6
                "
            >
                <h2
                    className="
                        text-lg font-bold
                        tracking-[-0.02em]
                        text-foreground
                    "
                >
                    Informações da conta
                </h2>

                <p
                    className="
                        mt-1
                        max-w-2xl
                        text-sm leading-5
                        text-muted-foreground
                    "
                >
                    Consulte seus dados pessoais, métodos de acesso e configurações de segurança.
                </p>
            </CardHeader>

            <CardContent
                className="
                    space-y-7
                    px-4 py-5
                    sm:px-6
                    sm:py-6
                "
            >
                <section className="space-y-4">
                    <SectionHeader
                        title="Dados da conta"
                        description="Informações utilizadas para identificar seu perfil."
                    />

                    <div
                        className="
                            grid min-w-0
                            gap-3
                            md:grid-cols-2
                        "
                    >
                        <DetailItem
                            icon={UserRoundCheck}
                            label="Nome completo"
                            value={profile?.name || "Não informado"}
                            tone="primary"
                        />

                        <DetailItem
                            icon={Mail}
                            label="E-mail"
                            value={profile?.email || "Não informado"}
                            tone="primary"
                        />

                        <DetailItem
                            icon={Shield}
                            label="Nível de acesso"
                            value={getProfileRoleLabel(profile?.role)}
                        />

                        <DetailItem
                            icon={CalendarClock}
                            label="Última atualização"
                            value={getProfileDate(profile?.updatedAt)}
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <SectionHeader
                        title="Segurança e acesso"
                        description="Métodos disponíveis para entrar e proteger sua conta."
                    />

                    <div className="space-y-3">
                        <DetailItem
                            icon={KeyRound}
                            label="Métodos de acesso"
                            value={getProfileAuthMethods(
                                profile?.authMethods,
                            )}
                            tone="primary"
                        />

                        <DetailItem
                            icon={
                                hasPassword
                                    ? LockKeyhole
                                    : ShieldCheck
                            }
                            label={
                                hasPassword
                                    ? "Senha local ativa"
                                    : "Conta sem senha local"
                            }
                            value={
                                hasPassword
                                    ? "Sua conta pode ser acessada utilizando e-mail e senha."
                                    : "Esta conta utiliza autenticação externa para entrar."
                            }
                            tone={
                                hasPassword
                                    ? "primary"
                                    : "neutral"
                            }
                            action={
                                hasPassword ? (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={onChangePassword}
                                        className="
                                            w-full
                                            whitespace-nowrap
                                            border border-primary/15
                                            bg-surface
                                            text-primary
                                            shadow-none
                                            hover:border-primary/30
                                            hover:bg-primary-soft
                                            hover:text-primary
                                            sm:w-auto
                                        "
                                    >
                                        <KeyRound
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                        />

                                        Alterar senha
                                    </Button>
                                ) : null
                            }
                        />

                        {hasGoogle && (
                            <DetailItem
                                icon={ShieldCheck}
                                label="Google conectado"
                                value="Sua conta também pode ser acessada utilizando o Google."
                                tone="success"
                            />
                        )}
                    </div>
                </section>

                <section className="space-y-4">
                    <SectionHeader
                        title="Ações da conta"
                        description="Ações permanentes relacionadas ao seu perfil."
                    />

                    <DetailItem
                        icon={TriangleAlert}
                        label="Excluir minha conta"
                        value={deleteDescription}
                        tone="danger"
                        action={
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={onDeleteAccount}
                                disabled={!canDelete}
                                className="
                                    w-full
                                    whitespace-nowrap
                                    sm:w-auto
                                "
                            >
                                Excluir minha conta
                            </Button>
                        }
                    />
                </section>
            </CardContent>
        </Card>
    );
}

export default ProfileOverview;