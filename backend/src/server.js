import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

let httpServer = null;
let isShuttingDown = false;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Banco de dados conectado com sucesso.");

    httpServer = app.listen(env.port, () => {
      console.log(
        `Servidor rodando em http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Não foi possível iniciar o servidor.");
    console.error(error);

    await prisma.$disconnect();
    process.exit(1);
  }
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\nSinal ${signal} recebido.`);
  console.log("Encerrando o servidor...");

  try {
    if (httpServer) {
      await new Promise((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();

    console.log("Servidor encerrado corretamente.");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao encerrar o servidor.");
    console.error(error);

    process.exit(1);
  }
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

startServer();