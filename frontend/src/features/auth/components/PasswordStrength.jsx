import { Check, Circle } from "lucide-react";
import { passwordRules } from "../schemas/authSchemas.js";

function PasswordStrength({ value = "" }) {
    const validCount = passwordRules.filter((rule) => rule.test(value)).length;

    return (
        <div className="rounded-2xl border border-border bg-surface-muted/55 p-3.5" aria-live="polite">
            <div className="mb-3 flex gap-1.5" aria-hidden="true">
                {passwordRules.map((rule, index) => (
                    <span key={rule.label} className={`h-1.5 flex-1 rounded-full transition-colors ${index < validCount ? "bg-primary" : "bg-border"}`} />
                ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                    const valid = rule.test(value);
                    const Icon = valid ? Check : Circle;
                    return (
                        <span key={rule.label} className={`flex min-w-0 items-center gap-2 text-xs ${valid ? "text-success" : "text-subtle-foreground"}`}>
                            <Icon size={13} strokeWidth={2} aria-hidden="true" className="shrink-0" />
                            <span className="truncate">{rule.label}</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default PasswordStrength;
