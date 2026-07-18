export const PAGE_META = {
    "/dashboard": {
        section: "Visão geral",
        title: "Dashboard",
        sectionPath: null,
    },
    "/receitas": {
        section: "Finanças",
        title: "Receitas",
        sectionPath: "/dashboard",
    },
    "/despesas": {
        section: "Finanças",
        title: "Despesas",
        sectionPath: "/dashboard",
    },
    "/historico": {
        section: "Finanças",
        title: "Histórico",
        sectionPath: "/dashboard",
    },
    "/perfil": {
        section: "Conta",
        title: "Meu perfil",
        sectionPath: "/perfil",
    },
    "/usuarios": {
        section: "Administração",
        title: "Usuários",
        sectionPath: "/usuarios",
    },
    "/design-system": {
        section: "Administração",
        title: "Design System",
        sectionPath: "/usuarios",
    },
};

export function getPageMeta(pathname) {
    if (PAGE_META[pathname]) {
        return PAGE_META[pathname];
    }

    const matchedPath = Object.keys(PAGE_META)
        .sort((first, second) => second.length - first.length)
        .find((path) => pathname.startsWith(`${path}/`));

    return matchedPath
        ? PAGE_META[matchedPath]
        : {
            section: "Meu Saldo",
            title: "Página",
            sectionPath: "/dashboard",
        };
}