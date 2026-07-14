import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

const MAX_AMOUNT_CENTS = 2_147_483_647;

const transactionSelect = {
  id: true,
  description: true,
  amountCents: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

function validatePositiveId(value, entityName) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(
      `Identificador de ${entityName} inválido.`,
      400
    );
  }

  return id;
}

function validateAllowedFields(input, allowedFields) {
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

  const invalidFields = Object.keys(input).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422
    );
  }
}

function validateDescription(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "A descrição é obrigatória.",
      422
    );
  }

  const description = value.trim();

  if (description.length < 2) {
    throw new AppError(
      "A descrição deve possuir pelo menos 2 caracteres.",
      422
    );
  }

  if (description.length > 150) {
    throw new AppError(
      "A descrição deve possuir no máximo 150 caracteres.",
      422
    );
  }

  return description;
}

function validateAmountCents(value) {
  const amountCents = Number(value);

  if (!Number.isInteger(amountCents)) {
    throw new AppError(
      "O valor deve ser informado em centavos e precisa ser um número inteiro.",
      422
    );
  }

  if (amountCents <= 0) {
    throw new AppError(
      "O valor da transação precisa ser maior que zero.",
      422
    );
  }

  if (amountCents > MAX_AMOUNT_CENTS) {
    throw new AppError(
      "O valor informado é muito alto.",
      422
    );
  }

  return amountCents;
}

function validateTransactionType(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "O tipo da transação é obrigatório.",
      422
    );
  }

  const type = value.trim().toUpperCase();

  if (!["INCOME", "EXPENSE"].includes(type)) {
    throw new AppError(
      "O tipo da transação deve ser INCOME ou EXPENSE.",
      422
    );
  }

  return type;
}

function validateCategory(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "A categoria é obrigatória.",
      422
    );
  }

  const category = value.trim();

  if (category.length < 2) {
    throw new AppError(
      "A categoria deve possuir pelo menos 2 caracteres.",
      422
    );
  }

  if (category.length > 80) {
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

  if (typeof value !== "string") {
    throw new AppError(
      "As observações precisam ser um texto.",
      422
    );
  }

  const notes = value.trim();

  if (!notes) {
    return null;
  }

  if (notes.length > 500) {
    throw new AppError(
      "As observações devem possuir no máximo 500 caracteres.",
      422
    );
  }

  return notes;
}

function parseDateOnly(
  value,
  fieldName,
  timeMode = "noon"
) {
  if (typeof value !== "string") {
    throw new AppError(
      `O campo ${fieldName} deve ser informado no formato YYYY-MM-DD.`,
      422
    );
  }

  const normalizedValue = value.trim();

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
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

  if (year < 1900 || year > 2100) {
    throw new AppError(
      `O campo ${fieldName} possui um ano inválido.`,
      422
    );
  }

  let hours = 12;
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;

  if (timeMode === "start") {
    hours = 0;
  }

  if (timeMode === "end") {
    hours = 23;
    minutes = 59;
    seconds = 59;
    milliseconds = 999;
  }

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    )
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

function validatePaginationValue(
  value,
  defaultValue,
  fieldName,
  maximumValue
) {
  if (value === undefined) {
    return defaultValue;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
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

function validateMonth(value) {
  const month = Number(value);

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new AppError(
      "O mês deve ser um número entre 1 e 12.",
      400
    );
  }

  return month;
}

function validateYear(value) {
  const year = Number(value);

  if (
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 2100
  ) {
    throw new AppError(
      "O ano informado é inválido.",
      400
    );
  }

  return year;
}

function getMonthDateRange(year, month) {
  const startDate = new Date(
    Date.UTC(year, month - 1, 1, 0, 0, 0, 0)
  );

  const nextMonthDate = new Date(
    Date.UTC(year, month, 1, 0, 0, 0, 0)
  );

  return {
    startDate,
    nextMonthDate,
  };
}

function getYearDateRange(year) {
  const startDate = new Date(
    Date.UTC(year, 0, 1, 0, 0, 0, 0)
  );

  const nextYearDate = new Date(
    Date.UTC(year + 1, 0, 1, 0, 0, 0, 0)
  );

  return {
    startDate,
    nextYearDate,
  };
}

function buildTransactionData(
  input,
  isUpdate = false
) {
  const data = {};

  if (
    !isUpdate ||
    input.description !== undefined
  ) {
    data.description = validateDescription(
      input.description
    );
  }

  if (
    !isUpdate ||
    input.amountCents !== undefined
  ) {
    data.amountCents = validateAmountCents(
      input.amountCents
    );
  }

  if (
    !isUpdate ||
    input.type !== undefined
  ) {
    data.type = validateTransactionType(
      input.type
    );
  }

  if (
    !isUpdate ||
    input.category !== undefined
  ) {
    data.category = validateCategory(
      input.category
    );
  }

  if (
    !isUpdate ||
    input.date !== undefined
  ) {
    data.date = parseDateOnly(
      input.date,
      "date"
    );
  }

  if (input.notes !== undefined) {
    data.notes = validateNotes(input.notes);
  }

  return data;
}

function applyDateFilters(where, query) {
  const hasMonthFilter =
    query.month !== undefined;

  const hasYearFilter =
    query.year !== undefined;

  const hasDateRangeFilter =
    query.startDate !== undefined ||
    query.endDate !== undefined;

  if (
    (hasMonthFilter || hasYearFilter) &&
    hasDateRangeFilter
  ) {
    throw new AppError(
      "Use o filtro por mês/ano ou o filtro por período, mas não os dois juntos.",
      400
    );
  }

  if (hasMonthFilter && !hasYearFilter) {
    throw new AppError(
      "Para filtrar por mês, informe também o ano.",
      400
    );
  }

  if (hasMonthFilter && hasYearFilter) {
    const month = validateMonth(query.month);
    const year = validateYear(query.year);

    const {
      startDate,
      nextMonthDate,
    } = getMonthDateRange(year, month);

    where.date = {
      gte: startDate,
      lt: nextMonthDate,
    };

    return;
  }

  if (hasYearFilter) {
    const year = validateYear(query.year);

    const {
      startDate,
      nextYearDate,
    } = getYearDateRange(year);

    where.date = {
      gte: startDate,
      lt: nextYearDate,
    };

    return;
  }

  if (hasDateRangeFilter) {
    const startDate =
      query.startDate !== undefined
        ? parseDateOnly(
            query.startDate,
            "startDate",
            "start"
          )
        : null;

    const endDate =
      query.endDate !== undefined
        ? parseDateOnly(
            query.endDate,
            "endDate",
            "end"
          )
        : null;

    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      throw new AppError(
        "A data inicial não pode ser posterior à data final.",
        422
      );
    }

    where.date = {};

    if (startDate) {
      where.date.gte = startDate;
    }

    if (endDate) {
      where.date.lte = endDate;
    }
  }

  /*
    Se nenhum filtro de data for informado,
    where.date não será definido.

    Nesse caso, a consulta retorna todo o histórico.
  */
}

export async function createTransaction(
  userIdValue,
  input
) {
  const userId = validatePositiveId(
    userIdValue,
    "usuário"
  );

  validateAllowedFields(input, [
    "description",
    "amountCents",
    "type",
    "category",
    "date",
    "notes",
  ]);

  const transactionData =
    buildTransactionData(input);

  return prisma.transaction.create({
    data: {
      ...transactionData,
      userId,
    },

    select: transactionSelect,
  });
}

export async function listTransactions(
  userIdValue,
  query = {}
) {
  const userId = validatePositiveId(
    userIdValue,
    "usuário"
  );

  const page = validatePaginationValue(
    query.page,
    1,
    "page"
  );

  const limit = validatePaginationValue(
    query.limit,
    20,
    "limit",
    100
  );

  const where = {
    userId,
  };

  if (query.type !== undefined) {
    where.type = validateTransactionType(
      query.type
    );
  }

  if (query.category !== undefined) {
    where.category = validateCategory(
      query.category
    );
  }

  if (query.search !== undefined) {
    if (typeof query.search !== "string") {
      throw new AppError(
        "O parâmetro search precisa ser um texto.",
        400
      );
    }

    const search = query.search.trim();

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

  applyDateFilters(where, query);

  const skip = (page - 1) * limit;

  const [
    transactions,
    totalItems,
    amountSummary,
  ] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,

      select: transactionSelect,

      orderBy: [
        {
          date: "desc",
        },
        {
          id: "desc",
        },
      ],

      skip,
      take: limit,
    }),

    prisma.transaction.count({
      where,
    }),

    prisma.transaction.aggregate({
      where,

      _sum: {
        amountCents: true,
      },
    }),
  ]);

  const totalPages =
    totalItems === 0
      ? 0
      : Math.ceil(totalItems / limit);

  return {
    transactions,

    summary: {
      totalAmountCents:
        amountSummary._sum.amountCents ?? 0,
    },

    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}

export async function getTransactionById(
  userIdValue,
  transactionIdValue
) {
  const userId = validatePositiveId(
    userIdValue,
    "usuário"
  );

  const transactionId = validatePositiveId(
    transactionIdValue,
    "transação"
  );

  const transaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },

      select: transactionSelect,
    });

  if (!transaction) {
    throw new AppError(
      "Transação não encontrada.",
      404
    );
  }

  return transaction;
}

export async function updateTransaction(
  userIdValue,
  transactionIdValue,
  input
) {
  const userId = validatePositiveId(
    userIdValue,
    "usuário"
  );

  const transactionId = validatePositiveId(
    transactionIdValue,
    "transação"
  );

  validateAllowedFields(input, [
    "description",
    "amountCents",
    "type",
    "category",
    "date",
    "notes",
  ]);

  if (Object.keys(input).length === 0) {
    throw new AppError(
      "Informe pelo menos um campo para atualização.",
      422
    );
  }

  const transactionData =
    buildTransactionData(input, true);

  return prisma.$transaction(
    async (transactionClient) => {
      const updateResult =
        await transactionClient.transaction.updateMany({
          where: {
            id: transactionId,
            userId,
          },

          data: transactionData,
        });

      if (updateResult.count === 0) {
        throw new AppError(
          "Transação não encontrada.",
          404
        );
      }

      return transactionClient.transaction.findUnique({
        where: {
          id: transactionId,
        },

        select: transactionSelect,
      });
    }
  );
}

export async function deleteTransaction(
  userIdValue,
  transactionIdValue
) {
  const userId = validatePositiveId(
    userIdValue,
    "usuário"
  );

  const transactionId = validatePositiveId(
    transactionIdValue,
    "transação"
  );

  const deleteResult =
    await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (deleteResult.count === 0) {
    throw new AppError(
      "Transação não encontrada.",
      404
    );
  }
}