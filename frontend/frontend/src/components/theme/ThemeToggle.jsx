import {
    useEffect,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiMoonClearLine,
    RiSunLine,
} from "react-icons/ri";

function getInitialTheme() {
    if (
        typeof document ===
        "undefined"
    ) {
        return false;
    }

    try {
        const storedTheme =
            localStorage.getItem(
                "theme"
            );

        if (storedTheme === "dark") {
            return true;
        }

        if (storedTheme === "light") {
            return false;
        }
    } catch {
        // Continua usando o tema presente no documento.
    }

    return document
        .documentElement
        .classList
        .contains("dark");
}

function ThemeToggle() {
    const [darkTheme, setDarkTheme] =
        useState(getInitialTheme);

    useEffect(() => {
        const selectedTheme = darkTheme
            ? "dark"
            : "light";

        document.documentElement.classList.toggle(
            "dark",
            darkTheme
        );

        try {
            localStorage.setItem(
                "theme",
                selectedTheme
            );
        } catch {
            // O tema continua funcionando sem localStorage.
        }

        document
            .querySelector("#theme-color")
            ?.setAttribute(
                "content",
                darkTheme
                    ? "#0c0d12"
                    : "#f6f7fb"
            );
    }, [darkTheme]);

    return (
        <motion.button
            type="button"
            onClick={() =>
                setDarkTheme(
                    (currentTheme) =>
                        !currentTheme
                )
            }
            whileTap={{ scale: 0.92 }}
            aria-label={
                darkTheme
                    ? "Ativar tema claro"
                    : "Ativar tema escuro"
            }
            title={
                darkTheme
                    ? "Tema claro"
                    : "Tema escuro"
            }
            className="
                inline-flex size-10 shrink-0
                items-center justify-center
                rounded-lg
                text-muted-foreground
                outline-none
                transition-colors
                hover:bg-surface-hover
                hover:text-foreground
                focus-visible:ring-2
                focus-visible:ring-ring/25
            "
        >
            <AnimatePresence
                mode="wait"
                initial={false}
            >
                <motion.span
                    key={
                        darkTheme
                            ? "sun"
                            : "moon"
                    }
                    initial={{
                        opacity: 0,
                        rotate: -25,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        rotate: 25,
                        scale: 0.8,
                    }}
                    transition={{
                        duration: 0.15,
                    }}
                    className="flex"
                >
                    {darkTheme ? (
                        <RiSunLine
                            size={19}
                            aria-hidden="true"
                            className="text-warning"
                        />
                    ) : (
                        <RiMoonClearLine
                            size={19}
                            aria-hidden="true"
                        />
                    )}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}

export default ThemeToggle;
