import {
    createContext,
    useContext,
    useEffect,
    useRef,
} from "react";

import {
    RiArrowRightSLine,
    RiCheckLine,
} from "react-icons/ri";

import Popover from "./Popover.jsx";
import {
    mergeClassNames,
} from "./overlayUtils.js";

const DropdownMenuContext = createContext(null);

function MenuContent({ children, close }) {
    const contentRef = useRef(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            contentRef.current
                ?.querySelector('[role="menuitem"]:not([disabled])')
                ?.focus();
        });
    }, []);

    function handleKeyDown(event) {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            return;
        }

        const items = Array.from(
            contentRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || []
        );

        if (!items.length) {
            return;
        }

        event.preventDefault();

        const currentIndex = items.indexOf(document.activeElement);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown") {
            nextIndex = (currentIndex + 1 + items.length) % items.length;
        }

        if (event.key === "ArrowUp") {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        }

        if (event.key === "Home") {
            nextIndex = 0;
        }

        if (event.key === "End") {
            nextIndex = items.length - 1;
        }

        items[nextIndex]?.focus();
    }

    return (
        <DropdownMenuContext.Provider value={{ close }}>
            <div
                ref={contentRef}
                role="menu"
                className="min-w-52"
                onKeyDown={handleKeyDown}
            >
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
}

function DropdownMenu({
    trigger,
    children,
    placement = "bottom-end",
    open,
    defaultOpen,
    onOpenChange,
    className = "",
}) {
    return (
        <Popover
            trigger={trigger}
            placement={placement}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            className={mergeClassNames("p-1.5", className)}
        >
            {({ close }) => (
                <MenuContent close={close}>
                    {children}
                </MenuContent>
            )}
        </Popover>
    );
}

function DropdownMenuItem({
    children,
    icon: Icon,
    trailing,
    selected = false,
    danger = false,
    disabled = false,
    onSelect,
    className = "",
}) {
    const context = useContext(DropdownMenuContext);

    function handleClick(event) {
        if (disabled) {
            return;
        }

        onSelect?.(event);

        if (!event.defaultPrevented) {
            context?.close();
        }
    }

    return (
        <button
            type="button"
            role="menuitem"
            disabled={disabled}
            className={mergeClassNames(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-body-sm font-medium transition-colors focus:outline-none focus-visible:bg-surface-hover",
                danger
                    ? "text-danger hover:bg-danger-muted"
                    : "text-foreground-soft hover:bg-surface-hover hover:text-foreground",
                className
            )}
            onClick={handleClick}
        >
            {Icon ? (
                <Icon size={17} aria-hidden="true" className="shrink-0" />
            ) : null}

            <span className="min-w-0 flex-1 truncate">{children}</span>

            {selected ? (
                <RiCheckLine size={17} aria-hidden="true" className="shrink-0 text-primary" />
            ) : trailing ? (
                trailing
            ) : null}
        </button>
    );
}

function DropdownMenuLabel({ children }) {
    return (
        <p className="px-3 pb-1.5 pt-2 text-overline font-bold uppercase tracking-overline text-muted-foreground">
            {children}
        </p>
    );
}

function DropdownMenuSeparator() {
    return <div role="separator" className="my-1.5 h-px bg-border" />;
}

function DropdownMenuSubmenuIndicator() {
    return <RiArrowRightSLine size={17} aria-hidden="true" />;
}

export {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubmenuIndicator,
};
