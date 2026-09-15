import { BRAND } from "astro:env/server";
import { brands } from "@/config/brands";
import type { Brand, Product } from "@/config/types";

/** Normaliza un host: quita el puerto y el prefijo www. */
function normalizeHost(host: string): string {
  return host.split(":")[0].replace(/^www\./, "").toLowerCase();
}

/**
 * Resuelve la marca de una petición:
 *   1. Variable BRAND → siempre esa marca (un Worker por tienda en Cloudflare).
 *   2. Si no hay BRAND → la marca dueña del dominio de la petición.
 *   3. Si nada coincide → la primera marca registrada.
 */
export function resolveBrand(request: Request): Brand {
  if (BRAND) {
    const byEnv = getBrandById(BRAND);
    if (byEnv) return byEnv;
    console.warn(
      `[tienda] BRAND="${BRAND}" no existe. Opciones: ${brands.map((b) => b.id).join(", ")}`
    );
  }

  const h = normalizeHost(hostFromRequest(request));
  const byDomain = brands.find((b) => b.domains.some((d) => normalizeHost(d) === h));
  return byDomain ?? brands[0];
}

export function hostFromRequest(request: Request): string {
  return (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    new URL(request.url).host
  );
}

/** URL base absoluta de la petición (respeta proxies con https). */
export function siteUrl(request: Request): string {
  const proto =
    request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return `${proto}://${hostFromRequest(request)}`;
}

export function isLocalUrl(base: string): boolean {
  return /\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|\/|$)/.test(base);
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function findProductBySlug(brand: Brand, slug: string): Product | undefined {
  return brand.products.find((p) => p.slug === slug);
}

export function findProductById(brand: Brand, id: string): Product | undefined {
  return brand.products.find((p) => p.id === id);
}

export function featuredProduct(brand: Brand): Product | undefined {
  return brand.products.find((p) => p.featured) ?? brand.products[0];
}
