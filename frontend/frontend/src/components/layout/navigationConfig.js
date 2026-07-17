import {
    RiArrowDownCircleLine,
    RiArrowUpCircleLine,
    RiDashboardLine,
    RiGroupLine,
    RiHistoryLine,
    RiPaletteLine,
    RiUser3Line,
} from "react-icons/ri";

const navigationSections = [
    {
        id: "finance",
        label: "Finanças",
        items: [
            {
                label: "Dashboard",
                to: "/dashboard",
                icon: RiDashboardLine,
                end: true,
            },
            {
                label: "Receitas",
                to: "/receitas",
                icon: RiArrowUpCircleLine,
            },
            {
                label: "Despesas",
                to: "/despesas",
                icon: RiArrowDownCircleLine,
            },
            {
                label: "Histórico",
                to: "/historico",
                icon: RiHistoryLine,
            },
        ],
    },
    {
        id: "account",
        label: "Conta",
        items: [
            {
                label: "Meu perfil",
                to: "/perfil",
                icon: RiUser3Line,
            },
        ],
    },
    {
        id: "administration",
        label: "Administração",
        adminOnly: true,
        items: [
            {
                label: "Usuários",
                to: "/usuarios",
                icon: RiGroupLine,
            },
            {
                label: "Design System",
                to: "/design-system",
                icon: RiPaletteLine,
            },
        ],
    },
];

const routeMetadata = [
    {
        path: "/dashboard",
        title: "Dashboard",
        description: "Visão geral das suas finanças",
        icon: RiDashboardLine,
    },
    {
        path: "/receitas",
        title: "Receitas",
        description: "Entradas e recebimentos",
        icon: RiArrowUpCircleLine,
    },
    {
        path: "/despesas",
        title: "Despesas",
        description: "Saídas e compromissos financeiros",
        icon: RiArrowDownCircleLine,
    },
    {
        path: "/historico",
        title: "Histórico",
        description: "Evolução financeira por período",
        icon: RiHistoryLine,
    },
    {
        path: "/perfil",
        title: "Meu perfil",
        description: "Dados pessoais e segurança da conta",
        icon: RiUser3Line,
    },
    {
        path: "/usuarios",
        title: "Usuários",
        description: "Contas, funções e permissões",
        icon: RiGroupLine,
    },
    {
        path: "/design-system",
        title: "Design System",
        description: "Biblioteca visual do Meu Saldo",
        icon: RiPaletteLine,
    },
];

function getVisibleNavigationSections(role) {
    const administrator = role === "ADMIN";

    return navigationSections
        .filter(
            (section) =>
                !section.adminOnly ||
                administrator
        )
        .map((section) => ({
            ...section,
            items: [...section.items],
        }));
}

function getRouteMetadata(pathname) {
    return (
        routeMetadata.find(
            (route) =>
                pathname === route.path ||
                pathname.startsWith(
                    `${route.path}/`
                )
        ) ?? {
            title: "Meu Saldo",
            description: "Controle financeiro pessoal",
            icon: RiDashboardLine,
        }
    );
}

export {
    getRouteMetadata,
    getVisibleNavigationSections,
};
