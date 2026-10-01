import { META_CAPI_TOKEN } from "astro:env/server";
import type { CheckoutSession } from "@/lib/stripe";
import type { Purchase } from "@/lib/delivery";
import type { OrderTracking } from "@/lib/order";

// Meta (Facebook / Instagram Ads): API de conversiones.
// El Pixel del navegador (BrandLayout) no ve todas las compras: bloqueadores,
// iOS, navegador de Instagram… Por eso cada compra pagada también se reporta
// desde el servidor. Ambos eventos usan el mismo event_id (id de la sesión de
// Stripe) y Meta los deduplica: la compra cuenta una sola vez.
// https://developers.facebook.com/docs/marketing-api/conversions-api

const GRAPH = "https://graph.facebook.com/v23.0";

/** Datos del evento Purchase (iguales en Pixel y en la API de conversiones). */
export function purchaseEventData(purchase: Purchase, session: CheckoutSession) {
  return {
    content_ids: [purchase.product.id],
    content_name: purchase.product.name,
    content_type: "product",
    num_items: 1,
    value: session.amount_total != null ? session.amount_total / 100 : purchase.product.price,
    currency: (session.currency ?? purchase.product.currency).toUpperCase(),
  };
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Reporta una compra a Meta desde el servidor. No hace nada si la marca no
 * tiene pixel, si falta META_CAPI_TOKEN o si el pago es de prueba.
 */
export async function sendPurchaseEvent(
  purchase: Purchase,
  session: CheckoutSession,
  tracking?: OrderTracking
): Promise<void> {
  const pixelId = purchase.brand.metaPixelId;
  if (!pixelId || !META_CAPI_TOKEN || !session.livemode) return;

  const userData: Record<string, unknown> = {
    em: [await sha256(purchase.email)],
    country: [await sha256("mx")],
  };
  if (tracking?.ip) userData.client_ip_address = tracking.ip;
  if (tracking?.ua) userData.client_user_agent = tracking.ua;
  if (tracking?.fbp) userData.fbp = tracking.fbp;
  if (tracking?.fbc) userData.fbc = tracking.fbc;

  const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: session.id,
          action_source: "website",
          event_source_url:
            tracking?.url ?? `https://${purchase.brand.domains[0]}/${purchase.product.slug}`,
          user_data: userData,
          custom_data: purchaseEventData(purchase, session),
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${await res.text()}`);
}
