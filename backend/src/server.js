import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

import {
  runRecurringTransactionJob,
  startRecurringTransactionJob,
  stopRecurringTransactionJob,
} from "./jobs/recurringTransactionJob.js";

let httpServer = null;
let isShuttingDown = false;

async function processPendingRecurrences() {
  try {
    const result =
      await runRecurringTransactionJob();

    console.log(
      [
        "[Inicialização]",
        `Recorrências processadas: ${result.processedRulesCount}.`,
        `Movimentações criadas: ${result.createdCount}.`,
      ].join(" ")
    );
  } catch (error) {
    /*
     * Uma falha pontual no processamento
     * das recorrências não deve impedir
     * o restante da API de iniciar.
     */
    console.error(
      "[Inicialização] Não foi possível processar as recorrências pendentes."
    );

    console.error(error);
  }
}

async function startServer() {
  try {
    await prisma.$connect();

    console.log(
      "Banco de dados conectado com sucesso."
    );

    /*
     * Recupera ocorrências vencidas durante
     * períodos em que o servidor esteve
     * desligado.
     *
     * Apenas datas que já chegaram serão
     * transformadas em transações.
     */
    await processPendingRecurrences();

    /*
     * Agenda a verificação automática
     * diária das recorrências.
     */
    startRecurringTransactionJob();

    httpServer = app.listen(
      env.port,
      () => {
        console.log(
          `Servidor rodando em http://localhost:${env.port}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Não foi possível iniciar o servidor."
    );

    console.error(error);

    try {
      await stopRecurringTransactionJob();
    } catch (jobError) {
      console.error(
        "Não foi possível encerrar o job de recorrências."
      );

      console.error(jobError);
    }

    await prisma.$disconnect();

    process.exit(1);
  }
}

async function closeHttpServer() {
  if (!httpServer) {
    return;
  }

  await new Promise(
    (resolve, reject) => {
      httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    }
  );

  httpServer = null;
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(
    `\nSinal ${signal} recebido.`
  );

  console.log(
    "Encerrando o servidor..."
  );

  try {
    /*
     * Interrompe primeiro o agendamento,
     * impedindo que uma nova verificação
     * seja iniciada durante o desligamento.
     */
    await stopRecurringTransactionJob();

    /*
     * Para de aceitar novas requisições
     * e aguarda as atuais terminarem.
     */
    await closeHttpServer();

    await prisma.$disconnect();

    console.log(
      "Servidor encerrado corretamente."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Erro ao encerrar o servidor."
    );

    console.error(error);

    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error(
        "Erro ao desconectar o banco de dados."
      );

      console.error(
        disconnectError
      );
    }

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