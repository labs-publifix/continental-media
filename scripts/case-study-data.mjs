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
 * "grand-lounge-elite", "bitali-desarrollos", "new-you-wellness",
 * "parroquia-veracruz", "u3m", "amda-veracruz-tabasco" and
 * "camino-real-veracruz" are filled in so far. The remaining 2 project
 * slugs already live in the home page's projects-teaser grid
 * (public/blocks/projects-teaser/) and each still shows a
 * "Próximamente" badge; add an object here (and remove that project's
 * badge in projects-teaser) as each is written.
 *
 * Copy is transcribed verbatim from the brief (not summarized or
 * paraphrased) — keep it that way on any future edit.
 *
 * RULE — hero.meta vs. disciplines: hero.meta (the hero's subtitle line)
 * must never restate the case's own disciplines array — those already
 * render as the pill list directly below it, so repeating them is a
 * redundant duplicate on screen. hero.meta is for a short, genuinely
 * different subtitle: client name plus either industry, a timeframe, or
 * a geographic scope (`{client} · {industry or descriptor}` or
 * `{client} · {descriptor} — {location}`) — never a list of services.
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
      category: 'Café y Gastronomía',
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
      meta: 'Bitali Desarrollos · Inmobiliario — Veracruz, México',
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
      slug: 'camino-real-veracruz',
      client: 'Camino Real Veracruz',
      category: 'Hospitalidad',
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
      meta: 'New You Wellness Center · Bienestar / Salud — Houston, TX',
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
      slug: 'u3m',
      client: 'U3M',
      category: 'Educación',
      bg: '#221d3e',
      fg: '#dad6f5',
    },
  },

  {
    slug: 'parroquia-veracruz',
    client: 'La Parroquia de Veracruz',
    industry: 'Café y Gastronomía',
    disciplines: ['Redes Sociales', 'Meta Ads', 'Producción Audiovisual'],
    factFour: { label: 'Alcance', value: 'Nacional (origen en Veracruz)' },
    metaTitle: 'La Parroquia de Veracruz — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media tradujo casi 100 años de historia de La Parroquia de Veracruz a una comunicación integral: redes sociales, producción audiovisual y campañas de Meta Ads para una marca de café y gastronomía con alcance nacional.',

    hero: {
      label: 'Caso de estudio',
      title: 'Casi 100 años de historia, traducidos a una marca integral.',
      meta: 'La Parroquia de Veracruz · Café y Gastronomía — Alcance Nacional',
      mediaAlt: 'Interior de La Parroquia de Veracruz lleno de comensales, con el letrero de la marca visible al fondo',
      media: { src: 'proyectos/parroquia-veracruz/hero.jpg', width: 1467, height: 2200 },
    },

    summary:
      'La Parroquia de Veracruz es una marca veracruzana con casi 100 años de trayectoria, que evolucionó de una cafetería tradicional a una propuesta integral de café y gastronomía, con cafeterías, restaurantes y una línea propia de productos de café. Nos buscaron para traducir esa evolución de negocio a una comunicación a la altura: capaz de honrar la identidad veracruzana que hizo grande a la marca, sin limitarla. Desde febrero de 2026 gestionamos su comunicación digital de forma integral —contenido, producción audiovisual y campañas de Meta Ads— consolidando una presencia consistente en cada línea de negocio.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Mujer con traje típico jarocho frente al letrero de La Parroquia de Veracruz, representando la identidad cultural de la marca',
      media: { src: 'proyectos/parroquia-veracruz/contexto.jpg', width: 1467, height: 2200 },
      body: 'La Parroquia de Veracruz es una de las marcas de café y restaurantes más reconocidas de Veracruz, con presencia nacional a través de su línea de productos de café. Nos buscaron en un momento clave de transformación de negocio: necesitaban una agencia capaz de comprender a profundidad su origen, historia e identidad veracruzana, pero con la visión y la capacidad de ejecución para acompañar su crecimiento hacia nuevos formatos y líneas de negocio.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'Comunicar únicamente una cafetería tradicional ya no era suficiente: la marca estaba ampliando su modelo de negocio hacia restaurantes y una línea propia de productos de café para consumo en casa. El reto de Continental Media era traducir esa transformación a una comunicación integral y consistente, sin perder los códigos y la identidad que hacen reconocible a La Parroquia desde hace casi un siglo — un equilibrio que exige tanto sensibilidad de marca como capacidad estratégica.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Tres decisiones clave',
      items: [
        'Tomar la historia, los códigos y los elementos reconocibles de La Parroquia de Veracruz como punto de partida, llevándolos a una comunicación actual sin que la tradición limitara la evolución de la marca.',
        'Construir una comunicación capaz de presentar a La Parroquia como una marca integral, dando espacio propio a cada uno de sus modelos de negocio: restaurantes, cafeterías y productos de café para consumo en casa.',
        'Convertir la historia, los rituales, los productos, las sucursales y la cultura alrededor de La Parroquia en fuentes constantes de contenido, en vez de reducir la comunicación a productos y promociones.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Contenido y producción',
          mediaAlt:
            "Pieza de menú de La Parroquia de Veracruz con ilustración de una bailarina jarocha y la frase 'Somos puerto, somos ritmo, somos sazón', junto a una bebida de la marca",
          media: { src: 'proyectos/parroquia-veracruz/contenido-produccion.jpg', width: 1760, height: 2200 },
          body: 'Desarrollamos y gestionamos de forma integral la comunicación digital de La Parroquia de Veracruz: planeación de contenidos, creación de piezas gráficas y audiovisuales, sesiones de foto y video, desarrollo de Reels, y comunicación de productos, promociones y sucursales — todo diseñado para reflejar la marca completa, no solo una parte de ella.',
        },
        {
          title: 'Presencia en cada sucursal y línea de negocio',
          mediaAlt: 'Plato de enfrijoladas con carne asada y una bebida de La Parroquia de Veracruz, en una de sus sucursales tipo restaurante',
          media: { src: 'proyectos/parroquia-veracruz/sucursales-1.jpg', width: 1467, height: 2200 },
          media2Alt: 'Plato de camarones empanizados con arroz en una de las sucursales de La Parroquia de Veracruz',
          media2: { src: 'proyectos/parroquia-veracruz/sucursales-2.jpg', width: 1467, height: 2200 },
          body: 'Cada pieza de contenido se adaptó a las distintas líneas de negocio de la marca: cafeterías, restaurantes y la línea de productos de café, manteniendo una narrativa consistente entre canales y puntos de venta.',
        },
        {
          title: 'Campañas y coordinación continua',
          body: 'En paralelo, configuramos, gestionamos y optimizamos campañas publicitarias en Meta, adaptando cada contenido a las distintas líneas de negocio de la marca. El trabajo se ejecutó de forma continua y estrechamente coordinada con el equipo de La Parroquia, ajustando la estrategia conforme la marca fue consolidando su propuesta integral en el mercado.',
          video: {
            alt: 'Video de campañas y presencia de La Parroquia de Veracruz en distintas sucursales y formatos de la marca, sin audio',
            src: 'proyectos/parroquia-veracruz/reel.mp4',
            poster: 'proyectos/parroquia-veracruz/reel-poster.jpg',
            width: 720,
            height: 1280,
          },
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      body: 'Hoy, la comunicación de La Parroquia de Veracruz refleja lo que la marca realmente es: una propuesta integral de café y gastronomía, presente de forma consistente en cada línea de negocio y en cada punto de contacto digital. Restaurantes, cafeterías y productos de café dejaron de comunicarse como piezas sueltas para integrarse bajo una misma narrativa — la de una marca que honra casi un siglo de historia mientras sigue evolucionando.',
      highlight: 'Una misma narrativa',
      highlightAttribution: 'Restaurantes, cafeterías y productos de café, integrados en una sola marca',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 3 = Bone). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'bitali-desarrollos',
      client: 'Bitali Desarrollos',
      category: 'Inmobiliario',
      bg: '#e7e2d9',
      fg: '#17161b',
    },
  },

  {
    slug: 'u3m',
    client: 'U3M — Universidad del Tercer Milenio',
    industry: 'Educación',
    disciplines: ['Redes Sociales', 'Desarrollo de Landing Page', 'Meta/Google/TikTok Ads', 'Diseño Gráfico'],
    factFour: { label: 'Alcance', value: 'Puerto de Veracruz · Colaboración desde 2020' },
    metaTitle: 'U3M — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media construyó una comunicación integral para la Universidad del Tercer Milenio (U3M) en Veracruz: redes sociales, campañas en Meta, Google y TikTok, y diseño gráfico que generaron más de 400 inscripciones en más de 5 años de colaboración.',

    hero: {
      label: 'Caso de estudio',
      title: 'Una alianza de más de 5 años que sigue formando generaciones.',
      meta: 'U3M · Universidad del Tercer Milenio — Puerto de Veracruz, México',
      mediaAlt: 'Grupo de estudiantes de U3M reunidos y conversando junto a una mesa en el plantel del Puerto de Veracruz',
      media: { src: 'proyectos/u3m/hero.jpg', width: 2200, height: 1652 },
    },

    summary:
      'La Universidad del Tercer Milenio (U3M) ofrece preparatoria y universidad, en modalidad escolarizada y sabatina, desde su único plantel en el Puerto de Veracruz. Trabajamos con ellos desde 2020, cuando sus redes sociales de prepa y universidad operaban de forma independiente, sin una estrategia que las conectara. Desde entonces hemos construido una comunicación integral de contenido, campañas publicitarias y diseño que llevó a U3M de ser una escuela conocida por algunos sectores de la ciudad a ocupar un lugar real en la mente de los jóvenes que buscan dónde estudiar. El resultado, sostenido durante más de 5 años de colaboración: más de 400 inscripciones generadas a través de nuestras campañas.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Dos estudiantes de U3M caminando por un pasillo con arcos del plantel en el Puerto de Veracruz, con compañeros conversando de fondo',
      // Portrait source (1652x2200) inside a 21:9 full-bleed strip: the
      // default centered crop only shows legs/floor. Biased toward the
      // top so both students' faces and the archway stay in frame.
      media: { src: 'proyectos/u3m/contexto.jpg', width: 1652, height: 2200, position: '50% 15%' },
      body: 'Desde 2020, U3M trabaja de la mano con Continental Media con el objetivo de fortalecer su presencia en redes sociales y desarrollar estrategias digitales que no solo comunicaran su oferta educativa, sino que generaran resultados reales. Uno de los principales diferenciadores de U3M es su oferta de sistemas escolarizados y sabatinos, que se adapta a distintos estilos de vida — desde jóvenes que inician su formación hasta personas que combinan sus estudios con el trabajo.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'U3M contaba con años de presencia en Veracruz y una oferta educativa competitiva, pero sus redes sociales de preparatoria y universidad no compartían una estrategia común, lo que limitaba su alcance real. El reto no era únicamente generar leads: era construir presencia, reconocimiento y conversación alrededor de U3M, conectando con una audiencia joven a través de una comunicación más cercana, creativa y relevante que llevara a la institución de ser conocida por algunos sectores a convertirse en una opción presente en la mente de los jóvenes al momento de decidir dónde estudiar.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cuatro decisiones clave',
      items: [
        'Unificar la comunicación de preparatoria y universidad bajo una estrategia de contenido consistente, en vez de operarlas de forma independiente entre sí.',
        'Combinar publicidad digital, contenido y diseño publicitario para llevar la comunicación de U3M tanto al entorno digital como a los espacios físicos donde está su audiencia.',
        'Desarrollar campañas publicitarias en Meta enfocadas en reconocimiento, interacción y generación de prospectos, sostenidas de forma continua a lo largo de los años.',
        'Producir material gráfico y publicitario propio para expos, eventos educativos y campañas de inscripción, reforzando la presencia de la marca fuera de redes sociales.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Publicidad digital',
          mediaAlt: 'Dos estudiantes de U3M sonriendo juntos en el plantel, representando el alcance de las campañas digitales de la universidad',
          media: { src: 'proyectos/u3m/publicidad-digital.jpg', width: 1652, height: 2200 },
          body: 'Desarrollamos una estrategia que combina publicidad digital, contenido y diseño publicitario, llevando la comunicación de U3M tanto al entorno digital como a los espacios físicos donde se encuentra su audiencia. En publicidad digital, gestionamos campañas en Meta Ads, Google Ads y TikTok Ads, enfocadas en reconocimiento de marca, interacción y generación de prospectos para preparatoria y universidad.',
        },
        {
          title: 'Diseño y comunicación publicitaria',
          mediaAlt: 'Estudiante de U3M sonriendo en una terraza del plantel en el Puerto de Veracruz',
          // Portrait close-up (1467x2200) inside the dual-media 4:3 box:
          // the default centered crop drops her face below the frame.
          // Biased toward the top so it stays in view.
          media: { src: 'proyectos/u3m/diseno-comunicacion-1.jpg', width: 1467, height: 2200, position: '50% 15%' },
          media2Alt: 'Estudiante de U3M sonriendo junto a una columna del plantel, con mochila al hombro',
          media2: { src: 'proyectos/u3m/diseno-comunicacion-2.jpg', width: 1652, height: 2200 },
          body: 'En paralelo, desarrollamos diseño y comunicación publicitaria de forma constante: diseño de planes de estudio impresos, flyers y materiales promocionales, lonas publicitarias, material gráfico para campañas y promociones, y piezas para expos y eventos educativos en otras instituciones — todo pensado para apoyar directamente las campañas de inscripción.',
        },
        {
          title: 'Presencia integral en cada punto de contacto',
          mediaAlt: 'Estudiante de U3M sosteniendo un cuaderno con stickers en una de las áreas comunes del plantel',
          media: { src: 'proyectos/u3m/presencia.jpg', width: 1652, height: 2200 },
          body: 'Con esto, construimos una comunicación integral y consistente, haciendo que U3M estuviera presente no solo en redes sociales, sino en cada punto de contacto donde los futuros estudiantes podían conocer la institución.',
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      body: 'Durante más de 5 años de colaboración, hemos acompañado a U3M en el crecimiento de su presencia digital y en la generación constante de prospectos. A través de una estrategia sostenida de contenido y campañas digitales, logramos impulsar el posicionamiento de U3M en Veracruz, haciendo que la institución ocupara un lugar real en la mente de los jóvenes que buscan dónde estudiar. El resultado se mide en generaciones completas de estudiantes que hoy forman parte de U3M después de encontrar a la universidad en redes sociales: más de 400 inscripciones generadas a través de nuestras campañas, sostenidas por más de 5 años de relación de trabajo continua.',
      highlight: '+400 inscripciones',
      highlightAttribution: 'Generadas a través de nuestras campañas, sostenidas por más de 5 años de colaboración',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 7 = Mist). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'amda-veracruz-tabasco',
      client: 'AMDA Veracruz Tabasco',
      category: 'Automotriz',
      bg: '#e7e9f0',
      fg: '#14161f',
    },
  },

  {
    slug: 'amda-veracruz-tabasco',
    client: 'AMDA Veracruz Tabasco',
    industry: 'Asociación / Sector Automotriz',
    disciplines: ['Branding', 'Redes Sociales', 'Meta', 'Relaciones Públicas', 'Producción Audiovisual', 'Eventos'],
    factFour: { label: 'Alcance', value: 'Veracruz y Tabasco · Colaboración activa desde mayo 2023' },
    metaTitle: 'AMDA Veracruz Tabasco — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media construyó una presencia digital constante para AMDA Veracruz Tabasco: contenido, producción audiovisual y relaciones públicas que llevaron a la asociación a más de 8,900 seguidores en Facebook y presencia en Instagram.',

    hero: {
      label: 'Caso de estudio',
      title: 'Presencia digital constante para la voz del sector automotriz.',
      meta: 'AMDA Veracruz Tabasco · Asociación Mexicana de Distribuidores de Automotores — Veracruz y Tabasco',
      mediaAlt: 'Equipo de AMDA Veracruz Tabasco conversando bajo una carpa durante un evento del sector automotriz, con autos estacionados al fondo',
      media: { src: 'proyectos/amda-veracruz-tabasco/hero.jpg', width: 1600, height: 1200 },
    },

    summary:
      'AMDA Veracruz Tabasco es la Asociación Mexicana de Distribuidores de Automotores en Veracruz y Tabasco, que representa y agrupa a los distribuidores del sector automotriz en ambos estados. La relación con Continental Media es anterior a 2023, pero se retomó y formalizó con la renovación del contrato en mayo de ese año. Desde entonces desarrollamos una estrategia integral de contenido, producción audiovisual y relaciones públicas para mantener una comunicación constante con sus asociados y visibilizar el trabajo de la asociación en el sector. Hoy, AMDA Veracruz Tabasco mantiene una comunidad activa de más de 8,900 seguidores en Facebook y una presencia consolidada en Instagram, canal que antes no existía.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Equipo de Toyota Xalapa posando junto a una camioneta en una carpa de feria automotriz, con banderas y anuncios de la marca',
      media: { src: 'proyectos/amda-veracruz-tabasco/contexto.jpg', width: 1600, height: 1200 },
      body: 'AMDA Veracruz Tabasco forma parte de la representación regional de la Asociación Mexicana de Distribuidores de Automotores, y concentra su actividad en el sector automotriz de Veracruz y Tabasco. La relación con el cliente ya existía antes de la pandemia, pero las actividades se pausaron durante ese periodo. Con la reactivación del sector, la asociación retomó la colaboración con Continental Media y renovó su contrato en mayo de 2023.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'Uno de los principales retos era fortalecer la comunicación con los colaboradores de las agencias asociadas y contar con una presencia digital constante que permitiera comunicar con claridad la labor que realiza la asociación en favor de la industria automotriz. AMDA necesitaba estructurar y mantener una comunicación continua con sus asociados, además de aprovechar sus canales digitales para mostrar sus actividades, eventos e iniciativas, y reforzar la relevancia de su trabajo dentro del sector automotriz de la región.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cinco decisiones clave',
      items: [
        'Establecer una estrategia de contenidos para redes sociales que comunicara de forma constante las actividades, iniciativas y participación de AMDA Veracruz Tabasco en la industria automotriz.',
        'Centralizar la planeación y producción de contenidos, desde los calendarios editoriales y materiales gráficos hasta la creación de piezas audiovisuales, programación y publicación.',
        'Fortalecer la presencia digital de la asociación mediante la consolidación de Facebook y la creación de una presencia en Instagram, ampliando los canales de comunicación con los asociados y la audiencia del sector.',
        'Integrar la comunicación digital con las actividades presenciales de la asociación —especialmente ferias y eventos— complementándolas con producción audiovisual y relaciones públicas con medios.',
        'Generar dinámicas de interacción con los asociados, como sorteos y otras acciones de participación, para mantener activa la comunidad alrededor de la asociación.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Contenido y producción constante',
          mediaAlt: 'Stand de Jetour Gruver en una feria automotriz, con banderas de marca, pantallas y personal atendiendo a visitantes',
          media: { src: 'proyectos/amda-veracruz-tabasco/contenido-produccion.jpg', width: 1600, height: 1200 },
          body: 'Desarrollamos y ejecutamos de manera continua la planeación y estrategia de contenidos para las redes sociales de AMDA Veracruz Tabasco: calendarios de contenido, diseño de materiales gráficos, creación de piezas audiovisuales, programación y publicación, además de la cobertura y comunicación de las actividades de la asociación.',
        },
        {
          title: 'Ferias, eventos y relaciones públicas',
          mediaAlt: 'Vocero de AMDA Veracruz Tabasco dirigiéndose a un grupo de asistentes con micrófono durante un evento del sector automotriz',
          media: { src: 'proyectos/amda-veracruz-tabasco/ferias-eventos.jpg', width: 1280, height: 960 },
          body: 'En paralelo, brindamos apoyo integral para sus ferias y eventos, incluyendo la planeación de la comunicación, relaciones públicas con medios, generación de materiales audiovisuales y difusión posterior en redes sociales. También desarrollamos dinámicas de participación para los asociados, como sorteos y acciones especiales de comunicación, para mantener activa la comunidad alrededor de la asociación.',
        },
        {
          title: 'Presencia constante en Facebook e Instagram',
          mediaAlt: 'Equipo de Foton Gruver posando junto a una unidad y material publicitario de marca en una feria automotriz',
          media: { src: 'proyectos/amda-veracruz-tabasco/redes-sociales.jpg', width: 1600, height: 1200 },
          body: 'La operación se articula principalmente a través de Facebook e Instagram, con una estrategia enfocada en mantener presencia constante y mostrar con claridad las actividades, eventos y aportaciones de AMDA Veracruz Tabasco al sector automotriz de la región.',
          video: {
            alt: 'Video de cobertura de actividades y presencia de AMDA Veracruz Tabasco en el sector automotriz, sin audio',
            src: 'proyectos/amda-veracruz-tabasco/reel.mp4',
            poster: 'proyectos/amda-veracruz-tabasco/reel-poster.jpg',
            width: 1272,
            height: 720,
            caption: 'Cobertura en video de la presencia de AMDA Veracruz Tabasco en ferias y eventos del sector automotriz',
          },
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      mediaAlt: 'Pieza de contenido de AMDA Veracruz Tabasco con la frase "Las grandes oportunidades nacen de conexiones sólidas" sobre un fondo de red de conexiones',
      // Portrait content graphic (1080x1350) inside the 16:9/4:3 result
      // banner: biased toward the text block's own vertical center so
      // the message stays fully legible instead of being cut mid-line.
      media: { src: 'proyectos/amda-veracruz-tabasco/resultado.jpg', width: 1080, height: 1350, position: '50% 55%' },
      body: 'Como resultado de la estrategia de comunicación, AMDA Veracruz Tabasco cuenta hoy con presencia en Instagram —canal que antes no tenía— y una comunidad de más de 8,900 seguidores en Facebook, con más de 4,000 publicaciones acumuladas que documentan la actividad constante de la asociación en el sector. La colaboración, reactivada tras la pausa de la pandemia y formalizada en mayo de 2023, continúa activa hasta la fecha.',
      highlight: '+8,900 seguidores',
      highlightAttribution: 'Comunidad activa en Facebook, con presencia consolidada también en Instagram',
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 8 = Midnight). Kept in sync by
    // hand for now — see that block's own palette comment for the values.
    nextProject: {
      slug: 'bosque-san-lucas',
      client: 'Bosque San Lucas',
      category: 'Inmobiliario',
      bg: '#0b1024',
      fg: '#c9d3f5',
    },
  },

  {
    slug: 'camino-real-veracruz',
    client: 'Camino Real Veracruz',
    industry: 'Hotelería',
    disciplines: ['Redes Sociales', 'Producción Audiovisual'],
    factFour: { label: 'Alcance', value: 'Veracruz, México · Colaboración activa desde febrero 2025' },
    metaTitle: 'Camino Real Veracruz — Casos de Éxito | Continental Media',
    metaDescription:
      'Cómo Continental Media construyó un proceso mensual de producción fotográfica y audiovisual para Camino Real Veracruz: contenido para redes sociales que llevó a la propiedad a un crecimiento sostenido en Instagram y Facebook.',

    hero: {
      label: 'Caso de estudio',
      title: 'Contenido mensual que da vida a cada rincón del hotel.',
      meta: 'Camino Real Veracruz · Hotelería — Veracruz, México',
      mediaAlt: 'Comensal cortando un platillo mexicano acompañado de café, en uno de los restaurantes de Camino Real Veracruz',
      media: { src: 'proyectos/camino-real-veracruz/hero.jpg', width: 1467, height: 2200 },
    },

    summary:
      'Camino Real Veracruz forma parte de Grupo Camino Real, cadena con 32 hoteles en 21 destinos de México. Nuestro trabajo se concentra exclusivamente en la comunicación digital de la propiedad de Veracruz, con la que trabajamos desde febrero de 2025. El objetivo: fortalecer su presencia en redes sociales y dar visibilidad a sus centros de consumo mediante una estrategia de contenido constante, visualmente cuidada y alineada con la identidad de la marca. Desde entonces, hemos construido un proceso mensual de producción fotográfica y audiovisual que ha llevado a la comunidad digital del hotel a un crecimiento sostenido en Instagram y Facebook.',

    context: {
      eyebrow: 'Contexto',
      mediaAlt: 'Alberca infinita de Camino Real Veracruz frente al mar, rodeada de palmeras y camastros con sombrillas',
      media: { src: 'proyectos/camino-real-veracruz/contexto.jpg', width: 2200, height: 1467 },
      body: 'Camino Real Veracruz forma parte de Grupo Camino Real, una de las cadenas hoteleras con mayor presencia en México. Nuestro trabajo se enfoca exclusivamente en la comunicación digital de esta propiedad, con quien colaboramos desde febrero de 2025 con el objetivo de fortalecer su presencia en redes sociales y dar mayor visibilidad a sus centros de consumo, mediante una estrategia de contenido constante y alineada con la identidad de marca.',
    },

    challenge: {
      eyebrow: 'Reto',
      body: 'El reto principal estaba relacionado con la comunicación y el desempeño de la presencia del hotel en redes sociales. Existía una oportunidad clara para fortalecer la estrategia de contenido, mejorar la comunicación digital y generar una presencia más constante y atractiva que mostrara de forma efectiva la oferta del hotel — especialmente sus distintas áreas y centros de consumo, abiertos tanto a huéspedes como al público en general.',
    },

    approach: {
      eyebrow: 'Enfoque',
      title: 'Cuatro decisiones clave',
      items: [
        'Definir los formatos y tipos de contenido a partir de las tendencias actuales de redes sociales y de los contenidos con mayor potencial para la marca.',
        'Establecer una planeación mensual enfocada en dar visibilidad estratégica a los diferentes espacios y centros de consumo del hotel.',
        'Priorizar contenidos que no se limitaran a mostrar el hospedaje, sino que comunicaran experiencias y servicios disponibles también para el público en general.',
        'Integrar la producción fotográfica y audiovisual como parte central de la estrategia, manteniendo una línea visual coherente con la identidad y personalidad de Camino Real.',
      ],
    },

    solution: {
      eyebrow: 'Solución y proceso',
      subsections: [
        {
          title: 'Planeación mensual',
          mediaAlt: 'Huésped registrándose en el mostrador de una cafetería de Camino Real Veracruz, atendida por personal del hotel',
          media: { src: 'proyectos/camino-real-veracruz/planeacion-mensual.jpg', width: 1467, height: 2200 },
          body: 'El trabajo se desarrolla mediante una estrategia mensual de contenidos para las redes sociales de Camino Real Veracruz. Como primer paso, elaboramos un moodboard mensual que permite visualizar y presentar al cliente la propuesta de contenido, definiendo cómo se destacarán los diferentes espacios, servicios y centros de consumo del hotel.',
        },
        {
          title: 'Producción fotográfica y audiovisual',
          mediaAlt: 'Montaje de mesa elegante para un evento privado en uno de los salones de Camino Real Veracruz',
          media: { src: 'proyectos/camino-real-veracruz/produccion-fotografica-1.jpg', width: 1467, height: 2200 },
          media2Alt: 'Habitación de Camino Real Veracruz con cama king size, cabecera de madera y lámparas colgantes de fibra natural',
          media2: { src: 'proyectos/camino-real-veracruz/produccion-fotografica-2.jpg', width: 2200, height: 1652 },
          body: 'A partir de esa planeación, realizamos mensualmente una sesión de levantamiento de contenido fotográfico y audiovisual dentro de las instalaciones del hotel, contemplando fotografía y video para los distintos formatos de redes sociales, incluyendo contenido estático y reels. Después, hacemos una selección detallada del material producido y un proceso de edición cuidado, procurando mantener coherencia con la identidad visual y la personalidad de la marca.',
        },
        {
          title: 'Publicación y presencia constante',
          mediaAlt: 'Huésped disfrutando de una taza de café envuelto en una bata de baño con el monograma de Camino Real',
          media: { src: 'proyectos/camino-real-veracruz/publicacion-presencia.jpg', width: 1467, height: 2200 },
          body: 'Finalmente, gestionamos la publicación y operación de los contenidos en las redes sociales del hotel, dando seguimiento a los espacios y temas que se buscan comunicar en cada periodo, manteniendo una presencia digital constante que da visibilidad a las distintas experiencias y servicios de Camino Real Veracruz.',
        },
      ],
    },

    result: {
      eyebrow: 'Resultado',
      mediaAlt: 'Mesas puestas con copas azules en el restaurante de palapa de Camino Real Veracruz, uno de sus centros de consumo frente al mar',
      media: { src: 'proyectos/camino-real-veracruz/resultado.jpg', width: 1652, height: 2200 },
      body: 'Desde el inicio de la relación en febrero de 2025, la comunidad digital de Camino Real Veracruz ha registrado crecimiento sostenido. En Instagram, la cuenta pasó de aproximadamente 90 seguidores al inicio de la gestión a 686 seguidores actualmente. En Facebook, la página pasó de 6,397 fans en febrero de 2025 a 7,477 fans, un incremento de más de 1,000 seguidores. El proyecto continúa activo, con una operación constante de producción, publicación y gestión de contenidos que sigue fortaleciendo la presencia digital del hotel.',
      highlights: [
        { value: '686 seguidores', label: 'Instagram — desde ~90 seguidores al inicio de la gestión' },
        { value: '7,477 fans', label: 'Facebook — +1,000 seguidores desde febrero de 2025' },
      ],
    },

    // Matches the checkerboard color already assigned to this project in
    // public/blocks/projects-teaser/ (card 5 = Periwinkle). Kept in sync
    // by hand for now — see that block's own palette comment for values.
    nextProject: {
      slug: 'new-you-wellness',
      client: 'New You Wellness Center',
      category: 'Bienestar · Houston, TX',
      bg: '#9fb2e8',
      fg: '#101a3d',
    },
  },
];
