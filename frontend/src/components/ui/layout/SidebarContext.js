import {
    createContext,
    useContext,
} from "react";

const SidebarContext = createContext({
    collapsed: false,
    mode: "desktop",
    closeMobileSidebar: () => {},
});

function useSidebarContext() {
    return useContext(
        SidebarContext
    );
}

export {
    SidebarContext,
    useSidebarContext,
};
