import {
    Fragment,
} from "react";

import {
    RiMore2Line,
} from "react-icons/ri";

import IconButton from "../actions/IconButton.jsx";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../feedback/DropdownMenu.jsx";

function DataTableActions({
    actions = [],
    label = "Abrir ações",
    placement = "bottom-end",
    buttonVariant = "ghost",
    buttonSize = "sm",
    className = "",
}) {
    const availableActions = actions.filter(Boolean);

    if (!availableActions.length) {
        return null;
    }

    return (
        <div
            className={className}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
        >
            <DropdownMenu
                placement={placement}
                trigger={
                    <IconButton
                        icon={<RiMore2Line size={18} aria-hidden="true" />}
                        label={label}
                        variant={buttonVariant}
                        size={buttonSize}
                        className="text-muted-foreground opacity-80 transition-opacity hover:opacity-100 group-hover/row:opacity-100"
                    />
                }
            >
                {availableActions.map((action, index) => (
                    <Fragment key={action.id ?? action.label ?? index}>
                        {action.separatorBefore ? <DropdownMenuSeparator /> : null}

                        <DropdownMenuItem
                            icon={action.icon}
                            danger={action.danger}
                            disabled={action.disabled}
                            selected={action.selected}
                            trailing={action.trailing}
                            onSelect={(event) => action.onSelect?.(event)}
                        >
                            {action.label}
                        </DropdownMenuItem>
                    </Fragment>
                ))}
            </DropdownMenu>
        </div>
    );
}

export default DataTableActions;
