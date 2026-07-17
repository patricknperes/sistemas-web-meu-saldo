import {
    mergeClasses,
} from "./surfaceStyles.js";

const labelAlignmentClasses = {
    start: "grid-cols-[auto_minmax(0,1fr)]",
    center: "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
    end: "grid-cols-[minmax(0,1fr)_auto]",
};

function SeparatorLine({ orientation }) {
    return orientation === "vertical" ? (
        <span className="h-full w-px bg-border" aria-hidden="true" />
    ) : (
        <span className="h-px w-full bg-border" aria-hidden="true" />
    );
}

function Divider({
    orientation = "horizontal",
    label,
    labelAlign = "center",
    decorative = true,
    className = "",
    ...props
}) {
    const accessibilityProps = decorative
        ? {
              "aria-hidden": true,
          }
        : {
              role: "separator",
              "aria-orientation": orientation,
          };

    if (orientation === "horizontal" && label) {
        const alignment = labelAlignmentClasses[labelAlign] || labelAlignmentClasses.center;

        return (
            <div
                className={mergeClasses(
                    "grid items-center gap-3",
                    alignment,
                    className
                )}
                {...accessibilityProps}
                {...props}
            >
                {labelAlign !== "start" ? (
                    <SeparatorLine orientation="horizontal" />
                ) : null}

                <span className="text-caption font-semibold text-muted-foreground">
                    {label}
                </span>

                {labelAlign !== "end" ? (
                    <SeparatorLine orientation="horizontal" />
                ) : null}
            </div>
        );
    }

    return (
        <div
            className={mergeClasses(
                orientation === "vertical"
                    ? "h-auto min-h-6 w-px self-stretch bg-border"
                    : "h-px w-full bg-border",
                className
            )}
            {...accessibilityProps}
            {...props}
        />
    );
}

export default Divider;
