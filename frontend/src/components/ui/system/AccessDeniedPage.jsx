import {
    RiHome4Line,
    RiLoginBoxLine,
} from "react-icons/ri";

import {
    LinkButton,
} from "../actions/index.js";

import SystemPage from "./SystemPage.jsx";

function AccessDeniedPage({
    homeTo = "/dashboard",
    loginTo = "/login",
    primaryAction,
    secondaryAction,
    ...props
}) {
    const resolvedPrimaryAction = primaryAction || (
        <LinkButton
            to={homeTo}
            leadingIcon={<RiHome4Line size={18} aria-hidden="true" />}
        >
            Ir para a dashboard
        </LinkButton>
    );

    const resolvedSecondaryAction = secondaryAction || (
        <LinkButton
            to={loginTo}
            variant="outline"
            leadingIcon={<RiLoginBoxLine size={18} aria-hidden="true" />}
        >
            Trocar de conta
        </LinkButton>
    );

    return (
        <SystemPage
            variant="access-denied"
            primaryAction={resolvedPrimaryAction}
            secondaryAction={resolvedSecondaryAction}
            support="Caso este acesso seja necessário, solicite a atualização da sua função a um administrador."
            {...props}
        />
    );
}

export default AccessDeniedPage;
