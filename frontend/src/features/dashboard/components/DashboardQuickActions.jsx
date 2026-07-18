import { ArrowDownLeft, ArrowRight, ArrowUpRight, History } from "lucide-react";
import { Link } from "react-router";

const actions = [
    {
        to: "/receitas",
        title: "Nova receita",
        description: "Registre uma entrada ou recorrência.",
        icon: ArrowUpRight,
        iconClassName: "bg-success-muted text-success",
    },
    {
        to: "/despesas",
        title: "Nova despesa",
        description: "Mantenha suas saídas organizadas.",
        icon: ArrowDownLeft,
        iconClassName: "bg-danger-muted text-danger",
    },
    {
        to: "/historico",
        title: "Ver histórico",
        description: "Explore períodos e movimentações.",
        icon: History,
        iconClassName: "bg-secondary-soft text-secondary",
    },
];

function DashboardQuickActions() {
    return (
        <section aria-labelledby="dashboard-quick-actions-title">
            <header className="mb-3 flex items-center justify-between gap-4">
                <h2 id="dashboard-quick-actions-title" className="text-sm font-bold text-foreground">Acessos rápidos</h2>
                <span className="text-xs text-subtle-foreground">Gerencie seus dados</span>
            </header>
            <div className="grid gap-3 sm:grid-cols-3">
                {actions.map(({ to, title, description, icon: Icon, iconClassName }) => (
                    <Link
                        key={to}
                        to={to}
                        className="group flex min-w-0 items-center gap-3 rounded-card-sm border border-border bg-surface p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card"
                    >
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
                            <Icon className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="block truncate text-sm text-foreground">{title}</strong>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{description}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-subtle-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default DashboardQuickActions;
