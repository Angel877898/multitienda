// Sube los PDFs de private/<tienda>/ al bucket R2 de esa tienda (mismo nombre que su id),
// en la raíz del bucket. El nombre del archivo debe coincidir con "file" del producto.
//   node scripts/upload-pdfs.mjs --remote                      → todas las tiendas a Cloudflare
//   node scripts/upload-pdfs.mjs --remote sanacion-interior    → solo una tienda
//   node scripts/upload-pdfs.mjs --local                       → R2 emulado para `npm run dev`
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const mode = args.includes("--remote") ? "--remote" : args.includes("--local") ? "--local" : null;
const only = args.find((a) => !a.startsWith("--"));
if (!mode) {
  console.error("Indica --remote (Cloudflare) o --local (desarrollo).");
  process.exit(1);
}

let count = 0;
for (const brand of readdirSync("private")) {
  const dir = join("private", brand);
  if (!statSync(dir).isDirectory() || (only && brand !== only)) continue;
  for (const file of readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf"))) {
    const objectPath = `${brand}/${file}`; // <bucket>/<clave>
    console.log(`→ ${objectPath}`);
    execSync(
      `npx wrangler r2 object put "${objectPath}" --file "${join(dir, file)}" --content-type application/pdf ${mode}`,
      { stdio: "inherit" }
    );
    count++;
  }
}
console.log(`Listo: ${count} PDF(s) subidos (${mode}).`);
