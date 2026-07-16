import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/*
 * Proteção contra uma regra corrompida gerar
 * ocorrências indefinidamente em uma única execução.
 */
const MAX_OCCURRENCES_PER_RULE_PER_RUN = 240;

function validatePositiveId(
  value,
  entityName
) {
  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new AppError(
      `Identificador de ${entityName} inválido.`,
      400
    );
  }

  return id;
}

export function validateDayOfMonth(value) {
  const dayOfMonth = Number(value);

  if (
    !Number.isInteger(dayOfMonth) ||
    dayOfMonth < 1 ||
    dayOfMonth > 31
  ) {
    throw new AppError(
      "O dia da recorrência deve ser um número entre 1 e 31.",
      422
    );
  }

  return dayOfMonth;
}

export function validateIntervalMonths(value) {
  const intervalMonths = Number(value);

  if (
    !Number.isInteger(intervalMonths) ||
    intervalMonths < 1 ||
    intervalMonths > 120
  ) {
    throw new AppError(
      "O intervalo da recorrência deve ser um número entre 1 e 120 meses.",
      422
    );
  }

  return intervalMonths;
}

function createDateOnly(
  year,
  monthIndex,
  day
) {
  return new Date(
    Date.UTC(
      year,
      monthIndex,
      day,
      12,
      0,
      0,
      0
    )
  );
}

function validateDateParts(
  year,
  month,
  day,
  fieldName
) {
  if (
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    throw new AppError(
      `O campo ${fieldName} possui um ano inválido.`,
      422
    );
  }

  const date = createDateOnly(
    year,
    month - 1,
    day
  );

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidDate) {
    throw new AppError(
      `O campo ${fieldName} possui uma data inválida.`,
      422
    );
  }

  return date;
}

/**
 * Converte uma data no formato YYYY-MM-DD
 * para uma data UTC ao meio-dia.
 *
 * O meio-dia ajuda a evitar alterações de dia
 * causadas por diferenças de fuso horário.
 */
export function parseRecurrenceDate(
  value,
  fieldName = "date"
) {
  if (value instanceof Date) {
    if (
      Number.isNaN(value.getTime())
    ) {
      throw new AppError(
        `O campo ${fieldName} possui uma data inválida.`,
        422
      );
    }

    return createDateOnly(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    );
  }

  if (typeof value !== "string") {
    throw new AppError(
      `O campo ${fieldName} deve ser informado no formato YYYY-MM-DD.`,
      422
    );
  }

  const normalizedValue =
    value.trim();

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      normalizedValue
    );

  if (!match) {
    throw new AppError(
      `O campo ${fieldName} deve usar o formato YYYY-MM-DD.`,
      422
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return validateDateParts(
    year,
    month,
    day,
    fieldName
  );
}

/**
 * Obtém a data atual usando o calendário local
 * do servidor e converte para uma data UTC segura.
 */
export function getTodayDateOnly() {
  const now = new Date();

  return createDateOnly(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}

function resolveThroughDate(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return getTodayDateOnly();
  }

  return parseRecurrenceDate(
    value,
    "throughDate"
  );
}

function getLastDayOfMonth(
  year,
  monthIndex
) {
  return new Date(
    Date.UTC(
      year,
      monthIndex + 1,
      0,
      12,
      0,
      0,
      0
    )
  ).getUTCDate();
}

/**
 * Cria uma ocorrência mensal.
 *
 * Caso o usuário escolha dia 31 e o mês
 * tenha menos dias, utiliza o último dia.
 *
 * Exemplos:
 *
 * Janeiro:   dia 31
 * Fevereiro: dia 28 ou 29
 * Abril:     dia 30
 */
export function createMonthlyOccurrenceDate(
  year,
  monthIndex,
  dayOfMonthValue
) {
  const dayOfMonth =
    validateDayOfMonth(
      dayOfMonthValue
    );

  const lastDay =
    getLastDayOfMonth(
      year,
      monthIndex
    );

  const occurrenceDay =
    Math.min(
      dayOfMonth,
      lastDay
    );

  return createDateOnly(
    year,
    monthIndex,
    occurrenceDay
  );
}

/**
 * Calcula a primeira ocorrência válida.
 *
 * Exemplo:
 *
 * Início: 01/01/2026
 * Dia: 5
 * Resultado: 05/01/2026
 *
 * Início: 06/01/2026
 * Dia: 5
 * Resultado: 05/02/2026
 */
export function calculateFirstOccurrenceDate(
  startDateValue,
  dayOfMonthValue
) {
  const startDate =
    parseRecurrenceDate(
      startDateValue,
      "startDate"
    );

  const dayOfMonth =
    validateDayOfMonth(
      dayOfMonthValue
    );

  let occurrence =
    createMonthlyOccurrenceDate(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      dayOfMonth
    );

  if (
    occurrence.getTime() <
    startDate.getTime()
  ) {
    const nextMonthIndex =
      startDate.getUTCMonth() + 1;

    occurrence =
      createMonthlyOccurrenceDate(
        startDate.getUTCFullYear(),
        nextMonthIndex,
        dayOfMonth
      );
  }

  return occurrence;
}

/**
 * Calcula a próxima data da regra sem criar
 * nenhuma transação antecipadamente.
 */
export function calculateNextOccurrenceDate(
  currentOccurrenceValue,
  dayOfMonthValue,
  intervalMonthsValue = 1
) {
  const currentOccurrence =
    parseRecurrenceDate(
      currentOccurrenceValue,
      "currentOccurrenceDate"
    );

  const dayOfMonth =
    validateDayOfMonth(
      dayOfMonthValue
    );

  const intervalMonths =
    validateIntervalMonths(
      intervalMonthsValue
    );

  const currentMonthNumber =
    currentOccurrence.getUTCFullYear() *
      12 +
    currentOccurrence.getUTCMonth();

  const nextMonthNumber =
    currentMonthNumber +
    intervalMonths;

  const nextYear =
    Math.floor(
      nextMonthNumber / 12
    );

  const nextMonthIndex =
    nextMonthNumber % 12;

  return createMonthlyOccurrenceDate(
    nextYear,
    nextMonthIndex,
    dayOfMonth
  );
}

export function isOccurrenceWithinEndDate(
  occurrenceDateValue,
  endDateValue
) {
  if (
    endDateValue === undefined ||
    endDateValue === null ||
    endDateValue === ""
  ) {
    return true;
  }

  const occurrenceDate =
    parseRecurrenceDate(
      occurrenceDateValue,
      "occurrenceDate"
    );

  const endDate =
    parseRecurrenceDate(
      endDateValue,
      "endDate"
    );

  return (
    occurrenceDate.getTime() <=
    endDate.getTime()
  );
}

function isDateDue(
  occurrenceDate,
  throughDate
) {
  return (
    occurrenceDate.getTime() <=
    throughDate.getTime()
  );
}

async function materializeSingleRule(
  recurringTransactionIdValue,
  throughDateValue,
  expectedUserIdValue = null
) {
  const recurringTransactionId =
    validatePositiveId(
      recurringTransactionIdValue,
      "recorrência"
    );

  const throughDate =
    resolveThroughDate(
      throughDateValue
    );

  const expectedUserId =
    expectedUserIdValue === null
      ? null
      : validatePositiveId(
          expectedUserIdValue,
          "usuário"
        );

  return prisma.$transaction(
    async (transactionClient) => {
      const recurringTransaction =
        await transactionClient
          .recurringTransaction
          .findFirst({
            where: {
              id:
                recurringTransactionId,

              ...(expectedUserId
                ? {
                    userId:
                      expectedUserId,
                  }
                : {}),
            },

            include: {
              tags: {
                select: {
                  tagId: true,
                },
              },
            },
          });

      if (!recurringTransaction) {
        return {
          recurringTransactionId,
          createdCount: 0,
          skipped: true,
          reason: "NOT_FOUND",
        };
      }

      if (
        !recurringTransaction.isActive
      ) {
        return {
          recurringTransactionId,
          createdCount: 0,
          skipped: true,
          reason: "INACTIVE",
        };
      }

      const endDate =
        recurringTransaction.endDate
          ? parseRecurrenceDate(
              recurringTransaction.endDate,
              "endDate"
            )
          : null;

      let nextOccurrenceDate =
        parseRecurrenceDate(
          recurringTransaction
            .nextOccurrenceDate,
          "nextOccurrenceDate"
        );

      let createdCount = 0;
      let processedCount = 0;

      const tagIds =
        recurringTransaction.tags.map(
          (tagLink) =>
            tagLink.tagId
        );

      /*
       * A regra principal:
       *
       * somente entra no laço quando a data
       * da ocorrência já chegou.
       *
       * Datas futuras nunca são materializadas.
       */
      while (
        isDateDue(
          nextOccurrenceDate,
          throughDate
        ) &&
        isOccurrenceWithinEndDate(
          nextOccurrenceDate,
          endDate
        )
      ) {
        processedCount += 1;

        if (
          processedCount >
          MAX_OCCURRENCES_PER_RULE_PER_RUN
        ) {
          throw new AppError(
            "A recorrência possui ocorrências pendentes demais para uma única execução.",
            409
          );
        }

        const existingTransaction =
          await transactionClient
            .transaction
            .findUnique({
              where: {
                recurringTransactionId_occurrenceDate:
                  {
                    recurringTransactionId:
                      recurringTransaction.id,

                    occurrenceDate:
                      nextOccurrenceDate,
                  },
              },

              select: {
                id: true,
              },
            });

        if (!existingTransaction) {
          await transactionClient
            .transaction
            .create({
              data: {
                description:
                  recurringTransaction
                    .description,

                amountCents:
                  recurringTransaction
                    .amountCents,

                type:
                  recurringTransaction
                    .type,

                category:
                  recurringTransaction
                    .category,

                date:
                  nextOccurrenceDate,

                occurrenceDate:
                  nextOccurrenceDate,

                notes:
                  recurringTransaction
                    .notes,

                userId:
                  recurringTransaction
                    .userId,

                recurringTransactionId:
                  recurringTransaction
                    .id,

                ...(tagIds.length > 0
                  ? {
                      tags: {
                        create:
                          tagIds.map(
                            (tagId) => ({
                              tag: {
                                connect: {
                                  id: tagId,
                                },
                              },
                            })
                          ),
                      },
                    }
                  : {}),
              },
            });

          createdCount += 1;
        }

        nextOccurrenceDate =
          calculateNextOccurrenceDate(
            nextOccurrenceDate,
            recurringTransaction
              .dayOfMonth,
            recurringTransaction
              .intervalMonths
          );
      }

      const recurrenceFinished =
        endDate !== null &&
        nextOccurrenceDate.getTime() >
          endDate.getTime();

      await transactionClient
        .recurringTransaction
        .update({
          where: {
            id:
              recurringTransaction.id,
          },

          data: {
            nextOccurrenceDate,

            /*
             * Quando não existem mais datas válidas,
             * a regra é encerrada automaticamente.
             */
            isActive:
              recurrenceFinished
                ? false
                : true,
          },
        });

      return {
        recurringTransactionId:
          recurringTransaction.id,

        createdCount,
        processedCount,
        nextOccurrenceDate,
        recurrenceFinished,
        skipped: false,
      };
    }
  );
}

/**
 * Materializa as ocorrências pendentes de
 * um usuário até a data informada.
 *
 * Normalmente throughDate será a data atual.
 */
export async function materializeRecurringTransactions(
  userIdValue,
  throughDateValue
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  const throughDate =
    resolveThroughDate(
      throughDateValue
    );

  const recurringTransactions =
    await prisma
      .recurringTransaction
      .findMany({
        where: {
          userId,
          isActive: true,

          OR: [
            {
              nextOccurrenceDate: {
                lte: throughDate,
              },
            },
            {
              endDate: {
                lte: throughDate,
              },
            },
          ],
        },

        select: {
          id: true,
        },

        orderBy: {
          nextOccurrenceDate:
            "asc",
        },
      });

  let createdCount = 0;
  let processedRulesCount = 0;

  const results = [];

  for (
    const recurringTransaction of
    recurringTransactions
  ) {
    const result =
      await materializeSingleRule(
        recurringTransaction.id,
        throughDate,
        userId
      );

    results.push(result);

    createdCount +=
      result.createdCount;

    processedRulesCount += 1;
  }

  return {
    userId,
    throughDate,
    createdCount,
    processedRulesCount,
    results,
  };
}

/**
 * Materializa uma regra específica.
 *
 * Será útil ao cadastrar ou editar uma
 * recorrência cuja primeira data já chegou.
 */
export async function materializeRecurringTransactionById(
  userIdValue,
  recurringTransactionIdValue,
  throughDateValue
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  return materializeSingleRule(
    recurringTransactionIdValue,
    throughDateValue,
    userId
  );
}

/**
 * Executa a verificação para todos os usuários.
 *
 * Essa função será utilizada posteriormente
 * pela tarefa automática diária.
 */
export async function materializeAllDueRecurringTransactions(
  throughDateValue
) {
  const throughDate =
    resolveThroughDate(
      throughDateValue
    );

  const recurringTransactions =
    await prisma
      .recurringTransaction
      .findMany({
        where: {
          isActive: true,

          OR: [
            {
              nextOccurrenceDate: {
                lte: throughDate,
              },
            },
            {
              endDate: {
                lte: throughDate,
              },
            },
          ],
        },

        select: {
          id: true,
          userId: true,
        },

        orderBy: {
          nextOccurrenceDate:
            "asc",
        },
      });

  let createdCount = 0;
  let processedRulesCount = 0;

  const results = [];

  for (
    const recurringTransaction of
    recurringTransactions
  ) {
    const result =
      await materializeSingleRule(
        recurringTransaction.id,
        throughDate,
        recurringTransaction.userId
      );

    results.push(result);

    createdCount +=
      result.createdCount;

    processedRulesCount += 1;
  }

  return {
    throughDate,
    createdCount,
    processedRulesCount,
    results,
  };
}