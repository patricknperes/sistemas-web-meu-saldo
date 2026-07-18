function Block({ className }) {
    return <div className={`animate-pulse rounded-card bg-surface-muted ${className}`} />;
}

function DashboardSkeleton() {
    return (
        <div className="space-y-5" aria-label="Carregando dashboard" aria-busy="true">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <Block className="h-8 w-56" />
                    <Block className="h-4 w-72 max-w-full" />
                </div>
                <Block className="h-12 w-full sm:w-96" />
            </div>
            <div className="grid gap-4 lg:grid-cols-12">
                <Block className="h-72 lg:col-span-7" />
                <Block className="h-72 lg:col-span-5" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Block className="h-36" />
                <Block className="h-36" />
                <Block className="h-36 sm:col-span-2 xl:col-span-1" />
            </div>
            <div className="grid gap-4 lg:grid-cols-12">
                <Block className="h-96 lg:col-span-7" />
                <Block className="h-96 lg:col-span-5" />
            </div>
        </div>
    );
}

export default DashboardSkeleton;
