import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "astro:env/server";

// Cliente mínimo de la API REST de Stripe con fetch (sin SDK de Node), ideal
// para Cloudflare Workers. Usamos Checkout Sessions con ui_mode "elements":
// el formulario de pago (Payment Element) se incrusta en nuestra página.
// https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=checkout

const API = "https://api.stripe.com/v1";

export interface CheckoutSession {
  id: string;
  client_secret?: string;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string>;
  amount_total?: number;
  currency?: string;
}

type Primitive = string | number | boolean;
type Params = { [key: string]: Primitive | undefined | Params | (Params | Primitive)[] };

/** Codifica objetos anidados al formato de Stripe: a[b][0][c]=valor, a[0]=valor. */
function encode(params: Params, prefix = "", out = new URLSearchParams()): URLSearchParams {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((v, i) =>
        typeof v === "object" ? encode(v, `${name}[${i}]`, out) : out.append(`${name}[${i}]`, String(v))
      );
    } else if (typeof value === "object") encode(value, name, out);
    else out.append(name, String(value));
  }
  return out;
}

function secretKey(): string {
  if (!STRIPE_SECRET_KEY) throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
  if (STRIPE_SECRET_KEY.startsWith("pk_")) {
    throw new Error("STRIPE_SECRET_KEY contiene la clave publicable (pk_…). Usa la secreta (sk_…).");
  }
  return STRIPE_SECRET_KEY;
}

async function stripe<T>(method: "GET" | "POST", path: string, params?: Params): Promise<T> {
  const body = params ? encode(params) : undefined;
  const url = method === "GET" && body ? `${API}${path}?${body}` : `${API}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: method === "POST" ? body : undefined,
  });
  const data = (await res.json()) as T & { error?: { message?: string; code?: string } };
  if (!res.ok) {
    throw new Error(`Stripe ${res.status}: ${data.error?.message ?? JSON.stringify(data)}`);
  }
  return data;
}

export function createCheckoutSession(params: Params): Promise<CheckoutSession> {
  return stripe<CheckoutSession>("POST", "/checkout/sessions", params);
}

export async function getCheckoutSession(id: string): Promise<CheckoutSession | null> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return null;
  try {
    return await stripe<CheckoutSession>("GET", `/checkout/sessions/${id}`);
  } catch (e) {
    console.error("[stripe] no se pudo leer la sesión", id, e);
    return null;
  }
}

/** Correo del comprador guardado en la sesión. */
export function sessionEmail(session: CheckoutSession): string {
  return (session.customer_details?.email || session.customer_email || "").toLowerCase();
}

/**
 * Verifica la firma del webhook (cabecera Stripe-Signature) con WebCrypto.
 * Esquema: HMAC-SHA256 de "<timestamp>.<cuerpo>" con el secreto whsec_…
 * https://docs.stripe.com/webhooks#verify-manually
 */
export async function verifyWebhook(rawBody: string, header: string | null): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) throw new Error("Falta la variable de entorno STRIPE_WEBHOOK_SECRET");
  if (!header) return false;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const timestamp = parts.find(([k]) => k === "t")?.[1];
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!timestamp || signatures.length === 0) return false;
  // Rechaza avisos de más de 5 minutos (protección contra repeticiones).
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${rawBody}`))
  );
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  return signatures.some((s) => timingSafeEqual(s, expected));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
