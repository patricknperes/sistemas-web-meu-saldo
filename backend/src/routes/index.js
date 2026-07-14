import { Router } from "express";

import { authRoutes } from "./authRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";
import { userRoutes } from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);

export { router };