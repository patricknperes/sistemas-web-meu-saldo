import {
    cloneElement,
    useCallback,
    useState,
} from "react";

import {
    RiCalendarLine,
} from "react-icons/ri";

import Drawer from "../feedback/Drawer.jsx";
import Popover from "../feedback/Popover.jsx";

import useMediaQuery from "./useMediaQuery.js";

function CalendarPopover({
    trigger,
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    title = "Selecionar data",
    description,
    placement = "bottom-start",
    popoverClassName = "w-[min(21rem,calc(100vw-1rem))] p-4",
}) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;
    const mobile = useMediaQuery("(max-width: 639px)");

    const setOpen = useCallback((nextOpen) => {
        if (controlledOpen === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    }, [controlledOpen, onOpenChange]);

    if (mobile) {
        const enhancedTrigger = cloneElement(trigger, {
            "aria-haspopup": "dialog",
            "aria-expanded": open,
            onClick: (event) => {
                trigger.props.onClick?.(event);

                if (!event.defaultPrevented) {
                    setOpen(true);
                }
            },
        });

        return (
            <>
                {enhancedTrigger}

                <Drawer
                    open={open}
                    onOpenChange={setOpen}
                    title={title}
                    description={description}
                    icon={RiCalendarLine}
                    position="bottom"
                >
                    <div className="mx-auto w-full max-w-sm">
                        {typeof children === "function"
                            ? children({ close: () => setOpen(false) })
                            : children}
                    </div>
                </Drawer>
            </>
        );
    }

    return (
        <Popover
            trigger={trigger}
            open={open}
            onOpenChange={setOpen}
            placement={placement}
            className={popoverClassName}
        >
            {children}
        </Popover>
    );
}

export default CalendarPopover;
