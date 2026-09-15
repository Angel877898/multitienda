// Registro de órdenes en Cloudflare Workers KV (binding ORDERS).
// Mercado Pago no devuelve el correo que el comprador escribió en nuestra
// ventana de compra, así que lo guardamos aquí al crear la orden. También
// marca las órdenes ya entregadas para no enviar el PDF dos veces.

/** Cookie con el id de la orden de Mercado Pago creada por este navegador. */
export const ORDER_COOKIE = "order_ref";

export interface OrderRecord {
  orderId: string;
  brandId: string;
  productId: string;
  email: string;
  createdAt: string;
  deliveredAt?: string;
}

const key = (orderId: string) => `order:${orderId}`;

export async function saveOrder(env: Env, record: OrderRecord): Promise<void> {
  await env.ORDERS.put(key(record.orderId), JSON.stringify(record));
}

export async function loadOrder(env: Env, orderId: string): Promise<OrderRecord | null> {
  if (!/^[A-Za-z0-9]+$/.test(orderId)) return null;
  return env.ORDERS.get<OrderRecord>(key(orderId), "json");
}

export async function markDelivered(env: Env, record: OrderRecord): Promise<void> {
  await saveOrder(env, { ...record, deliveredAt: new Date().toISOString() });
}
