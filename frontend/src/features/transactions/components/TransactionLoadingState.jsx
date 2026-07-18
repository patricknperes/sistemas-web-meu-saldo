function TransactionLoadingState() {
    return (
        <div className="divide-y divide-border" aria-label="Carregando movimentações" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                    <span className="size-10 animate-pulse rounded-control bg-surface-muted" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <span className="block h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
                        <span className="block h-2.5 w-1/2 animate-pulse rounded bg-surface-muted" />
                    </div>
                    <span className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
                </div>
            ))}
        </div>
    );
}

export default TransactionLoadingState;
