import { motion } from "motion/react";
import { BarChart3, LockKeyhole, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { useLocation, useOutlet } from "react-router";
import AuthTabs from "./AuthTabs.jsx";
import AuthTransition from "../transitions/AuthTransition.jsx";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import BrandMark from "../ui/BrandMark.jsx";

const highlights = [
    { icon: BarChart3, title: "Visão completa", description: "Entenda para onde seu dinheiro vai sem planilhas complicadas." },
    { icon: ShieldCheck, title: "Acesso protegido", description: "Sua conta e seus dados financeiros permanecem seguros." },
];

function AuthLayout() {
    const location = useLocation();
    const outlet = useOutlet();
    const isMainAuth = ["/login", "/cadastro"].includes(location.pathname);

    return (
        <main data-route-focus tabIndex={-1} className="relative min-h-screen min-h-dvh overflow-hidden bg-background text-foreground outline-none">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-52 -top-56 size-[520px] rounded-full bg-primary/[0.08] blur-3xl" />
                <div className="absolute -bottom-60 -left-44 size-[520px] rounded-full bg-accent/[0.07] blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
            </div>

            <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6"><ThemeToggle /></div>

            <div className="relative flex min-h-screen min-h-dvh items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <motion.section
                    layout
                    transition={{ layout: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } }}
                    className="grid w-full max-w-[1180px] overflow-hidden rounded-[30px] border border-border/90 bg-surface shadow-2xl shadow-slate-950/[0.08] lg:grid-cols-[0.95fr_1.05fr]"
                >
                    <aside className="relative hidden min-w-0 overflow-hidden bg-[#071513] p-8 text-white lg:flex lg:min-h-[720px] lg:flex-col lg:justify-between xl:p-10">
                        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(34,211,238,0.14),transparent_32%)]" />
                        <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:42px_42px]" />

                        <div className="relative z-10">
                            <BrandMark className="[&_strong]:text-white [&_span_span]:text-white/55" />
                        </div>

                        <div className="relative z-10 max-w-md py-12">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary backdrop-blur"><WalletCards size={23} /></div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Controle com clareza</p>
                            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-[2.75rem]">Sua vida financeira, organizada em um único lugar.</h2>
                            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">Acompanhe receitas, despesas, recorrências e tendências com uma experiência simples, elegante e segura.</p>

                            <div className="mt-9 grid gap-3">
                                {highlights.map(({ icon: Icon, title, description }) => (
                                    <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Icon size={18} /></span>
                                        <span className="min-w-0"><strong className="block text-sm font-semibold text-white">{title}</strong><span className="mt-1 block text-xs leading-5 text-white/55">{description}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-xs text-white/45"><LockKeyhole size={14} /><span>Conexão segura e dados vinculados à sua conta</span></div>
                    </aside>

                    <div className="flex min-w-0 flex-col bg-surface px-5 py-6 sm:px-8 sm:py-8 lg:min-h-[720px] lg:px-12 xl:px-16">
                        <div className="mb-8 flex items-center justify-between lg:hidden"><BrandMark /><span className="flex size-9 items-center justify-center rounded-xl bg-primary-muted text-primary"><Sparkles size={17} /></span></div>
                        {isMainAuth && <AuthTabs />}
                        <div className={`flex flex-1 items-center ${isMainAuth ? "pt-8" : "pt-2"}`}>
                            <div className="w-full min-w-0">
                                <AuthTransition direction={location.pathname === "/cadastro" ? 1 : -1} transitionKey={location.pathname}>
                                    {outlet}
                                </AuthTransition>
                            </div>
                        </div>
                        <p className="mt-8 text-center text-[11px] leading-5 text-subtle-foreground">Ao continuar, você concorda com o uso responsável da plataforma e com a proteção dos seus dados.</p>
                    </div>
                </motion.section>
            </div>
        </main>
    );
}

export default AuthLayout;
