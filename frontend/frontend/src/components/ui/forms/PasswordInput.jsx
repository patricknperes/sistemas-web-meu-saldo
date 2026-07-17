import {
    forwardRef,
    useState,
} from "react";

import {
    RiEyeLine,
    RiEyeOffLine,
    RiLockPasswordLine,
} from "react-icons/ri";

import Input from "./Input.jsx";

const PasswordInput = forwardRef(function PasswordInput({
    showToggle = true,
    showPasswordLabel = "Mostrar senha",
    hidePasswordLabel = "Ocultar senha",
    leadingIcon,
    ...props
}, ref) {
    const [visible, setVisible] = useState(false);

    return (
        <Input
            {...props}
            ref={ref}
            type={visible ? "text" : "password"}
            leadingIcon={
                leadingIcon ?? (
                    <RiLockPasswordLine
                        size={18}
                        aria-hidden="true"
                    />
                )
            }
            trailingElement={
                showToggle ? (
                    <button
                        type="button"
                        onClick={() => setVisible((current) => !current)}
                        aria-label={
                            visible
                                ? hidePasswordLabel
                                : showPasswordLabel
                        }
                        aria-pressed={visible}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                    >
                        {visible ? (
                            <RiEyeOffLine
                                size={17}
                                aria-hidden="true"
                            />
                        ) : (
                            <RiEyeLine
                                size={17}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                ) : null
            }
        />
    );
});

export default PasswordInput;
