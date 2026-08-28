/**
 * Continental Media — case-study content (single source of truth).
 *
 * Consumed by scripts/generate-case-study-pages.mjs, which renders each
 * object below through ONE template function into
 * public/proyectos/<slug>/index.html — see
 * public/blocks/case-study/case-study.html's header comment for the
 * full rationale (one reusable template + data, not N hand-duplicated
 * pages, mirroring the exact pattern already established for the 5
 * /servicios pillar pages).
 *
 * Only "grand-lounge-elite" is filled in for now — it's the first case
 * study. The other 5 project slugs already live in the home page's
 * projects-teaser grid (public/blocks/projects-teaser/) and each still
 * shows a "Próximamente" badge; add an object here (and remove that
 * project's badge in projects-teaser) as each one is actually written.
 *
 * Copy is transcribed verbatim from the brief (not summarized or
 * paraphrased) — keep it that way on any future edit.
 */

export const CASE_STUDIES = [
  {
    slug: 'grand-lounge-elite',
    client: 'The Grand Lounge Elite',
    industry: 'Hospitalidad',
    disciplines: [
      'Branding',
      'Redes Sociales',
      'Relaciones Públicas',
      'Producción Audiovisual',
      'Desarrollo Web',
    ],
    // Full form for the compact fact-sheet's "Duración" field; the hero
    // meta line uses the shorter durationRange per the brief's own
    // example ("The Grand Lounge Elite · 2024–2026 · Branding, ...").
    duration: '2024–2026 (proyecto activo)',
    durationRange: '2024–2026',
    metaTitle: 'The Grand Lounge Elite — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media desarrolló la estrategia de marketing integral de The Grand Lounge Elite: branding, redes sociales, relaciones públicas, producción audiovisual y desarrollo web para la red de salas VIP más importante en aeropuertos de México.',

    hero: {
      label: 'Caso de estudio',
      title: 'Consolidar la red de salas VIP más importante en aeropuertos de México.',
      mediaAlt: 'The Grand Lounge Elite, sala VIP o momento icónico del proyecto',
      media: { src: 'proyectos/grand-lounge-elite/hero.jpg', width: 2048, height: 1365 },
    },

    summary:
      'The Grand Lounge Elite opera 5 salas VIP premium en el Aeropuerto Internacional de la Ciudad de México y el Aeropuerto Internacional Felipe Ángeles. Entre 2024 y 2026 desarrollamos su estrategia de marketing integral —branding, redes sociales, relaciones públicas, producción audiovisual y desarrollo web— para que su comunicación estuviera a la altura de la experiencia premium que ofrecen en sala. El resultado: alianzas estratégicas con Visa, Priority Pass y LoungeKey, y el reconocimiento Lounge of the Year 2025 por Priority Pass.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Fachada o interior de una sala VIP The Grand Lounge Elite',
      media: { src: 'proyectos/grand-lounge-elite/contexto-sala-vip.jpg', width: 1181, height: 787 },
      body: 'The Grand Lounge Elite es la red de salas VIP más importante en aeropuertos de México, con presencia en dos de las terminales aéreas más relevantes del país. Nos buscaron para profesionalizar su comunicación en un momento de crecimiento, cuando la marca necesitaba una identidad y presencia digital que reflejara el mismo nivel de exclusividad que sus espacios físicos.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'El reto era igualar, en cada punto de contacto digital y de comunicación, la experiencia premium que The Grand Lounge Elite ya ofrecía en sus 5 salas VIP. Sin una estrategia de contenido definida, una identidad visual consistente entre canales ni presencia relevante en medios, la marca corría el riesgo de que su comunicación no estuviera a la altura de su producto.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cuatro decisiones clave',
      items: [
        'Profesionalizar el manejo de redes sociales mediante una estrategia basada en pilares de contenido y calendario editorial.',
        'Restructurar por completo la identidad visual, con manuales de marca que garantizaran consistencia en todos los canales.',
        'Posicionar a la marca en medios de comunicación relevantes de México y el extranjero mediante artículos orgánicos, distribuidos a través de nuestra red Publifix.',
        'Construir un sitio web moderno con módulo de reservaciones propio, pasarela de pago integrada y conexión con socios como Viator.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Identidad visual',
          mediaAlt: 'Manual de marca / sistema de identidad visual de The Grand Lounge Elite',
          media: { src: 'proyectos/grand-lounge-elite/identidad-visual.png', width: 1280, height: 798 },
          body: 'Rediseñamos la identidad visual de The Grand Lounge Elite desde cero, con manuales de marca que unificaron su presencia en redes, sitio web y materiales impresos.',
        },
        {
          title: 'Contenido y relaciones públicas',
          mediaAlt: 'Ejemplo de contenido en redes sociales o mención en medios de The Grand Lounge Elite',
          media: { src: 'proyectos/grand-lounge-elite/redes-sociales.png', width: 1080, height: 1350 },
          body: 'En paralelo, implementamos una estrategia editorial con pilares de contenido definidos para sus redes sociales, y una estrategia de relaciones públicas que logró colocar menciones de la marca en medios relevantes de México y el extranjero a través de nuestra red Publifix.',
        },
        {
          title: 'Evento Lounge of the Year 2025',
          mediaLabel: 'Imagen/galería',
          mediaAlt: 'Imagen o galería del evento Lounge of the Year 2025 by Priority Pass',
          media: { src: 'proyectos/grand-lounge-elite/evento-lounge-of-the-year.jpg', width: 1181, height: 787 },
          body: 'Organizamos junto con el cliente distintos eventos, entre ellos el más destacado: la entrega del reconocimiento Lounge of the Year 2025 por Priority Pass, donde estuvimos a cargo de la convocatoria de medios, el minuto a minuto del evento y la atención a personalidades VIP.',
        },
        {
          title: 'Plataforma web y producción audiovisual',
          mediaLabel: 'Mockup',
          mediaAlt: 'Mockup del sitio web con módulo de reservaciones de The Grand Lounge Elite',
          media: { src: 'proyectos/grand-lounge-elite/plataforma-web.png', width: 1228, height: 666 },
          body: 'Desarrollamos también su sitio web —trabajo que continúa vigente hasta la fecha— con módulo de reservaciones para cada una de sus salas VIP, comunicación transaccional, integración de pasarela de pago y conexión con APIs de socios como Viator. Adicionalmente, realizamos diversas producciones audiovisuales para la marca, cubriendo planeación de la producción, contratación de talento, edición y post-producción.',
          video: {
            alt: 'Reel de producción audiovisual The Grand Lounge Elite',
            src: 'proyectos/grand-lounge-elite/reel.mp4',
            poster: 'proyectos/grand-lounge-elite/reel-poster.jpg',
            width: 1600,
            height: 900,
          },
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      body: 'Con este trabajo, The Grand Lounge Elite consolidó alianzas estratégicas con actores clave de la industria como Visa, Priority Pass y LoungeKey, y obtuvo el reconocimiento Lounge of the Year 2025 por parte de Priority Pass, consolidándose como la red de salas VIP más importante en aeropuertos de México.',
      highlight: 'Lounge of the Year 2025',
      highlightAttribution: 'Reconocimiento otorgado por Priority Pass',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 2 = Charcoal). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'parroquia-veracruz',
      client: 'La Parroquia de Veracruz',
      category: 'Patrimonio',
      bg: '#1b1d22',
      fg: '#edebe4',
    },
  },
];
