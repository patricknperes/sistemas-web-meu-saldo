import { forwardRef } from "react";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "../../lib/cn.js";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef(function DialogOverlay({ className, ...props }, ref) {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn("fixed inset-0 z-50 bg-overlay backdrop-blur-sm", className)}
            {...props}
        />
    );
});

const DialogContent = forwardRef(function DialogContent({ className, children, showClose = true, ...props }, ref) {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-dialog border border-border bg-surface p-5 text-foreground shadow-dialog outline-none sm:p-6",
                    className,
                )}
                {...props}
            >
                {children}
                {showClose && (
                    <DialogPrimitive.Close
                        className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-control text-subtle-foreground transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                        aria-label="Fechar"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

function DialogHeader({ className, ...props }) {
    return <div className={cn("space-y-1.5 pr-10", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
    return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

const DialogTitle = forwardRef(function DialogTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn("text-lg font-bold tracking-[-0.02em]", className)} {...props} />;
});

const DialogDescription = forwardRef(function DialogDescription({ className, ...props }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
});

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
};
