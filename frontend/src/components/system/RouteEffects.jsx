import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const ROUTE_METADATA = {
    "/dashboard": ["Dashboard", "Visão geral das suas finanças."],
    "/receitas": ["Receitas", "Gerencie entradas e receitas recorrentes."],
    "/despesas": ["Despesas", "Acompanhe gastos e despesas recorrentes."],
    "/historico": ["Histórico", "Consulte a evolução completa das suas movimentações."],
    "/perfil": ["Perfil", "Gerencie os dados e a segurança da sua conta."],
    "/usuarios": ["Usuários", "Administre as contas cadastradas no sistema."],
    "/design-system": ["Design System", "Biblioteca visual Aqua Graphite."],
    "/login": ["Entrar", "Acesse sua conta do Meu Saldo."],
    "/cadastro": ["Criar conta", "Crie sua conta no Meu Saldo."],
    "/esqueci-senha": ["Recuperar senha", "Solicite a recuperação da sua senha."],
    "/redefinir-senha": ["Redefinir senha", "Defina uma nova senha para sua conta."],
};

function resolveMetadata(pathname) {
    return ROUTE_METADATA[pathname] ?? ["Página não encontrada", "O endereço solicitado não foi encontrado."];
}

function RouteEffects() {
    const location = useLocation();
    const initialRender = useRef(true);
    const [title, description] = resolveMetadata(location.pathname);

    useEffect(() => {
        document.title = `${title} | Meu Saldo`;

        let metaDescription = document.querySelector('meta[name="description"]');

        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }

        metaDescription.setAttribute("content", description);

        const routeRoot = document.querySelector("#main-content, [data-route-focus]");

        if (routeRoot) {
            if (typeof routeRoot.scrollTo === "function") {
                routeRoot.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }

            if (!initialRender.current) {
                window.requestAnimationFrame(() => routeRoot.focus({ preventScroll: true }));
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }

        initialRender.current = false;
    }, [description, location.pathname, title]);

    return (
        <span className="sr-only" aria-live="polite" aria-atomic="true">
            {title}
        </span>
    );
}

export default RouteEffects;
