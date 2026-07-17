import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    RiAddLine,
    RiCheckLine,
    RiCloseLine,
    RiErrorWarningLine,
    RiLoader4Line,
    RiPriceTag3Line,
    RiRefreshLine,
    RiSearchLine,
} from "react-icons/ri";

import {
    tagService,
} from "../../services/tagService.js";

const DEFAULT_TAG_COLOR =
    "#64748B";

const TAG_COLOR_OPTIONS = [
    "#64748B",
    "#2563EB",
    "#0EA5E9",
    "#14B8A6",
    "#10B981",
    "#84CC16",
    "#F59E0B",
    "#F97316",
    "#EF4444",
    "#EC4899",
    "#8B5CF6",
    "#A855F7",
];

function normalizeTransactionType(
    value,
) {
    return value === "EXPENSE"
        ? "EXPENSE"
        : "INCOME";
}

function normalizeTagId(value) {
    const tagId = Number(value);

    return Number.isInteger(tagId) &&
        tagId > 0
        ? tagId
        : null;
}

function normalizeSearchText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            "",
        )
        .trim()
        .toLowerCase();
}

function getErrorMessage(
    error,
    fallbackMessage,
) {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData?.error ===
        "string"
    ) {
        return responseData.error;
    }

    if (
        typeof responseData?.message ===
        "string"
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message ===
        "string" &&
        error.message
    ) {
        return error.message;
    }

    return fallbackMessage;
}

function sortTags(
    firstTag,
    secondTag,
) {
    return firstTag.name.localeCompare(
        secondTag.name,
        "pt-BR",
    );
}

function TagSelector({
    type = "INCOME",
    value = [],
    selectedTags = [],
    onChange,
    onTagCreated,
    onError,
    disabled = false,
    allowCreate = true,
    maxSelected = 10,
    label = "Tags",
    helperText = "Selecione uma ou mais tags para organizar esta movimentação.",
}) {
    const generatedId = useId();

    const loadRequestReference =
        useRef(0);

    const normalizedType =
        normalizeTransactionType(type);

    const [tags, setTags] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        feedback,
        setFeedback,
    ] = useState("");

    const [
        createPanelOpen,
        setCreatePanelOpen,
    ] = useState(false);

    const [
        creating,
        setCreating,
    ] = useState(false);

    const [
        newTagData,
        setNewTagData,
    ] = useState({
        name: "",
        color:
            DEFAULT_TAG_COLOR,
        scope:
            normalizedType,
    });

    const selectedTagIds =
        useMemo(() => {
            if (!Array.isArray(value)) {
                return [];
            }

            return [
                ...new Set(
                    value
                        .map(
                            normalizeTagId,
                        )
                        .filter(Boolean),
                ),
            ];
        }, [value]);

    const selectedTagIdSet =
        useMemo(
            () =>
                new Set(
                    selectedTagIds,
                ),
            [selectedTagIds],
        );

    const scopeOptions =
        useMemo(
            () => [
                {
                    value:
                        normalizedType,
                    label:
                        normalizedType ===
                            "INCOME"
                            ? "Somente receitas"
                            : "Somente despesas",
                },
                {
                    value: "BOTH",
                    label:
                        "Receitas e despesas",
                },
            ],
            [normalizedType],
        );

    /*
     * selectedTags é utilizado durante
     * a edição de uma movimentação.
     *
     * Isso permite mostrar uma tag antiga
     * mesmo que ela tenha sido desativada
     * depois de ser vinculada.
     */
    const availableTags =
        useMemo(() => {
            const tagsById =
                new Map();

            for (const tag of tags) {
                const tagId =
                    normalizeTagId(
                        tag?.id,
                    );

                if (tagId) {
                    tagsById.set(
                        tagId,
                        tag,
                    );
                }
            }

            if (
                Array.isArray(
                    selectedTags,
                )
            ) {
                for (
                    const tag of
                    selectedTags
                ) {
                    const tagId =
                        normalizeTagId(
                            tag?.id,
                        );

                    if (
                        tagId &&
                        selectedTagIdSet.has(
                            tagId,
                        ) &&
                        !tagsById.has(
                            tagId,
                        )
                    ) {
                        tagsById.set(
                            tagId,
                            tag,
                        );
                    }
                }
            }

            return Array.from(
                tagsById.values(),
            ).sort(
                (
                    firstTag,
                    secondTag,
                ) => {
                    const firstSelected =
                        selectedTagIdSet.has(
                            firstTag.id,
                        );

                    const secondSelected =
                        selectedTagIdSet.has(
                            secondTag.id,
                        );

                    if (
                        firstSelected !==
                        secondSelected
                    ) {
                        return firstSelected
                            ? -1
                            : 1;
                    }

                    return sortTags(
                        firstTag,
                        secondTag,
                    );
                },
            );
        }, [
            tags,
            selectedTags,
            selectedTagIdSet,
        ]);

    const selectedTagObjects =
        useMemo(
            () =>
                availableTags.filter(
                    (tag) =>
                        selectedTagIdSet.has(
                            tag.id,
                        ),
                ),
            [
                availableTags,
                selectedTagIdSet,
            ],
        );

    const filteredTags =
        useMemo(() => {
            const normalizedSearch =
                normalizeSearchText(
                    search,
                );

            if (!normalizedSearch) {
                return availableTags;
            }

            return availableTags.filter(
                (tag) => {
                    const name =
                        normalizeSearchText(
                            tag.name,
                        );

                    const normalizedName =
                        normalizeSearchText(
                            tag.normalizedName,
                        );

                    return (
                        name.includes(
                            normalizedSearch,
                        ) ||
                        normalizedName.includes(
                            normalizedSearch,
                        )
                    );
                },
            );
        }, [
            availableTags,
            search,
        ]);

    const loadTags =
        useCallback(async () => {
            const requestId =
                loadRequestReference
                    .current + 1;

            loadRequestReference.current =
                requestId;

            setLoading(true);
            setLoadError("");

            try {
                const response =
                    await tagService
                        .listForTransactionType(
                            normalizedType,
                            {
                                isActive:
                                    true,
                            },
                        );

                if (
                    loadRequestReference
                        .current !==
                    requestId
                ) {
                    return;
                }

                setTags(
                    Array.isArray(
                        response?.tags,
                    )
                        ? response.tags
                        : [],
                );
            } catch (error) {
                if (
                    loadRequestReference
                        .current !==
                    requestId
                ) {
                    return;
                }

                const message =
                    getErrorMessage(
                        error,
                        "Não foi possível carregar as tags.",
                    );

                setLoadError(message);

                onError?.(message);
            } finally {
                if (
                    loadRequestReference
                        .current ===
                    requestId
                ) {
                    setLoading(false);
                }
            }
        }, [
            normalizedType,
            onError,
        ]);

    useEffect(() => {
        setNewTagData(
            (currentData) => ({
                ...currentData,
                scope:
                    normalizedType,
            }),
        );

        loadTags();

        return () => {
            loadRequestReference
                .current += 1;
        };
    }, [
        normalizedType,
        loadTags,
    ]);

    function emitChange(
        nextTagIds,
    ) {
        onChange?.(
            nextTagIds,
        );
    }

    function handleToggleTag(tag) {
        if (disabled) {
            return;
        }

        const tagId =
            normalizeTagId(
                tag?.id,
            );

        if (!tagId) {
            return;
        }

        setFeedback("");

        if (
            selectedTagIdSet.has(
                tagId,
            )
        ) {
            emitChange(
                selectedTagIds.filter(
                    (selectedId) =>
                        selectedId !==
                        tagId,
                ),
            );

            return;
        }

        if (
            selectedTagIds.length >=
            maxSelected
        ) {
            setFeedback(
                `Selecione no máximo ${maxSelected} tags.`,
            );

            return;
        }

        if (
            tag.isActive === false
        ) {
            setFeedback(
                "Essa tag está desativada e não pode ser selecionada novamente.",
            );

            return;
        }

        emitChange([
            ...selectedTagIds,
            tagId,
        ]);
    }

    function handleRemoveSelectedTag(
        tagId,
    ) {
        if (disabled) {
            return;
        }

        emitChange(
            selectedTagIds.filter(
                (selectedId) =>
                    selectedId !==
                    tagId,
            ),
        );
    }

    function handleNewTagChange(
        event,
    ) {
        const {
            name,
            value: fieldValue,
        } = event.target;

        setNewTagData(
            (currentData) => ({
                ...currentData,
                [name]:
                    fieldValue,
            }),
        );

        setFeedback("");
    }

    async function handleCreateTag() {
        if (
            disabled ||
            creating
        ) {
            return;
        }

        const name =
            newTagData.name
                .trim()
                .replace(
                    /\s+/g,
                    " ",
                );

        if (name.length < 2) {
            setFeedback(
                "O nome da tag deve possuir pelo menos 2 caracteres.",
            );

            return;
        }

        if (name.length > 40) {
            setFeedback(
                "O nome da tag deve possuir no máximo 40 caracteres.",
            );

            return;
        }

        if (
            !/^#[0-9A-Fa-f]{6}$/.test(
                newTagData.color,
            )
        ) {
            setFeedback(
                "Selecione uma cor válida para a tag.",
            );

            return;
        }

        setCreating(true);
        setFeedback("");

        try {
            const response =
                await tagService.create({
                    name,
                    color:
                        newTagData.color,
                    scope:
                        newTagData.scope,
                });

            const createdTag =
                response?.tag;

            if (!createdTag?.id) {
                throw new Error(
                    "A resposta de criação da tag é inválida.",
                );
            }

            setTags(
                (currentTags) =>
                    [
                        ...currentTags.filter(
                            (tag) =>
                                tag.id !==
                                createdTag.id,
                        ),
                        createdTag,
                    ].sort(sortTags),
            );

            if (
                selectedTagIds.length <
                maxSelected
            ) {
                emitChange([
                    ...selectedTagIds,
                    createdTag.id,
                ]);
            } else {
                setFeedback(
                    `A tag foi criada, mas não foi selecionada porque o limite é de ${maxSelected} tags.`,
                );
            }

            setNewTagData({
                name: "",
                color:
                    DEFAULT_TAG_COLOR,
                scope:
                    normalizedType,
            });

            setSearch("");
            setCreatePanelOpen(false);

            onTagCreated?.(
                createdTag,
            );
        } catch (error) {
            const message =
                getErrorMessage(
                    error,
                    "Não foi possível cadastrar a tag.",
                );

            setFeedback(message);

            onError?.(message);
        } finally {
            setCreating(false);
        }
    }

    function handleNewTagKeyDown(
        event,
    ) {
        if (
            event.key !==
            "Enter"
        ) {
            return;
        }

        /*
         * O componente será usado dentro
         * do formulário de movimentação.
         *
         * Impedimos que Enter envie o
         * formulário principal.
         */
        event.preventDefault();

        handleCreateTag();
    }

    return (
        <section
            aria-labelledby={`${generatedId}-label`}
            className="min-w-0"
        >
            <div
                className="
                    mb-2
                    flex min-w-0
                    items-start
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <div
                        className="
                            flex items-center
                            gap-2
                        "
                    >
                        <RiPriceTag3Line
                            size={16}
                            aria-hidden="true"
                            className="text-muted-foreground"
                        />

                        <p
                            id={`${generatedId}-label`}
                            className="
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            {label}
                        </p>
                    </div>

                    {helperText && (
                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            {helperText}
                        </p>
                    )}
                </div>

                <span
                    className="
                        shrink-0
                        rounded-full
                        border border-border
                        bg-surface-muted
                        px-2.5 py-1
                        text-[11px]
                        font-semibold
                        text-muted-foreground
                    "
                >
                    {selectedTagIds.length}/
                    {maxSelected}
                </span>
            </div>

            {selectedTagObjects.length >
                0 && (
                    <div
                        className="
                        mb-3
                        flex flex-wrap
                        gap-2
                    "
                        aria-label="Tags selecionadas"
                    >
                        {selectedTagObjects.map(
                            (tag) => (
                                <span
                                    key={
                                        tag.id
                                    }
                                    className="
                                    inline-flex
                                    min-w-0
                                    items-center
                                    gap-2
                                    rounded-full
                                    border border-border
                                    bg-surface
                                    py-1.5
                                    pl-2.5
                                    pr-1.5
                                    text-xs
                                    font-semibold
                                    text-foreground
                                    shadow-sm
                                "
                                >
                                    <span
                                        aria-hidden="true"
                                        className="
                                        size-2
                                        shrink-0
                                        rounded-full
                                    "
                                        style={{
                                            backgroundColor:
                                                tag.color,
                                        }}
                                    />

                                    <span className="max-w-40 truncate">
                                        {
                                            tag.name
                                        }
                                    </span>

                                    {tag.isActive ===
                                        false && (
                                            <span
                                                className="
                                            text-[10px]
                                            font-medium
                                            text-muted-foreground
                                        "
                                            >
                                                Inativa
                                            </span>
                                        )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveSelectedTag(
                                                tag.id,
                                            )
                                        }
                                        disabled={
                                            disabled
                                        }
                                        aria-label={`Remover tag ${tag.name}`}
                                        title={`Remover ${tag.name}`}
                                        className="
                                        inline-flex
                                        size-6
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-muted-foreground
                                        transition
                                        hover:bg-surface-hover
                                        hover:text-foreground
                                        focus-visible:ring-2
                                        focus-visible:ring-ring/20
                                        disabled:pointer-events-none
                                    "
                                    >
                                        <RiCloseLine
                                            size={15}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </span>
                            ),
                        )}
                    </div>
                )}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-border
                    bg-background
                "
            >
                <div
                    className="
                        flex min-w-0
                        items-center
                        gap-2
                        border-b border-border
                        px-3
                    "
                >
                    <RiSearchLine
                        size={17}
                        aria-hidden="true"
                        className="
                            shrink-0
                            text-muted-foreground
                        "
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value,
                            )
                        }
                        disabled={
                            disabled ||
                            loading
                        }
                        aria-label="Pesquisar tags"
                        placeholder="Pesquisar tags..."
                        className="
                            h-11
                            flex-1
                            border-0
                            bg-transparent
                            px-1
                            text-sm
                            font-medium
                            text-foreground
                            outline-none
                            placeholder:font-normal
                            placeholder:text-muted-foreground/70
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            disabled={
                                disabled
                            }
                            aria-label="Limpar pesquisa"
                            title="Limpar pesquisa"
                            className="
                                inline-flex
                                size-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-muted-foreground
                                transition
                                hover:bg-surface-hover
                                hover:text-foreground
                            "
                        >
                            <RiCloseLine
                                size={16}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>

                <div
                    className="
                        max-h-48
                        overflow-y-auto
                        p-2.5
                    "
                >
                    {loading && (
                        <div
                            className="
                                flex min-h-24
                                items-center
                                justify-center
                                gap-2
                                text-sm
                                text-muted-foreground
                            "
                        >
                            <RiLoader4Line
                                size={18}
                                aria-hidden="true"
                                className="animate-spin"
                            />

                            Carregando tags...
                        </div>
                    )}

                    {!loading &&
                        loadError && (
                            <div
                                role="alert"
                                className="
                                flex min-h-24
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                px-4
                                text-center
                            "
                            >
                                <div
                                    className="
                                    flex items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-danger
                                "
                                >
                                    <RiErrorWarningLine
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {
                                            loadError
                                        }
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        loadTags
                                    }
                                    disabled={
                                        disabled
                                    }
                                    className="
                                    inline-flex
                                    min-h-9
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border border-border
                                    bg-surface
                                    px-3
                                    text-xs
                                    font-semibold
                                    text-foreground
                                    transition
                                    hover:bg-surface-hover
                                "
                                >
                                    <RiRefreshLine
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Tentar novamente
                                </button>
                            </div>
                        )}

                    {!loading &&
                        !loadError &&
                        filteredTags.length ===
                        0 && (
                            <div
                                className="
                                flex min-h-24
                                flex-col
                                items-center
                                justify-center
                                px-4
                                text-center
                            "
                            >
                                <RiPriceTag3Line
                                    size={22}
                                    aria-hidden="true"
                                    className="
                                    mb-2
                                    text-muted-foreground/60
                                "
                                />

                                <p
                                    className="
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                                >
                                    Nenhuma tag encontrada
                                </p>

                                <p
                                    className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                                >
                                    Tente outra pesquisa ou crie uma nova tag.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !loadError &&
                        filteredTags.length >
                        0 && (
                            <div
                                className="
                                flex flex-wrap
                                gap-2
                            "
                            >
                                {filteredTags.map(
                                    (tag) => {
                                        const selected =
                                            selectedTagIdSet.has(
                                                tag.id,
                                            );

                                        const selectionLimitReached =
                                            !selected &&
                                            selectedTagIds.length >=
                                            maxSelected;

                                        const unavailable =
                                            !selected &&
                                            tag.isActive ===
                                            false;

                                        return (
                                            <button
                                                key={
                                                    tag.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleToggleTag(
                                                        tag,
                                                    )
                                                }
                                                disabled={
                                                    disabled ||
                                                    selectionLimitReached ||
                                                    unavailable
                                                }
                                                aria-pressed={
                                                    selected
                                                }
                                                className={`
                                                inline-flex
                                                min-h-9
                                                max-w-full
                                                items-center
                                                gap-2
                                                rounded-xl
                                                border
                                                px-3
                                                text-xs
                                                font-semibold
                                                outline-none
                                                transition-all
                                                focus-visible:ring-2
                                                focus-visible:ring-ring/20
                                                disabled:pointer-events-none

                                                ${selected
                                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                                        : "border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-hover"
                                                    }
                                            `}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="
                                                    size-2
                                                    shrink-0
                                                    rounded-full
                                                    ring-2
                                                    ring-white/40
                                                "
                                                    style={{
                                                        backgroundColor:
                                                            tag.color,
                                                    }}
                                                />

                                                <span className="truncate">
                                                    {
                                                        tag.name
                                                    }
                                                </span>

                                                {selected && (
                                                    <RiCheckLine
                                                        size={15}
                                                        aria-hidden="true"
                                                        className="shrink-0"
                                                    />
                                                )}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        )}
                </div>

                {allowCreate && (
                    <div
                        className="
                            border-t border-border
                            bg-surface-muted/40
                            p-2.5
                        "
                    >
                        {!createPanelOpen ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCreatePanelOpen(
                                        true,
                                    );

                                    setFeedback(
                                        "",
                                    );
                                }}
                                disabled={
                                    disabled
                                }
                                className="
                                    inline-flex
                                    min-h-9
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    text-xs
                                    font-semibold
                                    text-foreground
                                    transition
                                    hover:bg-surface-hover
                                "
                            >
                                <RiAddLine
                                    size={17}
                                    aria-hidden="true"
                                />

                                Criar nova tag
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div
                                    className="
                                        flex items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            Nova tag
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                text-muted-foreground
                                            "
                                        >
                                            Ela ficará salva para os próximos cadastros.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCreatePanelOpen(
                                                false,
                                            );

                                            setFeedback(
                                                "",
                                            );
                                        }}
                                        disabled={
                                            creating
                                        }
                                        aria-label="Fechar criação de tag"
                                        title="Fechar"
                                        className="
                                            inline-flex
                                            size-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            text-muted-foreground
                                            transition
                                            hover:bg-surface-hover
                                            hover:text-foreground
                                        "
                                    >
                                        <RiCloseLine
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                <div
                                    className="
                                        grid gap-3
                                        sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.55fr)]
                                    "
                                >
                                    <div>
                                        <label
                                            htmlFor={`${generatedId}-new-tag-name`}
                                            className="
                                                mb-1.5
                                                block
                                                text-xs
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            Nome
                                        </label>

                                        <input
                                            id={`${generatedId}-new-tag-name`}
                                            name="name"
                                            type="text"
                                            value={
                                                newTagData.name
                                            }
                                            onChange={
                                                handleNewTagChange
                                            }
                                            onKeyDown={
                                                handleNewTagKeyDown
                                            }
                                            disabled={
                                                disabled ||
                                                creating
                                            }
                                            maxLength={
                                                40
                                            }
                                            placeholder="Ex.: Pets"
                                            className="
                                                h-10
                                                w-full
                                                rounded-xl
                                                border border-border
                                                bg-background
                                                px-3
                                                text-sm
                                                font-medium
                                                text-foreground
                                                outline-none
                                                transition
                                                placeholder:font-normal
                                                placeholder:text-muted-foreground/70
                                                hover:border-border-strong
                                                focus:border-primary/50
                                                focus:ring-4
                                                focus:ring-primary/10
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`${generatedId}-new-tag-scope`}
                                            className="
                                                mb-1.5
                                                block
                                                text-xs
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            Disponível em
                                        </label>

                                        <select
                                            id={`${generatedId}-new-tag-scope`}
                                            name="scope"
                                            value={
                                                newTagData.scope
                                            }
                                            onChange={
                                                handleNewTagChange
                                            }
                                            disabled={
                                                disabled ||
                                                creating
                                            }
                                            className="
                                                h-10
                                                w-full
                                                rounded-xl
                                                border border-border
                                                bg-background
                                                px-3
                                                text-sm
                                                font-medium
                                                text-foreground
                                                outline-none
                                                transition
                                                hover:border-border-strong
                                                focus:border-primary/50
                                                focus:ring-4
                                                focus:ring-primary/10
                                            "
                                        >
                                            {scopeOptions.map(
                                                (
                                                    option,
                                                ) => (
                                                    <option
                                                        key={
                                                            option.value
                                                        }
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <p
                                        className="
                                            mb-2
                                            text-xs
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        Cor
                                    </p>

                                    <div
                                        className="
                                            flex flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >
                                        {TAG_COLOR_OPTIONS.map(
                                            (
                                                color,
                                            ) => {
                                                const selected =
                                                    newTagData.color.toUpperCase() ===
                                                    color;

                                                return (
                                                    <button
                                                        key={
                                                            color
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setNewTagData(
                                                                (
                                                                    currentData,
                                                                ) => ({
                                                                    ...currentData,
                                                                    color,
                                                                }),
                                                            )
                                                        }
                                                        disabled={
                                                            disabled ||
                                                            creating
                                                        }
                                                        aria-label={`Selecionar cor ${color}`}
                                                        aria-pressed={
                                                            selected
                                                        }
                                                        className={`
                                                            inline-flex
                                                            size-7
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border-2
                                                            transition
                                                            focus-visible:ring-2
                                                            focus-visible:ring-ring/20

                                                            ${selected
                                                                ? "border-foreground"
                                                                : "border-transparent hover:border-border-strong"
                                                            }
                                                        `}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="
                                                                size-4
                                                                rounded-full
                                                            "
                                                            style={{
                                                                backgroundColor:
                                                                    color,
                                                            }}
                                                        />

                                                        {selected && (
                                                            <span className="sr-only">
                                                                Selecionada
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            },
                                        )}

                                        <label
                                            className="
                                                ml-1
                                                inline-flex
                                                h-8
                                                items-center
                                                gap-2
                                                rounded-xl
                                                border border-border
                                                bg-background
                                                px-2.5
                                                text-[11px]
                                                font-semibold
                                                text-muted-foreground
                                                transition
                                                hover:border-border-strong
                                            "
                                        >
                                            Personalizada

                                            <input
                                                name="color"
                                                type="color"
                                                value={
                                                    newTagData.color
                                                }
                                                onChange={
                                                    handleNewTagChange
                                                }
                                                disabled={
                                                    disabled ||
                                                    creating
                                                }
                                                aria-label="Escolher cor personalizada"
                                                className="
                                                    size-5
                                                    cursor-pointer
                                                    border-0
                                                    bg-transparent
                                                    p-0
                                                "
                                            />
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateTag
                                    }
                                    disabled={
                                        disabled ||
                                        creating
                                    }
                                    className="
                                        inline-flex
                                        min-h-10
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-primary
                                        px-4
                                        text-xs
                                        font-semibold
                                        text-primary-foreground
                                        transition
                                        hover:bg-primary-hover
                                        focus-visible:ring-4
                                        focus-visible:ring-primary/20
                                        disabled:pointer-events-none
                                    "
                                >
                                    {creating ? (
                                        <RiLoader4Line
                                            size={17}
                                            aria-hidden="true"
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <RiAddLine
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {creating
                                        ? "Salvando tag..."
                                        : "Salvar e selecionar"
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {feedback && (
                <p
                    role="alert"
                    className="
                        mt-2
                        flex items-start
                        gap-2
                        text-xs
                        font-medium
                        leading-5
                        text-danger
                    "
                >
                    <RiErrorWarningLine
                        size={15}
                        aria-hidden="true"
                        className="
                            mt-0.5
                            shrink-0
                        "
                    />

                    <span>
                        {feedback}
                    </span>
                </p>
            )}
        </section>
    );
}

export default TagSelector;