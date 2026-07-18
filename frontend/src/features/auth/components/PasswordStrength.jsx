import { Check, Circle } from "lucide-react";

import { cn } from "../../../lib/cn.js";
import { passwordRules } from "../schemas/authSchemas.js";

function getStrengthStatus(validCount, totalRules, hasValue) {
    if (!hasValue) {
        return {
            label: "Digite uma senha",
            textClassName: "text-subtle-foreground",
            barClassName: "bg-border",
        };
    }

    if (validCount === totalRules) {
        return {
            label: "Senha forte",
            textClassName: "text-success",
            barClassName: "bg-success",
        };
    }

    if (validCount >= Math.ceil(totalRules / 2)) {
        return {
            label: "Senha média",
            textClassName: "text-warning",
            barClassName: "bg-warning",
        };
    }

    return {
        label: "Senha fraca",
        textClassName: "text-danger",
        barClassName: "bg-danger",
    };
}

function PasswordStrength({
    value = "",
}) {
    const validCount = passwordRules.filter(
        (rule) => rule.test(value),
    ).length;

    const totalRules = passwordRules.length;
    const hasValue = value.length > 0;

    const status = getStrengthStatus(
        validCount,
        totalRules,
        hasValue,
    );

    return (
        <div
            aria-live="polite"
            className="
                min-w-0
                rounded-card-sm
                border border-border
                bg-surface-raised
                p-4
            "
        >
            <div className="flex min-w-0 items-center justify-between gap-3">
                <p className="text-xs font-semibold text-muted-foreground">
                    Segurança da senha
                </p>

                <span
                    className={cn(
                        "shrink-0 text-xs font-bold",
                        status.textClassName,
                    )}
                >
                    {status.label}
                </span>
            </div>

            <div
                aria-hidden="true"
                className="mt-3 flex gap-1.5"
            >
                {passwordRules.map((rule, index) => {
                    const active = index < validCount;

                    return (
                        <span
                            key={rule.label}
                            className={cn(
                                `
                                    h-1.5 flex-1
                                    rounded-full
                                    bg-border
                                    transition-colors
                                    duration-200
                                `,
                                active && status.barClassName,
                            )}
                        />
                    );
                })}
            </div>

            <div className="mt-4 grid min-w-0 gap-2.5 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                    const valid = rule.test(value);
                    const Icon = valid ? Check : Circle;

                    return (
                        <div
                            key={rule.label}
                            className="
                                flex min-w-0
                                items-start gap-2
                            "
                        >
                            <span
                                className={cn(
                                    `
                                        mt-0.5
                                        inline-flex size-5
                                        shrink-0
                                        items-center justify-center
                                        rounded-full
                                        bg-surface-muted
                                        text-subtle-foreground
                                        transition-colors
                                    `,
                                    valid
                                    && `
                                            bg-success-muted
                                            text-success
                                        `,
                                )}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className="size-3"
                                    strokeWidth={2.2}
                                />
                            </span>

                            <span
                                className={cn(
                                    `
                                        min-w-0
                                        break-words
                                        text-xs leading-5
                                        text-subtle-foreground
                                        transition-colors
                                    `,
                                    valid && "font-medium text-success",
                                )}
                            >
                                {rule.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 border-t border-border pt-3 text-xs text-subtle-foreground">
                {validCount} de {totalRules} requisitos atendidos
            </p>
        </div>
    );
}

export default PasswordStrength;