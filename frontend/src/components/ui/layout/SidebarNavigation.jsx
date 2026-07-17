import SidebarNavigationItem from "./SidebarNavigationItem.jsx";

import {
    useSidebarContext,
} from "./SidebarContext.js";

function SidebarNavigation({
    sections = [],
    children,
    className = "",
}) {
    const {
        collapsed,
        mode,
    } = useSidebarContext();

    const labelsVisible =
        mode === "mobile" ||
        !collapsed;

    return (
        <nav
            className={`
                min-h-0 flex-1
                overflow-x-hidden
                overflow-y-auto
                px-3 py-4
                scrollbar-subtle
                ${className}
            `}
        >
            {children ??
                sections.map(
                    (section, sectionIndex) => (
                        <div
                            key={
                                section.id ??
                                section.label ??
                                sectionIndex
                            }
                            className={
                                sectionIndex > 0
                                    ? "mt-5"
                                    : ""
                            }
                        >
                            {labelsVisible &&
                                section.label && (
                                    <p
                                        className="
                                            mb-2 px-3
                                            text-[10px]
                                            font-bold uppercase
                                            tracking-overline
                                            text-subtle-foreground
                                        "
                                    >
                                        {section.label}
                                    </p>
                                )}

                            <div className="space-y-1">
                                {section.items?.map(
                                    (item) => (
                                        <SidebarNavigationItem
                                            key={
                                                item.id ??
                                                item.to ??
                                                item.label
                                            }
                                            {...item}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )
                )}
        </nav>
    );
}

export default SidebarNavigation;
