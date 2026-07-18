import { CalendarClock, KeyRound, Mail, Shield, UserRoundCheck } from "lucide-react";

import { Card, CardContent, CardHeader } from "../../../components/ui/Card.jsx";
import { getProfileAuthMethods, getProfileDate, getProfileRoleLabel } from "../utils/profileFormatters.js";

function DetailRow({ icon: Icon, label, value, valueClassName = "" }) {
    return (
        <div className="flex min-w-0 items-start gap-3 border-b border-border py-4 last:border-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-muted text-subtle-foreground">
                <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-subtle-foreground">{label}</p>
                <p className={`mt-1 truncate text-sm font-semibold text-foreground ${valueClassName}`}>{value}</p>
            </div>
        </div>
    );
}

function ProfileOverview({ profile }) {
    return (
        <Card className="lg:col-span-7">
            <CardHeader className="border-b border-border pb-4">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">Informações da conta</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Dados usados para identificar sua conta e manter seu acesso seguro.</p>
            </CardHeader>
            <CardContent className="pt-1">
                <DetailRow icon={UserRoundCheck} label="Nome completo" value={profile?.name || "Não informado"} />
                <DetailRow icon={Mail} label="E-mail" value={profile?.email || "Não informado"} />
                <DetailRow icon={Shield} label="Nível de acesso" value={getProfileRoleLabel(profile?.role)} />
                <DetailRow icon={KeyRound} label="Métodos de acesso" value={getProfileAuthMethods(profile?.authMethods)} />
                <DetailRow icon={CalendarClock} label="Última atualização" value={getProfileDate(profile?.updatedAt)} />
            </CardContent>
        </Card>
    );
}

export default ProfileOverview;
