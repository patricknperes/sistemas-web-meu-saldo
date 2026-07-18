import { motion } from "motion/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react";
import {
    useLocation,
    useOutlet,
} from "react-router";

import logoTemaClaro from "../../assets/images/logo-completa-tema-claro.svg";
import logoTemaEscuro from "../../assets/images/logo-completa-tema-escuro.svg";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import AuthTransition from "../transitions/AuthTransition.jsx";
import AuthTabs from "./AuthTabs.jsx";

const highlights = [
    {
        icon: BarChart3,
        title: "Visão completa",
        description: "Receitas, despesas e saldo organizados em uma única visão.",
    },
    {
        icon: ShieldCheck,
        title: "Acesso protegido",
        description: "Seus dados financeiros permanecem vinculados à sua conta.",
    },
];

const chartBars = [
    38,
    54,
    46,
    68,
    57,
    78,
    65,
    86,
    74,
    94,
];

function ResponsiveLogo({
    className = "",
}) {
    return (
        <span
            aria-label="Meu Saldo"
            className={`block ${className}`}
        >
            <img
                src={logoTemaClaro}
                alt=""
                aria-hidden="true"
                className="block size-full object-contain dark:hidden"
            />

            <img
                src={logoTemaEscuro}
                alt=""
                aria-hidden="true"
                className="hidden size-full object-contain dark:block"
            />
        </span>
    );
}

function FinancialPreview() {
    return (
        <div
            aria-hidden="true"
            className="
                relative
                min-w-0
                overflow-hidden
                rounded-[20px]
                border border-white/10
                bg-white/[0.06]
                p-4
                shadow-xl
                shadow-black/15
                backdrop-blur-xl
            "
        >
            <div
                className="
                    absolute
                    -right-14 -top-14
                    size-36
                    rounded-full
                    bg-blue-400/15
                    blur-3xl
                "
            />

            <div className="relative min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-blue-200/65
                            "
                        >
                            Visão financeira
                        </p>

                        <p
                            className="
                                mt-1.5
                                truncate
                                text-base
                                font-semibold
                                tracking-[-0.025em]
                                text-white
                            "
                        >
                            Seu mês em perspectiva
                        </p>
                    </div>

                    <span
                        className="
                            flex size-9
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-blue-400/15
                            text-blue-300
                        "
                    >
                        <WalletCards
                            aria-hidden="true"
                            size={18}
                            strokeWidth={1.8}
                        />
                    </span>
                </div>

                <div className="mt-5 flex h-16 min-w-0 items-end gap-1.5">
                    {chartBars.map((height, index) => (
                        <span
                            key={`${height}-${index}`}
                            className="
                                min-w-0
                                flex-1
                                rounded-t
                                bg-gradient-to-t
                                from-blue-600/65
                                to-blue-300/90
                            "
                            style={{
                                height: `${height}%`,
                                opacity: 0.56 + index * 0.04,
                            }}
                        />
                    ))}
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-2 gap-2.5">
                    <div
                        className="
                            flex min-w-0
                            items-center gap-2.5
                            rounded-xl
                            border border-white/10
                            bg-white/[0.05]
                            p-3
                        "
                    >
                        <span
                            className="
                                flex size-8
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                bg-emerald-400/15
                                text-emerald-300
                            "
                        >
                            <ArrowUpRight
                                aria-hidden="true"
                                size={16}
                                strokeWidth={1.9}
                            />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[10px] text-white/45">
                                Receitas
                            </p>

                            <p className="truncate text-xs font-semibold text-white">
                                Entradas
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            flex min-w-0
                            items-center gap-2.5
                            rounded-xl
                            border border-white/10
                            bg-white/[0.05]
                            p-3
                        "
                    >
                        <span
                            className="
                                flex size-8
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                bg-rose-400/15
                                text-rose-300
                            "
                        >
                            <ArrowDownRight
                                aria-hidden="true"
                                size={16}
                                strokeWidth={1.9}
                            />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[10px] text-white/45">
                                Despesas
                            </p>

                            <p className="truncate text-xs font-semibold text-white">
                                Gastos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuthLayout() {
    const location = useLocation();
    const outlet = useOutlet();

    const isMainAuth = [
        "/login",
        "/cadastro",
    ].includes(location.pathname);

    return (
        <main
            data-route-focus
            tabIndex={-1}
            className="
                relative
                min-h-screen min-h-dvh
                w-full max-w-full
                overflow-x-hidden
                bg-background
                text-foreground
                outline-none
                [overflow-x:clip]
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -right-56 -top-64
                        size-[540px]
                        rounded-full
                        bg-primary/[0.09]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-72 -left-52
                        size-[560px]
                        rounded-full
                        bg-info/[0.06]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute inset-0
                        bg-[linear-gradient(to_right,rgba(30,58,138,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,58,138,0.035)_1px,transparent_1px)]
                        bg-[size:54px_54px]
                        [mask-image:linear-gradient(to_bottom,black,transparent_95%)]
                        dark:opacity-50
                    "
                />
            </div>

            <div
                className="
                    absolute
                    right-4 top-4
                    z-30
                    sm:right-6 sm:top-6
                "
            >
                <ThemeToggle />
            </div>

            <div
                className="
                    relative
                    flex min-h-screen min-h-dvh
                    w-full max-w-full min-w-0
                    items-center justify-center
                    overflow-x-hidden
                    px-4 py-16
                    [overflow-x:clip]
                    sm:px-6
                    sm:py-20
                    lg:px-8
                "
            >
                <motion.section
                    layout
                    transition={{
                        layout: {
                            duration: 0.26,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        },
                    }}
                    className="
                        grid
                        w-full max-w-[1080px]
                        min-w-0
                        overflow-hidden
                        rounded-[26px]
                        border border-border/90
                        bg-surface
                        shadow-2xl
                        shadow-slate-950/[0.08]
                        lg:grid-cols-[1fr_0.92fr]
                        dark:shadow-black/30
                    "
                >
                    <aside
                        className="
                            relative
                            hidden min-w-0
                            overflow-hidden
                            bg-[#071A3D]
                            p-8
                            text-white
                            lg:flex
                            lg:min-h-[610px]
                            lg:flex-col
                            lg:justify-between
                            xl:p-9
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                absolute inset-0
                                bg-[radial-gradient(circle_at_8%_4%,rgba(96,165,250,0.27),transparent_34%),radial-gradient(circle_at_92%_88%,rgba(37,99,235,0.23),transparent_37%)]
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute inset-0
                                opacity-[0.18]
                                [background-image:linear-gradient(rgba(255,255,255,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)]
                                [background-size:46px_46px]
                                [mask-image:linear-gradient(to_bottom,black,transparent_92%)]
                            "
                        />

                        <div className="relative z-10">
                            <span
                                aria-label="Meu Saldo"
                                className="block w-40"
                            >
                                <img
                                    src={logoTemaEscuro}
                                    alt=""
                                    aria-hidden="true"
                                    className="block size-full object-contain"
                                />
                            </span>
                        </div>

                        <div className="relative z-10 my-auto min-w-0 max-w-lg py-7">
                            <div
                                className="
                                    mb-4
                                    inline-flex
                                    items-center gap-2
                                    rounded-full
                                    border border-blue-300/15
                                    bg-blue-300/[0.09]
                                    px-3 py-1.5
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-blue-200
                                "
                            >
                                <Sparkles
                                    aria-hidden="true"
                                    size={13}
                                    strokeWidth={1.8}
                                />

                                Controle com clareza
                            </div>

                            <h1
                                className="
                                    max-w-lg
                                    text-[2.15rem]
                                    font-semibold
                                    leading-[1.08]
                                    tracking-[-0.045em]
                                    text-white
                                    xl:text-[2.5rem]
                                "
                            >
                                Seu dinheiro organizado para decisões mais tranquilas.
                            </h1>

                            <p
                                className="
                                    mt-4
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-blue-100/60
                                "
                            >
                                Acompanhe receitas, despesas e recorrências em uma experiência simples, moderna e segura.
                            </p>

                            <div className="mt-6 min-w-0">
                                <FinancialPreview />
                            </div>
                        </div>

                        <div
                            className="
                                relative z-10
                                flex items-center
                                gap-2
                                text-xs
                                text-blue-100/45
                            "
                        >
                            <LockKeyhole
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                            />

                            <span>
                                Conexão segura e dados protegidos
                            </span>
                        </div>
                    </aside>

                    <section
                        className="
                            flex
                            min-w-0 max-w-full
                            flex-col
                            overflow-x-hidden
                            bg-surface
                            px-5 py-6
                            [overflow-x:clip]
                            sm:px-8
                            sm:py-7
                            lg:min-h-[610px]
                            lg:px-10
                            lg:py-8
                            xl:px-12
                        "
                    >
                        <ResponsiveLogo
                            className="w-36 max-w-full lg:hidden"
                        />

                        <div
                            className="
                                mx-auto
                                flex w-full
                                max-w-[410px]
                                min-w-0
                                flex-1 flex-col
                                justify-center
                                py-7
                                sm:py-8
                            "
                        >
                            {isMainAuth && (
                                <AuthTabs />
                            )}

                            <div
                                className={[
                                    "relative w-full min-w-0 max-w-full overflow-x-hidden [overflow-x:clip]",
                                    isMainAuth
                                        ? "pt-7"
                                        : "pt-2",
                                ].join(" ")}
                            >
                                <AuthTransition
                                    direction={
                                        location.pathname === "/cadastro"
                                            ? 1
                                            : -1
                                    }
                                    transitionKey={location.pathname}
                                >
                                    <div className="w-full min-w-0 max-w-full">
                                        {outlet}
                                    </div>
                                </AuthTransition>
                            </div>
                        </div>

                        <div className="mx-auto w-full max-w-[410px] min-w-0">
                            <div
                                className="
                                    mb-4
                                    grid min-w-0
                                    grid-cols-2
                                    gap-2
                                    lg:hidden
                                "
                            >
                                {highlights.map(({
                                    icon: Icon,
                                    title,
                                }) => (
                                    <div
                                        key={title}
                                        className="
                                            flex min-w-0
                                            items-center gap-2
                                            rounded-xl
                                            bg-primary-soft/60
                                            px-3 py-2.5
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className="size-4 shrink-0 text-primary"
                                            strokeWidth={1.8}
                                        />

                                        <span className="truncate">
                                            {title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p
                                className="
                                    text-center
                                    text-[11px]
                                    leading-5
                                    text-subtle-foreground
                                "
                            >
                                Ao continuar, você concorda com o uso responsável da plataforma e com a proteção dos seus dados.
                            </p>
                        </div>
                    </section>
                </motion.section>
            </div>
        </main>
    );
}

export default AuthLayout;