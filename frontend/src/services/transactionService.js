import { api } from "./api.js";

async function list(params = {}) {
  const response = await api.get("/transactions", {
    params,
  });

  return response.data;
}

async function getById(id) {
  const response = await api.get(
    `/transactions/${id}`
  );

  return response.data;
}

async function create(transactionData) {
  const response = await api.post(
    "/transactions",
    transactionData
  );

  return response.data;
}

async function update(id, transactionData) {
  const response = await api.patch(
    `/transactions/${id}`,
    transactionData
  );

  return response.data;
}

async function remove(id) {
  const response = await api.delete(
    `/transactions/${id}`
  );

  return response.data;
}

export const transactionService = {
  list,
  getById,
  create,
  update,
  remove,
};