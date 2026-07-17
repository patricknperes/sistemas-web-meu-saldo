import {
    RiCalendarEventLine,
    RiFingerprintLine,
    RiLockPasswordLine,
    RiMailLine,
    RiShieldUserLine,
    RiUserLine,
} from "react-icons/ri";

import {
    UserDetailItem,
    UserDetailList,
    UserIdentity,
} from "../../../components/ui/account/index.js";


import {
    Card,
    CardBody,
    CardHeader,
} from "../../../components/ui/surfaces/index.js";

import {
    formatAccountId,
    getAccountStatus,
} from "./profileUtils.js";

function ProfileOverview({
    user,
    accessMethod,
    createdAt,
}) {
    const status = getAccountStatus(user);

    return (
        <Card className="h-full">
            <CardHeader
                divider
                eyebrow="Identidade"
                title="Dados pessoais"
                description="As informações usadas para identificar sua conta no Meu Saldo."
            >
                <div className="rounded-xl border border-primary/10 bg-primary-muted/55 p-4 sm:p-5">
                    <UserIdentity
                        name={user?.name}
                        email={user?.email}
                        role={user?.role}
                        status={status}
                        size="lg"
                        description="Perfil principal da sua conta financeira."
                    />
                </div>
            </CardHeader>

            <CardBody className="pt-1">
                <UserDetailList>
                    <UserDetailItem
                        icon={RiUserLine}
                        label="Nome completo"
                        value={user?.name}
                        description="Exibido na navegação e nas áreas pessoais."
                    />

                    <UserDetailItem
                        icon={RiMailLine}
                        label="E-mail"
                        value={user?.email}
                        description="Usado para acesso e recuperação da conta."
                    />

                    <UserDetailItem
                        icon={RiShieldUserLine}
                        label="Perfil de acesso"
                        value={user?.role === "ADMIN" ? "Administrador" : "Usuário"}
                    />

                    <UserDetailItem
                        icon={RiLockPasswordLine}
                        label="Método de acesso"
                        value={accessMethod}
                    />

                    <UserDetailItem
                        icon={RiCalendarEventLine}
                        label="Conta criada em"
                        value={createdAt}
                    />

                    <UserDetailItem
                        icon={RiFingerprintLine}
                        label="Identificador"
                        value={formatAccountId(user?.id)}
                    />
                </UserDetailList>
            </CardBody>
        </Card>
    );
}

export default ProfileOverview;
