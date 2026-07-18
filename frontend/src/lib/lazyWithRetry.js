import { lazy } from "react";

const RETRY_KEY = "meu-saldo:chunk-retry";

export function lazyWithRetry(importer) {
    return lazy(async () => {
        try {
            const module = await importer();
            sessionStorage.removeItem(RETRY_KEY);
            return module;
        } catch (error) {
            const alreadyRetried = sessionStorage.getItem(RETRY_KEY) === "true";

            if (!alreadyRetried && typeof window !== "undefined") {
                sessionStorage.setItem(RETRY_KEY, "true");
                window.location.reload();

                return new Promise(() => {});
            }

            sessionStorage.removeItem(RETRY_KEY);
            throw error;
        }
    });
}
