import {
    RiArrowLeftLine,
    RiHome4Line,
} from "react-icons/ri";

import {
    Button,
    LinkButton,
} from "../actions/index.js";

import SystemPage from "./SystemPage.jsx";

function NotFoundPage({
    homeTo = "/dashboard",
    onBack,
    primaryAction,
    secondaryAction,
    ...props
}) {
    const resolvedPrimaryAction = primaryAction || (
        <LinkButton
            to={homeTo}
            leadingIcon={<RiHome4Line size={18} aria-hidden="true" />}
        >
            Voltar ao início
        </LinkButton>
    );

    const resolvedSecondaryAction = secondaryAction || (
        <Button
            variant="outline"
            leadingIcon={<RiArrowLeftLine size={18} aria-hidden="true" />}
            onClick={onBack || (() => window.history.back())}
        >
            Página anterior
        </Button>
    );

    return (
        <SystemPage
            variant="not-found"
            primaryAction={resolvedPrimaryAction}
            secondaryAction={resolvedSecondaryAction}
            support="Confira o endereço ou use a navegação principal para continuar."
            {...props}
        />
    );
}

export default NotFoundPage;
