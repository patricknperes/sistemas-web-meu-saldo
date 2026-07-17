export const defaultPasswordRequirements = [
    {
        id: "length",
        label: "Pelo menos 8 caracteres",
        test: (password) => password.length >= 8,
    },
    {
        id: "lowercase",
        label: "Uma letra minúscula",
        test: (password) => /[a-z]/.test(password),
    },
    {
        id: "uppercase",
        label: "Uma letra maiúscula",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        id: "number",
        label: "Pelo menos um número",
        test: (password) => /\d/.test(password),
    },
    {
        id: "special",
        label: "Um caractere especial",
        test: (password) => /[^A-Za-z0-9\s]/.test(password),
    },
];

export function evaluatePassword(password = "", requirements = defaultPasswordRequirements) {
    const normalizedPassword = String(password ?? "");
    const items = requirements.map((requirement) => ({
        ...requirement,
        valid: Boolean(requirement.test?.(normalizedPassword)),
    }));
    const completed = items.filter((item) => item.valid).length;
    const total = Math.max(items.length, 1);
    const ratio = completed / total;

    let level = "empty";
    let label = "Digite uma senha";

    if (normalizedPassword.length > 0) {
        if (ratio <= 0.4) {
            level = "weak";
            label = "Senha fraca";
        } else if (ratio <= 0.7) {
            level = "fair";
            label = "Senha razoável";
        } else if (ratio < 1) {
            level = "good";
            label = "Senha boa";
        } else {
            level = "strong";
            label = "Senha forte";
        }
    }

    return {
        items,
        completed,
        total,
        ratio,
        score: Math.round(ratio * 4),
        level,
        label,
        valid: completed === items.length && normalizedPassword.length > 0,
    };
}
