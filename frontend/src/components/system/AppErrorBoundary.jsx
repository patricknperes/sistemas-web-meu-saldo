import { Component } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import BrandMark from "../ui/BrandMark.jsx";
import Button from "../ui/Button.jsx";

class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error("Erro não tratado na interface:", error, errorInfo);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <main className="relative flex min-h-screen min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-48 -top-52 size-[520px] rounded-full bg-danger/[0.08] blur-3xl" />
                    <div className="absolute -bottom-60 -left-40 size-[520px] rounded-full bg-primary/[0.07] blur-3xl" />
                </div>

                <section role="alert" className="relative w-full max-w-lg rounded-dialog border border-border bg-surface p-6 text-center shadow-dialog sm:p-8">
                    <BrandMark className="justify-center" />
                    <span className="mx-auto mt-8 flex size-14 items-center justify-center rounded-2xl bg-danger-muted text-danger">
                        <TriangleAlert size={26} aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-danger">Falha inesperada</p>
                    <h1 className="mt-2 text-balance text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
                        Não foi possível concluir esta operação.
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        A interface encontrou um erro inesperado. Seus dados permanecem protegidos e a página pode ser recarregada com segurança.
                    </p>
                    <Button className="mt-7" onClick={this.handleReload}>
                        <RefreshCw size={17} aria-hidden="true" />
                        Recarregar página
                    </Button>
                </section>
            </main>
        );
    }
}

export default AppErrorBoundary;
