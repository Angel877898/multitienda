import type { CheckoutSession } from "@/lib/stripe";
import { purchaseFromSession, downloadUrl, brandUrl, type Purchase } from "@/lib/delivery";
import { sendEmail, deliveryHtml } from "@/lib/email";
import { loadOrder, saveOrder, markDelivered } from "@/lib/order";

// Entrega de una compra pagada: correo con el enlace de descarga.
// La llaman el webhook de Stripe y la página de gracias; es segura de llamar
// varias veces para la misma sesión (se entrega una sola vez).
// https://docs.stripe.com/checkout/fulfillment

export type FulfillResult =
  | { status: "unpaid" }
  | { status: "invalid" }
  | { status: "delivered"; purchase: Purchase; alreadyDelivered: boolean };

export async function fulfill(env: Env, session: CheckoutSession): Promise<FulfillResult> {
  if (session.payment_status !== "paid") return { status: "unpaid" };

  const purchase = purchaseFromSession(session);
  if (!purchase) {
    console.error("[fulfill] sesión pagada sin datos utilizables", session.id, session.metadata);
    return { status: "invalid" };
  }

  const record = (await loadOrder(env, session.id)) ?? {
    orderId: session.id,
    brandId: purchase.brand.id,
    productId: purchase.product.id,
    email: purchase.email,
    createdAt: new Date().toISOString(),
  };
  if (record.deliveredAt) return { status: "delivered", purchase, alreadyDelivered: true };

  // Marcamos antes de enviar para reducir envíos dobles si el webhook y la
  // página de gracias llegan al mismo tiempo. Si el correo falla, se desmarca.
  await markDelivered(env, record);
  try {
    const link = await downloadUrl(brandUrl(purchase.brand), purchase);
    await sendEmail({
      from: `${purchase.brand.email.fromName} <${purchase.brand.email.from}>`,
      to: purchase.email,
      replyTo: purchase.brand.contact.supportEmail,
      subject: `Tu compra en ${purchase.brand.name}: ${purchase.product.name}`,
      html: deliveryHtml(purchase.brand, purchase.product.name, link),
    });
  } catch (e) {
    await saveOrder(env, { ...record, deliveredAt: undefined });
    throw e;
  }
  return { status: "delivered", purchase, alreadyDelivered: false };
}
