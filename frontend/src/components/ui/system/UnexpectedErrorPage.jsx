import {
    RiHome4Line,
    RiRefreshLine,
} from "react-icons/ri";

import {
    Button,
    LinkButton,
} from "../actions/index.js";

import SystemPage from "./SystemPage.jsx";

function UnexpectedErrorPage({
    homeTo = "/dashboard",
    onRetry,
    primaryAction,
    secondaryAction,
    ...props
}) {
    const resolvedPrimaryAction = primaryAction || (
        <Button
            leadingIcon={<RiRefreshLine size={18} aria-hidden="true" />}
            onClick={onRetry || (() => window.location.reload())}
        >
            Tentar novamente
        </Button>
    );

    const resolvedSecondaryAction = secondaryAction || (
        <LinkButton
            to={homeTo}
            variant="outline"
            leadingIcon={<RiHome4Line size={18} aria-hidden="true" />}
        >
            Voltar ao início
        </LinkButton>
    );

    return (
        <SystemPage
            variant="error"
            primaryAction={resolvedPrimaryAction}
            secondaryAction={resolvedSecondaryAction}
            support="Se o problema continuar, anote o que estava fazendo e tente novamente mais tarde."
            {...props}
        />
    );
}

export default UnexpectedErrorPage;
