import {
  deleteOwnAccount,
  deleteUserByAdmin,
  getOwnProfile,
  getUserById,
  listAllUsers,
  updateOwnProfile,
  updateUserByAdmin,
} from "../services/userService.js";

export async function showOwnProfile(req, res) {
  const user = await getOwnProfile(req.user.id);

  return res.status(200).json({
    user,
  });
}

export async function updateOwnProfileController(req, res) {
  const user = await updateOwnProfile(
    req.user.id,
    req.body
  );

  return res.status(200).json({
    message: "Perfil atualizado com sucesso.",
    user,
  });
}

export async function deleteOwnAccountController(req, res) {
  await deleteOwnAccount(req.user.id, req.body);

  return res.status(200).json({
    message: "Conta excluída com sucesso.",
  });
}

export async function listUsersController(req, res) {
  const result = await listAllUsers(req.query);

  return res.status(200).json(result);
}

export async function showUserController(req, res) {
  const user = await getUserById(req.params.id);

  return res.status(200).json({
    user,
  });
}

export async function updateUserController(req, res) {
  const user = await updateUserByAdmin(
    req.user.id,
    req.params.id,
    req.body
  );

  return res.status(200).json({
    message: "Usuário atualizado com sucesso.",
    user,
  });
}

export async function deleteUserController(req, res) {
  await deleteUserByAdmin(
    req.user.id,
    req.params.id
  );

  return res.status(200).json({
    message: "Usuário excluído com sucesso.",
  });
}