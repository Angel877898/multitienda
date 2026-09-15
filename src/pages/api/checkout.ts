import type { APIRoute } from "astro";
import { resolveBrand, findProductById, siteUrl, isLocalUrl } from "@/lib/brand";
import { createOrder } from "@/lib/mercadopago";
import { orderReference, downloadUrl } from "@/lib/delivery";
import { ORDER_COOKIE, saveOrder } from "@/lib/order";
import { sendEmail, deliveryHtml } from "@/lib/email";
import { TEST_DELIVERY_EMAILS } from "astro:env/server";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const brand = resolveBrand(request);

  let body: { email?: string; productId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Petición inválida." }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Escribe un correo válido." }, 400);
  }

  // Precio SIEMPRE desde la configuración del servidor, nunca del cliente.
  const product = findProductById(brand, body.productId || "");
  if (!product) return json({ error: "Producto no encontrado." }, 404);

  const base = siteUrl(request);
  const local = isLocalUrl(base);

  // ─── TEMPORAL: prueba del correo de entrega ─────────────────────────────────
  // Si el correo escrito está en TEST_DELIVERY_EMAILS, se envía de inmediato
  // (sin pagar) el correo de entrega con el PDF adjunto, y luego sigue el pago
  // normal. Quita la variable TEST_DELIVERY_EMAILS cuando termines de probar.
  const testEmails = (TEST_DELIVERY_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (testEmails.includes(email)) {
    try {
      const link = await downloadUrl(base, { brand, product, email });
      await sendEmail({
        from: `${brand.email.fromName} <${brand.email.from}>`,
        to: email,
        subject: `[PRUEBA] Tu compra en ${brand.name}: ${product.name}`,
        html: deliveryHtml(brand, product.name, link),
        attachments: [{ filename: `${product.slug}.pdf`, path: link }],
      });
      console.log("[checkout] correo de prueba enviado a", email);
    } catch (e) {
      console.error("[checkout] falló el correo de prueba", e);
      const detail = e instanceof Error ? e.message : String(e);
      return json({ error: `Prueba de correo falló: ${detail}` }, 502);
    }
  }
  // ────────────────────────────────────────────────────────────────────────────

  const amount = product.price.toFixed(2);
  const reference = orderReference(brand);

  const online: Record<string, string> = {
    success_url: `${base}/gracias`,
    pending_url: `${base}/gracias`,
    failure_url: `${base}/${product.slug}?pago=fallido`,
  };
  // Mercado Pago no permite regreso automático a URLs de localhost.
  if (!local) online.auto_return = "approved";

  let order;
  try {
    order = await createOrder(
      {
        type: "online",
        processing_mode: "manual",
        total_amount: amount,
        external_reference: reference,
        description: product.name,
        payer: { email },
        items: [
          {
            external_code: product.id,
            title: product.name,
            description: product.summary,
            category_id: "learnings",
            quantity: 1,
            unit_price: amount,
          },
        ],
        config: {
          statement_descriptor: brand.name.slice(0, 22),
          online,
        },
      },
      reference
    );
  } catch (e) {
    console.error("[checkout]", e);
    const detail = e instanceof Error ? e.message : "";
    const msg = detail.includes("MP_ACCESS_TOKEN")
      ? "Falta configurar MP_ACCESS_TOKEN en el servidor."
      : detail.includes("invalid_email_for_sandbox")
        ? "Modo de prueba: usa el correo de tu comprador de prueba de Mercado Pago (termina en @testuser.com)."
        : "No se pudo iniciar el pago. Intenta de nuevo.";
    return json({ error: msg }, 502);
  }

  await saveOrder(locals.runtime.env, {
    orderId: order.id,
    brandId: brand.id,
    productId: product.id,
    email,
    createdAt: new Date().toISOString(),
  });

  // Guardamos el id de la orden en este navegador: /gracias lo usa para
  // mostrar la descarga solo a quien inició este pago.
  cookies.set(ORDER_COOKIE, order.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: !local,
    maxAge: 60 * 60 * 24 * 7,
  });

  return json({ url: order.checkout_url });
};
