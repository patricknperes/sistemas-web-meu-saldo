import {
    Filter,
    RotateCcw,
    Search,
    X,
} from "lucide-react";

import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
    getHistoryPeriodLabel,
    getHistoryTypeLabel,
} from "../utils/historyFormatters.js";

function HistoryToolbar({
    filters,
    tags = [],
    onSearchChange,
    onOpenFilters,
    onReset,
}) {
    const selectedTag = tags.find(
        (tag) => Number(tag.id) === Number(filters.tagId),
    );

    const hasAdvancedFilters = filters.mode !== "YEAR"
        || filters.type !== "ALL"
        || Boolean(filters.tagId);

    const hasAppliedFilters = hasAdvancedFilters
        || Boolean(filters.search);

    return (
        <Card
            className="
                min-w-0
                overflow-hidden
                p-3
                sm:p-4
            "
        >
            <div
                className="
                    flex min-w-0
                    flex-col gap-3
                    lg:flex-row
                    lg:items-center
                "
            >
                <div
                    className="
                        min-w-0 flex-1
                        [&_input]:h-11
                        [&_input]:min-h-11
                        [&_input]:w-full
                        [&_svg]:text-primary
                    "
                >
                    <Input
                        value={filters.search}
                        onChange={(event) => {
                            onSearchChange(event.target.value);
                        }}
                        leadingIcon={Search}
                        placeholder="Pesquisar no histórico"
                        aria-label="Pesquisar no histórico"
                        className="w-full min-w-0"
                        inputClassName="
                            h-11
                            min-h-11
                            w-full
                            text-sm
                        "
                        trailingElement={
                            filters.search ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSearchChange("");
                                    }}
                                    aria-label="Limpar pesquisa"
                                    title="Limpar pesquisa"
                                    className="
                                        inline-flex size-8
                                        shrink-0
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
                                    <X
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>
                            ) : null
                        }
                    />
                </div>

                <div
                    className="
                        flex min-w-0
                        items-center gap-2
                        sm:justify-end
                    "
                >
                    <Button
                        type="button"
                        onClick={onOpenFilters}
                        className="
                            h-11 min-h-11
                            min-w-0 flex-1
                            justify-center
                            bg-primary
                            px-4
                            text-primary-foreground
                            shadow-xs
                            hover:bg-primary-hover
                            hover:text-primary-foreground
                            active:bg-primary-active
                            sm:min-w-[140px]
                            sm:flex-none
                        "
                    >
                        <Filter
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />

                        <span className="truncate">
                            Filtrar
                        </span>
                    </Button>

                    {hasAppliedFilters && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onReset}
                            className="
                                h-11 min-h-11
                                min-w-0 flex-1
                                justify-center
                                border border-primary/15
                                bg-surface
                                px-4
                                text-primary
                                shadow-none
                                hover:border-primary/30
                                hover:bg-primary-soft
                                hover:text-primary
                                sm:flex-none
                            "
                        >
                            <RotateCcw
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />

                            <span className="truncate">
                                Limpar
                            </span>
                        </Button>
                    )}
                </div>
            </div>

            <div
                className="
                    mt-3
                    flex min-w-0
                    flex-wrap
                    items-center gap-2
                    border-t border-border
                    pt-3
                "
            >
                <Badge
                    variant="primary"
                    title={getHistoryPeriodLabel(filters)}
                    className="
                        h-7 max-w-full
                        truncate
                        rounded-md
                        px-2.5
                        text-xs font-semibold
                    "
                >
                    {getHistoryPeriodLabel(filters)}
                </Badge>

                <Badge
                    title={getHistoryTypeLabel(filters.type)}
                    className="
                        h-7 max-w-full
                        truncate
                        rounded-md
                        px-2.5
                        text-xs font-semibold
                    "
                >
                    {getHistoryTypeLabel(filters.type)}
                </Badge>

                {selectedTag && (
                    <Badge
                        variant="secondary"
                        title={`Tag: ${selectedTag.name}`}
                        className="
                            h-7 max-w-full
                            truncate
                            rounded-md
                            px-2.5
                            text-xs font-semibold
                        "
                    >
                        Tag: {selectedTag.name}
                    </Badge>
                )}
            </div>
        </Card>
    );
}

export default HistoryToolbar;