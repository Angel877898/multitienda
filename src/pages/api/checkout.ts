import type { APIRoute } from "astro";
import { resolveBrand, findProductById, siteUrl, isLocalUrl } from "@/lib/brand";
import { createCheckoutSession } from "@/lib/stripe";
import { ORDER_COOKIE, saveOrder } from "@/lib/order";

export const prerender = false;

// Crea una Checkout Session de Stripe en modo "elements" y devuelve su
// client_secret: con él, la ventana de compra muestra el formulario de pago
// incrustado (Payment Element) sin salir de la página.

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

  // Aquí NO se envía ningún correo: el PDF se entrega solo cuando Stripe
  // confirma el pago (página de gracias y webhook, ver src/lib/fulfill.ts).
  const metadata = { brand_id: brand.id, product_id: product.id };
  let session;
  try {
    session = await createCheckoutSession({
      ui_mode: "elements",
      mode: "payment",
      // Solo tarjeta: oculta Link ("Guardar mis datos…") y otros métodos del panel de Stripe.
      // Apple Pay / Google Pay siguen disponibles porque son pagos con tarjeta.
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: Math.round(product.price * 100),
            product_data: { name: product.name, description: product.summary },
          },
        },
      ],
      metadata,
      payment_intent_data: { description: `${brand.name}: ${product.name}`, metadata },
      // Solo se usa si el comprador elige un método que requiere redirección.
      return_url: `${base}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    });
  } catch (e) {
    console.error("[checkout]", e);
    const detail = e instanceof Error ? e.message : "";
    const msg = detail.includes("STRIPE_SECRET_KEY")
      ? "Falta configurar STRIPE_SECRET_KEY en el servidor."
      : "No se pudo iniciar el pago. Intenta de nuevo.";
    return json({ error: msg }, 502);
  }

  await saveOrder(locals.runtime.env, {
    orderId: session.id,
    brandId: brand.id,
    productId: product.id,
    email,
    createdAt: new Date().toISOString(),
  });

  // Guardamos el id de la sesión en este navegador: /gracias lo usa como
  // respaldo si llega sin ?session_id.
  cookies.set(ORDER_COOKIE, session.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: !local,
    maxAge: 60 * 60 * 24 * 7,
  });

  return json({ clientSecret: session.client_secret, sessionId: session.id });
};
