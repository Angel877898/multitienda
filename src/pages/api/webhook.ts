import type { APIRoute } from "astro";
import { getCheckoutSession, verifyWebhook } from "@/lib/stripe";
import { fulfill } from "@/lib/fulfill";

export const prerender = false;

// Webhook de Stripe. Se configura en Stripe → Desarrolladores → Webhooks con
// la URL https://<dominio>/api/webhook y los eventos:
//   checkout.session.completed
//   checkout.session.async_payment_succeeded
// Una sola URL sirve para todas las tiendas: la marca va en la metadata de la sesión.

const ok = (msg: string) => new Response(msg, { status: 200 });

export const POST: APIRoute = async ({ request, locals }) => {
  const raw = await request.text();
  if (!(await verifyWebhook(raw, request.headers.get("stripe-signature")))) {
    return new Response("invalid signature", { status: 400 });
  }

  const event = JSON.parse(raw) as { type: string; data: { object: { id: string } } };
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return ok("ignored");
  }

  // Consultamos la sesión real a Stripe (fuente de verdad) antes de entregar.
  const session = await getCheckoutSession(event.data.object.id);
  if (!session) return new Response("cannot fetch session", { status: 500 });

  try {
    const result = await fulfill(locals.runtime.env, session);
    return ok(result.status);
  } catch (e) {
    console.error("[webhook] no se pudo entregar", session.id, e);
    // 500 para que Stripe reintente el aviso más tarde.
    return new Response("delivery failed", { status: 500 });
  }
};
