import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    RiArrowDownSLine,
    RiLogoutBoxRLine,
    RiSettings3Line,
    RiShieldUserLine,
} from "react-icons/ri";

import {
    Link,
    useNavigate,
} from "react-router";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import UserAvatar from "../ui/UserAvatar.jsx";

function getShortName(name) {
    const normalizedName =
        name?.trim() ||
        "Usuário";

    return normalizedName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(" ");
}

function getUserInformation(user) {
    const fullName =
        user?.name?.trim() ||
        "Usuário";

    return {
        fullName,
        shortName:
            getShortName(
                fullName
            ),

        roleLabel:
            user?.role === "ADMIN"
                ? "Administrador"
                : "Usuário",
    };
}

function UserMenu() {
    const navigate =
        useNavigate();

    const menuReference =
        useRef(null);

    const {
        user,
        logout,
    } = useAuth();

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false);

    const {
        fullName,
        shortName,
        roleLabel,
    } = getUserInformation(user);

    useEffect(() => {
        function handlePointerDown(
            event
        ) {
            if (
                menuReference.current &&
                !menuReference.current
                    .contains(
                        event.target
                    )
            ) {
                setMenuOpen(false);
            }
        }

        function handleKeyDown(
            event
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    function toggleMenu() {
        setMenuOpen(
            (currentState) =>
                !currentState
        );
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    function handleLogout() {
        closeMenu();
        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    }

    return (
        <div
            ref={menuReference}
            className="
                relative shrink-0
            "
        >
            <button
                type="button"
                onClick={toggleMenu}
                aria-label="Abrir menu do usuário"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                title={fullName}
                className={`
                    group
                    flex h-11 min-w-0
                    items-center gap-2
                    rounded-xl
                    px-1.5
                    outline-none
                    transition
                    hover:bg-surface-hover
                    focus-visible:ring-2
                    focus-visible:ring-ring/20

                    ${menuOpen
                        ? "bg-surface-hover"
                        : ""
                    }
                `}
            >
                <UserAvatar
                    name={fullName}
                    size="md"
                    showTitle={false}
                />

                <span
                    className="
                        hidden min-w-0
                        max-w-32 truncate
                        text-sm
                        font-medium
                        text-foreground
                        md:block
                    "
                >
                    {shortName}
                </span>

                <RiArrowDownSLine
                    size={16}
                    aria-hidden="true"
                    className={`
                        hidden shrink-0
                        text-muted-foreground
                        transition-transform
                        duration-200
                        md:block

                        ${menuOpen
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />
            </button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        role="menu"
                        initial={{
                            opacity: 0,
                            y: -8,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -6,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.18,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            absolute right-0
                            top-full z-50
                            mt-2
                            w-72
                            max-w-[calc(100vw-1.5rem)]
                            overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-surface
                            p-2
                            shadow-2xl
                            shadow-slate-950/10
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                                rounded-xl
                                bg-background/60
                                p-3
                            "
                        >
                            <UserAvatar
                                name={fullName}
                                size="lg"
                                showTitle={false}
                            />

                            <div
                                className="
                                    min-w-0 flex-1
                                "
                            >
                                <strong
                                    title={fullName}
                                    className="
                                        block truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {shortName}
                                </strong>

                                <span
                                    className="
                                        mt-1
                                        inline-flex
                                        items-center gap-1.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    <RiShieldUserLine
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    {roleLabel}
                                </span>
                            </div>
                        </div>

                        <div
                            aria-hidden="true"
                            className="
                                my-2 h-px
                                bg-border
                            "
                        />

                        <Link
                            to="/perfil"
                            role="menuitem"
                            onClick={
                                closeMenu
                            }
                            className="
                                flex min-h-11
                                min-w-0
                                items-center gap-3
                                rounded-xl
                                px-3
                                text-sm
                                font-medium
                                text-foreground
                                outline-none
                                transition
                                hover:bg-surface-hover
                                focus-visible:ring-2
                                focus-visible:ring-ring/20
                            "
                        >
                            <RiSettings3Line
                                size={19}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-muted-foreground
                                "
                            />

                            <span className="truncate">
                                Configurações do perfil
                            </span>
                        </Link>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={
                                handleLogout
                            }
                            className="
                                flex min-h-11
                                w-full min-w-0
                                items-center gap-3
                                rounded-xl
                                px-3
                                text-sm
                                font-medium
                                text-muted-foreground
                                outline-none
                                transition
                                hover:bg-danger-muted
                                hover:text-danger
                                focus-visible:ring-2
                                focus-visible:ring-danger/20
                            "
                        >
                            <RiLogoutBoxRLine
                                size={19}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            <span className="truncate">
                                Sair da conta
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default UserMenu;