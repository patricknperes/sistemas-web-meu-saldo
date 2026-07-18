import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function vendorChunk(id) {
    if (!id.includes("node_modules")) {
        return undefined;
    }

    if (/node_modules\/(react|react-dom|react-router)\//.test(id)) {
        return "vendor-react";
    }

    if (/node_modules\/(radix-ui|@radix-ui|cmdk|motion|framer-motion|lucide-react)\//.test(id)) {
        return "vendor-ui";
    }

    if (/node_modules\/(@tanstack|recharts|d3-|victory-vendor)\//.test(id)) {
        return "vendor-data";
    }

    if (/node_modules\/(react-hook-form|zod|@hookform|date-fns|@daypicker|react-number-format)\//.test(id)) {
        return "vendor-forms";
    }

    return "vendor-core";
}

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: vendorChunk,
            },
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/test/setup.js",
        css: true,
        exclude: ["e2e/**", "node_modules/**", "dist/**"],
        coverage: {
            reporter: ["text", "html"],
        },
    },
});
