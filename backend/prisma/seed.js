import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

const PASSWORD_SALT_ROUNDS = 10;

function getAdminEnvironment() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const password = process.env.ADMIN_PASSWORD;

  const missingVariables = [];

  if (!name) {
    missingVariables.push("ADMIN_NAME");
  }

  if (!email) {
    missingVariables.push("ADMIN_EMAIL");
  }

  if (!password) {
    missingVariables.push("ADMIN_PASSWORD");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Variáveis ausentes para criar o administrador: ${missingVariables.join(
        ", "
      )}`
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error(
      "ADMIN_EMAIL precisa conter um endereço de e-mail válido."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD precisa possuir pelo menos 8 caracteres."
    );
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new Error(
      "ADMIN_PASSWORD ultrapassa o limite permitido."
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

  const passwordHash = await bcrypt.hash(
    password,
    PASSWORD_SALT_ROUNDS
  );

  const administrator = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      name,
      role: "ADMIN",
      isActive: true,

      /*
        A senha não será alterada quando o administrador
        já existir.
      */
    },

    create: {
      name,
      email,
      passwordHash,
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

  console.log("Administrador configurado com sucesso:");
  console.log(administrator);
}

seed()
  .catch((error) => {
    console.error("Erro ao executar o seed:");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });