import { useEffect, useState } from "react";

import { normalizeDashboardFilters } from "../utils/dashboardFormatters.js";

const STORAGE_KEY = "meu-saldo:dashboard-filters:v2";

function readStoredFilters() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return normalizeDashboardFilters(value ? JSON.parse(value) : undefined);
    } catch {
        return normalizeDashboardFilters();
    }
}

export function useDashboardFilters() {
    const [filters, setFilters] = useState(readStoredFilters);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }, [filters]);

    function updateFilters(partialFilters) {
        setFilters((current) => normalizeDashboardFilters({ ...current, ...partialFilters }));
    }

    return { filters, updateFilters };
}
