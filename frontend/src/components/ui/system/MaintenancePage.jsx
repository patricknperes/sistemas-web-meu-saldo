import {
    RiHome4Line,
    RiRefreshLine,
} from "react-icons/ri";

import {
    Button,
    LinkButton,
} from "../actions/index.js";

import SystemPage from "./SystemPage.jsx";

function MaintenancePage({
    homeTo = "/",
    onRefresh,
    primaryAction,
    secondaryAction,
    estimatedReturn,
    ...props
}) {
    const resolvedPrimaryAction = primaryAction || (
        <Button
            leadingIcon={<RiRefreshLine size={18} aria-hidden="true" />}
            onClick={onRefresh || (() => window.location.reload())}
        >
            Verificar novamente
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
            variant="maintenance"
            primaryAction={resolvedPrimaryAction}
            secondaryAction={resolvedSecondaryAction}
            support={estimatedReturn
                ? `Previsão de retorno: ${estimatedReturn}.`
                : "Não é necessário atualizar a página continuamente. Tente novamente em alguns minutos."}
            {...props}
        />
    );
}

export default MaintenancePage;
