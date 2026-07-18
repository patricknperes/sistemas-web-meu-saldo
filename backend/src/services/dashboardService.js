import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import {
  materializeRecurringTransactions,
} from "./recurrenceService.js";

const recentTransactionSelect = {
  id: true,
  description: true,
  amountCents: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  userId: true,

  recurringTransactionId: true,
  occurrenceDate: true,

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

  recurringTransaction: {
    select: {
      id: true,
      description: true,
      isActive: true,
      dayOfMonth: true,
      intervalMonths: true,
    },
  },
};

function validateUserId(value) {
  const userId = Number(value);

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new AppError(
      "Identificador de usuário inválido.",
      400
    );
  }

  return userId;
}

function validateHistoryYear(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

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

function validateDashboardMonth(value) {
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

function validateDashboardYear(value) {
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

function getMonthDateRange(
  year,
  month
) {
  const startDate = new Date(
    Date.UTC(
      year,
      month - 1,
      1,
      0,
      0,
      0,
      0
    )
  );

  const nextMonthDate = new Date(
    Date.UTC(
      year,
      month,
      1,
      0,
      0,
      0,
      0
    )
  );

  return {
    startDate,
    nextMonthDate,
  };
}

function getYearDateRange(year) {
  const startDate = new Date(
    Date.UTC(
      year,
      0,
      1,
      0,
      0,
      0,
      0
    )
  );

  const nextYearDate = new Date(
    Date.UTC(
      year + 1,
      0,
      1,
      0,
      0,
      0,
      0
    )
  );

  return {
    startDate,
    nextYearDate,
  };
}

function buildDashboardWhere(
  userId,
  filters = {}
) {
  const where = {
    userId,
  };

  const hasMonth =
    filters.month !== undefined &&
    filters.month !== null &&
    filters.month !== "";

  const hasYear =
    filters.year !== undefined &&
    filters.year !== null &&
    filters.year !== "";

  if (hasMonth && !hasYear) {
    throw new AppError(
      "Para filtrar a Dashboard por mês, informe também o ano.",
      400
    );
  }

  if (hasMonth && hasYear) {
    const month =
      validateDashboardMonth(
        filters.month
      );

    const year =
      validateDashboardYear(
        filters.year
      );

    const {
      startDate,
      nextMonthDate,
    } = getMonthDateRange(
      year,
      month
    );

    where.date = {
      gte: startDate,
      lt: nextMonthDate,
    };

    return where;
  }

  if (hasYear) {
    const year =
      validateDashboardYear(
        filters.year
      );

    const {
      startDate,
      nextYearDate,
    } = getYearDateRange(year);

    where.date = {
      gte: startDate,
      lt: nextYearDate,
    };
  }

  return where;
}

function serializeRecentTransaction(
  transaction
) {
  const {
    tags: tagLinks,
    recurringTransaction,
    ...transactionData
  } = transaction;

  const tags = (tagLinks ?? [])
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
    ...transactionData,

    tags,

    isRecurring: Boolean(
      transactionData
        .recurringTransactionId
    ),

    recurringTransaction,
  };
}


function validateHistoryType(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppError(
      "O tipo da movimentação é inválido.",
      400
    );
  }

  const type =
    value.trim().toUpperCase();

  if (
    ![
      "INCOME",
      "EXPENSE",
    ].includes(type)
  ) {
    throw new AppError(
      "O tipo da movimentação deve ser INCOME ou EXPENSE.",
      400
    );
  }

  return type;
}

function validateHistoryTagId(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const tagId = Number(value);

  if (
    !Number.isInteger(tagId) ||
    tagId <= 0
  ) {
    throw new AppError(
      "O identificador da tag é inválido.",
      400
    );
  }

  return tagId;
}

function parseHistoryDate(
  value,
  fieldName,
  endOfDay = false
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppError(
      `O campo ${fieldName} deve usar o formato YYYY-MM-DD.`,
      400
    );
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value.trim()
    );

  if (!match) {
    throw new AppError(
      `O campo ${fieldName} deve usar o formato YYYY-MM-DD.`,
      400
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0
    )
  );

  if (
    year < 1900 ||
    year > 2100 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new AppError(
      `O campo ${fieldName} possui uma data inválida.`,
      400
    );
  }

  return date;
}

function buildHistoryAnalyticsWhere(
  userId,
  filters = {}
) {
  const where = { userId };

  const type =
    validateHistoryType(
      filters.type
    );

  if (type) {
    where.type = type;
  }

  const tagId =
    validateHistoryTagId(
      filters.tagId
    );

  if (tagId) {
    where.tags = {
      some: {
        tagId,
      },
    };
  }

  if (
    filters.search !== undefined &&
    filters.search !== null
  ) {
    if (
      typeof filters.search !==
      "string"
    ) {
      throw new AppError(
        "O parâmetro search precisa ser um texto.",
        400
      );
    }

    const search =
      filters.search.trim();

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
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: search,
                },
              },
            },
          },
        },
      ];
    }
  }

  const hasMonth =
    filters.month !== undefined &&
    filters.month !== null &&
    filters.month !== "";

  const hasYear =
    filters.year !== undefined &&
    filters.year !== null &&
    filters.year !== "";

  const hasDateRange =
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  if (
    (hasMonth || hasYear) &&
    hasDateRange
  ) {
    throw new AppError(
      "Use o filtro por mês/ano ou o filtro por período, mas não os dois juntos.",
      400
    );
  }

  if (hasMonth && !hasYear) {
    throw new AppError(
      "Para filtrar por mês, informe também o ano.",
      400
    );
  }

  if (hasMonth && hasYear) {
    const month =
      validateDashboardMonth(
        filters.month
      );

    const year =
      validateDashboardYear(
        filters.year
      );

    const {
      startDate,
      nextMonthDate,
    } = getMonthDateRange(
      year,
      month
    );

    where.date = {
      gte: startDate,
      lt: nextMonthDate,
    };

    return where;
  }

  if (hasYear) {
    const year =
      validateDashboardYear(
        filters.year
      );

    const {
      startDate,
      nextYearDate,
    } = getYearDateRange(year);

    where.date = {
      gte: startDate,
      lt: nextYearDate,
    };

    return where;
  }

  if (hasDateRange) {
    const startDate =
      parseHistoryDate(
        filters.startDate,
        "startDate"
      );

    const endDate =
      parseHistoryDate(
        filters.endDate,
        "endDate",
        true
      );

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

  return where;
}

function getMonthKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    year,
    month,
  };
}

export async function getHistoryAnalytics(
  userIdValue,
  filters = {}
) {
  const userId =
    validateUserId(userIdValue);

  await materializeRecurringTransactions(
    userId
  );

  const where =
    buildHistoryAnalyticsWhere(
      userId,
      filters
    );

  const transactions =
    await prisma.transaction.findMany({
      where,

      select: {
        id: true,
        type: true,
        amountCents: true,
        category: true,
        date: true,
      },

      orderBy: [
        {
          date: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

  const summary = {
    totalIncomeCents: 0,
    totalExpenseCents: 0,
    balanceCents: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
    averageTransactionCents: 0,
  };

  const monthlyMap = new Map();
  const expenseCategoryMap =
    new Map();

  for (
    const transaction of
    transactions
  ) {
    const {
      key,
      year,
      month,
    } = getMonthKey(
      transaction.date
    );

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        key,
        year,
        month,
        totalIncomeCents: 0,
        totalExpenseCents: 0,
        balanceCents: 0,
        cumulativeBalanceCents: 0,
        transactionCount: 0,
        incomeCount: 0,
        expenseCount: 0,
      });
    }

    const monthData =
      monthlyMap.get(key);

    if (
      transaction.type ===
      "INCOME"
    ) {
      summary.totalIncomeCents +=
        transaction.amountCents;
      summary.incomeCount += 1;
      monthData.totalIncomeCents +=
        transaction.amountCents;
      monthData.incomeCount += 1;
    } else {
      summary.totalExpenseCents +=
        transaction.amountCents;
      summary.expenseCount += 1;
      monthData.totalExpenseCents +=
        transaction.amountCents;
      monthData.expenseCount += 1;

      const category =
        transaction.category?.trim() ||
        "Outros";

      expenseCategoryMap.set(
        category,
        (expenseCategoryMap.get(
          category
        ) ?? 0) +
          transaction.amountCents
      );
    }

    summary.transactionCount += 1;
    monthData.transactionCount += 1;
    monthData.balanceCents =
      monthData.totalIncomeCents -
      monthData.totalExpenseCents;
  }

  summary.balanceCents =
    summary.totalIncomeCents -
    summary.totalExpenseCents;

  const totalMovedCents =
    summary.totalIncomeCents +
    summary.totalExpenseCents;

  summary.averageTransactionCents =
    summary.transactionCount > 0
      ? Math.round(
          totalMovedCents /
            summary.transactionCount
        )
      : 0;

  let cumulativeBalanceCents = 0;

  const monthly = Array.from(
    monthlyMap.values()
  )
    .sort(
      (firstMonth, secondMonth) =>
        firstMonth.key.localeCompare(
          secondMonth.key
        )
    )
    .map((monthData) => {
      cumulativeBalanceCents +=
        monthData.balanceCents;

      return {
        ...monthData,
        cumulativeBalanceCents,
      };
    });

  const sortedCategories =
    Array.from(
      expenseCategoryMap.entries()
    )
      .map(
        ([name, amountCents]) => ({
          name,
          amountCents,
        })
      )
      .sort(
        (firstCategory, secondCategory) =>
          secondCategory.amountCents -
          firstCategory.amountCents
      );

  const expenseCategories =
    sortedCategories.slice(0, 6);

  if (sortedCategories.length > 6) {
    expenseCategories.push({
      name: "Outras",
      amountCents:
        sortedCategories
          .slice(6)
          .reduce(
            (total, category) =>
              total +
              category.amountCents,
            0
          ),
    });
  }

  return {
    summary,
    monthly,
    expenseCategories,
  };
}

export async function getMonthlyHistory(
  userIdValue,
  yearValue
) {
  const userId =
    validateUserId(userIdValue);

  /*
   * Antes de calcular o histórico,
   * registra somente as ocorrências
   * recorrentes cuja data já chegou.
   *
   * Valores futuros não serão criados
   * nem contabilizados.
   */
  await materializeRecurringTransactions(
    userId
  );

  const selectedYear =
    validateHistoryYear(yearValue);

  const where = {
    userId,
  };

  if (selectedYear) {
    where.date = {
      gte: new Date(
        Date.UTC(
          selectedYear,
          0,
          1,
          0,
          0,
          0,
          0
        )
      ),

      lt: new Date(
        Date.UTC(
          selectedYear + 1,
          0,
          1,
          0,
          0,
          0,
          0
        )
      ),
    };
  }

  const transactions =
    await prisma.transaction.findMany({
      where,

      select: {
        id: true,
        type: true,
        amountCents: true,
        date: true,
      },

      orderBy: {
        date: "desc",
      },
    });

  const monthlyMap = new Map();

  for (
    const transaction of
    transactions
  ) {
    const date = new Date(
      transaction.date
    );

    const year =
      date.getUTCFullYear();

    const month =
      date.getUTCMonth() + 1;

    const key =
      `${year}-${String(
        month
      ).padStart(2, "0")}`;

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        key,
        year,
        month,
        totalIncomeCents: 0,
        totalExpenseCents: 0,
        balanceCents: 0,
        transactionCount: 0,
        incomeCount: 0,
        expenseCount: 0,
      });
    }

    const monthData =
      monthlyMap.get(key);

    if (
      transaction.type ===
      "INCOME"
    ) {
      monthData.totalIncomeCents +=
        transaction.amountCents;

      monthData.incomeCount += 1;
    } else {
      monthData.totalExpenseCents +=
        transaction.amountCents;

      monthData.expenseCount += 1;
    }

    monthData.transactionCount += 1;

    monthData.balanceCents =
      monthData.totalIncomeCents -
      monthData.totalExpenseCents;
  }

  return Array
    .from(monthlyMap.values())
    .sort(
      (
        firstMonth,
        secondMonth
      ) =>
        secondMonth.key.localeCompare(
          firstMonth.key
        )
    );
}


const CSV_DELIMITER = ";";
const CSV_LINE_BREAK = "\r\n";
const CSV_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function sanitizeSpreadsheetValue(value) {
  const text = String(
    value ?? ""
  );

  const isFormattedNumber =
    /^-?\d+,\d{2}$/.test(
      text
    );

  if (
    !isFormattedNumber &&
    /^[=+\-@]/.test(
      text.trimStart()
    )
  ) {
    return `'${text}`;
  }

  return text;
}

function escapeCsvField(value) {
  const text =
    sanitizeSpreadsheetValue(
      value
    );

  if (
    /[;"\r\n]/.test(text) ||
    text !== text.trim()
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

function createCsvRow(values = []) {
  return values
    .map(escapeCsvField)
    .join(CSV_DELIMITER);
}

function formatCsvDate(value) {
  const date = new Date(value);

  const day = String(
    date.getUTCDate()
  ).padStart(2, "0");

  const month = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0");

  const year =
    date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function formatCsvAmount(value) {
  const amountCents =
    Number(value) || 0;

  return (
    amountCents / 100
  ).toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    }
  );
}

function getDashboardPeriodDescription(
  filters = {}
) {
  const hasMonth =
    filters.month !== undefined &&
    filters.month !== null &&
    filters.month !== "";

  const hasYear =
    filters.year !== undefined &&
    filters.year !== null &&
    filters.year !== "";

  if (hasMonth && hasYear) {
    const month =
      validateDashboardMonth(
        filters.month
      );

    const year =
      validateDashboardYear(
        filters.year
      );

    return `${CSV_MONTHS[month - 1]} de ${year}`;
  }

  if (hasYear) {
    const year =
      validateDashboardYear(
        filters.year
      );

    return `Ano de ${year}`;
  }

  return "Todo o histórico";
}

function getDashboardCsvFileName(
  filters = {}
) {
  const hasMonth =
    filters.month !== undefined &&
    filters.month !== null &&
    filters.month !== "";

  const hasYear =
    filters.year !== undefined &&
    filters.year !== null &&
    filters.year !== "";

  if (hasMonth && hasYear) {
    const month =
      validateDashboardMonth(
        filters.month
      );

    const year =
      validateDashboardYear(
        filters.year
      );

    return `meu-saldo-dashboard-${year}-${String(
      month
    ).padStart(2, "0")}.csv`;
  }

  if (hasYear) {
    const year =
      validateDashboardYear(
        filters.year
      );

    return `meu-saldo-dashboard-${year}.csv`;
  }

  return "meu-saldo-dashboard-todo-periodo.csv";
}

function getTransactionTypeLabel(type) {
  return type === "INCOME"
    ? "Receita"
    : "Despesa";
}

function getTransactionOriginLabel(
  transaction
) {
  return transaction
    .recurringTransactionId
    ? "Recorrente"
    : "Manual";
}

function getTransactionTagsLabel(
  transaction
) {
  return (transaction.tags ?? [])
    .map(
      (tagLink) =>
        tagLink.tag?.name
    )
    .filter(Boolean)
    .sort(
      (firstTag, secondTag) =>
        firstTag.localeCompare(
          secondTag,
          "pt-BR"
        )
    )
    .join(" | ");
}

function buildDashboardCsv({
  user,
  filters,
  transactions,
}) {
  const rows = [
    createCsvRow([
      "Relatório",
      "Dashboard - Meu Saldo",
    ]),
    createCsvRow([
      "Usuário",
      user?.name ?? "Usuário",
    ]),
    createCsvRow([
      "E-mail",
      user?.email ?? "",
    ]),
    createCsvRow([
      "Período",
      getDashboardPeriodDescription(
        filters
      ),
    ]),
    "",
    createCsvRow([
      "Data",
      "Descrição",
      "Tipo",
      "Categoria",
      "Tags",
      "Origem",
      "Valor (R$)",
      "Observações",
    ]),
  ];

  let totalIncomeCents = 0;
  let totalExpenseCents = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (
    const transaction of
    transactions
  ) {
    if (
      transaction.type ===
      "INCOME"
    ) {
      totalIncomeCents +=
        transaction.amountCents;
      incomeCount += 1;
    } else {
      totalExpenseCents +=
        transaction.amountCents;
      expenseCount += 1;
    }

    rows.push(
      createCsvRow([
        formatCsvDate(
          transaction.date
        ),
        transaction.description,
        getTransactionTypeLabel(
          transaction.type
        ),
        transaction.category,
        getTransactionTagsLabel(
          transaction
        ),
        getTransactionOriginLabel(
          transaction
        ),
        formatCsvAmount(
          transaction.amountCents
        ),
        transaction.notes ?? "",
      ])
    );
  }

  const balanceCents =
    totalIncomeCents -
    totalExpenseCents;

  const transactionCount =
    incomeCount +
    expenseCount;

  const movedAmountCents =
    totalIncomeCents +
    totalExpenseCents;

  rows.push(
    "",
    createCsvRow([
      "Resumo",
      "Quantidade",
      "Valor (R$)",
    ]),
    createCsvRow([
      "Total de receitas",
      incomeCount,
      formatCsvAmount(
        totalIncomeCents
      ),
    ]),
    createCsvRow([
      "Total de despesas",
      expenseCount,
      formatCsvAmount(
        totalExpenseCents
      ),
    ]),
    createCsvRow([
      "Saldo do período",
      "",
      formatCsvAmount(
        balanceCents
      ),
    ]),
    createCsvRow([
      "Volume movimentado",
      transactionCount,
      formatCsvAmount(
        movedAmountCents
      ),
    ])
  );

  return `\uFEFF${rows.join(
    CSV_LINE_BREAK
  )}${CSV_LINE_BREAK}`;
}

export async function getDashboardSummary(
  userIdValue,
  filters = {}
) {
  const userId =
    validateUserId(userIdValue);

  /*
   * Essa verificação é feita antes
   * de calcular o saldo.
   *
   * Exemplo:
   *
   * Recorrência no dia 5
   * Hoje é dia 3
   * → não cria nem contabiliza
   *
   * Hoje é dia 5
   * → cria e contabiliza
   *
   * Hoje é dia 8 e o servidor estava parado
   * → cria com a data do dia 5
   */
  await materializeRecurringTransactions(
    userId
  );

  const where =
    buildDashboardWhere(
      userId,
      filters
    );

  const [
    groupedTransactions,
    recentTransactions,
  ] = await prisma.$transaction([
    prisma.transaction.groupBy({
      by: ["type"],

      where,

      _sum: {
        amountCents: true,
      },

      _count: {
        _all: true,
      },
    }),

    prisma.transaction.findMany({
      where,

      select:
        recentTransactionSelect,

      orderBy: [
        {
          date: "desc",
        },
        {
          id: "desc",
        },
      ],

      take: 5,
    }),
  ]);

  const incomeGroup =
    groupedTransactions.find(
      (group) =>
        group.type === "INCOME"
    );

  const expenseGroup =
    groupedTransactions.find(
      (group) =>
        group.type === "EXPENSE"
    );

  const totalIncomeCents =
    incomeGroup?._sum
      .amountCents ?? 0;

  const totalExpenseCents =
    expenseGroup?._sum
      .amountCents ?? 0;

  const incomeCount =
    incomeGroup?._count
      ._all ?? 0;

  const expenseCount =
    expenseGroup?._count
      ._all ?? 0;

  const balanceCents =
    totalIncomeCents -
    totalExpenseCents;

  const transactionCount =
    incomeCount +
    expenseCount;

  return {
    balanceCents,
    totalIncomeCents,
    totalExpenseCents,
    transactionCount,
    incomeCount,
    expenseCount,

    recentTransactions:
      recentTransactions.map(
        serializeRecentTransaction
      ),
  };
}

export async function exportDashboardCsv(
  userIdValue,
  user,
  filters = {}
) {
  const userId =
    validateUserId(userIdValue);

  await materializeRecurringTransactions(
    userId
  );

  const where =
    buildDashboardWhere(
      userId,
      filters
    );

  const transactions =
    await prisma.transaction.findMany({
      where,

      select: {
        id: true,
        description: true,
        amountCents: true,
        type: true,
        category: true,
        date: true,
        notes: true,
        recurringTransactionId: true,

        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },

      orderBy: [
        {
          date: "desc",
        },
        {
          id: "desc",
        },
      ],
    });

  return {
    content:
      buildDashboardCsv({
        user,
        filters,
        transactions,
      }),

    fileName:
      getDashboardCsvFileName(
        filters
      ),
  };
}

