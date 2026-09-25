// Registro de órdenes en Cloudflare Workers KV (binding ORDERS).
// Cada orden es una Checkout Session de Stripe. Aquí marcamos las ya
// entregadas para no enviar el PDF dos veces (el webhook y la página de
// gracias pueden intentar entregar la misma orden).

/** Cookie con el id de la Checkout Session creada por este navegador. */
export const ORDER_COOKIE = "order_ref";

export interface OrderRecord {
  /** Id de la Checkout Session de Stripe (cs_…). */
  orderId: string;
  brandId: string;
  productId: string;
  email: string;
  createdAt: string;
  deliveredAt?: string;
}

const key = (orderId: string) => `order:${orderId}`;
const VALID_ID = /^[A-Za-z0-9_]+$/;

export async function saveOrder(env: Env, record: OrderRecord): Promise<void> {
  await env.ORDERS.put(key(record.orderId), JSON.stringify(record));
}

export async function loadOrder(env: Env, orderId: string): Promise<OrderRecord | null> {
  if (!VALID_ID.test(orderId)) return null;
  return env.ORDERS.get<OrderRecord>(key(orderId), "json");
}

export async function markDelivered(env: Env, record: OrderRecord): Promise<void> {
  await saveOrder(env, { ...record, deliveredAt: new Date().toISOString() });
}
