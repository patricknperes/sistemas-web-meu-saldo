import {
    createContext,
    useContext,
} from "react";

const AppShellContext = createContext(null);

function useAppShell() {
    const context = useContext(
        AppShellContext
    );

    if (!context) {
        throw new Error(
            "useAppShell deve ser utilizado dentro de AppShell."
        );
    }

    return context;
}

export {
    AppShellContext,
    useAppShell,
};
