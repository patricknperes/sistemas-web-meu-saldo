import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import { verifyGoogleCredential } from "../lib/googleAuth.js";

import {
  getPasswordValidationErrors,
  isValidEmail,
  normalizeEmail,
} from "../utils/authValidation.js";

import { generateToken } from "../utils/generateToken.js";

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

function validateRegistrationData(input) {
  const errors = {};

  const name =
    typeof input?.name === "string"
      ? input.name.trim()
      : "";

  const email = normalizeEmail(
    input?.email
  );

  const password =
    typeof input?.password === "string"
      ? input.password
      : "";

  if (!name) {
    errors.name =
      "O nome é obrigatório.";
  } else if (name.length < 2) {
    errors.name =
      "O nome deve possuir pelo menos 2 caracteres.";
  } else if (name.length > 100) {
    errors.name =
      "O nome deve possuir no máximo 100 caracteres.";
  }

  if (!email) {
    errors.email =
      "O e-mail é obrigatório.";
  } else if (!isValidEmail(email)) {
    errors.email =
      "Informe um endereço de e-mail válido.";
  }

  const passwordErrors =
    getPasswordValidationErrors(
      password
    );

  if (passwordErrors.length > 0) {
    errors.password =
      passwordErrors;
  }

  if (
    Object.keys(errors).length > 0
  ) {
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

  const email = normalizeEmail(
    input?.email
  );

  const password =
    typeof input?.password === "string"
      ? input.password
      : "";

  if (!email) {
    errors.email =
      "O e-mail é obrigatório.";
  } else if (!isValidEmail(email)) {
    errors.email =
      "Informe um endereço de e-mail válido.";
  }

  if (!password) {
    errors.password =
      "A senha é obrigatória.";
  }

  if (
    Object.keys(errors).length > 0
  ) {
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

function validateGoogleAuthData(input) {
  const credential =
    typeof input?.credential ===
    "string"
      ? input.credential.trim()
      : "";

  if (!credential) {
    throw new AppError(
      "A credencial do Google não foi informada.",
      422,
      {
        credential:
          "A credencial do Google é obrigatória.",
      }
    );
  }

  return credential;
}

function createGoogleUserName(
  payload,
  email
) {
  const googleName =
    typeof payload?.name === "string"
      ? payload.name.trim()
      : "";

  const fallbackName =
    email.split("@")[0];

  const name =
    googleName || fallbackName;

  return name.slice(0, 100);
}

function getGoogleAvatar(payload) {
  if (
    typeof payload?.picture !==
    "string"
  ) {
    return null;
  }

  const picture =
    payload.picture.trim();

  return picture || null;
}

export async function registerUser(
  input
) {
  const {
    name,
    email,
    password,
  } = validateRegistrationData(
    input
  );

  const existingUser =
    await prisma.user.findUnique({
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

  const passwordHash =
    await bcrypt.hash(
      password,
      PASSWORD_SALT_ROUNDS
    );

  try {
    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,

          // O cadastro público nunca
          // poderá criar administrador.
          role: "USER",
        },

        select:
          publicUserSelect,
      });

    const token =
      generateToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    // Impede duplicação caso
    // duas requisições sejam
    // feitas simultaneamente.
    if (error?.code === "P2002") {
      throw new AppError(
        "Já existe um usuário cadastrado com esse e-mail.",
        409
      );
    }

    throw error;
  }
}

export async function loginUser(
  input
) {
  const {
    email,
    password,
  } = validateLoginData(input);

  const user =
    await prisma.user.findUnique({
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

  if (!user.isActive) {
    throw new AppError(
      "Este usuário está desativado.",
      403
    );
  }

  if (!user.passwordHash) {
    throw new AppError(
      "Esta conta utiliza o acesso pelo Google. Entre usando o botão do Google.",
      401
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      "E-mail ou senha incorretos.",
      401
    );
  }

  const {
    passwordHash,
    ...publicUser
  } = user;

  const token =
    generateToken(publicUser);

  return {
    user: publicUser,
    token,
  };
}

export async function authenticateWithGoogle(
  input
) {
  const credential =
    validateGoogleAuthData(input);

  let payload;

  try {
    payload =
      await verifyGoogleCredential(
        credential
      );
  } catch {
    throw new AppError(
      "A autenticação com o Google é inválida ou expirou.",
      401
    );
  }

  const googleId =
    typeof payload?.sub === "string"
      ? payload.sub.trim()
      : "";

  const email = normalizeEmail(
    payload?.email
  );

  const emailVerified =
    payload?.email_verified === true;

  if (!googleId) {
    throw new AppError(
      "Não foi possível identificar a conta Google.",
      401
    );
  }

  if (
    !email ||
    !isValidEmail(email)
  ) {
    throw new AppError(
      "A conta Google não possui um endereço de e-mail válido.",
      422
    );
  }

  if (!emailVerified) {
    throw new AppError(
      "O e-mail da conta Google ainda não foi verificado.",
      422
    );
  }

  let user =
    await prisma.user.findUnique({
      where: {
        googleId,
      },

      select:
        publicUserSelect,
    });

  if (user) {
    if (!user.isActive) {
      throw new AppError(
        "Este usuário está desativado.",
        403
      );
    }

    const token =
      generateToken(user);

    return {
      user,
      token,
      isNewUser: false,
    };
  }

  const existingEmailUser =
    await prisma.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
        googleId: true,
      },
    });

  if (existingEmailUser) {
    throw new AppError(
      "Já existe uma conta cadastrada com esse e-mail. Entre com sua senha para acessar a conta.",
      409
    );
  }

  const name =
    createGoogleUserName(
      payload,
      email
    );

  const avatarUrl =
    getGoogleAvatar(payload);

  try {
    user =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: null,
          googleId,
          avatarUrl,
          role: "USER",
        },

        select:
          publicUserSelect,
      });
  } catch (error) {
    if (error?.code === "P2002") {
      throw new AppError(
        "Já existe uma conta associada a esse Google ou e-mail.",
        409
      );
    }

    throw error;
  }

  const token =
    generateToken(user);

  return {
    user,
    token,
    isNewUser: true,
  };
}