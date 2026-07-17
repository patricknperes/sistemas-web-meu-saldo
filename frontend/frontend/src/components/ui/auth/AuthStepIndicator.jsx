import {
    RiCheckLine,
} from "react-icons/ri";

function AuthStepIndicator({
    steps = [],
    currentStep = 0,
    className = "",
}) {
    return (
        <ol
            className={`grid min-w-0 gap-2 ${className}`}
            style={{
                gridTemplateColumns: `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))`,
            }}
            aria-label="Etapas do processo"
        >
            {steps.map((step, index) => {
                const completed = index < currentStep;
                const active = index === currentStep;

                return (
                    <li
                        key={step.id ?? step.label}
                        className="min-w-0"
                        aria-current={active ? "step" : undefined}
                    >
                        <div className="flex items-center">
                            <span
                                className={`
                                    flex size-7 shrink-0 items-center justify-center rounded-full border
                                    text-[0.6875rem] font-extrabold
                                    ${completed
                                        ? "border-success bg-success text-white"
                                        : active
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border-strong bg-surface text-muted-foreground"
                                    }
                                `}
                            >
                                {completed ? (
                                    <RiCheckLine size={15} aria-hidden="true" />
                                ) : (
                                    index + 1
                                )}
                            </span>

                            {index < steps.length - 1 ? (
                                <span
                                    aria-hidden="true"
                                    className={`h-px min-w-2 flex-1 ${completed ? "bg-success" : "bg-border"}`}
                                />
                            ) : null}
                        </div>

                        <span
                            className={`
                                mt-2 block truncate text-[0.6875rem] font-semibold
                                ${active || completed ? "text-foreground" : "text-muted-foreground"}
                            `}
                        >
                            {step.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default AuthStepIndicator;
