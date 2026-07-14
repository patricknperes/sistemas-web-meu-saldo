import {
    useLocation,
    useOutlet,
} from "react-router";

import {
    motion,
} from "motion/react";

import {
    RiBarChartBoxLine,
    RiLock2Line,
    RiShieldCheckLine,
    RiWallet3Line,
} from "react-icons/ri";

import AuthTabs from "./AuthTabs.jsx";

import ThemeToggle from "../theme/ThemeToggle.jsx";
import AuthTransition from "../transitions/AuthTransition.jsx";

const highlights = [
    {
        icon: RiBarChartBoxLine,
        title: "Visão clara",
        description:
            "Acompanhe receitas, despesas e seu saldo em um único lugar.",
    },
    {
        icon: RiShieldCheckLine,
        title: "Controle seguro",
        description:
            "Seus dados financeiros organizados com segurança.",
    },
    {
        icon: RiLock2Line,
        title: "Acesso privado",
        description:
            "Somente você tem acesso às suas informações.",
    },
];

function Brand() {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div
                className="
                    flex size-11 shrink-0
                    items-center justify-center
                    rounded-control
                    bg-primary
                    text-primary-foreground
                "
            >
                <RiWallet3Line size={23} />
            </div>

            <div className="min-w-0">
                <strong
                    className="
                        block truncate
                        text-base font-semibold
                        text-foreground
                    "
                >
                    Meu Saldo
                </strong>

                <span
                    className="
                        block truncate
                        text-xs
                        text-muted-foreground
                    "
                >
                    Gerenciamento financeiro
                </span>
            </div>
        </div>
    );
}

function AuthLayout() {
    const location = useLocation();
    const outlet = useOutlet();

    const direction =
        location.pathname === "/cadastro"
            ? 1
            : -1;

    return (
        <main
            className="
                relative
                min-h-screen min-h-dvh
                overflow-x-hidden
                bg-background
            "
        >
            <div
                className="
                    absolute right-4 top-4
                    z-30
                    sm:right-6 sm:top-6
                "
            >
                <ThemeToggle />
            </div>

            <div
                className="
                    mx-auto grid
                    min-h-screen min-h-dvh
                    w-full max-w-[1440px]
                    lg:grid-cols-[minmax(0,1fr)_minmax(460px,560px)]
                "
            >
                <aside
                    className="
                        hidden min-w-0
                        flex-col justify-between
                        border-r border-border
                        p-10
                        lg:flex
                        xl:p-14
                    "
                >
                    <Brand />

                    <div className="max-w-xl min-w-0">
                        <p
                            className="
                                mb-3
                                text-sm font-medium
                                text-muted-foreground
                            "
                        >
                            Organize. Acompanhe. Decida.
                        </p>

                        <h1
                            className="
                                text-4xl font-semibold
                                tracking-tight
                                text-foreground
                                xl:text-5xl
                            "
                        >
                            Suas finanças de forma simples
                            e objetiva.
                        </h1>

                        <p
                            className="
                                mt-5 max-w-lg
                                text-base leading-7
                                text-muted-foreground
                            "
                        >
                            Tenha uma visão completa da sua
                            vida financeira sem distrações
                            ou complicações.
                        </p>

                        <div className="mt-10 space-y-4">
                            {highlights.map(
                                ({
                                    icon: Icon,
                                    title,
                                    description,
                                }) => (
                                    <div
                                        key={title}
                                        className="
                                            flex min-w-0
                                            items-start gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                mt-0.5
                                                flex size-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-surface-muted
                                                text-foreground
                                            "
                                        >
                                            <Icon size={18} />
                                        </div>

                                        <div className="min-w-0">
                                            <strong
                                                className="
                                                    block truncate
                                                    text-sm font-medium
                                                    text-foreground
                                                "
                                            >
                                                {title}
                                            </strong>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate-text-2
                                                    text-sm
                                                    text-muted-foreground
                                                "
                                            >
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <p
                        className="
                            text-xs
                            text-muted-foreground
                        "
                    >
                        © {new Date().getFullYear()} Meu Saldo
                    </p>
                </aside>

                <section
                    className="
                        flex min-w-0
                        items-center justify-center
                        px-4 py-20
                        sm:px-8
                        lg:px-10
                    "
                >
                    <div className="w-full max-w-md min-w-0">
                        <div className="mb-7 lg:hidden">
                            <Brand />
                        </div>

                        <motion.div
                            layout
                            transition={{
                                layout: {
                                    duration: 0.25,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                },
                            }}
                            className="
                                min-w-0
                                overflow-hidden
                                rounded-card
                                border border-border
                                bg-surface
                                p-2
                                shadow-card
                                sm:p-3
                            "
                        >
                            <AuthTabs />

                            <div
                                className="
                                    min-w-0
                                    px-3 pb-4 pt-7
                                    sm:px-5 sm:pb-5
                                "
                            >
                                <AuthTransition
                                    transitionKey={
                                        location.pathname
                                    }
                                    direction={direction}
                                >
                                    {outlet}
                                </AuthTransition>
                            </div>
                        </motion.div>

                        <p
                            className="
                                mt-5
                                px-4
                                text-center text-xs
                                text-muted-foreground
                            "
                        >
                            Ao continuar, você concorda com
                            as políticas de segurança da
                            plataforma.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AuthLayout;