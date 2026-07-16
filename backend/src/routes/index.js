import { Router } from "express";

import { authRoutes } from "./authRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { recurringTransactionRoutes } from "./recurringTransactionRoutes.js";
import { tagRoutes } from "./tagRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";
import { userRoutes } from "./userRoutes.js";

const router = Router();

router.use(
  "/auth",
  authRoutes
);

router.use(
  "/users",
  userRoutes
);

router.use(
  "/transactions",
  transactionRoutes
);

router.use(
  "/recurring-transactions",
  recurringTransactionRoutes
);

router.use(
  "/tags",
  tagRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);

export { router };