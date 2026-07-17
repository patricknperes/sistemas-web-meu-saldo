import {
    mergeClassNames,
} from "./dataDisplayUtils.js";

const breakpointClasses = {
    sm: {
        mobile: "sm:hidden",
        desktop: "hidden sm:block",
    },
    md: {
        mobile: "md:hidden",
        desktop: "hidden md:block",
    },
    lg: {
        mobile: "lg:hidden",
        desktop: "hidden lg:block",
    },
};

function ResponsiveDataView({
    desktop,
    mobile,
    breakpoint = "md",
    className = "",
    desktopClassName = "",
    mobileClassName = "",
}) {
    const classes = breakpointClasses[breakpoint] || breakpointClasses.md;

    return (
        <div className={mergeClassNames("min-w-0", className)}>
            <div className={mergeClassNames(classes.desktop, desktopClassName)}>
                {desktop}
            </div>

            <div className={mergeClassNames(classes.mobile, mobileClassName)}>
                {mobile}
            </div>
        </div>
    );
}

export default ResponsiveDataView;
