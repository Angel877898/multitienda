// Tipos que definen una marca y sus productos.
// Todo el branding y el contenido de venta vive en src/config/brands/:
// lanzar una marca o un producto = escribir datos, no código.

export type IconName =
  | "check" | "book" | "brain" | "heart" | "leaf" | "moon" | "sun" | "pen"
  | "target" | "clock" | "chart" | "shield" | "download" | "star" | "spark"
  | "lotus" | "flask" | "calculator" | "list" | "gift" | "users" | "lock";

export interface Theme {
  /** Color principal de la marca. */
  accent: string;
  onAccent: string;
  /** Color de los botones de compra. */
  cta: string;
  onCta: string;
  /** Color secundario para estrellas, subrayados y detalles. */
  highlight: string;
  bg: string;
  surface: string;
  /** Fondo de secciones alternas. */
  surfaceAlt: string;
  text: string;
  muted: string;
  line: string;
  /** Fondo de secciones oscuras (hero oscuro, CTA final, pie). */
  dark: string;
  onDark: string;
  /** Resplandor del hero oscuro (opcional; por defecto el acento). */
  glow?: string;
  /** "dark" = hero con fondo oscuro, resplandor y patrón. */
  heroStyle?: "light" | "dark";
  /** Imagen repetida sobre fondos oscuros (ej. estrellas). */
  pattern?: string;
  fontUrl?: string;
  fontHeading: string;
  fontBody: string;
  /** Tipografía de citas (opcional). */
  fontQuote?: string;
  radius: string;
  /** Peso tipográfico de los títulos. */
  headingWeight?: number;
}

export interface Product {
  /** Identificador interno estable. Nunca cambia (se usa en pagos y descargas). */
  id: string;
  /** URL del producto: dominio.com/<slug> */
  slug: string;
  /** Nombre comercial (checkout, correo, tarjetas). */
  name: string;
  /** Resumen de 1 línea para tarjetas y SEO. */
  summary: string;
  /** Precio en pesos completos: 349 = $349.00 */
  price: number;
  /** Precio anterior tachado (opcional, muestra % de descuento). */
  compareAtPrice?: number;
  currency: "MXN" | "USD";
  /** Nombre del PDF dentro de private/<brandId>/ */
  file: string;
  /** Producto principal de la home. */
  featured?: boolean;
  /** Etiqueta corta sobre el título, ej. "Más vendido". */
  badge?: string;
  /** Colores propios del producto (se mezclan con los de la marca). */
  theme?: Partial<Theme>;
  /** Emblema SVG del producto (línea dorada). */
  emblem?: string;

  /** Portada. Si no hay `image`, se genera una portada con los colores de la marca. */
  cover: {
    image?: string;
    /** Proporción ancho/alto de la imagen, ej. "783 / 1067". Por defecto 17 / 22. */
    ratio?: string;
    /** Texto pequeño superior de la portada generada. */
    kicker: string;
    /** Título grande de la portada generada. */
    title: string;
    /** Línea inferior de la portada generada. */
    footer?: string;
  };
  /** Ficha técnica visible junto al precio. */
  specs: { label: string; value: string }[];

  hero: {
    eyebrow: string;
    /** Titular. Envuelve entre *asteriscos* la parte a resaltar. */
    headline: string;
    subheadline: string;
    bullets: string[];
  };
  /** Frase destacada del material. */
  quote?: { text: string; source?: string };
  /** Problema → solución. */
  pain?: {
    title: string;
    items: string[];
    solution: string;
  };
  benefits: {
    title: string;
    items: { icon: IconName; title: string; text: string }[];
  };
  /** Páginas reales del PDF para la galería "Mira por dentro". */
  previews?: { src: string; caption: string }[];
  /** Índice / contenido del PDF. */
  contents?: {
    title: string;
    modules: { title: string; detail: string }[];
  };
  audience?: {
    forWho: string[];
    notFor?: string[];
  };
  /** Lista de lo que incluye (caja de oferta). */
  includes?: string[];
  bonuses?: { title: string; description: string; value: number }[];
  /** ⚠️ Usa solo testimonios REALES de clientes. */
  testimonials?: { name: string; detail: string; quote: string }[];
  /** Se suman a las preguntas generales de la marca. */
  faq?: { q: string; a: string }[];
  seo?: { title?: string; description?: string };
}

export interface Brand {
  /** Id interno (valor de BRAND en .env y carpeta de PDFs private/<id>/). */
  id: string;
  /** Dominios que sirven esta marca. El primero es el canónico. */
  domains: string[];
  name: string;
  tagline: string;
  /** Símbolo SVG (también favicon). */
  logoMark: string;
  /** Logo completo opcional; si falta se muestra símbolo + nombre. */
  logoFull?: string;
  /** Nombre en dos tonos junto al símbolo, ej. ["Sanación", "Interior"]. */
  logoWords?: [string, string];
  /** Imagen grande decorativa para la home (opcional). */
  heroArt?: string;
  /** Texto de la barra superior de anuncio (opcional). */
  announcement?: string;

  theme: Theme;

  home: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  /** Garantía mostrada en todas las landings (omite si no la ofreces). */
  guarantee?: { title: string; text: string };
  /** Preguntas frecuentes comunes a todos los productos de la marca. */
  faq: { q: string; a: string }[];

  /** Aviso legal breve para el pie de página (opcional). */
  legalNote?: string;

  contact: {
    supportEmail: string;
    whatsapp?: string;
  };
  email: {
    /** Remitente de los correos de entrega (dominio verificado en Resend). */
    from: string;
    fromName: string;
  };
  products: Product[];
}
