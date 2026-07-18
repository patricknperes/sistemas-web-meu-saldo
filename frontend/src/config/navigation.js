import {
    ArrowDownCircle,
    ArrowUpCircle,
    History,
    LayoutDashboard,
    Palette,
    UserRound,
    UsersRound,
} from "lucide-react";

export const primaryNavigation = [
    { label: "Visão geral", shortLabel: "Início", path: "/dashboard", icon: LayoutDashboard },
    { label: "Receitas", shortLabel: "Receitas", path: "/receitas", icon: ArrowUpCircle },
    { label: "Despesas", shortLabel: "Despesas", path: "/despesas", icon: ArrowDownCircle },
    { label: "Histórico", shortLabel: "Histórico", path: "/historico", icon: History },
];

export const secondaryNavigation = [
    { label: "Meu perfil", path: "/perfil", icon: UserRound },
    { label: "Usuários", path: "/usuarios", icon: UsersRound, adminOnly: true },
    { label: "Design System", path: "/design-system", icon: Palette, adminOnly: true },
];

export const routeMetadata = {
    "/dashboard": { title: "Visão geral", eyebrow: "Meu Saldo", description: "Acompanhe o desempenho das suas finanças." },
    "/receitas": { title: "Receitas", eyebrow: "Movimentações", description: "Gerencie entradas e receitas recorrentes." },
    "/despesas": { title: "Despesas", eyebrow: "Movimentações", description: "Organize gastos e despesas recorrentes." },
    "/historico": { title: "Histórico", eyebrow: "Análises", description: "Consulte sua evolução financeira por período." },
    "/perfil": { title: "Perfil", eyebrow: "Sua conta", description: "Gerencie seus dados e preferências." },
    "/usuarios": { title: "Usuários", eyebrow: "Administração", description: "Gerencie acessos e contas do sistema." },
    "/design-system": { title: "Design System", eyebrow: "Aqua Graphite", description: "Biblioteca visual e padrões da interface." },
};

export function filterNavigation(items, role) {
    return items.filter((item) => !item.adminOnly || role === "ADMIN");
}
