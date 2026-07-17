import {
    RiCheckboxCircleLine,
    RiWallet3Line,
} from "react-icons/ri";

import {
    getSystemPagePreset,
} from "./systemPagePresets.js";

function joinClassNames(...values) {
    return values.filter(Boolean).join(" ");
}

function StatusVisual({
    preset,
    code,
    status,
    icon: CustomIcon,
}) {
    const Icon = CustomIcon || preset.icon;

    return (
        <div className="relative mx-auto flex w-full max-w-[28rem] items-center justify-center py-8 sm:py-12">
            <div
                aria-hidden="true"
                className={joinClassNames(
                    "absolute size-56 rounded-full blur-3xl sm:size-72",
                    preset.glowClassName
                )}
            />

            <div
                aria-hidden="true"
                className={joinClassNames(
                    "absolute size-[19rem] rounded-full border sm:size-[24rem]",
                    preset.lineClassName
                )}
            />

            <div
                aria-hidden="true"
                className={joinClassNames(
                    "absolute size-[14rem] rounded-full border border-dashed sm:size-[18rem]",
                    preset.lineClassName
                )}
            />

            <div className="relative z-10 w-full max-w-[20rem] rounded-[1.75rem] border border-border bg-surface/94 p-5 shadow-xl backdrop-blur sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <span
                        className={joinClassNames(
                            "flex size-12 items-center justify-center rounded-2xl",
                            preset.accentClassName
                        )}
                    >
                        <Icon size={25} aria-hidden="true" />
                    </span>

                    <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-overline font-bold uppercase tracking-overline text-muted-foreground">
                        {code}
                    </span>
                </div>

                <div className="mt-8 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>

                <div className="mt-5 grid gap-3">
                    <div className="h-3 w-4/5 rounded-full bg-border-strong" />
                    <div className="h-3 w-3/5 rounded-full bg-border" />
                    <div className="h-3 w-2/5 rounded-full bg-border" />
                </div>

                <div className="mt-7 flex items-center gap-2 rounded-xl border border-border bg-surface-subtle p-3">
                    <span className={joinClassNames(
                        "flex size-8 items-center justify-center rounded-lg",
                        preset.accentClassName
                    )}>
                        <RiCheckboxCircleLine size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-body-sm font-bold text-foreground">
                            {status}
                        </p>
                        <p className="truncate text-caption text-muted-foreground">
                            Ambiente protegido pelo Meu Saldo
                        </p>
                    </div>
                </div>
            </div>

            <span
                aria-hidden="true"
                className={joinClassNames(
                    "absolute left-2 top-8 size-3 rounded-full sm:left-5",
                    preset.glowClassName
                )}
            />
            <span
                aria-hidden="true"
                className="absolute bottom-12 right-4 size-2 rounded-full bg-primary/45 sm:right-8"
            />
        </div>
    );
}

function SystemPage({
    variant = "error",
    code,
    eyebrow,
    title,
    description,
    status,
    icon,
    primaryAction,
    secondaryAction,
    support,
    brand = "Meu Saldo",
    showBrand = true,
    embedded = false,
    compact = false,
    className = "",
}) {
    const preset = getSystemPagePreset(variant);
    const resolvedCode = code || preset.code;
    const resolvedEyebrow = eyebrow || preset.eyebrow;
    const resolvedTitle = title || preset.title;
    const resolvedDescription = description || preset.description;
    const resolvedStatus = status || preset.status;

    return (
        <main
            className={joinClassNames(
                "relative isolate overflow-hidden bg-background text-foreground",
                embedded
                    ? "min-h-[38rem] rounded-2xl border border-border"
                    : "min-h-dvh",
                className
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
            />

            <div
                aria-hidden="true"
                className={joinClassNames(
                    "pointer-events-none absolute -right-28 -top-36 size-[28rem] rounded-full blur-3xl",
                    preset.glowClassName
                )}
            />

            <div
                className={joinClassNames(
                    "relative mx-auto flex min-h-[inherit] w-full max-w-[88rem] flex-col px-page",
                    compact ? "py-7" : "py-8 sm:py-12 lg:py-16"
                )}
            >
                {showBrand ? (
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                            <RiWallet3Line size={21} aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-body-sm font-extrabold tracking-tight text-foreground">
                                {brand}
                            </p>
                            <p className="text-caption text-muted-foreground">
                                Clareza para suas finanças
                            </p>
                        </div>
                    </div>
                ) : null}

                <div
                    className={joinClassNames(
                        "grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]",
                        compact ? "py-6 lg:py-8" : "py-10 lg:py-14"
                    )}
                >
                    <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={joinClassNames(
                                "rounded-full px-3 py-1.5 text-overline font-extrabold uppercase tracking-overline",
                                preset.accentClassName
                            )}>
                                {resolvedEyebrow}
                            </span>

                            <span className="text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                Código {resolvedCode}
                            </span>
                        </div>

                        <h1
                            className={joinClassNames(
                                "mt-6 max-w-xl font-extrabold tracking-tight text-foreground",
                                compact
                                    ? "text-[clamp(2rem,6vw,3.4rem)] leading-[1.05]"
                                    : "text-[clamp(2.5rem,7vw,5.25rem)] leading-[0.98]"
                            )}
                        >
                            {resolvedTitle}
                        </h1>

                        <p className="mt-5 max-w-xl text-body text-muted-foreground sm:text-body-lg">
                            {resolvedDescription}
                        </p>

                        {(primaryAction || secondaryAction) ? (
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                {primaryAction}
                                {secondaryAction}
                            </div>
                        ) : null}

                        {support ? (
                            <div className="mt-7 border-l-2 border-primary/35 pl-4 text-body-sm text-muted-foreground">
                                {support}
                            </div>
                        ) : null}
                    </div>

                    <StatusVisual
                        preset={preset}
                        code={resolvedCode}
                        status={resolvedStatus}
                        icon={icon}
                    />
                </div>
            </div>
        </main>
    );
}

export default SystemPage;
