// @ts-check
import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// SSR ("server") es obligatorio: la marca y los pagos se resuelven en cada petición.
// Se despliega en Cloudflare Workers (ver wrangler.jsonc):
//   - Cada tienda es un Worker con su variable BRAND y su dominio.
//   - PDFs en un bucket R2 privado (binding PDFS), compartido por todas las tiendas.
//   - Órdenes en Workers KV (binding ORDERS), compartido por todas las tiendas.
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    // En `npm run dev` emula localmente R2, KV y las variables de wrangler.jsonc.
    platformProxy: { enabled: true },
    imageService: "passthrough",
  }),
  env: {
    // Todas se leen en tiempo de ejecución (access: "secret").
    schema: {
      // ⭐ Tienda que sirve este despliegue (id de src/config/brands/).
      BRAND: envField.string({ context: "server", access: "secret", optional: true }),
      // Stripe: UNA sola cuenta cobra todas las tiendas.
      // Clave secreta (sk_…), clave publicable (pk_…) y secreto del webhook (whsec_…).
      STRIPE_SECRET_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      STRIPE_PUBLISHABLE_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      DOWNLOAD_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});
