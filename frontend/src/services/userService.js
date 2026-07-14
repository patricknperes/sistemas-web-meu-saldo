import { api } from "./api.js";

// Rotas do próprio usuário

async function getOwnProfile() {
  const response = await api.get("/users/me");

  return response.data;
}

async function updateOwnProfile(userData) {
  const response = await api.patch(
    "/users/me",
    userData
  );

  return response.data;
}

async function deleteOwnAccount(password) {
  const response = await api.delete(
    "/users/me",
    {
      data: {
        password,
      },
    }
  );

  return response.data;
}

// Rotas administrativas

async function list() {
  const response = await api.get("/users");

  return response.data;
}

async function getById(id) {
  const response = await api.get(
    `/users/${id}`
  );

  return response.data;
}

async function update(id, userData) {
  const response = await api.patch(
    `/users/${id}`,
    userData
  );

  return response.data;
}

async function remove(id) {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
}

export const userService = {
  getOwnProfile,
  updateOwnProfile,
  deleteOwnAccount,
  list,
  getById,
  update,
  remove,
};