import {
    RiShieldUserLine,
    RiUserFollowLine,
    RiUserForbidLine,
    RiUserSettingsLine,
} from "react-icons/ri";

import MetricCard from "../../../components/ui/finance/MetricCard.jsx";
import PageGrid from "../../../components/ui/layout/PageGrid.jsx";

function UsersSummary({ statistics, loading = false }) {
    return (
        <PageGrid columns={4} minItemWidth="15rem">
            <MetricCard
                label="Usuários cadastrados"
                formattedValue={String(statistics.total)}
                description="Contas registradas no sistema."
                icon={RiUserSettingsLine}
                tone="info"
                loading={loading}
                size="sm"
            />

            <MetricCard
                label="Administradores"
                formattedValue={String(statistics.administrators)}
                description="Contas com acesso administrativo."
                icon={RiShieldUserLine}
                tone="primary"
                loading={loading}
                size="sm"
            />

            <MetricCard
                label="Acessos ativos"
                formattedValue={String(statistics.active)}
                description="Usuários que podem entrar no sistema."
                icon={RiUserFollowLine}
                tone="success"
                loading={loading}
                size="sm"
            />

            <MetricCard
                label="Acessos suspensos"
                formattedValue={String(statistics.inactive)}
                description="Contas temporariamente desativadas."
                icon={RiUserForbidLine}
                tone="danger"
                loading={loading}
                size="sm"
            />
        </PageGrid>
    );
}

export default UsersSummary;
