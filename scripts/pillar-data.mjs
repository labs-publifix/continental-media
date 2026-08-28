/**
 * Continental Media — service pillar content (single source of truth).
 *
 * Consumed by scripts/generate-pillar-pages.mjs, which renders each
 * object below through ONE template function into
 * public/servicios/<slug>/index.html — see
 * public/blocks/pillar-page/pillar-page.html's header comment for the
 * full rationale. Edit content here, then re-run the generator; never
 * hand-edit a generated page directly.
 *
 * Copy is transcribed verbatim from the brief (not summarized or
 * paraphrased) — keep it that way on any future edit.
 */

const PUBLIFIX_URL = 'https://publifix.net';

export const PILLARS = [
  {
    slug: 'marketing-digital',
    name: 'Marketing Digital',
    badge: null,
    metaTitle: 'Marketing Digital — Servicios | Continental Media',
    metaDescription:
      'Gestión de redes sociales, desarrollo web, publicidad digital, SEO e influencer marketing: soluciones de Marketing Digital de Continental Media.',
    intro: null,
    subservices: [
      {
        name: 'Gestión de Redes Sociales',
        description:
          'Planificamos, creamos y gestionamos contenidos de forma estratégica para fortalecer tu presencia digital, conectar con tu audiencia y construir comunidades activas en Facebook, Instagram, LinkedIn, TikTok y YouTube. Desarrollamos calendarios editoriales, definimos el tono y la voz de marca, producimos contenido nativo para cada plataforma —incluyendo formatos verticales y tendencias de TikTok— y analizamos métricas para optimizar el rendimiento de cada canal.',
      },
      {
        name: 'Desarrollo Web',
        description:
          'Creamos sitios web funcionales, estéticamente sólidos y orientados a resultados. Cada proyecto está optimizado para la experiencia del usuario, la velocidad de carga y la conversión. Desarrollamos desde landing pages hasta plataformas web complejas, incluyendo e-commerce end-to-end con integración de pasarelas de pago como Stripe y Mercado Pago. Incorporamos funcionalidades con IA: automatización de blog, quizzes interactivos, asistentes virtuales y personalización dinámica de contenidos.',
      },
      {
        name: 'Publicidad Digital — Google Ads, Meta Ads y TikTok Ads',
        description:
          'Creamos y gestionamos campañas en Google, YouTube, Meta, Instagram, TikTok y otras plataformas, optimizadas para alcanzar audiencias específicas y generar resultados medibles. Contamos con expertise en Andromeda IA de Meta para optimización avanzada de campañas publicitarias, maximizando alcance, relevancia y retorno sobre la inversión.',
      },
      {
        name: 'Posicionamiento SEO',
        description:
          'Optimizamos tu sitio web para destacar en los principales motores de búsqueda —incluyendo Google y los nuevos modelos de búsqueda conversacional como ChatGPT— mejorando el tráfico orgánico, la autoridad de dominio y la calidad de los leads.',
      },
      {
        name: 'Influencer Marketing',
        description:
          'Desarrollamos estrategias con selección rigurosa de perfiles alineados a los valores y audiencia de tu marca. Gestionamos negociación, briefing, producción colaborativa y medición de resultados, garantizando alcance genuino y conexión real.',
      },
    ],
    extra: null,
  },

  {
    slug: 'ai-marketing-solutions',
    name: 'AI Marketing Solutions',
    badge: 'Nuevo',
    metaTitle: 'AI Marketing Solutions — Servicios | Continental Media',
    metaDescription:
      'Agentes de IA, blogs automáticos, quizzes interactivos, producción de video con IA, automatización de marketing y campañas en la red de OpenAI: AI Marketing Solutions de Continental Media.',
    intro:
      'Integramos inteligencia artificial de forma estratégica en los procesos de marketing y comunicación de tu marca. No se trata solo de automatización: se trata de usar IA como una ventaja competitiva real que mejora la toma de decisiones, personaliza la experiencia del cliente y acelera el crecimiento del negocio.',
    subservices: [
      {
        name: 'Agentes de IA (WhatsApp, Voz y Chatbots)',
        description:
          'Implementamos agentes conversacionales con inteligencia artificial que gestionan, califican y dan seguimiento automático a leads directamente desde WhatsApp, Messenger e Instagram, además de agentes de voz capaces de atender llamadas y resolver solicitudes básicas de soporte —de forma autónoma, disponible las 24 horas del día, sin perder ninguna oportunidad de negocio.',
      },
      {
        name: 'Blogs Automáticos con IA',
        description:
          'Diseñamos flujos automatizados de generación, edición y publicación de contenido para el blog de tu marca, utilizando IA para mantener una cadencia editorial constante, optimizada para SEO y alineada con la estrategia de contenidos.',
      },
      {
        name: 'Quizzes Interactivos y Experiencias Digitales con IA',
        description:
          'Desarrollamos plataformas web con funcionalidades interactivas impulsadas por IA: quizzes de recomendación de productos o servicios, tests de perfil de cliente y herramientas de autodiagnóstico. Soluciones que aumentan el tiempo de permanencia, capturan datos de valor y generan leads cualificados.',
      },
      {
        name: 'Producción de Video con Animaciones IA',
        description:
          'Creamos contenido audiovisual y animaciones de alta calidad utilizando herramientas de inteligencia artificial generativa. Desde videos explicativos, reels animados y contenido para redes sociales, hasta piezas institucionales con motion graphics —con tiempos de producción más ágiles y costos optimizados sin sacrificar calidad.',
      },
      {
        name: 'Automatización de Marketing y CRM',
        description:
          'Diseñamos e implementamos flujos de automatización de marketing que conectan tus canales digitales, tu CRM y tus herramientas de comunicación: secuencias de email, notificaciones push, actualizaciones automáticas de bases de datos y reportes en tiempo real.',
      },
      {
        name: 'Campañas Publicitarias en la Red de Anunciantes de OpenAI',
        description:
          'Diseñamos, ejecutamos y damos seguimiento a campañas dentro de la red de anunciantes de OpenAI, una de las plataformas emergentes con mayor potencial para conectar marcas con audiencias que interactúan directamente con modelos de inteligencia artificial. Definimos segmentación y creatividades adaptadas a este nuevo ecosistema publicitario, gestionamos la implementación técnica y monitoreamos el desempeño en tiempo real para maximizar alcance, relevancia y retorno de inversión.',
      },
    ],
    extra: {
      title: 'Conoce nuestras plataformas hermanas',
      subtitle:
        'Un ecosistema de plataformas propias que extienden nuestras capacidades en comunicación, tecnología e inteligencia artificial.',
      platforms: [
        {
          name: 'Publifix Suite',
          description: 'Nuestra plataforma de distribución de Notas de Prensa',
          href: 'https://suite.publifix.net',
        },
        {
          name: 'Publifix LABS',
          description: 'Nuestro brazo tecnológico para el desarrollo web y software a medida',
          href: 'https://labs.publifix.net',
        },
        {
          name: 'LABS Agents',
          description: 'Nuestro software para la creación de Agentes de Inteligencia Artificial',
          href: 'https://agents.publifix.net',
        },
      ],
    },
  },

  {
    slug: 'marketing-tradicional',
    name: 'Marketing Tradicional',
    badge: null,
    metaTitle: 'Marketing Tradicional — Servicios | Continental Media',
    metaDescription:
      'Plan de medios, investigación de mercados y branding: soluciones de Marketing Tradicional de Continental Media.',
    intro: null,
    subservices: [
      {
        name: 'Plan de Medios',
        description:
          'Analizamos audiencias, objetivos y presupuesto para seleccionar los canales más efectivos —TV, radio, prensa, espectaculares, medios digitales— y optimizar la inversión publicitaria, con proyecciones de alcance, frecuencia y resultados esperados.',
      },
      {
        name: 'Investigación de Mercados',
        description:
          'Analizamos datos cuantitativos y cualitativos, comportamientos de audiencia y tendencias del sector para detectar oportunidades reales de negocio, desde el lanzamiento de productos hasta el reposicionamiento de marca.',
      },
      {
        name: 'Branding',
        description:
          'Definición de identidad, arquitectura de marca, desarrollo de naming, diseño de identidad visual y construcción del mensaje de marca, para que tu marca comunique con claridad, coherencia y fuerza en todos los canales.',
      },
    ],
    extra: null,
  },

  {
    slug: 'relaciones-publicas',
    name: 'Relaciones Públicas',
    badge: null,
    metaTitle: 'Relaciones Públicas — Servicios | Continental Media',
    metaDescription:
      'Estrategia de relaciones públicas, logística de eventos, patrocinios y convocatoria de medios: soluciones de Relaciones Públicas de Continental Media.',
    intro: null,
    subservices: [
      {
        name: 'Estrategia de Relaciones Públicas',
        description:
          'Diseñamos acciones orientadas a fortalecer la reputación de marca, construir vínculos con públicos clave y posicionar mensajes prioritarios ante medios, líderes de opinión e instituciones, tanto en medios tradicionales como en el ecosistema digital.',
        extra: {
          label:
            'Conoce nuestra plataforma aliada para gestión de relaciones públicas y monitoreo de medios:',
          ctaText: 'Publifix Suite',
          ctaHref: PUBLIFIX_URL,
        },
      },
      {
        name: 'Logística de Eventos',
        description:
          'Diseñamos y coordinamos eventos corporativos, deportivos, de lanzamiento de productos y activaciones de marca: concepto creativo, producción, logística, protocolo y cobertura mediática.',
      },
      {
        name: 'Patrocinios',
        description:
          'Identificamos y estructuramos oportunidades de patrocinio, diseñando acuerdos que fortalecen el posicionamiento de marca y amplían el alcance ante nuevas audiencias.',
      },
      {
        name: 'Convocatoria de Medios',
        description:
          'Gestionamos la participación de medios en eventos, ruedas de prensa y activaciones, con difusión estratégica, materiales de prensa profesionales y presencia en la agenda mediática clave.',
      },
    ],
    extra: null,
  },

  {
    slug: 'produccion',
    name: 'Producción',
    badge: null,
    metaTitle: 'Producción — Servicios | Continental Media',
    metaDescription:
      'Diseño gráfico, producción audiovisual, animaciones con IA y print: soluciones de Producción de Continental Media.',
    intro: null,
    subservices: [
      {
        name: 'Diseño Gráfico',
        description:
          'Logotipos, sistemas de identidad visual completos, papelería corporativa y materiales publicitarios digitales y físicos, desde la conceptualización hasta archivos listos para producción.',
      },
      {
        name: 'Producción Audiovisual',
        description:
          'Contenido para todos los formatos: reels, videos institucionales, videos de marca y storytelling, cápsulas de producto y fotografía profesional de alto impacto.',
      },
      {
        name: 'Animaciones con IA',
        description:
          'Piezas animadas y motion graphics con apoyo de IA generativa, reduciendo tiempos y costos sin sacrificar calidad: infografías animadas, explainers y contenido dinámico para campañas.',
      },
      {
        name: 'Print (Materiales Impresos)',
        description:
          'Folletos, catálogos, cartas de menú, señalética, banners, stands y material POP, con calidad gráfica y coherencia visual con la identidad de marca.',
      },
    ],
    extra: null,
  },
];
