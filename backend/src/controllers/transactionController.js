import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} from "../services/transactionService.js";

export async function createTransactionController(
  req,
  res
) {
  const transaction =
    await createTransaction(
      req.user.id,
      req.body
    );

  return res.status(201).json({
    message:
      "Transação cadastrada com sucesso.",

    transaction,
  });
}

export async function listTransactionsController(
  req,
  res
) {
  const result =
    await listTransactions(
      req.user.id,
      req.query
    );

  return res.status(200).json(
    result
  );
}

export async function showTransactionController(
  req,
  res
) {
  const transaction =
    await getTransactionById(
      req.user.id,
      req.params.id
    );

  return res.status(200).json({
    transaction,
  });
}

export async function updateTransactionController(
  req,
  res
) {
  const transaction =
    await updateTransaction(
      req.user.id,
      req.params.id,
      req.body
    );

  return res.status(200).json({
    message:
      "Transação atualizada com sucesso.",

    transaction,
  });
}

export async function deleteTransactionController(
  req,
  res
) {
  await deleteTransaction(
    req.user.id,
    req.params.id
  );

  return res.status(200).json({
    message:
      "Transação excluída com sucesso.",
  });
}