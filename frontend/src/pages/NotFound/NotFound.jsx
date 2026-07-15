import {
    motion,
} from "motion/react";

import {
    FiAlertCircle,
    FiArrowLeft,
    FiHome,
} from "react-icons/fi";

import {
    Link,
} from "react-router";

function NotFound() {
    return (
        <main
            className="
                relative
                flex min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-background
                px-4 py-10
                text-foreground
                sm:px-6
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
                        -right-32 -top-40
                        size-[360px]
                        rounded-full
                        bg-primary/[0.06]
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-44 -left-28
                        size-[340px]
                        rounded-full
                        bg-sky-500/[0.05]
                        blur-3xl
                    "
                />
            </div>

            <motion.section
                initial={{
                    opacity: 0,
                    y: 18,
                    scale: 0.98,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.35,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                    ],
                }}
                className="
                    relative
                    w-full max-w-lg
                    overflow-hidden
                    rounded-[30px]
                    border border-border
                    bg-surface
                    shadow-2xl
                    shadow-slate-950/10
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        h-1.5 w-full
                        bg-gradient-to-r
                        from-sky-500
                        via-blue-600
                        to-indigo-600
                    "
                />

                <div
                    className="
                        relative
                        px-5 py-8
                        text-center
                        sm:px-8
                        sm:py-10
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            left-1/2 top-5
                            -translate-x-1/2
                            select-none
                            text-[108px]
                            font-black
                            leading-none
                            tracking-tighter
                            text-primary/[0.045]
                            sm:text-[132px]
                        "
                    >
                        404
                    </span>

                    <motion.div
                        initial={{
                            rotate: -8,
                            scale: 0.85,
                        }}
                        animate={{
                            rotate: 0,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.08,
                            type: "spring",
                            stiffness: 280,
                            damping: 18,
                        }}
                        className="
                            relative
                            mx-auto
                            flex size-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-sky-500
                            via-blue-600
                            to-indigo-700
                            text-white
                            shadow-lg
                            shadow-blue-500/25
                        "
                    >
                        <FiAlertCircle
                            size={28}
                            aria-hidden="true"
                        />
                    </motion.div>

                    <span
                        className="
                            mt-6
                            inline-flex
                            items-center
                            rounded-full
                            bg-primary-muted
                            px-3 py-1.5
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-primary
                        "
                    >
                        Erro 404
                    </span>

                    <h1
                        className="
                            mt-4
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-foreground
                            sm:text-3xl
                        "
                    >
                        Página não encontrada
                    </h1>

                    <p
                        className="
                            mx-auto mt-3
                            max-w-md
                            text-sm
                            leading-6
                            text-muted-foreground
                        "
                    >
                        O endereço acessado não existe, foi alterado ou não está mais disponível.
                    </p>

                    <div
                        className="
                            mt-7
                            flex flex-col
                            gap-2.5
                            sm:flex-row
                            sm:justify-center
                        "
                    >
                        <Link
                            to="/dashboard"
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-sky-500
                                via-blue-600
                                to-indigo-700
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-blue-500/20
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-xl
                                hover:shadow-blue-500/25
                                focus-visible:outline-none
                                focus-visible:ring-4
                                focus-visible:ring-blue-500/20
                                sm:w-auto
                            "
                        >
                            <FiHome
                                size={17}
                                aria-hidden="true"
                            />

                            Ir para a Dashboard
                        </Link>

                        <Link
                            to="/"
                            className="
                                inline-flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border border-border
                                bg-surface
                                px-5
                                text-sm
                                font-semibold
                                text-foreground
                                transition
                                hover:border-border-strong
                                hover:bg-surface-hover
                                focus-visible:outline-none
                                focus-visible:ring-4
                                focus-visible:ring-ring/10
                                sm:w-auto
                            "
                        >
                            <FiArrowLeft
                                size={17}
                                aria-hidden="true"
                            />

                            Voltar ao início
                        </Link>
                    </div>
                </div>

                <footer
                    className="
                        border-t border-border
                        bg-surface-muted/35
                        px-5 py-4
                        text-center
                    "
                >
                    <p
                        className="
                            text-xs
                            text-muted-foreground
                        "
                    >
                        Verifique o endereço informado ou retorne à área principal do sistema.
                    </p>
                </footer>
            </motion.section>
        </main>
    );
}

export default NotFound;