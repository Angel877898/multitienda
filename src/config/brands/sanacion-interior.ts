import type { Brand } from "../types";

const IMG = "/brands/sanacion-interior";
const STARS = `${IMG}/stars.svg`;

export const sanacionInterior: Brand = {
  id: "sanacion-interior",
  domains: ["sanaciondeinterior.com", "www.sanaciondeinterior.com"],
  name: "Sanación Interior",
  tagline: "Energía · Emoción · Bienestar",
  logoMark: `${IMG}/mark.svg`,
  logoWords: ["Sanación", "Interior"],
  heroArt: `${IMG}/flower.svg`,
  announcement: "Toda la colección a $99 MXN · Descarga inmediata en tu correo",

  // Branding: noche morada con estrellas y oro (del logo y las portadas).
  theme: {
    accent: "#4B2A84",
    onAccent: "#FFFFFF",
    cta: "#D4B35E",
    onCta: "#1E1433",
    highlight: "#D4B35E",
    bg: "#FBF9FE",
    surface: "#FFFFFF",
    surfaceAlt: "#F3EEFA",
    text: "#1E1433",
    muted: "#655C78",
    line: "#E5DDF0",
    dark: "#241838",
    onDark: "#F6F1FF",
    glow: "#6B3FB8",
    heroStyle: "dark",
    pattern: STARS,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Lora:ital,wght@1,400;1,500&display=swap",
    fontHeading: "'Poppins', system-ui, sans-serif",
    fontBody: "'Poppins', system-ui, sans-serif",
    fontQuote: "'Lora', Georgia, serif",
    radius: "18px",
    headingWeight: 700,
  },

  home: {
    eyebrow: "Energía · Emoción · Bienestar",
    headline: "Herramientas para *sanar lo que sigues cargando*",
    subheadline:
      "Cuadernos, cartas y guías en PDF para soltar, perdonar y volver a ti. Descárgalos al instante y úsalos a tu ritmo, en tu celular o impresos.",
  },

  // ⚠️ Confirma que ofreces esta política antes de publicar.
  guarantee: {
    title: "Garantía de tranquilidad de 7 días",
    text:
      "Si el material no es lo que esperabas, escríbenos dentro de los 7 días posteriores a tu compra " +
      "y te devolvemos tu dinero. Sin preguntas incómodas.",
  },

  faq: [
    {
      q: "¿Cómo recibo mi material?",
      a: "En cuanto se confirma tu pago te aparece el botón de descarga y te enviamos el enlace a tu correo. Es un PDF que guardas para siempre.",
    },
    {
      q: "¿Cómo puedo pagar?",
      a: "Con tarjeta de crédito o débito (Visa, Mastercard o American Express), directamente en esta página. El pago lo procesa Stripe de forma segura: tus datos de tarjeta nunca pasan por nuestros servidores.",
    },
    {
      q: "¿Lo puedo usar en el celular o imprimir?",
      a: "Las dos cosas. Puedes leerlo o llenarlo en tu celular, tablet o computadora, o imprimirlo las veces que quieras para ti.",
    },
    {
      q: "¿Puedo compartirlo?",
      a: "El material es para tu uso personal y el de tu familia. No está permitida su reventa ni redistribución.",
    },
    {
      q: "¿Sustituye una terapia o un tratamiento?",
      a: "No. Son herramientas de autoconocimiento, bienestar y acompañamiento espiritual que complementan, pero no reemplazan, la atención de un profesional de la salud.",
    },
  ],

  legalNote:
    "Los materiales de Sanación Interior son de bienestar, autoconocimiento y acompañamiento espiritual; no sustituyen atención médica ni psicológica profesional.",

  contact: {
    // ⚠️ Confirma el buzón exacto.
    supportEmail: "soporte@topcursosonline.com",
  },
  email: {
    // Dominio verificado en Resend. Las respuestas van a contact.supportEmail.
    from: "entregas@sanaciondeinterior.com",
    fromName: "Sanación Interior",
  },

  products: [
    // ─────────────────────────────── RESET 21 DÍAS ───────────────────────────────
    {
      id: "reset-21-dias-hooponopono",
      slug: "reset-21-dias",
      name: "Reset de 21 días con Ho'oponopono",
      summary:
        "Cuaderno interactivo con 21 lecturas guiadas y 21 hojas de trabajo para soltar lo que sigues cargando con cuatro frases.",
      price: 99,
      currency: "MXN",
      file: "Reset-21-Dias-Hooponopono_2.pdf",
      featured: true,
      badge: "Cuaderno interactivo",
      emblem: `${IMG}/emblems/reset.svg`,
      theme: {
        accent: "#5B21B6",
        glow: "#8B45E8",
        dark: "#1A0B38",
        surfaceAlt: "#F2ECFC",
        line: "#E4DAF5",
        pattern: STARS,
      },
      cover: {
        image: `${IMG}/products/reset-21-dias/cover.webp`,
        ratio: "1000 / 1294",
        kicker: "Cuaderno interactivo",
        title: "Reset de 21 días",
      },
      specs: [
        { label: "Formato", value: "PDF interactivo y rellenable" },
        { label: "Extensión", value: "62 páginas" },
        { label: "Ritmo", value: "10 a 20 minutos al día" },
      ],
      hero: {
        eyebrow: "Ho'oponopono · Edición 2026",
        headline: "21 días para soltar *lo que sigues cargando*",
        subheadline:
          "Lo siento. Perdóname. Gracias. Te amo. Cuatro frases de Ho'oponopono, una lectura corta y una hoja de trabajo al día para limpiar el resentimiento, la culpa y el ruido interno.",
        bullets: [
          "21 lecturas guiadas y 21 hojas de trabajo rellenables",
          "Kit de limpieza de emergencia para 12 situaciones reales",
          "Tarjetas de bolsillo recortables con las cuatro frases",
        ],
      },
      pain: {
        title: "Si estás aquí, algo ya te pesa",
        items: [
          "Una conversación que nunca tuviste y que sigues repasando en tu cabeza.",
          "Un enojo tan viejo que ya ni lo llamas enojo: lo llamas «carácter».",
          "Leíste libros, escuchaste podcasts y te dijiste que ya lo habías superado… pero sigue ahí.",
          "Quieres soltar, pero no sabes cómo sostenerlo todos los días.",
        ],
        solution:
          "No se va a ir porque lo entiendas. Se va a ir cuando dejes de pelearte con eso y empieces a limpiarlo: 21 días, cuatro frases, unos minutos al día.",
      },
      quote: {
        text: "No estás limpiando a la otra persona. Estás limpiando la copia de esa persona que vive dentro de ti.",
        source: "Reset de 21 días",
      },
      benefits: {
        title: "Qué vas a trabajar en 21 días",
        items: [
          { icon: "lotus", title: "Las cuatro frases, explicadas", text: "Qué hace cada una —reconocer, liberar, aceptar, transformar— y por qué se dicen en ese orden." },
          { icon: "heart", title: "Madre, padre y niño interior", text: "Soltar lo que heredaste sin traicionar a nadie y darle un lugar a la parte de ti que sigue esperando." },
          { icon: "leaf", title: "Soltar el resentimiento", text: "El rencor más viejo, la relación que duele hoy y la expectativa de que el otro cambie." },
          { icon: "sun", title: "Dinero, cuerpo y hogar", text: "Las memorias que se esconden en la cartera, en tu cuerpo y en tu propio espacio." },
          { icon: "chart", title: "Mapa de carga y tracker", text: "Mides cuánto te pesa cada área antes del Día 1 y lo comparas al terminar." },
          { icon: "shield", title: "Kit de emergencia", text: "Qué hacer si te llega un mensaje que te altera, no puedes dormir o discutiste con alguien." },
        ],
      },
      contents: {
        title: "El recorrido de 21 días",
        modules: [
          { title: "Semana 1 · Reconocer", detail: "Dejar de culpar, separar tu dolor del heredado y practicar cada una de las cuatro frases." },
          { title: "Semana 2 · Limpiar", detail: "El resentimiento más viejo, madre y padre, tu niño interior, dinero, cuerpo y hogar." },
          { title: "Semana 3 · Soltar y recibir", detail: "Soltar el control, la expectativa y la historia; aprender a recibir y firmar tu pacto." },
          { title: "Día 22 · Carta a tu yo de dentro de un año", detail: "Para cerrar el proceso y medir de verdad lo que se movió." },
          { title: "Para el resto de tu vida", detail: "Kit de limpieza de emergencia y tarjetas de bolsillo para llevar contigo." },
        ],
      },
      previews: [
        { src: `${IMG}/products/reset-21-dias/page-1.webp`, caption: "Las cuatro frases" },
        { src: `${IMG}/products/reset-21-dias/page-2.webp`, caption: "Mapa de los 21 días" },
        { src: `${IMG}/products/reset-21-dias/page-3.webp`, caption: "Tu compromiso" },
        { src: `${IMG}/products/reset-21-dias/page-4.webp`, caption: "Kit de emergencia" },
      ],
      audience: {
        forWho: [
          "Cargas un enojo, una culpa o una relación que no has podido soltar.",
          "Te atrae el Ho'oponopono y quieres practicarlo con un método diario.",
          "Buscas algo concreto: 10 a 20 minutos al día, no teoría infinita.",
          "Quieres un proceso que puedas llenar en tu celular o imprimir.",
        ],
        notFor: [
          "Esperas resultados milagrosos sin aparecer los 21 días.",
          "Atraviesas una crisis que necesita atención profesional inmediata.",
        ],
      },
      includes: [
        "21 lecturas guiadas",
        "21 hojas de trabajo rellenables",
        "Mapa de carga, compromiso y tracker de 21 días",
        "Kit de limpieza de emergencia",
        "Tarjetas de bolsillo recortables",
      ],
      faq: [
        {
          q: "¿Necesito saber de Ho'oponopono?",
          a: "No. El cuaderno explica de dónde viene, qué significa cada frase y cómo practicarla. No es una religión ni te pide cambiar tu fe.",
        },
        {
          q: "¿Qué pasa si me salto un día?",
          a: "No reinicias: retomas donde te quedaste. El día que fallaste no borra los anteriores.",
        },
      ],
    },

    // ─────────────────────────────── CARTAS DE PERDÓN ───────────────────────────────
    {
      id: "cartas-de-perdon",
      slug: "cartas-de-perdon",
      name: "Cartas de Perdón · 30 cartas guiadas",
      summary:
        "Cuadernillo imprimible y rellenable con 30 cartas guiadas para decir, por fin, lo que nunca dijiste.",
      price: 99,
      currency: "MXN",
      file: "Cartas-de-Perdon_1.pdf",
      badge: "Cuadernillo imprimible",
      emblem: `${IMG}/emblems/cartas.svg`,
      theme: {
        accent: "#7A2C73",
        glow: "#B04C9E",
        dark: "#26102A",
        highlight: "#E7C27A",
        cta: "#E7C27A",
        surfaceAlt: "#F8EEF5",
        line: "#EEDCE9",
        pattern: STARS,
      },
      cover: {
        image: `${IMG}/products/cartas-de-perdon/cover.webp`,
        ratio: "1000 / 1294",
        kicker: "Cuadernillo imprimible",
        title: "Cartas de Perdón",
      },
      specs: [
        { label: "Formato", value: "PDF imprimible y rellenable" },
        { label: "Extensión", value: "102 páginas" },
        { label: "Contenido", value: "30 cartas en 4 secciones" },
      ],
      hero: {
        eyebrow: "Escritura terapéutica",
        headline: "Di lo que *nunca te atreviste* a decir",
        subheadline:
          "30 cartas guiadas para mamá, para papá, para ti y para quien se fue. Sin consecuencias y sin que nadie te conteste: solo tú, el papel y todo lo que llevas guardado.",
        bullets: [
          "30 cartas con frases guía para no quedarte en blanco",
          "Un ritual de cierre después de cada carta",
          "Llénalo en tu tablet o imprímelo y escríbelo a mano",
        ],
      },
      pain: {
        title: "Lo que no se dice, no se va",
        items: [
          "Tienes una conversación que has repetido mil veces: en la regadera, manejando, a las tres de la mañana.",
          "La persona ya no está, no lo entendería o hablarlo abriría algo que ya no se puede cerrar.",
          "Se te quedó atorado un «gracias», un «perdón» o un «adiós».",
        ],
        solution:
          "Las conversaciones pendientes no se resuelven pensándolas más. Se resuelven diciéndolas. Este cuadernillo te da el lugar seguro para hacerlo.",
      },
      quote: {
        text: "No escribes para que el otro entienda. Escribes para dejar de cargarlo tú.",
        source: "Cartas de Perdón",
      },
      benefits: {
        title: "Cómo funciona cada carta",
        items: [
          { icon: "pen", title: "1 · Sacar", text: "Escribes sin filtro y sin corregir. Aquí no se busca la verdad objetiva: se busca tu verdad." },
          { icon: "heart", title: "2 · Decir", text: "Lees la carta en voz alta. El cuerpo escucha su propia voz diciendo lo que nunca dijo." },
          { icon: "leaf", title: "3 · Cerrar", text: "Haces algo físico con ella: guardarla, quemarla o enterrarla. El cerebro necesita un evento." },
          { icon: "sun", title: "4 · Volver", text: "Días después relees lo que escribiste y descubres que algo sí se movió." },
        ],
      },
      contents: {
        title: "Las 30 cartas",
        modules: [
          { title: "Cartas a mamá · 7 cartas", detail: "Lo que nunca te dije, la niña o el niño que te esperaba, gracias aunque me cueste, te perdono aunque no me lo pidas…" },
          { title: "Cartas a papá · 7 cartas", detail: "El padre que tuve y el que necesitaba, lo que aprendí de tu silencio, el enojo que nunca te mostré…" },
          { title: "Cartas a mí · 8 cartas", detail: "Perdón por cómo te he hablado, carta a mi niño interior, a mi cuerpo, la carta de amor que nunca me escribí…" },
          { title: "Cartas a quien se fue · 8 cartas", detail: "La última conversación que no tuvimos, al amor que terminó, a quien sigue vivo pero ya no está, carta de despedida." },
          { title: "Después de escribir", detail: "Qué hacer con cada carta: leerla en voz alta, esperar 24 horas y decidir si guardarla, quemarla o —casi nunca— enviarla." },
        ],
      },
      previews: [
        { src: `${IMG}/products/cartas-de-perdon/page-1.webp`, caption: "Índice de las 30 cartas" },
        { src: `${IMG}/products/cartas-de-perdon/page-2.webp`, caption: "Cómo funciona una carta" },
        { src: `${IMG}/products/cartas-de-perdon/page-3.webp`, caption: "Carta 01 · A mamá" },
        { src: `${IMG}/products/cartas-de-perdon/page-4.webp`, caption: "Qué hacer con la carta" },
      ],
      audience: {
        forWho: [
          "Hay algo que nunca le dijiste a tu mamá, a tu papá o a alguien que ya no está.",
          "Estás atravesando un duelo, una ruptura o un distanciamiento.",
          "Te cuesta perdonarte y te hablas con dureza.",
          "Escribir te ayuda a ordenar lo que sientes.",
        ],
        notFor: [
          "Buscas un guion para mandarle un mensaje a alguien hoy mismo.",
          "Necesitas acompañamiento profesional por un trauma o un duelo muy reciente.",
        ],
      },
      includes: [
        "30 cartas guiadas en 4 secciones",
        "Ritual de cierre para cada carta",
        "Tracker «Mis 30 cartas»",
        "Guía «Qué hacer con la carta»",
      ],
      faq: [
        {
          q: "¿Tengo que enviar las cartas?",
          a: "No. Ninguna está pensada para enviarse. El cuadernillo incluye una guía para decidir qué hacer con cada una, y la regla es nunca enviarla el mismo día.",
        },
        {
          q: "¿En qué orden las escribo?",
          a: "No hay orden obligatorio: empieza por la sección que te apriete el pecho al leerla. Una carta por sesión, nunca dos.",
        },
      ],
    },

    // ─────────────────────────────── RUNAS PROHIBIDAS ───────────────────────────────
    {
      id: "runas-prohibidas-de-sanacion",
      slug: "runas-prohibidas-de-sanacion",
      name: "Runas Prohibidas de Sanación",
      summary:
        "Guía ilustrada de runas y rituales sencillos para acompañar tu bienestar en cuerpo, mente y espíritu.",
      price: 99,
      currency: "MXN",
      file: "1013594980-Runes-ES.pdf",
      badge: "Guía ilustrada a color",
      emblem: `${IMG}/emblems/runas.svg`,
      theme: {
        accent: "#7A5230",
        glow: "#8A5E34",
        dark: "#231810",
        onDark: "#F4EAD8",
        highlight: "#C9A25E",
        cta: "#C9A25E",
        onCta: "#231810",
        bg: "#FBF8F3",
        surfaceAlt: "#F3EBDD",
        line: "#E7DAC6",
        text: "#2A1E14",
        muted: "#6E5E4D",
        pattern: `${IMG}/runes-pattern.svg`,
      },
      cover: {
        image: `${IMG}/products/runas-prohibidas-de-sanacion/cover.webp`,
        ratio: "1000 / 1405",
        kicker: "Sanación ancestral",
        title: "Runas Prohibidas",
      },
      specs: [
        { label: "Formato", value: "PDF ilustrado a color" },
        { label: "Extensión", value: "80 páginas" },
        { label: "Contenido", value: "15 áreas de bienestar" },
      ],
      hero: {
        eyebrow: "Sanación ancestral para los tiempos modernos",
        headline: "La sabiduría de las runas, *en rituales que puedes hacer hoy*",
        subheadline:
          "Una guía visual que reúne las runas nórdicas y su significado con rituales sencillos —agua, sal, hierbas y velas— para acompañar tu bienestar en 15 áreas de tu vida.",
        bullets: [
          "Cada runa con su descripción, uso, visión espiritual y un consejo práctico",
          "Rituales paso a paso con ingredientes que tienes en casa",
          "Organizada por áreas: corazón, mente, sueño, energía, piel y más",
        ],
      },
      pain: {
        title: "Una tradición antigua, por fin en orden",
        items: [
          "Te llaman la atención las runas, pero no sabes qué significa cada símbolo.",
          "Encuentras información suelta y confusa, sin nada práctico que hacer con ella.",
          "Buscas rituales de bienestar sencillos, sin materiales difíciles de conseguir.",
        ],
        solution:
          "Esta guía ordena las runas por áreas de tu vida y te dice cómo trazarlas, qué susurrar y qué ritual hacer en cada caso.",
      },
      quote: {
        text: "Todo descanso termina con nueva luz.",
        source: "Runas Prohibidas de Sanación",
      },
      benefits: {
        title: "Qué encontrarás en la guía",
        items: [
          { icon: "star", title: "Fichas de cada runa", text: "Raido, Sowilo, Uruz, Algiz, Dagaz y muchas más, con su significado y cómo usarlas." },
          { icon: "flask", title: "Rituales paso a paso", text: "Compresas, inhalaciones con hierbas y velas, con ingredientes e instrucciones claras." },
          { icon: "moon", title: "Descanso y calma", text: "Runas y prácticas para preparar la noche y bajar el estrés del día." },
          { icon: "sun", title: "Energía y vitalidad", text: "Rituales para el ánimo, la concentración y la sensación de fuerza interior." },
          { icon: "spark", title: "Visión espiritual", text: "El sentido simbólico de cada runa y una frase para meditar con ella." },
          { icon: "lotus", title: "Hecha para practicar", text: "Un consejo breve por runa para integrarla a tu rutina diaria." },
        ],
      },
      contents: {
        title: "Las 15 áreas de bienestar",
        modules: [
          { title: "Corazón y circulación", detail: "Runas del ritmo, el equilibrio y la vitalidad, con compresas y rituales de vela." },
          { title: "Mente, ánimo y descanso", detail: "Enfoque, memoria, calma frente al estrés y rituales para un sueño reparador." },
          { title: "Defensas y respiración", detail: "Runas protectoras y prácticas con vapor de hierbas." },
          { title: "Energía, metabolismo y digestión", detail: "Prácticas para sentirte con más vitalidad y ligereza." },
          { title: "Piel, cabello, uñas, articulaciones y alivio", detail: "Rituales de cuidado para el cuerpo en el día a día." },
          { title: "Mujer, salud oral y visual", detail: "Runas y prácticas de acompañamiento para cada etapa." },
        ],
      },
      previews: [
        { src: `${IMG}/products/runas-prohibidas-de-sanacion/page-1.webp`, caption: "Tu guía de bienestar" },
        { src: `${IMG}/products/runas-prohibidas-de-sanacion/page-2.webp`, caption: "Fichas de runas" },
        { src: `${IMG}/products/runas-prohibidas-de-sanacion/page-3.webp`, caption: "Rituales paso a paso" },
        { src: `${IMG}/products/runas-prohibidas-de-sanacion/page-4.webp`, caption: "Runas del sueño" },
      ],
      audience: {
        forWho: [
          "Te atraen las runas, la espiritualidad nórdica o los rituales de bienestar.",
          "Quieres una guía visual y ordenada, no información dispersa.",
          "Buscas prácticas sencillas para incorporar a tu rutina.",
        ],
        notFor: ["Buscas un sustituto de tratamiento médico: esta guía es de acompañamiento espiritual."],
      },
      includes: [
        "Fichas ilustradas de cada runa",
        "Rituales con ingredientes e instrucciones",
        "15 áreas de bienestar",
        "Índice por área para encontrar cada práctica",
      ],
      faq: [
        {
          q: "¿Necesito experiencia con runas?",
          a: "No. Cada runa viene explicada desde cero: qué simboliza, cómo trazarla o usarla y un consejo práctico.",
        },
        {
          q: "¿Es un tratamiento para la salud?",
          a: "No. Las runas y sus interpretaciones se presentan con fines educativos y de desarrollo espiritual. Para cualquier tema de salud consulta siempre a un profesional.",
        },
      ],
    },

    // ─────────────────────── LAS HERIDAS QUE MARCARON MI HISTORIA ───────────────────────
    {
      id: "las-heridas-que-marcaron-mi-historia",
      slug: "heridas-que-marcaron-mi-historia",
      askAddress: true,
      name: "Las heridas que marcaron mi historia",
      summary:
        "Libro digital para comprender tu pasado —la infancia, mamá, papá y las cinco heridas— y elegir un presente más libre.",
      price: 99,
      currency: "MXN",
      file: "Las_heridas_que_marcaron_mi_historia_PDF.pdf",
      badge: "Libro digital",
      emblem: `${IMG}/emblems/heridas.svg`,
      theme: {
        heroStyle: "light",
        accent: "#9A5B2E",
        glow: "#C98A55",
        highlight: "#D6A86A",
        cta: "#9A5B2E",
        onCta: "#FFFFFF",
        bg: "#FDFBF7",
        surfaceAlt: "#F6EFE6",
        line: "#EADFD2",
        text: "#2F2A27",
        muted: "#6F665F",
        dark: "#3A302B",
        onDark: "#FBF4EA",
      },
      cover: {
        image: `${IMG}/products/heridas-que-marcaron-mi-historia/cover.webp`,
        ratio: "783 / 1067",
        kicker: "Un viaje hacia mi sanación",
        title: "Las heridas que marcaron mi historia",
      },
      specs: [
        { label: "Formato", value: "Libro digital (PDF)" },
        { label: "Extensión", value: "118 páginas · 8 capítulos" },
        { label: "Autora", value: "Normacaminoemocional" },
      ],
      hero: {
        eyebrow: "Un viaje hacia mi sanación",
        headline: "Comprender mi pasado para *elegir un presente más libre*",
        subheadline:
          "Un recorrido cálido y sin juicios por tu infancia, la huella de mamá y papá, las cinco heridas emocionales y ese niño interior que todavía te habla.",
        bullets: [
          "8 capítulos en 3 partes: mirar, reconocer y reencontrarte",
          "Las cinco heridas: rechazo, abandono, humillación, traición e injusticia",
          "Preguntas y reflexiones para escuchar a tu niño interior",
        ],
      },
      pain: {
        title: "¿Por qué soy como soy?",
        items: [
          "Te cuesta decir que no y sientes que necesitas agradar.",
          "Una crítica pequeña te duele durante días.",
          "Tienes miedo de que alguien se vaya, o te alejas antes de que te dejen.",
          "Sientes que tienes que poder con todo y te cuesta pedir ayuda.",
        ],
        solution:
          "A veces la pregunta no es «¿qué me pasa?», sino «¿qué me pasó?». No para buscar culpables: para dejar de juzgarte por la forma en que aprendiste a protegerte.",
      },
      quote: {
        text: "Una herida no es una identidad.",
        source: "Las heridas que marcaron mi historia",
      },
      benefits: {
        title: "Lo que este libro te ayuda a ver",
        items: [
          { icon: "brain", title: "Herida no es personalidad", text: "Descubre qué parte de lo que llamas «así soy» fue en realidad una forma de protegerte." },
          { icon: "heart", title: "La huella de mamá", text: "Lo que recibiste, lo que faltó y lo que hoy repites sin darte cuenta." },
          { icon: "users", title: "La huella de papá", text: "Cómo su presencia o su ausencia marcó tu forma de relacionarte." },
          { icon: "target", title: "Las cinco heridas", text: "Rechazo, abandono, humillación, traición e injusticia: cómo se ven en tu vida adulta." },
          { icon: "sun", title: "Tu niño interior", text: "Conocerlo, escucharlo y empezar a darle lo que necesitaba." },
          { icon: "leaf", title: "Elegir de nuevo", text: "Poner límites, pedir ayuda y relacionarte desde la elección, no desde la herida." },
        ],
      },
      contents: {
        title: "Índice del libro",
        modules: [
          { title: "Parte I · Mirar mi historia", detail: "Cap. 1 ¿Por qué soy como soy? · Cap. 2 Las heridas que vienen de la infancia." },
          { title: "Parte II · Las huellas que recibimos", detail: "Cap. 3 La huella de mamá · Cap. 4 La huella de papá · Cap. 5 Las cinco heridas emocionales." },
          { title: "Parte III · Volver a encontrarme", detail: "Cap. 6 Conociendo a mi niño interior · Cap. 7 Escuchándolo · Cap. 8 Comenzando a sanarlo." },
          { title: "Cierre", detail: "El camino continúa · Una última conversación contigo · Última reflexión." },
        ],
      },
      previews: [
        { src: `${IMG}/products/heridas-que-marcaron-mi-historia/page-1.webp`, caption: "Índice" },
        { src: `${IMG}/products/heridas-que-marcaron-mi-historia/page-2.webp`, caption: "Prólogo" },
        { src: `${IMG}/products/heridas-que-marcaron-mi-historia/page-3.webp`, caption: "Capítulo 1" },
      ],
      audience: {
        forWho: [
          "Repites patrones en tus relaciones y quieres entender de dónde vienen.",
          "Sientes que cuidas a todos y te olvidas de ti.",
          "Quieres mirar tu infancia con compasión, sin buscar culpables.",
          "Estás en un proceso personal y buscas una lectura que te acompañe.",
        ],
        notFor: [
          "Buscas un tratamiento: el libro acompaña, pero no sustituye la atención de un profesional de la salud mental.",
        ],
      },
      includes: [
        "Libro completo de 118 páginas",
        "8 capítulos en 3 partes",
        "Reflexiones y preguntas para tu proceso",
        "Carta «Los libero con amor»",
      ],
      faq: [
        {
          q: "¿Es un libro de lectura o de ejercicios?",
          a: "Es un libro de lectura reflexiva, con preguntas que te invitan a mirar tu propia historia a tu ritmo, con pausas y sin presión.",
        },
      ],
    },
  ],
};
