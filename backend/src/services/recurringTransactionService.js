import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import {
  calculateFirstOccurrenceDate,
  createMonthlyOccurrenceDate,
  getTodayDateOnly,
  materializeRecurringTransactionById,
  materializeRecurringTransactions,
  parseRecurrenceDate,
  validateDayOfMonth,
  validateIntervalMonths,
} from "./recurrenceService.js";

import {
  validateTagIdsForUser,
} from "./tagService.js";

const MAX_AMOUNT_CENTS =
  2_147_483_647;

const DEFAULT_CATEGORY =
  "Outros";

const recurringTransactionSelect = {
  id: true,
  description: true,
  amountCents: true,
  type: true,
  category: true,
  notes: true,
  startDate: true,
  endDate: true,
  dayOfMonth: true,
  intervalMonths: true,
  nextOccurrenceDate: true,
  isActive: true,
  userId: true,
  createdAt: true,
  updatedAt: true,

  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          normalizedName: true,
          color: true,
          scope: true,
          isDefault: true,
          isActive: true,
        },
      },
    },
  },

  _count: {
    select: {
      transactions: true,
    },
  },
};

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

function validateAllowedFields(
  input,
  allowedFields
) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new AppError(
      "O corpo da requisição é inválido.",
      400
    );
  }

  const invalidFields =
    Object.keys(input).filter(
      (field) =>
        !allowedFields.includes(field)
    );

  if (
    invalidFields.length > 0
  ) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422
    );
  }
}

function validateDescription(
  value
) {
  if (
    typeof value !== "string"
  ) {
    throw new AppError(
      "A descrição é obrigatória.",
      422
    );
  }

  const description =
    value.trim();

  if (
    description.length < 2
  ) {
    throw new AppError(
      "A descrição deve possuir pelo menos 2 caracteres.",
      422
    );
  }

  if (
    description.length > 150
  ) {
    throw new AppError(
      "A descrição deve possuir no máximo 150 caracteres.",
      422
    );
  }

  return description;
}

function validateAmountCents(
  value
) {
  const amountCents =
    Number(value);

  if (
    !Number.isInteger(
      amountCents
    )
  ) {
    throw new AppError(
      "O valor deve ser informado em centavos e precisa ser um número inteiro.",
      422
    );
  }

  if (amountCents <= 0) {
    throw new AppError(
      "O valor da recorrência precisa ser maior que zero.",
      422
    );
  }

  if (
    amountCents >
    MAX_AMOUNT_CENTS
  ) {
    throw new AppError(
      "O valor informado é muito alto.",
      422
    );
  }

  return amountCents;
}

function validateTransactionType(
  value
) {
  if (
    typeof value !== "string"
  ) {
    throw new AppError(
      "O tipo da recorrência é obrigatório.",
      422
    );
  }

  const type =
    value
      .trim()
      .toUpperCase();

  if (
    ![
      "INCOME",
      "EXPENSE",
    ].includes(type)
  ) {
    throw new AppError(
      "O tipo da recorrência deve ser INCOME ou EXPENSE.",
      422
    );
  }

  return type;
}

function validateCategory(
  value
) {
  if (
    typeof value !== "string"
  ) {
    throw new AppError(
      "A categoria precisa ser um texto.",
      422
    );
  }

  const category =
    value.trim();

  if (
    category.length < 2
  ) {
    throw new AppError(
      "A categoria deve possuir pelo menos 2 caracteres.",
      422
    );
  }

  if (
    category.length > 80
  ) {
    throw new AppError(
      "A categoria deve possuir no máximo 80 caracteres.",
      422
    );
  }

  return category;
}

function validateNotes(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value !== "string"
  ) {
    throw new AppError(
      "As observações precisam ser um texto.",
      422
    );
  }

  const notes =
    value.trim();

  if (!notes) {
    return null;
  }

  if (
    notes.length > 500
  ) {
    throw new AppError(
      "As observações devem possuir no máximo 500 caracteres.",
      422
    );
  }

  return notes;
}

function validateBoolean(
  value,
  fieldName
) {
  if (
    typeof value !== "boolean"
  ) {
    throw new AppError(
      `O campo ${fieldName} deve ser verdadeiro ou falso.`,
      422
    );
  }

  return value;
}

function validatePaginationValue(
  value,
  defaultValue,
  fieldName,
  maximumValue
) {
  if (
    value === undefined
  ) {
    return defaultValue;
  }

  const number =
    Number(value);

  if (
    !Number.isInteger(number) ||
    number <= 0
  ) {
    throw new AppError(
      `O parâmetro ${fieldName} deve ser um número inteiro positivo.`,
      400
    );
  }

  if (
    maximumValue !== undefined &&
    number > maximumValue
  ) {
    throw new AppError(
      `O parâmetro ${fieldName} deve ser no máximo ${maximumValue}.`,
      400
    );
  }

  return number;
}

function parseBooleanFilter(
  value
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (
    value === true ||
    value === "true"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false"
  ) {
    return false;
  }

  throw new AppError(
    "O filtro isActive deve ser verdadeiro ou falso.",
    400
  );
}

function parseOptionalEndDate(
  value
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return parseRecurrenceDate(
    value,
    "endDate"
  );
}

function validateDateRange(
  startDate,
  endDate,
  firstOccurrenceDate
) {
  if (
    endDate &&
    endDate.getTime() <
      startDate.getTime()
  ) {
    throw new AppError(
      "A data final não pode ser anterior à data inicial.",
      422
    );
  }

  if (
    endDate &&
    firstOccurrenceDate
      .getTime() >
      endDate.getTime()
  ) {
    throw new AppError(
      "O período informado termina antes da primeira ocorrência da regra.",
      422
    );
  }
}

function getMonthNumber(date) {
  return (
    date.getUTCFullYear() *
      12 +
    date.getUTCMonth()
  );
}

function getOccurrenceFromMonthNumber(
  monthNumber,
  dayOfMonth
) {
  const year =
    Math.floor(
      monthNumber / 12
    );

  const monthIndex =
    monthNumber % 12;

  return createMonthlyOccurrenceDate(
    year,
    monthIndex,
    dayOfMonth
  );
}

function getLaterDate(
  firstDate,
  secondDate
) {
  return (
    firstDate.getTime() >=
    secondDate.getTime()
      ? firstDate
      : secondDate
  );
}

/*
 * Calcula a primeira ocorrência
 * igual ou posterior à data de
 * referência.
 *
 * Também respeita regras bimestrais,
 * trimestrais ou com outros intervalos.
 */
function calculateOccurrenceOnOrAfter(
  startDateValue,
  dayOfMonthValue,
  intervalMonthsValue,
  referenceDateValue
) {
  const startDate =
    parseRecurrenceDate(
      startDateValue,
      "startDate"
    );

  const referenceDate =
    parseRecurrenceDate(
      referenceDateValue,
      "referenceDate"
    );

  const dayOfMonth =
    validateDayOfMonth(
      dayOfMonthValue
    );

  const intervalMonths =
    validateIntervalMonths(
      intervalMonthsValue
    );

  const firstOccurrence =
    calculateFirstOccurrenceDate(
      startDate,
      dayOfMonth
    );

  if (
    firstOccurrence.getTime() >=
    referenceDate.getTime()
  ) {
    return firstOccurrence;
  }

  const firstMonthNumber =
    getMonthNumber(
      firstOccurrence
    );

  const referenceMonthNumber =
    getMonthNumber(
      referenceDate
    );

  const elapsedMonths =
    referenceMonthNumber -
    firstMonthNumber;

  const completedIntervals =
    Math.floor(
      elapsedMonths /
        intervalMonths
    );

  let candidateMonthNumber =
    firstMonthNumber +
    completedIntervals *
      intervalMonths;

  let candidate =
    getOccurrenceFromMonthNumber(
      candidateMonthNumber,
      dayOfMonth
    );

  if (
    candidate.getTime() <
    referenceDate.getTime()
  ) {
    candidateMonthNumber +=
      intervalMonths;

    candidate =
      getOccurrenceFromMonthNumber(
        candidateMonthNumber,
        dayOfMonth
      );
  }

  return candidate;
}

function getRecurringStatus(
  recurringTransaction
) {
  if (
    recurringTransaction.isActive
  ) {
    return "ACTIVE";
  }

  if (
    recurringTransaction.endDate &&
    recurringTransaction
      .nextOccurrenceDate
      .getTime() >
      recurringTransaction
        .endDate
        .getTime()
  ) {
    return "FINISHED";
  }

  return "PAUSED";
}

function serializeRecurringTransaction(
  recurringTransaction
) {
  const {
    tags: tagLinks,
    _count,
    ...recurringData
  } = recurringTransaction;

  const tags =
    tagLinks
      .map(
        (tagLink) =>
          tagLink.tag
      )
      .sort(
        (
          firstTag,
          secondTag
        ) =>
          firstTag.name.localeCompare(
            secondTag.name,
            "pt-BR"
          )
      );

  return {
    ...recurringData,
    tags,

    generatedTransactionCount:
      _count?.transactions ?? 0,

    status:
      getRecurringStatus(
        recurringTransaction
      ),
  };
}

async function findOwnedRecurringTransaction(
  userId,
  recurringTransactionId
) {
  const recurringTransaction =
    await prisma
      .recurringTransaction
      .findFirst({
        where: {
          id:
            recurringTransactionId,

          userId,
        },

        select:
          recurringTransactionSelect,
      });

  if (
    !recurringTransaction
  ) {
    throw new AppError(
      "Recorrência não encontrada.",
      404
    );
  }

  return recurringTransaction;
}

function buildListWhere(
  userId,
  query
) {
  const where = {
    userId,
  };

  if (
    query.type !== undefined
  ) {
    where.type =
      validateTransactionType(
        query.type
      );
  }

  const isActive =
    parseBooleanFilter(
      query.isActive
    );

  if (isActive !== null) {
    where.isActive =
      isActive;
  }

  if (
    query.tagId !== undefined
  ) {
    const tagId =
      validatePositiveId(
        query.tagId,
        "tag"
      );

    where.tags = {
      some: {
        tagId,
      },
    };
  }

  if (
    query.search !== undefined
  ) {
    if (
      typeof query.search !==
      "string"
    ) {
      throw new AppError(
        "O parâmetro search precisa ser um texto.",
        400
      );
    }

    const search =
      query.search.trim();

    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
          },
        },
        {
          category: {
            contains: search,
          },
        },
        {
          notes: {
            contains: search,
          },
        },
      ];
    }
  }

  return where;
}

function validateExistingTagsForType(
  tagLinks,
  type
) {
  const incompatibleTag =
    tagLinks
      .map(
        (tagLink) =>
          tagLink.tag
      )
      .find(
        (tag) =>
          tag.scope !==
            "BOTH" &&
          tag.scope !== type
      );

  if (!incompatibleTag) {
    return;
  }

  const expectedType =
    type === "INCOME"
      ? "receitas"
      : "despesas";

  throw new AppError(
    `A tag "${incompatibleTag.name}" não pode ser utilizada em ${expectedType}. Remova ou substitua essa tag antes de alterar o tipo da recorrência.`,
    422
  );
}

export async function createRecurringTransaction(
  userIdValue,
  input
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  validateAllowedFields(
    input,
    [
      "description",
      "amountCents",
      "type",
      "category",
      "notes",
      "startDate",
      "endDate",
      "dayOfMonth",
      "intervalMonths",
      "tagIds",
    ]
  );

  const description =
    validateDescription(
      input.description
    );

  const amountCents =
    validateAmountCents(
      input.amountCents
    );

  const type =
    validateTransactionType(
      input.type
    );

  const notes =
    validateNotes(
      input.notes
    );

  const startDate =
    parseRecurrenceDate(
      input.startDate,
      "startDate"
    );

  const endDate =
    parseOptionalEndDate(
      input.endDate
    );

  const dayOfMonth =
    validateDayOfMonth(
      input.dayOfMonth
    );

  const intervalMonths =
    input.intervalMonths ===
    undefined
      ? 1
      : validateIntervalMonths(
          input.intervalMonths
        );

  const tags =
    await validateTagIdsForUser(
      userId,
      input.tagIds,
      type
    );

  const category =
    input.category !== undefined
      ? validateCategory(
          input.category
        )
      : tags[0]?.name ??
        DEFAULT_CATEGORY;

  const firstOccurrenceDate =
    calculateFirstOccurrenceDate(
      startDate,
      dayOfMonth
    );

  validateDateRange(
    startDate,
    endDate,
    firstOccurrenceDate
  );

  const recurringTransaction =
    await prisma
      .recurringTransaction
      .create({
        data: {
          description,
          amountCents,
          type,
          category,
          notes,
          startDate,
          endDate,
          dayOfMonth,
          intervalMonths,

          nextOccurrenceDate:
            firstOccurrenceDate,

          isActive: true,
          userId,

          ...(tags.length > 0
            ? {
                tags: {
                  create:
                    tags.map(
                      (tag) => ({
                        tag: {
                          connect: {
                            id: tag.id,
                          },
                        },
                      })
                    ),
                },
              }
            : {}),
        },

        select:
          recurringTransactionSelect,
      });

  /*
   * Caso a primeira ocorrência já
   * tenha chegado, ela é registrada.
   *
   * Datas futuras continuam apenas
   * agendadas na recorrência.
   */
  await materializeRecurringTransactionById(
    userId,
    recurringTransaction.id
  );

  const refreshedRecurringTransaction =
    await findOwnedRecurringTransaction(
      userId,
      recurringTransaction.id
    );

  return serializeRecurringTransaction(
    refreshedRecurringTransaction
  );
}

export async function listRecurringTransactions(
  userIdValue,
  query = {}
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  /*
   * Registra ocorrências que já
   * venceram antes de apresentar
   * a lista.
   */
  await materializeRecurringTransactions(
    userId
  );

  const page =
    validatePaginationValue(
      query.page,
      1,
      "page"
    );

  const limit =
    validatePaginationValue(
      query.limit,
      20,
      "limit",
      100
    );

  const where =
    buildListWhere(
      userId,
      query
    );

  const skip =
    (page - 1) * limit;

  const [
    recurringTransactions,
    totalItems,
  ] = await prisma.$transaction([
    prisma.recurringTransaction
      .findMany({
        where,

        select:
          recurringTransactionSelect,

        orderBy: [
          {
            isActive: "desc",
          },
          {
            nextOccurrenceDate:
              "asc",
          },
          {
            id: "desc",
          },
        ],

        skip,
        take: limit,
      }),

    prisma.recurringTransaction
      .count({
        where,
      }),
  ]);

  const totalPages =
    totalItems === 0
      ? 0
      : Math.ceil(
          totalItems / limit
        );

  return {
    recurringTransactions:
      recurringTransactions.map(
        serializeRecurringTransaction
      ),

    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}

export async function getRecurringTransactionById(
  userIdValue,
  recurringTransactionIdValue
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  const recurringTransactionId =
    validatePositiveId(
      recurringTransactionIdValue,
      "recorrência"
    );

  await materializeRecurringTransactionById(
    userId,
    recurringTransactionId
  );

  const recurringTransaction =
    await findOwnedRecurringTransaction(
      userId,
      recurringTransactionId
    );

  return serializeRecurringTransaction(
    recurringTransaction
  );
}

export async function updateRecurringTransaction(
  userIdValue,
  recurringTransactionIdValue,
  input
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  const recurringTransactionId =
    validatePositiveId(
      recurringTransactionIdValue,
      "recorrência"
    );

  validateAllowedFields(
    input,
    [
      "description",
      "amountCents",
      "type",
      "category",
      "notes",
      "startDate",
      "endDate",
      "dayOfMonth",
      "intervalMonths",
      "isActive",
      "tagIds",
    ]
  );

  if (
    Object.keys(input).length ===
    0
  ) {
    throw new AppError(
      "Informe pelo menos um campo para atualizar a recorrência.",
      422
    );
  }

  /*
   * Primeiro, cria tudo que já
   * venceu usando os dados antigos.
   *
   * Dessa forma, a alteração afeta
   * somente ocorrências futuras.
   */
  await materializeRecurringTransactionById(
    userId,
    recurringTransactionId
  );

  const current =
    await findOwnedRecurringTransaction(
      userId,
      recurringTransactionId
    );

  const updateData = {};

  if (
    input.description !==
    undefined
  ) {
    updateData.description =
      validateDescription(
        input.description
      );
  }

  if (
    input.amountCents !==
    undefined
  ) {
    updateData.amountCents =
      validateAmountCents(
        input.amountCents
      );
  }

  const effectiveType =
    input.type !== undefined
      ? validateTransactionType(
          input.type
        )
      : current.type;

  if (
    input.type !== undefined
  ) {
    updateData.type =
      effectiveType;
  }

  if (
    input.notes !== undefined
  ) {
    updateData.notes =
      validateNotes(
        input.notes
      );
  }

  const effectiveStartDate =
    input.startDate !==
    undefined
      ? parseRecurrenceDate(
          input.startDate,
          "startDate"
        )
      : current.startDate;

  const effectiveEndDate =
    input.endDate !==
    undefined
      ? parseOptionalEndDate(
          input.endDate
        )
      : current.endDate;

  const effectiveDayOfMonth =
    input.dayOfMonth !==
    undefined
      ? validateDayOfMonth(
          input.dayOfMonth
        )
      : current.dayOfMonth;

  const effectiveIntervalMonths =
    input.intervalMonths !==
    undefined
      ? validateIntervalMonths(
          input.intervalMonths
        )
      : current.intervalMonths;

  const firstOccurrenceDate =
    calculateFirstOccurrenceDate(
      effectiveStartDate,
      effectiveDayOfMonth
    );

  validateDateRange(
    effectiveStartDate,
    effectiveEndDate,
    firstOccurrenceDate
  );

  if (
    input.startDate !==
    undefined
  ) {
    updateData.startDate =
      effectiveStartDate;
  }

  if (
    input.endDate !==
    undefined
  ) {
    updateData.endDate =
      effectiveEndDate;
  }

  if (
    input.dayOfMonth !==
    undefined
  ) {
    updateData.dayOfMonth =
      effectiveDayOfMonth;
  }

  if (
    input.intervalMonths !==
    undefined
  ) {
    updateData.intervalMonths =
      effectiveIntervalMonths;
  }

  let validatedTags = null;

  if (
    input.tagIds !== undefined
  ) {
    validatedTags =
      await validateTagIdsForUser(
        userId,
        input.tagIds,
        effectiveType
      );
  } else if (
    input.type !== undefined &&
    effectiveType !==
      current.type
  ) {
    validateExistingTagsForType(
      current.tags,
      effectiveType
    );
  }

  if (
    input.category !==
    undefined
  ) {
    updateData.category =
      validateCategory(
        input.category
      );
  } else if (
    validatedTags &&
    validatedTags.length > 0
  ) {
    updateData.category =
      validatedTags[0].name;
  }

  const requestedIsActive =
    input.isActive !==
    undefined
      ? validateBoolean(
          input.isActive,
          "isActive"
        )
      : current.isActive;

  const scheduleChanged =
    input.startDate !==
      undefined ||
    input.endDate !==
      undefined ||
    input.dayOfMonth !==
      undefined ||
    input.intervalMonths !==
      undefined;

  const isReactivating =
    !current.isActive &&
    requestedIsActive;

  let nextOccurrenceDate =
    current.nextOccurrenceDate;

  if (
    scheduleChanged ||
    isReactivating
  ) {
    const today =
      getTodayDateOnly();

    /*
     * Usa a próxima ocorrência que já
     * estava agendada como referência.
     *
     * Isso evita criar uma segunda
     * ocorrência dentro do mesmo mês
     * quando a regra é editada.
     */
    let referenceDate =
      getLaterDate(
        current.nextOccurrenceDate,
        today
      );

    referenceDate =
      getLaterDate(
        referenceDate,
        effectiveStartDate
      );

    nextOccurrenceDate =
      calculateOccurrenceOnOrAfter(
        effectiveStartDate,
        effectiveDayOfMonth,
        effectiveIntervalMonths,
        referenceDate
      );

    updateData.nextOccurrenceDate =
      nextOccurrenceDate;
  }

  const hasFutureOccurrence =
    !effectiveEndDate ||
    nextOccurrenceDate
      .getTime() <=
      effectiveEndDate
        .getTime();

  let finalIsActive =
    requestedIsActive;

  if (!hasFutureOccurrence) {
    if (
      input.isActive === true
    ) {
      throw new AppError(
        "Não existe uma próxima ocorrência dentro do período informado.",
        422
      );
    }

    finalIsActive = false;
  }

  if (
    input.isActive !==
      undefined ||
    finalIsActive !==
      current.isActive
  ) {
    updateData.isActive =
      finalIsActive;
  }

  const newTagIds =
    validatedTags?.map(
      (tag) => tag.id
    ) ?? null;

  /*
   * A alteração da regra e das
   * relações com tags acontece em
   * uma única transação.
   */
  await prisma.$transaction(
    async (
      transactionClient
    ) => {
      if (
        Object.keys(
          updateData
        ).length > 0
      ) {
        await transactionClient
          .recurringTransaction
          .update({
            where: {
              id:
                recurringTransactionId,
            },

            data: updateData,
          });
      }

      if (
        newTagIds !== null
      ) {
        await transactionClient
          .recurringTransactionTag
          .deleteMany({
            where: {
              recurringTransactionId,
            },
          });

        if (
          newTagIds.length > 0
        ) {
          await transactionClient
            .recurringTransactionTag
            .createMany({
              data:
                newTagIds.map(
                  (tagId) => ({
                    recurringTransactionId,
                    tagId,
                  })
                ),
            });
        }
      }
    }
  );

  /*
   * Caso a nova agenda possua
   * uma ocorrência para hoje,
   * ela pode ser registrada agora.
   *
   * Ocorrências futuras continuam
   * fora da tabela Transaction.
   */
  if (finalIsActive) {
    await materializeRecurringTransactionById(
      userId,
      recurringTransactionId
    );
  }

  const updated =
    await findOwnedRecurringTransaction(
      userId,
      recurringTransactionId
    );

  return serializeRecurringTransaction(
    updated
  );
}

export async function deleteRecurringTransaction(
  userIdValue,
  recurringTransactionIdValue
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário"
    );

  const recurringTransactionId =
    validatePositiveId(
      recurringTransactionIdValue,
      "recorrência"
    );

  /*
   * Antes de excluir a regra,
   * registra as ocorrências que
   * já deveriam ter acontecido.
   */
  await materializeRecurringTransactionById(
    userId,
    recurringTransactionId
  );

  const deleteResult =
    await prisma
      .recurringTransaction
      .deleteMany({
        where: {
          id:
            recurringTransactionId,

          userId,
        },
      });

  if (
    deleteResult.count === 0
  ) {
    throw new AppError(
      "Recorrência não encontrada.",
      404
    );
  }
}