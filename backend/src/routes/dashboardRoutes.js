import { Router } from "express";

import {
  dashboardSummaryController,
  monthlyHistoryController,
} from "../controllers/dashboardController.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get(
  "/summary",
  dashboardSummaryController
);

dashboardRoutes.get(
  "/history",
  monthlyHistoryController
);

export { dashboardRoutes };