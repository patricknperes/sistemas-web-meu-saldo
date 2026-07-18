import { ShieldCheck, UserCheck, UserRoundX, UsersRound } from "lucide-react";

const cards = [
    { key: "total", title: "Usuários cadastrados", icon: UsersRound, tone: "primary" },
    { key: "active", title: "Contas ativas", icon: UserCheck, tone: "success" },
    { key: "inactive", title: "Contas inativas", icon: UserRoundX, tone: "danger" },
    { key: "admins", title: "Administradores", icon: ShieldCheck, tone: "secondary" },
];

const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-muted text-success",
    danger: "bg-danger-muted text-danger",
    secondary: "bg-secondary-soft text-secondary",
};

function AdminUsersSummary({ summary = {}, loading = false }) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo dos usuários">
            {cards.map(({ key, title, icon: Icon, tone }) => (
                <article key={key} className="flex min-w-0 items-center gap-4 rounded-card border border-border bg-surface p-4 shadow-card sm:p-5">
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-card-sm ${tones[tone]}`}>
                        <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-subtle-foreground">{title}</p>
                        {loading ? <span className="mt-2 block h-7 w-14 animate-pulse rounded bg-surface-muted" /> : <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{Number(summary[key]) || 0}</p>}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default AdminUsersSummary;
