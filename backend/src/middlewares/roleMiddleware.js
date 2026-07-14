import { AppError } from "../errors/AppError.js";

export function roleMiddleware(...allowedRoles) {
  return function checkUserRole(req, res, next) {
    if (!req.user) {
      throw new AppError(
        "Usuário não autenticado.",
        401
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "Você não possui permissão para realizar esta operação.",
        403
      );
    }

    return next();
  };
}