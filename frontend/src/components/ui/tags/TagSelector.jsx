import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    RiAddLine,
    RiArrowDownSLine,
    RiCloseLine,
    RiPriceTag3Line,
} from "react-icons/ri";

import Button from "../actions/Button.jsx";
import IconButton from "../actions/IconButton.jsx";
import useMediaQuery from "../date-picker/useMediaQuery.js";
import Drawer from "../feedback/Drawer.jsx";
import Popover from "../feedback/Popover.jsx";
import SearchInput from "../forms/SearchInput.jsx";
import useControllableState from "../forms/useControllableState.js";
import {
    mergeDescribedBy,
    normalizeClassName,
} from "../forms/fieldStyles.js";
import {
    useFormFieldContext,
} from "../forms/FormFieldContext.js";

import TagBadge from "./TagBadge.jsx";
import TagCreateForm from "./TagCreateForm.jsx";
import TagOption from "./TagOption.jsx";
import {
    normalizeTag,
    normalizeTagId,
    normalizeTagSearch,
    sortTagsByName,
} from "./tagUtils.js";

function TagSelector({
    id,
    options = [],
    selectedOptions = [],
    value,
    defaultValue = [],
    onValueChange,
    onChange,
    disabled = false,
    maxSelected = 10,
    searchable = true,
    allowCreate = false,
    onCreate,
    onTagCreated,
    defaultCreateScope = "BOTH",
    placeholder = "Selecionar tags",
    searchPlaceholder = "Pesquisar tags",
    emptyMessage = "Nenhuma tag encontrada.",
    size = "md",
    className = "",
    panelClassName = "",
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
}) {
    const field = useFormFieldContext();
    const generatedId = useId().replace(/:/g, "");
    const resolvedId = id || field?.controlId || `tag-selector-${generatedId}`;
    const listboxId = `${resolvedId}-listbox`;
    const triggerRef = useRef(null);
    const mobile = useMediaQuery("(max-width: 639px)");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [createMode, setCreateMode] = useState(false);
    const [selectionError, setSelectionError] = useState("");
    const [createdTags, setCreatedTags] = useState([]);

    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange: (nextValue) => {
            onValueChange?.(nextValue);
            onChange?.(nextValue);
        },
    });

    const allTags = useMemo(() => {
        const tagMap = new Map();

        [...options, ...selectedOptions, ...createdTags]
            .filter(Boolean)
            .map(normalizeTag)
            .forEach((tag) => {
                if (tag.id) {
                    tagMap.set(tag.id, tag);
                }
            });

        return [...tagMap.values()].sort(sortTagsByName);
    }, [createdTags, options, selectedOptions]);

    const selectedIds = useMemo(() => new Set(
        (Array.isArray(currentValue) ? currentValue : [])
            .map(normalizeTagId)
            .filter(Boolean)
    ), [currentValue]);

    const selectedTags = useMemo(() => allTags.filter(
        (tag) => selectedIds.has(tag.id)
    ), [allTags, selectedIds]);

    const filteredTags = useMemo(() => {
        const normalizedSearch = normalizeTagSearch(search);

        if (!normalizedSearch) {
            return allTags;
        }

        return allTags.filter((tag) => {
            const searchableContent = normalizeTagSearch(
                `${tag.name} ${tag.scope} ${tag.description ?? ""}`
            );

            return searchableContent.includes(normalizedSearch);
        });
    }, [allTags, search]);

    useEffect(() => {
        if (!open) {
            setSearch("");
            setCreateMode(false);
            setSelectionError("");
        }
    }, [open]);

    const invalid = ariaInvalid === true || field?.invalid;
    const describedBy = mergeDescribedBy(ariaDescribedBy, field?.messageId);
    const sizeClassName = {
        sm: "min-h-9 rounded-md px-3 text-caption",
        md: "min-h-10 rounded-lg px-3.5 text-body-sm",
        lg: "min-h-12 rounded-lg px-4 text-body",
    }[size] || "min-h-10 rounded-lg px-3.5 text-body-sm";

    function toggleTag(tag) {
        const tagId = normalizeTagId(tag?.id);

        if (!tagId) {
            return;
        }

        if (selectedIds.has(tagId)) {
            setCurrentValue((current) => (
                Array.isArray(current)
                    ? current.filter((item) => normalizeTagId(item) !== tagId)
                    : []
            ));
            setSelectionError("");
            return;
        }

        if (selectedIds.size >= maxSelected) {
            setSelectionError(`Selecione no máximo ${maxSelected} tags.`);
            return;
        }

        setCurrentValue((current) => [
            ...(Array.isArray(current) ? current : []),
            tag.value ?? tagId,
        ]);
        setSelectionError("");
    }

    function clearSelection() {
        setCurrentValue([]);
        setSelectionError("");
    }

    async function createTag(payload) {
        const result = await onCreate?.(payload);
        const nextTag = normalizeTag(result || {
            ...payload,
            id: `local-${Date.now()}`,
        });

        setCreatedTags((current) => [
            ...current.filter((tag) => tag.id !== nextTag.id),
            nextTag,
        ]);
        onTagCreated?.(nextTag);

        if (!selectedIds.has(nextTag.id) && selectedIds.size < maxSelected) {
            setCurrentValue((current) => [
                ...(Array.isArray(current) ? current : []),
                nextTag.value ?? nextTag.id,
            ]);
        }

        setCreateMode(false);
        setSearch("");

        return nextTag;
    }

    const selectorPanel = (
        <div className={normalizeClassName(`grid gap-4 ${panelClassName}`)}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-foreground">
                        {createMode ? "Criar nova tag" : "Escolha as tags"}
                    </p>

                    <p className="mt-0.5 text-caption text-muted-foreground">
                        {selectedIds.size} de {maxSelected} selecionadas
                    </p>
                </div>

                {createMode ? (
                    <IconButton
                        icon={<RiCloseLine size={18} aria-hidden="true" />}
                        label="Voltar para a lista de tags"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreateMode(false)}
                    />
                ) : null}
            </div>

            {createMode ? (
                <TagCreateForm
                    defaultScope={defaultCreateScope}
                    existingTags={allTags}
                    onSubmit={createTag}
                    onCancel={() => setCreateMode(false)}
                />
            ) : (
                <>
                    {searchable ? (
                        <SearchInput
                            value={search}
                            placeholder={searchPlaceholder}
                            onChange={(event) => setSearch(event.target.value)}
                            onClear={() => setSearch("")}
                        />
                    ) : null}

                    {selectionError ? (
                        <p role="alert" className="rounded-lg bg-danger-muted px-3 py-2 text-caption font-medium text-danger-strong">
                            {selectionError}
                        </p>
                    ) : null}

                    <div
                        id={listboxId}
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label="Tags disponíveis"
                        className="scrollbar-subtle -mx-1 grid max-h-72 gap-1 overflow-y-auto px-1"
                    >
                        {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                                <TagOption
                                    key={tag.id}
                                    tag={tag}
                                    selected={selectedIds.has(tag.id)}
                                    disabled={!tag.active}
                                    onSelect={toggleTag}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center px-4 py-8 text-center">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-surface-muted text-muted-foreground">
                                    <RiPriceTag3Line size={20} aria-hidden="true" />
                                </span>

                                <p className="mt-3 text-body-sm font-semibold text-foreground">
                                    {emptyMessage}
                                </p>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Tente outro termo ou crie uma nova tag.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={selectedIds.size === 0}
                            onClick={clearSelection}
                        >
                            Limpar seleção
                        </Button>

                        <div className="flex gap-2">
                            {allowCreate ? (
                                <Button
                                    variant="soft"
                                    size="sm"
                                    leadingIcon={<RiAddLine size={16} aria-hidden="true" />}
                                    onClick={() => setCreateMode(true)}
                                >
                                    Nova tag
                                </Button>
                            ) : null}

                            {!mobile ? (
                                <Button
                                    size="sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Concluir
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const hiddenCount = Math.max(0, selectedTags.length - 2);
    const trigger = (
        <button
            ref={triggerRef}
            id={resolvedId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            className={normalizeClassName(`
                flex w-full min-w-0 items-center gap-2 border bg-surface text-left shadow-xs
                outline-none transition-[background-color,border-color,box-shadow]
                duration-150 ease-smooth
                hover:border-primary/35
                focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15
                disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-disabled-foreground disabled:shadow-none
                ${invalid ? "border-danger focus-visible:border-danger focus-visible:ring-danger/15" : "border-border-strong"}
                ${sizeClassName}
                ${className}
            `)}
            onClick={() => setOpen(true)}
        >
            <RiPriceTag3Line
                size={17}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground"
            />

            <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {selectedTags.length > 0 ? (
                    <>
                        {selectedTags.slice(0, 2).map((tag) => (
                            <TagBadge
                                key={tag.id}
                                tag={tag}
                                size="sm"
                                maxWidth="8rem"
                            />
                        ))}

                        {hiddenCount > 0 ? (
                            <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-surface-muted px-1.5 text-[0.6875rem] font-semibold text-muted-foreground">
                                +{hiddenCount}
                            </span>
                        ) : null}
                    </>
                ) : (
                    <span className="truncate text-subtle-foreground">
                        {placeholder}
                    </span>
                )}
            </span>

            <RiArrowDownSLine
                size={18}
                aria-hidden="true"
                className={normalizeClassName(`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`)}
            />
        </button>
    );

    if (mobile) {
        return (
            <>
                {trigger}

                <Drawer
                    open={open}
                    onOpenChange={setOpen}
                    title="Selecionar tags"
                    description="Organize a movimentação com até dez identificadores."
                    icon={RiPriceTag3Line}
                    position="bottom"
                    returnFocusRef={triggerRef}
                    footer={
                        !createMode ? (
                            <Button fullWidth onClick={() => setOpen(false)}>
                                Concluir seleção
                            </Button>
                        ) : undefined
                    }
                >
                    {selectorPanel}
                </Drawer>
            </>
        );
    }

    return (
        <div className="w-full [&>span]:w-full">
            <Popover
                open={open}
                onOpenChange={setOpen}
                placement="bottom-start"
                matchTriggerWidth
                className="w-[min(25rem,calc(100vw-1rem))] p-4"
                trigger={trigger}
            >
                {selectorPanel}
            </Popover>
        </div>
    );
}

export default TagSelector;
