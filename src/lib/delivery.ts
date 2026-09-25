import { DOWNLOAD_SECRET } from "astro:env/server";
import type { Brand, Product } from "@/config/types";
import { getBrandById, findProductById } from "@/lib/brand";
import { sessionEmail, type CheckoutSession } from "@/lib/stripe";
import { signDownloadToken } from "@/lib/tokens";

export const DOWNLOAD_TTL_HOURS = 72;

export interface Purchase {
  brand: Brand;
  product: Product;
  email: string;
}

/** Obtiene marca, producto y correo a partir de una Checkout Session de Stripe. */
export function purchaseFromSession(session: CheckoutSession): Purchase | null {
  const brand = getBrandById(session.metadata?.brand_id ?? "");
  const productId = session.metadata?.product_id;
  const product = brand && productId ? findProductById(brand, productId) : undefined;
  const email = sessionEmail(session);
  if (!brand || !product || !email) return null;
  return { brand, product, email };
}

/** Genera la URL firmada y temporal para descargar el PDF. */
export async function downloadUrl(base: string, purchase: Purchase): Promise<string> {
  if (!DOWNLOAD_SECRET) throw new Error("Falta la variable de entorno DOWNLOAD_SECRET");
  const t = await signDownloadToken(
    DOWNLOAD_SECRET,
    purchase.brand.id,
    purchase.product.id,
    DOWNLOAD_TTL_HOURS
  );
  return `${base}/api/download?t=${encodeURIComponent(t)}`;
}

/** URL pública de la marca (dominio canónico) para los enlaces del correo. */
export function brandUrl(brand: Brand): string {
  return `https://${brand.domains[0]}`;
}
