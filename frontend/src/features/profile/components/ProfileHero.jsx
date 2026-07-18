import { CalendarDays, Mail, ShieldCheck } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import UserAvatar from "../../../components/ui/UserAvatar.jsx";
import { getProfileDate, getProfileRoleLabel, getProfileStatusLabel } from "../utils/profileFormatters.js";

function ProfileHero({ profile, onEdit }) {
    return (
        <section className="relative overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card sm:p-6 lg:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <UserAvatar name={profile?.name} src={profile?.avatarUrl} size="2xl" showTitle={false} />
                    <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h2 className="max-w-full truncate text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                                {profile?.name || "Usuário"}
                            </h2>
                            <Badge variant={profile?.isActive ? "success" : "danger"}>{getProfileStatusLabel(profile?.isActive)}</Badge>
                        </div>
                        <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-4 shrink-0" aria-hidden="true" />
                            <span className="truncate">{profile?.email || "E-mail não informado"}</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant={profile?.role === "ADMIN" ? "secondary" : "primary"}>
                                <ShieldCheck className="size-3.5" aria-hidden="true" />
                                {getProfileRoleLabel(profile?.role)}
                            </Badge>
                            <Badge>
                                <CalendarDays className="size-3.5" aria-hidden="true" />
                                Desde {getProfileDate(profile?.createdAt)}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Button variant="secondary" onClick={onEdit}>Editar perfil</Button>
            </div>
        </section>
    );
}

export default ProfileHero;
