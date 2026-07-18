import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import {
  getPasswordValidationErrors,
  isValidEmail,
  normalizeEmail,
} from "../utils/authValidation.js";

const PASSWORD_SALT_ROUNDS = 10;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

const ownProfileSelect = {
  ...publicUserSelect,
  passwordHash: true,
  googleId: true,
};

const adminUserSelect = {
  ...publicUserSelect,
  passwordHash: true,
  googleId: true,
  _count: {
    select: {
      transactions: true,
      recurringTransactions: true,
      tags: true,
    },
  },
};

function serializeOwnProfile(user) {
  const {
    passwordHash,
    googleId,
    ...publicUser
  } = user;

  return {
    ...publicUser,

    authMethods: {
      password: Boolean(passwordHash),
      google: Boolean(googleId),
    },
  };
}

function serializeAdminUser(user) {
  const {
    passwordHash,
    googleId,
    _count,
    ...publicUser
  } = user;

  return {
    ...publicUser,
    authMethods: {
      password: Boolean(passwordHash),
      google: Boolean(googleId),
    },
    activity: {
      transactions: _count?.transactions ?? 0,
      recurringTransactions:
        _count?.recurringTransactions ?? 0,
      tags: _count?.tags ?? 0,
    },
  };
}

function parsePositiveInteger(value, fallback, maximum) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return Math.min(parsedValue, maximum);
}

function buildUserListFilters(input = {}) {
  const search =
    typeof input.search === "string"
      ? input.search.trim().slice(0, 120)
      : "";

  const role = ["USER", "ADMIN"].includes(input.role)
    ? input.role
    : null;

  const status = ["ACTIVE", "INACTIVE"].includes(input.status)
    ? input.status
    : null;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (status) {
    where.isActive = status === "ACTIVE";
  }

  return where;
}

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

function validateName(name) {
  if (typeof name !== "string") {
    throw new AppError(
      "O nome precisa ser um texto.",
      422
    );
  }

  const normalizedName = name.trim();

  if (normalizedName.length < 2) {
    throw new AppError(
      "O nome deve possuir pelo menos 2 caracteres.",
      422
    );
  }

  if (normalizedName.length > 100) {
    throw new AppError(
      "O nome deve possuir no máximo 100 caracteres.",
      422
    );
  }

  return normalizedName;
}

function validateEmail(email) {
  if (typeof email !== "string") {
    throw new AppError(
      "O e-mail precisa ser um texto.",
      422
    );
  }

  const normalizedEmail =
    normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new AppError(
      "Informe um endereço de e-mail válido.",
      422
    );
  }

  return normalizedEmail;
}

function validateNewPassword(password) {
  const validationErrors =
    getPasswordValidationErrors(
      password,
      "A nova senha"
    );

  if (validationErrors.length > 0) {
    throw new AppError(
      validationErrors[0],
      422,
      {
        newPassword:
          validationErrors,
      }
    );
  }

  return password;
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

  if (invalidFields.length > 0) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(
        ", "
      )}.`,
      422
    );
  }
}

function handlePrismaError(error) {
  if (error?.code === "P2002") {
    throw new AppError(
      "Já existe um usuário cadastrado com esse e-mail.",
      409
    );
  }

  throw error;
}

function ensureLocalPassword(
  user,
  operationMessage
) {
  if (!user.passwordHash) {
    throw new AppError(
      operationMessage,
      422
    );
  }
}

export async function getOwnProfile(
  userIdValue
) {
  const userId =
    validateUserId(userIdValue);

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: ownProfileSelect,
    });

  if (!user) {
    throw new AppError(
      "Usuário não encontrado.",
      404
    );
  }

  return serializeOwnProfile(user);
}

export async function updateOwnProfile(
  userIdValue,
  input
) {
  const userId =
    validateUserId(userIdValue);

  validateAllowedFields(input, [
    "name",
    "email",
    "currentPassword",
    "newPassword",
  ]);

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: ownProfileSelect,
    });

  if (!user) {
    throw new AppError(
      "Usuário não encontrado.",
      404
    );
  }

  const updateData = {};

  if (input.name !== undefined) {
    updateData.name =
      validateName(input.name);
  }

  if (input.email !== undefined) {
    updateData.email =
      validateEmail(input.email);
  }

  const wantsToChangeEmail =
    updateData.email !== undefined &&
    updateData.email !== user.email;

  const wantsToChangePassword =
    input.newPassword !== undefined;

  if (
    wantsToChangeEmail ||
    wantsToChangePassword
  ) {
    ensureLocalPassword(
      user,
      "Esta conta utiliza somente o Google. A alteração de e-mail ou a criação de uma senha local ainda não está disponível."
    );

    if (
      typeof input.currentPassword !==
        "string" ||
      !input.currentPassword
    ) {
      throw new AppError(
        "Informe a senha atual para alterar o e-mail ou a senha.",
        422
      );
    }

    const currentPasswordMatches =
      await bcrypt.compare(
        input.currentPassword,
        user.passwordHash
      );

    if (!currentPasswordMatches) {
      throw new AppError(
        "A senha atual está incorreta.",
        401
      );
    }
  }

  if (wantsToChangePassword) {
    const newPassword =
      validateNewPassword(
        input.newPassword
      );

    const sameAsCurrentPassword =
      await bcrypt.compare(
        newPassword,
        user.passwordHash
      );

    if (sameAsCurrentPassword) {
      throw new AppError(
        "A nova senha precisa ser diferente da senha atual.",
        422
      );
    }

    updateData.passwordHash =
      await bcrypt.hash(
        newPassword,
        PASSWORD_SALT_ROUNDS
      );
  }

  if (
    Object.keys(updateData).length === 0
  ) {
    throw new AppError(
      "Informe pelo menos um campo para atualização.",
      422
    );
  }

  try {
    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: updateData,
        select: ownProfileSelect,
      });

    return serializeOwnProfile(
      updatedUser
    );
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteOwnAccount(
  userIdValue,
  input
) {
  const userId =
    validateUserId(userIdValue);

  validateAllowedFields(input, [
    "password",
  ]);

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        role: true,
        passwordHash: true,
        googleId: true,
      },
    });

  if (!user) {
    throw new AppError(
      "Usuário não encontrado.",
      404
    );
  }

  if (user.role === "ADMIN") {
    throw new AppError(
      "Um administrador não pode excluir a própria conta. Outro administrador deve realizar essa operação.",
      403
    );
  }

  ensureLocalPassword(
    user,
    "Contas que utilizam somente o Google ainda não podem ser excluídas por esta tela."
  );

  if (
    typeof input.password !==
      "string" ||
    !input.password
  ) {
    throw new AppError(
      "Informe sua senha para excluir a conta.",
      422
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      input.password,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      "Senha incorreta.",
      401
    );
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

export async function listAllUsers(input = {}) {
  const page = parsePositiveInteger(input.page, 1, 1000000);
  const pageSize = parsePositiveInteger(
    input.pageSize ?? input.limit,
    10,
    50
  );
  const where = buildUserListFilters(input);

  const [users, totalItems, totalUsers, activeUsers, inactiveUsers, adminUsers] =
    await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: adminUserSelect,
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    users: users.map(serializeAdminUser),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
    summary: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admins: adminUsers,
    },
  };
}

export async function getUserById(
  userIdValue
) {
  const userId =
    validateUserId(userIdValue);

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: adminUserSelect,
    });

  if (!user) {
    throw new AppError(
      "Usuário não encontrado.",
      404
    );
  }

  return serializeAdminUser(user);
}

export async function updateUserByAdmin(
  authenticatedUserIdValue,
  targetUserIdValue,
  input
) {
  const authenticatedUserId =
    validateUserId(
      authenticatedUserIdValue
    );

  const targetUserId =
    validateUserId(
      targetUserIdValue
    );

  validateAllowedFields(input, [
    "name",
    "email",
    "role",
    "isActive",
  ]);

  const updateData = {};

  if (input.name !== undefined) {
    updateData.name =
      validateName(input.name);
  }

  if (input.email !== undefined) {
    updateData.email =
      validateEmail(input.email);
  }

  if (input.role !== undefined) {
    if (
      !["USER", "ADMIN"].includes(
        input.role
      )
    ) {
      throw new AppError(
        "A função deve ser USER ou ADMIN.",
        422
      );
    }

    updateData.role = input.role;
  }

  if (
    input.isActive !== undefined
  ) {
    if (
      typeof input.isActive !==
      "boolean"
    ) {
      throw new AppError(
        "O campo isActive deve ser verdadeiro ou falso.",
        422
      );
    }

    updateData.isActive =
      input.isActive;
  }

  if (
    Object.keys(updateData).length === 0
  ) {
    throw new AppError(
      "Informe pelo menos um campo para atualização.",
      422
    );
  }

  try {
    return await prisma.$transaction(
      async (transaction) => {
        const targetUser =
          await transaction.user.findUnique(
            {
              where: {
                id: targetUserId,
              },

              select: {
                id: true,
                role: true,
                isActive: true,
              },
            }
          );

        if (!targetUser) {
          throw new AppError(
            "Usuário não encontrado.",
            404
          );
        }

        if (
          authenticatedUserId ===
          targetUserId
        ) {
          if (
            updateData.role !==
              undefined &&
            updateData.role !==
              "ADMIN"
          ) {
            throw new AppError(
              "Você não pode remover sua própria permissão de administrador.",
              403
            );
          }

          if (
            updateData.isActive ===
            false
          ) {
            throw new AppError(
              "Você não pode desativar sua própria conta administrativa.",
              403
            );
          }
        }

        const nextRole =
          updateData.role ??
          targetUser.role;

        const nextActiveStatus =
          updateData.isActive ??
          targetUser.isActive;

        const removesActiveAdmin =
          targetUser.role ===
            "ADMIN" &&
          targetUser.isActive &&
          (nextRole !== "ADMIN" ||
            nextActiveStatus ===
              false);

        if (removesActiveAdmin) {
          const activeAdminCount =
            await transaction.user.count(
              {
                where: {
                  role: "ADMIN",
                  isActive: true,
                },
              }
            );

          if (
            activeAdminCount <= 1
          ) {
            throw new AppError(
              "O sistema precisa possuir pelo menos um administrador ativo.",
              409
            );
          }
        }

        const updatedUser =
          await transaction.user.update({
            where: {
              id: targetUserId,
            },

            data: updateData,
            select: adminUserSelect,
          });

        return serializeAdminUser(updatedUser);
      }
    );
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteUserByAdmin(
  authenticatedUserIdValue,
  targetUserIdValue
) {
  const authenticatedUserId =
    validateUserId(
      authenticatedUserIdValue
    );

  const targetUserId =
    validateUserId(
      targetUserIdValue
    );

  if (
    authenticatedUserId ===
    targetUserId
  ) {
    throw new AppError(
      "Você não pode excluir sua própria conta pela rota administrativa.",
      403
    );
  }

  await prisma.$transaction(
    async (transaction) => {
      const targetUser =
        await transaction.user.findUnique(
          {
            where: {
              id: targetUserId,
            },

            select: {
              id: true,
              role: true,
              isActive: true,
            },
          }
        );

      if (!targetUser) {
        throw new AppError(
          "Usuário não encontrado.",
          404
        );
      }

      if (
        targetUser.role ===
          "ADMIN" &&
        targetUser.isActive
      ) {
        const activeAdminCount =
          await transaction.user.count({
            where: {
              role: "ADMIN",
              isActive: true,
            },
          });

        if (activeAdminCount <= 1) {
          throw new AppError(
            "O sistema precisa possuir pelo menos um administrador ativo.",
            409
          );
        }
      }

      await transaction.user.delete({
        where: {
          id: targetUserId,
        },
      });
    }
  );
}