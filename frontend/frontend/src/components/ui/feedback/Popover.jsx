import {
    cloneElement,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import Portal from "./Portal.jsx";
import {
    getFloatingPosition,
    mergeClassNames,
    useEscapeKey,
    useOutsidePress,
} from "./overlayUtils.js";

function Popover({
    trigger,
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    placement = "bottom-start",
    offset = 8,
    matchTriggerWidth = false,
    closeOnEscape = true,
    className = "",
}) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;
    const triggerWrapperRef = useRef(null);
    const contentRef = useRef(null);
    const [position, setPosition] = useState(null);

    const setOpen = useCallback((nextOpen) => {
        if (controlledOpen === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    }, [controlledOpen, onOpenChange]);

    const updatePosition = useCallback(() => {
        const anchor = triggerWrapperRef.current;
        const floating = contentRef.current;

        if (!anchor || !floating) {
            return;
        }

        const anchorRect = anchor.getBoundingClientRect();
        const floatingRect = floating.getBoundingClientRect();
        const nextPosition = getFloatingPosition({
            anchorRect,
            floatingRect,
            placement,
            offset,
        });

        setPosition({
            ...nextPosition,
            width: matchTriggerWidth ? anchorRect.width : undefined,
        });
    }, [matchTriggerWidth, offset, placement]);

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
    }, [open, updatePosition]);

    useOutsidePress({
        enabled: open,
        refs: [triggerWrapperRef, contentRef],
        onOutsidePress: () => setOpen(false),
    });

    useEscapeKey(open && closeOnEscape, () => {
        setOpen(false);
        triggerWrapperRef.current?.querySelector("button, [href], [tabindex]")?.focus();
    });

    const enhancedTrigger = cloneElement(trigger, {
        "aria-haspopup": trigger.props["aria-haspopup"] || "dialog",
        "aria-expanded": open,
        onClick: (event) => {
            trigger.props.onClick?.(event);

            if (!event.defaultPrevented) {
                setOpen(!open);
            }
        },
    });

    return (
        <>
            <span ref={triggerWrapperRef} className="inline-flex min-w-0">
                {enhancedTrigger}
            </span>

            <AnimatePresence>
                {open ? (
                    <Portal>
                        <motion.div
                            ref={contentRef}
                            role="dialog"
                            className={mergeClassNames(
                                "fixed z-[120] min-w-48 max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-surface-elevated p-3 shadow-dropdown",
                                !position && "invisible",
                                className
                            )}
                            style={{
                                top: position?.top,
                                left: position?.left,
                                width: position?.width,
                            }}
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {typeof children === "function"
                                ? children({ close: () => setOpen(false) })
                                : children}
                        </motion.div>
                    </Portal>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default Popover;
