import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    AnimatePresence,
    motion,
} from "motion/react";
import {
    Edit3,
    LoaderCircle,
    Palette,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "../../../components/ui/Button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../../../components/ui/Dialog.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select.jsx";
import { cn } from "../../../lib/cn.js";
import { tagService } from "../../../services/tagService.js";
import { transactionKeys } from "../api/transactionQueries.js";
import { tagSchema } from "../schemas/transactionSchemas.js";
import { getApiErrorMessage } from "../utils/transactionFormatters.js";
import TagPill from "./TagPill.jsx";

const EMPTY_TAG = {
    name: "",
    color: "#1E3A8A",
    scope: "BOTH",
};

const PRIMARY_BUTTON_CLASSNAME = `
    bg-primary
    text-primary-foreground
    shadow-xs
    hover:bg-primary-hover
    hover:text-primary-foreground
    active:bg-primary-active
    disabled:bg-primary
`;

const SECONDARY_BUTTON_CLASSNAME = `
    border border-border
    bg-surface
    text-foreground
    shadow-none
    hover:border-primary/30
    hover:bg-primary-soft
    hover:text-primary
    dark:bg-surface-raised
    dark:hover:bg-primary-soft
`;

function getScopeLabel(scope) {
    if (scope === "INCOME") return "Receitas";
    if (scope === "EXPENSE") return "Despesas";

    return "Ambos";
}

function TagManagerDialog({
    open,
    onClose,
    tags = [],
    type,
    onNotify,
}) {
    const queryClient = useQueryClient();

    const [editorOpen, setEditorOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {
            errors,
        },
    } = useForm({
        resolver: zodResolver(tagSchema),
        defaultValues: EMPTY_TAG,
    });

    const selectedColor = watch("color") || EMPTY_TAG.color;
    const selectedScope = watch("scope");
    const selectedName = watch("name");

    const sortedTags = useMemo(
        () => [...tags].sort(
            (first, second) => first.name.localeCompare(
                second.name,
                "pt-BR",
            ),
        ),
        [tags],
    );

    useEffect(() => {
        if (!open || !editorOpen) return;

        if (editingTag) {
            reset({
                name: editingTag.name,
                color: editingTag.color,
                scope: editingTag.scope,
            });

            return;
        }

        reset({
            ...EMPTY_TAG,
            scope: type ?? "BOTH",
        });
    }, [
        editingTag,
        editorOpen,
        open,
        reset,
        type,
    ]);

    const saveMutation = useMutation({
        mutationFn: (payload) => (
            editingTag
                ? tagService.update(editingTag.id, payload)
                : tagService.create(payload)
        ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: transactionKeys.all,
            });

            onNotify?.(
                editingTag
                    ? "Tag atualizada com sucesso."
                    : "Tag criada com sucesso.",
                "success",
            );

            setEditorOpen(false);
            setEditingTag(null);

            reset({
                ...EMPTY_TAG,
                scope: type ?? "BOTH",
            });
        },

        onError: (error) => onNotify?.(
            getApiErrorMessage(
                error,
                "Não foi possível salvar a tag.",
            ),
            "error",
        ),
    });

    const deleteMutation = useMutation({
        mutationFn: (tagId) => tagService.remove(tagId),

        onSuccess: async (result) => {
            await queryClient.invalidateQueries({
                queryKey: transactionKeys.all,
            });

            const message = result?.deletionMode === "DEACTIVATED"
                ? "A tag foi desativada porque já está vinculada ao histórico."
                : "Tag excluída com sucesso.";

            onNotify?.(
                message,
                "success",
            );

            if (editingTag?.id === result?.tag?.id) {
                setEditorOpen(false);
                setEditingTag(null);
            }
        },

        onError: (error) => onNotify?.(
            getApiErrorMessage(
                error,
                "Não foi possível excluir a tag.",
            ),
            "error",
        ),
    });

    function closeEditor() {
        if (saveMutation.isPending) return;

        setEditorOpen(false);
        setEditingTag(null);

        reset({
            ...EMPTY_TAG,
            scope: type ?? "BOTH",
        });
    }

    function closeDialog() {
        if (saveMutation.isPending) return;

        setEditorOpen(false);
        setEditingTag(null);
        onClose?.();
    }

    function handleNewTag() {
        setEditingTag(null);

        reset({
            ...EMPTY_TAG,
            scope: type ?? "BOTH",
        });

        setEditorOpen(true);
    }

    function handleEditTag(tagItem) {
        setEditingTag(tagItem);

        reset({
            name: tagItem.name,
            color: tagItem.color,
            scope: tagItem.scope,
        });

        setEditorOpen(true);
    }

    function submitTag(data) {
        saveMutation.mutate({
            ...data,
            color: data.color.toUpperCase(),
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closeDialog();
            }}
        >
            <DialogContent
                className="
                    w-[calc(100vw-1.5rem)]
                    max-w-2xl
                    overflow-visible
                    border-0
                    bg-transparent
                    p-0
                    shadow-none
                    [&>button]:hidden
                "
            >
                <motion.div
                    layout
                    initial={{
                        opacity: 0,
                        y: 18,
                        scale: 0.985,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.28,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                        layout: {
                            duration: 0.24,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        },
                    }}
                    className={cn(
                        `
                            relative
                            flex min-h-0
                            max-h-[calc(100dvh-1.5rem)]
                            w-full
                            flex-col
                            overflow-hidden
                            rounded-card
                            border border-border
                            bg-surface
                            shadow-dialog
                        `,
                        editorOpen
                        && "min-h-[min(540px,calc(100dvh-1.5rem))]",
                    )}
                >
                    <header
                        className="
        flex w-full shrink-0
        items-start justify-between
        gap-4
        border-b border-border
        px-5 py-4
        sm:px-6
    "
                    >
                        <div className="min-w-0 flex-1">
                            <DialogTitle>
                                Gerenciar tags
                            </DialogTitle>

                            <DialogDescription className="mt-1">
                                Organize as etiquetas usadas nas suas movimentações.
                            </DialogDescription>
                        </div>

                        <button
                            type="button"
                            onClick={closeDialog}
                            aria-label="Fechar gerenciamento de tags"
                            className="
            inline-flex size-9
            shrink-0
            items-center justify-center
            rounded-control-sm
            text-subtle-foreground
            outline-none
            transition-colors
            hover:bg-surface-hover
            hover:text-foreground
            focus-visible:ring-2
            focus-visible:ring-primary/30
        "
                        >
                            <X
                                aria-hidden="true"
                                className="size-4"
                            />
                        </button>
                    </header>

                    <div
                        className="
                            flex shrink-0
                            items-center justify-between
                            gap-3
                            bg-surface-muted/40
                            px-5 py-2.5
                            text-xs
                            text-subtle-foreground
                            sm:px-6
                        "
                    >
                        <span>Tags disponíveis</span>
                        <span>{sortedTags.length} ativas</span>
                    </div>

                    <section
                        aria-label="Tags disponíveis"
                        className="
                            min-h-0
                            max-h-[min(60dvh,520px)]
                            divide-y divide-border
                            overflow-y-auto
                            overscroll-contain
                            [scrollbar-width:none]
                            [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:hidden
                        "
                    >
                        {sortedTags.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-sm font-semibold text-foreground">
                                    Nenhuma tag cadastrada
                                </p>

                                <p className="mt-1 text-xs text-subtle-foreground">
                                    Crie uma tag para organizar suas movimentações.
                                </p>

                                <Button
                                    size="sm"
                                    className={cn(
                                        "mt-4",
                                        PRIMARY_BUTTON_CLASSNAME,
                                    )}
                                    onClick={handleNewTag}
                                >
                                    <Plus
                                        aria-hidden="true"
                                        className="size-4"
                                    />

                                    Criar tag
                                </Button>
                            </div>
                        ) : (
                            sortedTags.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        grid
                                        grid-cols-[minmax(0,1fr)_auto]
                                        items-center
                                        gap-3
                                        px-5 py-3
                                        transition-colors
                                        hover:bg-surface-hover/55
                                        sm:px-6
                                    "
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <TagPill
                                            tag={item}
                                            className="
                                                max-w-[48%]
                                                sm:max-w-48
                                            "
                                        />

                                        <span
                                            className="
                                                min-w-0 flex-1
                                                truncate
                                                text-xs
                                                text-subtle-foreground
                                            "
                                        >
                                            {item.usageCount ?? 0} usos
                                            {" · "}
                                            {getScopeLabel(item.scope)}
                                        </span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditTag(item)}
                                            aria-label={`Editar ${item.name}`}
                                            title={`Editar ${item.name}`}
                                            className="
                                                inline-flex size-9
                                                items-center justify-center
                                                rounded-control-sm
                                                text-subtle-foreground
                                                outline-none
                                                transition-colors
                                                hover:bg-primary-soft
                                                hover:text-primary
                                                focus-visible:ring-2
                                                focus-visible:ring-primary/30
                                            "
                                        >
                                            <Edit3
                                                aria-hidden="true"
                                                className="size-4"
                                                strokeWidth={1.8}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(item.id)}
                                            disabled={deleteMutation.isPending}
                                            aria-label={`Excluir ${item.name}`}
                                            title={`Excluir ${item.name}`}
                                            className="
                                                inline-flex size-9
                                                items-center justify-center
                                                rounded-control-sm
                                                text-subtle-foreground
                                                outline-none
                                                transition-colors
                                                hover:bg-danger-muted
                                                hover:text-danger
                                                focus-visible:ring-2
                                                focus-visible:ring-danger/30
                                                disabled:pointer-events-none
                                                disabled:opacity-50
                                            "
                                        >
                                            <Trash2
                                                aria-hidden="true"
                                                className="size-4"
                                                strokeWidth={1.8}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    <footer
                        className="
        grid shrink-0
        grid-cols-2 gap-2
        border-t border-border
        px-5 py-4
        sm:px-6
        lg:flex
        lg:items-center
        lg:justify-end
    "
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleNewTag}
                            className={cn(
                                "w-full lg:w-auto",
                                SECONDARY_BUTTON_CLASSNAME,
                            )}
                        >
                            <Plus
                                aria-hidden="true"
                                className="size-4"
                            />

                            Nova tag
                        </Button>

                        <Button
                            type="button"
                            onClick={closeDialog}
                            className={cn(
                                "w-full lg:w-auto",
                                PRIMARY_BUTTON_CLASSNAME,
                            )}
                        >
                            Concluir
                        </Button>
                    </footer>

                    <AnimatePresence>
                        {editorOpen && (
                            <>
                                <motion.button
                                    type="button"
                                    aria-label="Fechar editor de tag"
                                    onClick={closeEditor}
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className="
                                        absolute inset-0
                                        z-20
                                        bg-slate-950/20
                                        backdrop-blur-[1px]
                                        dark:bg-black/45
                                    "
                                />

                                <motion.aside
                                    initial={{
                                        x: "100%",
                                        opacity: 0.7,
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        x: "100%",
                                        opacity: 0.7,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [
                                            0.22,
                                            1,
                                            0.36,
                                            1,
                                        ],
                                    }}
                                    aria-label={
                                        editingTag
                                            ? "Editar tag"
                                            : "Criar tag"
                                    }
                                    className="
                                        absolute inset-y-0
                                        right-0 z-30
                                        flex w-full
                                        flex-col
                                        border-l border-border
                                        bg-surface
                                        shadow-2xl
                                        sm:max-w-[390px]
                                    "
                                >
                                    <header
                                        className="
                                            flex shrink-0
                                            items-start justify-between
                                            gap-4
                                            border-b border-border
                                            px-5 py-4
                                        "
                                    >
                                        <div className="min-w-0">
                                            <p className="text-base font-bold text-foreground">
                                                {editingTag
                                                    ? "Editar tag"
                                                    : "Nova tag"}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-subtle-foreground">
                                                Defina o nome, a cor e onde ela estará disponível.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={closeEditor}
                                            disabled={saveMutation.isPending}
                                            aria-label="Fechar editor"
                                            className="
                                                inline-flex size-9
                                                shrink-0
                                                items-center justify-center
                                                rounded-control-sm
                                                text-subtle-foreground
                                                outline-none
                                                transition-colors
                                                hover:bg-surface-hover
                                                hover:text-foreground
                                                focus-visible:ring-2
                                                focus-visible:ring-primary/30
                                                disabled:pointer-events-none
                                                disabled:opacity-50
                                            "
                                        >
                                            <X
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </button>
                                    </header>

                                    <form
                                        onSubmit={handleSubmit(submitTag)}
                                        className="
                                            flex min-h-0
                                            flex-1 flex-col
                                        "
                                    >
                                        <div
                                            className="
                                                min-h-0 flex-1
                                                space-y-5
                                                overflow-y-auto
                                                overscroll-contain
                                                px-5 py-5
                                                [scrollbar-width:none]
                                                [-ms-overflow-style:none]
                                                [&::-webkit-scrollbar]:hidden
                                            "
                                        >
                                            <Input
                                                label="Nome"
                                                placeholder="Ex.: Moradia"
                                                error={errors.name?.message}
                                                {...register("name")}
                                            />

                                            <div>
                                                <span className="mb-2 block text-sm font-semibold text-foreground">
                                                    Cor
                                                </span>

                                                <label
                                                    className="
                                                        relative
                                                        flex min-h-12
                                                        cursor-pointer
                                                        items-center gap-3
                                                        rounded-control
                                                        border border-border
                                                        bg-surface
                                                        px-3
                                                        transition-colors
                                                        hover:border-primary/45
                                                        hover:bg-surface-hover/45
                                                        focus-within:border-primary
                                                        focus-within:ring-4
                                                        focus-within:ring-primary/10
                                                    "
                                                >
                                                    <input
                                                        type="color"
                                                        value={selectedColor}
                                                        onChange={(event) => {
                                                            setValue(
                                                                "color",
                                                                event.target.value.toUpperCase(),
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldValidate: true,
                                                                },
                                                            );
                                                        }}
                                                        aria-label="Selecionar cor da tag"
                                                        className="
                                                            absolute inset-0
                                                            cursor-pointer
                                                            opacity-0
                                                        "
                                                    />

                                                    <span
                                                        aria-hidden="true"
                                                        className="
                                                            size-7
                                                            shrink-0
                                                            rounded-md
                                                            border border-black/10
                                                            shadow-xs
                                                            dark:border-white/15
                                                        "
                                                        style={{
                                                            backgroundColor: selectedColor,
                                                        }}
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            Selecionar cor
                                                        </p>

                                                        <p className="mt-0.5 font-mono text-[11px] text-subtle-foreground">
                                                            {selectedColor.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <Palette
                                                        aria-hidden="true"
                                                        className="size-4 shrink-0 text-primary"
                                                        strokeWidth={1.8}
                                                    />
                                                </label>

                                                {errors.color?.message && (
                                                    <p className="mt-1.5 text-xs text-danger">
                                                        {errors.color.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <span className="mb-2 block text-sm font-semibold text-foreground">
                                                    Disponível em
                                                </span>

                                                <Select
                                                    value={selectedScope}
                                                    onValueChange={(value) => {
                                                        setValue(
                                                            "scope",
                                                            value,
                                                            {
                                                                shouldDirty: true,
                                                                shouldValidate: true,
                                                            },
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="INCOME">
                                                            Somente receitas
                                                        </SelectItem>

                                                        <SelectItem value="EXPENSE">
                                                            Somente despesas
                                                        </SelectItem>

                                                        <SelectItem value="BOTH">
                                                            Receitas e despesas
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {errors.scope?.message && (
                                                    <p className="mt-1.5 text-xs text-danger">
                                                        {errors.scope.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <span className="mb-2 block text-sm font-semibold text-foreground">
                                                    Pré-visualização
                                                </span>

                                                <TagPill
                                                    tag={{
                                                        name: selectedName?.trim()
                                                            || "Nome da tag",
                                                        color: selectedColor,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <footer
                                            className="
                                                grid shrink-0
                                                grid-cols-2 gap-2
                                                border-t border-border
                                                px-5 py-4
                                            "
                                        >
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className={cn(
                                                    "w-full",
                                                    SECONDARY_BUTTON_CLASSNAME,
                                                )}
                                                onClick={closeEditor}
                                                disabled={saveMutation.isPending}
                                            >
                                                Cancelar
                                            </Button>

                                            <Button
                                                type="submit"
                                                className={cn(
                                                    "w-full",
                                                    PRIMARY_BUTTON_CLASSNAME,
                                                )}
                                                disabled={saveMutation.isPending}
                                            >
                                                {saveMutation.isPending && (
                                                    <LoaderCircle
                                                        aria-hidden="true"
                                                        className="size-4 animate-spin"
                                                    />
                                                )}

                                                {editingTag
                                                    ? "Salvar"
                                                    : "Criar tag"}
                                            </Button>
                                        </footer>
                                    </form>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog >
    );
}

export default TagManagerDialog;