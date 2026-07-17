import {
    RiDeleteBinLine,
    RiEditLine,
    RiInformationLine,
    RiLockPasswordLine,
    RiLogoutBoxRLine,
    RiShieldCheckLine,
} from "react-icons/ri";

import {
    UserRoleBadge,
    UserStatusBadge,
} from "../../../components/ui/account/index.js";

import Alert from "../../../components/ui/feedback/Alert.jsx";

import {
    Card,
    CardBody,
    CardHeader,
} from "../../../components/ui/surfaces/index.js";

import ProfileActionItem from "./ProfileActionItem.jsx";
import {
    getAccountStatus,
} from "./profileUtils.js";

function ProfileActionsPanel({
    user,
    hasLocalPassword,
    onEditProfile,
    onChangePassword,
    onShowAccount,
    onDeleteAccount,
    onLogout,
}) {
    const isAdmin = user?.role === "ADMIN";
    const deleteBlocked = isAdmin || !hasLocalPassword;
    const status = getAccountStatus(user);

    return (
        <div className="grid min-w-0 gap-5">
            <Card>
                <CardHeader
                    divider
                    icon={RiShieldCheckLine}
                    title="Conta e segurança"
                    description="Gerencie dados, credenciais e informações do cadastro."
                >
                    <div className="flex flex-wrap gap-2">
                        <UserRoleBadge role={user?.role} />
                        <UserStatusBadge status={status} />
                    </div>
                </CardHeader>

                <CardBody padding="none">
                    <div className="divide-y divide-border">
                        <ProfileActionItem
                            icon={RiEditLine}
                            title="Editar dados pessoais"
                            description="Atualize seu nome e, quando permitido, o e-mail de acesso."
                            onClick={onEditProfile}
                        />

                        <ProfileActionItem
                            icon={RiLockPasswordLine}
                            title="Senha e segurança"
                            description={hasLocalPassword
                                ? "Altere sua senha atual e mantenha a conta protegida."
                                : "Esta conta utiliza somente o acesso com Google."
                            }
                            onClick={onChangePassword}
                            disabled={!hasLocalPassword}
                        />

                        <ProfileActionItem
                            icon={RiInformationLine}
                            title="Informações da conta"
                            description="Consulte identificador, perfil, criação e método de acesso."
                            onClick={onShowAccount}
                        />

                        <ProfileActionItem
                            icon={RiLogoutBoxRLine}
                            title="Sair da conta"
                            description="Encerre a sessão atual neste dispositivo."
                            onClick={onLogout}
                        />
                    </div>
                </CardBody>
            </Card>

            <Card variant="outlined">
                <CardHeader
                    divider
                    title="Zona de risco"
                    description="A exclusão remove permanentemente a conta e os dados vinculados."
                />

                <CardBody padding="none">
                    <ProfileActionItem
                        icon={RiDeleteBinLine}
                        title="Excluir minha conta"
                        description={isAdmin
                            ? "Administradores não podem excluir a própria conta."
                            : !hasLocalPassword
                                ? "A exclusão de contas somente Google ainda não está disponível."
                                : "Receitas, despesas, recorrências e demais informações serão removidas."
                        }
                        onClick={onDeleteAccount}
                        disabled={deleteBlocked}
                        tone="danger"
                    />
                </CardBody>
            </Card>

            {!hasLocalPassword ? (
                <Alert variant="info" title="Acesso com Google">
                    Seu e-mail não pode ser alterado por esta tela e as opções que exigem senha local ficam indisponíveis.
                </Alert>
            ) : null}
        </div>
    );
}

export default ProfileActionsPanel;
