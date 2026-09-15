import type { APIRoute } from "astro";
import { resolveBrand, findProductById, siteUrl, isLocalUrl } from "@/lib/brand";
import { createOrder } from "@/lib/mercadopago";
import { orderReference } from "@/lib/delivery";
import { ORDER_COOKIE, saveOrder } from "@/lib/order";

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
