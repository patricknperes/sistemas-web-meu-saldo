import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

const recentTransactionSelect = {
  id: true,
  description: true,
  amountCents: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
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
  if (value === undefined) {
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

export async function getMonthlyHistory(
  userIdValue,
  yearValue
) {
  const userId =
    validateUserId(userIdValue);

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
          1
        )
      ),

      lt: new Date(
        Date.UTC(
          selectedYear + 1,
          0,
          1
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
    } else {
      monthData.totalExpenseCents +=
        transaction.amountCents;
    }

    monthData.transactionCount += 1;

    monthData.balanceCents =
      monthData.totalIncomeCents -
      monthData.totalExpenseCents;
  }

  const history = Array
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

  return history;
}

export async function getDashboardSummary(
  userIdValue,
  filters = {}
) {
  const userId =
    validateUserId(userIdValue);

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
    incomeGroup?._count._all ??
    0;

  const expenseCount =
    expenseGroup?._count._all ??
    0;

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
    recentTransactions,
  };
}