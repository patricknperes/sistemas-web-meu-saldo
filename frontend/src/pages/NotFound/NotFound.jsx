import { ArrowLeft, Compass, LayoutDashboard, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";

import BrandMark from "../../components/ui/BrandMark.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

function NotFound() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const destination = isAuthenticated ? "/dashboard" : "/login";
    const DestinationIcon = isAuthenticated ? LayoutDashboard : LogIn;
    const destinationLabel = isAuthenticated ? "Ir para a Dashboard" : "Ir para o login";

    return (
        <main
            data-route-focus
            tabIndex={-1}
            className="relative flex min-h-screen min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground outline-none sm:px-6"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-52 size-[520px] rounded-full bg-primary/[0.08] blur-3xl" />
                <div className="absolute -bottom-56 -left-40 size-[500px] rounded-full bg-accent/[0.06] blur-3xl" />
                <div className="page-grid-background absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
            </div>

            <motion.section
                initial={{ opacity: 0, y: 16, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel relative w-full max-w-xl overflow-hidden rounded-dialog p-6 text-center sm:p-9"
            >
                <div className="flex justify-center">
                    <BrandMark />
                </div>

                <div className="relative mx-auto mt-8 flex size-20 items-center justify-center rounded-[24px] border border-primary/15 bg-primary-soft text-primary shadow-card">
                    <Compass size={34} strokeWidth={1.7} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 rounded-full border border-border bg-surface px-2 py-1 text-[10px] font-black tracking-[0.12em] text-muted-foreground shadow-xs">
                        404
                    </span>
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.17em] text-primary">Rota não encontrada</p>
                <h1 className="mt-2 text-balance text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
                    Esta página saiu do mapa.
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    O endereço pode ter sido alterado, removido ou digitado incorretamente. Use uma das opções abaixo para continuar com segurança.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link to={destination}>
                            <DestinationIcon size={18} aria-hidden="true" />
                            {destinationLabel}
                        </Link>
                    </Button>
                    <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} aria-hidden="true" />
                        Voltar à página anterior
                    </Button>
                </div>

                <p className="mt-7 border-t border-border pt-5 text-xs leading-5 text-subtle-foreground">
                    Nenhuma informação financeira foi alterada.
                </p>
            </motion.section>
        </main>
    );
}

export default NotFound;
