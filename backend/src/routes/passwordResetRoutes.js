import {
    Router,
} from "express";

import {
    requestPasswordResetController,
    resetPasswordController,
    validatePasswordResetTokenController,
} from "../controllers/passwordResetController.js";

const passwordResetRoutes =
    Router();

/*
 * Solicita o envio do e-mail de recuperação.
 *
 * POST /api/auth/forgot-password
 */
passwordResetRoutes.post(
    "/forgot-password",
    requestPasswordResetController,
);

/*
 * Verifica se o token do link ainda é válido.
 *
 * GET /api/auth/reset-password/validate?token=...
 */
passwordResetRoutes.get(
    "/reset-password/validate",
    validatePasswordResetTokenController,
);

/*
 * Define a nova senha e consome o token.
 *
 * POST /api/auth/reset-password
 */
passwordResetRoutes.post(
    "/reset-password",
    resetPasswordController,
);

export {
    passwordResetRoutes,
};