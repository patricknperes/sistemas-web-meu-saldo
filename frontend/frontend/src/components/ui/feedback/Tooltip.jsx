import {
    cloneElement,
    useCallback,
    useId,
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
} from "./overlayUtils.js";

function Tooltip({
    children,
    content,
    placement = "top",
    delay = 350,
    className = "",
}) {
    const tooltipId = useId().replace(/:/g, "");
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);
    const timerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const updatePosition = useCallback(() => {
        if (!wrapperRef.current || !tooltipRef.current) {
            return;
        }

        setPosition(getFloatingPosition({
            anchorRect: wrapperRef.current.getBoundingClientRect(),
            floatingRect: tooltipRef.current.getBoundingClientRect(),
            placement,
            offset: 7,
            viewportPadding: 6,
        }));
    }, [placement]);

    function scheduleOpen() {
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setOpen(true), delay);
    }

    function close() {
        window.clearTimeout(timerRef.current);
        setOpen(false);
    }

    useLayoutEffect(() => {
        if (!open) {
            return undefined;
        }

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    const enhancedChild = cloneElement(children, {
        "aria-describedby": open ? tooltipId : undefined,
        onMouseEnter: (event) => {
            children.props.onMouseEnter?.(event);
            scheduleOpen();
        },
        onMouseLeave: (event) => {
            children.props.onMouseLeave?.(event);
            close();
        },
        onFocus: (event) => {
            children.props.onFocus?.(event);
            scheduleOpen();
        },
        onBlur: (event) => {
            children.props.onBlur?.(event);
            close();
        },
    });

    return (
        <>
            <span ref={wrapperRef} className="inline-flex">
                {enhancedChild}
            </span>

            <AnimatePresence>
                {open ? (
                    <Portal>
                        <motion.div
                            ref={tooltipRef}
                            id={tooltipId}
                            role="tooltip"
                            className={mergeClassNames(
                                "pointer-events-none fixed z-[140] max-w-64 rounded-lg bg-foreground px-2.5 py-1.5 text-caption font-medium text-background shadow-raised",
                                !position && "invisible",
                                className
                            )}
                            style={{
                                top: position?.top,
                                left: position?.left,
                            }}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.12 }}
                        >
                            {content}
                        </motion.div>
                    </Portal>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default Tooltip;
