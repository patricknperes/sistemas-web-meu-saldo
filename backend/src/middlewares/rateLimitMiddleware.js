import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // No máximo 10 tentativas malsucedidas a cada 15 minutos.
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    error:
      "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
  },
});