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
 * "grand-lounge-elite", "bitali-desarrollos" and "new-you-wellness" are
 * filled in so far. The remaining 2 project slugs already live in the
 * home page's projects-teaser grid (public/blocks/projects-teaser/) and
 * each still shows a "Próximamente" badge; add an object here (and
 * remove that project's badge in projects-teaser) as each is written.
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
    // The compact fact-sheet's 4th row is per-case (a duration here, a
    // geographic scope for Bitali below) — factFour carries whichever
    // label/value this case actually has, instead of the generator
    // hardcoding "Duración" for every case.
    factFour: { label: 'Duración', value: '2024–2026 (proyecto activo)' },
    metaTitle: 'The Grand Lounge Elite — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media desarrolló la estrategia de marketing integral de The Grand Lounge Elite: branding, redes sociales, relaciones públicas, producción audiovisual y desarrollo web para la red de salas VIP más importante en aeropuertos de México.',

    hero: {
      label: 'Caso de estudio',
      title: 'Consolidar la red de salas VIP más importante en aeropuertos de México.',
      meta: 'The Grand Lounge Elite · 2024–2026',
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
          // 1280x798 (~16:10) is a wide brand-deck slide, not a 4:3 photo —
          // mediaWide keeps its own aspect-ratio box close enough to the
          // asset's native ratio that the full cover crops cleanly with no
          // logo/tagline cut off top or bottom.
          mediaWide: true,
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
          mediaWide: true,
          mediaScreenshot: true,
          media: { src: 'proyectos/grand-lounge-elite/plataforma-web.png', width: 1228, height: 666 },
          body: 'Desarrollamos también su sitio web —trabajo que continúa vigente hasta la fecha— con módulo de reservaciones para cada una de sus salas VIP, comunicación transaccional, integración de pasarela de pago y conexión con APIs de socios como Viator. Adicionalmente, realizamos diversas producciones audiovisuales para la marca, cubriendo planeación de la producción, contratación de talento, edición y post-producción.',
          video: {
            alt: 'Reel de producción audiovisual The Grand Lounge Elite',
            src: 'proyectos/grand-lounge-elite/reel.mp4',
            poster: 'proyectos/grand-lounge-elite/reel-poster.jpg',
            width: 1600,
            height: 900,
            caption: 'Shooting de foto y video con Debora Hallal',
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

  {
    slug: 'bitali-desarrollos',
    client: 'Bitali Desarrollos',
    industry: 'Inmobiliario',
    disciplines: ['Agentes de IA para WhatsApp', 'Automatización de Marketing', 'CRM'],
    factFour: { label: 'Alcance', value: 'Veracruz, México' },
    metaTitle: 'Bitali Desarrollos — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media implementó agentes de inteligencia artificial para WhatsApp que atienden, clasifican y escalan los leads de Bitali Desarrollos en segundos, convirtiendo más de 60 conversaciones diarias en los prospectos que realmente importan.',

    hero: {
      label: 'Caso de estudio',
      title: 'Convertir 60 conversaciones diarias en los leads que realmente importan.',
      meta: 'Bitali Desarrollos · AI Marketing Solutions — Agentes de IA para WhatsApp',
      mediaAlt: 'Persona consultando WhatsApp desde su celular, representando la atención inmediata que ofrecen los agentes de IA de Bitali Desarrollos',
      media: { src: 'proyectos/bitali-desarrollos/hero.jpg', width: 2400, height: 1350 },
    },

    summary:
      'Bitali Desarrollos es una desarrolladora inmobiliaria con más de 10 años de experiencia y más de 300 unidades vendidas en las zonas más exclusivas de Veracruz. Con 5 proyectos residenciales y comerciales a la venta de forma simultánea, su equipo comercial no lograba atender el volumen de leads generado por sus campañas en Meta. Implementamos agentes de inteligencia artificial que atienden, clasifican y escalan leads calificados en cuestión de segundos, las 24 horas del día. Hoy, de más de 60 conversaciones diarias, solo los prospectos con intención real de compra llegan al equipo de ventas.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Persona escribiendo un mensaje desde su celular, representando la atención inmediata que reciben los prospectos de Bitali Desarrollos',
      media: { src: 'proyectos/bitali-desarrollos/contexto.jpg', width: 1600, height: 2400 },
      body: 'Bitali Desarrollos desarrolla torres residenciales y plazas comerciales en las zonas más exclusivas de Veracruz, respaldada por más de 10 años de experiencia y más de 300 unidades vendidas. Nos buscaron en un momento de crecimiento acelerado: con 5 proyectos distintos a la venta de manera simultánea y campañas activas en Meta, el volumen de leads había superado la capacidad de respuesta de su equipo comercial.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'El equipo comercial de Bitali no se daba abasto para atender todos los leads generados por sus campañas en Meta. Sin un sistema de filtrado eficiente, resultaba imposible distinguir en tiempo real cuántos leads en el funnel eran prospectos genuinos y cuántos no calificaban, generando un cuello de botella que se traducía en pérdida real de oportunidades de venta.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cuatro decisiones clave',
      items: [
        'Integrar, dentro de nuestro propio software, un conjunto de agentes de inteligencia artificial con lenguaje natural y contexto completo de cada uno de los 5 proyectos de Bitali.',
        'Diseñar una lógica de clasificación automática que distinga, en segundos, entre un lead real con intención genuina de compra y uno que no califica.',
        'Automatizar el aviso inmediato al equipo de ventas vía WhatsApp en cuanto se detecta un lead calificado.',
        'Conectar cada lead calificado directamente al CRM de Bitali, en paralelo al escalamiento humano, sin intervención manual.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Agentes de IA en acción',
          mediaAlt:
            'Captura de una conversación de ejemplo del agente de inteligencia artificial de Bitali Desarrollos atendiendo por WhatsApp a un prospecto interesado en departamentos',
          mediaPhone: true,
          media: { src: 'proyectos/bitali-desarrollos/chat-whatsapp.png', width: 390, height: 844 },
          body: 'Implementamos agentes de inteligencia artificial que atienden a los leads provenientes de Meta las 24 horas del día, en cuestión de segundos, mediante lenguaje natural y con todo el contexto de cada proyecto de Bitali. Cada conversación es clasificada automáticamente: cuando un lead demuestra intención genuina de compra, el sistema avisa de inmediato al equipo de ventas vía WhatsApp.',
        },
        {
          title: 'Flujo automatizado hacia el CRM',
          body: 'En paralelo, además de escalar la conversación a un humano, el lead aterriza automáticamente en el CRM al que Bitali tiene acceso, sin pasos manuales de por medio. Todo el flujo —desde el primer mensaje del prospecto hasta la notificación al equipo comercial— ocurre sin intervención humana, garantizando que ningún lead calificado se pierda por tiempos de respuesta.',
          video: {
            alt: 'Flujo automatizado de leads de Bitali Desarrollos, desde la conversación por WhatsApp hasta su llegada al CRM',
            src: 'proyectos/bitali-desarrollos/reel.mp4',
            poster: 'proyectos/bitali-desarrollos/reel-poster.jpg',
            width: 1168,
            height: 768,
          },
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      body: 'En un día promedio, los agentes de IA de Bitali atienden más de 60 conversaciones. De ese volumen, únicamente los leads y prospectos realmente interesados se canalizan en segundos al equipo comercial, permitiendo más cierres y más ventas sin ampliar la operación del equipo humano.',
      highlight: '60 conversaciones diarias',
      highlightAttribution: 'Solo los prospectos con intención real de compra llegan al equipo de ventas',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 4 = Navy). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'the-anglo',
      client: 'The Anglo',
      category: 'Educación',
      bg: '#0e2455',
      fg: '#c7d6ff',
    },
  },

  {
    slug: 'new-you-wellness',
    client: 'New You Wellness Center',
    industry: 'Bienestar / Salud',
    disciplines: ['Marketing Digital', 'Desarrollo Web', 'AI Marketing Solutions'],
    factFour: { label: 'Alcance', value: 'Tomball y Katy, Houston, TX' },
    metaTitle: 'New You Wellness Center — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media construyó para New You Wellness Center una plataforma con quiz de perfilamiento por IA, blogs automatizados con Gemini, panel de administración de leads y constructor de landing pages propio.',

    hero: {
      label: 'Caso de estudio',
      title: 'De un sitio de contacto a un motor de marketing con IA integrada.',
      meta: 'New You Wellness Center · Marketing Digital y Desarrollo Web — Houston, TX',
      mediaAlt: 'Equipo de New You Wellness Center en su clínica de bienestar en Houston, Texas',
      media: { src: 'proyectos/new-you-wellness/hero.jpg', width: 1181, height: 787 },
    },

    summary:
      'New You Wellness Center es una clínica de bienestar con sucursales en Tomball y Katy, en el área de Houston. Nos contrataron para el manejo de sus redes sociales, la configuración y seguimiento de sus campañas en Google Ads, y la creación de un sitio web completamente nuevo. Lo que entregamos fue más que un sitio: una plataforma con un quiz de perfilamiento impulsado por IA, un sistema de generación automática de blogs conectado a la API de Gemini, un panel de administración de leads y un constructor de landing pages propio. Hoy, New You Wellness Center no solo genera leads de mejor calidad, sino que cuenta con un motor de marketing capaz de automatizar sus esfuerzos de comunicación en distintos puntos de contacto.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Especialista de New You Wellness Center mostrando un tratamiento de la clínica junto al logo de la marca',
      media: { src: 'proyectos/new-you-wellness/contexto.jpg', width: 1536, height: 1024 },
      body: 'New You Wellness Center opera dos sucursales en el área de Houston, Texas: Tomball y Katy. Nos buscaron para reforzar su posicionamiento digital, alineando la imagen de bienestar que la clínica busca transmitir con una presencia en redes sociales, campañas de pauta y un sitio web a la altura de esa propuesta de valor.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'El reto era doble: por un lado, alinear la imagen de marca de la clínica en redes sociales para reforzar su posicionamiento en ambas sucursales; por otro, construir una presencia digital que fuera más allá de un sitio informativo, capaz de impulsar divisiones específicas de tratamientos y sostener un flujo constante de leads calificados sin depender exclusivamente de la pauta paga.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cuatro decisiones clave',
      items: [
        'Alinear la imagen de bienestar de la marca en redes sociales para reforzar el posicionamiento digital de ambas sucursales, Tomball y Katy.',
        'Implementar y lanzar campañas de Google Ads asociadas a landing pages de tratamientos específicos, para impulsar divisiones particulares de la clínica.',
        'Desarrollar una plataforma con un quiz de inteligencia artificial que perfila a cada usuario hacia el tratamiento con mejor fit para su caso particular.',
        'Integrar una base de datos conectada a la API de Gemini para automatizar la generación y publicación diaria de contenido de blog, reforzando el posicionamiento orgánico del sitio.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Posicionamiento y campañas',
          mediaAlt: 'Equipo de especialistas de New You Wellness Center frente al logo de la marca en su clínica',
          media: { src: 'proyectos/new-you-wellness/posicionamiento.jpg', width: 1536, height: 1024 },
          body: 'Comenzamos alineando la imagen de bienestar que la clínica busca transmitir en sus redes sociales, reforzando el posicionamiento digital de sus sucursales en Tomball y Katy. Con esa base construida, implementamos y lanzamos campañas de Google Ads asociadas a landing pages de tratamientos específicos, lo que permitió impulsar divisiones particulares de la clínica de forma independiente.',
        },
        {
          title: 'Quiz de perfilamiento con IA',
          mediaLabel: 'Mockup',
          mediaAlt:
            'Captura del quiz de perfilamiento con inteligencia artificial del sitio de New You Wellness Center, mostrando la pregunta "What matters most to you right now?" con opciones de objetivos de tratamiento',
          mediaWide: true,
          mediaScreenshot: true,
          media: { src: 'proyectos/new-you-wellness/ai-quiz.png', width: 1228, height: 672 },
          body: 'Construimos una plataforma que funciona no solo como punto de contacto, sino como un sistema integral de operaciones. Incluye un quiz con inteligencia artificial que perfila a cada usuario hacia el tratamiento que mejor se ajusta a su caso particular.',
        },
        {
          title: 'Blogs automatizados con IA',
          mediaLabel: 'Mockup',
          mediaAlt:
            'Captura del blog "The NYWC Journal" del sitio de New You Wellness Center, generado y publicado automáticamente mediante la API de Gemini',
          mediaWide: true,
          mediaScreenshot: true,
          media: { src: 'proyectos/new-you-wellness/blog-ai.png', width: 1232, height: 762 },
          body: 'Una base de datos conectada a la API de Gemini alimenta un backlog de temas asociados a los tratamientos de la clínica: un cron ejecuta la publicación diaria de blogs sin intervención humana, reforzando de forma constante el posicionamiento orgánico del sitio.',
        },
        {
          title: 'Panel administrativo y constructor de landings',
          mediaLabel: 'Mockup',
          mediaAlt: 'Pantalla de acceso al panel de administración de New You Wellness Center, desde donde el equipo da seguimiento a los leads',
          mediaWide: true,
          mediaScreenshot: true,
          media: { src: 'proyectos/new-you-wellness/admin-panel.png', width: 1228, height: 668 },
          media2Alt:
            'Constructor de landing pages de New You Wellness Center, mostrando el listado de landing pages creadas para distintos tratamientos',
          media2: { src: 'proyectos/new-you-wellness/landing-builder.png', width: 1232, height: 671 },
          body: 'Integramos también un módulo administrador desde donde el staff de la clínica da seguimiento a los leads generados tanto por el quiz de IA como por las campañas de Google, junto con un constructor de landing pages propio que permite crear nuevas landings en cuestión de minutos.',
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      body: 'Con estas herramientas, New You Wellness Center no solo ha mejorado la calidad de los leads generados por sus campañas, sino que hoy cuenta con un motor de marketing que le permite automatizar sus esfuerzos de comunicación en distintos puntos de contacto, sin depender de intervención manual constante.',
      highlight: 'Un motor de marketing',
      highlightAttribution: 'Automatiza la comunicación en distintos puntos de contacto, sin intervención manual constante',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 6 = Indigo). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'mae-dunne',
      client: 'Mae Dunne',
      category: 'Restaurante',
      bg: '#221d3e',
      fg: '#dad6f5',
    },
  },
];
