import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

export function notFoundMiddleware(req, res, next) {
  next(
    new AppError(
      `Rota ${req.method} ${req.originalUrl} não encontrada.`,
      404
    )
  );
}

export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson =
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error;

  if (isInvalidJson) {
    return res.status(400).json({
      error: "O corpo JSON enviado é inválido.",
    });
  }

  const isControlledError =
    error instanceof AppError;

  const statusCode = isControlledError
    ? error.statusCode
    : 500;

  const response = {
    error: isControlledError
      ? error.message
      : "Ocorreu um erro interno no servidor.",
  };

  if (
    isControlledError &&
    error.details
  ) {
    response.details = error.details;
  }

  if (env.nodeEnv === "development") {
    response.stack = error.stack;

    if (!isControlledError) {
      response.originalMessage = error.message;
    }
  }

  if (!isControlledError) {
    console.error(error);
  }

  return res.status(statusCode).json(response);
}