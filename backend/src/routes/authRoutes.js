import { Router } from "express";

import {
  login,
  me,
  register,
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);

authRoutes.post(
  "/login",
  loginRateLimiter,
  login
);

authRoutes.get(
  "/me",
  authMiddleware,
  me
);

export { authRoutes };