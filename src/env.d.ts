/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Bindings de Cloudflare (PDFS, ORDERS, BRAND) generados con `npm run cf-typegen`
// en worker-configuration.d.ts.
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
