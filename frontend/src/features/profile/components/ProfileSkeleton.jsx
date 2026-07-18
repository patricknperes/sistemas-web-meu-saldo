function ProfileSkeleton() {
    return (
        <div className="space-y-5" aria-label="Carregando perfil" aria-busy="true">
            <div className="h-44 animate-pulse rounded-card border border-border bg-surface" />
            <div className="grid gap-4 lg:grid-cols-12">
                <div className="h-80 animate-pulse rounded-card border border-border bg-surface lg:col-span-7" />
                <div className="h-80 animate-pulse rounded-card border border-border bg-surface lg:col-span-5" />
            </div>
        </div>
    );
}

export default ProfileSkeleton;
