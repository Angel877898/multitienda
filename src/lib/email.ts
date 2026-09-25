import { RESEND_API_KEY } from "astro:env/server";
import type { Brand } from "@/config/types";
import { DOWNLOAD_TTL_HOURS } from "@/lib/delivery";

interface SendArgs {
  from: string; // "Nombre <correo@dominio.com>"
  to: string;
  subject: string;
  html: string;
  /** A dónde llegan las respuestas del cliente. */
  replyTo?: string;
}

/** Envía un correo con Resend (https://resend.com). */
export async function sendEmail({ from, to, subject, html, replyTo }: SendArgs): Promise<void> {
  if (!RESEND_API_KEY) throw new Error("Falta la variable de entorno RESEND_API_KEY");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  });
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  }
}

/** HTML del correo de entrega, con los colores de la marca. */
export function deliveryHtml(brand: Brand, productName: string, url: string): string {
  const t = brand.theme;
  return `
  <div style="background:${t.surfaceAlt};padding:32px 16px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;color:${t.text}">
      <p style="margin:0 0 20px;font-weight:700;color:${t.accent};font-size:15px">${escapeHtml(brand.name)}</p>
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 12px">¡Gracias por tu compra!</h1>
      <p style="margin:0 0 24px;color:${t.muted};line-height:1.6">
        Aquí tienes <strong style="color:${t.text}">${escapeHtml(productName)}</strong>.
        El enlace es personal y caduca en ${DOWNLOAD_TTL_HOURS} horas: descarga el PDF y guárdalo en tu dispositivo.
      </p>
      <a href="${url}"
         style="display:inline-block;background:${t.cta};color:${t.onCta};text-decoration:none;
                padding:14px 28px;border-radius:10px;font-weight:700">
        Descargar mi PDF
      </a>
      <p style="color:${t.muted};font-size:13px;margin:28px 0 0;line-height:1.6">
        ¿Algún problema con la descarga? Responde este correo o escríbenos a
        ${escapeHtml(brand.contact.supportEmail)}.
      </p>
    </div>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
