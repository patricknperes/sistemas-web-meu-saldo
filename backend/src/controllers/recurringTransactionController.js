import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionById,
  listRecurringTransactions,
  updateRecurringTransaction,
} from "../services/recurringTransactionService.js";

export async function listRecurringTransactionsController(
  req,
  res
) {
  const result =
    await listRecurringTransactions(
      req.user.id,
      {
        type: req.query.type,
        isActive:
          req.query.isActive,
        tagId: req.query.tagId,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
      }
    );

  return res.status(200).json(
    result
  );
}

export async function getRecurringTransactionController(
  req,
  res
) {
  const recurringTransaction =
    await getRecurringTransactionById(
      req.user.id,
      req.params.id
    );

  return res.status(200).json({
    recurringTransaction,
  });
}

export async function createRecurringTransactionController(
  req,
  res
) {
  const recurringTransaction =
    await createRecurringTransaction(
      req.user.id,
      req.body
    );

  return res.status(201).json({
    message:
      "Recorrência cadastrada com sucesso.",

    recurringTransaction,
  });
}

export async function updateRecurringTransactionController(
  req,
  res
) {
  const recurringTransaction =
    await updateRecurringTransaction(
      req.user.id,
      req.params.id,
      req.body
    );

  return res.status(200).json({
    message:
      "Recorrência atualizada com sucesso.",

    recurringTransaction,
  });
}

export async function deleteRecurringTransactionController(
  req,
  res
) {
  await deleteRecurringTransaction(
    req.user.id,
    req.params.id
  );

  return res.status(200).json({
    message:
      "Recorrência excluída com sucesso. As movimentações já registradas foram preservadas.",
  });
}