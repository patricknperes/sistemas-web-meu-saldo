import {
    RiCompass3Line,
    RiErrorWarningLine,
    RiLock2Line,
    RiToolsLine,
} from "react-icons/ri";

export const SYSTEM_PAGE_PRESETS = {
    "not-found": {
        code: "404",
        eyebrow: "Página não encontrada",
        title: "Esse caminho não leva a lugar nenhum.",
        description:
            "O endereço pode ter mudado, sido removido ou ter sido digitado incorretamente.",
        status: "Rota indisponível",
        icon: RiCompass3Line,
        accentClassName: "bg-primary-muted text-primary",
        glowClassName: "bg-primary/18",
        lineClassName: "border-primary/25",
    },
    "access-denied": {
        code: "403",
        eyebrow: "Acesso restrito",
        title: "Você não tem permissão para entrar aqui.",
        description:
            "Esta área exige outro nível de acesso. Use uma conta autorizada ou volte para uma página disponível.",
        status: "Permissão necessária",
        icon: RiLock2Line,
        accentClassName: "bg-warning-muted text-warning",
        glowClassName: "bg-warning/18",
        lineClassName: "border-warning/25",
    },
    error: {
        code: "500",
        eyebrow: "Erro inesperado",
        title: "Algo saiu do previsto.",
        description:
            "Não foi possível concluir esta operação agora. Seus dados permanecem seguros e você pode tentar novamente.",
        status: "Serviço instável",
        icon: RiErrorWarningLine,
        accentClassName: "bg-danger-muted text-danger",
        glowClassName: "bg-danger/18",
        lineClassName: "border-danger/25",
    },
    maintenance: {
        code: "PAUSA",
        eyebrow: "Manutenção programada",
        title: "Estamos preparando uma experiência melhor.",
        description:
            "O Meu Saldo está temporariamente indisponível enquanto realizamos melhorias. O acesso será restabelecido em breve.",
        status: "Atualização em andamento",
        icon: RiToolsLine,
        accentClassName: "bg-info-muted text-info",
        glowClassName: "bg-info/18",
        lineClassName: "border-info/25",
    },
};

export function getSystemPagePreset(variant) {
    return SYSTEM_PAGE_PRESETS[variant] || SYSTEM_PAGE_PRESETS.error;
}
