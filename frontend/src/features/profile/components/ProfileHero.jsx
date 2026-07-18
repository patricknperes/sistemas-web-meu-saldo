import { CalendarDays, Mail, ShieldCheck } from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import UserAvatar from "../../../components/ui/UserAvatar.jsx";
import { getProfileDate, getProfileRoleLabel } from "../utils/profileFormatters.js";

function ProfileHero({ profile, onEdit }) {
    const email = profile?.email || "";
    const isAdmin = profile?.role === "ADMIN";

    return (
        <section className="relative overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card sm:p-6 lg:p-7">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-primary/10 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-secondary/10 blur-3xl"
            />

            <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
                    <UserAvatar
                        name={profile?.name}
                        src={profile?.avatarUrl}
                        role={profile?.role}
                        isActive={Boolean(profile?.isActive)}
                        showStatus
                        size="2xl"
                        showTitle
                    />

                    <div className="min-w-0">
                        <h2 className="max-w-full truncate text-xl font-bold tracking-[-0.025em] text-foreground sm:text-2xl">
                            {profile?.name || "Usuário"}
                        </h2>

                        {email ? (
                            <a
                                href={`mailto:${email}`}
                                title={email}
                                className="mt-1.5 inline-flex max-w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Mail className="size-4 shrink-0" aria-hidden="true" />
                                <span className="truncate">{email}</span>
                            </a>
                        ) : (
                            <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                                <Mail className="size-4 shrink-0" aria-hidden="true" />
                                E-mail não informado
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <Badge variant={isAdmin ? "secondary" : "primary"}>
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

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onEdit}
                    className="w-full shrink-0 sm:w-auto"
                >
                    Editar perfil
                </Button>
            </div>
        </section>
    );
}

export default ProfileHero;