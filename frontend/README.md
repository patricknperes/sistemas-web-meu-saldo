# Meu Saldo — Frontend

Frontend React + Vite + Tailwind CSS do sistema Meu Saldo.

## Etapa atual

**Rewrite Visual concluído — Etapa 9.**

A aplicação utiliza:

- Design System Aqua Graphite;
- Radix UI e CMDK;
- TanStack Query e Table;
- React Hook Form e Zod;
- Recharts;
- Lucide React;
- Motion;
- Vitest, Testing Library e Playwright.

## Requisitos

O React Router 8 usado pelo projeto requer Node.js 22.22.0 ou superior. O repositório inclui `.nvmrc`.

```bash
nvm use
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test:unit
npm run audit:ui
npm run build:report
npm run validate
npm run test:e2e
npm run test:e2e:ui
npm run preview
```

Para o primeiro teste end-to-end:

```bash
npx playwright install chromium
```
