import {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ChevronsUpDown,
    Search,
    Tags,
} from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/Popover.jsx";
import { cn } from "../../../lib/cn.js";
import TagPill from "./TagPill.jsx";

const TAG_GAP = 8;

function normalizeSearch(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function TagMultiSelect({
    tags = [],
    value = [],
    onChange,
    onManageTags,
    error,
    disabled = false,
    className,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [visibleTagCount, setVisibleTagCount] = useState(0);

    const selectedAreaRef = useRef(null);
    const measureAreaRef = useRef(null);

    const normalizedValue = useMemo(
        () => Array.isArray(value) ? value : [],
        [value],
    );

    const selectedIds = useMemo(
        () => new Set(
            normalizedValue.map((tagId) => String(tagId)),
        ),
        [normalizedValue],
    );

    const sortedTags = useMemo(
        () => [...tags].sort(
            (firstTag, secondTag) => String(firstTag?.name ?? "")
                .localeCompare(
                    String(secondTag?.name ?? ""),
                    "pt-BR",
                ),
        ),
        [tags],
    );

    const selectedTags = useMemo(
        () => sortedTags.filter(
            (tag) => selectedIds.has(String(tag.id)),
        ),
        [
            selectedIds,
            sortedTags,
        ],
    );

    const filteredTags = useMemo(() => {
        const normalizedSearch = normalizeSearch(search);

        if (!normalizedSearch) {
            return sortedTags;
        }

        return sortedTags.filter((tag) => (
            normalizeSearch(tag.name).includes(normalizedSearch)
        ));
    }, [
        search,
        sortedTags,
    ]);

    useLayoutEffect(() => {
        const selectedArea = selectedAreaRef.current;
        const measureArea = measureAreaRef.current;

        if (!selectedArea || !measureArea) {
            return undefined;
        }

        function calculateVisibleTags() {
            const availableWidth = selectedArea.clientWidth;

            const tagElements = Array.from(
                measureArea.querySelectorAll("[data-tag-measure]"),
            );

            const counterElement = measureArea.querySelector(
                "[data-counter-measure]",
            );

            if (!availableWidth || tagElements.length === 0) {
                setVisibleTagCount(selectedTags.length);

                return;
            }

            const tagWidths = tagElements.map(
                (element) => element.getBoundingClientRect().width,
            );

            const counterWidth = counterElement
                ?.getBoundingClientRect().width ?? 28;

            let nextVisibleCount = 0;

            for (
                let count = tagWidths.length;
                count >= 0;
                count -= 1
            ) {
                const hiddenCount = tagWidths.length - count;

                let requiredWidth = tagWidths
                    .slice(0, count)
                    .reduce(
                        (total, width) => total + width,
                        0,
                    );

                if (count > 1) {
                    requiredWidth += TAG_GAP * (count - 1);
                }

                if (hiddenCount > 0) {
                    requiredWidth += counterWidth;

                    if (count > 0) {
                        requiredWidth += TAG_GAP;
                    }
                }

                if (requiredWidth <= availableWidth) {
                    nextVisibleCount = count;

                    break;
                }
            }

            setVisibleTagCount(nextVisibleCount);
        }

        calculateVisibleTags();

        const resizeObserver = new ResizeObserver(
            calculateVisibleTags,
        );

        resizeObserver.observe(selectedArea);

        return () => {
            resizeObserver.disconnect();
        };
    }, [selectedTags]);

    const visibleSelectedTags = selectedTags.slice(
        0,
        visibleTagCount,
    );

    const hiddenTagsCount = Math.max(
        0,
        selectedTags.length - visibleSelectedTags.length,
    );

    function handleOpenChange(nextOpen) {
        setOpen(nextOpen);

        if (!nextOpen) {
            setSearch("");
        }
    }

    function handleToggleTag(tag) {
        const tagId = String(tag.id);
        const isSelected = selectedIds.has(tagId);

        if (isSelected) {
            onChange?.(
                normalizedValue.filter(
                    (selectedId) => String(selectedId) !== tagId,
                ),
            );

            return;
        }

        onChange?.([
            ...normalizedValue,
            tag.id,
        ]);
    }

    function handleManageTags() {
        setOpen(false);
        setSearch("");
        onManageTags?.();
    }

    return (
        <div
            className={cn(
                "relative w-full min-w-0",
                className,
            )}
        >
            <div
                className="
                    mb-2
                    flex items-center
                    justify-between gap-3
                "
            >
                <span className="text-sm font-semibold text-foreground">
                    Tags
                </span>

                {onManageTags && (
                    <button
                        type="button"
                        onClick={handleManageTags}
                        disabled={disabled}
                        className="
                            shrink-0
                            text-xs font-semibold
                            text-primary
                            outline-none
                            transition-colors
                            hover:text-primary-hover
                            hover:underline
                            focus-visible:rounded-sm
                            focus-visible:ring-2
                            focus-visible:ring-primary/30
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        Gerenciar
                    </button>
                )}
            </div>

            <div
                ref={measureAreaRef}
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-[-9999px] top-0
                    flex items-center gap-2
                    opacity-0
                "
            >
                {selectedTags.map((tag) => (
                    <span
                        key={tag.id}
                        data-tag-measure
                        className="shrink-0"
                    >
                        <TagPill
                            tag={tag}
                            className="
                                max-w-28
                                sm:max-w-36
                            "
                        />
                    </span>
                ))}

                <span
                    data-counter-measure
                    className="
                        inline-flex h-7
                        min-w-7 shrink-0
                        items-center justify-center
                        whitespace-nowrap
                        px-1.5
                        text-xs font-semibold
                        leading-none
                    "
                >
                    +{selectedTags.length}
                </span>
            </div>

            <Popover
                open={open}
                onOpenChange={handleOpenChange}
            >
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        aria-invalid={Boolean(error)}
                        className={cn(
                            `
                                flex h-11 w-full
                                min-w-0
                                items-center gap-2
                                rounded-control
                                border
                                bg-surface
                                px-3
                                text-left
                                shadow-xs
                                outline-none
                                transition-colors
                                disabled:pointer-events-none
                                disabled:opacity-50
                            `,
                            error
                                ? `
                                    border-danger
                                    focus-visible:ring-4
                                    focus-visible:ring-danger/10
                                `
                                : `
                                    border-border
                                    hover:border-primary/40
                                    focus-visible:border-primary
                                    focus-visible:ring-4
                                    focus-visible:ring-primary/10
                                `,
                        )}
                    >
                        <div
                            ref={selectedAreaRef}
                            className="
                                flex min-w-0
                                flex-1
                                items-center gap-2
                                overflow-hidden
                            "
                        >
                            {selectedTags.length === 0 ? (
                                <span
                                    className="
                                        min-w-0 flex-1
                                        truncate
                                        text-sm
                                        text-subtle-foreground
                                    "
                                >
                                    Selecione uma ou mais tags
                                </span>
                            ) : (
                                <>
                                    {visibleSelectedTags.map((tag) => (
                                        <TagPill
                                            key={tag.id}
                                            tag={tag}
                                            className="
                                                max-w-28
                                                shrink-0
                                                sm:max-w-36
                                            "
                                        />
                                    ))}

                                    {hiddenTagsCount > 0 && (
                                        <span
                                            aria-label={
                                                `${hiddenTagsCount} tags adicionais`
                                            }
                                            title={
                                                `${hiddenTagsCount} tags adicionais`
                                            }
                                            className="
                                                inline-flex h-7
                                                min-w-7 shrink-0
                                                items-center justify-center
                                                whitespace-nowrap
                                                rounded-md
                                                px-1.5
                                                text-xs font-semibold
                                                leading-none
                                                text-subtle-foreground
                                            "
                                        >
                                            +{hiddenTagsCount}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <ChevronsUpDown
                            aria-hidden="true"
                            className="
                                ml-auto size-4
                                shrink-0
                                text-subtle-foreground
                            "
                            strokeWidth={1.8}
                        />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={6}
                    collisionPadding={16}
                    onWheelCapture={(event) => {
                        event.stopPropagation();
                    }}
                    className="
                        w-[var(--radix-popover-trigger-width)]
                        min-w-[var(--radix-popover-trigger-width)]
                        overflow-hidden
                        p-0
                    "
                    style={{
                        maxHeight: "min(380px, var(--radix-popover-content-available-height))",
                    }}
                >
                    <div
                        className="
                            shrink-0
                            border-b border-border
                            p-2
                        "
                    >
                        <div
                            className="
                                flex h-10
                                items-center gap-2
                                rounded-control-sm
                                border border-border
                                bg-surface
                                px-3
                                transition-colors
                                focus-within:border-primary
                                focus-within:ring-4
                                focus-within:ring-primary/10
                            "
                        >
                            <Search
                                aria-hidden="true"
                                className="
                                    size-4 shrink-0
                                    text-subtle-foreground
                                "
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                                placeholder="Pesquisar tags"
                                className="
                                    h-full min-w-0
                                    flex-1
                                    bg-transparent
                                    text-sm
                                    text-foreground
                                    outline-none
                                    placeholder:text-subtle-foreground
                                    [&::-webkit-search-cancel-button]:hidden
                                "
                            />
                        </div>
                    </div>

                    <div
                        role="listbox"
                        aria-label="Tags disponíveis"
                        aria-multiselectable="true"
                        className="
                            flex flex-col
                            gap-1
                            overflow-y-auto
                            overscroll-contain
                            touch-pan-y
                            p-2
                            [scrollbar-width:none]
                            [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:hidden
                        "
                        style={{
                            maxHeight: "min(300px, calc(var(--radix-popover-content-available-height) - 64px))",
                        }}
                    >
                        {filteredTags.length === 0 ? (
                            <div
                                className="
                                    flex flex-col
                                    items-center justify-center
                                    px-4 py-8
                                    text-center
                                "
                            >
                                <span
                                    className="
                                        flex size-9
                                        items-center justify-center
                                        rounded-control
                                        bg-surface-muted
                                        text-subtle-foreground
                                    "
                                >
                                    <Tags
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </span>

                                <p className="mt-3 text-sm font-semibold text-foreground">
                                    Nenhuma tag encontrada
                                </p>

                                <p className="mt-1 text-xs text-subtle-foreground">
                                    Tente pesquisar usando outro nome.
                                </p>
                            </div>
                        ) : (
                            filteredTags.map((tag) => {
                                const selected = selectedIds.has(
                                    String(tag.id),
                                );

                                return (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onClick={() => {
                                            handleToggleTag(tag);
                                        }}
                                        className={cn(
                                            `
                                                flex min-h-11 w-full
                                                min-w-0
                                                items-center gap-3
                                                rounded-control-sm
                                                px-3 py-2
                                                text-left
                                                outline-none
                                                transition-colors
                                                hover:bg-surface-hover
                                                focus-visible:ring-2
                                                focus-visible:ring-primary/20
                                            `,
                                            selected
                                            && "bg-primary-soft/65",
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                `
                                                    inline-flex size-5
                                                    shrink-0
                                                    items-center justify-center
                                                    rounded-full
                                                    border
                                                    transition-colors
                                                `,
                                                selected
                                                    ? `
                                                        border-primary
                                                        bg-primary
                                                    `
                                                    : `
                                                        border-border-strong
                                                        bg-surface
                                                    `,
                                            )}
                                        >
                                            {selected && (
                                                <span
                                                    className="
                                                        size-2
                                                        rounded-full
                                                        bg-primary-foreground
                                                    "
                                                />
                                            )}
                                        </span>

                                        <TagPill
                                            tag={tag}
                                            className="
                                                max-w-[calc(100%-2rem)]
                                            "
                                        />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="mt-1.5 text-xs text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

export default TagMultiSelect;