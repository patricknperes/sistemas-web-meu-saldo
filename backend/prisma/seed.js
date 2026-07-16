import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

import {
  getPasswordValidationErrors,
  isValidEmail,
  normalizeEmail,
} from "../src/utils/authValidation.js";

import {
  ensureDefaultTagsForUser,
} from "../src/services/tagService.js";

const PASSWORD_SALT_ROUNDS = 10;

function getAdminEnvironment() {
  const name =
    typeof process.env.ADMIN_NAME ===
    "string"
      ? process.env.ADMIN_NAME.trim()
      : "";

  const email = normalizeEmail(
    process.env.ADMIN_EMAIL
  );

  const password =
    typeof process.env.ADMIN_PASSWORD ===
    "string"
      ? process.env.ADMIN_PASSWORD
      : "";

  const missingVariables = [];

  if (!name) {
    missingVariables.push(
      "ADMIN_NAME"
    );
  }

  if (!email) {
    missingVariables.push(
      "ADMIN_EMAIL"
    );
  }

  if (!password) {
    missingVariables.push(
      "ADMIN_PASSWORD"
    );
  }

  if (
    missingVariables.length > 0
  ) {
    throw new Error(
      `Variáveis ausentes para criar o administrador: ${missingVariables.join(
        ", "
      )}`
    );
  }

  if (name.length < 2) {
    throw new Error(
      "ADMIN_NAME precisa possuir pelo menos 2 caracteres."
    );
  }

  if (name.length > 100) {
    throw new Error(
      "ADMIN_NAME precisa possuir no máximo 100 caracteres."
    );
  }

  if (!isValidEmail(email)) {
    throw new Error(
      "ADMIN_EMAIL precisa conter um endereço de e-mail válido."
    );
  }

  const passwordErrors =
    getPasswordValidationErrors(
      password,
      "ADMIN_PASSWORD"
    );

  if (
    passwordErrors.length > 0
  ) {
    throw new Error(
      passwordErrors.join("\n")
    );
  }

  return {
    name,
    email,
    password,
  };
}

async function seed() {
  const {
    name,
    email,
    password,
  } = getAdminEnvironment();

  const passwordHash =
    await bcrypt.hash(
      password,
      PASSWORD_SALT_ROUNDS
    );

  const administrator =
    await prisma.user.upsert({
      where: {
        email,
      },

      update: {
        name,
        role: "ADMIN",
        isActive: true,

        /*
         * A senha de um administrador
         * existente não será alterada
         * automaticamente pelo seed.
         */
      },

      create: {
        name,
        email,
        passwordHash,
        googleId: null,
        avatarUrl: null,
        role: "ADMIN",
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

  /*
   * Cria as tags padrão para o
   * administrador caso ele ainda
   * não possua nenhuma tag.
   */
  await ensureDefaultTagsForUser(
    administrator.id
  );

  const tagCount =
    await prisma.tag.count({
      where: {
        userId:
          administrator.id,
      },
    });

  console.log(
    "Administrador configurado com sucesso:"
  );

  console.log(
    administrator
  );

  console.log(
    `Tags disponíveis para o administrador: ${tagCount}`
  );
}

seed()
  .catch((error) => {
    console.error(
      "Erro ao executar o seed:"
    );

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });