import { useEffect, useMemo, useState } from "react";

const currentDate = new Date();

function getDefaultFilters() {
    return {
        mode: "MONTH",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        startDate: "",
        endDate: "",
        tagId: "",
    };
}

function readStoredFilters(type) {
    if (typeof window === "undefined") return getDefaultFilters();
    try {
        const raw = window.localStorage.getItem(`meu-saldo:transaction-filters:${type}`);
        if (!raw) return getDefaultFilters();
        return { ...getDefaultFilters(), ...JSON.parse(raw) };
    } catch {
        return getDefaultFilters();
    }
}

export function useTransactionFilters(type) {
    const [filters, setFilters] = useState(() => readStoredFilters(type));

    useEffect(() => {
        window.localStorage.setItem(`meu-saldo:transaction-filters:${type}`, JSON.stringify(filters));
    }, [filters, type]);

    const apiDateFilters = useMemo(() => {
        if (filters.mode === "MONTH") return { month: Number(filters.month), year: Number(filters.year) };
        if (filters.mode === "YEAR") return { year: Number(filters.year) };
        if (filters.mode === "RANGE") {
            return {
                ...(filters.startDate ? { startDate: filters.startDate } : {}),
                ...(filters.endDate ? { endDate: filters.endDate } : {}),
            };
        }
        return {};
    }, [filters]);

    function updateFilters(patch) {
        setFilters((current) => ({ ...current, ...patch }));
    }

    function resetFilters() {
        setFilters(getDefaultFilters());
    }

    return { filters, apiDateFilters, updateFilters, resetFilters };
}
