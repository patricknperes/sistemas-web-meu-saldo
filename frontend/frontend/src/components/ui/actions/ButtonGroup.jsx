import {
    Children,
    cloneElement,
    isValidElement,
} from "react";

const attachedClasses = {
    horizontal: {
        base: "rounded-none",
        first: "rounded-l-lg",
        last: "rounded-r-lg",
        following: "-ml-px",
    },
    vertical: {
        base: "rounded-none",
        first: "rounded-t-lg",
        last: "rounded-b-lg",
        following: "-mt-px",
    },
};

function joinClassNames(...values) {
    return values
        .filter(Boolean)
        .join(" ");
}

function ButtonGroup({
    children,
    label,
    orientation = "horizontal",
    attached = false,
    className = "",
}) {
    const isVertical =
        orientation === "vertical";

    const items = Children.toArray(
        children
    );

    const content = attached
        ? items.map((child, index) => {
              if (!isValidElement(child)) {
                  return child;
              }

              const classes =
                  attachedClasses[
                      isVertical
                          ? "vertical"
                          : "horizontal"
                  ];

              return cloneElement(child, {
                  className: joinClassNames(
                      child.props.className,
                      classes.base,
                      index === 0
                          ? classes.first
                          : classes.following,
                      index ===
                          items.length - 1
                          ? classes.last
                          : ""
                  ),
              });
          })
        : items;

    return (
        <div
            role="group"
            aria-label={label}
            aria-orientation={orientation}
            data-attached={
                attached || undefined
            }
            className={joinClassNames(
                "inline-flex max-w-full",
                isVertical
                    ? "flex-col items-stretch"
                    : "flex-row flex-wrap items-center",
                attached
                    ? "gap-0"
                    : "gap-2",
                className
            )}
        >
            {content}
        </div>
    );
}

export default ButtonGroup;
