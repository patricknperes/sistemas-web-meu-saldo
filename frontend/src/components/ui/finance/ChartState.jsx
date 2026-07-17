import {
    RiBarChartBoxLine,
    RiErrorWarningLine,
    RiRefreshLine,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import {
    Skeleton,
} from "../feedback/Skeleton.jsx";
import {
    mergeClasses,
} from "./financeUtils.js";

function ChartLoading({ className = "" }) {
    return (
        <div
            className={mergeClasses(
                "flex h-full min-h-56 items-end gap-3 px-2 pb-2 pt-10",
                className
            )}
            aria-label="Carregando gráfico"
            role="status"
        >
            {[42, 68, 50, 84, 58, 76, 64, 92].map((height, index) => (
                <Skeleton
                    key={`${height}-${index}`}
                    className="min-w-0 flex-1 rounded-t-md rounded-b-sm"
                    style={{ height: `${height}%` }}
                />
            ))}
        </div>
    );
}

function ChartState({
    state = "empty",
    title,
    description,
    onRetry,
    className = "",
}) {
    if (state === "loading") {
        return <ChartLoading className={className} />;
    }

    const isError = state === "error";
    const Icon = isError ? RiErrorWarningLine : RiBarChartBoxLine;

    return (
        <div
            className={mergeClasses(
                "flex min-h-56 flex-col items-center justify-center px-5 py-8 text-center",
                className
            )}
            role={isError ? "alert" : "status"}
        >
            <span
                aria-hidden="true"
                className={mergeClasses(
                    "flex size-11 items-center justify-center rounded-xl border",
                    isError
                        ? "border-danger/15 bg-danger-muted text-danger"
                        : "border-border bg-surface-muted text-muted-foreground"
                )}
            >
                <Icon size={21} />
            </span>

            <h4 className="mt-4 text-card-title font-semibold text-foreground">
                {title || (isError ? "Não foi possível carregar" : "Ainda não há dados")}
            </h4>

            <p className="mt-1.5 max-w-sm text-caption text-muted-foreground">
                {description || (
                    isError
                        ? "Tente atualizar os dados para exibir o gráfico novamente."
                        : "Os dados aparecerão aqui assim que houver movimentações no período."
                )}
            </p>

            {isError && onRetry ? (
                <Button
                    size="sm"
                    variant="outline"
                    leadingIcon={<RiRefreshLine size={16} aria-hidden="true" />}
                    className="mt-4"
                    onClick={onRetry}
                >
                    Tentar novamente
                </Button>
            ) : null}
        </div>
    );
}

export {
    ChartLoading,
};

export default ChartState;
