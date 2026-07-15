import { Router } from "express";

import {
  googleAuth,
  login,
  me,
  register,
} from "../controllers/authController.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";

import {
  loginRateLimiter,
} from "../middlewares/rateLimitMiddleware.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  register
);

authRoutes.post(
  "/login",
  loginRateLimiter,
  login
);

authRoutes.post(
  "/google",
  loginRateLimiter,
  googleAuth
);

authRoutes.get(
  "/me",
  authMiddleware,
  me
);

export { authRoutes };