import { RefreshCw, TriangleAlert } from "lucide-react";

import Button from "../../../components/ui/Button.jsx";

function DashboardErrorState({ message, onRetry }) {
    return (
        <section role="alert" className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-danger/15 bg-surface px-6 text-center shadow-card">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-danger-muted text-danger">
                <TriangleAlert className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">Não foi possível carregar o Dashboard</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{message}</p>
            <Button className="mt-5" onClick={onRetry}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Tentar novamente
            </Button>
        </section>
    );
}

export default DashboardErrorState;
