import { Router } from "express";

import {
  dashboardCsvController,
  dashboardSummaryController,
  historyAnalyticsController,
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
  "/export/csv",
  dashboardCsvController
);

dashboardRoutes.get(
  "/history",
  monthlyHistoryController
);

dashboardRoutes.get(
  "/history/analytics",
  historyAnalyticsController
);

export { dashboardRoutes };
