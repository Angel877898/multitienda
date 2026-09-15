PDFs originales de cada tienda, en una subcarpeta con el "id" de la tienda:

  private/sanacion-interior/Reset-21-Dias-Hooponopono_2.pdf
  private/guias-tus-examenes/guia-unam-area-2.pdf

El nombre del archivo debe coincidir con el campo "file" del producto en
src/config/brands/<tienda>.ts.

Estos PDFs NO se suben a GitHub (.gitignore). Se suben al bucket privado de
Cloudflare R2 de cada tienda (bucket con el mismo nombre que el id, PDFs en la raíz):

  npm run pdfs:remote -- sanacion-interior     (producción)
  npm run pdfs:local                           (desarrollo local)

y solo se entregan mediante /api/download con un enlace firmado y temporal.
