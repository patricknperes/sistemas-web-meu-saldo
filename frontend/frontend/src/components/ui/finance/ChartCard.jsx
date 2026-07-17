import Card from "../surfaces/Card.jsx";
import ChartLegend from "./ChartLegend.jsx";
import ChartState from "./ChartState.jsx";
import {
    mergeClasses,
} from "./financeUtils.js";

function ChartHeader({
    title,
    description,
    eyebrow,
    icon: Icon,
    actions,
    value,
    meta,
    className = "",
}) {
    return (
        <header
            className={mergeClasses(
                "flex min-w-0 flex-col gap-4 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
                className
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                {Icon ? (
                    <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary-muted text-primary"
                    >
                        <Icon size={19} />
                    </span>
                ) : null}

                <div className="min-w-0">
                    {eyebrow ? (
                        <p className="text-overline font-bold uppercase tracking-overline text-primary">
                            {eyebrow}
                        </p>
                    ) : null}

                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-card-title font-semibold text-foreground">
                            {title}
                        </h3>
                        {value ? (
                            <strong className="numeric-value text-body-sm font-extrabold text-foreground tabular-nums">
                                {value}
                            </strong>
                        ) : null}
                    </div>

                    {description ? (
                        <p className="mt-1 max-w-2xl text-caption text-muted-foreground">
                            {description}
                        </p>
                    ) : null}

                    {meta ? <div className="mt-2">{meta}</div> : null}
                </div>
            </div>

            {actions ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            ) : null}
        </header>
    );
}

function ChartBody({
    state = "ready",
    stateTitle,
    stateDescription,
    onRetry,
    height = 280,
    children,
    className = "",
}) {
    return (
        <div
            className={mergeClasses("relative min-w-0 px-5 py-5", className)}
            style={{ minHeight: height }}
        >
            {state === "ready" ? children : (
                <ChartState
                    state={state}
                    title={stateTitle}
                    description={stateDescription}
                    onRetry={onRetry}
                    className="min-h-[inherit]"
                />
            )}
        </div>
    );
}

function ChartFooter({
    children,
    className = "",
}) {
    if (!children) {
        return null;
    }

    return (
        <footer
            className={mergeClasses(
                "border-t border-border-subtle px-5 py-3.5",
                className
            )}
        >
            {children}
        </footer>
    );
}

function ChartCard({
    title,
    description,
    eyebrow,
    icon,
    actions,
    value,
    meta,
    legend,
    state = "ready",
    stateTitle,
    stateDescription,
    onRetry,
    height = 280,
    children,
    footer,
    className = "",
    bodyClassName = "",
}) {
    return (
        <Card className={mergeClasses("min-w-0", className)}>
            <ChartHeader
                title={title}
                description={description}
                eyebrow={eyebrow}
                icon={icon}
                actions={actions}
                value={value}
                meta={meta}
            />

            {legend?.length ? (
                <div className="border-b border-border-subtle px-5 py-3">
                    <ChartLegend items={legend} />
                </div>
            ) : null}

            <ChartBody
                state={state}
                stateTitle={stateTitle}
                stateDescription={stateDescription}
                onRetry={onRetry}
                height={height}
                className={bodyClassName}
            >
                {children}
            </ChartBody>

            <ChartFooter>{footer}</ChartFooter>
        </Card>
    );
}

export {
    ChartBody,
    ChartFooter,
    ChartHeader,
};

export default ChartCard;
