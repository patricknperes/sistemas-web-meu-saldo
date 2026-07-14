import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import { generateToken } from "../utils/generateToken.js";

const PASSWORD_SALT_ROUNDS = 10;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateRegistrationData(input) {
  const errors = {};

  const name =
    typeof input?.name === "string"
      ? input.name.trim()
      : "";

  const email =
    typeof input?.email === "string"
      ? normalizeEmail(input.email)
      : "";

  const password =
    typeof input?.password === "string"
      ? input.password
      : "";

  if (!name) {
    errors.name = "O nome é obrigatório.";
  } else if (name.length < 2) {
    errors.name = "O nome deve possuir pelo menos 2 caracteres.";
  } else if (name.length > 100) {
    errors.name = "O nome deve possuir no máximo 100 caracteres.";
  }

  if (!email) {
    errors.email = "O e-mail é obrigatório.";
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      errors.email = "Informe um endereço de e-mail válido.";
    }
  }

  if (!password) {
    errors.password = "A senha é obrigatória.";
  } else if (password.length < 8) {
    errors.password = "A senha deve possuir pelo menos 8 caracteres.";
  } else if (Buffer.byteLength(password, "utf8") > 72) {
    errors.password = "A senha é muito longa.";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(
      "Dados de cadastro inválidos.",
      422,
      errors
    );
  }

  return {
    name,
    email,
    password,
  };
}

function validateLoginData(input) {
  const errors = {};

  const email =
    typeof input?.email === "string"
      ? normalizeEmail(input.email)
      : "";

  const password =
    typeof input?.password === "string"
      ? input.password
      : "";

  if (!email) {
    errors.email = "O e-mail é obrigatório.";
  }

  if (!password) {
    errors.password = "A senha é obrigatória.";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(
      "Dados de login inválidos.",
      422,
      errors
    );
  }

  return {
    email,
    password,
  };
}

export async function registerUser(input) {
  const { name, email, password } =
    validateRegistrationData(input);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new AppError(
      "Já existe um usuário cadastrado com esse e-mail.",
      409
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    PASSWORD_SALT_ROUNDS
  );

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,

        // O cadastro público nunca poderá criar um administrador.
        role: "USER",
      },
      select: publicUserSelect,
    });

    const token = generateToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    // Evita duplicação mesmo se duas requisições forem feitas
    // praticamente ao mesmo tempo.
    if (error?.code === "P2002") {
      throw new AppError(
        "Já existe um usuário cadastrado com esse e-mail.",
        409
      );
    }

    throw error;
  }
}

export async function loginUser(input) {
  const { email, password } = validateLoginData(input);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError(
      "E-mail ou senha incorretos.",
      401
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError(
      "E-mail ou senha incorretos.",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Este usuário está desativado.",
      403
    );
  }

  const {
    passwordHash,
    ...publicUser
  } = user;

  const token = generateToken(publicUser);

  return {
    user: publicUser,
    token,
  };
}