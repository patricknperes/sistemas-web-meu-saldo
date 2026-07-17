import {
    RiShieldCheckLine,
    RiUserLine,
} from "react-icons/ri";

import {
    getUserRoleMeta,
    normalizeUserRole,
} from "./accountUtils.js";

const roleItems = [
    {
        value: "USER",
        icon: RiUserLine,
    },
    {
        value: "ADMIN",
        icon: RiShieldCheckLine,
    },
];

function UserRoleSelect({
    value = "USER",
    onChange,
    disabled = false,
    allowAdmin = true,
    name = "role",
    className = "",
}) {
    const selectedValue = normalizeUserRole(value);
    const items = allowAdmin
        ? roleItems
        : roleItems.filter((item) => item.value !== "ADMIN");

    return (
        <div
            role="radiogroup"
            aria-label="Tipo de conta"
            className={`grid gap-3 sm:grid-cols-2 ${className}`}
        >
            {items.map((item) => {
                const meta = getUserRoleMeta(item.value);
                const Icon = item.icon;
                const selected = selectedValue === item.value;

                return (
                    <label
                        key={item.value}
                        className={`
                            relative flex min-w-0 gap-3 rounded-xl border p-4
                            transition-colors
                            ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
                            ${selected
                                ? "border-primary/30 bg-primary-muted"
                                : "border-border bg-surface hover:border-primary/20 hover:bg-surface-hover"
                            }
                        `}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={item.value}
                            checked={selected}
                            disabled={disabled}
                            onChange={() => onChange?.(item.value)}
                            className="sr-only"
                        />

                        <span
                            className={`
                                flex size-10 shrink-0 items-center justify-center rounded-xl
                                ${selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-surface-muted text-muted-foreground"
                                }
                            `}
                        >
                            <Icon size={19} aria-hidden="true" />
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block text-body-sm font-bold text-foreground">
                                {meta.label}
                            </span>
                            <span className="mt-1 block text-caption text-muted-foreground">
                                {meta.description}
                            </span>
                        </span>

                        <span
                            aria-hidden="true"
                            className={`
                                mt-1 size-4 shrink-0 rounded-full border-2
                                ${selected
                                    ? "border-primary bg-primary shadow-[inset_0_0_0_3px_var(--color-surface)]"
                                    : "border-border-strong bg-surface"
                                }
                            `}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default UserRoleSelect;
