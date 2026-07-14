import {
    useEffect,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiMoonLine,
    RiSunLine,
} from "react-icons/ri";

function getInitialTheme() {
    if (typeof document === "undefined") {
        return false;
    }

    return document.documentElement.classList.contains(
        "dark"
    );
}

function ThemeToggle() {
    const [darkTheme, setDarkTheme] =
        useState(getInitialTheme);

    useEffect(() => {
        const selectedTheme =
            darkTheme ? "dark" : "light";

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
                    ? "#09090b"
                    : "#f8fafc"
            );
    }, [darkTheme]);

    function toggleTheme() {
        setDarkTheme(
            (currentTheme) => !currentTheme
        );
    }

    return (
        <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{
                scale: 0.9,
            }}
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
                inline-flex size-9
                shrink-0
                items-center justify-center
                rounded-lg
                text-muted-foreground
                transition-colors
                hover:bg-surface-hover
                hover:text-foreground
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
                        rotate: -20,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        rotate: 20,
                        scale: 0.8,
                    }}
                    transition={{
                        duration: 0.15,
                    }}
                >
                    {darkTheme ? (
                        <RiSunLine size={18} />
                    ) : (
                        <RiMoonLine size={18} />
                    )}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}

export default ThemeToggle;