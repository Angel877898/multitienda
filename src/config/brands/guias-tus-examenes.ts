import type { Brand } from "../types";

export const guiasTusExamenes: Brand = {
  id: "guias-tus-examenes",
  domains: ["guiastusexamenes.com", "www.guiastusexamenes.com"],
  name: "Guías Tus Exámenes",
  tagline: "Guías de estudio claras para aprobar tu examen de admisión.",
  logoMark: "/brands/guias-tus-examenes/mark.svg",
  announcement: "Guías actualizadas para la convocatoria 2027 · Descarga inmediata",

  theme: {
    accent: "#1D4ED8",
    onAccent: "#FFFFFF",
    cta: "#FFC53D",
    onCta: "#0B1530",
    highlight: "#FFC53D",
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F1F5FC",
    text: "#0E1A33",
    muted: "#56617A",
    line: "#DFE5F0",
    dark: "#0B1530",
    onDark: "#EAF0FF",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap",
    fontHeading: "'Sora', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    radius: "14px",
    headingWeight: 800,
  },

  home: {
    headline: "Estudia lo que *sí viene* en tu examen",
    subheadline:
      "Guías con el temario explicado, reactivos tipo examen resueltos y simuladores para medir tu avance.",
  },

  // ⚠️ Confirma que ofreces esta política antes de publicar.
  guarantee: {
    title: "Garantía de satisfacción de 7 días",
    text:
      "Revisa la guía con calma. Si no te sirve, escríbenos dentro de los primeros 7 días y te devolvemos tu dinero.",
  },

  faq: [
    {
      q: "¿Cómo recibo la guía?",
      a: "Al confirmarse tu pago te enviaremos un correo con el envio del libro.",
    },
    {
      q: "¿Qué formas de pago aceptan?",
      a: "Tarjeta de crédito o débito, directamente en esta página.",
    },
    {
      q: "¿Está actualizada?",
      a: "Sí, está basada en la guía y temario publicados para la convocatoria vigente. Si hay cambios importantes te enviamos la actualización sin costo.",
    },
    {
      q: "¿Me garantiza quedar seleccionado?",
      a: "Ninguna guía puede garantizar un lugar: eso depende de tu preparación y del puntaje de corte. Lo que sí te damos es un plan claro y práctica real para llegar con ventaja.",
    },
  ],

  legalNote:
    "Guías Tus Exámenes es material de estudio independiente. No está afiliado ni avalado por la UNAM, el CENEVAL ni ninguna institución educativa.",

  contact: {
    supportEmail: "hola@guiastusexamenes.com",
  },
  email: {
    from: "entregas@guiastusexamenes.com",
    fromName: "Guías Tus Exámenes",
  },

  products: [
    {
      id: "guia-unam-area-2",
      slug: "guia-unam-area-2",
      name: "Guía UNAM Área 2 · Ciencias Biológicas, Químicas y de la Salud",
      summary: "Todo el temario del Área 2 explicado, con 1,200 reactivos resueltos y 4 simuladores.",
      price: 349,
      compareAtPrice: 599,
      currency: "MXN",
      file: "guia-unam-area-2.pdf",
      featured: true,
      badge: "Más vendida",
      cover: {
        kicker: "Examen de admisión UNAM",
        title: "Guía Área 2",
        footer: "Medicina · Odontología · Biología · Psicología",
      },
      specs: [
        { label: "Práctica", value: "1,200 reactivos + 4 simuladores" },
        { label: "Entrega", value: "Inmediata por correo" },
      ],
      hero: {
        eyebrow: "Examen de admisión a licenciatura",
        headline: "Prepárate para el Área 2 con *un plan claro* y práctica real",
        subheadline:
          "La guía que ordena todo el temario de Biología, Química, Física, Matemáticas y más, para que estudies lo importante y llegues con seguridad.",
        bullets: [
          "Temario completo explicado de forma sencilla",
          "1,200 reactivos tipo examen con solución paso a paso",
          "4 simuladores con hoja de respuestas",
        ],
      },
      pain: {
        title: "Estudiar sin guía es perder tiempo",
        items: [
          "No sabes qué temas pesan más ni por dónde empezar.",
          "Tienes decenas de PDFs sueltos y videos, pero nada ordenado.",
          "Resuelves ejercicios sin saber por qué fallaste.",
          "Te preocupa llegar al examen sin haber practicado con el formato real.",
        ],
        solution:
          "Esta guía reúne todo en un solo lugar, en el orden correcto, con explicaciones claras y práctica que se parece al examen.",
      },
      benefits: {
        title: "Por qué funciona",
        items: [
          { icon: "list", title: "Temario ordenado", text: "Cada materia dividida en temas cortos, del básico al avanzado." },
          { icon: "target", title: "Enfoque en lo que pesa", text: "Señalamos los temas con más reactivos para priorizar tu estudio." },
          { icon: "check", title: "Soluciones explicadas", text: "No solo la respuesta: el razonamiento para que no vuelvas a fallar." },
          { icon: "clock", title: "Simuladores cronometrados", text: "Practica con tiempo real y aprende a administrar tus minutos." },
          { icon: "chart", title: "Mide tu avance", text: "Tablas de autoevaluación para ver qué materias reforzar." },
          { icon: "calculator", title: "Plan de estudio", text: "Calendario de 8 semanas listo para seguir." },
        ],
      },
      contents: {
        title: "Temario incluido",
        modules: [
          { title: "Biología", detail: "Célula, genética, evolución, ecología y anatomía humana." },
          { title: "Química", detail: "Materia, tabla periódica, enlaces, reacciones y estequiometría." },
          { title: "Física", detail: "Cinemática, dinámica, energía, electricidad y ondas." },
          { title: "Matemáticas", detail: "Álgebra, geometría, trigonometría y funciones." },
          { title: "Español y Literatura", detail: "Comprensión lectora, gramática y corrientes literarias." },
          { title: "Historia, Geografía y Filosofía", detail: "Los temas clave resumidos en esquemas." },
          { title: "4 simuladores completos", detail: "120 reactivos cada uno con clave de respuestas." },
        ],
      },
      audience: {
        forWho: [
          "Vas a presentar el examen de la UNAM para una carrera del Área 2.",
          "Quieres estudiar por tu cuenta con un material ordenado.",
          "Ya presentaste y quieres subir tu puntaje esta vez.",
          "Tomas curso, pero necesitas más práctica tipo examen.",
        ],
      },
      bonuses: [
        { title: "Calendario de estudio de 8 semanas", description: "Qué estudiar cada día hasta la fecha del examen.", value: 99 },
        { title: "Formulario de Física y Química", description: "Todas las fórmulas en 4 páginas para repasar rápido.", value: 79 },
        { title: "Técnicas para responder bajo presión", description: "Estrategias de descarte y manejo del tiempo.", value: 69 },
      ],
      testimonials: [
        { name: "Testimonio de ejemplo", detail: "Reemplázalo por uno real", quote: "Lo mejor fueron los simuladores. Llegué al examen sabiendo exactamente cómo administrar mi tiempo." },
        { name: "Testimonio de ejemplo", detail: "Reemplázalo por uno real", quote: "Química era mi peor materia y con las explicaciones paso a paso por fin la entendí." },
        { name: "Testimonio de ejemplo", detail: "Reemplázalo por uno real", quote: "Seguí el calendario de 8 semanas al pie de la letra. Súper ordenado." },
      ],
      faq: [
        {
          q: "¿Sirve para Medicina?",
          a: "Sí. Medicina, Odontología, Enfermería, Psicología, Biología, Química y el resto de carreras del Área 2 presentan el mismo tipo de examen.",
        },
      ],
    },

    {
      id: "guia-exani-ii",
      slug: "guia-exani-ii",
      name: "Guía EXANI-II · Admisión",
      summary: "Pensamiento matemático, redacción y comprensión lectora con 800 reactivos resueltos.",
      price: 299,
      compareAtPrice: 499,
      currency: "MXN",
      file: "guia-exani-ii.pdf",
      badge: "Actualizada 2027",
      cover: {
        kicker: "Examen de admisión",
        title: "Guía EXANI-II",
        footer: "Módulos básicos + simuladores",
      },
      specs: [
        { label: "Práctica", value: "800 reactivos + 3 simuladores" },
        { label: "Entrega", value: "Inmediata por correo" },
      ],
      hero: {
        eyebrow: "Para universidades que aplican EXANI-II",
        headline: "Domina los módulos del EXANI-II y *sube tu puntaje*",
        subheadline:
          "Explicaciones cortas, ejemplos resueltos y práctica constante en las áreas que evalúa el examen.",
        bullets: [
          "Pensamiento matemático, redacción y comprensión lectora",
          "800 reactivos con solución explicada",
          "3 simuladores con el formato del examen",
        ],
      },
      benefits: {
        title: "Qué incluye",
        items: [
          { icon: "calculator", title: "Pensamiento matemático", text: "Aritmética, álgebra, geometría y probabilidad desde cero." },
          { icon: "book", title: "Comprensión lectora", text: "Estrategias para leer rápido y encontrar la idea principal." },
          { icon: "pen", title: "Redacción indirecta", text: "Ortografía, puntuación y cohesión con ejercicios prácticos." },
          { icon: "flask", title: "Módulos específicos", text: "Resúmenes de los módulos más solicitados por las universidades." },
        ],
      },
      contents: {
        title: "Contenido de la guía",
        modules: [
          { title: "Pensamiento matemático", detail: "Teoría breve + 300 reactivos." },
          { title: "Comprensión lectora", detail: "Lecturas modelo + 200 reactivos." },
          { title: "Redacción indirecta", detail: "Reglas clave + 200 reactivos." },
          { title: "Inglés como lengua extranjera", detail: "Diagnóstico + 100 reactivos." },
          { title: "3 simuladores completos", detail: "Con hoja de respuestas y clave." },
        ],
      },
      audience: {
        forWho: [
          "Tu universidad aplica el EXANI-II como examen de admisión.",
          "Quieres repasar lo básico de secundaria y prepa de forma ordenada.",
          "Necesitas practicar con reactivos parecidos a los reales.",
        ],
      },
      bonuses: [
        { title: "Guía rápida de ortografía", description: "Las 40 reglas que más aparecen en el examen.", value: 59 },
      ],
      testimonials: [
        { name: "Testimonio de ejemplo", detail: "Reemplázalo por uno real", quote: "Las matemáticas explicadas desde cero me salvaron. Muy fácil de seguir." },
        { name: "Testimonio de ejemplo", detail: "Reemplázalo por uno real", quote: "Hice los 3 simuladores y el examen real se sintió igual. Llegué tranquila." },
      ],
    },
  ],
};
