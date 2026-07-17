import {
    RiCheckboxCircleFill,
    RiCheckboxBlankCircleLine,
} from "react-icons/ri";

import {
    evaluatePassword,
} from "./passwordUtils.js";

function PasswordRequirements({
    password = "",
    requirements,
    columns = 2,
    className = "",
}) {
    const result = evaluatePassword(password, requirements);

    return (
        <ul
            className={`grid gap-2 ${columns === 1 ? "grid-cols-1" : "sm:grid-cols-2"} ${className}`}
            aria-label="Requisitos da senha"
        >
            {result.items.map((item) => (
                <li
                    key={item.id}
                    className={`
                        flex min-w-0 items-start gap-2 text-caption
                        ${item.valid ? "text-success" : "text-muted-foreground"}
                    `}
                >
                    {item.valid ? (
                        <RiCheckboxCircleFill
                            size={15}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0"
                        />
                    ) : (
                        <RiCheckboxBlankCircleLine
                            size={15}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-subtle-foreground"
                        />
                    )}

                    <span>{item.label}</span>
                </li>
            ))}
        </ul>
    );
}

export default PasswordRequirements;
