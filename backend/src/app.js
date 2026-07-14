import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import { router } from "./routes/index.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/errorMiddleware.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "API funcionando corretamente.",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };