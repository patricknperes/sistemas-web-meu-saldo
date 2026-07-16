import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import {
  DEFAULT_TAGS,
} from "../constants/defaultTags.js";

const VALID_TAG_SCOPES = [
  "INCOME",
  "EXPENSE",
  "BOTH",
];

const VALID_TRANSACTION_TYPES = [
  "INCOME",
  "EXPENSE",
];

const MAX_TAGS_PER_TRANSACTION = 10;

const tagSelect = {
  id: true,
  name: true,
  normalizedName: true,
  color: true,
  scope: true,
  isDefault: true,
  isActive: true,
  userId: true,
  createdAt: true,
  updatedAt: true,

  _count: {
    select: {
      transactionLinks: true,
      recurringLinks: true,
    },
  },
};

function validatePositiveId(
  value,
  entityName,
) {
  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new AppError(
      `Identificador de ${entityName} inválido.`,
      400,
    );
  }

  return id;
}

function validateAllowedFields(
  input,
  allowedFields,
) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new AppError(
      "O corpo da requisição é inválido.",
      400,
    );
  }

  const invalidFields =
    Object.keys(input).filter(
      (field) =>
        !allowedFields.includes(field),
    );

  if (invalidFields.length > 0) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }
}

export function normalizeTagName(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^\p{L}\p{N}]+/gu,
      "-",
    )
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function validateTagName(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "O nome da tag é obrigatório.",
      422,
    );
  }

  const name = value
    .trim()
    .replace(/\s+/g, " ");

  if (name.length < 2) {
    throw new AppError(
      "O nome da tag deve possuir pelo menos 2 caracteres.",
      422,
    );
  }

  if (name.length > 40) {
    throw new AppError(
      "O nome da tag deve possuir no máximo 40 caracteres.",
      422,
    );
  }

  const normalizedName =
    normalizeTagName(name);

  if (!normalizedName) {
    throw new AppError(
      "O nome da tag precisa possuir letras ou números.",
      422,
    );
  }

  return {
    name,
    normalizedName,
  };
}

function validateTagColor(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "A cor da tag precisa ser informada.",
      422,
    );
  }

  const color =
    value.trim().toUpperCase();

  if (
    !/^#[0-9A-F]{6}$/.test(color)
  ) {
    throw new AppError(
      "A cor da tag deve estar no formato hexadecimal, como #3B82F6.",
      422,
    );
  }

  return color;
}

function validateTagScope(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "O escopo da tag é obrigatório.",
      422,
    );
  }

  const scope =
    value.trim().toUpperCase();

  if (
    !VALID_TAG_SCOPES.includes(
      scope,
    )
  ) {
    throw new AppError(
      "O escopo da tag deve ser INCOME, EXPENSE ou BOTH.",
      422,
    );
  }

  return scope;
}

function validateTransactionType(value) {
  if (typeof value !== "string") {
    throw new AppError(
      "O tipo da transação é obrigatório.",
      422,
    );
  }

  const type =
    value.trim().toUpperCase();

  if (
    !VALID_TRANSACTION_TYPES.includes(
      type,
    )
  ) {
    throw new AppError(
      "O tipo da transação deve ser INCOME ou EXPENSE.",
      422,
    );
  }

  return type;
}

function validateBoolean(
  value,
  fieldName,
) {
  if (typeof value !== "boolean") {
    throw new AppError(
      `O campo ${fieldName} deve ser verdadeiro ou falso.`,
      422,
    );
  }

  return value;
}

function parseBooleanFilter(
  value,
  defaultValue,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
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
    400,
  );
}

function serializeTag(tag) {
  const {
    _count,
    ...tagData
  } = tag;

  const transactionUsageCount =
    _count?.transactionLinks ?? 0;

  const recurringUsageCount =
    _count?.recurringLinks ?? 0;

  return {
    ...tagData,

    transactionUsageCount,
    recurringUsageCount,

    usageCount:
      transactionUsageCount +
      recurringUsageCount,
  };
}

function handlePrismaTagError(error) {
  if (error?.code === "P2002") {
    throw new AppError(
      "Já existe uma tag com esse nome.",
      409,
    );
  }

  throw error;
}

async function findOwnedTag(
  userId,
  tagId,
) {
  const tag =
    await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },

      select: tagSelect,
    });

  if (!tag) {
    throw new AppError(
      "Tag não encontrada.",
      404,
    );
  }

  return tag;
}

/**
 * Cria as tags iniciais somente quando
 * o usuário ainda não possui nenhuma tag.
 *
 * Dessa forma, uma tag removida, desativada
 * ou personalizada não será recriada sempre
 * que o usuário acessar o sistema.
 */
export async function ensureDefaultTagsForUser(
  userIdValue,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  const existingTagCount =
    await prisma.tag.count({
      where: {
        userId,
      },
    });

  if (existingTagCount > 0) {
    return;
  }

  try {
    await prisma.$transaction(
      DEFAULT_TAGS.map((tag) =>
        prisma.tag.create({
          data: {
            ...tag,
            userId,
          },
        }),
      ),
    );
  } catch (error) {
    /*
     * Duas requisições podem tentar criar
     * as tags iniciais ao mesmo tempo.
     *
     * Caso uma delas já tenha criado, a
     * segunda pode continuar normalmente.
     */
    if (error?.code !== "P2002") {
      throw error;
    }
  }
}

export async function listTags(
  userIdValue,
  filters = {},
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  await ensureDefaultTagsForUser(
    userId,
  );

  const where = {
    userId,
  };

  const isActive =
    parseBooleanFilter(
      filters.isActive,
      true,
    );

  if (isActive !== null) {
    where.isActive = isActive;
  }

  if (
    filters.scope !== undefined &&
    filters.scope !== null &&
    filters.scope !== ""
  ) {
    const scope =
      validateTagScope(
        filters.scope,
      );

    if (scope === "BOTH") {
      where.scope = "BOTH";
    } else {
      where.scope = {
        in: [
          scope,
          "BOTH",
        ],
      };
    }
  }

  if (
    typeof filters.search ===
      "string" &&
    filters.search.trim()
  ) {
    const normalizedSearch =
      normalizeTagName(
        filters.search,
      );

    if (normalizedSearch) {
      where.normalizedName = {
        contains:
          normalizedSearch,
      };
    }
  }

  const tags =
    await prisma.tag.findMany({
      where,

      select: tagSelect,

      orderBy: [
        {
          isDefault: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

  return tags.map(serializeTag);
}

export async function getTagById(
  userIdValue,
  tagIdValue,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  const tagId =
    validatePositiveId(
      tagIdValue,
      "tag",
    );

  const tag =
    await findOwnedTag(
      userId,
      tagId,
    );

  return serializeTag(tag);
}

export async function createTag(
  userIdValue,
  input,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  validateAllowedFields(input, [
    "name",
    "color",
    "scope",
  ]);

  const {
    name,
    normalizedName,
  } = validateTagName(
    input.name,
  );

  const color =
    input.color === undefined
      ? "#64748B"
      : validateTagColor(
          input.color,
        );

  const scope =
    input.scope === undefined
      ? "BOTH"
      : validateTagScope(
          input.scope,
        );

  const existingTag =
    await prisma.tag.findUnique({
      where: {
        userId_normalizedName: {
          userId,
          normalizedName,
        },
      },

      select: tagSelect,
    });

  if (existingTag?.isActive) {
    throw new AppError(
      "Já existe uma tag ativa com esse nome.",
      409,
    );
  }

  /*
   * Caso a tag tenha sido removida anteriormente,
   * reutilizamos o mesmo registro para preservar
   * os vínculos com o histórico.
   */
  if (existingTag) {
    const reactivatedTag =
      await prisma.tag.update({
        where: {
          id: existingTag.id,
        },

        data: {
          name,
          color,
          scope,
          isActive: true,
        },

        select: tagSelect,
      });

    return serializeTag(
      reactivatedTag,
    );
  }

  try {
    const tag =
      await prisma.tag.create({
        data: {
          name,
          normalizedName,
          color,
          scope,
          isDefault: false,
          isActive: true,
          userId,
        },

        select: tagSelect,
      });

    return serializeTag(tag);
  } catch (error) {
    handlePrismaTagError(error);
  }
}

export async function updateTag(
  userIdValue,
  tagIdValue,
  input,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  const tagId =
    validatePositiveId(
      tagIdValue,
      "tag",
    );

  validateAllowedFields(input, [
    "name",
    "color",
    "scope",
    "isActive",
  ]);

  await findOwnedTag(
    userId,
    tagId,
  );

  const updateData = {};

  if (input.name !== undefined) {
    const {
      name,
      normalizedName,
    } = validateTagName(
      input.name,
    );

    updateData.name = name;
    updateData.normalizedName =
      normalizedName;
  }

  if (input.color !== undefined) {
    updateData.color =
      validateTagColor(
        input.color,
      );
  }

  if (input.scope !== undefined) {
    updateData.scope =
      validateTagScope(
        input.scope,
      );
  }

  if (
    input.isActive !== undefined
  ) {
    updateData.isActive =
      validateBoolean(
        input.isActive,
        "isActive",
      );
  }

  if (
    Object.keys(updateData)
      .length === 0
  ) {
    throw new AppError(
      "Informe pelo menos um campo para atualizar a tag.",
      422,
    );
  }

  try {
    const updatedTag =
      await prisma.tag.update({
        where: {
          id: tagId,
        },

        data: updateData,

        select: tagSelect,
      });

    return serializeTag(
      updatedTag,
    );
  } catch (error) {
    handlePrismaTagError(error);
  }
}

export async function deleteTag(
  userIdValue,
  tagIdValue,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  const tagId =
    validatePositiveId(
      tagIdValue,
      "tag",
    );

  const tag =
    await findOwnedTag(
      userId,
      tagId,
    );

  const usageCount =
    tag._count.transactionLinks +
    tag._count.recurringLinks;

  /*
   * Tags já utilizadas no histórico não
   * são apagadas fisicamente.
   *
   * Elas são apenas desativadas para não
   * aparecerem em novos cadastros.
   */
  if (usageCount > 0) {
    const deactivatedTag =
      await prisma.tag.update({
        where: {
          id: tagId,
        },

        data: {
          isActive: false,
        },

        select: tagSelect,
      });

    return {
      deletionMode:
        "DEACTIVATED",

      tag: serializeTag(
        deactivatedTag,
      ),
    };
  }

  await prisma.tag.delete({
    where: {
      id: tagId,
    },
  });

  return {
    deletionMode: "DELETED",

    tag: serializeTag(tag),
  };
}

/**
 * Valida uma lista de tags antes de vinculá-la
 * a uma receita, despesa ou recorrência.
 *
 * Essa função será reutilizada por:
 *
 * - transactionService.js
 * - recurringTransactionService.js
 */
export async function validateTagIdsForUser(
  userIdValue,
  tagIdsValue,
  transactionTypeValue,
) {
  const userId =
    validatePositiveId(
      userIdValue,
      "usuário",
    );

  const transactionType =
    validateTransactionType(
      transactionTypeValue,
    );

  if (
    tagIdsValue === undefined ||
    tagIdsValue === null
  ) {
    return [];
  }

  if (!Array.isArray(tagIdsValue)) {
    throw new AppError(
      "O campo tagIds deve ser uma lista.",
      422,
    );
  }

  const tagIds = [
    ...new Set(
      tagIdsValue.map(
        (tagId) =>
          validatePositiveId(
            tagId,
            "tag",
          ),
      ),
    ),
  ];

  if (
    tagIds.length >
    MAX_TAGS_PER_TRANSACTION
  ) {
    throw new AppError(
      `Uma movimentação pode possuir no máximo ${MAX_TAGS_PER_TRANSACTION} tags.`,
      422,
    );
  }

  if (tagIds.length === 0) {
    return [];
  }

  const tags =
    await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },

        userId,
      },

      select: {
        id: true,
        name: true,
        scope: true,
        isActive: true,
      },
    });

  if (
    tags.length !==
    tagIds.length
  ) {
    throw new AppError(
      "Uma ou mais tags não existem ou não pertencem ao usuário autenticado.",
      422,
    );
  }

  const inactiveTag =
    tags.find(
      (tag) =>
        !tag.isActive,
    );

  if (inactiveTag) {
    throw new AppError(
      `A tag "${inactiveTag.name}" está desativada.`,
      422,
    );
  }

  const incompatibleTag =
    tags.find(
      (tag) =>
        tag.scope !== "BOTH" &&
        tag.scope !==
          transactionType,
    );

  if (incompatibleTag) {
    const expectedType =
      transactionType ===
      "INCOME"
        ? "receitas"
        : "despesas";

    throw new AppError(
      `A tag "${incompatibleTag.name}" não pode ser utilizada em ${expectedType}.`,
      422,
    );
  }

  /*
   * Mantém a mesma ordem dos IDs recebidos,
   * o que facilita a exibição no frontend.
   */
  const tagsById =
    new Map(
      tags.map((tag) => [
        tag.id,
        tag,
      ]),
    );

  return tagIds.map(
    (tagId) =>
      tagsById.get(tagId),
  );
}