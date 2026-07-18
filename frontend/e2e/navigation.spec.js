import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (["127.0.0.1", "localhost"].includes(url.hostname)) {
            await route.continue();
            return;
        }
        await route.abort();
    });
});

test.describe("navegação pública", () => {
    test("redireciona uma rota protegida para o login", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole("heading", { name: "Acesse sua conta" })).toBeVisible();
        await expect(page).toHaveTitle("Entrar | Meu Saldo");
    });

    test("permite alternar o tema pelo teclado", async ({ page }) => {
        await page.goto("/login", { waitUntil: "domcontentloaded" });
        const themeButton = page.getByRole("button", { name: /ativar tema/i });
        await themeButton.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("html")).toHaveClass(/dark/);
    });

    test("apresenta uma página 404 responsiva e acessível", async ({ page }) => {
        await page.goto("/rota-que-nao-existe", { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("heading", { name: "Esta página saiu do mapa." })).toBeVisible();
        await expect(page.getByRole("link", { name: "Ir para o login" })).toBeVisible();
        await expect(page).toHaveTitle("Página não encontrada | Meu Saldo");
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
});
