import { useEffect, useState } from "react";

const storageKey = "meu-saldo:history-filters";

function getDefaultFilters() {
    const now = new Date();
    return {
        mode: "YEAR",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        startDate: "",
        endDate: "",
        type: "ALL",
        tagId: "",
        search: "",
        page: 1,
        limit: 12,
    };
}

function readStoredFilters() {
    if (typeof window === "undefined") return getDefaultFilters();
    try {
        const stored = window.localStorage.getItem(storageKey);
        return stored ? { ...getDefaultFilters(), ...JSON.parse(stored), page: 1 } : getDefaultFilters();
    } catch {
        return getDefaultFilters();
    }
}

export function useHistoryFilters() {
    const [filters, setFilters] = useState(readStoredFilters);

    useEffect(() => {
        const { page: _page, ...persistentFilters } = filters;
        window.localStorage.setItem(storageKey, JSON.stringify(persistentFilters));
    }, [filters]);

    function updateFilters(patch, options = {}) {
        setFilters((current) => ({
            ...current,
            ...patch,
            page: options.keepPage ? current.page : 1,
        }));
    }

    function setPage(page) {
        setFilters((current) => ({ ...current, page }));
    }

    function resetFilters() {
        setFilters(getDefaultFilters());
    }

    return { filters, updateFilters, setPage, resetFilters };
}
