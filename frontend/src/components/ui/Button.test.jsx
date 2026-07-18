import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button.jsx";

describe("Button", () => {
    it("renderiza o conteúdo e executa a ação", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button onClick={onClick}>Salvar</Button>);
        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("não executa a ação quando está desabilitado", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button disabled onClick={onClick}>Salvar</Button>);
        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(onClick).not.toHaveBeenCalled();
    });
});
