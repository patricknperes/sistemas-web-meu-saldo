import {
    forwardRef,
    useEffect,
    useState,
} from "react";

import {
    Eye,
    EyeOff,
    LockKeyhole,
} from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import Input from "../../../components/ui/Input.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";
import PasswordStrength from "./PasswordStrength.jsx";

const PasswordInput = forwardRef(function PasswordInput({
    label,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    showStrengthPopover = false,
    ...props
}, ref) {
    const [visible, setVisible] = useState(false);
    const [focusedWithin, setFocusedWithin] = useState(false);

    const [internalValue, setInternalValue] = useState(
        String(value ?? defaultValue ?? ""),
    );

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(String(value ?? ""));
        }
    }, [value]);

    const currentValue = value !== undefined
        ? String(value ?? "")
        : internalValue;

    const showStrength = showStrengthPopover
        && focusedWithin
        && currentValue.length > 0;

    const inputValueProps = value !== undefined
        ? { value }
        : defaultValue !== undefined
            ? { defaultValue }
            : {};

    function handleChange(event) {
        setInternalValue(event.target.value);
        onChange?.(event);
    }

    function handleWrapperBlur(event) {
        const nextElement = event.relatedTarget;

        if (
            !nextElement
            || !event.currentTarget.contains(nextElement)
        ) {
            setFocusedWithin(false);
        }
    }

    return (
        <PopoverPrimitive.Root
            open={showStrength}
            modal={false}
        >
            <PopoverPrimitive.Anchor asChild>
                <div
                    className="w-full min-w-0"
                    onFocusCapture={() => {
                        setFocusedWithin(true);
                    }}
                    onBlurCapture={handleWrapperBlur}
                >
                    <Input
                        {...props}
                        {...inputValueProps}
                        ref={ref}
                        label={label}
                        type={visible ? "text" : "password"}
                        leadingIcon={LockKeyhole}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        trailingElement={
                            <IconButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                aria-label={
                                    visible
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                title={
                                    visible
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                onClick={() => {
                                    setVisible((current) => !current);
                                }}
                                className="
                                    -mr-1
                                    text-subtle-foreground
                                    hover:bg-primary-soft
                                    hover:text-primary
                                "
                            >
                                {visible ? (
                                    <EyeOff
                                        aria-hidden="true"
                                        className="size-[17px]"
                                    />
                                ) : (
                                    <Eye
                                        aria-hidden="true"
                                        className="size-[17px]"
                                    />
                                )}
                            </IconButton>
                        }
                    />
                </div>
            </PopoverPrimitive.Anchor>

            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    side="bottom"
                    align="start"
                    sideOffset={7}
                    collisionPadding={12}
                    avoidCollisions
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                    }}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                    }}
                    className="
                        pointer-events-none
                        z-[120]
                        w-[var(--radix-popover-trigger-width)]
                        max-w-[calc(100vw-1rem)]
                        outline-none

                        data-[state=open]:animate-in
                        data-[state=open]:fade-in-0
                        data-[state=open]:zoom-in-95
                        data-[side=bottom]:slide-in-from-top-1
                        data-[side=top]:slide-in-from-bottom-1
                    "
                >
                    <div className="rounded-control shadow-popover">
                        <PasswordStrength value={currentValue} />
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
});

export default PasswordInput;