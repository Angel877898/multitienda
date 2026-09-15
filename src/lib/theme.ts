import type { Theme } from "@/config/types";

/** Mezcla el tema de la marca con los colores propios de un producto. */
export function mergeTheme(base: Theme, override?: Partial<Theme>): Theme {
  return { ...base, ...override };
}

/** Variables CSS de un tema (solo colores), para aplicarlas en cualquier contenedor. */
export function colorVars(t: Partial<Theme>): string {
  const map: [string, string | undefined][] = [
    ["--accent", t.accent],
    ["--on-accent", t.onAccent],
    ["--cta", t.cta],
    ["--on-cta", t.onCta],
    ["--highlight", t.highlight],
    ["--bg", t.bg],
    ["--surface", t.surface],
    ["--surface-alt", t.surfaceAlt],
    ["--text", t.text],
    ["--muted", t.muted],
    ["--line", t.line],
    ["--dark", t.dark],
    ["--on-dark", t.onDark],
    ["--glow", t.glow ?? t.accent],
    ["--pattern", t.pattern ? `url("${t.pattern}")` : undefined],
  ];
  return map
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

/** Todas las variables CSS del tema (colores + tipografía + forma). */
export function themeVars(t: Theme): string {
  const isSerif = /serif/.test(t.fontHeading) && !/sans-serif/.test(t.fontHeading);
  return [
    colorVars(t),
    t.pattern ? "" : "--pattern:none",
    `--radius:${t.radius}`,
    `--radius-sm:calc(${t.radius} * .6)`,
    `--font-heading:${t.fontHeading}`,
    `--font-body:${t.fontBody}`,
    `--font-quote:${t.fontQuote ?? t.fontHeading}`,
    `--heading-weight:${t.headingWeight ?? 700}`,
    `--hl-style:${isSerif ? "italic" : "normal"}`,
  ]
    .filter(Boolean)
    .join(";");
}
