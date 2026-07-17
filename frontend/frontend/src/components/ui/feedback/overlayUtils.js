import {
    useEffect,
    useLayoutEffect,
} from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
].join(",");

let bodyLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

export function mergeClassNames(...values) {
    return values.filter(Boolean).join(" ");
}

export function useBodyScrollLock(enabled) {
    useLayoutEffect(() => {
        if (!enabled || typeof document === "undefined") {
            return undefined;
        }

        const { body, documentElement } = document;
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

        if (bodyLockCount === 0) {
            previousBodyOverflow = body.style.overflow;
            previousBodyPaddingRight = body.style.paddingRight;

            body.style.overflow = "hidden";

            if (scrollbarWidth > 0) {
                const currentPadding = Number.parseFloat(
                    window.getComputedStyle(body).paddingRight
                ) || 0;

                body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
            }
        }

        bodyLockCount += 1;

        return () => {
            bodyLockCount = Math.max(0, bodyLockCount - 1);

            if (bodyLockCount === 0) {
                body.style.overflow = previousBodyOverflow;
                body.style.paddingRight = previousBodyPaddingRight;
            }
        };
    }, [enabled]);
}

export function useEscapeKey(enabled, onEscape) {
    useEffect(() => {
        if (!enabled || typeof document === "undefined") {
            return undefined;
        }

        function handleKeyDown(event) {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            onEscape?.(event);
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled, onEscape]);
}

export function useOutsidePress({
    enabled,
    refs,
    onOutsidePress,
}) {
    useEffect(() => {
        if (!enabled || typeof document === "undefined") {
            return undefined;
        }

        function handlePointerDown(event) {
            const target = event.target;
            const pressedInside = refs.some((ref) => ref.current?.contains(target));

            if (!pressedInside) {
                onOutsidePress?.(event);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [enabled, onOutsidePress, refs]);
}

export function useFocusTrap({
    enabled,
    containerRef,
    initialFocusRef,
    returnFocusRef,
}) {
    useLayoutEffect(() => {
        if (!enabled || typeof document === "undefined") {
            return undefined;
        }

        const previouslyFocused = document.activeElement;
        const returnFocusTarget = returnFocusRef?.current || previouslyFocused;
        const container = containerRef.current;

        if (!container) {
            return undefined;
        }

        function getFocusableElements() {
            return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
                .filter((element) => (
                    !element.hasAttribute("disabled") &&
                    element.getAttribute("aria-hidden") !== "true" &&
                    element.getClientRects().length > 0
                ));
        }

        const focusTarget = initialFocusRef?.current
            || getFocusableElements()[0]
            || container;

        requestAnimationFrame(() => focusTarget?.focus());

        function handleKeyDown(event) {
            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = getFocusableElements();

            if (!focusableElements.length) {
                event.preventDefault();
                container.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        container.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("keydown", handleKeyDown);

            if (returnFocusTarget instanceof HTMLElement) {
                requestAnimationFrame(() => returnFocusTarget.focus());
            }
        };
    }, [containerRef, enabled, initialFocusRef, returnFocusRef]);
}

export function getFloatingPosition({
    anchorRect,
    floatingRect,
    placement = "bottom-start",
    offset = 8,
    viewportPadding = 8,
}) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const [side, alignment = "center"] = placement.split("-");

    let top = anchorRect.bottom + offset;
    let left = anchorRect.left;

    if (side === "top") {
        top = anchorRect.top - floatingRect.height - offset;
    }

    if (side === "left") {
        left = anchorRect.left - floatingRect.width - offset;
        top = anchorRect.top + (anchorRect.height - floatingRect.height) / 2;
    }

    if (side === "right") {
        left = anchorRect.right + offset;
        top = anchorRect.top + (anchorRect.height - floatingRect.height) / 2;
    }

    if (["top", "bottom"].includes(side)) {
        if (alignment === "end") {
            left = anchorRect.right - floatingRect.width;
        } else if (alignment === "center") {
            left = anchorRect.left + (anchorRect.width - floatingRect.width) / 2;
        }
    }

    const maxLeft = viewportWidth - floatingRect.width - viewportPadding;
    const maxTop = viewportHeight - floatingRect.height - viewportPadding;

    left = Math.min(Math.max(viewportPadding, left), Math.max(viewportPadding, maxLeft));
    top = Math.min(Math.max(viewportPadding, top), Math.max(viewportPadding, maxTop));

    return {
        top,
        left,
    };
}
