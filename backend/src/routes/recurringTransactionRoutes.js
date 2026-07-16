import { Router } from "express";

import {
  createRecurringTransactionController,
  deleteRecurringTransactionController,
  getRecurringTransactionController,
  listRecurringTransactionsController,
  updateRecurringTransactionController,
} from "../controllers/recurringTransactionController.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const recurringTransactionRoutes =
  Router();

/*
 * Todas as rotas de recorrências
 * exigem autenticação.
 */
recurringTransactionRoutes.use(
  authMiddleware
);

/*
 * GET /api/recurring-transactions
 *
 * Filtros disponíveis:
 *
 * ?type=INCOME
 * ?type=EXPENSE
 * ?isActive=true
 * ?isActive=false
 * ?tagId=3
 * ?search=salario
 * ?page=1
 * ?limit=20
 */
recurringTransactionRoutes.get(
  "/",
  listRecurringTransactionsController
);

/*
 * GET /api/recurring-transactions/:id
 */
recurringTransactionRoutes.get(
  "/:id",
  getRecurringTransactionController
);

/*
 * POST /api/recurring-transactions
 */
recurringTransactionRoutes.post(
  "/",
  createRecurringTransactionController
);

/*
 * PATCH /api/recurring-transactions/:id
 *
 * A edição afeta apenas as próximas
 * ocorrências da regra.
 *
 * As transações que já foram geradas
 * permanecem inalteradas.
 */
recurringTransactionRoutes.patch(
  "/:id",
  updateRecurringTransactionController
);

/*
 * DELETE /api/recurring-transactions/:id
 *
 * Exclui somente a regra recorrente.
 *
 * As transações já geradas permanecem
 * no histórico do usuário.
 */
recurringTransactionRoutes.delete(
  "/:id",
  deleteRecurringTransactionController
);

export {
  recurringTransactionRoutes,
};