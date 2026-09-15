# Tienda multimarca (Astro + Cloudflare) · venta de PDFs con Mercado Pago

Un solo repositorio para **varias tiendas**, cada una con su dominio, logo, colores, tipografía y
catálogo. Cada producto tiene su propia **landing de venta** (`dominio.com/<slug>`) y todas las
tiendas cobran en **una sola cuenta de Mercado Pago** (Checkout Pro vía Orders API). Al pagarse, el
comprador descarga el PDF al instante y además lo recibe por correo.

Tiendas incluidas: **Sanación Interior** y **Guías Tus Exámenes**.

Se publica en **Cloudflare Workers**: cada tienda es un Worker con el mismo código y **una variable
`BRAND`** distinta. Los PDFs viven en un bucket privado de **R2** por tienda y las órdenes en **Workers KV**.

---

## Ver una tienda en local

```bash
npm install
cp .env.example .env         # y rellena los valores
npm run pdfs:local           # copia los PDFs de private/ al R2 emulado (una vez)
npm run dev                  # http://localhost:4321
```

La tienda que ves se elige con `BRAND` en `.env` (`sanacion-interior` o `guias-tus-examenes`).
Guarda el archivo y el servidor se recarga solo.

`npm run preview` compila y corre el proyecto en el runtime real de Workers (`wrangler dev`).

---

## Publicar Sanación Interior en Cloudflare

### ¿PDFs en R2 o en GitHub?

**En R2.** Un Worker no puede leer archivos del repositorio en tiempo de ejecución; lo que pongas
en `public/` queda público para cualquiera, y el código del Worker tiene un límite de pocos MB
(Runas pesa 18 MB). R2 guarda los PDFs **privados**, con 10 GB gratis y sin costo de descarga.
Por eso `private/**/*.pdf` está en `.gitignore`: los PDFs no se suben a GitHub.

### 1. Cuenta, dominio y Wrangler

1. Crea tu cuenta en [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Agrega tu dominio** (`sanacioninterior.com`) en *Add a domain* y cambia los *nameservers* en
   tu registrador por los que te da Cloudflare. Espera a que diga **Active**.
3. En tu computadora, dentro del proyecto:
   ```bash
   npx wrangler login
   ```

### 2. Bucket R2 de la tienda y KV de órdenes

1. **Bucket R2** (uno por tienda, con el mismo nombre que su id): en el dashboard
   **R2 → Create bucket → `sanacion-interior`** y sube los PDFs a la **raíz** del bucket, con el
   mismo nombre que el campo `file` de cada producto. También puedes hacerlo por terminal:
   ```bash
   npx wrangler r2 bucket create sanacion-interior
   npm run pdfs:remote -- sanacion-interior
   ```
2. **KV de órdenes** (uno solo para todas las tiendas):
   ```bash
   npx wrangler kv namespace create ORDERS
   ```
   Imprime un `id`. Pégalo en **`wrangler.jsonc`** en las 3 líneas `PEGA_AQUI_EL_ID_DEL_KV` y
   regenera los tipos con `npm run cf-typegen`.

### 3. Subir el código a GitHub

```bash
git init
git add .
git commit -m "Tienda multimarca"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/tienda-multimarca.git
git push -u origin main
```

Revisa antes que `.env` y los PDFs **no** aparezcan en `git status` (están ignorados).

### 4. Crear el Worker conectado a GitHub (se publica solo con cada push)

1. Dashboard → **Workers & Pages → Create → Import a repository** → elige `tienda-multimarca`.
2. Configura:
   - **Project / Worker name:** `sanacion-interior` (debe coincidir con `env.sanacion.name`).
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy --env sanacion`
3. Guarda y despliega. La tienda queda en `https://sanacion-interior.<tu-cuenta>.workers.dev`.

> Alternativa sin GitHub: `npm run deploy:sanacion` desde tu computadora.

La variable `BRAND` **no** se configura en el dashboard: ya va en `wrangler.jsonc`
(`env.sanacion.vars.BRAND`), y es lo único que distingue a una tienda de otra.

### 5. Secretos (llaves) del Worker

En el Worker → **Settings → Variables and Secrets → Add** (tipo *Secret*), o por terminal:

```bash
npx wrangler secret put MP_ACCESS_TOKEN   --env sanacion
npx wrangler secret put DOWNLOAD_SECRET   --env sanacion
npx wrangler secret put RESEND_API_KEY    --env sanacion
npx wrangler secret put MP_WEBHOOK_SECRET --env sanacion
```

Usa el **Access Token de producción** de Mercado Pago cuando vayas a vender de verdad.

### 6. Dominio propio

Worker → **Settings → Domains & Routes → Add → Custom domain** → `sanacioninterior.com` y
`www.sanacioninterior.com`. Cloudflare crea el DNS y el certificado HTTPS.

### 7. Mercado Pago y Resend

- **Mercado Pago** → tu aplicación → **Webhooks → Configurar notificaciones** (modo productivo):
  URL `https://sanacioninterior.com/api/webhook`, evento **"Order (Mercado Pago)"**. Copia la
  clave secreta al secreto `MP_WEBHOOK_SECRET`. Esta única URL recibe los pagos de **todas** las
  tiendas.
- **Resend** → *Domains* → verifica el dominio del remitente (`topcursosonline.com`) agregando los
  registros DNS que te indica.

### 8. Probar

Abre el dominio, compra con Mercado Pago y confirma que ves la descarga en `/gracias` y que llega
el correo. Los errores se ven en el Worker → **Observability → Logs**.

---

## Agregar otra tienda (ej. Guías Tus Exámenes)

Ya está preparada en `wrangler.jsonc` (`env.guias`). Solo repite, para esa tienda:

1. Bucket R2 `guias-tus-examenes` con sus PDFs: `npx wrangler r2 bucket create guias-tus-examenes` y `npm run pdfs:remote -- guias-tus-examenes`
2. Otro Worker desde el mismo repositorio: nombre `guias-tus-examenes`, deploy command
   `npx wrangler deploy --env guias`.
3. Los mismos secretos con `--env guias`. **`DOWNLOAD_SECRET` y `MP_ACCESS_TOKEN` deben ser iguales**
   en todas las tiendas.
4. Su dominio propio. El webhook de Mercado Pago **no** se toca.

Para una tienda nueva: crea su archivo en `src/config/brands/`, sus PDFs en `private/<id>/` y un
bloque `env.<tienda>` en `wrangler.jsonc` copiando uno existente y cambiando `name`, `BRAND` y `bucket_name`.

---

## Variables y bindings

| Nombre | Dónde | Para qué |
|---|---|---|
| `BRAND` | `wrangler.jsonc` / `.env` | Tienda que sirve este Worker. |
| `MP_ACCESS_TOKEN` | secreto | **Access Token** de Mercado Pago (no la Public Key). |
| `MP_WEBHOOK_SECRET` | secreto | Valida la firma del webhook (recomendado). |
| `DOWNLOAD_SECRET` | secreto | Firma los enlaces de descarga. Igual en todas las tiendas. |
| `RESEND_API_KEY` | secreto | Envío del correo de entrega con [Resend](https://resend.com). |
| `PDFS` | binding R2 | Bucket de la tienda (`sanacion-interior`), PDFs en la raíz. |
| `ORDERS` | binding KV | Órdenes creadas (marca, producto, correo, entregada). |

> Las llaves reales van **solo** en `.env` (local) y en los secretos de Cloudflare. `.env.example`
> se sube a GitHub: nunca pongas ahí llaves reales.

---

## Estructura

```
src/
  config/
    brands/                 ⭐ una tienda por archivo (datos, colores, productos, textos de venta)
    types.ts                qué campos admite una tienda / producto
  pages/
    index.astro             home de la tienda (portadas + colección)
    [slug].astro            landing de venta de un producto
    gracias.astro           regreso de Mercado Pago: descarga inmediata si está pagado
    api/
      checkout.ts           crea la orden en Mercado Pago y la guarda en KV
      webhook.ts            recibe el aviso de pago y envía el PDF por correo
      download.ts           sirve el PDF desde R2 con enlace firmado y temporal
  components/sales/         secciones de venta (hero, beneficios, galería, oferta, FAQ…)
  lib/                      brand, theme, mercadopago, order, delivery, email, tokens, money
public/brands/<id>/         logo, emblemas, portadas y páginas de muestra (públicos)
private/<id>/*.pdf          PDFs originales (se suben a R2; no van a GitHub)
scripts/upload-pdfs.mjs     sube private/ a R2
wrangler.jsonc              Workers: una tienda por "env"
```

---

## Añadir un producto

Agrega un objeto a `products` de la tienda. Lo mínimo: `id`, `slug`, `name`, `summary`, `price`,
`file`, `cover`, `specs`, `hero` y `benefits`. `pain`, `quote`, `contents`, `previews`, `audience`,
`includes`, `bonuses`, `testimonials` y `faq` son opcionales. Lo que escribas entre `*asteriscos*`
en un titular se resalta.

- `theme`: colores propios del producto. `heroStyle: "dark"` pone el hero oscuro con `glow` y `pattern`.
- `emblem`, `cover.image` + `cover.ratio`: símbolo y portada real.
- `previews`: páginas reales del PDF para "Mira por dentro".

Después sube su PDF: `npm run pdfs:remote -- <id-de-la-tienda>`.

---

## Cómo funciona el pago

1. El comprador escribe su correo y `POST /api/checkout` crea una **orden** en Mercado Pago con el
   precio del servidor, la guarda en KV y lo redirige a pagar (tarjeta, saldo MP, OXXO o SPEI).
2. Al regresar a `/gracias`, si la orden ya está pagada ve el botón de descarga.
3. Mercado Pago avisa a `POST /api/webhook`; se consulta la orden real y, si está pagada, se envía
   el correo con un enlace firmado que caduca en 72 h.

### Probar en modo prueba

- El correo en la ventana de compra debe terminar en **`@testuser.com`**.
- Paga con tu **cuenta compradora de prueba** y una tarjeta de prueba (titular `APRO`).
- En local Mercado Pago no puede llamar al webhook: abre `/gracias` a mano.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo local (emula R2 y KV) |
| `npm run preview` | Build + runtime real de Workers en local |
| `npm run check` | Revisión de tipos |
| `npm run deploy:sanacion` | Build + publica el Worker de Sanación Interior |
| `npm run deploy:guias` | Build + publica el Worker de Guías Tus Exámenes |
| `npm run pdfs:local` / `pdfs:remote` | Sube `private/` al R2 local / de Cloudflare |
| `npm run cf-typegen` | Regenera tipos tras cambiar `wrangler.jsonc` |

> El aviso *"Invalid binding `SESSION`"* al compilar es informativo: la tienda no usa sesiones.

## Fiscal

Vender productos digitales en México implica emitir comprobantes e IVA. Revísalo con tu contador.
