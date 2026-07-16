import cron from "node-cron";

import {
  materializeAllDueRecurringTransactions,
} from "../services/recurrenceService.js";

const RECURRENCE_TIMEZONE =
  process.env.RECURRENCE_TIMEZONE ??
  "America/Sao_Paulo";

const RECURRENCE_CRON_EXPRESSION =
  "5 0 * * *";

let recurringTransactionTask = null;

function getCurrentDateInTimezone(
  timezone = RECURRENCE_TIMEZONE
) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

  const dateParts =
    formatter.formatToParts(
      new Date()
    );

  const values = {};

  for (const part of dateParts) {
    if (
      part.type === "year" ||
      part.type === "month" ||
      part.type === "day"
    ) {
      values[part.type] =
        part.value;
    }
  }

  return [
    values.year,
    values.month,
    values.day,
  ].join("-");
}

export async function runRecurringTransactionJob() {
  const throughDate =
    getCurrentDateInTimezone();

  const startedAt =
    Date.now();

  console.log(
    `[Recorrências] Verificação iniciada para ${throughDate}.`
  );

  try {
    const result =
      await materializeAllDueRecurringTransactions(
        throughDate
      );

    const durationMilliseconds =
      Date.now() - startedAt;

    console.log(
      [
        "[Recorrências] Verificação concluída.",
        `Regras processadas: ${result.processedRulesCount}.`,
        `Movimentações criadas: ${result.createdCount}.`,
        `Duração: ${durationMilliseconds}ms.`,
      ].join(" ")
    );

    return result;
  } catch (error) {
    console.error(
      "[Recorrências] Não foi possível processar as ocorrências pendentes."
    );

    console.error(error);

    throw error;
  }
}

export function startRecurringTransactionJob() {
  if (recurringTransactionTask) {
    return recurringTransactionTask;
  }

  recurringTransactionTask =
    cron.schedule(
      RECURRENCE_CRON_EXPRESSION,
      async () => {
        try {
          await runRecurringTransactionJob();
        } catch {
          // O erro já foi exibido pela função principal.
        }
      },
      {
        timezone:
          RECURRENCE_TIMEZONE,
        noOverlap: true,
        name:
          "recurring-transactions-daily",
      }
    );

  console.log(
    [
      "[Recorrências] Tarefa automática iniciada.",
      `Agendamento: ${RECURRENCE_CRON_EXPRESSION}.`,
      `Fuso: ${RECURRENCE_TIMEZONE}.`,
    ].join(" ")
  );

  return recurringTransactionTask;
}

export async function stopRecurringTransactionJob() {
  if (!recurringTransactionTask) {
    return;
  }

  recurringTransactionTask.stop();

  if (
    typeof recurringTransactionTask.destroy ===
    "function"
  ) {
    await recurringTransactionTask.destroy();
  }

  recurringTransactionTask = null;

  console.log(
    "[Recorrências] Tarefa automática encerrada."
  );
}