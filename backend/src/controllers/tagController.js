import {
  createTag,
  deleteTag,
  getTagById,
  listTags,
  updateTag,
} from "../services/tagService.js";

export async function listTagsController(
  req,
  res
) {
  const tags = await listTags(
    req.user.id,
    {
      scope: req.query.scope,
      isActive: req.query.isActive,
      search: req.query.search,
    }
  );

  return res.status(200).json({
    tags,
    total: tags.length,
  });
}

export async function getTagController(
  req,
  res
) {
  const tag = await getTagById(
    req.user.id,
    req.params.id
  );

  return res.status(200).json({
    tag,
  });
}

export async function createTagController(
  req,
  res
) {
  const tag = await createTag(
    req.user.id,
    req.body
  );

  return res.status(201).json({
    message:
      "Tag cadastrada com sucesso.",
    tag,
  });
}

export async function updateTagController(
  req,
  res
) {
  const tag = await updateTag(
    req.user.id,
    req.params.id,
    req.body
  );

  return res.status(200).json({
    message:
      "Tag atualizada com sucesso.",
    tag,
  });
}

export async function deleteTagController(
  req,
  res
) {
  const result = await deleteTag(
    req.user.id,
    req.params.id
  );

  const wasDeactivated =
    result.deletionMode ===
    "DEACTIVATED";

  return res.status(200).json({
    message: wasDeactivated
      ? "A tag já estava sendo utilizada e foi desativada para preservar o histórico."
      : "Tag excluída com sucesso.",

    deletionMode:
      result.deletionMode,

    tag: result.tag,
  });
}