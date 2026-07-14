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

  if (!Number.isInteger(userId) || userId <= 0) {
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

export async function getMonthlyHistory(
  userIdValue,
  yearValue
) {
  const userId = validateUserId(userIdValue);
  const selectedYear =
    validateHistoryYear(yearValue);

  const where = {
    userId,
  };

  if (selectedYear) {
    where.date = {
      gte: new Date(
        Date.UTC(selectedYear, 0, 1)
      ),

      lt: new Date(
        Date.UTC(selectedYear + 1, 0, 1)
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

  for (const transaction of transactions) {
    const date = new Date(transaction.date);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;

    const key =
      `${year}-${String(month).padStart(2, "0")}`;

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

    const monthData = monthlyMap.get(key);

    if (transaction.type === "INCOME") {
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
    .sort((firstMonth, secondMonth) =>
      secondMonth.key.localeCompare(
        firstMonth.key
      )
    );

  return history;
}

export async function getDashboardSummary(userIdValue) {
  const userId = validateUserId(userIdValue);

  const [groupedTransactions, recentTransactions] =
    await prisma.$transaction([
      prisma.transaction.groupBy({
        by: ["type"],

        where: {
          userId,
        },

        _sum: {
          amountCents: true,
        },

        _count: {
          _all: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          userId,
        },

        select: recentTransactionSelect,

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

  const incomeGroup = groupedTransactions.find(
    (group) => group.type === "INCOME"
  );

  const expenseGroup = groupedTransactions.find(
    (group) => group.type === "EXPENSE"
  );

  const totalIncomeCents =
    incomeGroup?._sum.amountCents ?? 0;

  const totalExpenseCents =
    expenseGroup?._sum.amountCents ?? 0;

  const incomeCount =
    incomeGroup?._count._all ?? 0;

  const expenseCount =
    expenseGroup?._count._all ?? 0;

  const balanceCents =
    totalIncomeCents - totalExpenseCents;

  const transactionCount =
    incomeCount + expenseCount;

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