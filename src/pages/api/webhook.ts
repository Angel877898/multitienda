import type { APIRoute } from "astro";
import { getOrder, isPaid, isValidWebhookSignature } from "@/lib/mercadopago";
import { purchaseFromOrder, downloadUrl, brandUrl } from "@/lib/delivery";
import { sendEmail, deliveryHtml } from "@/lib/email";
import { loadOrder, markDelivered } from "@/lib/order";

export const prerender = false;

// Con Orders API el webhook se configura UNA vez en el panel de Mercado Pago
// (evento "Order (Mercado Pago)") y sirve para todas las marcas: la marca se
// obtiene de la orden, no del dominio que recibe el aviso.

const ok = (msg: string) => new Response(msg, { status: 200 });

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const url = new URL(request.url);
  let orderId = url.searchParams.get("data.id") || "";
  let type = url.searchParams.get("type") || "";

  try {
    const parsed = JSON.parse(await request.text());
    orderId = orderId || String(parsed?.data?.id ?? "");
    type = type || parsed?.type || "";
  } catch {
    /* body vacío o no-JSON: seguimos con los query params */
  }

  if (type && type !== "order") return ok("ignored");
  if (!/^[A-Za-z0-9]+$/.test(orderId)) return ok("no id");

  if (!(await isValidWebhookSignature(request, orderId))) {
    return new Response("invalid signature", { status: 401 });
  }

  const record = await loadOrder(env, orderId);
  if (record?.deliveredAt) return ok("already delivered");

  // Nunca confiamos en el aviso: consultamos la orden real a Mercado Pago.
  const order = await getOrder(orderId);
  if (!order) return ok("cannot fetch");
  if (!isPaid(order)) return ok(`status ${order.status}`);

  const purchase = purchaseFromOrder(order, record?.email);
  if (!purchase) {
    console.error("[webhook] orden pagada sin datos utilizables", orderId, { record, order });
    return ok("no purchase data");
  }

  try {
    const link = await downloadUrl(brandUrl(purchase.brand), purchase);
    await sendEmail({
      from: `${purchase.brand.email.fromName} <${purchase.brand.email.from}>`,
      to: purchase.email,
      subject: `Tu compra en ${purchase.brand.name}: ${purchase.product.name}`,
      html: deliveryHtml(purchase.brand, purchase.product.name, link),
    });
  } catch (e) {
    console.error("[webhook] no se pudo entregar", orderId, e);
    // 500 para que Mercado Pago reintente la notificación más tarde.
    return new Response("delivery failed", { status: 500 });
  }

  if (record) await markDelivered(env, record);
  return ok("ok");
};

// GET para que Mercado Pago valide la URL al configurarla.
export const GET: APIRoute = async () => ok("ok");
