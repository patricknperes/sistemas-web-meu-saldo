import {
    RiLoader4Line,
} from "react-icons/ri";

import StatePanel from "./StatePanel.jsx";
import {
    mergeClassNames,
} from "./overlayUtils.js";

function Spinner({
    size = "md",
    label = "Carregando",
    className = "",
}) {
    const sizes = {
        sm: "size-4",
        md: "size-5",
        lg: "size-7",
    };

    return (
        <RiLoader4Line
            role="status"
            aria-label={label}
            className={mergeClassNames(
                "animate-spin text-primary",
                sizes[size] || sizes.md,
                className
            )}
        />
    );
}

function LoadingState(props) {
    return <StatePanel type="loading" {...props} />;
}

export {
    LoadingState,
    Spinner,
};
