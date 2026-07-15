import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    createPortal,
} from "react-dom";

import {
    FiAlertCircle,
    FiCheck,
    FiChevronDown,
    FiFilter,
    FiLoader,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiPower,
    FiTrash2,
    FiUser,
    FiUserCheck,
    FiUsers,
    FiUserX,
    FiX,
} from "react-icons/fi";

import ConfirmDialog from "../../components/feedback/ConfirmDialog.jsx";
import Snackbar from "../../components/feedback/Snackbar.jsx";

import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { formatDate } from "../../utils/formatDate.js";

function getInitials(name) {
    const normalizedName = String(name ?? "").trim();

    if (!normalizedName) {
        return "U";
    }

    const nameParts = normalizedName
        .split(/\s+/)
        .filter(Boolean);

    if (nameParts.length === 1) {
        return nameParts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]
        }`.toUpperCase();
}

function isSameUser(firstId, secondId) {
    if (
        firstId === null ||
        firstId === undefined ||
        secondId === null ||
        secondId === undefined
    ) {
        return false;
    }

    return String(firstId) === String(secondId);
}

function getFormattedDate(value) {
    if (!value) {
        return "Não informado";
    }

    return formatDate(value);
}

function SummaryCard({
    title,
    value,
    icon: Icon,
    tone = "neutral",
}) {
    const tones = {
        neutral: {
            icon: "bg-surface-muted text-muted-foreground",
            value: "text-foreground",
        },

        info: {
            icon: "bg-info-muted text-info",
            value: "text-info",
        },

        success: {
            icon: "bg-success-muted text-success",
            value: "text-success",
        },

        danger: {
            icon: "bg-danger-muted text-danger",
            value: "text-danger",
        },
    };

    const styles =
        tones[tone] ?? tones.neutral;

    return (
        <article
            className="
                flex min-w-0
                items-center gap-3
                rounded-2xl
                border border-border
                bg-surface
                p-4
                shadow-card
            "
        >
            <span
                className={`
                    flex size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${styles.icon}
                `}
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <div className="min-w-0">
                <p
                    className="
                        truncate
                        text-xs
                        font-medium
                        text-muted-foreground
                    "
                >
                    {title}
                </p>

                <p
                    className={`
                        mt-0.5
                        text-xl
                        font-semibold
                        ${styles.value}
                    `}
                >
                    {value}
                </p>
            </div>
        </article>
    );
}



const ROLE_OPTIONS = [
    {
        value: "USER",
        label: "Usuário",
        description:
            "Acesso padrão às funções do sistema.",
        icon: FiUser,
        iconClass:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        selectedClass:
            "border-sky-500/25 bg-sky-500/[0.06]",
    },
    {
        value: "ADMIN",
        label: "Administrador",
        description:
            "Gerencia usuários, funções e permissões.",
        icon: FiShield,
        iconClass:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        selectedClass:
            "border-violet-500/25 bg-violet-500/[0.06]",
    },
];

function RoleSelect({
    userName,
    value = "USER",
    loading = false,
    disabled = false,
    ownAccount = false,
    compact = false,
    onChange,
}) {
    const [
        open,
        setOpen,
    ] = useState(false);

    const [
        position,
        setPosition,
    ] = useState({
        top: 0,
        left: 0,
        width: 220,
    });

    const triggerReference =
        useRef(null);

    const menuReference =
        useRef(null);

    const selectedOption =
        ROLE_OPTIONS.find(
            (option) =>
                option.value === value
        ) ??
        ROLE_OPTIONS[0];

    const SelectedIcon =
        selectedOption.icon;

    function updatePosition() {
        const trigger =
            triggerReference.current;

        if (!trigger) {
            return;
        }

        const rectangle =
            trigger.getBoundingClientRect();

        const viewportPadding = 12;
        const menuWidth =
            Math.max(
                compact
                    ? rectangle.width
                    : 220,
                rectangle.width
            );

        const clampedWidth =
            Math.min(
                menuWidth,
                window.innerWidth -
                viewportPadding * 2
            );

        const estimatedMenuHeight =
            154;

        const spaceBelow =
            window.innerHeight -
            rectangle.bottom;

        const shouldOpenAbove =
            spaceBelow <
            estimatedMenuHeight +
            16 &&
            rectangle.top >
            estimatedMenuHeight +
            16;

        const preferredLeft =
            compact
                ? rectangle.left
                : rectangle.right -
                clampedWidth;

        const clampedLeft =
            Math.min(
                Math.max(
                    preferredLeft,
                    viewportPadding
                ),
                window.innerWidth -
                clampedWidth -
                viewportPadding
            );

        setPosition({
            top: shouldOpenAbove
                ? rectangle.top -
                estimatedMenuHeight -
                8
                : rectangle.bottom + 8,

            left: clampedLeft,
            width: clampedWidth,
        });
    }

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        updatePosition();

        function handlePointerDown(
            event
        ) {
            const clickedTrigger =
                triggerReference.current
                    ?.contains(
                        event.target
                    );

            const clickedMenu =
                menuReference.current
                    ?.contains(
                        event.target
                    );

            if (
                !clickedTrigger &&
                !clickedMenu
            ) {
                setOpen(false);
            }
        }

        function handleKeyDown(
            event
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                event.preventDefault();
                setOpen(false);

                triggerReference
                    .current
                    ?.focus();
            }
        }

        function handleViewportChange() {
            setOpen(false);
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        window.addEventListener(
            "resize",
            handleViewportChange
        );

        window.addEventListener(
            "scroll",
            handleViewportChange,
            true
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

            window.removeEventListener(
                "resize",
                handleViewportChange
            );

            window.removeEventListener(
                "scroll",
                handleViewportChange,
                true
            );
        };
    }, [open]);

    function toggleOpen() {
        if (
            disabled ||
            loading
        ) {
            return;
        }

        if (!open) {
            updatePosition();
        }

        setOpen(
            (currentValue) =>
                !currentValue
        );
    }

    function selectRole(nextRole) {
        if (
            nextRole === value
        ) {
            setOpen(false);
            return;
        }

        onChange?.(nextRole);
        setOpen(false);
    }

    const dropdown =
        typeof document !==
            "undefined"
            ? createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            ref={
                                menuReference
                            }
                            role="listbox"
                            aria-label={`Selecionar função de ${userName}`}
                            initial={{
                                opacity: 0,
                                y: -6,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -4,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.17,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                            style={{
                                position: "fixed",
                                top:
                                    position.top,

                                left:
                                    position.left,

                                width:
                                    position.width,

                                zIndex: 400,
                            }}
                            className="
                                overflow-hidden
                                rounded-2xl
                                border border-border
                                bg-surface
                                p-1.5
                                text-foreground
                                shadow-2xl
                                shadow-slate-950/15
                                backdrop-blur-xl
                            "
                        >
                            {ROLE_OPTIONS.map(
                                (option) => {
                                    const OptionIcon =
                                        option.icon;

                                    const selected =
                                        option.value ===
                                        value;

                                    return (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            role="option"
                                            aria-selected={
                                                selected
                                            }
                                            onClick={() =>
                                                selectRole(
                                                    option.value
                                                )
                                            }
                                            className={`
                                                flex w-full
                                                min-w-0
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                px-2.5 py-2.5
                                                text-left
                                                outline-none
                                                transition
                                                focus-visible:ring-2
                                                focus-visible:ring-ring/20

                                                ${selected
                                                    ? option.selectedClass
                                                    : `
                                                            border-transparent
                                                            hover:bg-surface-hover
                                                        `
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    flex size-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl

                                                    ${option.iconClass}
                                                `}
                                            >
                                                <OptionIcon
                                                    size={17}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                <span
                                                    className="
                                                        block truncate
                                                        text-xs
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                        mt-0.5
                                                        block
                                                        line-clamp-1
                                                        text-[10px]
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        option.description
                                                    }
                                                </span>
                                            </span>

                                            {selected && (
                                                <span
                                                    className="
                                                        flex size-6
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-primary
                                                        text-primary-foreground
                                                    "
                                                >
                                                    <FiCheck
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )
            : null;

    return (
        <>
            <button
                ref={
                    triggerReference
                }
                type="button"
                onClick={
                    toggleOpen
                }
                disabled={
                    disabled ||
                    loading
                }
                aria-label={`Função de ${userName}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                title={
                    ownAccount
                        ? "Você não pode alterar a função da própria conta"
                        : `Alterar função de ${userName}`
                }
                className={`
                    group
                    flex min-w-0
                    items-center
                    justify-between
                    gap-2
                    rounded-xl
                    border border-border
                    bg-background
                    px-2.5
                    text-left
                    outline-none
                    transition
                    hover:border-border-strong
                    hover:bg-surface-hover
                    focus-visible:ring-2
                    focus-visible:ring-ring/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    ${compact
                        ? "h-9 w-full"
                        : "h-9 w-full max-w-44"
                    }
                `}
            >
                <span
                    className="
                        flex min-w-0
                        items-center gap-2
                    "
                >
                    <span
                        className={`
                            flex size-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg

                            ${selectedOption.iconClass}
                        `}
                    >
                        {loading ? (
                            <FiLoader
                                size={14}
                                aria-hidden="true"
                                className="animate-spin"
                            />
                        ) : (
                            <SelectedIcon
                                size={14}
                                aria-hidden="true"
                            />
                        )}
                    </span>

                    <span
                        className="
                            truncate
                            text-xs
                            font-semibold
                            text-foreground
                        "
                    >
                        {loading
                            ? "Atualizando..."
                            : selectedOption.label
                        }
                    </span>
                </span>

                <FiChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`
                        shrink-0
                        text-muted-foreground
                        transition-transform
                        duration-200

                        ${open
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />
            </button>

            {dropdown}
        </>
    );
}


const ROLE_FILTER_OPTIONS = [
    {
        value: "ALL",
        label: "Todas as funções",
        description:
            "Exibe usuários e administradores.",
        icon: FiUsers,
        iconClass:
            "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
        value: "USER",
        label: "Usuários",
        description:
            "Exibe somente contas com acesso padrão.",
        icon: FiUser,
        iconClass:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
        value: "ADMIN",
        label: "Administradores",
        description:
            "Exibe somente contas administrativas.",
        icon: FiShield,
        iconClass:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
];

const STATUS_FILTER_OPTIONS = [
    {
        value: "ALL",
        label: "Todos os acessos",
        description:
            "Exibe contas ativas e suspensas.",
        icon: FiFilter,
        iconClass:
            "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
        value: "ACTIVE",
        label: "Acesso ativo",
        description:
            "Exibe quem pode entrar no sistema.",
        icon: FiUserCheck,
        iconClass:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        value: "INACTIVE",
        label: "Acesso suspenso",
        description:
            "Exibe contas sem acesso ao sistema.",
        icon: FiUserX,
        iconClass:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
];

function FilterSelect({
    label,
    value,
    options,
    onChange,
}) {
    const [open, setOpen] =
        useState(false);

    const [position, setPosition] =
        useState({
            top: 0,
            left: 0,
            width: 250,
        });

    const triggerReference =
        useRef(null);

    const menuReference =
        useRef(null);

    const selectedOption =
        options.find(
            (option) =>
                option.value === value
        ) ?? options[0];

    const SelectedIcon =
        selectedOption.icon;

    const active =
        value !== "ALL";

    function updatePosition() {
        const trigger =
            triggerReference.current;

        if (!trigger) {
            return;
        }

        const rectangle =
            trigger.getBoundingClientRect();

        const viewportPadding = 12;
        const desiredWidth =
            Math.max(
                rectangle.width,
                250
            );

        const width =
            Math.min(
                desiredWidth,
                window.innerWidth -
                viewportPadding * 2
            );

        const estimatedHeight =
            options.length * 58 + 12;

        const spaceBelow =
            window.innerHeight -
            rectangle.bottom;

        const openAbove =
            spaceBelow <
            estimatedHeight + 16 &&
            rectangle.top >
            estimatedHeight + 16;

        const left =
            Math.min(
                Math.max(
                    rectangle.right - width,
                    viewportPadding
                ),
                window.innerWidth -
                width -
                viewportPadding
            );

        setPosition({
            top: openAbove
                ? rectangle.top -
                estimatedHeight - 8
                : rectangle.bottom + 8,
            left,
            width,
        });
    }

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        updatePosition();

        function handlePointerDown(
            event
        ) {
            const clickedTrigger =
                triggerReference.current
                    ?.contains(
                        event.target
                    );

            const clickedMenu =
                menuReference.current
                    ?.contains(
                        event.target
                    );

            if (
                !clickedTrigger &&
                !clickedMenu
            ) {
                setOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (
                event.key === "Escape"
            ) {
                event.preventDefault();
                setOpen(false);

                triggerReference.current
                    ?.focus();
            }
        }

        function closeOnViewportChange() {
            setOpen(false);
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        window.addEventListener(
            "resize",
            closeOnViewportChange
        );

        window.addEventListener(
            "scroll",
            closeOnViewportChange,
            true
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

            window.removeEventListener(
                "resize",
                closeOnViewportChange
            );

            window.removeEventListener(
                "scroll",
                closeOnViewportChange,
                true
            );
        };
    }, [open]);

    function toggleOpen() {
        if (!open) {
            updatePosition();
        }

        setOpen(
            (currentValue) =>
                !currentValue
        );
    }

    function selectOption(
        nextValue
    ) {
        onChange(nextValue);
        setOpen(false);
    }

    const dropdown =
        typeof document !==
            "undefined"
            ? createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            ref={
                                menuReference
                            }
                            role="listbox"
                            aria-label={label}
                            initial={{
                                opacity: 0,
                                y: -6,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -4,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.17,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                            style={{
                                position: "fixed",
                                top: position.top,
                                left: position.left,
                                width:
                                    position.width,
                                zIndex: 410,
                            }}
                            className="
                                overflow-hidden
                                rounded-2xl
                                border border-border
                                bg-surface
                                p-1.5
                                text-foreground
                                shadow-2xl
                                shadow-slate-950/15
                                backdrop-blur-xl
                            "
                        >
                            {options.map(
                                (option) => {
                                    const OptionIcon =
                                        option.icon;

                                    const selected =
                                        option.value ===
                                        value;

                                    return (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            role="option"
                                            aria-selected={
                                                selected
                                            }
                                            onClick={() =>
                                                selectOption(
                                                    option.value
                                                )
                                            }
                                            className={`
                                                flex w-full
                                                min-w-0
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                px-2.5 py-2.5
                                                text-left
                                                outline-none
                                                transition
                                                focus-visible:ring-2
                                                focus-visible:ring-ring/20

                                                ${selected
                                                    ? `
                                                            border-primary/20
                                                            bg-primary-muted
                                                        `
                                                    : `
                                                            border-transparent
                                                            hover:bg-surface-hover
                                                        `
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    flex size-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl

                                                    ${option.iconClass}
                                                `}
                                            >
                                                <OptionIcon
                                                    size={17}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                <span
                                                    className="
                                                        block truncate
                                                        text-xs
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                >
                                                    {option.label}
                                                </span>

                                                <span
                                                    className="
                                                        mt-0.5
                                                        block truncate
                                                        text-[10px]
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {option.description}
                                                </span>
                                            </span>

                                            {selected && (
                                                <span
                                                    className="
                                                        flex size-6
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-primary
                                                        text-primary-foreground
                                                    "
                                                >
                                                    <FiCheck
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )
            : null;

    return (
        <>
            <button
                ref={triggerReference}
                type="button"
                onClick={toggleOpen}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={label}
                className={`
                    group
                    flex h-12 w-full
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    rounded-2xl
                    border
                    bg-background
                    px-2.5 pr-3.5
                    text-left
                    outline-none
                    transition
                    hover:border-border-strong
                    hover:bg-surface-hover
                    focus-visible:ring-4
                    focus-visible:ring-ring/10

                    ${active
                        ? "border-primary/25"
                        : "border-border"
                    }
                `}
            >
                <span
                    className="
                        flex min-w-0
                        items-center gap-2.5
                    "
                >
                    <span
                        className={`
                            flex size-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl

                            ${selectedOption.iconClass}
                        `}
                    >
                        <SelectedIcon
                            size={16}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="min-w-0">
                        <span
                            className="
                                block truncate
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.08em]
                                text-muted-foreground
                            "
                        >
                            {label}
                        </span>

                        <span
                            className="
                                mt-0.5
                                block truncate
                                text-xs
                                font-semibold
                                text-foreground
                            "
                        >
                            {selectedOption.label}
                        </span>
                    </span>
                </span>

                <FiChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`
                        shrink-0
                        text-muted-foreground
                        transition-transform
                        duration-200

                        ${open
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />
            </button>

            {dropdown}
        </>
    );
}

function UserStatusSwitch({
    userName,
    active,
    loading = false,
    disabled = false,
    ownAccount = false,
    compact = false,
    onChange,
}) {
    const statusLabel =
        active
            ? "Acesso ativo"
            : "Acesso suspenso";

    const statusDescription =
        active
            ? "Pode entrar e utilizar o sistema."
            : "Não pode acessar o sistema.";

    const actionLabel =
        active
            ? `Desativar ${userName}`
            : `Ativar ${userName}`;

    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled || loading}
            aria-label={actionLabel}
            aria-pressed={active}
            title={
                ownAccount
                    ? "Você não pode alterar o acesso da própria conta"
                    : actionLabel
            }
            className={`
                group
                flex min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                text-left
                outline-none
                transition-all
                duration-200
                focus-visible:ring-4
                focus-visible:ring-ring/10
                disabled:cursor-not-allowed
                disabled:opacity-55

                ${compact
                    ? "w-full px-3 py-2.5"
                    : "w-full max-w-[230px] px-3 py-2.5"
                }

                ${active
                    ? `
                            border-success/20
                            bg-success-muted/55
                            hover:border-success/35
                            hover:bg-success-muted
                        `
                    : `
                            border-warning/20
                            bg-warning-muted/45
                            hover:border-warning/35
                            hover:bg-warning-muted
                        `
                }
            `}
        >
            <span
                className={`
                    relative
                    flex h-7 w-12
                    shrink-0
                    items-center
                    rounded-full
                    p-0.5
                    shadow-inner
                    transition-colors
                    duration-200

                    ${active
                        ? "bg-success"
                        : "bg-muted-foreground/35"
                    }
                `}
            >
                <motion.span
                    animate={{
                        x: active
                            ? 20
                            : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 34,
                        mass: 0.65,
                    }}
                    className="
                        flex size-6
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        shadow-sm
                    "
                >
                    {loading ? (
                        <FiLoader
                            size={13}
                            aria-hidden="true"
                            className="
                                animate-spin
                                text-muted-foreground
                            "
                        />
                    ) : (
                        <FiPower
                            size={13}
                            aria-hidden="true"
                            className={
                                active
                                    ? "text-success"
                                    : "text-muted-foreground"
                            }
                        />
                    )}
                </motion.span>
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className={`
                        block truncate
                        text-xs
                        font-semibold

                        ${active
                            ? "text-success"
                            : "text-warning"
                        }
                    `}
                >
                    {loading
                        ? "Atualizando..."
                        : statusLabel
                    }
                </span>

                {!compact && (
                    <span
                        className="
                            mt-0.5
                            block truncate
                            text-[10px]
                            text-muted-foreground
                        "
                    >
                        {ownAccount
                            ? "Sua própria conta"
                            : statusDescription
                        }
                    </span>
                )}
            </span>
        </button>
    );
}

function LoadingState() {
    return (
        <div className="animate-pulse">
            <div
                className="
                    hidden divide-y
                    divide-border
                    lg:block
                "
            >
                {Array.from({
                    length: 5,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="
                            grid grid-cols-5
                            items-center gap-4
                            px-5 py-4
                        "
                    >
                        <div
                            className="
                                col-span-2
                                flex items-center gap-3
                            "
                        >
                            <div
                                className="
                                    size-10
                                    rounded-xl
                                    bg-surface-muted
                                "
                            />

                            <div className="flex-1 space-y-2">
                                <div
                                    className="
                                        h-4 w-36
                                        rounded
                                        bg-surface-muted
                                    "
                                />

                                <div
                                    className="
                                        h-3 w-48
                                        max-w-full
                                        rounded
                                        bg-surface-muted
                                    "
                                />
                            </div>
                        </div>

                        <div
                            className="
                                h-9 w-32
                                rounded-xl
                                bg-surface-muted
                            "
                        />

                        <div
                            className="
                                h-7 w-20
                                rounded-full
                                bg-surface-muted
                            "
                        />

                        <div
                            className="
                                ml-auto
                                h-9 w-24
                                rounded-xl
                                bg-surface-muted
                            "
                        />
                    </div>
                ))}
            </div>

            <div
                className="
                    grid gap-3 p-4
                    sm:grid-cols-2
                    lg:hidden
                "
            >
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="
                            h-52
                            rounded-2xl
                            bg-surface-muted
                        "
                    />
                ))}
            </div>
        </div>
    );
}

function Users() {
    const {
        user: authenticatedUser,
    } = useAuth();

    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        updatingId,
        setUpdatingId,
    ] = useState(null);

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        userToDelete,
        setUserToDelete,
    ] = useState(null);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("ALL");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("ALL");

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        notification,
        setNotification,
    ] = useState({
        type: "info",
        message: "",
    });

    const showNotification = useCallback(
        (type, message) => {
            setNotification({
                type,
                message,
            });
        },
        []
    );

    const clearNotification = useCallback(
        () => {
            setNotification({
                type: "info",
                message: "",
            });
        },
        []
    );

    const loadUsers = useCallback(
        async ({
            initial = false,
        } = {}) => {
            if (initial) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setLoadError("");

            try {
                const response =
                    await userService.list();

                setUsers(
                    Array.isArray(response.users)
                        ? response.users
                        : []
                );
            } catch (error) {
                const message =
                    error.response?.data?.error ??
                    "Não foi possível carregar os usuários.";

                setLoadError(message);

                if (!initial) {
                    showNotification(
                        "error",
                        message
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [showNotification]
    );

    useEffect(() => {
        loadUsers({
            initial: true,
        });
    }, [loadUsers]);

    const statistics = useMemo(() => {
        const totalUsers = users.length;

        const adminCount = users.filter(
            (selectedUser) =>
                selectedUser.role === "ADMIN"
        ).length;

        const activeCount = users.filter(
            (selectedUser) =>
                selectedUser.isActive
        ).length;

        return {
            totalUsers,
            adminCount,
            activeCount,
            inactiveCount:
                totalUsers - activeCount,
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const normalizedSearch =
            searchTerm
                .trim()
                .toLowerCase();

        return users.filter(
            (selectedUser) => {
                const matchesSearch =
                    !normalizedSearch ||
                    String(
                        selectedUser.name ?? ""
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    String(
                        selectedUser.email ?? ""
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                const matchesRole =
                    roleFilter === "ALL" ||
                    selectedUser.role ===
                    roleFilter;

                const matchesStatus =
                    statusFilter === "ALL" ||
                    (
                        statusFilter ===
                        "ACTIVE" &&
                        selectedUser.isActive
                    ) ||
                    (
                        statusFilter ===
                        "INACTIVE" &&
                        !selectedUser.isActive
                    );

                return (
                    matchesSearch &&
                    matchesRole &&
                    matchesStatus
                );
            }
        );
    }, [
        users,
        searchTerm,
        roleFilter,
        statusFilter,
    ]);

    async function handleRoleChange(
        selectedUser,
        newRole
    ) {
        if (
            selectedUser.role === newRole ||
            updatingId !== null
        ) {
            return;
        }

        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode alterar a função da própria conta."
            );

            return;
        }

        setUpdatingId(selectedUser.id);
        clearNotification();

        try {
            const response =
                await userService.update(
                    selectedUser.id,
                    {
                        role: newRole,
                    }
                );

            setUsers(
                (currentUsers) =>
                    currentUsers.map(
                        (currentUser) =>
                            isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                                ? {
                                    ...currentUser,
                                    ...(response.user ??
                                        {}),
                                    role: newRole,
                                }
                                : currentUser
                    )
            );

            showNotification(
                "success",
                "Função do usuário atualizada com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível alterar a função do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleActiveChange(
        selectedUser
    ) {
        if (updatingId !== null) {
            return;
        }

        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode desativar a própria conta."
            );

            return;
        }

        const newActiveStatus =
            !selectedUser.isActive;

        setUpdatingId(selectedUser.id);
        clearNotification();

        try {
            const response =
                await userService.update(
                    selectedUser.id,
                    {
                        isActive:
                            newActiveStatus,
                    }
                );

            setUsers(
                (currentUsers) =>
                    currentUsers.map(
                        (currentUser) =>
                            isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                                ? {
                                    ...currentUser,
                                    ...(response.user ??
                                        {}),
                                    isActive:
                                        newActiveStatus,
                                }
                                : currentUser
                    )
            );

            showNotification(
                "success",
                newActiveStatus
                    ? "Usuário ativado com sucesso."
                    : "Usuário desativado com sucesso."
            );
        } catch (error) {
            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível alterar o estado do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function requestDelete(
        selectedUser
    ) {
        const isCurrentUser =
            isSameUser(
                selectedUser.id,
                authenticatedUser?.id
            );

        if (isCurrentUser) {
            showNotification(
                "warning",
                "Você não pode excluir a própria conta nesta página."
            );

            return;
        }

        clearNotification();
        setUserToDelete(selectedUser);
    }

    function cancelDelete() {
        if (deletingId !== null) {
            return;
        }

        setUserToDelete(null);
    }

    async function confirmDelete() {
        if (
            !userToDelete ||
            deletingId !== null
        ) {
            return;
        }

        const selectedUser =
            userToDelete;

        setDeletingId(selectedUser.id);
        clearNotification();

        try {
            await userService.remove(
                selectedUser.id
            );

            setUsers(
                (currentUsers) =>
                    currentUsers.filter(
                        (currentUser) =>
                            !isSameUser(
                                currentUser.id,
                                selectedUser.id
                            )
                    )
            );

            setUserToDelete(null);

            showNotification(
                "success",
                "Usuário excluído com sucesso."
            );
        } catch (error) {
            setUserToDelete(null);

            showNotification(
                "error",
                error.response?.data?.error ??
                "Não foi possível excluir o usuário."
            );
        } finally {
            setDeletingId(null);
        }
    }

    function clearFilters() {
        setSearchTerm("");
        setRoleFilter("ALL");
        setStatusFilter("ALL");
    }

    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL";

    return (
        <div
            className="
                w-full min-w-0
                max-w-none
                px-4 py-5
                sm:px-6 sm:py-6
                lg:px-8
            "
        >
            <div
                className="
                    flex w-full min-w-0
                    flex-col gap-5
                    sm:gap-6
                "
            >
                <header
                    className="
                        flex min-w-0
                        flex-col gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex items-center
                                gap-2
                            "
                        >
                            <h1
                                className="
                                    truncate
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-foreground
                                "
                            >
                                Gerenciamento de usuários
                            </h1>

                            <span
                                className="
                                    hidden
                                    rounded-full
                                    bg-info-muted
                                    px-2.5 py-1
                                    text-xs
                                    font-medium
                                    text-info
                                    sm:inline-flex
                                "
                            >
                                Administrador
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Gerencie funções, acessos e
                            contas cadastradas no sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadUsers()
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="
                            inline-flex
                            min-h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border border-border
                            bg-surface
                            px-4
                            text-sm
                            font-medium
                            text-foreground
                            transition-colors
                            hover:bg-surface-hover
                            disabled:pointer-events-none
                            disabled:opacity-50
                            sm:w-auto
                        "
                    >
                        <FiRefreshCw
                            size={17}
                            aria-hidden="true"
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Atualizando..."
                            : "Atualizar"}
                    </button>
                </header>

                <section
                    aria-label="Resumo dos usuários"
                    className="
                        grid gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <SummaryCard
                        title="Usuários cadastrados"
                        value={
                            statistics.totalUsers
                        }
                        icon={FiUsers}
                        tone="info"
                    />

                    <SummaryCard
                        title="Administradores"
                        value={
                            statistics.adminCount
                        }
                        icon={FiShield}
                        tone="neutral"
                    />

                    <SummaryCard
                        title="Usuários ativos"
                        value={
                            statistics.activeCount
                        }
                        icon={FiUserCheck}
                        tone="success"
                    />

                    <SummaryCard
                        title="Usuários inativos"
                        value={
                            statistics.inactiveCount
                        }
                        icon={FiUserX}
                        tone="danger"
                    />
                </section>

                <section
                    aria-label="Filtros de usuários"
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-[24px]
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <div
                        className="
                            flex min-w-0
                            items-center
                            justify-between
                            gap-3
                            border-b border-border
                            px-4 py-3.5
                            sm:px-5
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-primary-muted
                                    text-primary
                                "
                            >
                                <FiFilter
                                    size={17}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Filtrar usuários
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Pesquise e refine a lista sem recarregar a página.
                                </p>
                            </div>
                        </div>

                        <span
                            className="
                                shrink-0
                                rounded-full
                                bg-surface-muted
                                px-2.5 py-1
                                text-xs
                                font-semibold
                                tabular-nums
                                text-muted-foreground
                            "
                        >
                            {filteredUsers.length}
                        </span>
                    </div>

                    <div className="p-4 sm:p-5">
                        <div
                            className="
                                grid gap-3
                                lg:grid-cols-[minmax(0,1fr)_220px_220px]
                            "
                        >
                            <div className="relative min-w-0">
                                <span
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-2 top-1/2
                                        flex size-8
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-surface-muted
                                        text-muted-foreground
                                    "
                                >
                                    <FiSearch size={16} />
                                </span>

                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Buscar por nome ou e-mail"
                                    aria-label="Buscar usuários"
                                    className="
                                        h-12 w-full
                                        min-w-0
                                        rounded-2xl
                                        border border-border
                                        bg-background
                                        py-2
                                        pl-12 pr-4
                                        text-sm
                                        font-medium
                                        text-foreground
                                        outline-none
                                        transition
                                        placeholder:font-normal
                                        placeholder:text-muted-foreground/65
                                        hover:border-border-strong
                                        focus:border-primary/45
                                        focus:ring-4
                                        focus:ring-primary/10
                                    "
                                />
                            </div>

                            <FilterSelect
                                label="Função"
                                value={roleFilter}
                                options={
                                    ROLE_FILTER_OPTIONS
                                }
                                onChange={
                                    setRoleFilter
                                }
                            />

                            <FilterSelect
                                label="Acesso"
                                value={statusFilter}
                                options={
                                    STATUS_FILTER_OPTIONS
                                }
                                onChange={
                                    setStatusFilter
                                }
                            />
                        </div>

                        <div
                            className="
                                mt-4
                                flex min-w-0
                                flex-col gap-3
                                border-t border-border
                                pt-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <p
                                className="
                                    min-w-0
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                <strong
                                    className="
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {filteredUsers.length}
                                </strong>{" "}
                                {filteredUsers.length === 1
                                    ? "usuário encontrado"
                                    : "usuários encontrados"}
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        inline-flex
                                        min-h-9
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border border-border
                                        bg-surface
                                        px-3
                                        text-xs
                                        font-semibold
                                        text-muted-foreground
                                        transition
                                        hover:border-primary/20
                                        hover:bg-primary-muted
                                        hover:text-primary
                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-primary/20
                                        sm:w-auto
                                    "
                                >
                                    <FiX
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {loadError && !loading && (
                    <div
                        role="alert"
                        className="
                            flex items-center
                            gap-3
                            rounded-xl
                            border border-danger/20
                            bg-danger-muted
                            px-4 py-3
                            text-sm
                            text-danger
                        "
                    >
                        <FiAlertCircle
                            size={18}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <p className="min-w-0 flex-1">
                            {loadError}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                loadUsers({
                                    initial: true,
                                })
                            }
                            className="
                                shrink-0
                                font-medium
                                underline
                                underline-offset-2
                            "
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                <section
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border border-border
                        bg-surface
                        shadow-card
                    "
                >
                    <header
                        className="
                            flex min-w-0
                            items-center
                            justify-between
                            gap-3
                            border-b border-border
                            px-4 py-4
                            sm:px-5
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                            "
                        >
                            <span
                                className="
                                    flex size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-info-muted
                                    text-info
                                "
                            >
                                <FiUsers
                                    size={17}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Usuários cadastrados
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Controle de acesso e
                                    permissões.
                                </p>
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <LoadingState />
                    ) : filteredUsers.length ===
                        0 ? (
                        <div
                            className="
                                flex min-h-64
                                flex-col
                                items-center
                                justify-center
                                p-6
                                text-center
                            "
                        >
                            <span
                                className="
                                    flex size-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-surface-muted
                                    text-muted-foreground
                                "
                            >
                                <FiUsers
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <h3
                                className="
                                    mt-4
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Nenhum usuário encontrado
                            </h3>

                            <p
                                className="
                                    mt-1
                                    max-w-sm
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Ajuste os filtros ou faça uma
                                nova atualização da lista.
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-primary
                                    "
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <table
                                    className="
                                        w-full
                                        table-fixed
                                        text-left
                                        text-sm
                                    "
                                >
                                    <thead
                                        className="
                                            bg-surface-muted
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        <tr>
                                            <th
                                                className="
                                                    w-[31%]
                                                    px-5 py-3
                                                "
                                            >
                                                Usuário
                                            </th>

                                            <th
                                                className="
                                                    w-[18%]
                                                    px-4 py-3
                                                "
                                            >
                                                Função
                                            </th>

                                            <th
                                                className="
                                                    w-[25%]
                                                    px-4 py-3
                                                "
                                            >
                                                Acesso
                                            </th>

                                            <th
                                                className="
                                                    w-[16%]
                                                    px-4 py-3
                                                "
                                            >
                                                Cadastro
                                            </th>

                                            <th
                                                className="
                                                    w-[10%]
                                                    px-5 py-3
                                                    text-right
                                                "
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.map(
                                            (
                                                selectedUser
                                            ) => {
                                                const isCurrentUser =
                                                    isSameUser(
                                                        selectedUser.id,
                                                        authenticatedUser?.id
                                                    );

                                                const isUpdating =
                                                    isSameUser(
                                                        updatingId,
                                                        selectedUser.id
                                                    );

                                                const isDeleting =
                                                    isSameUser(
                                                        deletingId,
                                                        selectedUser.id
                                                    );

                                                const isBusy =
                                                    isUpdating ||
                                                    isDeleting;

                                                return (
                                                    <tr
                                                        key={
                                                            selectedUser.id
                                                        }
                                                        className={`
                                                            border-t
                                                            border-border
                                                            transition-colors
                                                            hover:bg-surface-hover

                                                            ${selectedUser.isActive
                                                                ? ""
                                                                : "bg-surface-muted/25"
                                                            }
                                                        `}
                                                    >
                                                        <td
                                                            className="
                                                                px-5 py-3.5
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex min-w-0
                                                                    items-center
                                                                    gap-3
                                                                "
                                                            >
                                                                <span
                                                                    className={`
                                                                        flex size-10
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        text-xs
                                                                        font-semibold

                                                                        ${selectedUser.role ===
                                                                            "ADMIN"
                                                                            ? "bg-info-muted text-info"
                                                                            : "bg-surface-muted text-muted-foreground"
                                                                        }
                                                                    `}
                                                                >
                                                                    {getInitials(
                                                                        selectedUser.name
                                                                    )}
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <div
                                                                        className="
                                                                            flex min-w-0
                                                                            items-center
                                                                            gap-2
                                                                        "
                                                                    >
                                                                        <p
                                                                            className="
                                                                                truncate
                                                                                font-medium
                                                                                text-foreground
                                                                            "
                                                                            title={
                                                                                selectedUser.name
                                                                            }
                                                                        >
                                                                            {
                                                                                selectedUser.name
                                                                            }
                                                                        </p>

                                                                        {isCurrentUser && (
                                                                            <span
                                                                                className="
                                                                                    shrink-0
                                                                                    rounded-full
                                                                                    bg-info-muted
                                                                                    px-2 py-0.5
                                                                                    text-[10px]
                                                                                    font-medium
                                                                                    text-info
                                                                                "
                                                                            >
                                                                                Você
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            truncate
                                                                            text-xs
                                                                            text-muted-foreground
                                                                        "
                                                                        title={
                                                                            selectedUser.email
                                                                        }
                                                                    >
                                                                        {
                                                                            selectedUser.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                            "
                                                        >
                                                            <div className="max-w-44">
                                                                <RoleSelect
                                                                    userName={
                                                                        selectedUser.name
                                                                    }
                                                                    value={
                                                                        selectedUser.role ??
                                                                        "USER"
                                                                    }
                                                                    loading={
                                                                        isUpdating
                                                                    }
                                                                    disabled={
                                                                        isBusy ||
                                                                        isCurrentUser
                                                                    }
                                                                    ownAccount={
                                                                        isCurrentUser
                                                                    }
                                                                    onChange={(
                                                                        nextRole
                                                                    ) =>
                                                                        handleRoleChange(
                                                                            selectedUser,
                                                                            nextRole
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                            "
                                                        >
                                                            <UserStatusSwitch
                                                                userName={
                                                                    selectedUser.name
                                                                }
                                                                active={
                                                                    Boolean(
                                                                        selectedUser.isActive
                                                                    )
                                                                }
                                                                loading={
                                                                    isUpdating
                                                                }
                                                                disabled={
                                                                    isBusy ||
                                                                    isCurrentUser
                                                                }
                                                                ownAccount={
                                                                    isCurrentUser
                                                                }
                                                                onChange={() =>
                                                                    handleActiveChange(
                                                                        selectedUser
                                                                    )
                                                                }
                                                            />
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4 py-3.5
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {getFormattedDate(
                                                                selectedUser.createdAt
                                                            )}
                                                        </td>

                                                        <td
                                                            className="
                                                                px-5 py-3.5
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex
                                                                    justify-end
                                                                    gap-2
                                                                "
                                                            >
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isBusy ||
                                                                        isCurrentUser
                                                                    }
                                                                    onClick={() =>
                                                                        requestDelete(
                                                                            selectedUser
                                                                        )
                                                                    }
                                                                    title={
                                                                        isCurrentUser
                                                                            ? "Você não pode excluir a própria conta"
                                                                            : "Excluir usuário"
                                                                    }
                                                                    aria-label={`Excluir ${selectedUser.name}`}
                                                                    className="
                                                                        inline-flex size-9
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        border
                                                                        border-danger/25
                                                                        bg-surface
                                                                        text-danger
                                                                        transition-colors
                                                                        hover:bg-danger-muted
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-40
                                                                    "
                                                                >
                                                                    {isDeleting ? (
                                                                        <FiLoader
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <FiTrash2
                                                                            size={
                                                                                16
                                                                            }
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                className="
                                    grid items-start
                                    gap-3 p-4
                                    sm:grid-cols-2
                                    lg:hidden
                                "
                            >
                                {filteredUsers.map(
                                    (
                                        selectedUser
                                    ) => {
                                        const isCurrentUser =
                                            isSameUser(
                                                selectedUser.id,
                                                authenticatedUser?.id
                                            );

                                        const isUpdating =
                                            isSameUser(
                                                updatingId,
                                                selectedUser.id
                                            );

                                        const isDeleting =
                                            isSameUser(
                                                deletingId,
                                                selectedUser.id
                                            );

                                        const isBusy =
                                            isUpdating ||
                                            isDeleting;

                                        return (
                                            <article
                                                key={
                                                    selectedUser.id
                                                }
                                                className="
                                                    min-w-0
                                                    self-start
                                                    rounded-2xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    p-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex min-w-0
                                                        items-start
                                                        gap-3
                                                    "
                                                >
                                                    <span
                                                        className={`
                                                            flex size-11
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            text-xs
                                                            font-semibold

                                                            ${selectedUser.role ===
                                                                "ADMIN"
                                                                ? "bg-info-muted text-info"
                                                                : "bg-surface-muted text-muted-foreground"
                                                            }
                                                        `}
                                                    >
                                                        {getInitials(
                                                            selectedUser.name
                                                        )}
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <div
                                                            className="
                                                                flex min-w-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            <h3
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-semibold
                                                                    text-foreground
                                                                "
                                                            >
                                                                {
                                                                    selectedUser.name
                                                                }
                                                            </h3>

                                                            {isCurrentUser && (
                                                                <span
                                                                    className="
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-info-muted
                                                                        px-2 py-0.5
                                                                        text-[10px]
                                                                        font-medium
                                                                        text-info
                                                                    "
                                                                >
                                                                    Você
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                truncate
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {
                                                                selectedUser.email
                                                            }
                                                        </p>
                                                    </div>


                                                </div>

                                                <div className="mt-4">
                                                    <UserStatusSwitch
                                                        userName={
                                                            selectedUser.name
                                                        }
                                                        active={
                                                            Boolean(
                                                                selectedUser.isActive
                                                            )
                                                        }
                                                        loading={
                                                            isUpdating
                                                        }
                                                        disabled={
                                                            isBusy ||
                                                            isCurrentUser
                                                        }
                                                        ownAccount={
                                                            isCurrentUser
                                                        }
                                                        compact
                                                        onChange={() =>
                                                            handleActiveChange(
                                                                selectedUser
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    className="
                                                        mt-4
                                                        grid grid-cols-2
                                                        gap-3
                                                        border-y
                                                        border-border
                                                        py-3
                                                    "
                                                >
                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            Função
                                                        </p>

                                                        <div className="mt-1">
                                                            <RoleSelect
                                                                userName={
                                                                    selectedUser.name
                                                                }
                                                                value={
                                                                    selectedUser.role ??
                                                                    "USER"
                                                                }
                                                                loading={
                                                                    isUpdating
                                                                }
                                                                disabled={
                                                                    isBusy ||
                                                                    isCurrentUser
                                                                }
                                                                ownAccount={
                                                                    isCurrentUser
                                                                }
                                                                compact
                                                                onChange={(
                                                                    nextRole
                                                                ) =>
                                                                    handleRoleChange(
                                                                        selectedUser,
                                                                        nextRole
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            Cadastro
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-2
                                                                truncate
                                                                text-xs
                                                                font-medium
                                                                text-foreground
                                                            "
                                                        >
                                                            {getFormattedDate(
                                                                selectedUser.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        mt-4
                                                        flex justify-end
                                                    "
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isBusy ||
                                                            isCurrentUser
                                                        }
                                                        onClick={() =>
                                                            requestDelete(
                                                                selectedUser
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            min-h-10
                                                            w-full
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-danger/25
                                                            bg-surface
                                                            px-4
                                                            text-xs
                                                            font-semibold
                                                            text-danger
                                                            transition
                                                            hover:bg-danger-muted
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                            sm:w-auto
                                                        "
                                                    >
                                                        {isDeleting ? (
                                                            <FiLoader
                                                                size={15}
                                                                className="animate-spin"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <FiTrash2
                                                                size={15}
                                                                aria-hidden="true"
                                                            />
                                                        )}

                                                        Excluir usuário
                                                    </button>
                                                </div>

                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>

            <ConfirmDialog
                open={Boolean(userToDelete)}
                title="Excluir usuário?"
                description={
                    userToDelete
                        ? `O usuário "${userToDelete.name}" e todas as transações associadas serão excluídos permanentemente. Esta ação não poderá ser desfeita.`
                        : ""
                }
                confirmLabel="Excluir usuário"
                cancelLabel="Cancelar"
                loading={
                    deletingId ===
                    userToDelete?.id
                }
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <Snackbar
                message={
                    notification.message
                }
                type={notification.type}
                duration={4500}
                onClose={clearNotification}
            />
        </div>
    );
}

export default Users;