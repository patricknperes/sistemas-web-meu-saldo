import {
    useLocation,
    useOutlet,
} from "react-router";

import {
    motion,
} from "motion/react";

import {
    RiArrowRightUpLine,
    RiBarChartBoxLine,
    RiShieldCheckLine,
    RiWallet3Line,
} from "react-icons/ri";

import AuthTabs from "./AuthTabs.jsx";
import AuthTransition from "../transitions/AuthTransition.jsx";
import ThemeToggle from "../theme/ThemeToggle.jsx";

const features = [
    {
        icon: RiBarChartBoxLine,
        title: "Visão organizada",
        description:
            "Receitas, despesas e saldo em um só lugar.",
    },
    {
        icon: RiShieldCheckLine,
        title: "Acesso protegido",
        description:
            "Seus dados permanecem vinculados à sua conta.",
    },
];

function Brand({
    inverse = false,
}) {
    return (
        <div
            className="
                flex min-w-0
                items-center gap-3
            "
        >
            <span
                className={`
                    flex size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    shadow-lg

                    ${inverse
                        ? `
                                bg-white/15
                                text-white
                                ring-1
                                ring-inset
                                ring-white/20
                            `
                        : `
                                bg-gradient-to-br
                                from-sky-500
                                via-blue-600
                                to-indigo-700
                                text-white
                                shadow-blue-500/20
                            `
                    }
                `}
            >
                <RiWallet3Line
                    size={22}
                    aria-hidden="true"
                />
            </span>

            <span className="min-w-0">
                <strong
                    className={`
                        block truncate
                        text-base
                        font-semibold

                        ${inverse
                            ? "text-white"
                            : "text-foreground"
                        }
                    `}
                >
                    Meu Saldo
                </strong>

                <span
                    className={`
                        mt-0.5
                        block truncate
                        text-xs

                        ${inverse
                            ? "text-white/65"
                            : "text-muted-foreground"
                        }
                    `}
                >
                    Controle financeiro pessoal
                </span>
            </span>
        </div>
    );
}

function AuthLayout() {
    const location =
        useLocation();

    const outlet =
        useOutlet();

    const registerMode =
        location.pathname ===
        "/cadastro";

    const direction =
        registerMode
            ? 1
            : -1;

    return (
        <main
            className="
                relative
                min-h-screen min-h-dvh
                overflow-x-hidden
                bg-background
                text-foreground
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
                        -right-44 -top-52
                        size-[460px]
                        rounded-full
                        bg-primary/[0.06]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-56 -left-28
                        size-[420px]
                        rounded-full
                        bg-sky-500/[0.05]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute inset-0
                        bg-[linear-gradient(to_right,rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.045)_1px,transparent_1px)]
                        bg-[size:44px_44px]
                        [mask-image:linear-gradient(to_bottom,black,transparent_85%)]
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
                    items-center
                    justify-center
                    px-4 py-16
                    sm:px-6
                    lg:px-8
                "
            >
                <motion.section
                    layout
                    transition={{
                        layout: {
                            duration: 0.28,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        },
                    }}
                    className="
                        grid w-full
                        max-w-6xl
                        overflow-hidden
                        rounded-[32px]
                        border border-border
                        bg-surface
                        shadow-2xl
                        shadow-slate-950/[0.09]
                        lg:grid-cols-[0.88fr_1.12fr]
                    "
                >
                    <aside
                        className="
                            relative
                            hidden min-w-0
                            overflow-hidden
                            bg-gradient-to-br
                            from-sky-500
                            via-blue-600
                            to-indigo-800
                            p-8
                            text-white
                            lg:flex
                            lg:flex-col
                            lg:justify-between
                            xl:p-10
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                -right-24 -top-28
                                size-64
                                rounded-full
                                border border-white/10
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                right-8 top-12
                                size-40
                                rounded-full
                                border border-white/10
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                -bottom-28 -left-20
                                size-72
                                rounded-full
                                bg-white/10
                                blur-3xl
                            "
                        />

                        <div className="relative z-10">
                            <Brand inverse />
                        </div>

                        <motion.div
                            key={
                                registerMode
                                    ? "register-copy"
                                    : "login-copy"
                            }
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
                                relative z-10
                                my-12
                                max-w-md
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-white/15
                                    px-3 py-1.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.13em]
                                    text-white/85
                                    ring-1
                                    ring-inset
                                    ring-white/15
                                "
                            >
                                {registerMode
                                    ? "Comece agora"
                                    : "Bem-vindo de volta"
                                }
                            </span>

                            <h1
                                className="
                                    mt-5
                                    text-3xl
                                    font-semibold
                                    leading-tight
                                    tracking-tight
                                    text-white
                                    xl:text-4xl
                                "
                            >
                                {registerMode
                                    ? "Organize sua vida financeira desde o primeiro lançamento."
                                    : "Continue acompanhando suas finanças com clareza."
                                }
                            </h1>

                            <p
                                className="
                                    mt-4
                                    text-sm
                                    leading-6
                                    text-white/70
                                "
                            >
                                Uma experiência direta para registrar movimentações, acompanhar resultados e cuidar melhor do seu dinheiro.
                            </p>

                            <div
                                className="
                                    mt-7 space-y-3
                                "
                            >
                                {features.map(
                                    ({
                                        icon: Icon,
                                        title,
                                        description,
                                    }) => (
                                        <div
                                            key={title}
                                            className="
                                                flex min-w-0
                                                items-center gap-3
                                                rounded-2xl
                                                border border-white/10
                                                bg-white/[0.08]
                                                p-3.5
                                                backdrop-blur-sm
                                            "
                                        >
                                            <span
                                                className="
                                                    flex size-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-white/15
                                                "
                                            >
                                                <Icon
                                                    size={17}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span className="min-w-0">
                                                <strong
                                                    className="
                                                        block truncate
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    {title}
                                                </strong>

                                                <span
                                                    className="
                                                        mt-0.5
                                                        block truncate
                                                        text-xs
                                                        text-white/60
                                                    "
                                                >
                                                    {description}
                                                </span>
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>

                        <div
                            className="
                                relative z-10
                                flex items-center
                                justify-between
                                gap-4
                                text-xs
                                text-white/55
                            "
                        >
                            <span>
                                © {new Date().getFullYear()} Meu Saldo
                            </span>

                            <RiArrowRightUpLine
                                size={16}
                                aria-hidden="true"
                            />
                        </div>
                    </aside>

                    <section
                        className="
                            min-w-0
                            bg-surface
                            px-4 py-5
                            sm:px-7 sm:py-7
                            lg:px-9 lg:py-8
                            xl:px-11
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full max-w-xl
                                min-w-0
                            "
                        >
                            <div
                                className="
                                    mb-6
                                    flex items-center
                                    justify-between
                                    gap-4
                                    lg:hidden
                                "
                            >
                                <Brand />
                            </div>

                            <AuthTabs />

                            <div
                                className="
                                    min-w-0
                                    pt-6
                                "
                            >
                                <AuthTransition
                                    transitionKey={
                                        location.pathname
                                    }
                                    direction={
                                        direction
                                    }
                                >
                                    {outlet}
                                </AuthTransition>
                            </div>
                        </div>
                    </section>
                </motion.section>
            </div>
        </main>
    );
}

export default AuthLayout;