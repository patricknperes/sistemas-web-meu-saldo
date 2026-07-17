import {
    forwardRef,
    useState,
} from "react";

import {
    RiCalendarLine,
    RiCloseLine,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import {
    useFormFieldContext,
} from "../forms/FormFieldContext.js";
import {
    getInputClassName,
    mergeDescribedBy,
} from "../forms/fieldStyles.js";
import useControllableState from "../forms/useControllableState.js";

import Calendar from "./Calendar.jsx";
import CalendarPopover from "./CalendarPopover.jsx";
import {
    formatDateLabel,
} from "./dateUtils.js";

const DateField = forwardRef(function DateField({
    id,
    name,
    value,
    defaultValue = "",
    onChange,
    onBlur,
    placeholder = "Selecione uma data",
    size = "md",
    status,
    min,
    max,
    isDateDisabled,
    disabled = false,
    readOnly = false,
    required,
    clearable = true,
    className = "",
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
}, ref) {
    const field = useFormFieldContext();
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange,
    });
    const [open, setOpen] = useState(false);

    const resolvedId = id || field?.controlId;
    const invalid = ariaInvalid === true || field?.invalid;
    const resolvedStatus = status || field?.status || "default";
    const describedBy = mergeDescribedBy(
        ariaDescribedBy,
        field?.messageId
    );
    const resolvedRequired = required ?? field?.required;
    const label = formatDateLabel(currentValue);

    function updateValue(nextValue) {
        setCurrentValue(nextValue);
        onBlur?.({ target: { name, value: nextValue } });
    }

    const trigger = (
        <button
            ref={ref}
            id={resolvedId}
            type="button"
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            aria-required={resolvedRequired || undefined}
            className={getInputClassName({
                size,
                status: resolvedStatus,
                invalid,
                hasLeading: true,
                hasTrailing: clearable && Boolean(currentValue),
                className: `relative flex items-center text-left ${readOnly ? "cursor-default" : "cursor-pointer"} ${className}`,
            })}
            onClick={(event) => {
                if (readOnly) {
                    event.preventDefault();
                }
            }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground"
            >
                <RiCalendarLine size={18} />
            </span>

            <span className={label ? "text-foreground" : "text-subtle-foreground"}>
                {label || placeholder}
            </span>
        </button>
    );

    return (
        <div className="relative min-w-0">
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    value={currentValue || ""}
                    required={resolvedRequired}
                />
            ) : null}

            {readOnly ? trigger : (
                <CalendarPopover
                    trigger={trigger}
                    open={open}
                    onOpenChange={setOpen}
                    title="Selecionar data"
                    description="Escolha o dia no calendário."
                >
                    {({ close }) => (
                        <Calendar
                            value={currentValue}
                            onChange={(nextValue) => {
                                updateValue(nextValue);
                                close();
                            }}
                            min={min}
                            max={max}
                            isDateDisabled={isDateDisabled}
                        />
                    )}
                </CalendarPopover>
            )}

            {clearable && currentValue && !disabled && !readOnly ? (
                <span className="absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-center">
                    <IconButton
                        icon={<RiCloseLine size={17} aria-hidden="true" />}
                        label="Limpar data"
                        variant="ghost"
                        size="sm"
                        className="size-7"
                        onClick={(event) => {
                            event.stopPropagation();
                            updateValue("");
                            setOpen(false);
                        }}
                    />
                </span>
            ) : null}
        </div>
    );
});

export default DateField;
