import { render, screen } from "@testing-library/react";

import AppErrorBoundary from "./AppErrorBoundary.jsx";

function BrokenComponent() {
    throw new Error("Falha de teste");
}

describe("AppErrorBoundary", () => {
    it("exibe uma recuperação segura quando um filho falha", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <AppErrorBoundary>
                <BrokenComponent />
            </AppErrorBoundary>,
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /recarregar página/i })).toBeInTheDocument();

        consoleError.mockRestore();
    });
});
