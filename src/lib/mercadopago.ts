import { MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET } from "astro:env/server";

// Checkout Pro vía Orders API (/v1/orders).
// Todas las marcas cobran en UNA sola cuenta de Mercado Pago. Orders API no
// admite metadata, así que la marca y el producto viajan en la propia orden:
//   external_reference = "<brandId>_<uuid>"
//   items[0].external_code = <productId>
// https://www.mercadopago.com.mx/developers/es/docs/checkout-pro-orders/overview

const API = "https://api.mercadopago.com";

export type OrderStatus =
  | "created" | "processing" | "action_required" | "processed"
  | "failed" | "canceled" | "refunded" | string;

export interface MpOrder {
  id: string;
  status: OrderStatus;
  status_detail?: string;
  external_reference?: string;
  checkout_url?: string;
  payer?: { email?: string };
  items?: { external_code?: string; title?: string }[];
}

function token(): string {
  if (!MP_ACCESS_TOKEN) throw new Error("Falta la variable de entorno MP_ACCESS_TOKEN");
  // La Public Key tiene forma de UUID (APP_USR-xxxxxxxx-xxxx-...); el Access Token no.
  if (/^(APP_USR|TEST)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(MP_ACCESS_TOKEN)) {
    throw new Error(
      "MP_ACCESS_TOKEN contiene la Public Key. Usa el Access Token (APP_USR-1234567890123456-...)."
    );
  }
  return MP_ACCESS_TOKEN;
}

/** Crea una orden de Checkout Pro y devuelve la orden (incluye checkout_url). */
export async function createOrder(
  body: Record<string, unknown>,
  idempotencyKey: string
): Promise<MpOrder> {
  const res = await fetch(`${API}/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token()}`,
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Mercado Pago order ${res.status}: ${await res.text()}`);
  }
  const order = (await res.json()) as MpOrder;
  if (!order.checkout_url) throw new Error("Mercado Pago no devolvió checkout_url");
  return order;
}

export async function getOrder(id: string): Promise<MpOrder | null> {
  if (!/^[A-Za-z0-9]+$/.test(id)) return null;
  const res = await fetch(`${API}/v1/orders/${id}`, {
    headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" },
  });
  if (!res.ok) {
    console.error("[mp] no se pudo leer la orden", id, res.status, await res.text());
    return null;
  }
  return (await res.json()) as MpOrder;
}

/** Orden pagada y acreditada. */
export function isPaid(order: MpOrder): boolean {
  return order.status === "processed" && (order.status_detail ?? "accredited") === "accredited";
}

/** Orden aún sin resolver (ej. OXXO o SPEI esperando el pago). */
export function isPending(order: MpOrder): boolean {
  return ["created", "processing", "action_required"].includes(order.status);
}

/**
 * Valida la cabecera x-signature del webhook.
 * Si MP_WEBHOOK_SECRET no está configurada se omite la validación
 * (igual se consulta la orden real a la API antes de entregar).
 */
export async function isValidWebhookSignature(request: Request, dataId: string): Promise<boolean> {
  if (!MP_WEBHOOK_SECRET) return true;
  const header = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=").map((s) => s.trim()) as [string, string])
  );
  if (!parts.ts || !parts.v1) return false;

  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  let manifest = `id:${id};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${parts.ts};`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(MP_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(manifest)));
  const hex = Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
  return hex === parts.v1;
}
