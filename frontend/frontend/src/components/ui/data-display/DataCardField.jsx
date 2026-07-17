import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

function DataCardField({
    label,
    value,
    icon: Icon,
    fullWidth = false,
    numeric = false,
    valueClassName = "",
    className = "",
}) {
    return (
        <div className={mergeClassNames(fullWidth ? "col-span-2" : "", className)}>
            <dt className="flex items-center gap-1.5 text-overline font-bold uppercase tracking-overline text-subtle-foreground">
                {Icon ? <Icon size={14} aria-hidden="true" /> : null}
                {label}
            </dt>

            <dd className={mergeClassNames(
                "mt-1 min-w-0 text-body-sm font-semibold text-foreground-soft",
                numeric ? "numeric-value tabular-nums" : "",
                valueClassName
            )}>
                {value}
            </dd>
        </div>
    );
}

export default DataCardField;
