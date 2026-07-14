import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

export async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(
      "Token de autenticação não informado.",
      401
    );
  }

  const [scheme, token] = authorization
    .trim()
    .split(/\s+/);

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
      "Formato do token de autenticação inválido.",
      401
    );
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      env.jwtSecret,
      {
        algorithms: ["HS256"],
        issuer: env.jwtIssuer,
        audience: env.jwtAudience,
      }
    );
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      throw new AppError(
        "O token de autenticação expirou.",
        401
      );
    }

    throw new AppError(
      "Token de autenticação inválido.",
      401
    );
  }

  if (
    typeof payload !== "object" ||
    !payload.sub
  ) {
    throw new AppError(
      "Token de autenticação inválido.",
      401
    );
  }

  const userId = Number(payload.sub);

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new AppError(
      "Token de autenticação inválido.",
      401
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Usuário da autenticação não encontrado.",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Este usuário está desativado.",
      403
    );
  }

  req.user = user;

  return next();
}