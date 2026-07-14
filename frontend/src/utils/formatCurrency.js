export function formatCurrency(amountCents = 0) {
  const amount = amountCents / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}