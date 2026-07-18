import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            gcTime: 5 * 60_000,
            refetchOnMount: "always",
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                const status = error?.response?.status;

                if (status >= 400 && status < 500) {
                    return false;
                }

                return failureCount < 2;
            },
        },
        mutations: {
            retry: false,
        },
    },
});
