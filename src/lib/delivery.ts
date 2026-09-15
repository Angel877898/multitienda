import { DOWNLOAD_SECRET } from "astro:env/server";
import type { Brand, Product } from "@/config/types";
import { getBrandById, findProductById } from "@/lib/brand";
import type { MpOrder } from "@/lib/mercadopago";
import { signDownloadToken } from "@/lib/tokens";

export const DOWNLOAD_TTL_HOURS = 72;

export interface Purchase {
  brand: Brand;
  product: Product;
  email: string;
}

/**
 * external_reference de la orden: "<brandId>_<uuid sin guiones>".
 * Mercado Pago solo acepta letras, números, "-" y "_" (máx. 64 caracteres),
 * por eso los ids de marca no deben llevar "_".
 */
export function orderReference(brand: Brand): string {
  return `${brand.id}_${crypto.randomUUID().replace(/-/g, "")}`;
}

/**
 * Obtiene marca, producto y correo a partir de una orden de Mercado Pago.
 * El correo viene de nuestro registro (data/orders), porque la API de
 * Orders no lo devuelve.
 */
export function purchaseFromOrder(order: MpOrder, email?: string): Purchase | null {
  const brandId = (order.external_reference || "").split("_")[0];
  const brand = getBrandById(brandId);
  const productId = order.items?.[0]?.external_code;
  const product = brand && productId ? findProductById(brand, productId) : undefined;
  email = (email || order.payer?.email || "").toLowerCase();
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
