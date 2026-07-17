import {
    RiLoader4Line,
} from "react-icons/ri";

function ActionContent({
    children,
    leadingIcon,
    trailingIcon,
    loading = false,
    loadingText,
    iconOnly = false,
}) {
    if (iconOnly) {
        return loading ? (
            <RiLoader4Line
                aria-hidden="true"
                className="animate-spin"
                size="1.125em"
            />
        ) : (
            children
        );
    }

    return (
        <>
            {loading ? (
                <RiLoader4Line
                    aria-hidden="true"
                    className="animate-spin"
                    size="1.125em"
                />
            ) : (
                leadingIcon
            )}

            <span className="truncate">
                {loading && loadingText
                    ? loadingText
                    : children}
            </span>

            {!loading && trailingIcon}
        </>
    );
}

export default ActionContent;
