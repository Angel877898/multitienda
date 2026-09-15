/** Formatea un precio en pesos completos, ej. 350 -> "$350.00" */
export function formatMoney(amount: number, currency: "MXN" | "USD" = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
