import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export function generateToken(user) {
  return jwt.sign(
    {
      role: user.role,
    },
    env.jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: env.jwtExpiresIn,
      subject: String(user.id),
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
}