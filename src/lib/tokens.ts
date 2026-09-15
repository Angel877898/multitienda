// Enlaces de descarga firmados y con caducidad.
// El correo de entrega NO lleva el PDF adjunto: lleva un enlace a /api/download
// con un token firmado. Si alguien reenvía el enlace, deja de funcionar al expirar.
// Usa Web Crypto (disponible en Node 18+ y en Cloudflare Workers).

const enc = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(s: string): Uint8Array<ArrayBuffer> {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface DownloadPayload {
  b: string; // brand id
  p: string; // product id
  exp: number; // epoch seconds
}

/** Crea un token firmado para descargar un producto. `ttlHours` por defecto 72h. */
export async function signDownloadToken(
  secret: string,
  brandId: string,
  productId: string,
  ttlHours = 72
): Promise<string> {
  const payload: DownloadPayload = {
    b: brandId,
    p: productId,
    exp: Math.floor(Date.now() / 1000) + ttlHours * 3600,
  };
  const body = base64url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body)));
  return `${body}.${base64url(sig)}`;
}

/** Verifica un token. Devuelve el payload si es válido y no ha expirado, o null. */
export async function verifyDownloadToken(
  secret: string,
  token: string
): Promise<DownloadPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64url(sig),
    enc.encode(body)
  );
  if (!ok) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(body))) as DownloadPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
