import type { APIRoute } from "astro";
import { DOWNLOAD_SECRET } from "astro:env/server";
import { getBrandById, findProductById } from "@/lib/brand";
import { verifyDownloadToken } from "@/lib/tokens";

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const token = url.searchParams.get("t");
  if (!token) return new Response("Falta el token.", { status: 400 });
  if (!DOWNLOAD_SECRET) return new Response("Servidor mal configurado.", { status: 500 });

  const payload = await verifyDownloadToken(DOWNLOAD_SECRET, token);
  if (!payload) {
    return new Response(
      "Este enlace de descarga es inválido o ya expiró. Escríbenos para reenviártelo.",
      { status: 403 }
    );
  }

  const brand = getBrandById(payload.b);
  const product = brand ? findProductById(brand, payload.p) : undefined;
  if (!brand || !product) return new Response("Producto no encontrado.", { status: 404 });

  // Los PDFs viven en el bucket R2 PRIVADO de esta tienda, en la raíz: <archivo>.
  // Solo se sirven con un token válido; nunca son accesibles por URL directa.
  const objectKey = product.file;
  const object = await locals.runtime.env.PDFS.get(objectKey);
  if (!object) {
    console.error("[download] archivo no encontrado en R2:", objectKey);
    return new Response("El archivo no está disponible. Contáctanos.", { status: 404 });
  }

  return new Response(object.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${product.slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
};
