import { Router } from "express";

import {
  createTransactionController,
  deleteTransactionController,
  listTransactionsController,
  showTransactionController,
  updateTransactionController,
} from "../controllers/transactionController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const transactionRoutes = Router();

// Todas as rotas exigem autenticação.
transactionRoutes.use(authMiddleware);

transactionRoutes.get(
  "/",
  listTransactionsController
);

transactionRoutes.post(
  "/",
  createTransactionController
);

transactionRoutes.get(
  "/:id",
  showTransactionController
);

transactionRoutes.patch(
  "/:id",
  updateTransactionController
);

transactionRoutes.delete(
  "/:id",
  deleteTransactionController
);

export { transactionRoutes };