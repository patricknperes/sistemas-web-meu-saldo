import {
    evaluatePassword,
} from "./passwordUtils.js";

const levelConfiguration = {
    empty: {
        text: "text-muted-foreground",
        bar: "bg-border",
    },
    weak: {
        text: "text-danger",
        bar: "bg-danger",
    },
    fair: {
        text: "text-warning",
        bar: "bg-warning",
    },
    good: {
        text: "text-info",
        bar: "bg-info",
    },
    strong: {
        text: "text-success",
        bar: "bg-success",
    },
};

function PasswordStrength({
    password = "",
    requirements,
    showLabel = true,
    className = "",
}) {
    const result = evaluatePassword(password, requirements);
    const configuration = levelConfiguration[result.level] ?? levelConfiguration.empty;

    return (
        <div className={`min-w-0 ${className}`}>
            <div
                className="grid grid-cols-4 gap-1.5"
                role="progressbar"
                aria-label="Força da senha"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={result.score}
                aria-valuetext={result.label}
            >
                {[1, 2, 3, 4].map((segment) => (
                    <span
                        key={segment}
                        className={`h-1.5 rounded-pill transition-colors duration-200 ${
                            segment <= result.score ? configuration.bar : "bg-border"
                        }`}
                    />
                ))}
            </div>

            {showLabel ? (
                <div className="mt-2 flex items-center justify-between gap-3 text-caption">
                    <span className={`font-label ${configuration.text}`}>
                        {result.label}
                    </span>
                    <span className="numeric-value text-muted-foreground">
                        {result.completed}/{result.total} requisitos
                    </span>
                </div>
            ) : null}
        </div>
    );
}

export default PasswordStrength;
