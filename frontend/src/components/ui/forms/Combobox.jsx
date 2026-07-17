import {
    forwardRef,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    RiArrowDownSLine,
    RiCheckLine,
    RiCloseLine,
    RiSearch2Line,
} from "react-icons/ri";

import {
    getInputClassName,
    mergeDescribedBy,
    normalizeClassName,
} from "./fieldStyles.js";

import {
    useFormFieldContext,
} from "./FormFieldContext.js";

import useControllableState from "./useControllableState.js";

function normalizeSearchValue(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");
}

function getEnabledIndex(options, startingIndex, direction) {
    if (!options.length) {
        return -1;
    }

    let index = startingIndex;

    for (let attempt = 0; attempt < options.length; attempt += 1) {
        index = (index + direction + options.length) % options.length;

        if (!options[index]?.disabled) {
            return index;
        }
    }

    return -1;
}

const Combobox = forwardRef(function Combobox({
    id,
    options = [],
    value,
    defaultValue = "",
    onValueChange,
    placeholder = "Selecione uma opção",
    searchPlaceholder = "Pesquisar...",
    emptyMessage = "Nenhuma opção encontrada.",
    clearable = true,
    clearLabel = "Limpar seleção",
    name,
    form,
    size = "md",
    status,
    leadingIcon,
    disabled = false,
    required,
    className = "",
    wrapperClassName = "",
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}, forwardedRef) {
    const field = useFormFieldContext();
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || field?.controlId || `combobox-${generatedId}`;
    const listboxId = `${resolvedId}-listbox`;

    const [selectedValue, setSelectedValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [position, setPosition] = useState(null);

    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const popupRef = useRef(null);
    const searchRef = useRef(null);

    const resolvedTriggerRef = (node) => {
        triggerRef.current = node;

        if (typeof forwardedRef === "function") {
            forwardedRef(node);
        } else if (forwardedRef) {
            forwardedRef.current = node;
        }
    };

    const invalid = ariaInvalid === true || field?.invalid;
    const resolvedStatus = status || field?.status || "default";
    const describedBy = mergeDescribedBy(
        ariaDescribedBy,
        field?.messageId
    );

    const selectedOption = options.find(
        (option) => String(option.value) === String(selectedValue)
    );

    const filteredOptions = useMemo(() => {
        const normalizedQuery = normalizeSearchValue(query);

        if (!normalizedQuery) {
            return options;
        }

        return options.filter((option) => {
            const searchableContent = [
                option.label,
                option.description,
                option.keywords,
            ]
                .filter(Boolean)
                .join(" ");

            return normalizeSearchValue(searchableContent)
                .includes(normalizedQuery);
        });
    }, [options, query]);

    function updatePosition() {
        const trigger = triggerRef.current;

        if (!trigger) {
            return;
        }

        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const horizontalMargin = 8;
        const verticalMargin = 8;
        const gap = 6;
        const desiredHeight = 330;
        const spaceBelow = viewportHeight - rect.bottom - verticalMargin;
        const spaceAbove = rect.top - verticalMargin;
        const openAbove = spaceBelow < 220 && spaceAbove > spaceBelow;
        const maxHeight = Math.max(
            180,
            Math.min(
                desiredHeight,
                openAbove ? spaceAbove - gap : spaceBelow - gap
            )
        );
        const width = Math.min(
            rect.width,
            viewportWidth - horizontalMargin * 2
        );
        const left = Math.min(
            Math.max(horizontalMargin, rect.left),
            viewportWidth - width - horizontalMargin
        );

        setPosition({
            left,
            width,
            maxHeight,
            top: openAbove
                ? rect.top - gap
                : rect.bottom + gap,
            transform: openAbove
                ? "translateY(-100%)"
                : "none",
        });
    }

    function closeCombobox({ restoreFocus = false } = {}) {
        setOpen(false);
        setQuery("");
        setActiveIndex(-1);

        if (restoreFocus) {
            requestAnimationFrame(() => triggerRef.current?.focus());
        }
    }

    function openCombobox() {
        if (disabled) {
            return;
        }

        setOpen(true);
    }

    function selectOption(option) {
        if (!option || option.disabled) {
            return;
        }

        setSelectedValue(option.value);
        closeCombobox({ restoreFocus: true });
    }

    function handleClear(event) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedValue("");
        closeCombobox();
        triggerRef.current?.focus();
    }

    function handleTriggerKeyDown(event) {
        if (disabled) {
            return;
        }

        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openCombobox();
        }

        if (event.key === "Escape" && open) {
            event.preventDefault();
            closeCombobox();
        }
    }

    function handleListKeyDown(event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => getEnabledIndex(
                filteredOptions,
                current,
                1
            ));
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => getEnabledIndex(
                filteredOptions,
                current < 0 ? 0 : current,
                -1
            ));
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(getEnabledIndex(filteredOptions, -1, 1));
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            setActiveIndex(getEnabledIndex(filteredOptions, 0, -1));
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            selectOption(filteredOptions[activeIndex]);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeCombobox({ restoreFocus: true });
        }
    }

    useLayoutEffect(() => {
        if (!open) {
            return undefined;
        }

        updatePosition();

        function handleViewportChange() {
            updatePosition();
        }

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, true);

        return () => {
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange, true);
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        requestAnimationFrame(() => searchRef.current?.focus());

        function handlePointerDown(event) {
            const target = event.target;

            if (
                wrapperRef.current?.contains(target) ||
                popupRef.current?.contains(target)
            ) {
                return;
            }

            closeCombobox();
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const selectedIndex = filteredOptions.findIndex(
            (option) => String(option.value) === String(selectedValue)
        );
        const firstEnabledIndex = getEnabledIndex(filteredOptions, -1, 1);

        setActiveIndex(
            !query &&
            selectedIndex >= 0 &&
            !filteredOptions[selectedIndex]?.disabled
                ? selectedIndex
                : firstEnabledIndex
        );
    }, [filteredOptions, open, query, selectedValue]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const optionElement = popupRef.current?.querySelector(
            `[data-option-index="${activeIndex}"]`
        );

        optionElement?.scrollIntoView({
            block: "nearest",
        });
    }, [activeIndex, open]);

    const popup = open && position && typeof document !== "undefined"
        ? createPortal(
            <div
                ref={popupRef}
                id={listboxId}
                role="listbox"
                aria-label={props["aria-label"] || placeholder}
                aria-activedescendant={
                    activeIndex >= 0
                        ? `${resolvedId}-option-${activeIndex}`
                        : undefined
                }
                onKeyDown={handleListKeyDown}
                className="fixed z-[100] overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-dropdown"
                style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    maxHeight: position.maxHeight,
                    transform: position.transform,
                }}
            >
                <div className="border-b border-border p-2">
                    <div className="relative">
                        <RiSearch2Line
                            aria-hidden="true"
                            size={17}
                            className="pointer-events-none absolute inset-y-0 left-3 my-auto text-muted-foreground"
                        />

                        <input
                            ref={searchRef}
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            aria-controls={listboxId}
                            aria-activedescendant={
                                activeIndex >= 0
                                    ? `${resolvedId}-option-${activeIndex}`
                                    : undefined
                            }
                            placeholder={searchPlaceholder}
                            className="h-9 w-full rounded-lg border border-border bg-surface-subtle pl-9 pr-3 text-body-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                        />
                    </div>
                </div>

                <div
                    className="overflow-y-auto p-1.5"
                    style={{
                        maxHeight: Math.max(120, position.maxHeight - 58),
                    }}
                >
                    {filteredOptions.length ? (
                        filteredOptions.map((option, index) => {
                            const selected = String(option.value) === String(selectedValue);
                            const active = index === activeIndex;
                            const Icon = option.icon;

                            return (
                                <button
                                    key={option.value}
                                    id={`${resolvedId}-option-${index}`}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    disabled={option.disabled}
                                    data-option-index={index}
                                    onMouseEnter={() => {
                                        if (!option.disabled) {
                                            setActiveIndex(index);
                                        }
                                    }}
                                    onClick={() => selectOption(option)}
                                    className={normalizeClassName(`
                                        flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors
                                        ${active ? "bg-primary-muted" : "hover:bg-surface-hover"}
                                        ${option.disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}
                                    `)}
                                >
                                    {Icon ? (
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                                            <Icon size={17} aria-hidden="true" />
                                        </span>
                                    ) : null}

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-body-sm font-semibold text-foreground">
                                            {option.label}
                                        </span>

                                        {option.description ? (
                                            <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                                                {option.description}
                                            </span>
                                        ) : null}
                                    </span>

                                    {selected ? (
                                        <RiCheckLine
                                            size={18}
                                            aria-hidden="true"
                                            className="shrink-0 text-primary"
                                        />
                                    ) : null}
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-3 py-8 text-center text-body-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    )}
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <div
            ref={wrapperRef}
            className={normalizeClassName(`
                relative min-w-0
                ${wrapperClassName}
            `)}
        >
            {leadingIcon ? (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-center text-muted-foreground"
                >
                    {leadingIcon}
                </span>
            ) : null}

            <button
                ref={resolvedTriggerRef}
                id={resolvedId}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-haspopup="listbox"
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                aria-required={required ?? field?.required}
                disabled={disabled}
                {...props}
                onClick={() => open ? closeCombobox() : openCombobox()}
                onKeyDown={handleTriggerKeyDown}
                className={getInputClassName({
                    size,
                    status: resolvedStatus,
                    invalid,
                    hasLeading: Boolean(leadingIcon),
                    hasTrailing: true,
                    className: normalizeClassName(`
                        flex items-center text-left
                        ${clearable && selectedOption ? "pr-16" : ""}
                        ${className}
                    `),
                })}
            >
                <span
                    className={normalizeClassName(`
                        min-w-0 flex-1 truncate
                        ${selectedOption ? "text-foreground" : "text-subtle-foreground"}
                    `)}
                >
                    {selectedOption?.label || placeholder}
                </span>
            </button>

            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                {clearable && selectedOption && !disabled ? (
                    <button
                        type="button"
                        aria-label={clearLabel}
                        onClick={handleClear}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                    >
                        <RiCloseLine size={16} aria-hidden="true" />
                    </button>
                ) : null}

                <span
                    aria-hidden="true"
                    className={normalizeClassName(`
                        flex size-7 items-center justify-center text-muted-foreground transition-transform
                        ${open ? "rotate-180" : ""}
                    `)}
                >
                    <RiArrowDownSLine size={19} />
                </span>
            </span>

            {name ? (
                <input
                    type="hidden"
                    name={name}
                    form={form}
                    value={selectedValue ?? ""}
                    disabled={disabled}
                />
            ) : null}

            {popup}
        </div>
    );
});

export default Combobox;
