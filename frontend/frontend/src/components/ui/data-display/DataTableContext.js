import {
    createContext,
    useContext,
} from "react";

const DataTableContext = createContext({
    density: "default",
    hoverable: true,
});

function useDataTableContext() {
    return useContext(DataTableContext);
}

export {
    DataTableContext,
    useDataTableContext,
};
