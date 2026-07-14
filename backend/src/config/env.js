import "dotenv/config";

const requiredVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
];

const missingVariables = requiredVariables.filter(
  (variableName) => !process.env[variableName]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Variáveis de ambiente ausentes: ${missingVariables.join(", ")}`
  );
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(
    "A variável PORT precisa ser um número inteiro positivo."
  );
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  jwtIssuer: process.env.JWT_ISSUER ?? "finance-manager-api",
  jwtAudience: process.env.JWT_AUDIENCE ?? "finance-manager-web",

  frontendUrl:
    process.env.FRONTEND_URL ?? "http://localhost:5173",
});