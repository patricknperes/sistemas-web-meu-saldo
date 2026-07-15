import {
    AnimatePresence,
    motion,
} from "motion/react";

const transitionVariants = {
    initial: (direction) => ({
        opacity: 0,
        x:
            direction > 0
                ? 18
                : -18,

        filter: "blur(2px)",
    }),

    animate: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
    },

    exit: (direction) => ({
        opacity: 0,
        x:
            direction > 0
                ? -18
                : 18,

        filter: "blur(2px)",
    }),
};

function AuthTransition({
    children,
    direction,
    transitionKey,
}) {
    return (
        <AnimatePresence
            mode="wait"
            initial={false}
            custom={direction}
        >
            <motion.div
                key={transitionKey}
                custom={direction}
                variants={
                    transitionVariants
                }
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                    duration: 0.25,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                    ],
                }}
                className="min-w-0"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default AuthTransition;