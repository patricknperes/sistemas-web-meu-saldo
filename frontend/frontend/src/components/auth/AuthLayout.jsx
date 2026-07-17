import {
    useMemo,
} from "react";

import {
    useLocation,
    useNavigate,
    useOutlet,
} from "react-router";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiBarChartGroupedLine,
    RiCheckLine,
    RiLock2Line,
    RiSparkling2Line,
    RiWallet3Line,
} from "react-icons/ri";

import ThemeToggle from "../theme/ThemeToggle.jsx";

import {
    AuthBrand,
    AuthShell,
    AuthTabs,
} from "../ui/auth/index.js";

const authTabs = [
    {
        value: "/login",
        label: "Entrar",
    },
    {
        value: "/cadastro",
        label: "Criar conta",
    },
];

const routeContent = {
    "/login": {
        eyebrow: "Visão financeira clara",
        title: "Suas finanças, organizadas sem complicação.",
        description:
            "Acompanhe entradas, despesas, recorrências e evolução do saldo em uma experiência simples e segura.",
        maxWidth: "md",
    },
    "/cadastro": {
        eyebrow: "Comece agora",
        title: "Construa uma rotina financeira mais consciente.",
        description:
            "Crie sua conta, registre suas movimentações e transforme números dispersos em decisões mais tranquilas.",
        maxWidth: "lg",
    },
    "/esqueci-senha": {
        eyebrow: "Recuperação segura",
        title: "Volte para sua conta com poucos passos.",
        description:
            "Solicite um link temporário e redefina sua senha sem comprometer a segurança dos seus dados.",
        maxWidth: "md",
    },
    "/redefinir-senha": {
        eyebrow: "Proteja seu acesso",
        title: "Uma nova senha para continuar com segurança.",
        description:
            "O link de recuperação é validado antes da alteração e pode ser utilizado apenas uma vez.",
        maxWidth: "md",
    },
};

const featureItems = [
    {
        icon: RiBarChartGroupedLine,
        title: "Tudo em uma visão",
        description: "Saldo, receitas, despesas e histórico organizados no mesmo lugar.",
    },
    {
        icon: RiLock2Line,
        title: "Acesso protegido",
        description: "Sua conta e suas informações financeiras permanecem privadas.",
    },
];

function AuthAside({ content }) {
    return (
        <div className="relative flex h-full min-h-[620px] flex-col overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full border border-white/10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-12 size-44 rounded-full border border-white/10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full bg-white/10 blur-3xl"
            />

            <AuthBrand
                inverse
                icon={<RiWallet3Line size={21} aria-hidden="true" />}
            />

            <div className="relative z-10 my-auto py-12">
                <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1.5 text-overline font-extrabold uppercase tracking-overline text-white/80">
                    <RiSparkling2Line size={14} aria-hidden="true" />
                    {content.eyebrow}
                </span>

                <h2 className="mt-5 max-w-lg text-[clamp(2rem,3vw,3.25rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-white">
                    {content.title}
                </h2>

                <p className="mt-5 max-w-md text-body leading-7 text-white/68">
                    {content.description}
                </p>

                <div className="mt-9 grid gap-3">
                    {featureItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm"
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                                    <Icon size={18} aria-hidden="true" />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-body-sm font-bold text-white">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-caption leading-5 text-white/62">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="relative z-10 rounded-xl border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-caption font-semibold text-white/60">
                            Organização do mês
                        </p>
                        <p className="mt-1 text-xl font-extrabold tracking-heading text-white">
                            74% concluído
                        </p>
                    </div>

                    <span className="flex size-10 items-center justify-center rounded-xl bg-white text-primary">
                        <RiCheckLine size={21} aria-hidden="true" />
                    </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-pill bg-white/15">
                    <div className="h-full w-[74%] rounded-pill bg-white" />
                </div>
            </div>
        </div>
    );
}

function AuthLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const outlet = useOutlet();

    const content = routeContent[location.pathname] ?? routeContent["/login"];
    const showTabs = ["/login", "/cadastro"].includes(location.pathname);

    const routeKey = useMemo(
        () => `${location.pathname}${location.search}`,
        [location.pathname, location.search]
    );

    return (
        <AuthShell
            maxWidth={content.maxWidth}
            aside={<AuthAside content={content} />}
            brand={(
                <div className="flex w-full min-w-0 items-center justify-between gap-4">
                    <AuthBrand />
                    <ThemeToggle />
                </div>
            )}
            footer={(
                <span>
                    © {new Date().getFullYear()} Meu Saldo. Seus dados financeiros em um só lugar.
                </span>
            )}
            contentClassName={showTabs ? "sm:p-7" : "sm:p-8"}
        >
            {showTabs ? (
                <AuthTabs
                    value={location.pathname}
                    onChange={navigate}
                    options={authTabs}
                    className="mb-7"
                />
            ) : null}

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={routeKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0"
                >
                    {outlet}
                </motion.div>
            </AnimatePresence>
        </AuthShell>
    );
}

export default AuthLayout;
